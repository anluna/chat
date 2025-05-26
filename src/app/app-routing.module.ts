import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:'' ,
    loadComponent: () => import('./login/login.component'),
  },
  {
    path:'chat' ,
    loadComponent: () => import('./chat/chat.component'),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
