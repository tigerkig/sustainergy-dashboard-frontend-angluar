import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormsModule, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetForm = new FormGroup({
    email: new FormControl('')
  });
  errorMessage:string;
  errors:boolean;
  success:boolean;
  consolation:string;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.resetForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]]
    });
    this.errors = false;
    this.errorMessage = "";
    this.success = false;
    this.consolation = "Don't worry, happens to the best of us";
  }

  onSubmit(): void {
    this.errors = false;
    var controls:any = this.resetForm.controls;
    this.authService.requestPasswordReset(controls.email.value).subscribe(
      data => {
        this.errorMessage = "";
        this.success = true;
        },
      err => {
        this.errors = true;
        this.errorMessage = err.error.email[0];
      },
      () => { 
        this.router.navigate(['/password_reset/sent']);
      }
    );
  }
}
