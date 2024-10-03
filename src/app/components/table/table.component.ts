import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NextPage, Paginated } from '../../models/pagination';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {
  @Input()
  data: Paginated<any> = {
    limit: 0,
    page: 0,
    paginable: false,
    results: [],
    total_record: 0
  };

  @Input()
  columns: {key: string, label: string}[] = [];

  @Input()
  editar: Function | undefined;

  @Input()
  remover: Function | undefined;

  @Input()
  withoutSearching = false;

  @Input()
  actions: {
    handler: Function,
    title: string,
    label?: string,
    icon: string,
    btnClass: string,
  }[] = [];

  @Output()
  nextPage = new EventEmitter<NextPage>;

  formSearch: FormGroup<{
    search: FormControl<string | null>;
  }>;

  constructor() {
    this.formSearch = new FormGroup({
      search: new FormControl('', [
        Validators.required,
      ]),
    });
  }

  availablePages(): number[] {
    const totalPages = Math.ceil(this.data.total_record / this.data.limit);

    const pages: number[] = [];
    for (let i = this.data.page + 1; i <= totalPages && pages.length < 4; i++) {
      pages.push(i);
    }

    return pages;
  }

  submitSearch(): void {
    this.nextPage.emit({
      page: 1,
      search: this.formSearch.value.search?.trim()
    })
  }

  clearSearch(): void {
    this.formSearch.reset();
    this.nextPage.emit({
      page: 1,
    });
  }

  sendNextPage(page: number): void {
    this.nextPage.emit({
      page: page,
      search: this.formSearch.value.search?.trim()
    })
  }
}