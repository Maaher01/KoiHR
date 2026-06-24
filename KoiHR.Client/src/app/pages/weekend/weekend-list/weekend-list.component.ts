import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { WeekendEditDialogComponent } from 'src/app/components/weekend-edit-dialog/weekend-edit-dialog.component';
import { MaterialModule } from 'src/app/material.module';
import { Weekend } from 'src/app/models/weekend.interface';
import { WeekendService } from 'src/app/services/weekend.service';
import { getDayNames } from 'src/app/shared/date-time.format';

@Component({
  selector: 'app-weekend-list',
  imports: [MaterialModule],
  templateUrl: './weekend-list.component.html',
  styleUrl: './weekend-list.component.scss',
})
export class WeekendListComponent implements OnInit {
  weekends = new MatTableDataSource<Weekend>([]);
  errorResponse: any;
  isLoading = false;
  displayedColumns: string[] = ['departmentName', 'weekendDays', 'actions'];
  getDayNames = getDayNames;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private weekendService: WeekendService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.getAllWeekends();
  }

  ngAfterViewInit() {
    this.weekends.paginator = this.paginator;
  }

  getAllWeekends() {
    this.weekendService.getAllWeekends().subscribe({
      next: (res) => {
        this.weekends.data = res;
      },
      error: (err) => {
        this.errorResponse = err.error.message;
      },
    });
  }

  editWeekend(weekend: Weekend) {
    const dialogConf = new MatDialogConfig();

    dialogConf.disableClose = true;
    dialogConf.autoFocus = true;
    dialogConf.width = '400px';
    dialogConf.maxHeight = '90vh';
    dialogConf.data = {
      heading: 'Edit Weekend',
      weekend: weekend,
    };

    const dialogRef = this.dialog.open(WeekendEditDialogComponent, dialogConf);

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog closed with result:', result);
      if (result) this.getAllWeekends();
    });
  }
}
