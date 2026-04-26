import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div *ngIf="cargando" class="text-center p-5">
      <h4 class="text-secondary"><div class="spinner-border text-primary me-2" role="status"></div>Cargando tu perfil real...</h4>
    </div>

    <div *ngIf="!cargando && !modoEdicion" class="fade-in mb-4">
      <h1 class="fw-bold text-primary mb-1 text-center">Bienvenido de vuelta, {{userData?.nombre}}</h1>
    </div>

    <div *ngIf="!cargando">
      <div class="card shadow rounded-4 p-4 p-md-5 bg-white border-0 mb-5 col-9 mx-auto">
        <div class="row" *ngIf="!modoEdicion">
          <div class="col-md-4 d-flex flex-column align-items-center mb-4 mb-md-0">
            <img [src]="userData?.foto ? 'http://localhost:8080/uploads/' + userData.foto : '/assets/img/profile/profile-placeholder.webp'"
                 onerror="this.src='https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff'"
                 class="rounded-circle border border-3 border-white shadow-sm mb-4"
                 style="width: 160px; height: 160px; object-fit: cover;">
            
            <button class="btn btn-secondary text-white fw-bold rounded-3 shadow-sm px-4 py-2 mt-auto" (click)="modoEdicion = true">
              Modificar Datos Personales
            </button>
          </div>

          <div class="col-md-8 ps-md-4">
            <div class="d-flex flex-column gap-2 mb-4">
              <div class="d-flex align-items-baseline">
                <p class="text-secondary fw-semibold me-2 mb-0">Nombre:</p>
                <span>{{userData?.nombre}}</span>
              </div>
              <div class="d-flex align-items-baseline">
                <p class="text-secondary fw-semibold me-2 mb-0">Apellidos:</p>
                <span>{{userData?.apellido}}</span>
              </div>
              <div class="d-flex align-items-baseline">
                <p class="text-secondary fw-semibold me-2 mb-0">Localidad:</p>
                <span>{{userData?.localidad || 'Sin ubicación'}}</span>
              </div>
              <div class="d-flex align-items-baseline">
                <p class="text-secondary fw-semibold me-2 mb-0">Correo:</p>
                <span>{{userData?.email}}</span>
              </div>
            </div>

            <div class="border-top pt-4">
              <h5 class="mb-3 text-secondary fw-bold">Biografía</h5>
              <p class="lh-base mb-0">{{userData?.biografia || 'Sin biografía'}}</p>
            </div>
          </div>
        </div>

        <!-- MODO EDICIÓN DEL PERFIL ADMIN -->
        <div *ngIf="modoEdicion">
           <form class="needs-validation" (ngSubmit)="guardarCambios($event)">
             <h3 class="mb-4 text-primary">Editar Datos Personales</h3>
             
             <div class="row">
               <div class="col-md-6 mb-3">
                 <label class="form-label">Nombre:</label>
                 <input type="text" class="form-control" name="nombre" [(ngModel)]="formData.nombre" required>
               </div>
               <div class="col-md-6 mb-3">
                 <label class="form-label">Apellidos:</label>
                 <input type="text" class="form-control" name="apellido" [(ngModel)]="formData.apellido" required>
               </div>
             </div>

             <div class="row">
               <div class="col-md-6 mb-3">
                 <label class="form-label">Correo Electrónico:</label>
                 <input type="email" class="form-control" name="email" [(ngModel)]="formData.email" required>
               </div>
               <div class="col-md-6 mb-3">
                 <label class="form-label">Localidad / Ubicación:</label>
                 <input type="text" class="form-control" name="localidad" [(ngModel)]="formData.localidad">
               </div>
             </div>

             <div class="mb-3">
               <label class="form-label">Foto de Perfil:</label>
               <input type="file" class="form-control" accept="image/*" (change)="onFileSelected($event)">
             </div>

             <div class="mb-4">
               <label class="form-label">Biografía:</label>
               <textarea class="form-control" name="bio" rows="4" [(ngModel)]="formData.biografia"></textarea>
             </div>

             <div class="d-flex gap-3">
               <button type="button" class="btn btn-outline-secondary w-50" (click)="modoEdicion = false">Cancelar</button>
               <button type="submit" class="btn btn-primary text-white w-50" [disabled]="guardando">Guardar Cambios</button>
             </div>
           </form>
        </div>
      </div>

      <!-- ESTADÍSTICAS GLOBALES -->
      <h4 class="fw-bold text-dark pt-3 mb-4 col-9 mx-auto">Métricas Globales de Plataforma</h4>
      <div class="row g-4 mb-5 col-9 mx-auto">
        <div class="col-md-3">
          <div class="stat-card bg-white shadow-sm border-0 d-flex p-3 rounded-4 align-items-center gap-3">
            <div class="icon-box bg-primary text-white shadow rounded-3 d-flex align-items-center justify-content-center" style="width:50px;height:50px;font-size:1.5rem;">
              <i class="bi bi-people-fill"></i>
            </div>
            <div>
              <h6 class="text-secondary text-uppercase fw-bold mb-0" style="font-size:0.75rem;">Usuarios</h6>
              <h4 class="fw-bold text-dark mb-0">{{stats?.Usuarios || 0}}</h4>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card bg-white shadow-sm border-0 d-flex p-3 rounded-4 align-items-center gap-3">
            <div class="icon-box bg-secondary text-white shadow rounded-3 d-flex align-items-center justify-content-center" style="width:50px;height:50px;font-size:1.5rem;">
              <i class="bi bi-calendar-check-fill"></i>
            </div>
            <div>
              <h6 class="text-secondary text-uppercase fw-bold mb-0" style="font-size:0.75rem;">Eventos</h6>
              <h4 class="fw-bold text-dark mb-0">{{stats?.Eventos || 0}}</h4>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card bg-white shadow-sm border-0 d-flex p-3 rounded-4 align-items-center gap-3">
             <div class="icon-box text-white shadow rounded-3 d-flex align-items-center justify-content-center" style="background-color: hsl(214, 87%, 26%); width:50px;height:50px;font-size:1.5rem;">
              <i class="bi bi-building-fill"></i>
            </div>
            <div>
              <h6 class="text-secondary text-uppercase fw-bold mb-0" style="font-size:0.75rem;">ONGs</h6>
              <h4 class="fw-bold text-dark mb-0">{{stats?.ONGs || 0}}</h4>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card bg-white shadow-sm border-0 d-flex p-3 rounded-4 align-items-center gap-3">
            <div class="icon-box bg-danger text-white shadow rounded-3 d-flex align-items-center justify-content-center" style="width:50px;height:50px;font-size:1.5rem;">
              <i class="bi bi-envelope-exclamation-fill"></i>
            </div>
            <div>
              <h6 class="text-secondary text-uppercase fw-bold mb-0" style="font-size:0.75rem;">Mensajes</h6>
              <h4 class="fw-bold text-dark mb-0">{{stats?.Mensajes_Nuevos || 0}}</h4>
            </div>
          </div>
        </div>
      </div>

      <!-- CARDS INFERIORES GRID COMO EN REACT -->
      <div class="d-flex flex-row justify-content-around mt-4 flex-wrap gap-4 col-9 mx-auto">
        <div class="card shadow-sm rounded-4 border-0 p-3 bg-white" style="width: 16rem;">
          <h3 class="card-title h6 fw-bold text-dark mb-3 mt-2">Mis Eventos</h3>
          <div class="ratio ratio-4x3 mb-3 rounded-4 overflow-hidden shadow-sm">
            <img src="/assets/img/profile/cards/mios.jpg" alt="Mis eventos" class="object-fit-cover w-100 h-100">
          </div>
          <div class="mt-auto text-center">
            <a routerLink="/eventos" class="btn btn-primary text-light fw-bold w-100 rounded-3 py-2">Ver eventos</a>
          </div>
        </div>

        <div class="card shadow-sm rounded-4 border-0 p-3 bg-white" style="width: 16rem;">
          <h3 class="card-title h6 fw-bold text-dark mb-3 mt-2">Crear Evento</h3>
          <div class="ratio ratio-4x3 mb-3 rounded-4 overflow-hidden shadow-sm">
            <img src="/assets/img/hero/hero-image.webp" alt="Crear evento" class="object-fit-cover w-100 h-100">
          </div>
          <div class="mt-auto text-center">
             <button class="btn btn-primary text-light fw-bold w-100 rounded-3 py-2">Crear Evento</button>
          </div>
        </div>
        
        <div class="card shadow-sm rounded-4 border-0 p-3 bg-white" style="width: 16rem;">
          <h3 class="card-title h6 fw-bold text-dark mb-3 mt-2">Participaciones</h3>
          <div class="ratio ratio-4x3 mb-3 rounded-4 overflow-hidden shadow-sm">
            <img src="/assets/img/hero/hero-image.webp" alt="Participaciones" style="filter: grayscale(1);" class="object-fit-cover w-100 h-100">
          </div>
          <div class="mt-auto text-center">
            <button class="btn btn-primary text-light fw-bold w-100 rounded-3 py-2">Historial</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  stats: any = null;
  userData: any = null;
  cargando = true;
  modoEdicion = false;
  guardando = false;

  formData: any = {};
  selectedImage: File | null = null;

  // Asignamos el admin mock a la ID = 1 según lo dicho (Pepe)
  adminId = 1;

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.loadAdminData();
    this.loadStats();
  }

  loadAdminData() {
    this.api.getUsuarioById(this.adminId).subscribe({
      next: (data) => {
        this.userData = data;
        this.formData = { ...data };
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargando administrador. Quizá no existe el usuario ID 1?', err);
        this.cargando = false;
      }
    });
  }

  loadStats() {
    this.api.getEstadisticasAdmin().subscribe({
      next: (data) => this.stats = data,
      error: (err) => console.error('Error cargando estadísticas', err)
    });
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedImage = event.target.files[0];
    }
  }

  guardarCambios(e: Event) {
    e.preventDefault();
    this.guardando = true;
    this.api.updateUsuario(this.adminId, this.formData, this.selectedImage || undefined).subscribe({
      next: (resp) => {
        alert('Datos actualizados');
        this.modoEdicion = false;
        this.guardando = false;
        this.loadAdminData(); // re-fetch
      },
      error: (err) => {
        alert('Fallo al actualizar: ' + err.message);
        this.guardando = false;
      }
    });
  }
}
