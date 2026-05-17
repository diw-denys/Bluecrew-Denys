import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-eventos',
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
        <h2 class="fw-bold text-primary mb-1">Gestión de Eventos</h2>
        <p class="text-secondary mb-0">Modera y administra todos los eventos públicos de la comunidad.</p>
      </div>
    </header>

    <div>
      <div class="table-responsive rounded-3">
        <table class="table table-striped table-hover admin-table">
          <thead>
            <tr>
              <th><i class="bi bi-calendar-event me-2"></i>Evento</th>
              <th><i class="bi bi-clock me-2"></i>Fechas</th>
              <th><i class="bi bi-geo-alt me-2"></i>Ubicación y Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let e of eventos">
              <td>
                <div class="fw-bold text-dark">{{e.titulo}}</div>
                <small class="text-secondary">{{e.descripcion | slice:0:50}}...</small>
              </td>
              <td>
                <div class="small"><b>Inicio:</b> {{e.fechaInicio | date:'medium'}}</div>
                <div class="small"><b>Fin:</b> {{e.fechaFin | date:'medium'}}</div>
              </td>
              <td>
                <div class="mb-1"><i class="bi bi-pin-map-fill text-danger me-1"></i>{{e.ubicacion}}</div>
                <div class="d-flex gap-2 mt-2">
                  <span class="badge fw-semibold" [ngClass]="{'bg-warning text-secondary': e.finalizado, 'bg-primary text-tertiary ': !e.finalizado}">
                    {{e.finalizado ? 'Finalizado' : 'En curso / Próximo'}}
                  </span>
                  <span class="badge fw-semibold" [ngClass]="{'bg-secondary-subtle text-tertiary': e.estadoEvento === 'PENDIENTE', 'bg-success text-secondary': e.estadoEvento !== 'PENDIENTE'}">
                    {{e.estadoEvento | titlecase}}
                  </span>
                </div>
              </td>
              <td>
                <ng-container *ngIf="e.estadoEvento === 'PENDIENTE'">
                  <button class="btn btn-sm btn-success text-secondary rounded-2 px-3 shadow-sm me-2" (click)="aprobarEvento(e)" aria-label="Aprobar evento">
                    <i class="bi bi-check-circle-fill me-1" aria-hidden="true"></i>Aprobar
                  </button>
                </ng-container>
                <button class="btn btn-sm btn-danger text-white shadow-sm rounded-2" (click)="confirmarBorrado(e.idEvento)" aria-label="Borrar evento permanentemente">
                  <i class="bi bi-trash3-fill me-1" aria-hidden="true"></i>Borrar
                </button>
              </td>
            </tr>
            <tr *ngIf="eventos.length === 0">
              <td colspan="4" class="text-center py-4 text-muted">No se encontraron eventos.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class EventosComponent implements OnInit {
  eventos: any[] = [];
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.loadEventos();
  }

  loadEventos() {
    this.api.getEventos().subscribe({
      next: (data) => this.eventos = data,
      error: (err) => console.error(err)
    });
  }

  confirmarBorrado(id: number) {
    if (confirm('ATENCIÓN: ¿Estás SEGURO de que deseas borrar este evento? Esta acción es irreversible y borrará las inscripciones relacionadas.')) {
      this.deleteEvent(id);
    }
  }

  aprobarEvento(evento: any) {
    this.successMessage = '';
    this.errorMessage = '';
    const payload = { estadoEvento: 'APROBADO' };
    this.api.updateEvento(evento.idEvento, payload).subscribe({
      next: () => {
        this.successMessage = `El evento "${evento.titulo}" ha sido aprobado.`;
        evento.estadoEvento = 'APROBADO';
      },
      error: (err) => {
        this.errorMessage = 'No se pudo aprobar el evento: ' + (err.error?.error || err.message);
      }
    });
  }

  deleteEvent(id: number) {
    const backupEventos = [...this.eventos];
    this.eventos = this.eventos.filter(e => e.idEvento !== id);

    this.api.deleteEvento(id).subscribe({
      next: () => {
        this.successMessage = 'El evento ha sido borrado.';
      },
      error: (err) => {
        this.eventos = backupEventos;
        this.errorMessage = 'No se puede borrar: ' + err.message;
      }
    });
  }
}
