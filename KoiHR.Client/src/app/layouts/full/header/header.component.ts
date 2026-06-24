import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
  OnInit,
} from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';

import { NgScrollbarModule } from 'ngx-scrollbar';
import { AuthService } from 'src/app/services/auth.service';
import { DecodedToken } from 'src/app/models/decoded-token.interface';
import { NoticeService } from 'src/app/services/notice.service';
import { Notice } from 'src/app/models/notice.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [
    RouterModule,
    NgScrollbarModule,
    TablerIconsModule,
    MaterialModule,
    CommonModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit {
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  currentUser: DecodedToken | null = null;
  recentNotices: Notice[] = [];

  constructor(
    public authService: AuthService,
    public noticeService: NoticeService,
  ) {}

  ngOnInit(): void {
    this.authService.$currentUser.subscribe(
      (user) => (this.currentUser = user),
    );

    this.loadRecentNotices();

    setInterval(() => this.loadRecentNotices(), 5 * 60 * 1000);
  }

  loadRecentNotices() {
    this.noticeService.getAllNotices().subscribe({
      next: (res) => {
        console.log(res);

        this.recentNotices = res
          .sort(
            (a, b) =>
              new Date(b.publishedAt).getTime() -
              new Date(a.publishedAt).getTime(),
          )
          .slice(0, 5);
      },
    });
  }

  truncate(content: string): string {
    return content.length > 25 ? content.slice(0, 25) + '...' : content;
  }

  logout() {
    this.authService.logout();
  }
}
