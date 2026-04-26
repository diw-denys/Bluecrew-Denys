import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="fw-bold text-primary mb-1">Categorías</h2>
        <p class="text-secondary mb-0">Organización del catálogo de contenido.</p>
      </div>
    </div>

    <!-- Quick Form -->
    <div class="glass-panel p-4 mb-4">
      <h5 class="fw-bold text-dark mb-3"><i class="bi bi-plus-circle-fill text-accent me-2"></i>Añadir Nueva Categoría</h5>
      <form class="d-flex gap-3 align-items-end" (submit)="addCategory($event)">
        <div class="flex-grow-1">
          <label class="form-label text-secondary fw-semibold">Nombre de la categoría</label>
          <input type="text" class="form-control" placeholder="Ej: Limpieza de Playas" [(ngModel)]="newCategory.nombre" name="catName" required>
        </div>
        <div class="flex-grow-1">
          <label class="form-label text-secondary fw-semibold">Descripción (Opcional)</label>
          <input type="text" class="form-control" placeholder="Descripción breve" [(ngModel)]="newCategory.descripcion" name="catDesc">
        </div>
        <button type="submit" class="btn btn-primary px-4 shadow" [disabled]="!newCategory.nombre">Crear Categoría</button>
      </form>
    </div>

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
                <button class="btn btn-sm btn-danger shadow-sm rounded-2" (click)="deleteCategory(c.idCategoria)"><i class="bi bi-trash me-1"></i>Borrar</button>
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

  addCategory(event: Event) {
    event.preventDefault();
    this.api.createCategoria(this.newCategory).subscribe({
      next: () => {
        this.newCategory = { nombre: '', descripcion: '' };
        this.loadCategorias();
      },
      error: (err) => alert('No se pudo crear: ' + err.message)
    });
  }

  deleteCategory(id: number) {
    if(confirm('¿Eliminar esta categoría? Podría afectar a eventos asociados.')){
      this.api.deleteCategoria(id).subscribe({
        next: () => this.loadCategorias(),
        error: (err) => alert('Error. ¿Quizá hay eventos utilizando esta categoría?: ' + err.message)
      });
    }
  }
}
