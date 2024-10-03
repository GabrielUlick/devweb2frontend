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

@Component({
  selector: 'app-ator',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, TableComponent],
  templateUrl: './ator.component.html',
  styleUrl: './ator.component.css',
})
export class AtorComponent {
  atores!: Paginated<Ator>;
  atorID?: string | null;
  openModal = false;
  currentPage: NextPage = { page: 1 };
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

  listarAtores() {}
}
