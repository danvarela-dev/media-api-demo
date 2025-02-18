import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MediaService } from '../../services/screen-recorder/media.service';

@Component({
  selector: 'app-camera',
  imports: [],
  templateUrl: './camera.component.html',
  styleUrl: './camera.component.scss',
})
export class CameraComponent implements OnInit, OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;

  mediaService = inject(MediaService);

  private stream!: MediaStream;

  ngOnInit(): void {
    this.initCamera();
  }

  ngOnDestroy(): void {
    this.stopCamera();
  }

  async initCamera() {
    if (navigator.mediaDevices) {
      this.stream = await this.mediaService.startCamera();
      if (this.videoElement?.nativeElement) {
        this.videoElement.nativeElement.srcObject = this.stream;
      }
    }
  }

  stopCamera() {
    this.mediaService.stopStream(this.stream);
  }
}
