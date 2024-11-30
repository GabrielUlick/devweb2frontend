import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Titulo } from '../models/titulo';
import { TituloService } from '../services/titulo.service';
import { Ator } from '../models/ator';
import { AtorService } from '../services/ator.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  titulos: Titulo[] = [];
  filtroNome: string = '';
  filtroCategoria: string = '';
  filtroAtor: string = '';
  tipoFiltro: string = '';
  atores: Ator[] = [];

  constructor(private tituloService: TituloService, private atorService: AtorService) {
    this.listarTitulos();
    this.preencherAtores();
  }

  listarTitulos() {
    this.tituloService.listar().subscribe((data) => {
      this.titulos = data;
    });
  }

  consultarPorNome() {
    if (this.filtroNome.trim()) {
      this.tituloService.consultarPorNome(this.filtroNome).subscribe((data) => {
        this.titulos = data;
        console.log(data);
      });
    }
  }

  consultarPorCategoria() {
    if (this.filtroCategoria.trim()) {
      this.tituloService.consultarPorCategoria(this.filtroCategoria).subscribe((data) => {
        this.titulos = data;
      });
    }
  }

  consultarPorAtor() {
    if (this.filtroAtor.trim()) {
      this.tituloService.consultarPorAtor(this.filtroAtor).subscribe((data) => {
        this.titulos = data;
      });
    }
  }

  preencherAtores() {
    this.atorService.listar().subscribe((data) => {
      this.atores = data;
    });
  }
}