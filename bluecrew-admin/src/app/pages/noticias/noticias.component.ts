import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-noticias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./noticias.component.scss'],
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

    <div *ngIf="!showForm" class="d-flex justify-content-between align-items-center mb-4">
      <header>
        <h2 class="fw-bold text-primary mb-1">Centro de Noticias</h2>
        <p class="text-secondary mb-0">Comunica las últimas novedades a toda la plataforma.</p>
      </header>
      <button class="btn btn-tertiary rounded-2 shadow px-4" (click)="openForm()" aria-label="Redactar nueva noticia">
        <i class="bi bi-pencil-square me-2" aria-hidden="true"></i>Redactar Noticia
      </button>
    </div>

    <!-- Lista de Noticias Grid -->
    <div *ngIf="!showForm" class="row g-4 mt-2">
      <div class="col-md-4" *ngFor="let n of noticias">
        <article class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
          <img [src]="n.imagen ? '/uploads/' + n.imagen : '/admin/assets/img/hero/hero-bg.webp'"
               class="card-img-top object-fit-cover" style="height: 180px;" [alt]="'Imagen de portada: ' + n.titulo">
          <div class="card-body d-flex flex-column">
             <div class="d-flex justify-content-between mb-2">
               <span class="badge" [ngClass]="n.estadoVisibilidad ? 'bg-secondary' : 'bg-secondary'">{{n.estadoVisibilidad ? 'Público' : 'Borrador'}}</span>
               <small class="text-muted"><i class="bi bi-calendar me-1"></i>{{n.fechaCreacion | date:'shortDate'}}</small>
             </div>
             <h5 class="card-title fw-bold text-dark mb-2">{{n.titulo}}</h5>
             <p class="card-text text-secondary lh-sm small">{{n.descripcion | slice:0:100}}...</p>
             
              <div class="mt-auto d-flex justify-content-between border-top pt-3">
                <div>
                  <button class="btn btn-sm btn-outline-tertiary rounded-2 px-3 me-2" (click)="openForm(n)" aria-label="Editar noticia">
                    <i class="bi bi-pencil me-1" aria-hidden="true"></i>Editar
                  </button>
                </div>
                <button class="btn btn-sm btn-outline-danger rounded-2 px-3" (click)="confirmarBorrado(n.idNoticia)" aria-label="Borrar noticia">
                  <i class="bi bi-trash-fill me-1" aria-hidden="true"></i>Borrar
                </button>
              </div>
          </div>
        </article>
      </div>
      <div *ngIf="noticias.length === 0" class="col-12 text-center p-5 text-secondary">
        <i class="bi bi-newspaper fs-1 mb-3 d-block opacity-50"></i>
        No tienes ninguna noticia redactada.
      </div>
    </div>

    <!-- Formulario de Creación/Edición -->
    <div *ngIf="showForm" class="d-flex align-items-center justify-content-center" style="min-height: calc(100vh - 150px);">
      <div class="card fade-in shadow-lg bg-white border-0 rounded-4 p-4 p-md-5 w-100" style="max-width: 1000px;">
      <div class="d-flex justify-content-between border-bottom pb-3 mb-4">
        <h3 class="fw-bold text-tertiary mb-0">{{ editMode ? 'Editar Noticia' : 'Nueva Noticia' }}</h3>
        <button class="btn-close" (click)="closeForm()"></button>
      </div>

      <form #noticiaForm="ngForm" class="needs-validation" (ngSubmit)="saveNoticia(noticiaForm)" enctype="multipart/form-data" novalidate>
        <div class="mb-3">
           <label for="titulo" class="form-label fw-bold text-tertiary">Titular: <span class="text-danger">*</span></label>
           <input type="text" id="titulo" class="form-control" name="titulo" [(ngModel)]="formData.titulo" required #titulo="ngModel" [ngClass]="{'is-invalid': titulo.invalid && (titulo.dirty || titulo.touched)}">
           <div class="invalid-feedback">Por favor, ingresa un titular para la noticia.</div>
        </div>

        <div class="mb-3">
           <label for="categoriaId" class="form-label fw-bold text-tertiary">Categoría: <span class="text-danger">*</span></label>
           <select id="categoriaId" class="form-select" name="categoriaId" [(ngModel)]="formData.categoriaId" required #categoriaId="ngModel" [ngClass]="{'is-invalid': categoriaId.invalid && (categoriaId.dirty || categoriaId.touched)}">
             <option value="" disabled>Selecciona una categoría...</option>
             <option *ngFor="let c of categorias" [value]="c.idCategoria">{{c.nombre || c.nombreCategoria}}</option>
           </select>
           <div class="invalid-feedback">Selecciona una categoría para la noticia.</div>
        </div>

        <div class="mb-3">
           <label for="imagen" class="form-label fw-bold text-tertiary">Imagen Portada: <span class="text-danger" *ngIf="!editMode">*</span></label>
           <input type="file" id="imagen" class="form-control" name="imagen" accept="image/*" (change)="onFileSelected($event)" [required]="!editMode">
           <div class="invalid-feedback">Sube una imagen representativa.</div>
           <small class="text-muted d-block mt-1">Formato admitido: JPG, PNG, WEBP (Max 2MB).</small>
        </div>

        <div class="mb-3">
           <label for="descripcion" class="form-label fw-bold text-tertiary">Cuerpo de la noticia: <span class="text-danger">*</span></label>
           <textarea id="descripcion" class="form-control" rows="6" name="descripcion" [(ngModel)]="formData.descripcion" required #descripcion="ngModel" [ngClass]="{'is-invalid': descripcion.invalid && (descripcion.dirty || descripcion.touched)}"></textarea>
           <div class="invalid-feedback">El cuerpo de la noticia es obligatorio.</div>
        </div>

        <div class="row">
          <div class="col-md-12 mb-4 d-flex align-items-center">
             <div class="form-check form-switch fs-5">
               <input class="form-check-input text-tertiary" type="checkbox" role="switch" id="visibilidadSwitch" name="estadoVisibilidad" [(ngModel)]="formData.estadoVisibilidad">
               <label class="form-check-label fw-semibold text-tertiary ms-2" for="visibilidadSwitch">
                 {{ formData.estadoVisibilidad ? 'Publicado y Visible' : 'Guardar como Borrador' }}
               </label>
             </div>
          </div>
        </div>

        <div class="d-flex gap-3 mt-2">
           <button type="button" class="btn btn-outline-danger w-50 py-2 rounded-3 fw-bold" (click)="closeForm()" [disabled]="guardando">Cancelar</button>
           <button type="submit" class="btn btn-tertiary text-white w-50 py-2 rounded-3 shadow-sm fw-bold" [disabled]="guardando">
             <span *ngIf="guardando" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
             <i class="bi" [ngClass]="editMode ? 'bi-save-fill' : 'bi-send-fill'" *ngIf="!guardando"></i>
             {{ guardando ? 'Guardando...' : (editMode ? 'Guardar Cambios' : 'Publicar') }}
           </button>
        </div>
      </form>
    </div>
  </div>
  `
})
export class NoticiasComponent implements OnInit {
  noticias: any[] = [];
  categorias: any[] = [];
  showForm = false;
  editMode = false;

  formData: any = {};
  selectedImage: File | null = null;

  successMessage: string = '';
  errorMessage: string = '';
  guardando = false;

  // ID del administrador activo (Pepe)
  readonly ADMIN_ID = 1;

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.loadNoticias();
    this.loadCategorias();
  }

  loadNoticias() {
    this.api.getNoticias().subscribe({
      next: (data) => this.noticias = data,
      error: (err) => console.error(err)
    });
  }

  loadCategorias() {
    this.api.getCategorias().subscribe({
      next: (data) => this.categorias = data,
      error: (err) => console.error('Error cargando categorías', err)
    });
  }

  openForm(noticia?: any) {
    this.successMessage = '';
    this.errorMessage = '';
    if (noticia) {
      this.editMode = true;
      this.formData = {
        ...noticia,
        categoriaId: noticia.categoria?.idCategoria || ''
      };
    } else {
      this.editMode = false;
      this.formData = {
        titulo: '',
        descripcion: '',
        estadoVisibilidad: true,
        categoriaId: ''
      };
    }
    this.selectedImage = null;
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.errorMessage = '';
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedImage = event.target.files[0];
    }
  }

  saveNoticia(form: any) {
    if (form.invalid) {
      this.errorMessage = 'Por favor, completa todos los campos requeridos correctamente.';
      Object.keys(form.controls).forEach(key => form.controls[key].markAsTouched());
      return;
    }

    this.guardando = true;
    try {
      if (this.selectedImage) {
        this.api.uploadImage(this.selectedImage).subscribe({
          next: (res: any) => {
            try {
              this.executeSaveNoticia(res.filename);
            } catch (innerErr: any) {
              console.error(innerErr);
              this.errorMessage = 'Error de ejecución: ' + innerErr.message;
              this.guardando = false;
            }
          },
          error: (err) => {
            this.errorMessage = 'Error al subir la imagen: ' + (err.error?.error || err.message);
            this.guardando = false;
          }
        });
      } else {
        this.executeSaveNoticia(this.formData.imagen || 'placeholder.jpg');
      }
    } catch (err: any) {
      console.error(err);
      this.errorMessage = 'Ocurrió un error inesperado: ' + err.message;
      this.guardando = false;
    }
  }

  private executeSaveNoticia(imageFilename: string) {
    try {
      const noticiaPayload: any = {
        ...(this.editMode && { idNoticia: this.formData.idNoticia }),
        titulo: this.formData.titulo,
        descripcion: this.formData.descripcion,
        estadoAprobacionNoticia: 'APROBADO',
        estadoVisibilidad: this.formData.estadoVisibilidad,
        imagen: imageFilename,
        autor: { id: this.ADMIN_ID },
        categoria: { idCategoria: Number(this.formData.categoriaId) }
      };

      if (this.editMode) {
        this.api.updateNoticia(noticiaPayload).subscribe({
          next: () => {
            this.successMessage = 'Noticia actualizada con éxito.';
            this.selectedImage = null;
            this.guardando = false;
            this.closeForm();
            this.loadNoticias();
          },
          error: (err) => {
            this.errorMessage = 'Fallo al actualizar: ' + (err.error?.error || err.message);
            this.guardando = false;
          }
        });
      } else {
        this.api.createNoticia(noticiaPayload).subscribe({
          next: () => {
            this.successMessage = 'Noticia publicada con éxito.';
            this.selectedImage = null;
            this.guardando = false;
            this.closeForm();
            this.loadNoticias();
          },
          error: (err) => {
            this.errorMessage = 'Fallo al publicar: ' + (err.error?.error || err.message);
            this.guardando = false;
          }
        });
      }
    } catch (err: any) {
      console.error(err);
      this.errorMessage = 'Error al preparar la noticia: ' + err.message;
      this.guardando = false;
    }
  }

  confirmarBorrado(id: number) {
    if (confirm('ATENCIÓN: ¿Estás seguro de que deseas eliminar esta noticia de forma permanente? Esta acción no se puede deshacer.')) {
      this.deleteNoticia(id);
    }
  }

  deleteNoticia(id: number) {
    const backupNoticias = [...this.noticias];
    this.noticias = this.noticias.filter(n => n.idNoticia !== id);

    this.api.deleteNoticia(id).subscribe({
      next: () => {
        this.successMessage = 'La noticia fue eliminada correctamente.';
      },
      error: (err) => {
        this.noticias = backupNoticias;
        this.errorMessage = 'Fallo al eliminar: ' + err.message;
      }
    });
  }
}
