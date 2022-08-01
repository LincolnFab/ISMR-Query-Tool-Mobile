import { Directive, HostListener, Input, OnInit, Renderer2 } from '@angular/core';
import { DomController } from '@ionic/angular'

@Directive({
  selector: '[appHideHeader]'
})
export class HideHeaderDirective implements OnInit {

  @Input('appHideHeader') toolbar: any;
  private toolbarHeight: number;

  constructor(private renderer: Renderer2, private domCtrl: DomController) { }

  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async ngOnInit() {
    await this.sleep(500);
    // console.log("Test: ", this.toolbar)
    this.toolbar = this.toolbar.el;

    this.domCtrl.read(() => {
      this.toolbarHeight = this.toolbar.clientHeight;
      // console.log(this.toolbarHeight);
    });
  }

  @HostListener('ionScroll', ['$event']) onContentScroll($event) {
    const scrollTop = $event.detail.scrollTop;
    let newPosition = (scrollTop / 5);

    if (newPosition > this.toolbarHeight) {
      newPosition = this.toolbarHeight;
    }

    let newOpacity = 1 - (newPosition / this.toolbarHeight)

    this.domCtrl.write(() => {
      this.renderer.setStyle(this.toolbar, 'top', -newPosition + 'px');
      this.renderer.setStyle(this.toolbar, 'margin-bottom', -newPosition + 'px');
      this.renderer.setStyle(this.toolbar, 'opacity', newOpacity);
    });
  }
}