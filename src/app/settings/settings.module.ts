import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from 'src/app/settings/settings/settings.component';
import { SharedModule } from 'src/app/shared/shared.module';

const ROUTES: Routes = [
  {
    path: '',
    component: SettingsComponent,
  },
];

@NgModule({
  declarations: [SettingsComponent],
  imports: [CommonModule, SharedModule, RouterModule.forChild(ROUTES), ReactiveFormsModule],
})
export class SettingsModule {}
