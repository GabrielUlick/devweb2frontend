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
import { Socio } from '../models/socio';
import { SocioService } from '../services/socio.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-socio',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, TableComponent, CommonModule],
  templateUrl: './socio.component.html',
  styleUrl: './socio.component.css',
})
export class SocioComponent {
  socio!: Socio[];
  socioID?: string | null;
  openModal = false;
  openExcluirModal = false;
  formSocio: FormGroup<{
    nome: FormControl<string | null>;
    cpf: FormControl<string | null>;
    endereco: FormControl<string | null>;
    dtNascimento: FormControl<Date | null>;
    sexo: FormControl<string | null>;
    telefone: FormControl<string | null>;
    ativo: FormControl<boolean | null>;
  }>;
  columns = [
    { key: 'nome', label: 'Nome' },
    { key: 'cpf', label: 'CPF' },
    { key: 'endereco', label: 'Endereço' },
    { key: 'dtNascimento', label: 'Data de Nascimento' },
    { key: 'sexo', label: 'Sexo' },
    { key: 'telefone', label: 'Telefone' },
    { key: 'ativo', label: 'Ativo' },
  ];

  constructor(private socioService: SocioService) {
    this.formSocio = new FormGroup({
      nome: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ]),
      cpf: new FormControl('', [Validators.required, Validators.maxLength(11)]),
      endereco: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ]),
      dtNascimento: new FormControl<Date | null>(null, [Validators.required]),
      sexo: new FormControl('', [Validators.required, Validators.maxLength(1)]),
      telefone: new FormControl('', [
        Validators.required,
        Validators.maxLength(11),
      ]),
      ativo: new FormControl<boolean | null>(true, [Validators.required]),
    });

    this.listarSocios();
  }

  listarSocios() {
    this.socioService.listar().subscribe({
      next: (response) => {
        this.socio = response;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro ao listar socios:', err);
        alert('Erro ao listar socios');
      },
    });
  }

  salvarSocio() {
    const nome = this.formSocio.value.nome || '';
    const cpf = this.formSocio.value.cpf || '';
    const endereco = this.formSocio.value.endereco || '';
    const dtNascimento = this.formSocio.value.dtNascimento
      ? new Date(this.formSocio.value.dtNascimento || '')
      : new Date();
    const sexo = this.formSocio.value.sexo || '';
    const telefone = this.formSocio.value.telefone || '';
    const ativo = this.formSocio.value.ativo || true;
    if (this.socioID) {
      this.socioService
        .atualizar({
          id: this.socioID,
          nome,
          cpf,
          endereco,
          dtNascimento,
          sexo,
          telefone,
          ativo,
        })
        .subscribe({
          next: () => {
            this.listarSocios();
            this.closeModal();
          },
          error: (err: HttpErrorResponse) => {
            console.error('Erro ao atualizar socio:', err);
            alert('Erro ao atualizar socio');
          },
        });
    } else {
      this.socioService
        .cadastrar({
          nome,
          cpf,
          endereco,
          dtNascimento,
          sexo,
          telefone,
          ativo,
        })
        .subscribe({
          next: () => {
            this.listarSocios();
            this.closeModal();
          },
          error: (err: HttpErrorResponse) => {
            console.error('Erro ao cadastrar socio:', err);
            alert('Erro ao cadastrar socio');
          },
        });
    }
  }

  editarSocio(socio: Socio) {
    this.openModal = true;
    this.formSocio.patchValue({
      nome: socio.nome,
      cpf: socio.cpf,
      endereco: socio.endereco,
      dtNascimento: socio.dtNascimento,
      sexo: socio.sexo,
      telefone: socio.telefone,
      ativo: socio.ativo,
    });
    this.socioID = socio.id;
  }

  removerSocio(socio: Socio) {
    this.openExcluirModal = true;
    this.socioID = socio.id;
  }

  confirmarExclusao() {
    if (this.socioID) {
      this.socioService.remover(this.socioID).subscribe({
        next: () => {
          this.listarSocios();
          this.closeModal();
        },
        error: (err: HttpErrorResponse) => {
          console.error('Erro ao remover socio:', err);
          alert('Erro ao remover socio');
        },
      });
    }
  }

  closeModal() {
    this.openModal = false;
    this.openExcluirModal = false;
    this.formSocio.reset();
    this.socioID = null;
  }
}
