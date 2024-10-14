import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableComponent } from '../components/table/table.component';
import { Classe } from '../models/classe';
import { ClasseService } from '../services/classe.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-classe',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, TableComponent, CommonModule],
  templateUrl: './classe.component.html',
  styleUrl: './classe.component.css'
})
export class ClasseComponent {
  classe!: Classe[];
  classeID?: string | null;
  openModal = false;
  openExcluirModal = false;
  formClasse: FormGroup<{
    nome: FormControl<string | null>;
    valor: FormControl<number | null>;
    prazoDevolucao: FormControl<number | null>;
  }>;
  columns = [
    { key: 'nome', label: 'Nome' },
    { key: 'valor', label: 'Valor' },
    { key: 'prazoDevolucao', label: 'Prazo de Devolução' }
  ];

  constructor(private classeService: ClasseService) {
    this.formClasse = new FormGroup({
      nome: new FormControl('', [
        Validators.required,
        Validators.maxLength(50)
      ]),
      valor: new FormControl<number | null>(null, [
        Validators.required,
        Validators.min(0)
      ]),
      prazoDevolucao: new FormControl<number | null>(null, [
        Validators.required,
        Validators.min(0)
      ])
    });

    this.listarClasses();
  }

  listarClasses() {
    this.classeService.listar().subscribe({
      next: (response) => {
        this.classe = response;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro ao listar classes:', err);
        alert('Erro ao listar classes');
      }
    });
  }

  salvarClasse() {
    const nome = this.formClasse.value.nome || '';
    const valor = this.formClasse.value.valor || 0;
    const prazoDevolucao = this.formClasse.value.prazoDevolucao || 0;
    if (this.classeID) {
      this.classeService.atualizar({ id: this.classeID, nome, valor, prazoDevolucao }).subscribe({
        next: () => {
          this.listarClasses();
          this.closeModal();
        },
        error: (err: HttpErrorResponse) => {
          console.error('Erro ao atualizar classe:', err);
          alert('Erro ao atualizar classe');
        }
      });
    } else {
      this.classeService.cadastrar({ nome, valor, prazoDevolucao }).subscribe({
        next: () => {
          this.listarClasses();
          this.closeModal();
        },
        error: (err: HttpErrorResponse) => {
          console.error('Erro ao cadastrar classe:', err);
          alert('Erro ao cadastrar classe');
        }
      });
    }
  }

  editarClasse(classe: Classe) {
    this.openModal = true;
    this.formClasse.patchValue({
      nome: classe.nome,
      valor: classe.valor,
      prazoDevolucao: classe.prazoDevolucao
    });
    this.classeID = classe.id;
  }

  removerClasse(classe: Classe) {
    this.openExcluirModal = true;
    this.classeID = classe.id;
  }

  confirmarExclusao() {
    if (this.classeID) {
      this.classeService.remover(this.classeID).subscribe({
        next: () => {
          this.listarClasses();
          this.closeModal();
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 500) {
            alert('Classe não pode ser excluída pois está associada a um título');
          }
        }
      });
    }
  }

  closeModal() {
    this.openModal = false;
    this.openExcluirModal = false;
    this.formClasse.reset();
    this.classeID = null;
  }
}