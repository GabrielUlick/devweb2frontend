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
import { Locacao } from '../models/locacao';
import { Cliente } from '../models/cliente';
import { Item } from '../models/item';
import { LocacaoService } from '../services/locacao.service';
import { DependenteService } from '../services/dependente.service';
import { SocioService } from '../services/socio.service';
import { ItemService } from '../services/item.service';
import { Socio } from '../models/socio';
import { Dependente } from '../models/dependente';
import { ClienteService } from '../services/cliente.service';

@Component({
  selector: 'app-locacao',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, TableComponent, CommonModule],
  templateUrl: './locacao.component.html',
  styleUrl: './locacao.component.css',
})
export class LocacaoComponent {
  pendencia: boolean = false;
  botaoDesabilitado: boolean = true;
  locacao!: Locacao[];
  locacaoID?: string | null;
  openModal = false;
  clientes: (Socio | Dependente)[] = [];
  items: Item[] = [];
  openExcluirModal = false;
  openEfetuarDevolucaoModal = false;
  formLocacao: FormGroup<{
    id: FormControl<string | null>;
    dtLocacao: FormControl<Date | null>;
    dtDevolucaoPrevista: FormControl<Date | null>;
    dtDevolucaoEfetiva: FormControl<Date | null>;
    valorCobrado: FormControl<number | null>;
    multaCobrada: FormControl<number | null>;
    cliente: FormControl<Cliente | null>;
    item: FormControl<Item | null>;
  }>;
  columns = [
    { key: 'id', label: 'ID' },
    { key: 'dtLocacao', label: 'Data de Locação' },
    { key: 'dtDevolucaoPrevista', label: 'Data de Devolução Prevista' },
    { key: 'dtDevolucaoEfetiva', label: 'Data de Devolução Efetiva' },
    { key: 'valorCobrado', label: 'Valor Cobrado' },
    { key: 'multaCobrada', label: 'Multa Cobrada' },
    { key: 'cliente', label: 'Cliente' },
    { key: 'item', label: 'Itens' },
  ];

  constructor(
    private locacaoService: LocacaoService,
    private clienteService: ClienteService,
    private dependenteService: DependenteService,
    private socioService: SocioService,
    private itemService: ItemService
  ) {
    this.formLocacao = new FormGroup({
      id: new FormControl('', [Validators.required]),
      cliente: new FormControl<Cliente | null>(null, [Validators.required]),
      item: new FormControl<Item | null>(null, [Validators.required]),
      dtLocacao: new FormControl<Date | null>(null, [Validators.required]),
      dtDevolucaoPrevista: new FormControl<Date | null>(null, [
        Validators.required,
      ]),
      valorCobrado: new FormControl(0, [Validators.required]),
      multaCobrada: new FormControl(0, null),
      dtDevolucaoEfetiva: new FormControl<Date | null>(null, null),
    });
  
    this.listarLocacoes();
    this.preencherClientes();
    this.preencherItems();
  }

  listarLocacoes() {
    this.locacaoService.listar().subscribe({
      next: (locacao) => {
        this.locacao = locacao;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  preencherClientes() {
    this.socioService.listar().subscribe({
      next: (socios) => {
        this.dependenteService.listar().subscribe({
          next: (dependentes) => {
            this.clientes = [...socios, ...dependentes];
          },
          error: (error) => {
            console.error(error);
          },
        });
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  preencherItems() {
    this.itemService.listar().subscribe({
      next: (items) => {
        this.items = items;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  salvarLocacao() {
    const dtLocacao = this.formLocacao.value.dtLocacao
      ? new Date(this.formLocacao.value.dtLocacao || '')
      : new Date();
    const dtDevolucaoPrevista = this.formLocacao.value.dtDevolucaoPrevista
      ? new Date(this.formLocacao.value.dtDevolucaoPrevista || '')
      : new Date();
    const dtDevolucaoEfetiva = this.formLocacao.value.dtDevolucaoEfetiva || undefined;
    const valorCobrado = this.formLocacao.value.valorCobrado || 0;
    const multaCobrada = this.formLocacao.value.multaCobrada || 0;
    const cliente = this.formLocacao.value.cliente;
    const item = this.formLocacao.value.item;
  
    if (!cliente || !item) {
      console.error('Cliente ou item não informado.');
      return;
    }
    if (this.locacaoID) {
      this.locacaoService
        .atualizar({
          id: this.locacaoID,
          dtLocacao,
          dtDevolucaoPrevista,
          dtDevolucaoEfetiva,
          valorCobrado,
          multaCobrada,
          cliente,
          item,
        })
        .subscribe({
          next: () => {
            this.listarLocacoes();
            this.openModal = false;
          },
          error: (error) => {
            console.error(error);
          },
        });
    } else {
      this.locacaoService
        .cadastrar({
          dtLocacao,
          dtDevolucaoPrevista,
          dtDevolucaoEfetiva,
          valorCobrado,
          multaCobrada,
          cliente,
          item,
        })
        .subscribe({
          next: () => {
            this.listarLocacoes();
            this.openModal = false;
          },
          error: (error) => {
            console.error(error);
          },
        });
    }
  }

  editarLocacao(locacao: Locacao) {
    this.locacaoID = locacao.id;
    this.formLocacao.setValue({
      id: locacao.id,
      dtLocacao: locacao.dtLocacao,
      dtDevolucaoPrevista: locacao.dtDevolucaoPrevista,
      dtDevolucaoEfetiva: locacao.dtDevolucaoEfetiva ?? null,
      valorCobrado: locacao.valorCobrado,
      multaCobrada: locacao.multaCobrada,
      cliente: locacao.cliente,
      item: locacao.item,
    });
    this.openModal = true;
  }

  confirmarDevolucaoDialog(locacao: Locacao) {
    this.locacaoID = locacao.id;
    this.formLocacao.setValue({
      id: locacao.id,
      dtLocacao: locacao.dtLocacao,
      dtDevolucaoPrevista: locacao.dtDevolucaoPrevista,
      dtDevolucaoEfetiva: locacao.dtDevolucaoEfetiva ?? null,
      valorCobrado: locacao.valorCobrado,
      multaCobrada: locacao.multaCobrada,
      cliente: locacao.cliente,
      item: locacao.item,
    });
    this.openEfetuarDevolucaoModal = true;
  }

  removerLocacao(locacao: Locacao) {
    if (locacao.dtDevolucaoEfetiva) {
      alert('A locação já foi paga e não pode ser removida.');
      return;
    }
    this.openExcluirModal = true;
    this.locacaoID = locacao.id;
  }

  confirmarExclusao() {
    if (this.locacaoID) {
      this.locacaoService.remover(this.locacaoID).subscribe({
        next: () => {
          this.listarLocacoes();
          this.openExcluirModal = false;
        },
        error: (error) => {
          console.error(error);
        },
      });
    }
  }

  closeModal() {
    this.openModal = false;
    this.openExcluirModal = false;
    this.formLocacao.reset();
    this.locacaoID = null;
  }
  
  calcularValorELocacao() {
    const cliente = this.formLocacao.value.cliente;
    const item = this.formLocacao.value.item;
  
    if (!cliente || !item) {
      console.error('Cliente ou item não informado.');
      return;
    }
  
    console.log('Cliente selecionado:', cliente.id);
    console.log('Item selecionado:', item.id);
  
    this.clienteService.verificarPendencias(cliente.id).subscribe({
      next: (temPendencias) => {
        if (temPendencias) {
          this.botaoDesabilitado = true;
          alert('Cliente possui pendências.');
          return;
        }
        
        if (!item.titulo || !item.titulo.classe) {
          console.error('Item ou classe do item não informado.');
          return;
        }
        
        this.locacaoService.verificarItemDisponivel(item.id).subscribe({
          next: (naoDisponivel) => {
            console.log('Item disponível:', naoDisponivel);
            if (naoDisponivel) {
              this.botaoDesabilitado = true;
              alert('Item não está disponível.');
              return;
            }

            this.botaoDesabilitado = false;
            
            const dtLocacao = new Date();
            const valorLocacao = item.titulo.classe.valor;
            const dtDevolucaoPrevista = new Date(dtLocacao);
            dtDevolucaoPrevista.setDate(
              dtDevolucaoPrevista.getDate() + item.titulo.classe.prazoDevolucao
            );
  
            this.formLocacao.patchValue({
              dtLocacao,
              dtDevolucaoPrevista,
              valorCobrado: valorLocacao,
            });
          },
          error: (error) => {
            console.error(error);
          },
        });
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  confirmarDevolucao() {
    if (!this.locacaoID) {
      console.error('ID da locação não informado.');
      return;
    }
  
    const locacao = this.locacao.find(l => l.id === this.locacaoID);
    if (!locacao) {
      console.error('Locação não encontrada.');
      return;
    }
  
    const dtDevolucaoEfetiva = new Date();
    const dtDevolucaoPrevista = new Date(locacao.dtDevolucaoPrevista);
    let multaCobrada = 0;
  
    if (dtDevolucaoEfetiva > dtDevolucaoPrevista) {
      const diasAtraso = Math.ceil(
        (dtDevolucaoEfetiva.getTime() - dtDevolucaoPrevista.getTime()) / (1000 * 60 * 60 * 24)
      );
      multaCobrada = diasAtraso * 5; 
    }
  
    const valorTotal = locacao.valorCobrado + multaCobrada;
  
    this.locacaoService
      .atualizar({
        ...locacao,
        dtDevolucaoEfetiva,
        multaCobrada,
      })
      .subscribe({
        next: () => {
          this.listarLocacoes();
          this.openEfetuarDevolucaoModal = false;
          alert(`Devolução confirmada. Valor total a ser pago: ${valorTotal}`);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  novaLocacao() {
    this.formLocacao.reset();
    this.locacaoID = null;
    this.openModal = true;
  }
}
