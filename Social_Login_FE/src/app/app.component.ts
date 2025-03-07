import { Component } from '@angular/core';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { AuthService } from './auth.service';
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'socialLoginApp';
  user: any;
  loggedIn: any;
  constructor(
    private authService: SocialAuthService,
    public _authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.authState.subscribe((user: any) => {
      this.user = user;
      this.loggedIn = user != null;
      console.log('User in after verifing from google', user);
      this.handelSignIn(this.user.idToken);
    });
  }

  async handelSignIn(idToken: any) {
    // this._authService.loginWithGmail({ idToken }).subscribe(
    //   (data) => {
    //     console.log('Success Response of SignIn', data);
    //    }
    // )

    try {
      const data = await firstValueFrom(
        this._authService.loginWithGmail({ idToken })
      );        
      console.log('Success Response of SignIn ', data);

    } catch (error) {
      console.log('Failed to login and we will start signUp process' );
      try {
        const data = await firstValueFrom(
          this._authService.signUpWithGmail({ idToken })
        );
        console.log('Success Response of SignUp ', data);
      } catch (error) {
        console.log(error);
        console.log('Failed to signUp');
      }
    }
  }
}
