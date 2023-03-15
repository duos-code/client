import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Peer } from 'peerjs';

@Injectable({
  providedIn: 'root',
})
export class CommunicationService {
  public socket!: Socket;
  public peer!: Peer;

  constructor() {
    this.connectSocket();
  }

  connectSocket() {
    this.socket = io(
      'https://expresssimpledyctjt-xcjo--3000.local-credentialless.webcontainer.io/'
    );
    this.socket.on('connect', () => {
      console.log(`socket id ${this.socket.id}`);
    });
  }

  joinMeeting(user: string, roomId: string) {
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

  joinRoom(roomId: string) {
    var data: any = {
      roomId: roomId,
    };

    this.socket.emit('join-room', data);
  }

  createRoom() {
    this.socket.emit('create-room');
  }
}
