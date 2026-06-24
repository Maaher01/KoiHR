import { Component } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  responseData: any;
  errorResponse: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
  ) {}

  loginForm = this.fb.nonNullable.group({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  login() {
    if (this.loginForm.invalid) return;

    this.authService.login(this.loginForm.value).subscribe({
      next: (result) => {
        localStorage.setItem('token', result.token);
        this.loginForm.reset();
        this.router.navigate(['/']);
      },
      error: (err) => {
        if (err.status === 400 || err.status === 401) {
          this.errorResponse = err.error;
        } else {
          this.errorResponse = 'Error logging in. Please try again later.';
        }
      },
    });
  }
}
