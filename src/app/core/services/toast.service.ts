import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastService:ToastrService) { }

  info(message:string){
    let audio: HTMLAudioElement = new Audio('https://proxy.notificationsounds.com/notification-sounds/deduction-588/download/file-sounds-1135-deduction.mp3');
    audio.play();
    this.toastService.info("",message)
  }
}
