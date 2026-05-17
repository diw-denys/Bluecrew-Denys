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
    <div *ngIf="cargando" class="text-center p-5" aria-live="polite">
      <h4 class="text-secondary"><div class="spinner-border text-primary me-2" role="status"><span class="visually-hidden">Cargando...</span></div>Cargando tu perfil real...</h4>
    </div>

    <!-- Alertas de Feedback -->
    <div *ngIf="successMessage" class="alert alert-success alert-dismissible fade show col-9 mx-auto mt-3" role="alert">
      <i class="bi bi-check-circle-fill me-2"></i>{{ successMessage }}
      <button type="button" class="btn-close" (click)="successMessage = ''" aria-label="Cerrar"></button>
    </div>
    <div *ngIf="errorMessage" class="alert alert-danger alert-dismissible fade show col-9 mx-auto mt-3" role="alert">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>{{ errorMessage }}
      <button type="button" class="btn-close" (click)="errorMessage = ''" aria-label="Cerrar"></button>
    </div>

    <header *ngIf="!cargando && !modoEdicion" class="fade-in mb-4 mt-2">
      <h1 class="fw-bold text-primary mb-1 text-center">Bienvenido de vuelta, {{userData?.nombre}}</h1>
    </header>

    <div *ngIf="!cargando">
      <div class="card shadow rounded-4 p-4 p-md-5 bg-white border-0 mb-5 col-9 mx-auto">
        <div class="row" *ngIf="!modoEdicion">
          <div class="col-md-4 d-flex flex-column align-items-center mb-4 mb-md-0">
            <img [src]="userData?.foto ? '/uploads/' + userData.foto + '?t=' + cacheBuster : '/admin/assets/img/profile/profile-placeholder.webp'"
                 onerror="this.src='https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff'"
                 class="rounded-circle border border-3 border-white shadow-sm mb-4"
                 style="width: 160px; height: 160px; object-fit: cover;"
                 [alt]="'Foto de perfil de ' + (userData?.nombre || 'Administrador')">
            
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
           <form #profileForm="ngForm" class="needs-validation" (ngSubmit)="guardarCambios(profileForm)" novalidate>
             <h3 class="mb-4 text-primary">Editar Datos Personales</h3>
             
             <div class="row">
               <div class="col-md-6 mb-3">
                 <label for="nombre" class="form-label">Nombre: <span class="text-danger">*</span></label>
                 <input type="text" id="nombre" class="form-control" name="nombre" [(ngModel)]="formData.nombre" required #nombre="ngModel" [ngClass]="{'is-invalid': nombre.invalid && (nombre.dirty || nombre.touched)}">
                 <div class="invalid-feedback">El nombre es obligatorio.</div>
               </div>
               <div class="col-md-6 mb-3">
                 <label for="apellido" class="form-label">Apellidos: <span class="text-danger">*</span></label>
                 <input type="text" id="apellido" class="form-control" name="apellido" [(ngModel)]="formData.apellido" required #apellido="ngModel" [ngClass]="{'is-invalid': apellido.invalid && (apellido.dirty || apellido.touched)}">
                 <div class="invalid-feedback">Los apellidos son obligatorios.</div>
               </div>
             </div>

             <div class="row">
               <div class="col-md-6 mb-3">
                 <label for="email" class="form-label">Correo Electrónico: <span class="text-danger">*</span></label>
                 <input type="email" id="email" class="form-control" name="email" [(ngModel)]="formData.email" required email #email="ngModel" [ngClass]="{'is-invalid': email.invalid && (email.dirty || email.touched)}">
                 <div class="invalid-feedback">Proporciona un correo electrónico válido.</div>
               </div>
               <div class="col-md-6 mb-3">
                 <label for="localidad" class="form-label">Localidad / Ubicación:</label>
                 <input type="text" id="localidad" class="form-control" name="localidad" [(ngModel)]="formData.localidad">
               </div>
             </div>

             <div class="mb-3">
               <label for="foto" class="form-label">Foto de Perfil:</label>
               <input type="file" id="foto" class="form-control" accept="image/*" (change)="onFileSelected($event)">
             </div>

             <div class="mb-4">
               <label for="bio" class="form-label">Biografía:</label>
               <textarea id="bio" class="form-control" name="bio" rows="4" [(ngModel)]="formData.biografia"></textarea>
             </div>

             <div class="d-flex gap-3">
               <button type="button" class="btn btn-outline-secondary w-50" (click)="cancelarEdicion()">Cancelar</button>
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
              <h4 class="fw-bold text-dark mb-0">{{stats?.ONGs_Aprobadas || 0}}</h4>
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
              <h4 class="fw-bold text-dark mb-0">{{stats?.Mensajes_Pendientes || 0}}</h4>
            </div>
          </div>
        </div>
      </div>

      <!-- CARDS INFERIORES GRID COMO EN REACT -->
      <div class="d-flex flex-row justify-content-around mt-4 flex-wrap gap-4 col-9 mx-auto">
        <div class="card shadow-sm rounded-4 border-0 p-3 bg-white" style="width: 16rem;">
          <h3 class="card-title h6 fw-bold text-dark mb-3 mt-2">Mis Eventos</h3>
          <div class="ratio ratio-4x3 mb-3 rounded-4 overflow-hidden shadow-sm">
            <img src="/admin/assets/img/cards/card-image-1.webp" alt="Acceso al listado de eventos" class="object-fit-cover w-100 h-100">
          </div>
          <div class="mt-auto text-center">
            <a routerLink="/eventos" class="btn btn-secondary text-white fw-bold w-100 rounded-3 py-2">Ver eventos</a>
          </div>
        </div>

        <div class="card shadow-sm rounded-4 border-0 p-3 bg-white" style="width: 16rem;">
          <h3 class="card-title h6 fw-bold text-dark mb-3 mt-2">Noticias</h3>
          <div class="ratio ratio-4x3 mb-3 rounded-4 overflow-hidden shadow-sm">
            <img src="/admin/assets/img/cards/card-image-2.webp" alt="Acceso al gestor de noticias" class="object-fit-cover w-100 h-100">
          </div>
          <div class="mt-auto text-center">
            <a routerLink="/noticias" class="btn btn-secondary text-white fw-bold w-100 rounded-3 py-2">Ver noticias</a>
          </div>
        </div>
        
        <div class="card shadow-sm rounded-4 border-0 p-3 bg-white" style="width: 16rem;">
          <h3 class="card-title h6 fw-bold text-dark mb-3 mt-2">ONGs y Organizaciones</h3>
          <div class="ratio ratio-4x3 mb-3 rounded-4 overflow-hidden shadow-sm">
            <img src="/admin/assets/img/cards/card-image-3.webp" alt="Acceso a la gestión de ONGs" style="filter: grayscale(0.3);" class="object-fit-cover w-100 h-100">
          </div>
          <div class="mt-auto text-center">
            <a routerLink="/ongs" class="btn btn-secondary text-white fw-bold w-100 rounded-3 py-2">Ver ONGs</a>
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
  successMessage: string = '';
  errorMessage: string = '';

  formData: any = {};
  selectedImage: File | null = null;
  adminId = 1;
  cacheBuster = Date.now();

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

  cancelarEdicion() {
    this.modoEdicion = false;
    this.errorMessage = '';
    this.successMessage = '';
  }

  guardarCambios(form: any) {
    if (form.invalid) {
      this.errorMessage = 'Por favor, completa los campos correctamente.';
      Object.keys(form.controls).forEach(key => form.controls[key].markAsTouched());
      return;
    }

    this.guardando = true;
    this.api.updateUsuario(this.adminId, this.formData, this.selectedImage || undefined).subscribe({
      next: (resp) => {
        this.successMessage = 'Tus datos personales se han actualizado correctamente.';
        this.modoEdicion = false;
        this.guardando = false;
        this.cacheBuster = Date.now();
        this.selectedImage = null;
        this.loadAdminData(); // re-fetch
      },
      error: (err) => {
        this.errorMessage = 'Fallo al actualizar: ' + err.message;
        this.guardando = false;
      }
    });
  }
}
