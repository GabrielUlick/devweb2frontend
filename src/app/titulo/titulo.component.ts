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
import { Ator } from '../models/ator';
import { Classe } from '../models/classe';
import { Diretor } from '../models/diretor';
import { Titulo } from '../models/titulo';
import { TituloService } from '../services/titulo.service';
import { AtorService } from '../services/ator.service';
import { ClasseService } from '../services/classe.service';
import { DiretorService } from '../services/diretor.service';

@Component({
  selector: 'app-titulo',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, TableComponent, CommonModule],
  templateUrl: './titulo.component.html',
  styleUrl: './titulo.component.css',
})
export class TituloComponent {
  titulo!: Titulo[];
  ator: Ator[] = [];
  diretor: Diretor[] = [];
  classe: Classe[] = [];
  tituloID?: string | null;
  openModal = false;
  openExcluirModal = false;
  formTitulo: FormGroup<{
    nome: FormControl<string | null>;
    ano: FormControl<Date | null>;
    sinopse: FormControl<string | null>;
    categoria: FormControl<string | null>;
    ator: FormControl<string | null>;
    diretor: FormControl<string | null>;
    classe: FormControl<string | null>;
  }>;
  columns = [
    { key: 'nome', label: 'Nome' },
    { key: 'ano', label: 'Ano' },
    { key: 'sinopse', label: 'Sinopse' },
    { key: 'categoria', label: 'Categoria' },
    { key: 'ator', label: 'Ator' },
    { key: 'diretor', label: 'Diretor' },
    { key: 'classe', label: 'Classe' },
  ];

  constructor(
    private tituloService: TituloService,
    private atorService: AtorService,
    private diretorService: DiretorService,
    private classeService: ClasseService
  ) {
    this.formTitulo = new FormGroup({
      nome: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ]),
      ano: new FormControl<Date | null>(null, [Validators.required]),
      sinopse: new FormControl('', [
        Validators.required,
        Validators.maxLength(200),
      ]),
      categoria: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ]),
      ator: new FormControl('', [Validators.required]),
      diretor: new FormControl('', [Validators.required]),
      classe: new FormControl('', [Validators.required]),
    });

    this.listarTitulos();
    this.preencherAtores();
    this.preencherDiretores();
    this.preencherClasses();
  }

  listarTitulos() {
    this.tituloService.listar().subscribe({
      next: (response) => {
        this.titulo = response;
      },
      error: (err) => {
        console.error('Erro ao listar títulos:', err);
        alert('Erro ao listar títulos');
      },
    });
  }

  preencherAtores() {
    this.atorService.listar().subscribe({
      next: (response) => {
        this.ator = response;
      },
      error: (err) => {
        console.error('Erro ao listar atores:', err);
        alert('Erro ao listar atores');
      },
    });
  }

  preencherDiretores() {
    this.diretorService.listar().subscribe({
      next: (response) => {
        this.diretor = response;
      },
      error: (err) => {
        console.error('Erro ao listar diretores:', err);
        alert('Erro ao listar diretores');
      },
    });
  }

  preencherClasses() {
    this.classeService.listar().subscribe({
      next: (response) => {
        this.classe = response;
      },
      error: (err) => {
        console.error('Erro ao listar classes:', err);
        alert('Erro ao listar classes');
      },
    });
  }

  salvarTitulo() {
    const nome = this.formTitulo.value.nome || '';
    const ano = this.formTitulo.value.ano || new Date();
    const sinopse = this.formTitulo.value.sinopse || '';
    const categoria = this.formTitulo.value.categoria || '';
    const ator =
      this.ator.find((a) => a.id === this.formTitulo.value.ator) ||
      this.ator[0];
    const diretor =
      this.diretor.find((d) => d.id === this.formTitulo.value.diretor) ||
      this.diretor[0];
    const classe =
      this.classe.find((c) => c.id === this.formTitulo.value.classe) ||
      this.classe[0];
      console.log('titulo', { nome, ano, sinopse, categoria, ator, diretor, classe });
    if (this.tituloID) {
      this.tituloService
        .atualizar({
          id: this.tituloID,
          nome,
          ano,
          sinopse,
          categoria,
          ator,
          diretor,
          classe,
        })
        .subscribe({
          next: () => {
            this.listarTitulos();
            this.closeModal();
          },
          error: (err) => {
            console.error('Erro ao atualizar título:', err);
            alert('Erro ao atualizar título');
          },
        });
    } else {
      this.tituloService
        .cadastrar({ nome, ano, sinopse, categoria, ator, diretor, classe })
        .subscribe({
          next: () => {
            this.listarTitulos();
            this.closeModal();
          },
          error: (err) => {
            console.error('Erro ao cadastrar título:', err);
            alert('Erro ao cadastrar título');
          },
        });
    }
  }

  editarTitulo(titulo: Titulo) {
    this.tituloID = titulo.id;
    this.formTitulo.setValue({
      nome: titulo.nome,
      ano: titulo.ano,
      sinopse: titulo.sinopse,
      categoria: titulo.categoria,
      ator: titulo.ator.id,
      diretor: titulo.diretor.id,
      classe: titulo.classe.id,
    });
    this.openModal = true;
  }

  removerTitulo(titulo: Titulo) {
    this.tituloID = titulo.id;
    this.openExcluirModal = true;
  }

  confirmarExclusao() {
    if (this.tituloID) {
      this.tituloService.remover(this.tituloID).subscribe({
        next: () => {
          this.listarTitulos();
          this.closeModal();
        },
        error: (err) => {
          console.error('Erro ao remover título:', err);
          alert('Erro ao remover título');
        },
      });
    }
  }

  closeModal() {
    this.openModal = false;
    this.openExcluirModal = false;
    this.formTitulo.reset();
    this.tituloID = null;
  }
}
