import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { LeaveBalance } from 'src/app/models/leave-balance.interface';
import { LeaveBalanceService } from 'src/app/services/leave-balance.service';

@Component({
  selector: 'app-leave-balance',
  imports: [CommonModule, MaterialModule],
  templateUrl: './leave-balance.component.html',
  styleUrl: './leave-balance.component.scss',
})
export class LeaveBalanceComponent implements OnInit {
  leaveBalances: LeaveBalance[] = [];
  errorResponse: any;
  isLoading = false;

  constructor(private leaveBalanceService: LeaveBalanceService) {}

  ngOnInit(): void {
    this.getMyLeaveBalance();
  }

  getMyLeaveBalance() {
    this.isLoading = true;
    this.leaveBalanceService.getMyLeaveBalance().subscribe({
      next: (res) => {
        this.leaveBalances = res;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorResponse = err.error.message;
        this.isLoading = false;
      },
    });
  }
}
