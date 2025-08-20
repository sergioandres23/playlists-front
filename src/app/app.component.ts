// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para *ngIf, *ngFor, etc.
import { FormsModule } from '@angular/forms';   // Para [(ngModel)]
import { PlaylistService, PlaylistDTO, SongDTO } from './playlist.service';

@Component({
  selector: 'app-root',
  standalone: true, // <-- Añadir esta líne
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CommonModule, FormsModule]
})
export class AppComponent implements OnInit {
  title = 'playlists-front';
  playlists: PlaylistDTO[] = [];
  newPlaylist: PlaylistDTO = { name: '', description: '', songs: [] };
  newSong: SongDTO = { title: '', artist: '', album: '', year: undefined, genre: '' };
  message: string = '';
  messageType: 'success' | 'error' | null = null; // Para controlar el estilo del mensaje

  // Propiedades para las nuevas acciones
  searchName: string = '';
  deleteName: string = '';
  searchedPlaylist: PlaylistDTO | null = null;

  constructor(private playlistService: PlaylistService) { }

  ngOnInit(): void {
    this.getAllPlaylists();
  }

  displayMessage(text: string, type: 'success' | 'error', duration: number = 5000): void {
    this.message = text;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
      this.messageType = null;
    }, duration);
  }

  getAllPlaylists(): void {
    this.playlistService.getAllPlaylists().subscribe({
      next: (data) => {
        this.playlists = data;
      },
      error: (error) => {
        console.error('Error al obtener playlists:', error);
        this.displayMessage('Error al cargar playlists: El servidor no responde o hay un problema de red.', 'error');
      }
    });
  }

  findPlaylist(): void {
    if (!this.searchName.trim()) {
      this.displayMessage('Por favor, introduce un nombre para buscar.', 'error');
      return;
    }
    this.searchedPlaylist = null;
    this.message = '';
    this.messageType = null;

    this.playlistService.getPlaylistByName(this.searchName).subscribe({
      next: (data) => {
        this.searchedPlaylist = data;
        this.displayMessage(`Playlist "${data.name}" encontrada.`, 'success');
        this.searchName = ''; // Limpiar input
      },
      error: (error) => {
        console.error('Error al buscar playlist:', error);
        this.displayMessage(`Error al buscar la playlist "${this.searchName}". Es posible que no exista o que haya un problema con el servidor.`, 'error');
      }
    });
  }

  addSongToNewPlaylist(): void {
    if (this.newSong.title && this.newSong.artist) {
      if (!this.newPlaylist.songs) {
        this.newPlaylist.songs = [];
      }
      this.newPlaylist.songs.push({ ...this.newSong }); // Clonar el objeto para que no se modifique al resetear
      this.newSong = { title: '', artist: '', album: '', year: undefined, genre: '' }; // Limpiar para la siguiente canción
    } else {
      this.displayMessage('El título y el artista de la canción son obligatorios.', 'error');
    }
  }

  createPlaylist(): void {
    if (!this.newPlaylist.name) {
      this.displayMessage('El nombre de la playlist es obligatorio.', 'error');
      return;
    }

    this.playlistService.createPlaylist(this.newPlaylist).subscribe({
      next: (createdPlaylist) => {
        this.displayMessage(`Playlist '${createdPlaylist.name}' creada exitosamente!`, 'success');
        this.newPlaylist = { name: '', description: '', songs: [] }; // Limpiar formulario
        this.newSong = { title: '', artist: '', album: '', year: undefined, genre: '' }; // Limpiar formulario de canción
        this.getAllPlaylists(); // Recargar la lista de playlists
      },
      error: (error) => {
        console.error('Error al crear playlist:', error);
        this.displayMessage(`Error al crear playlist: ${error.error?.message || error.message}`, 'error');
      }
    });
  }

  deletePlaylist(name: string): void {
    if (confirm(`¿Estás seguro de que quieres eliminar la playlist '${name}'?`)) {
      this.playlistService.deletePlaylist(name).subscribe({
        next: () => {
          this.displayMessage(`Playlist '${name}' eliminada exitosamente.`, 'success');
          this.getAllPlaylists(); // Recargar la lista
          if (this.searchedPlaylist?.name === name) {
            this.searchedPlaylist = null;
          }
        },
        error: (error) => {
          console.error('Error al eliminar playlist:', error);
          this.displayMessage(`Error al eliminar la playlist '${name}'. Es posible que no exista o que haya un problema con el servidor.`, 'error');
        }
      });
    }
  }

  deletePlaylistByName(): void {
    if (!this.deleteName.trim()) {
      this.displayMessage('Por favor, introduce un nombre para eliminar.', 'error');
      return;
    }
    this.deletePlaylist(this.deleteName);
    this.deleteName = ''; // Limpiar input
  }
}