import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { NoticeDialogComponent } from 'src/app/components/notice-dialog/notice-dialog.component';
import { MaterialModule } from 'src/app/material.module';
import { DecodedToken } from 'src/app/models/decoded-token.interface';
import { Notice } from 'src/app/models/notice.interface';
import { AuthService } from 'src/app/services/auth.service';
import { NoticeService } from 'src/app/services/notice.service';

@Component({
  selector: 'app-notice-list',
  imports: [CommonModule, MaterialModule, RouterLink],
  templateUrl: './notice-list.component.html',
  styleUrl: './notice-list.component.scss',
})
export class NoticeListComponent implements OnInit {
  notices: Notice[] = [];
  errorResponse: any;
  isLoading = false;
  expandedNoticeId: number | null = null;
  currentUser: DecodedToken | null = null;

  constructor(
    private noticeService: NoticeService,
    private dialog: MatDialog,
    public authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.authService.$currentUser.subscribe(
      (user) => (this.currentUser = user),
    );

    this.getAllNotices();
  }

  getAllNotices() {
    this.isLoading = true;
    this.noticeService.getAllNotices().subscribe({
      next: (res) => {
        this.notices = res.sort(
          (a, b) =>
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime(),
        );
        this.isLoading = false;
      },
      error: (err) => {
        this.errorResponse = err.error?.message ?? 'Failed to load notices.';
        this.isLoading = false;
      },
    });
  }

  openAddDialog() {
    const dialogConf = new MatDialogConfig();
    dialogConf.width = '500px';
    dialogConf.data = { heading: 'Publish Notice' };

    const dialogRef = this.dialog.open(NoticeDialogComponent, dialogConf);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.getAllNotices();
    });
  }

  openEditDialog(notice: Notice) {
    const dialogConf = new MatDialogConfig();
    dialogConf.width = '500px';
    dialogConf.data = { heading: 'Edit Notice', notice };

    const dialogRef = this.dialog.open(NoticeDialogComponent, dialogConf);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.getAllNotices();
    });
  }

  deleteNotice(notice: Notice) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Notice',
        message: `Are you sure you want to delete "${notice.title}"?`,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.noticeService.deleteNotice(notice.id).subscribe({
          next: () => this.getAllNotices(),
          error: (err) => {
            this.errorResponse = err.error ?? 'Failed to delete notice.';
          },
        });
      }
    });
  }

  isExpanded(notice: Notice): boolean {
    return this.expandedNoticeId === notice.id;
  }

  isLongContent(content: string): boolean {
    return content.length > 180;
  }

  truncate(content: string): string {
    return content.length > 180 ? content.slice(0, 180) + '...' : content;
  }
}
