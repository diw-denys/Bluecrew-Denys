import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-ongs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Alertas de Feedback -->
    <div *ngIf="successMessage" class="alert alert-success alert-dismissible fade show" role="alert">
      <i class="bi bi-check-circle-fill me-2"></i>{{ successMessage }}
      <button type="button" class="btn-close" (click)="successMessage = ''" aria-label="Cerrar"></button>
    </div>
    <div *ngIf="errorMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>{{ errorMessage }}
      <button type="button" class="btn-close" (click)="errorMessage = ''" aria-label="Cerrar"></button>
    </div>

    <header class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="fw-bold text-primary mb-1">Organizaciones y ONGs</h2>
        <p class="text-secondary mb-0">Gestión de aprobaciones y ONGs registradas</p>
      </div>
    </header>

    <!-- Pestañas simuladas de bootstrap -->
    <ul class="nav nav-pills mb-4 gap-2" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link rounded-pill" [class.active]="tab === 'PENDIENTE'" (click)="tab='PENDIENTE'" role="tab" [attr.aria-selected]="tab === 'PENDIENTE'">Solicitudes Pendientes</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link rounded-pill" [class.active]="tab === 'APROBADO'" (click)="tab='APROBADO'" role="tab" [attr.aria-selected]="tab === 'APROBADO'">ONGs Activas</button>
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
                <span class="badge fw-semibold" 
                      [ngClass]="{'bg-warning text-dark': o.estadoAprobacion === 'PENDIENTE', 'bg-success text-secondary': o.estadoAprobacion === 'APROBADO', 'bg-danger': o.estadoAprobacion === 'RECHAZADO'}">
                  {{o.estadoAprobacion | titlecase}}
                </span>
              </td>
              <td>
                <ng-container *ngIf="tab === 'PENDIENTE'">
                  <button class="btn btn-sm btn-success text-secondary rounded-2 px-3 shadow-sm me-2" (click)="updateStatus(o, 'APROBADO')" aria-label="Aprobar ONG">
                    <i class="bi bi-check-circle-fill me-1" aria-hidden="true"></i> Aprobar
                  </button>
                  <button class="btn btn-sm btn-danger text-white rounded-2 px-3 shadow-sm" (click)="updateStatus(o, 'RECHAZADO')" aria-label="Rechazar ONG">
                    <i class="bi bi-x-circle-fill me-1" aria-hidden="true"></i> Rechazar
                  </button>
                </ng-container>
                <ng-container *ngIf="tab === 'APROBADO'">
                  <button class="btn btn-sm btn-warning text-dark rounded-2 px-3 shadow-sm me-2" (click)="updateStatus(o, 'PENDIENTE')" aria-label="Marcar ONG como pendiente">
                    <i class="bi bi-arrow-return-left me-1" aria-hidden="true"></i> Desaprobar
                  </button>
                  <button class="btn btn-sm btn-danger text-white rounded-2 px-3 shadow-sm" (click)="confirmarBorrado(o.idOrganizacion)" aria-label="Eliminar ONG">
                    <i class="bi bi-trash-fill me-1" aria-hidden="true"></i> Eliminar
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
  successMessage: string = '';
  errorMessage: string = '';

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
    this.successMessage = '';
    this.errorMessage = '';
    const updated = { ...ong, estadoAprobacion: newStatus };

    // Actualización de la UI para que sea instantáneo
    const index = this.ongs.findIndex(o => o.idOrganizacion === ong.idOrganizacion);
    if (index !== -1) {
      this.ongs[index].estadoAprobacion = newStatus;
    }

    this.api.updateOrganizacion(ong.idOrganizacion, updated).subscribe({
      next: () => {
        this.successMessage = `Estado de ONG actualizado a ${newStatus}.`;
        this.loadOngs();
      },
      error: (err) => {
        this.errorMessage = 'Error: ' + err.message;
        this.loadOngs(); // Revertir en caso de error
      }
    });
  }

  confirmarBorrado(id: number) {
    if (confirm('ATENCIÓN: ¿Estás seguro de que deseas eliminar esta Organización permanentemente? Esta acción es irreversible.')) {
      this.deleteOng(id);
    }
  }

  deleteOng(id: number) {
    // Actualización con éxito
    this.ongs = this.ongs.filter(o => o.idOrganizacion !== id);

    this.api.deleteOrganizacion(id).subscribe({
      next: () => {
        this.successMessage = 'La Organización fue eliminada correctamente.';
        this.loadOngs();
      },
      error: (err) => {
        this.errorMessage = 'Error al borrar: ' + err.message;
        this.loadOngs();
      }
    });
  }
}
