// src/app/playlist.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// DTOs (Data Transfer Objects) que coinciden con el backend
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
  private apiUrl = '/api/lists'; // URL base del proxy

  constructor(private http: HttpClient) { }

  getAllPlaylists(): Observable<PlaylistDTO[]> {
    return this.http.get<PlaylistDTO[]>(this.apiUrl);
  }

  getPlaylistByName(name: string): Observable<PlaylistDTO> {
    return this.http.get<PlaylistDTO>(`${this.apiUrl}/${name}`);
  }

  createPlaylist(playlist: PlaylistDTO): Observable<PlaylistDTO> {
    return this.http.post<PlaylistDTO>(this.apiUrl, playlist);
  }

  deletePlaylist(name: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${name}`);
  }
}