import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Peer } from 'peerjs';

import { socketuser } from '../interfaces/socketuser.interface';

@Injectable({
  providedIn: 'root',
})
export class CommunicationService {
  public socket!: Socket;
  public peer!: Peer;

  private domain: string | undefined;

  constructor() {
    this.domain = environment.base_url;
  }

  connectSocket() {
    this.socket = io(this.domain as string);

    this.socket.on('connect', () => {
      console.log(`socket id ${this.socket.id}`);
    });
  }

  resetSocket() {
    this.disconnectSocket();
    this.connectSocket();
  }

  joinMeeting(user: socketuser, roomId: string) {
    this.peer = new Peer();
    this.peer.on('open', (id) => {
      console.log('peer ', id);
      this.socket.emit('join-meeting', {
        user: user,
        roomId: roomId,
        peerId: id,
      });
    });
  }

  disconnectSocket() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
