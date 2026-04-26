import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="fw-bold text-primary mb-1">Gestión de Eventos</h2>
        <p class="text-secondary mb-0">Modera y administra todos los eventos públicos de la comunidad.</p>
      </div>
    </div>

    <div class="glass-panel p-4">
      <div class="table-responsive">
        <table class="table admin-table">
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
                  <span class="badge" [ngClass]="{'bg-success': !e.finalizado, 'bg-secondary': e.finalizado}">
                    {{e.finalizado ? 'FINALIZADO' : 'EN CURSO / PRÓXIMO'}}
                  </span>
                  <span class="badge bg-dark">{{e.estadoEvento}}</span>
                </div>
              </td>
              <td>
                <button class="btn btn-sm btn-danger shadow-sm rounded-2" (click)="deleteEvent(e.idEvento)" title="Borrar permanentemente">
                  <i class="bi bi-trash3-fill me-1"></i>Borrar
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

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadEventos();
  }

  loadEventos() {
    this.api.getEventos().subscribe({
      next: (data) => this.eventos = data,
      error: (err) => console.error(err)
    });
  }

  deleteEvent(id: number) {
    if(confirm('¿Estás SEGURO de que deseas borrar este evento? Esta acción es irreversible y borrará las inscripciones relacionadas.')) {
      this.api.deleteEvento(id).subscribe({
        next: () => {
          alert('Evento borrado.');
          this.loadEventos();
        },
        error: (err) => alert('No se puede borrar: ' + err.message)
      });
    }
  }
}
