/**
 * Draggable Zone Directive
 *
 * Enables drag-and-drop functionality for blueprint canvas elements
 * Following Angular 20+ and enterprise development guidelines
 *
 * @module draggable-zone.directive
 */

import { Directive, ElementRef, HostListener, Output, EventEmitter, Input, inject } from '@angular/core';

export interface DragEvent {
  element: HTMLElement;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

@Directive({
  selector: '[appDraggableZone]',
  standalone: true
})
export class DraggableZoneDirective {
  private readonly el = inject(ElementRef);

  @Input() dragEnabled = true;
  @Output() readonly dragStart = new EventEmitter<DragEvent>();
  @Output() readonly dragMove = new EventEmitter<DragEvent>();
  @Output() readonly dragEnd = new EventEmitter<DragEvent>();

  private isDragging = false;
  private startX = 0;
  private startY = 0;

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    if (!this.dragEnabled) return;

    this.isDragging = true;
    this.startX = event.clientX;
    this.startY = event.clientY;

    this.dragStart.emit({
      element: this.el.nativeElement,
      startX: this.startX,
      startY: this.startY,
      currentX: event.clientX,
      currentY: event.clientY
    });

    event.preventDefault();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging) return;

    this.dragMove.emit({
      element: this.el.nativeElement,
      startX: this.startX,
      startY: this.startY,
      currentX: event.clientX,
      currentY: event.clientY
    });
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    if (!this.isDragging) return;

    this.isDragging = false;

    this.dragEnd.emit({
      element: this.el.nativeElement,
      startX: this.startX,
      startY: this.startY,
      currentX: event.clientX,
      currentY: event.clientY
    });
  }
}
