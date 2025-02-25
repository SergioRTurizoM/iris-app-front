import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { IrisheaderComponent } from "../irisheader/irisheader.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IrisheaderComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    const { username, password } = this.loginForm.value;
    this.authService.login(username, password).subscribe({
      next: (res) => {

        localStorage.setItem('access_token', res.access_token);
        this.errorMessage = '';
        console.log('Login successful', res);

        this.router.navigate(['/todo']);
      },
      error: (err) => {
        console.error('Login error', err);
        this.errorMessage = 'Login failed. Please check your credentials.';
      }
    });
  }
}
