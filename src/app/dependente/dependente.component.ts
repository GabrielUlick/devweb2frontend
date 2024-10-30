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
import { Dependente } from '../models/dependente';
import { Socio } from '../models/socio';
import { DependenteService } from '../services/dependente.service';
import { SocioService } from '../services/socio.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-dependente',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, TableComponent, CommonModule],
  templateUrl: './dependente.component.html',
  styleUrl: './dependente.component.css',
})
export class DependenteComponent {
  dependente!: Dependente[];
  socio: Socio[] = [];
  dependenteID?: string | null;
  openModal = false;
  openExcluirModal = false;
  formDependente: FormGroup<{
    nome: FormControl<string | null>;
    dtNascimento: FormControl<Date | null>;
    sexo: FormControl<string | null>;
    socio: FormControl<string | null>;
    ativo: FormControl<boolean | null>;
  }>;
  columns = [
    { key: 'nome', label: 'Nome' },
    { key: 'dtNascimento', label: 'Data de Nascimento' },
    { key: 'sexo', label: 'Sexo' },
    { key: 'socio', label: 'Sócio' },
    { key: 'ativo', label: 'Ativo' },
  ];

  constructor(
    private socioService: SocioService,
    private dependenteService: DependenteService
  ) {
    this.formDependente = new FormGroup({
      nome: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ]),
      dtNascimento: new FormControl<Date | null>(null, [Validators.required]),
      sexo: new FormControl('', [Validators.required, Validators.maxLength(1)]),
      socio: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ]),
      ativo: new FormControl(false),
    });

    this.socioService.listar().subscribe((socios) => {
      this.socio = socios;
    });

    this.dependenteService.listar().subscribe((dependentes) => {
      this.dependente = dependentes;
    });

    this.listarDependentes();
    this.preencherSocios();
  }

  listarDependentes() {
    this.dependenteService.listar().subscribe({
      next: (response) => {
        this.dependente = response;
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
      },
    });
  }

  preencherSocios() {
    this.socioService.listar().subscribe({
      next: (response) => {
        this.socio = response;
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
      },
    });
  }

  salvarDependente() {
    const nome = this.formDependente.value.nome || '';
    const dtNascimento = this.formDependente.value.dtNascimento
      ? new Date(this.formDependente.value.dtNascimento || '')
      : new Date();
    const sexo = this.formDependente.value.sexo || '';
    const socio =
      this.socio.find((a) => a.id === this.formDependente.value.socio) ||
      this.socio[0];
    const ativo = this.formDependente.value.ativo || true;
    if (this.dependenteID) {
      this.dependenteService
        .atualizar({
          id: this.dependenteID,
          nome,
          dtNascimento,
          sexo,
          socio,
          ativo,
        })
        .subscribe({
          next: () => {
            this.listarDependentes();
            this.closeModal();
          },
          error: (error: HttpErrorResponse) => {
            console.error(error);
          },
        });
    } else {
      this.dependenteService
        .cadastrar({ nome, dtNascimento, sexo, socio, ativo })
        .subscribe({
          next: () => {
            this.listarDependentes();
            this.closeModal();
          },
          error: (err: HttpErrorResponse) => {
            console.error('Erro ao cadastrar dependente:', err);
            alert('Erro ao cadastrar dependente');
          },
        });
    }
  }

  editarDependente(dependente: Dependente) {
    this.dependenteID = dependente.id;
    this.formDependente.setValue({
      nome: dependente.nome,
      dtNascimento: dependente.dtNascimento,
      sexo: dependente.sexo,
      socio: dependente.socio.id,
      ativo: dependente.ativo,
    });
    this.openModal = true;
  }

  removerDependente(dependente: Dependente) {
    this.dependenteID = dependente.id;
    this.openExcluirModal = true;
  }

  confirmarExclusao() {
    if (this.dependenteID) {
      this.dependenteService.remover(this.dependenteID).subscribe({
        next: () => {
          this.listarDependentes();
          this.closeModal();
        },
        error: (error: HttpErrorResponse) => {
          console.error(error);
        },
      });
    }
  }

  closeModal() {
    this.openModal = false;
    this.openExcluirModal = false;
    this.dependenteID = null;
    this.formDependente.reset();
  }
}
