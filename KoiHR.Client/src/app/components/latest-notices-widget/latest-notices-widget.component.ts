import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { Notice } from 'src/app/models/notice.interface';
import { NoticeService } from 'src/app/services/notice.service';

@Component({
  selector: 'app-latest-notices-widget',
  imports: [CommonModule, MaterialModule, RouterModule],
  templateUrl: './latest-notices-widget.component.html',
  styleUrl: './latest-notices-widget.component.scss',
})
export class LatestNoticesWidgetComponent implements OnInit {
  latestNotices: Notice[] = [];
  isLoadingNotices = false;

  constructor(private noticeService: NoticeService) {}

  ngOnInit(): void {
    this.getLatestNotices();
  }

  getLatestNotices() {
    this.isLoadingNotices = true;
    this.noticeService.getAllNotices().subscribe({
      next: (res) => {
        this.latestNotices = res
          .sort(
            (a, b) =>
              new Date(b.publishedAt).getTime() -
              new Date(a.publishedAt).getTime(),
          )
          .slice(0, 4);
        this.isLoadingNotices = false;
      },
      error: () => {
        this.isLoadingNotices = false;
      },
    });
  }

  truncate(content: string): string {
    return content.length > 100 ? content.slice(0, 100) + '...' : content;
  }
}
