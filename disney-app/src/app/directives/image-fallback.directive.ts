import { Directive, ElementRef, HostListener, inject, input } from '@angular/core';

@Directive({
  selector: 'img[appImageFallback]'
})
export class ImageFallbackDirective {
  el = inject<ElementRef<HTMLImageElement>>(ElementRef);
  usedFallback = false;

  appImageFallback = input('/character-placeholder.svg', {
    alias: 'appImageFallback',
  });

  @HostListener('error')
  onError(): void {
    const img = this.el.nativeElement;
    const fallback = this.appImageFallback();
    if (!this.usedFallback && fallback) {
      this.usedFallback = true;
      img.src = fallback;
    }
  }
}
