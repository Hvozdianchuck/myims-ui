import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from "../../models/user.model";
import {RegistrationService} from "../services/registration.service";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {HttpResponse} from "@angular/common/http";
import AppError from "../../errors/app-error";
import ValidationError from "../../models/validationError";

@Component({
  selector: 'app-user-signup',
  templateUrl: './user-signup.component.html',
  styleUrls: ['./user-signup.component.css',
    '../user-style.css']
})
export class UserSignupComponent implements OnDestroy {
  userErrors: Map<string, string> = new Map<string, string>();
  hidePassword = true;
  regUserSubscription: Subscription;

  constructor(private registrationService: RegistrationService,
              public router: Router) {
  }

  createUser(data: any): void {
      const user = new User;
      if (data.password === data.repeatedPassword) {
        user.password = data.password;
      } else {
        this.router.navigate(['sign-up']);
        return;
      }
      user.firstName = data.firstName;
      user.lastName = data.lastName;
      user.email = data.email;
      user.accountName = data.accountName;

      this.regUserSubscription = this.registrationService.regUser(user)
        .subscribe((response: HttpResponse<any>) => {
          if (response) {
            this.router.navigate(['sign-in']);
          }
        }, (appError: AppError) => {
          if (appError.status === 500) {
            this.userErrors['email'] = 'User with this email already exists';
          } else {
            throw appError;
          }
        });
  }

  ngOnDestroy(): void {
    if (this.regUserSubscription) {
      this.regUserSubscription.unsubscribe();
    }
  }
}