import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoldRateComponent } from './gold-rate.component';

const routes: Routes = [
  {
    path: '',
    component: GoldRateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoldRateRoutingModule {}
