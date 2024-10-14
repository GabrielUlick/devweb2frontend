import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableComponent } from '../components/table/table.component';
import { Diretor } from '../models/diretor';
import { DiretorService } from '../services/diretor.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-diretor',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, TableComponent, CommonModule],
  templateUrl: './diretor.component.html',
  styleUrl: './diretor.component.css'
})
export class DiretorComponent {
  diretor!: Diretor[];
  diretorID?: string | null;
  openModal = false;
  openExcluirModal = false;
  formDiretor: FormGroup<{
    nome: FormControl<string | null>;
  }>;
  columns = [{ key: 'nome', label: 'Nome' }];

  constructor(private diretorService: DiretorService) {
    this.formDiretor = new FormGroup({
      nome: new FormControl('', [
        Validators.required,
        Validators.maxLength(50)
      ])
    });

    this.listarDiretores();
  }

  listarDiretores() {
    this.diretorService.listar().subscribe({
      next: (response) => {
        this.diretor = response;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro ao listar diretores:', err);
        alert('Erro ao listar diretores');
      }
    });
  }

  salvarDiretor() {
    const nome = this.formDiretor.value.nome || '';
    if (this.diretorID) {
      this.diretorService.atualizar({ id: this.diretorID, nome }).subscribe({
        next: () => {
          this.listarDiretores();
          this.closeModal();
        },
        error: (err: HttpErrorResponse) => {
          console.error('Erro ao atualizar diretor:', err);
          alert('Erro ao atualizar diretor');
        }
      });
    } else {
      this.diretorService.cadastrar({ nome }).subscribe({
        next: () => {
          this.listarDiretores();
          this.closeModal();
        },
        error: (err: HttpErrorResponse) => {
          console.error('Erro ao cadastrar diretor:', err);
          alert('Erro ao cadastrar diretor');
        }
      });
    }
  }

  editarDiretor(diretor: Diretor) {
    this.diretorID = diretor.id;
    this.formDiretor.setValue({ nome: diretor.nome });
    this.openModal = true;
  }

  removerDiretor(diretor: Diretor) {
    this.openExcluirModal = true;
    this.diretorID = diretor.id;
  }

  confirmarExclusao() {
    if (this.diretorID) {
      this.diretorService.remover(this.diretorID).subscribe({
        next: () => {
          this.listarDiretores();
          this.closeModal();
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 500) {
            alert('Diretor não pode ser excluído pois está associado a um título');
          }
        }
      });
    }
  }

  closeModal() {
    this.openModal = false;
    this.openExcluirModal = false;
    this.formDiretor.reset();
    this.diretorID = null;
  }
}