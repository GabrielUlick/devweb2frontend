import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TableComponent } from '../components/table/table.component';
import { Titulo } from '../models/titulo';
import { Item } from '../models/item';
import { ItemService } from '../services/item.service';
import { TituloService } from '../services/titulo.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, TableComponent, CommonModule],
  templateUrl: './item.component.html',
  styleUrl: './item.component.css',
})
export class ItemComponent {
  item!: Item[];
  titulo: Titulo[] = [];
  itemID?: string | null;
  openModal = false;
  openExcluirModal = false;
  formItem: FormGroup<{
    numSerie: FormControl<string | null>;
    dtAquisicao: FormControl<Date | null>;
    tipoItem: FormControl<string | null>;
    titulo: FormControl<string | null>;
  }>;
  columns = [
    { key: 'numSerie', label: 'Número de Série' },
    { key: 'dtAquisicao', label: 'Data de Aquisição' },
    { key: 'tipoItem', label: 'Tipo de Item' },
    { key: 'titulo', label: 'Título' },
  ];

  constructor(
    private itemService: ItemService,
    private tituloService: TituloService
  ) {
    this.formItem = new FormGroup({
      numSerie: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ]),
      dtAquisicao: new FormControl<Date | null>(null, [Validators.required]),
      tipoItem: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ]),
      titulo: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ]),
    });

    this.listarItens();
    this.preencherTitulos();
  }

  listarItens() {
    this.itemService.listar().subscribe({
      next: (response) => {
        this.item = response;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro ao listar itens:', err);
        alert('Erro ao listar itens');
      },
    });
  }

  preencherTitulos() {
    this.tituloService.listar().subscribe({
      next: (response) => {
        this.titulo = response;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro ao listar títulos:', err);
        alert('Erro ao listar títulos');
      },
    });
  }

  salvarItem() {
    const numSerie = this.formItem.value.numSerie || '';
    const dtAquisicao = this.formItem.value.dtAquisicao
      ? new Date(this.formItem.value.dtAquisicao)
      : new Date();
    const tipoItem = this.formItem.value.tipoItem || '';
    const titulo =
      this.titulo.find((a) => a.id === this.formItem.value.titulo) ||
      this.titulo[0];
    if (this.itemID) {
      this.itemService
        .atualizar({ id: this.itemID, numSerie, dtAquisicao, tipoItem, titulo })
        .subscribe({
          next: () => {
            this.listarItens();
            this.closeModal();
          },
          error: (err: HttpErrorResponse) => {
            this.closeModal();
          },
        });
    } else {
      this.itemService
        .cadastrar({ numSerie, dtAquisicao, tipoItem, titulo })
        .subscribe({
          next: () => {
            this.listarItens();
            this.closeModal();
          },
          error: (err: HttpErrorResponse) => {
            console.error('Erro ao cadastrar item:', err);
            alert('Erro ao cadastrar item');
          },
        });
    }
  }

  editarItem(item: Item) {
    this.openModal = true;
    this.formItem.patchValue({
      numSerie: item.numSerie,
      dtAquisicao: item.dtAquisicao,
      tipoItem: item.tipoItem,
      titulo: item.titulo.id,
    });
    this.itemID = item.id;
  }

  removerItem(item: Item) {
    this.openExcluirModal = true;
    this.itemID = item.id;
  }

  confirmarExclusao() {
    if (this.itemID) {
      this.itemService.remover(this.itemID).subscribe({
        next: () => {
          this.listarItens();
          this.closeModal();
        },
        error: (err: HttpErrorResponse) => {
          console.error('Erro ao remover item:', err);
          alert('Erro ao remover item');
        },
      });
    }
  }

  closeModal() {
    this.openModal = false;
    this.openExcluirModal = false;
    this.formItem.reset();
    this.itemID = null;
  }
}
