import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormsModule, FormGroup, FormControl, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PasswordResetService } from '../../services/password_reset/password-reset.service';
import { CustomValidators } from '../../helpers/custom-validators';

@Component({
  selector: 'app-reset-password-confirm',
  templateUrl: './reset-password-confirm.component.html',
  styleUrls: ['./reset-password-confirm.component.scss']
})

export class ResetPasswordConfirmComponent implements OnInit {
  resetPasswordForm = new FormGroup({
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required])
  }, [CustomValidators.MatchValidator('password', 'confirmPassword')]
  );
  errors:boolean;
  errorMessage:string;
  token: any;
  notsame: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private passwordResetService: PasswordResetService) { }

  ngOnInit(): void {
    this.notsame = false;
    this.errors = false;
    this.errorMessage = "";
    this.token = this.route.snapshot.queryParamMap.get('token');
    this.validateToken();
  }

  get passwordMatchError() {
    return(
      this.resetPasswordForm.getError('mismatch') &&
        this.resetPasswordForm.get('confirmPassword')?.touched
    );
  }


  validateToken():any {
    this.passwordResetService.verify_token(this.token).subscribe(
      data => { return true},
      err => {
        this.router.navigate(['/login']);
      }
    )
  }



  onSubmit(): void {
    var form = this.resetPasswordForm.controls;
    if (form.password.value == form.confirmPassword.value) {
      var password = form.password.value || "";
      this.passwordResetService.reset_password(this.token, password).subscribe(
        data => {
          this.router.navigate(['/password_reset/success']);
        },
        err => {
          console.log(err);
        }
      );
    }
  }


}
