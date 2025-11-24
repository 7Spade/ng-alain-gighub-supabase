/**
 * Context Menu Directive
 *
 * Provides right-click context menu functionality for blueprint elements
 * Following Angular 20+ and enterprise development guidelines
 *
 * @module contextmenu.directive
 */

import { Directive, ElementRef, HostListener, Output, EventEmitter, Input, inject } from '@angular/core';

export interface ContextMenuEvent {
  element: HTMLElement;
  x: number;
  y: number;
  data?: unknown;
}

@Directive({
  selector: '[appContextMenu]',
  standalone: true
})
export class ContextMenuDirective {
  private readonly el = inject(ElementRef);

  @Input() contextMenuEnabled = true;
  @Input() contextMenuData?: unknown;
  @Output() readonly contextMenu = new EventEmitter<ContextMenuEvent>();

  @HostListener('contextmenu', ['$event'])
  onContextMenu(event: MouseEvent): void {
    if (!this.contextMenuEnabled) return;

    event.preventDefault();
    event.stopPropagation();

    this.contextMenu.emit({
      element: this.el.nativeElement,
      x: event.clientX,
      y: event.clientY,
      data: this.contextMenuData
    });
  }
}
