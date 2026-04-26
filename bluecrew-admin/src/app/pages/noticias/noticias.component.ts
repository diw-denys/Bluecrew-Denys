import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-noticias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="fw-bold text-primary mb-1">Centro de Noticias</h2>
        <p class="text-secondary mb-0">Comunica las últimas novedades a toda la plataforma.</p>
      </div>
      <button class="btn btn-primary rounded-pill shadow px-4" (click)="openForm()">
        <i class="bi bi-pencil-square me-2"></i>Redactar Noticia
      </button>
    </div>

    <!-- Lista de Noticias Grid -->
    <div *ngIf="!showForm" class="row g-4 mt-2">
      <div class="col-md-4" *ngFor="let n of noticias">
        <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
          <img [src]="n.imagen ? 'http://localhost:8080/uploads/' + n.imagen : '/assets/img/hero/hero-bg.webp'"
               class="card-img-top object-fit-cover" style="height: 180px;" alt="Noticia Pic">
          <div class="card-body d-flex flex-column">
             <div class="d-flex justify-content-between mb-2">
               <span class="badge" [ngClass]="n.estadoVisibilidad ? 'bg-success' : 'bg-secondary'">{{n.estadoVisibilidad ? 'PUBLICO' : 'BORRADOR'}}</span>
               <small class="text-muted"><i class="bi bi-calendar me-1"></i>{{n.fechaCreacion | date:'shortDate'}}</small>
             </div>
             <h5 class="card-title fw-bold text-dark mb-2">{{n.titulo}}</h5>
             <p class="card-text text-secondary lh-sm small">{{n.descripcion | slice:0:100}}...</p>
             
             <div class="mt-auto d-flex justify-content-between border-top pt-3">
               <div>
                 <button class="btn btn-sm btn-outline-primary rounded-pill px-3 me-2" (click)="openForm(n)">
                   <i class="bi bi-pencil me-1"></i>Editar
                 </button>
               </div>
               <button class="btn btn-sm btn-danger shadow-sm rounded-2" (click)="deleteNoticia(n.idNoticia)">
                 <i class="bi bi-trash-fill me-1"></i>Borrar
               </button>
             </div>
          </div>
        </div>
      </div>
      <div *ngIf="noticias.length === 0" class="col-12 text-center p-5 text-secondary">
        <i class="bi bi-newspaper fs-1 mb-3 d-block opacity-50"></i>
        No tienes ninguna noticia redactada.
      </div>
    </div>

    <!-- Formulario de Creación/Edición -->
    <div *ngIf="showForm" class="card fade-in shadow-lg border-0 rounded-4 p-4 p-md-5 mx-auto" style="max-width: 800px;">
      <div class="d-flex justify-content-between border-bottom pb-3 mb-4">
        <h3 class="fw-bold text-tertiary mb-0">{{ editMode ? 'Editar Noticia' : 'Nueva Noticia' }}</h3>
        <button class="btn-close" (click)="closeForm()"></button>
      </div>

      <form class="needs-validation" (ngSubmit)="saveNoticia($event)" enctype="multipart/form-data">
        <div class="mb-3">
           <label class="form-label fw-bold text-secondary">Titular:</label>
           <input type="text" class="form-control" name="titulo" [(ngModel)]="formData.titulo" required>
        </div>

        <div class="mb-3">
           <label class="form-label fw-bold text-secondary">Imagen Portada:</label>
           <input type="file" class="form-control" name="imagen" accept="image/*" (change)="onFileSelected($event)" [required]="!editMode">
        </div>

        <div class="mb-3">
           <label class="form-label fw-bold text-secondary">Cuerpo de la noticia:</label>
           <textarea class="form-control" rows="6" name="descripcion" [(ngModel)]="formData.descripcion" required></textarea>
        </div>

        <div class="row">
          <div class="col-md-12 mb-4 d-flex align-items-center">
             <div class="form-check form-switch fs-5">
               <input class="form-check-input" type="checkbox" role="switch" id="visibilidadSwitch" name="estadoVisibilidad" [(ngModel)]="formData.estadoVisibilidad">
               <label class="form-check-label fw-bold text-secondary ms-2" for="visibilidadSwitch">
                 {{ formData.estadoVisibilidad ? 'Publicado y Visible' : 'Guardar como Borrador' }}
               </label>
             </div>
          </div>
        </div>

        <div class="d-flex gap-3 mt-2">
           <button type="button" class="btn btn-outline-secondary w-50 py-2 rounded-3 fw-bold" (click)="closeForm()">Cancelar</button>
           <button type="submit" class="btn btn-primary text-white w-50 py-2 rounded-3 shadow-sm fw-bold">
             <i class="bi" [ngClass]="editMode ? 'bi-save-fill' : 'bi-send-fill'"></i> {{ editMode ? 'Guardar Cambios' : 'Publicar' }}
           </button>
        </div>
      </form>
    </div>
  `
})
export class NoticiasComponent implements OnInit {
  noticias: any[] = [];
  showForm = false;
  editMode = false;
  
  formData: any = {};
  selectedImage: File | null = null;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadNoticias();
  }

  loadNoticias() {
    this.api.getNoticias().subscribe({
      next: (data) => this.noticias = data,
      error: (err) => console.error(err)
    });
  }

  openForm(noticia?: any) {
    if (noticia) {
      this.editMode = true;
      this.formData = { ...noticia };
    } else {
      this.editMode = false;
      this.formData = { 
        titulo: '', 
        descripcion: '', 
        estadoVisibilidad: true 
      };
    }
    this.selectedImage = null;
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedImage = event.target.files[0];
    }
  }

  saveNoticia(e: Event) {
    e.preventDefault();
    
    // SpringBoot NoticiaController utiliza @RequestBody por ende espera JSON puro
    const noticiaPayload = {
       ...(this.editMode && { idNoticia: this.formData.idNoticia }),
       titulo: this.formData.titulo,
       descripcion: this.formData.descripcion,
       estadoAprobacionNoticia: 'APROBADO',
       estadoVisibilidad: this.formData.estadoVisibilidad,
       imagen: this.selectedImage ? this.selectedImage.name : (this.formData.imagen || 'placeholder.jpg')
    };

    if (this.editMode) {
      this.api.updateNoticia(noticiaPayload).subscribe({
        next: () => {
          alert('Noticia actualizada con éxito');
          this.closeForm();
          this.loadNoticias();
        },
        error: (err) => alert('Fallo al actualizar: ' + err.error?.error || err.message)
      });
    } else {
      this.api.createNoticia(noticiaPayload).subscribe({
        next: () => {
          alert('Noticia publicada');
          this.closeForm();
          this.loadNoticias();
        },
        error: (err) => alert('Fallo al publicar: ' + err.error?.error || err.message)
      });
    }
  }

  deleteNoticia(id: number) {
    if(confirm('¿Eliminar esta noticia permanentemente?')) {
      this.api.deleteNoticia(id).subscribe({
        next: () => this.loadNoticias(),
        error: (err) => alert('Fallo: ' + err.message)
      });
    }
  }
}
