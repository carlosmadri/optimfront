import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/home/home.component').then((mod) => mod.HomeComponent),
  },
  {
    path: 'workout',
    pathMatch: 'full',
    loadComponent: () => import('./pages/workout/workout.component').then((mod) => mod.WorkoutComponent),
  },
  {
    path: 'workout/manage-team',
    loadComponent: () => import('./pages/workout/manage-teams/manage-teams.component').then((mod) => mod.ManageTeamsComponent),
  },
  {
    path: 'workout/manage-job-requisitions',
    loadComponent: () => import('./pages/workout/manage-job-requests/manage-job-requests.component').then((mod) => mod.ManageJobRequestsComponent),
  },
  {
    path: 'worksync',
    pathMatch: 'full',
    loadComponent: () => import('./pages/worksync/worksync.component').then((mod) => mod.WorksyncComponent),
  },
  {
    path: 'worksync/manage-workload',
    loadComponent: () => import('./pages/worksync/manage-workload/manage-workload.component').then((mod) => mod.ManageWorkloadComponent),
  },
  {
    path: 'subcontracting',
    loadComponent: () => import('./pages/subcontracting/subcontracting.component').then((mod) => mod.SubcontractingComponent),
  },
  {
    path: '**',
    pathMatch: 'full',
    loadComponent: () => import('./pages/page-not-found/page-not-found.component').then((mod) => mod.PageNotFoundComponent),
  },
];
