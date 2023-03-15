import { Socket } from 'socket.io-client';
import { CommunicationService } from '../../core/services/communication.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent {
  constructor(
    private communication: CommunicationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.communication.socket.on('joined-room', ({ roomId }) => {
      this.router.navigate([`/${roomId}`]);
    });
  }

  handleCreateRoom() {
    this.communication.createRoom();
  }
}
