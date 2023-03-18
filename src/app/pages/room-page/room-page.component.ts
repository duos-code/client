import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunicationService } from 'src/app/core/services/communication.service';
import { Code } from 'src/app/core/interfaces/code.interface';
import {
  faMicrophone,
  faMicrophoneSlash,
  faCamera,
  faCameraRotate,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-room-page',
  templateUrl: './room-page.component.html',
  styleUrls: ['./room-page.component.css'],
})
export class RoomPageComponent {
  public roomId!: string;

  public myVideoStream!: any;
  public remoteVideoStream!: any;

  @ViewChild('myVideoRef') myVideoRef!: ElementRef;
  @ViewChild('remoteVideoRef') remoteVideoRef!: ElementRef;

  public icons: any = {
    camera: faCamera,
    cameraOff: faCameraRotate,
    mic: faMicrophone,
    micOff: faMicrophoneSlash,
  };

  public videoOption: any = {
    video: false,
    audio: false,
  };

  public remoteVideoOption: any = {
    video: true,
    audio: true,
  };

  public inMeeting: boolean = false;

  public codeModel: Code = {
    uri: 'main.c',
    value: '',
    input: '',
    output: 'Click on RUN button to see the output',
    editorOptions: { theme: 'vs-light', language: 'c' },
  };

  public newCode: string = '';

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
      this.handleMyVideoStream();
    });

    this.communication.socket.on('join-room-error', ({ message }) => {
      this.router.navigate([`/`]);
    });

    this.communication.socket.on('joined-meeting', () => {
      this.handlePeerAnswer();
      this.inMeeting = true;
      this.handleMyVideoStream();
    });

    this.communication.socket.on('joined-meeting-call', ({ peerId }) => {
      this.inMeeting = true;
      this.handlePeerCall(peerId);
    });

    this.communication.socket.on('code-change', ({ code }) => {
      if (
        this.codeModel.editorOptions.language != code.editorOptions.language
      ) {
        this.codeModel.editorOptions.language = code.editorOptions.language;
      }

      if (this.codeModel.input != code.input) {
        this.codeModel.input = code.input;
      }

      if (this.codeModel.value != code.value) {
        this.codeModel.value = code.value;
        this.newCode = code.value;
      }
      if (this.codeModel.output != code.output) {
        this.codeModel.output = code.output;
      }
    });
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
        console.log(this.myVideoStream);
        console.log(this.myVideoStream.active);
        this.handleVideoAudio();
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
          ? (this.videoOption.video = true)
          : (this.videoOption.video = false);
      }
    });
  }

  handleRemoteCameraToggle() {
    this.remoteVideoStream.getTracks().forEach((track: any) => {
      if (track.readyState == 'live' && track.kind === 'video') {
        track.enabled ? (track.enabled = false) : (track.enabled = true);
        track.enabled
          ? (this.remoteVideoOption.video = true)
          : (this.remoteVideoOption.video = false);
      }
    });
  }

  handleMicToggle() {
    this.myVideoStream.getTracks().forEach((track: any) => {
      if (track.readyState == 'live' && track.kind === 'audio') {
        track.enabled ? (track.enabled = false) : (track.enabled = true);
        track.enabled
          ? (this.videoOption.audio = true)
          : (this.videoOption.audio = false);
      }
    });
  }

  handleRemoteMicToggle() {
    this.remoteVideoStream.getTracks().forEach((track: any) => {
      if (track.readyState == 'live' && track.kind === 'audio') {
        track.enabled ? (track.enabled = false) : (track.enabled = true);
        track.enabled
          ? (this.remoteVideoOption.audio = true)
          : (this.remoteVideoOption.audio = false);
      }
    });
  }

  handelJoinMeeting() {
    this.communication.joinMeeting('My Name', this.roomId);
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

        this.handleVideoAudio();

        var call = this.communication.peer.call(remotePeerId, stream);
        call.on('stream', (remoteStream: any) => {
          this.remoteVideoStream = remoteStream;
          this.remoteVideoRef.nativeElement.srcObject = this.remoteVideoStream;
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
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream: any) => {
          this.myVideoStream = stream;
          this.myVideoRef.nativeElement.srcObject = this.myVideoStream;

          this.handleVideoAudio();

          call.answer(stream);
          call.on('stream', (remoteStream) => {
            this.remoteVideoStream = remoteStream;
            this.remoteVideoRef.nativeElement.srcObject =
              this.remoteVideoStream;
            this.remoteVideoRef.nativeElement.play();
          });
        })
        .catch((err) => {
          console.log('error on ans ', err);
        });
    });
  }

  handleVideoAudio() {
    if (!this.videoOption.video) {
      this.handleCameraToggle();
    }

    if (!this.videoOption.audio) {
      this.handleMicToggle();
    }
  }

  handleAnyChangedEvent(code: any) {
    this.communication.socket.emit('code-change', {
      code: code,
      roomId: this.roomId,
    });
  }
}
