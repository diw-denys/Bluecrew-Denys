import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, CommonModule],
  template: `
    <div class="admin-layout">
      <!-- Pasamos el Signal como valor boolean y escuchamos el Output close -->
      <app-sidebar [isOpen]="sidebarOpen()" (close)="toggleSidebar()"></app-sidebar>
      
      <div class="main-content">
        <div class="topbar">
          <div class="d-flex w-100 justify-content-between align-items-center">
            
            <!-- Botón de Menú Hamburguesa para Móviles -->
            <button class="btn btn-light d-md-none rounded-circle shadow-sm" (click)="toggleSidebar()">
              <i class="bi bi-list fs-4"></i>
            </button>
            <div class="d-none d-md-block"></div> <!-- Espaciador en Desktop -->

            <div class="user-profile d-flex align-items-center gap-3">
              <div class="d-flex flex-column text-end">
                <span class="fw-bold text-dark lh-1">Administrador</span>
                <small class="text-secondary">admin&#64;bluecrew.org</small>
              </div>
              <img src="/assets/img/profile-admin.jpg" alt="Admin"
                   onerror="this.src='https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff'" 
                   class="rounded-circle shadow-sm border border-2 border-white" 
                   style="width: 45px; height: 45px; object-fit: cover;">
            </div>
          </div>
        </div>
        <div class="page-content">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `
})
export class App {
  title = 'bluecrew-admin';
  sidebarOpen = signal(false);

  toggleSidebar() {
    this.sidebarOpen.set(!this.sidebarOpen());
  }
}
