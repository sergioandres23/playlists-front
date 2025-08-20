// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { PlaylistService, PlaylistDTO, SongDTO } from './playlist.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent implements OnInit {
  title = 'playlists-front';
  playlists: PlaylistDTO[] = [];
  newPlaylist: PlaylistDTO = { name: '', description: '', songs: [] };
  newSong: SongDTO = { title: '', artist: '' };
  message: string = ''; // Para mostrar mensajes al usuario

  constructor(private playlistService: PlaylistService) { }

  ngOnInit(): void {
    this.getAllPlaylists();
  }

  getAllPlaylists(): void {
    this.playlistService.getAllPlaylists().subscribe({
      next: (data) => {
        this.playlists = data;
        this.message = 'Playlists cargadas exitosamente.';
      },
      error: (error) => {
        console.error('Error al obtener playlists:', error);
        this.message = `Error al cargar playlists: ${error.error?.message || error.message}`;
      }
    });
  }

  addSongToNewPlaylist(): void {
    if (this.newSong.title && this.newSong.artist) {
      if (!this.newPlaylist.songs) {
        this.newPlaylist.songs = [];
      }
      this.newPlaylist.songs.push({ ...this.newSong }); // Clonar el objeto para que no se modifique al resetear
      this.newSong = { title: '', artist: '' }; // Limpiar para la siguiente canción
    } else {
      this.message = 'El título y el artista de la canción son obligatorios.';
    }
  }

  createPlaylist(): void {
    if (!this.newPlaylist.name) {
      this.message = 'El nombre de la playlist es obligatorio.';
      return;
    }

    this.playlistService.createPlaylist(this.newPlaylist).subscribe({
      next: (createdPlaylist) => {
        this.message = `Playlist '${createdPlaylist.name}' creada exitosamente!`;
        this.newPlaylist = { name: '', description: '', songs: [] }; // Limpiar formulario
        this.newSong = { title: '', artist: '' }; // Limpiar formulario de canción
        this.getAllPlaylists(); // Recargar la lista de playlists
      },
      error: (error) => {
        console.error('Error al crear playlist:', error);
        this.message = `Error al crear playlist: ${error.error?.message || error.message}`;
      }
    });
  }

  deletePlaylist(name: string): void {
    if (confirm(`¿Estás seguro de que quieres eliminar la playlist '${name}'?`)) {
      this.playlistService.deletePlaylist(name).subscribe({
        next: () => {
          this.message = `Playlist '${name}' eliminada exitosamente.`;
          this.getAllPlaylists(); // Recargar la lista
        },
        error: (error) => {
          console.error('Error al eliminar playlist:', error);
          this.message = `Error al eliminar playlist: ${error.error?.message || error.message}`;
        }
      });
    }
  }
}