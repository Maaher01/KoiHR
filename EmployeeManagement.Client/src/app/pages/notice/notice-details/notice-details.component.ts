import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { Notice } from 'src/app/models/notice.interface';
import { NoticeService } from 'src/app/services/notice.service';

@Component({
  selector: 'app-notice-details',
  imports: [CommonModule, MaterialModule, RouterModule],
  templateUrl: './notice-details.component.html',
  styleUrl: './notice-details.component.scss',
})
export class NoticeDetailsComponent implements OnInit {
  errorMessage: any;
  notice: Notice | null = null;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private noticeService: NoticeService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.isLoading = true;

    this.noticeService.getNoticeById(id).subscribe({
      next: (notice: Notice) => {
        this.notice = notice;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error ?? 'Failed to load notice.';
        this.isLoading = false;
      },
    });
  }

  goBack() {
    this.router.navigate(['/notice']);
  }
}
