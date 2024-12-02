import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AtorComponent } from './ator/ator.component';
import { ClasseComponent } from './classe/classe.component';
import { DiretorComponent } from './diretor/diretor.component';
import { ItemComponent } from './item/item.component';
import { TituloComponent } from './titulo/titulo.component';
import { LocacaoComponent } from './locacao/locacao.component';
import { SocioComponent } from './socio/socio.component';
import { DependenteComponent } from './dependente/dependente.component';
import { AdminlocadoraComponent } from './adminlocadora/adminlocadora.component';

export const routes: Routes = [
    {
        path: 'home',
        component: AdminlocadoraComponent,
        children: [
            {
                path: '',
                component: HomeComponent,
            },
            {
                path: 'ator',
                component: AtorComponent,
            },
            {
                path: 'classe',
                component: ClasseComponent,
            },
            {
                path: 'diretor',
                component: DiretorComponent,
            },
            {
                path: 'item',
                component: ItemComponent,
            },
            {
                path: 'titulo',
                component: TituloComponent,
            },
            {
                path: 'locacao',
                component: LocacaoComponent,
            },
            {
                path: 'locacao/:id',
                component: LocacaoComponent,
            },
            {
                path: 'socio',
                component: SocioComponent,
            },
            {
                path: 'dependente',
                component: DependenteComponent,
            }
        ],
    },
    {
        path: '**',
        redirectTo: '/home',
        pathMatch: 'full',
    },
];