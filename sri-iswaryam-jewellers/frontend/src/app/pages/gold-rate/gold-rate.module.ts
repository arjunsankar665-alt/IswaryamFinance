import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GoldRateRoutingModule } from './gold-rate-routing.module';
import { GoldRateComponent } from './gold-rate.component';

@NgModule({
  declarations: [GoldRateComponent],
  imports: [CommonModule, RouterModule, HttpClientModule, GoldRateRoutingModule]
})
export class GoldRateModule {}
