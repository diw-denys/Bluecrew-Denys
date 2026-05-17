import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <!-- Overlay for mobile -->
    <div class="sidebar-overlay d-md-none" *ngIf="isOpen" (click)="close.emit()"></div>

    <aside class="sidebar h-100" [class.show-sidebar]="isOpen">
      <div class="brand mb-4 d-flex justify-content-between align-items-center">
        <img src="/admin/assets/img/bluecrew-logo-complete-white.svg" alt="BlueCrew" style="height: 40px; margin-left: -10px;">
        <button class="btn btn-link text-white d-md-none p-0" (click)="close.emit()">
          <i class="bi bi-x-lg fs-4"></i>
        </button>
      </div>
      
      <nav class="nav flex-column gap-2 mt-2">
        <a class="nav-link" routerLink="/dashboard" routerLinkActive="active" (click)="close.emit()">
          <i class="bi bi-grid-1x2-fill"></i>
          <span>Dashboard</span>
        </a>
        <a class="nav-link" routerLink="/usuarios" routerLinkActive="active" (click)="close.emit()">
          <i class="bi bi-people-fill"></i>
          <span>Usuarios</span>
        </a>
        <a class="nav-link" routerLink="/ongs" routerLinkActive="active" (click)="close.emit()">
          <i class="bi bi-building-fill"></i>
          <span>ONGs / Orgs</span>
        </a>
        <a class="nav-link" routerLink="/mensajes" routerLinkActive="active" (click)="close.emit()">
          <i class="bi bi-envelope-paper-fill"></i>
          <span>Mensajes de Contacto</span>
        </a>
        <a class="nav-link" routerLink="/eventos" routerLinkActive="active" (click)="close.emit()">
          <i class="bi bi-calendar-event-fill"></i>
          <span>Eventos</span>
        </a>
        <a class="nav-link" routerLink="/noticias" routerLinkActive="active" (click)="close.emit()">
          <i class="bi bi-newspaper"></i>
          <span>Noticias</span>
        </a>
        <a class="nav-link" routerLink="/categorias" routerLinkActive="active" (click)="close.emit()">
          <i class="bi bi-tags-fill"></i>
          <span>Categorías</span>
        </a>
      </nav>
      
      <div class="mt-auto pt-3">

        <button (click)="logout()" class="btn btn-danger w-100 text-white rounded-3 shadow-sm py-2 d-flex align-items-center justify-content-center gap-2 fw-bold" style="background-color: hsl(0, 83%, 59%); border:none;">
          <i class="bi bi-box-arrow-left"></i>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  `
})
export class SidebarComponent {
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();

  logout() {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/login';
  }
}
