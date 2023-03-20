import { UserService } from './../../core/services/user.service';
import {
  SocialAuthService,
  GoogleLoginProvider,
  GoogleInitOptions,
  SocialUser,
} from '@abacritt/angularx-social-login';
import { CommunicationService } from '../../core/services/communication.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent {
  public user!: SocialUser;
  public loggedIn!: boolean;

  constructor(
    private communication: CommunicationService,
    private router: Router,
    private userService: UserService
  ) {}

  public visibleJoinBtn: boolean = false;

  ngOnInit() {
    this.user = this.userService.user;

    this.communication.socket.on('joined-room', ({ roomId }) => {
      this.router.navigate([`/${roomId}`]);
    });
  }

  handleShowJoinBtn(value: boolean) {
    this.visibleJoinBtn = value;
  }

  handleCreateRoom() {
    if (!this.userService.user) {
      console.warn('login need');
      return;
    };
    this.communication.createRoom();
  }
  handleJoinRoom(roomId: any) {
    if (!this.userService.user) {
      console.warn('login need');
      return;
    };
    this.router.navigate([`/${roomId.value}`]);
  }
}
