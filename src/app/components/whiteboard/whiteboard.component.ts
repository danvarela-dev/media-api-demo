import {
  AfterViewInit,
  Component,
  ElementRef,
  signal,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-whiteboard',
  templateUrl: './whiteboard.component.html',
  styleUrl: './whiteboard.component.scss',
})
export class WhiteboardComponent implements AfterViewInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  private canvasContext!: CanvasRenderingContext2D | null;

  protected isDrawing = false;
  protected isDrawingModeOn = false;

  ngAfterViewInit(): void {
    this.canvasContext = this.canvas.nativeElement.getContext('2d');

    if (this.canvasContext) {
      this.canvas.nativeElement.width = 500;
      this.canvas.nativeElement.height = 500;

      this.canvasContext.lineWidth = 1;
      this.canvasContext.lineCap = 'round';
      this.canvasContext.strokeStyle = 'black';
    }
  }

  toggleDrawing() {
    this.isDrawingModeOn = !this.isDrawingModeOn;
  }

  startDrawing(event: MouseEvent) {
    if (!this.isDrawingModeOn) {
      return;
    }

    this.isDrawing = true;

    if (!this.canvasContext) return;

    const { x, y } = this.getMousePosition(event);
    this.canvasContext.beginPath();
    this.canvasContext.moveTo(x, y);
  }

  draw(event: MouseEvent) {
    if (!this.isDrawing || !this.canvasContext) {
      return;
    }

    const { x, y } = this.getMousePosition(event);
    this.canvasContext.lineTo(x, y);
    this.canvasContext.stroke();
  }

  stopDrawing() {
    this.isDrawing = false;
    if (this.canvasContext) {
      this.canvasContext.beginPath();
    }
  }

  clearCanvas() {
    if (this.canvasContext) {
      this.canvasContext.clearRect(
        0,
        0,
        this.canvas.nativeElement.width,
        this.canvas.nativeElement.height
      );
    }
  }

  private getMousePosition(event: MouseEvent) {
    const canvas = this.canvas.nativeElement;
    const rect = canvas.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    return {
      x: x * (canvas.width / rect.width),
      y: y * (canvas.height / rect.height),
    };
  }
}
