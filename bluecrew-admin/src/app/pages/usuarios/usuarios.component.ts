import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-usuarios',
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
        <h2 class="fw-bold text-primary mb-1">Usuarios</h2>
        <p class="text-secondary mb-0">Gestión de todos los usuarios registrados.</p>
      </div>
    </header>

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
              <td><span class="badge rounded-pill px-3" [ngClass]="u.rol === 'ADMIN' ? 'bg-secondary' : 'bg-primary'">{{u.rol === 'ADMIN' ? 'Administrador' : 'Usuario'}}</span></td>
              <td>
                <button class="btn btn-sm btn-danger text-white shadow-sm rounded-2 me-2" (click)="confirmarBorrado(u.id)" aria-label="Eliminar usuario">
                  <i class="bi bi-trash-fill me-1" aria-hidden="true"></i>Borrar
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
  successMessage: string = '';
  errorMessage: string = '';

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

  confirmarBorrado(id: number) {
    if (confirm('ATENCIÓN: ¿Seguro que deseas eliminar este usuario permanentemente? Esta acción es irreversible.')) {
      this.deleteUser(id);
    }
  }

  deleteUser(id: number) {
    const backupUsuarios = [...this.usuarios];
    this.usuarios = this.usuarios.filter(u => u.id !== id);

    this.api.deleteUsuario(id).subscribe({
      next: () => {
        this.successMessage = 'El usuario fue eliminado correctamente.';
      },
      error: (err) => {
        this.usuarios = backupUsuarios;
        this.errorMessage = 'No se pudo borrar: ' + err.message;
      }
    });
  }
}
