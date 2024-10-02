import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AtorComponent } from './ator/ator.component';
import { ClasseComponent } from './classe/classe.component';
import { DiretorComponent } from './diretor/diretor.component';
import { ItemComponent } from './item/item.component';
import { TituloComponent } from './titulo/titulo.component';

export const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent,
        children: [
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
        ],
    },
    {
        path: '**',
        redirectTo: '/home',
        pathMatch: 'full',
    },
];
