import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  combinedStream!: MediaStream;
  mediaRecorder!: MediaRecorder;
  recordedChunks: Blob[] = [];
  isRecording = signal(false);
  router = inject(Router);

  async startCapturingScreen(): Promise<MediaStream> {
    return await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false,
    });
  }

  async startCamera(): Promise<MediaStream> {
    return await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
      },
    });
  }

  async stopStream(stream: MediaStream): Promise<void> {
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
  }

  async startCapturingAudio(): Promise<MediaStream> {
    return await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
      },
      video: false,
    });
  }

  async startRecording() {
    if (!navigator.mediaDevices) {
      console.error('MediaDevices API not available');
      return;
    }

    this.recordedChunks = [];

    try {
      this.isRecording.set(true);
      const screenStream = await this.startCapturingScreen();
      const audioStream = await this.startCapturingAudio();

      if (!screenStream || !audioStream) {
        console.error('Failed to capture screen or audio');
        this.isRecording.set(false);

        return;
      }

      this.combinedStream = new MediaStream([
        ...screenStream.getTracks(),
        ...audioStream.getTracks(),
      ]);

      this.mediaRecorder = new MediaRecorder(this.combinedStream, {
        mimeType: 'video/webm;codecs=vp8,opus',
      });

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        this.isRecording.set(false);
        this.saveVideoUrl();
        this.router.navigate(['gallery']);
      };

      this.mediaRecorder.start(1000);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.stop();
    }

    this.isRecording.set(false);

    this.stopStream(this.combinedStream);
  }

  downloadVideo(url: string) {
    const a = document.createElement('a');
    a.href = url;
    a.download = 'screen-recording.webm';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  saveVideoUrl() {
    const recordedBlob = new Blob(this.recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(recordedBlob);

    const videoUrls = JSON.parse(
      localStorage.getItem('videoUrls') || '[]'
    ) as string[];

    videoUrls.unshift(url);

    localStorage.setItem('videoUrls', JSON.stringify(videoUrls));
  }
}
