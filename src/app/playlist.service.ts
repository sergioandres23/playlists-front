// src/app/playlist.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';


export interface SongDTO {
  title: string;
  artist: string;
  album?: string;
  year?: number;
  genre?: string;
}

export interface PlaylistDTO {
  name: string;
  description?: string;
  songs?: SongDTO[];
}

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  private apiUrl = `${environment.apiUrl}/lists`;

  constructor(private http: HttpClient) { }

  // Método para obtener todas las playlists (no requiere autenticación)
  getAllPlaylists(): Observable<PlaylistDTO[]> {
    return this.http.get<PlaylistDTO[]>(this.apiUrl);
  }


  createPlaylist(playlist: PlaylistDTO): Observable<PlaylistDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // Codifica en Base64 "admin:admin123" para Basic Auth
      'Authorization': 'Basic ' + btoa('admin:admin123')
    });
    return this.http.post<PlaylistDTO>(this.apiUrl, playlist, { headers });
  }

  // Opcional: para el endpoint de borrado (requiere rol ADMIN)
  deletePlaylist(name: string): Observable<void> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa('admin:admin123')
    });
    return this.http.delete<void>(`${this.apiUrl}/${name}`, { headers });
  }
}