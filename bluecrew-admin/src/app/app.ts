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
        <header class="d-md-none p-3 bg-secondary shadow-sm d-flex justify-content-between align-items-center">
          <img src="/admin/assets/img/bluecrew-logo-complete-white.svg" alt="BlueCrew" style="height: 32px;">
          <button class="btn btn-link text-white p-0 border-0" (click)="toggleSidebar()" aria-label="Abrir menú">
            <i class="bi bi-list fs-3"></i>
          </button>
        </header>

        <main class="page-content">
          <router-outlet></router-outlet>
        </main>
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
