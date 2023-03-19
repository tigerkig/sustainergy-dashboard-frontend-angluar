import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormsModule, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import * as moment from 'moment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginform = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });
  errors = false;

  errorMessage = "";

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder){}

  ngOnInit(): void {
    this.loginform = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]]
    });
  }

  resetForm(): void {
    this.loginform.setValue({
      email: "",
      password: ""
    });
  }

  onSubmit(): void {
    var controls:any = this.loginform.controls;
    this.errors = false;
    this.authService.login(controls.email.value, controls.password.value).subscribe(
      data => {
        this.authService.setSession(data);
        this.resetForm();
      }, error => {
        this.errors = true;
        this.errorMessage = error.error.detail;
      }, () => {
        this.router.navigate(['/']);
      }
    );
  }
}
