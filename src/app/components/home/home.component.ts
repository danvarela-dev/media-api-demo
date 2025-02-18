import { Component, inject } from '@angular/core';
import { MediaService } from '../../services/screen-recorder/media.service';
import { CameraComponent } from '../camera/camera.component';
import { WhiteboardComponent } from '../whiteboard/whiteboard.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CameraComponent, WhiteboardComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  screenRecorderService = inject(MediaService);
  isRecording = this.screenRecorderService.isRecording;

  startRecording() {
    if (this.isRecording()) {
      return;
    }

    this.screenRecorderService
      .startRecording()
      .then(() => {
        console.log('start recording');
      })
      .catch((err) => {
        console.error(err);
      });
  }

  stopRecording() {
    if (!this.isRecording()) {
      return;
    }

    this.screenRecorderService.stopRecording();
  }
}
