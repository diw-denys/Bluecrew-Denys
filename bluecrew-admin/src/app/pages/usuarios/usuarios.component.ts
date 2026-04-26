import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="fw-bold text-primary mb-1">Usuarios</h2>
        <p class="text-secondary mb-0">Gestión de todos los usuarios registrados.</p>
      </div>
    </div>

    <div>
      <div class="table-responsive rounded-3">
        <table class="table table-striped table-hover admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let u of usuarios">
              <td>#{{u.id}}</td>
              <td>
                <div class="d-flex align-items-center gap-3">
                  <div class="bg-light rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                    <i class="bi bi-person text-secondary"></i>
                  </div>
                  <div>
                    <span class="d-block fw-bold">{{u.nombre}} {{u.apellido}}</span>
                    <small class="text-muted">{{u.localidad || 'Sin localidad'}}</small>
                  </div>
                </div>
              </td>
              <td class="text-secondary">{{u.email}}</td>
              <td><span class="badge bg-primary rounded-pill px-3">{{u.rol}}</span></td>
              <td>
                <button class="btn btn-sm btn-danger text-white shadow-sm rounded-2 me-2" (click)="deleteUser(u.id)" title="Eliminar">
                  <i class="bi bi-trash-fill me-1"></i>Borrar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div *ngIf="usuarios.length === 0" class="text-center py-5 text-secondary">
          <i class="bi bi-inbox-fill fs-1 mb-3 d-block text-muted"></i>
          No hay usuarios registrados.
        </div>
      </div>
    </div>
  `
})
export class UsuariosComponent implements OnInit {
  usuarios: any[] = [];

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.api.getUsuarios().subscribe({
      next: (data) => this.usuarios = data,
      error: (err) => console.error('Error', err)
    });
  }

  deleteUser(id: number) {
    if (confirm('¿Seguro que deseas eliminar este usuario permanentemente?')) {
      this.api.deleteUsuario(id).subscribe({
        next: () => this.loadUsers(),
        error: (err) => alert('No se pudo borrar: ' + err.message)
      });
    }
  }
}
