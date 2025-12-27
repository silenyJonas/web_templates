// src/app/academy/academy.component.ts

import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalizationService } from '../../services/localization.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-academy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './academy.component.html',
  styleUrls: ['./academy.component.css']
})
export class AcademyComponent implements OnInit, OnDestroy {

  header_1: string = '';
  text_1: string = '';

  private destroy$ = new Subject<void>();

  constructor(
    private localizationService: LocalizationService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // Přihlásíme se k odběru změn překladů
    this.localizationService.currentTranslations$
      .pipe(takeUntil(this.destroy$))
      .subscribe(translations => {
        if (translations) {
          
          this.header_1 = this.localizationService.getText('academy.header_1');
          this.text_1 = this.localizationService.getText('academy.text_1');

          // Nutné pro OnPush strategii, aby se UI aktualizovalo po načtení překladů
          this.cdr.detectChanges();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}