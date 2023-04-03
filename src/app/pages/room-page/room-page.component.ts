import { ToastService } from './../../core/services/toast.service';
import { UserService } from 'src/app/core/services/user.service';
import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
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
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons';
import { socketuser } from 'src/app/core/interfaces/socketuser.interface';

@Component({
  selector: 'app-room-page',
  templateUrl: './room-page.component.html',
  styleUrls: ['./room-page.component.css'],
})
export class RoomPageComponent implements OnInit {
  public roomId!: string;

  @ViewChild('myProfilePicRef') myProfilePicRef!: ElementRef;
  @ViewChild('myVideoRef') myVideoRef!: ElementRef;
  @ViewChild('remoteVideoRef') remoteVideoRef!: ElementRef;
  @ViewChild('remoteVideoBoxRef', { read: ElementRef })
  remoteVideoBoxRef!: ElementRef;

  @ViewChild('messageBox') messageBoxRef!: ElementRef;

  public icons: any = {
    camera: faVideo,
    cameraOff: faVideoSlash,
    mic: faMicrophone,
    micOff: faMicrophoneSlash,
    phone: faPhoneFlip,
    send: faPaperPlane,
  };

  public myVideoStream!: any;
  public myVideoOption: any = {
    video: false,
    audio: false,
  };

  public remoteVideoStream!: any;
  public remoteVideoOption: any = {
    video: true,
    audio: true,
  };

  public inMeeting: boolean = false;
  public inRoom: boolean = false;

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

  public roomMessages: Array<any> = [];

  public remoteUser!: socketuser;

  constructor(
    private communication: CommunicationService,
    private route: ActivatedRoute,
    private router: Router,
    public userService: UserService,
    private titleService: Title,
    private toastr: ToastService,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    // Reset Socket
    this.communication.resetSocket();

    this.roomId = this.route.snapshot.paramMap.get('roomId') as string;
    if (!this.userService.user) {
      console.warn('login need');
      this.router.navigate([`/`]);
      return;
    }

    // Set Page Titel as Room ID or Code
    this.titleService.setTitle(`duoscode - ${this.roomId}`);

    // Join the room with room Id
    this.JoinRoom(this.roomId);

    this.onJoinedRoom();

    this.onRoomJoinError();

    // Join Meeting
    this.onJoinedMeeting();
    this.onRemoteUserJoinedMeeting();
    this.onRecivedRemoteUserData();

    this.onCodeChanged();

    this.onRecivedMessage();

    this.onRemoteUserDisconnected();
  }

  JoinRoom(roomId: string) {
    this.communication.socket.emit('join-room', { roomId: roomId });
  }

  onJoinedRoom() {
    this.communication.socket.on('joined-room', ({ roomId }) => {
      this.router.navigate([`/${roomId}`]);
      setTimeout(() => {
        this.createCamStream();
        this.inRoom = true;
      }, 2000);
    });
  }

  onRoomJoinError() {
    this.communication.socket.on('join-room-error', ({ message }) => {
      this.toastr.info(message);
      this.router.navigate([`/`]);
    });
  }

  onJoinedMeeting() {
    this.communication.socket.on('joined-meeting', () => {
      this.handlePeerAnswer();
      this.inMeeting = true;
    });

    this.communication.socket.on('joined-meeting-call', ({ peerId }) => {
      this.inMeeting = true;
      this.handlePeerCall(peerId);
    });
  }

  onRemoteUserJoinedMeeting() {
    this.communication.socket.on('new-user-joined', ({ user }) => {
      this.remoteUser = user as socketuser;
      if (this.inMeeting) this.toastr.info(`${user.name} Joined`);
    });
  }

  onRecivedRemoteUserData() {
    this.communication.socket.on('recived-existed-user', ({ user }) => {
      this.remoteUser = user as socketuser;
    });
  }

  onCodeChanged() {
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

  onRecivedMessage() {
    this.communication.socket.on(
      'recived-message',
      ({ text, username, time }) => {
        this.roomMessages.push({ text, username, time });
      }
    );
  }

  onRemoteUserDisconnected() {
    this.communication.socket.on('disconnected', ({ user }) => {
      if (this.inMeeting) this.toastr.info(`${user.name} has left the meeting`);

      if (!this.inMeeting) return;
      this.handleRemoteBoxShow(false);
      this.handelJoinMeeting();
    });
  }

  /**
   *  Chat Box Scroll End
   */
  ngAfterViewChecked() {
    try {
      this.messageBoxRef.nativeElement.scrollTop =
        this.messageBoxRef.nativeElement.scrollHeight;
    } catch (err) {
      // console.error(err);
    }
  }

  handelJoinMeeting() {
    this.communication.joinMeeting(this.userService.user, this.roomId);
  }

  handleCallEnd() {
    this.communication.disconnectSocket();
    this.router.navigate(['/']);
  }

  handleRemoteBoxShow(show: boolean) {
    try {
      if (show) this.remoteVideoBoxRef.nativeElement.style.display = 'block';
      else this.remoteVideoBoxRef.nativeElement.style.display = 'none';
    } catch (error) {}
  }

  createCanvsStream(): any {
    var imageElt = this.renderer.createElement('img');
    imageElt.src = this.userService.user.photoUrl;

    var canvasElt = this.renderer.createElement('canvas');
    var ctx = canvasElt.getContext('2d');
    ctx.drawImage(imageElt, 100, 100);

    var stream = canvasElt.captureStream(10);
    this.myVideoStream = stream;
    this.myVideoRef.nativeElement.srcObject = this.myVideoStream;
    this.handleVideoAudio();
  }

  async createCamStream(): Promise<any> {
    await navigator.mediaDevices
      .getUserMedia(this.constraints)
      .then((stream: any) => {
        this.myVideoStream = stream;
        this.myVideoRef.nativeElement.srcObject = this.myVideoStream;
        this.handleVideoAudio();
      })
      .catch((err) => {
        this.createCanvsStream();
      });
  }

  createRemoteCamStream(remoteStream: any) {
    this.remoteVideoStream = remoteStream;
    this.remoteVideoRef.nativeElement.srcObject = this.remoteVideoStream;
    this.remoteVideoRef.nativeElement.play();
    this.handleRemoteBoxShow(true);
  }

  /**
   * Handle Video Audio Check User Video Mic Status
   **/
  handleVideoAudio() {
    if (!this.myVideoOption.video) {
      this.videoStreamToggle(this.myVideoStream, this.myVideoOption);
    }

    if (!this.myVideoOption.audio) {
      this.audioStreamToggle(this.myVideoStream, this.myVideoOption);
    }
  }

  videoStreamToggle(videoStream: any, videoOption: any) {
    videoStream.getTracks().forEach((track: any) => {
      if (track.readyState == 'live' && track.kind === 'video') {
        track.enabled ? (track.enabled = false) : (track.enabled = true);
        track.enabled
          ? (videoOption.video = true)
          : (videoOption.video = false);
      }
    });
  }

  audioStreamToggle(videoStream: any, videoOption: any) {
    videoStream.getTracks().forEach((track: any) => {
      if (track.readyState == 'live' && track.kind === 'audio') {
        track.enabled ? (track.enabled = false) : (track.enabled = true);
        track.enabled
          ? (videoOption.audio = true)
          : (videoOption.audio = false);
      }
    });
  }

  /**
   * call another peer user using peer id
   **/
  async handlePeerCall(remotePeerId: string) {
    await this.createCamStream();
    var call = this.communication.peer.call(remotePeerId, this.myVideoStream);
    call.on('stream', (remoteStream: any) => {
      this.createRemoteCamStream(remoteStream);
    });
  }

  /**
   * Answer call if Any Call is comming
   **/
  async handlePeerAnswer() {
    await this.createCamStream();
    this.communication.peer.on('call', (call) => {
      call.answer(this.myVideoStream);
      call.on('stream', (remoteStream: any) => {
        this.createRemoteCamStream(remoteStream);
      });

      this.handleAnyCodeEditorChangedEvent(this.codeModel);
    });
  }

  /**
   * If any changed in code editor its emit socket
   **/
  handleAnyCodeEditorChangedEvent(code: any) {
    if (code == this.newCode) return;

    this.communication.socket.emit('code-change', {
      code: code,
      roomId: this.roomId,
    });
  }

  /**
   * Send Message
   **/
  handleSendMessage(messageBox: any) {
    if (messageBox.value == '') return;

    this.communication.socket.emit('send-message', {
      text: messageBox.value,
      username: this.userService.user.name,
      room: this.roomId,
    });
    messageBox.value = '';
  }

  ngOnDestroy() {
    this.communication.disconnectSocket();
  }
}
