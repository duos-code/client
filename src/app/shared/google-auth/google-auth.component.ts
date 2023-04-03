import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import {
  Component,
  ElementRef,
  Input,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-google-auth',
  templateUrl: './google-auth.component.html',
  styleUrls: ['./google-auth.component.css'],
})
export class GoogleAuthComponent {
 
  constructor(
    private userService: UserService,
    private authService: SocialAuthService,
  ) {}


  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      this.userService.setUser(user);
      window.location.reload();
    });
  }
}
