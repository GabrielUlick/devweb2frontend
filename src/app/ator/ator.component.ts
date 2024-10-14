import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TableComponent } from '../components/table/table.component';
import { NextPage, Paginated } from '../models/pagination';
import { Ator } from '../models/ator';
import { AtorService } from '../services/ator.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ator',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, TableComponent, CommonModule],
  templateUrl: './ator.component.html',
  styleUrl: './ator.component.css',
})
export class AtorComponent {
  atores!: Ator[];
  atorID?: string | null;
  openModal = false;
  openExcluirModal = false;
  formAtor: FormGroup<{
    nome: FormControl<string | null>;
  }>;
  columns = [{ key: 'nome', label: 'Nome' }];

  constructor(private atorService: AtorService) {
    this.formAtor = new FormGroup({
      nome: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ]),
    });

    this.listarAtores();
  }

  listarAtores() {
    this.atorService.listar().subscribe({
      next: (response) => {
        this.atores = response;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro ao listar atores:', err);
        alert('Erro ao listar atores');
      },
    });
  }

  salvarAtor() {
    const nome = this.formAtor.value.nome || '';
    if (this.atorID) {
      this.atorService.atualizar({ id: this.atorID, nome }).subscribe({
        next: () => {
          this.listarAtores();
          this.closeModal();
        },
        error: (err: HttpErrorResponse) => {
          alert(err.error.menssage);
        },
      });
    } else {
      this.atorService.cadastrar({ nome }).subscribe({
        next: () => {
          this.listarAtores();
          this.closeModal();
        },
        error: (err: HttpErrorResponse) => {
          alert(err.error.menssage);
        },
      });
    }
  }

  editarAtor(ator: Ator) {
    this.openModal = true;
    this.formAtor.patchValue({
      nome: ator.nome,
    });
    this.atorID = ator.id;
  }

  removerAtor(ator: Ator) {
    this.openExcluirModal = true;
    this.atorID = ator.id;
  }

  confirmarExclusao() {
    if (this.atorID) {
      this.atorService.remover(this.atorID).subscribe({
        next: () => {
          this.listarAtores();
          this.closeModal();
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 500) {
            alert('Ator não pode ser excluído pois está associado a um título');
          }
        },
      });
    }
  }

  abrirModalExcluir(ator: Ator) {
    this.openExcluirModal = true;
    this.atorID = ator.id;
  }

  closeModal(): void {
    this.openModal = false;
    this.openExcluirModal = false;
    this.atorID = null;
    this.formAtor.reset();
  }
}
