import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ator } from '../models/ator';
import { AtorService } from '../services/ator.service';
import { Item } from '../models/item';
import { ItemService } from '../services/item.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  item: Item[] = [];
  filtroNome: string = '';
  filtroCategoria: string = '';
  filtroAtor: string = '';
  tipoFiltro: string = '';
  atores: Ator[] = [];

  constructor(
    private itemService: ItemService,
    private atorService: AtorService,
    private router: Router
  ) {
    this.listarTitulos();
    this.preencherAtores();
  }

  listarTitulos() {
    this.itemService.listar().subscribe((data) => {
      this.item = data;
    });
  }

  consultarPorNome() {
    if (this.filtroNome.trim()) {
      this.itemService.consultarPorNome(this.filtroNome).subscribe((data) => {
        this.item = data;
        console.log(data);
      });
    }
  }

  consultarPorCategoria() {
    if (this.filtroCategoria.trim()) {
      this.itemService
        .consultarPorCategoria(this.filtroCategoria)
        .subscribe((data) => {
          this.item = data;
        });
    }
  }

  consultarPorAtor() {
    if (this.filtroAtor.trim()) {
      this.itemService.consultarPorAtor(this.filtroAtor).subscribe((data) => {
        this.item = data;
      });
    }
  }

  preencherAtores() {
    this.atorService.listar().subscribe((data) => {
      this.atores = data;
    });
  }

  verDisponibilidade(itemId: string) {
    this.router.navigate(['/home/locacao', itemId]);
  }
}