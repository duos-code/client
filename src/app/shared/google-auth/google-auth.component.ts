import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      this.userService.setUser(user);

      window.location.reload();

      // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      // this.router.onSameUrlNavigation = 'reload';
      // this.router.navigate(['./'], { relativeTo: this.route });
    });
  }
}
