// src/app/shop/shop.component.ts

import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LocalizationService } from '../../services/localization.service';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit, OnDestroy {
  header_1: string = '';
  text_1: string = '';

  private destroy$ = new Subject<void>();

  constructor(
    private cdr: ChangeDetectorRef,
    private localizationService: LocalizationService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    // Přihlásíme se k odběru změn překladů ve stejném stylu jako Academy/AboutUs
    this.localizationService.currentTranslations$
      .pipe(takeUntil(this.destroy$))
      .subscribe(translations => {
        if (translations) {
          this.header_1 = this.localizationService.getText('shop.header_1');
          this.text_1 = this.localizationService.getText('shop.text_1');

        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}