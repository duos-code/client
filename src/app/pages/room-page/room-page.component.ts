import { Socket } from 'socket.io-client';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunicationService } from 'src/app/core/services/communication.service';
import { Code } from 'src/app/core/interfaces/code.interface';

@Component({
  selector: 'app-room-page',
  templateUrl: './room-page.component.html',
  styleUrls: ['./room-page.component.css'],
})
export class RoomPageComponent {
  public roomId!: string;

  public myVideoStream!: any;
  public remoteStream!: any;

  @ViewChild('myVideoRef') myVideoRef!: ElementRef;
  @ViewChild('remoteVideoRef') remoteVideoRef!: ElementRef;

  public isMyCameraOn: boolean = true;

  public inMeeting: boolean = false;

  public codeModel: Code = {
    language: 'cpp',
    uri: 'main.c',
    value: '{}',
    input: '',
    output: 'Click on RUN button to see the output',
  };

  constructor(
    private communication: CommunicationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.roomId = this.route.snapshot.paramMap.get('roomId') as string;

    this.handleJoinRoom(this.roomId);

    this.communication.socket.on('joined-room', ({ roomId }) => {
      this.router.navigate([`/${roomId}`]);
    });

    this.communication.socket.on('join-room-error', ({ message }) => {
      console.log(message);
      this.router.navigate([`/`]);
    });

    this.communication.socket.on('joined-meeting', () => {
      console.log('joined-meeting');
      this.handlePeerAnswer();
      this.inMeeting = true;
    });

    this.communication.socket.on('joined-meeting-call', ({ peerId }) => {
      console.log('joined-meeting-call ', peerId);
      this.inMeeting = true;

      this.handlePeerCall(peerId);
    });

    this.communication.socket.on('code-change', ({ code }) => {
      if (this.codeModel.language != code.language) {
        this.codeModel.language = code.language;
      }

      if (this.codeModel.input != code.input) {
        this.codeModel.input = code.input;
      }

      if (this.codeModel.value != code.value) {
        this.codeModel.value = code.value;
      }
    });

    this.handleMyVideoStream();
  }

  handleMyVideoStream() {
    var constraints = {
      audio: true,
      video: { width: 640, height: 360 },
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream: any) => {
        this.myVideoStream = stream;
        this.myVideoRef.nativeElement.srcObject = this.myVideoStream;
      })
      .catch((err) => {
        /* handle the error */
      });
  }

  handleJoinRoom(roomId: string) {
    this.communication.joinRoom(roomId);
  }

  handleCameraToggle() {
    this.myVideoStream.getTracks().forEach((track: any) => {
      if (track.readyState == 'live' && track.kind === 'video') {
        track.enabled ? (track.enabled = false) : (track.enabled = true);
        track.enabled
          ? (this.isMyCameraOn = true)
          : (this.isMyCameraOn = false);
      }
    });
  }

  handleMicToggle() {
    this.myVideoStream.getTracks().forEach((track: any) => {
      if (track.readyState == 'live' && track.kind === 'audio') {
        track.enabled ? (track.enabled = false) : (track.enabled = true);
      }
    });
  }

  handelJoinMeeting(nameBox: any) {
    console.log(nameBox.value);
    this.communication.joinMeeting(nameBox.value, this.roomId);
  }

  handlePeerCall(remotePeerId: string) {
    var constraints = {
      audio: true,
      video: { width: 640, height: 360 },
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream: any) => {
        this.myVideoStream = stream;
        this.myVideoRef.nativeElement.srcObject = this.myVideoStream;

        var call = this.communication.peer.call(remotePeerId, stream);
        call.on('stream', (remoteStream: any) => {
          console.log('getting a call');
          this.remoteStream = remoteStream;
          this.remoteVideoRef.nativeElement.srcObject = this.remoteStream;
          this.remoteVideoRef.nativeElement.play();
        });
      })
      .catch((err) => {
        console.log('error on call ', err);
      });
  }

  handlePeerAnswer() {
    var constraints = {
      audio: true,
      video: { width: 640, height: 360 },
    };

    this.communication.peer.on('call', (call) => {
      console.log('getting a call');
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream: any) => {
          this.myVideoStream = stream;
          this.myVideoRef.nativeElement.srcObject = this.myVideoStream;

          call.answer(stream);
          call.on('stream', (remoteStream) => {
            this.remoteStream = remoteStream;
            this.remoteVideoRef.nativeElement.srcObject = this.remoteStream;
            this.remoteVideoRef.nativeElement.play();
          });
        })
        .catch((err) => {
          console.log('error on ans ', err);
        });
    });
  }

  handleAnyChangedEvent(code: any) {
    console.log('code-change event emit');
    this.communication.socket.emit('code-change', {
      code: code,
      roomId: this.roomId,
    });
  }
}
