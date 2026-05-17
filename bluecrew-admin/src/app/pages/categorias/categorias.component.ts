import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styles: [`
    .btn-outline-danger:hover {
      color: white !important;
    }
  `],
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

    <div class="d-flex justify-content-between align-items-center mb-4">
      <header>
        <h2 class="fw-bold text-primary mb-1">Categorías</h2>
        <p class="text-secondary mb-0">Organización del catálogo de contenido.</p>
      </header>
    </div>

    <!-- Quick Form -->
    <section class="glass-panel p-4 mb-4" aria-labelledby="form-heading">
      <h5 id="form-heading" class="fw-bold text-dark mb-3"><i class="bi bi-plus-circle-fill text-accent me-2" aria-hidden="true"></i>Añadir Nueva Categoría</h5>
      <form #catForm="ngForm" class="d-flex gap-3 align-items-start needs-validation" (ngSubmit)="addCategory(catForm)" novalidate>
        <div class="flex-grow-1">
          <label for="catName" class="form-label text-secondary fw-semibold">Nombre de la categoría <span class="text-danger">*</span></label>
          <input type="text" id="catName" class="form-control" placeholder="Ej: Limpieza de Playas" [(ngModel)]="newCategory.nombre" name="catName" required #catName="ngModel" [ngClass]="{'is-invalid': catName.invalid && (catName.dirty || catName.touched)}">
          <div class="invalid-feedback">El nombre de la categoría es obligatorio.</div>
        </div>
        <div class="flex-grow-1">
          <label for="catDesc" class="form-label text-secondary fw-semibold">Descripción (Opcional)</label>
          <input type="text" id="catDesc" class="form-control" placeholder="Descripción breve" [(ngModel)]="newCategory.descripcion" name="catDesc">
        </div>
        <button type="submit" class="btn btn-primary px-4 shadow mt-4" [disabled]="!newCategory.nombre" aria-label="Crear Categoría">Crear Categoría</button>
      </form>
    </section>

    <!-- Grid de tarjetas -->
    <div class="row g-4">
      <div class="col-md-4" *ngFor="let c of categorias">
        <div class="card h-100 border-0 shadow-sm" style="border-radius: 12px; transition: transform 0.2s;">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <h5 class="fw-bold text-dark">{{c.nombre}}</h5>
                <p class="text-secondary small mb-0">{{c.descripcion || 'Sin descripción detallada.'}}</p>
              </div>
              <div class="d-flex gap-2">
                <button class="btn btn-sm btn-outline-danger shadow-sm rounded-2" (click)="confirmarBorrado(c.idCategoria)" aria-label="Borrar categoría"><i class="bi bi-trash me-1" aria-hidden="true"></i>Borrar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div *ngIf="categorias.length === 0" class="text-center py-5 text-secondary">
      <i class="bi bi-tags fs-1"></i>
      <p class="mt-2">No hay categorías configuradas aún.</p>
    </div>
  `
})
export class CategoriasComponent implements OnInit {
  categorias: any[] = [];
  newCategory = { nombre: '', descripcion: '' };
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadCategorias();
  }

  loadCategorias() {
    this.api.getCategorias().subscribe({
      next: (data) => this.categorias = data,
      error: (err) => console.error(err)
    });
  }

  addCategory(form: any) {
    if (form.invalid) {
      this.errorMessage = 'Por favor completa los campos requeridos.';
      return;
    }

    this.api.createCategoria(this.newCategory).subscribe({
      next: () => {
        this.successMessage = 'Categoría creada con éxito.';
        this.newCategory = { nombre: '', descripcion: '' };
        form.resetForm();
        this.loadCategorias();
      },
      error: (err) => {
        this.errorMessage = 'No se pudo crear: ' + err.message;
      }
    });
  }

  confirmarBorrado(id: number) {
    if(confirm('ATENCIÓN: ¿Eliminar esta categoría permanentemente? Podría afectar a eventos asociados y desvincularlos.')){
      this.deleteCategory(id);
    }
  }

  deleteCategory(id: number) {
    this.api.deleteCategoria(id).subscribe({
      next: () => {
        this.successMessage = 'La categoría fue eliminada.';
        this.loadCategorias();
      },
      error: (err) => {
        this.errorMessage = 'Error al borrar. ¿Quizá hay eventos utilizando esta categoría?: ' + err.message;
      }
    });
  }
}
