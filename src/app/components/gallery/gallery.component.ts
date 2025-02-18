import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MediaService } from '../../services/screen-recorder/media.service';

@Component({
  selector: 'app-gallery',
  imports: [RouterLink],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
})
export class GalleryComponent implements OnInit {
  videoUrls: string[] = [];

  mediaService = inject(MediaService);

  getVideoUrls(): void {
    this.videoUrls = JSON.parse(
      localStorage.getItem('videoUrls') || '[]'
    ) as string[];
  }

  ngOnInit(): void {
    this.getVideoUrls();
  }

  downloadVideo(url: string) {
    this.mediaService.downloadVideo(url);
  }
}
