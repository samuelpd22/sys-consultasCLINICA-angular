import { Routes } from '@angular/router';
import { RegistrarComponent } from './components/registrar/registrar.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { SucessoComponent } from './components/sucesso/sucesso.component';
import { PainelComponent } from './components/painel/painel.component';
import { MedicovisaoComponent } from './components/medicovisao/medicovisao.component';

export const routes: Routes = [

{
    path:"registrar", component:RegistrarComponent,
},
{
    path:"inicio",component: InicioComponent
},
{
    path:"sucesso",component:SucessoComponent
},
{
    path:"medico",component:MedicovisaoComponent
},
{
    path:"painel",component:PainelComponent
},
{
    path: '', redirectTo: '/inicio', pathMatch: 'full'  // Redireciona para '/inicio' quando não houver rota
}];
