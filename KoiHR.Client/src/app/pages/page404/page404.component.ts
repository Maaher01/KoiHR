import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-page404',
  imports: [MaterialModule, RouterModule],
  templateUrl: './page404.component.html',
  styleUrl: './page404.component.scss',
})
export class Page404Component {}
