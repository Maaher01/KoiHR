import { Component, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { AttendanceMarkCardComponent } from 'src/app/components/attendance-mark-card/attendance-mark-card.component';
import { AuthService } from 'src/app/services/auth.service';
import { DecodedToken } from 'src/app/models/decoded-token.interface';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MonthlyAttendanceChartComponent } from 'src/app/components/monthly-attendance-chart/monthly-attendance-chart.component';
import { LatestNoticesWidgetComponent } from 'src/app/components/latest-notices-widget/latest-notices-widget.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    MaterialModule,
    AttendanceMarkCardComponent,
    MonthlyAttendanceChartComponent,
    ReactiveFormsModule,
    LatestNoticesWidgetComponent,
  ],
  templateUrl: './dashboard.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent {
  currentUser: DecodedToken | null = null;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.authService.$currentUser.subscribe(
      (user) => (this.currentUser = user),
    );
  }
}
