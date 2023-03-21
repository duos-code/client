import { UserService } from 'src/app/core/services/user.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunicationService } from 'src/app/core/services/communication.service';
import { Code } from 'src/app/core/interfaces/code.interface';
import { Title } from '@angular/platform-browser';
import {
  faMicrophone,
  faMicrophoneSlash,
  faVideo,
  faVideoSlash,
  faPhoneFlip,
} from '@fortawesome/free-solid-svg-icons';
import { socketuser } from 'src/app/core/interfaces/socketuser.interface';

@Component({
  selector: 'app-room-page',
  templateUrl: './room-page.component.html',
  styleUrls: ['./room-page.component.css'],
})
export class RoomPageComponent implements OnInit {
  public roomId!: string;

  public myVideoStream!: any;
  public remoteVideoStream!: any;

  @ViewChild('myVideoRef') myVideoRef!: ElementRef;
  @ViewChild('remoteVideoRef') remoteVideoRef!: ElementRef;
  @ViewChild('remoteVideoBoxRef', { read: ElementRef })
  remoteVideoBoxRef!: ElementRef;

  public icons: any = {
    camera: faVideo,
    cameraOff: faVideoSlash,
    mic: faMicrophone,
    micOff: faMicrophoneSlash,
    phone: faPhoneFlip,
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

  private constraints = {
    audio: true,
    video: { width: 640, height: 360 },
  };

  public remoteUser!: socketuser;

  constructor(
    private communication: CommunicationService,
    private route: ActivatedRoute,
    private router: Router,
    public userService: UserService,
    private titleService: Title
  ) {}

  ngOnInit() {
    this.roomId = this.route.snapshot.paramMap.get('roomId') as string;
    if (!this.userService.user) {
      console.warn('login need');
      this.router.navigate([`/`]);
      return;
    }

    this.titleService.setTitle(`duoscode - ${this.roomId}`);

    this.communication.joinRoom(this.roomId);

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

    this.communication.socket.on('recived-remoteUser', (data) => {
      const { user } = data;
      console.log('remoteUser ', user);
      this.remoteUser = user as socketuser;
    });

    this.communication.socket.on('disconnected', () => {
      console.log('disconnected');
      if (!this.inMeeting) return;
      this.handleRemoteBoxShow(false);
      this.handelJoinMeeting();
    });
  }

  handleCallEnd() {
    window.location.reload();
  }

  handleRemoteBoxShow(show: boolean) {
    if (show) {
      try {
        this.remoteVideoBoxRef.nativeElement.style.display = 'block';
      } catch (err) {}
    } else {
      try {
        this.remoteVideoBoxRef.nativeElement.style.display = 'none';
      } catch (err) {}
    }
  }

  handleMyVideoStream() {
    navigator.mediaDevices
      .getUserMedia(this.constraints)
      .then((stream: any) => {
        this.myVideoStream = stream;
        this.myVideoRef.nativeElement.srcObject = this.myVideoStream;
        this.handleVideoAudio();
      })
      .catch((err) => {
        /* handle the error */
      });
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
    this.communication.joinMeeting(this.userService.user, this.roomId);
  }

  /**
   * call another peer user using peer id
   **/
  handlePeerCall(remotePeerId: string) {
    navigator.mediaDevices
      .getUserMedia(this.constraints)
      .then((stream: any) => {
        this.myVideoStream = stream;
        this.myVideoRef.nativeElement.srcObject = this.myVideoStream;

        this.handleVideoAudio();

        var call = this.communication.peer.call(remotePeerId, stream);
        call.on('stream', (remoteStream: any) => {
          this.remoteVideoStream = remoteStream;
          this.remoteVideoRef.nativeElement.srcObject = this.remoteVideoStream;
          this.remoteVideoRef.nativeElement.play();
          this.handleRemoteBoxShow(true);
        });
      })
      .catch((err) => {
        console.log('error on call ', err);
      });
  }

  /**
   * Answer call if Any Call is comming
   **/
  handlePeerAnswer() {
    this.communication.peer.on('call', (call) => {
      navigator.mediaDevices
        .getUserMedia(this.constraints)
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
            this.handleRemoteBoxShow(true);
          });
        })
        .catch((err) => {
          console.log('error on ans ', err);
        });
    });
  }

  /**
   * Handle Video Audio Check User Video Mic Status
   **/
  handleVideoAudio() {
    if (!this.videoOption.video) {
      this.handleCameraToggle();
    }

    if (!this.videoOption.audio) {
      this.handleMicToggle();
    }
  }

  /**
   * If any changed in code editor its emit socket
   **/
  handleAnyChangedEvent(code: any) {
    this.communication.socket.emit('code-change', {
      code: code,
      roomId: this.roomId,
    });
  }
}
