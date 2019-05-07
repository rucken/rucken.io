import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { Angulartics2 } from 'angulartics2';
import { BindObservable } from 'bind-observable';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from 'ngx-gallery';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ModuleModel } from 'src/app/models/module.model';
import { PageModulesModel } from 'src/app/models/page-modules.model';

@Component({
  selector: 'app-module-preview',
  templateUrl: './module-preview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModulePreviewComponent implements OnChanges, OnInit {
  @Input()
  page: PageModulesModel<any>;
  @Input()
  maxActiveFeatures = 10;
  @Input()
  even = true;
  @Input()
  module: ModuleModel;

  @BindObservable()
  showAllFeatures = false;
  showAllFeatures$: Observable<boolean>;

  @BindObservable()
  images: NgxGalleryImage[];
  images$: Observable<NgxGalleryImage[]>;

  galleryOptions: NgxGalleryOptions[] = [
    {
      width: '100%',
      lazyLoading: true,
      thumbnailsColumns: 4,
      imageDescription: true,
      imageAnimation: NgxGalleryAnimation.Slide,
      imageSwipe: true,
      previewSwipe: true,
      previewZoom: true,
      previewCloseOnClick: true,
      previewCloseOnEsc: true,
      thumbnailsSwipe: true,
      previewKeyboardNavigation: true
    },
    // max-width 800
    {
      breakpoint: 800,
      width: '100%',
      lazyLoading: true,
      imageDescription: true,
      imageSwipe: true,
      previewSwipe: true,
      previewZoom: true,
      previewCloseOnEsc: true,
      imagePercent: 80,
      thumbnailsPercent: 20,
      thumbnailsMargin: 20,
      thumbnailMargin: 20,
      thumbnailsSwipe: true,
      previewKeyboardNavigation: true
    },
    // max-width 400
    {
      breakpoint: 400,
      lazyLoading: true,
      imageDescription: true,
      imageSwipe: true,
      previewSwipe: true,
      previewZoom: true,
      previewCloseOnEsc: true,
      thumbnailsSwipe: true,
      previewKeyboardNavigation: true
    }
  ];

  isXS$: Observable<boolean>;

  constructor(
    private mediaObserver: MediaObserver,
    private angulartics2: Angulartics2
  ) {
    this.isXS$ = this.mediaObserver.media$.pipe(
      map(change => change.mqAlias === 'xs' || change.mqAlias === 'sm')
    );
  }
  ngOnInit(): void {
    this.initImages(this.module.images || []);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.module && changes.module instanceof ModuleModel) {
      this.initImages(changes.module.images || []);
    }
  }
  onGalleryEvents(eventName: string, customData: any) {
    this.angulartics2.eventTrack.next({
      action: eventName,
      properties: {
        category: 'gallery',
        page: this.page.name,
        module: this.module.name,
        ...customData
      },
    });
  }
  initImages(images: {
    src: string;
    thumb?: string;
    description?: string;
  }[]) {
    this.images = images.map((image, index) => new NgxGalleryImage({
      small: image.thumb || image.src.replace('.png', '_thumb.png'),
      medium: image.src,
      big: image.src,
      description: image.description
    }));
  }
}
