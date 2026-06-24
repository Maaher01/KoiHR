import { CommonModule, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { DashboardService } from 'src/app/services/dashboard.service';
import {
  ApexAxisChartSeries,
  ApexNonAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexStroke,
  ApexFill,
  ApexLegend,
  ApexTooltip,
  ApexMarkers,
  ApexPlotOptions,
  ApexResponsive,
  ApexGrid,
  ApexAnnotations,
  ApexStates,
  ApexTheme,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { AttendanceCount } from 'src/app/models/attendance.interface';
import { provideNativeDateAdapter } from '@angular/material/core';

export type ChartOptions = {
  series?: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart?: ApexChart;
  xaxis?: ApexXAxis;
  yaxis?: ApexYAxis | ApexYAxis[];
  title?: ApexTitleSubtitle;
  subtitle?: ApexTitleSubtitle;
  dataLabels?: ApexDataLabels;
  stroke?: ApexStroke;
  fill?: ApexFill;
  legend?: ApexLegend;
  tooltip?: ApexTooltip;
  markers?: ApexMarkers;
  plotOptions?: ApexPlotOptions;
  responsive?: ApexResponsive[];
  grid?: ApexGrid;
  annotations?: ApexAnnotations;
  states?: ApexStates;
  theme?: ApexTheme;
  colors?: string[];
  labels?: any;
};

@Component({
  selector: 'app-monthly-attendance-chart',
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    NgApexchartsModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './monthly-attendance-chart.component.html',
  styleUrl: './monthly-attendance-chart.component.scss',
})
export class MonthlyAttendanceChartComponent implements OnInit {
  dateControl = new FormControl(new Date());
  dataSource: any;
  errorResponse: any;
  isLoading: boolean = false;
  attendanceCount: AttendanceCount | null = null;
  today = new Date();

  public chartOptions: Partial<ChartOptions> = {
    chart: {
      type: 'pie',
      height: 280,
      toolbar: { show: false },
      animations: { enabled: true, speed: 600 },
    },
    labels: ['Present', 'Absent'],
    legend: {
      position: 'bottom',
      fontSize: '13px',
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${Math.round(val)}%`,
      style: { fontSize: '13px', fontWeight: '500' },
      dropShadow: { enabled: false },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} employee(s)`,
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: { height: 220 },
          legend: { position: 'bottom' },
        },
      },
    ],
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.getAttendanceCountByDate(this.today);

    this.dateControl.valueChanges.subscribe((date) => {
      if (date) {
        this.getAttendanceCountByDate(date);
      }
    });
  }

  getAttendanceCountByDate(date: Date) {
    this.isLoading = true;
    const dateStr = formatDate(date, 'yyyy-MM-dd', 'en');
    this.dashboardService.getAttendanceCountByDate(dateStr).subscribe({
      next: (res: AttendanceCount) => {
        this.attendanceCount = res;

        this.chartOptions = {
          ...this.chartOptions,
          series: [res.present, res.absent],
        };

        this.isLoading = false;
      },
      error: (err) => {
        this.errorResponse = err.error.message;
        this.isLoading = false;
      },
    });
  }
}
