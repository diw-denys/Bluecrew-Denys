import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = '/api';

  constructor(private http: HttpClient) { }

  getEstadisticasAdmin(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/estadisticas`);
  }

  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/usuarios`);
  }

  getUsuarioById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/usuarios/${id}`);
  }

  deleteUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/usuarios/${id}`);
  }

  updateUsuario(id: number, usuario: any, imagen?: File): Observable<any> {
    const formData = new FormData();
    formData.append('usuario', new Blob([JSON.stringify(usuario)], { type: 'application/json' }));
    if(imagen) {
       formData.append('imagen', imagen);
    }
    return this.http.put(`${this.baseUrl}/usuarios/${id}`, formData);
  }

  getOrganizaciones(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/organizaciones`);
  }

  updateOrganizacion(id: number, org: any): Observable<any> {
    const formData = new FormData();
    formData.append('organizacion', new Blob([JSON.stringify(org)], { type: 'application/json' }));
    return this.http.put(`${this.baseUrl}/organizaciones/${id}`, formData);
  }

  deleteOrganizacion(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/organizaciones/${id}`);
  }

  getContactos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/contactos`);
  }

  updateContacto(id: number, contacto: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/contactos/${id}`, contacto);
  }

  getEventos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/eventos`);
  }

  deleteEvento(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/eventos/${id}`);
  }

  updateEvento(id: number, evento: any): Observable<any> {
    const formData = new FormData();
    formData.append('evento', new Blob([JSON.stringify(evento)], { type: 'application/json' }));
    return this.http.put(`${this.baseUrl}/eventos/${id}`, formData);
  }

  getNoticias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/noticias`);
  }
  
  createNoticia(noticia: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/noticias`, noticia);
  }

  updateNoticia(noticia: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/noticias`, noticia);
  }

  deleteNoticia(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/noticias/${id}`);
  }
  
  // ---- FIN NOTICIAS ----

  getCategorias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/categorias`);
  }

  createCategoria(categoria: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/categorias`, categoria);
  }

  updateCategoria(id: number, categoria: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/categorias/${id}`, categoria);
  }

  deleteCategoria(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/categorias/${id}`);
  }

  uploadImage(imagen: File): Observable<any> {
    const formData = new FormData();
    formData.append('imagen', imagen);
    return this.http.post(`${this.baseUrl}/upload`, formData);
  }
}
