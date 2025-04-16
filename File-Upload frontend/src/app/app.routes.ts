import { Routes } from '@angular/router';
import { FileUploadComponent } from './components/file-upload/file-upload.component';

export const routes: Routes = [
    {path: '',redirectTo:'upload', pathMatch:'full'},
    // {path: 'dashboard',loadComponent:() => import('./components/file-upload/file-upload.component').then(c=>c.DashboardComponent)},
    {path:'upload', component:FileUploadComponent},
];
