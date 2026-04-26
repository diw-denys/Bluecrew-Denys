import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-ongs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="fw-bold text-primary mb-1">Organizaciones y ONGs</h2>
        <p class="text-secondary mb-0">Gestión de aprobaciones y ONGs registradas</p>
      </div>
    </div>

    <!-- Pestañas simuladas de bootstrap -->
    <ul class="nav nav-pills mb-4 gap-2">
      <li class="nav-item">
        <button class="nav-link rounded-pill" [class.active]="tab === 'PENDIENTE'" (click)="tab='PENDIENTE'">Solicitudes Pendientes</button>
      </li>
      <li class="nav-item">
        <button class="nav-link rounded-pill" [class.active]="tab === 'APROBADO'" (click)="tab='APROBADO'">ONGs Activas</button>
      </li>
    </ul>

    <div>
      <div class="table-responsive rounded-3">
        <table class="table table-striped table-hover admin-table" *ngIf="filteredOngs().length > 0">
          <thead>
            <tr>
              <th>ONG</th>
              <th>Contacto</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let o of filteredOngs()">
              <td>
                <div class="fw-bold">{{o.nombreOrganizacion}}</div>
                <small class="text-muted"><a [href]="o.sitioWeb" target="_blank">{{o.sitioWeb}}</a></small>
              </td>
              <td>
                <div>{{o.email}}</div>
                <small class="text-muted"><i class="bi bi-telephone-fill me-1"></i>{{o.telefono}}</small>
              </td>
              <td>
                <span class="badge" 
                      [ngClass]="{'bg-warning text-dark': o.estadoAprobacion === 'PENDIENTE', 'bg-success': o.estadoAprobacion === 'APROBADO', 'bg-danger': o.estadoAprobacion === 'RECHAZADO'}">
                  {{o.estadoAprobacion}}
                </span>
              </td>
              <td>
                <ng-container *ngIf="tab === 'PENDIENTE'">
                  <button class="btn btn-sm btn-success rounded-2 px-3 shadow-sm me-2" (click)="updateStatus(o, 'APROBADO')">
                    <i class="bi bi-check-circle-fill me-1"></i> Aprobar
                  </button>
                  <button class="btn btn-sm btn-danger rounded-2 px-3 shadow-sm" (click)="updateStatus(o, 'RECHAZADO')">
                    <i class="bi bi-x-circle-fill me-1"></i> Rechazar
                  </button>
                </ng-container>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div *ngIf="filteredOngs().length === 0" class="text-center py-5 text-secondary">
          <i class="bi bi-file-earmark-break-fill fs-1 mb-3 d-block text-muted"></i>
          No hay registros para mostrar.
        </div>
      </div>
    </div>
  `
})
export class OngsComponent implements OnInit {
  ongs: any[] = [];
  tab: string = 'PENDIENTE';

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.loadOngs();
  }

  loadOngs() {
    this.api.getOrganizaciones().subscribe({
      next: (data) => this.ongs = data,
      error: (err) => console.error('Error', err)
    });
  }

  filteredOngs() {
    return this.ongs.filter(o => o.estadoAprobacion === this.tab);
  }

  updateStatus(ong: any, newStatus: string) {
    const updated = { ...ong, estadoAprobacion: newStatus };
    this.api.updateOrganizacion(ong.idOrganizacion, updated).subscribe({
      next: () => {
        alert('Estado cambiado a ' + newStatus);
        this.loadOngs();
      },
      error: (err) => alert('Error: ' + err.message)
    });
  }
}
