import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { AppComponent } from './app.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { LandingComponent } from './landing/landing.component';
import { InactiveComponent } from './inactive/inactive.component';
import { TrialConfigComponent, CustomTrialConfigComponent } from './trial/trial-config/trial-config.component';
// import {  } from './trial/trial-config/custom-trial-config.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'auth', loadChildren: './auth/auth.module#AuthModule' },
  { path: 'inactive', component: InactiveComponent },
  { path: 'admin', component: InactiveComponent },
  { path: 't/:treatmentID', component: TrialConfigComponent },
  { path: 't/startnewtreatment', component: CustomTrialConfigComponent },
  { path: '**', component: NotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
