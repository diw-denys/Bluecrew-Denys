import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-mensajes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="fw-bold text-primary mb-1">Buzón de Soporte</h2>
        <p class="text-secondary mb-0">Atiende los mensajes y proporciona ayuda a los usuarios.</p>
      </div>
    </div>

    <div class="row">
      <div class="col-md-4 h-90">
        <div class="glass-panel p-3 h-100" style="overflow-y: auto; max-height: calc(100vh - 200px);">
          <div class="list-group list-group-flush">
            <button *ngFor="let m of mensajes" class="list-group-item list-group-item-action py-3 border-bottom" [class.active]="selectedMessage?.id === m.id" (click)="selectedMessage = m">
              <div class="d-flex w-100 justify-content-between">
                <h6 class="mb-1 fw-bold">{{m.nombre}} {{m.apellidos}}</h6>
                <small [class.text-warning]="m.estado === 'NUEVO'">{{m.estado}}</small>
              </div>
              <p class="mb-1 text-truncate small" style="max-width: 250px;">{{m.mensaje}}</p>
              <small class="text-secondary">{{m.email}}</small>
            </button>
            <div *ngIf="mensajes.length === 0" class="text-center py-4 text-muted">
              <div><i class="bi bi-mailbox fs-1"></i></div>
              <small>Bandeja vacía</small>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-8">
        <div class="glass-panel p-4 d-flex flex-column" *ngIf="selectedMessage">
          <div class="d-flex justify-content-between border-bottom pb-3 mb-3">
            <div>
              <h4 class="fw-bold text-dark">{{selectedMessage.asunto || 'Sin Asunto'}}</h4>
              <span class="text-secondary">De: {{selectedMessage.nombre}} {{selectedMessage.apellidos}} ({{selectedMessage.email}})</span>
            </div>
            <span class="badge bg-primary" style="height: fit-content;">{{selectedMessage.fechaCreacion | date:'medium'}}</span>
          </div>

          <div class="bg-light p-3 rounded mb-4 shadow-sm" style="min-height: 150px;">
            <p style="white-space: pre-wrap;">{{selectedMessage.mensaje}}</p>
          </div>

          <h5 class="fw-bold text-primary">Responder</h5>
          
          <div *ngIf="selectedMessage.estado === 'RESPONDIDO'" class="alert alert-success">
            <i class="bi bi-check-circle-fill me-2"></i> Ya has respondido a este mensaje:
            <p class="mb-0 mt-2 text-dark">{{selectedMessage.respuesta}}</p>
          </div>
          
          <div *ngIf="selectedMessage.estado !== 'RESPONDIDO'" class="flex-grow-1 d-flex flex-column gap-3 justify-content-start">
            <textarea class="form-control" rows="2" [(ngModel)]="respuestaTexto" placeholder="Escribe aquí tu respuesta... Se enviará por correo." style="resize: none;"></textarea>
            <div class="text-end">
              <button class="btn btn-primary px-4 rounded-2 shadow" (click)="sendReply()" [disabled]="!respuestaTexto">
                <i class="bi bi-send-fill me-2"></i>Enviar Respuesta
              </button>
            </div>
          </div>

        </div>
        
        <div class="glass-panel py-5 d-flex align-items-center justify-content-center text-secondary" *ngIf="!selectedMessage">
          <div class="text-center">
            <i class="bi bi-envelope-paper fs-1 text-muted opacity-50"></i>
            <h5 class="mt-3">Selecciona un mensaje para visualizarlo.</h5>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MensajesComponent implements OnInit {
  mensajes: any[] = [];
  selectedMessage: any = null;
  respuestaTexto: string = '';

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.loadMensajes();
  }

  loadMensajes() {
    this.api.getContactos().subscribe({
      next: (data) => this.mensajes = data,
      error: (err) => console.error(err)
    });
  }

  sendReply() {
    const updated = {
      ...this.selectedMessage,
      estado: 'RESPONDIDO',
      respuesta: this.respuestaTexto
    };

    this.api.updateContacto(this.selectedMessage.id, updated).subscribe({
      next: () => {
        alert('Respuesta enviada y almacenada con éxito');
        this.selectedMessage.estado = 'RESPONDIDO';
        this.selectedMessage.respuesta = this.respuestaTexto;
        this.respuestaTexto = '';
        this.loadMensajes();
      },
      error: (err) => alert('No se puedo responder: ' + err.message)
    });
  }
}
