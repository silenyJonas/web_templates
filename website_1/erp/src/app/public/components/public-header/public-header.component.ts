import { Component, OnInit, OnDestroy, HostListener, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LocalizationService } from '../../services/localization.service';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-public-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './public-header.component.html',
  styleUrls: ['./public-header.component.css']
})
export class PublicHeaderComponent implements OnInit, OnDestroy {
  navHome: string = '';
  navServices: string = '';
  navShop: string = '';
  navAcademy: string = '';
  navReferences: string = '';
  navFaq: string = '';
  langCz: string = '';
  langEn: string = '';
  langLabel: string = '';

  scrolled: boolean = false;
  isMenuOpen: boolean = false;
  logo: string = 'assets/images/logos/logo.png';
  currentLanguage$: Observable<string>;

  private destroy$ = new Subject<void>();

  constructor(
    public localizationService: LocalizationService,
    private cdr: ChangeDetectorRef
  ) {
    this.currentLanguage$ = this.localizationService.currentLanguage$;
  }

  ngOnInit(): void {
    this.localizationService.currentTranslations$
      .pipe(takeUntil(this.destroy$))
      .subscribe(translations => {
        if (translations) {
          this.navHome = this.localizationService.getText('navigation.home');
          this.navServices = this.localizationService.getText('navigation.services');
          this.navShop = this.localizationService.getText('navigation.shop');
          this.navAcademy = this.localizationService.getText('navigation.academy');
          this.navReferences = this.localizationService.getText('navigation.references');
          this.navFaq = this.localizationService.getText('navigation.faq');
          
          this.langCz = this.localizationService.getText('common.language_cz_short') || 'CZ';
          this.langEn = this.localizationService.getText('common.language_en_short') || 'EN';
          this.langLabel = this.localizationService.getText('common.language') || 'Language';

          this.cdr.detectChanges();
        }
      });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled = window.scrollY > 50;
    this.cdr.detectChanges();
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : 'auto';
    this.cdr.detectChanges();
  }

  closeMenu(): void {
    this.isMenuOpen = false;
    document.body.style.overflow = 'auto';
    this.cdr.detectChanges();
  }

  selectLanguage(lang: string): void {
    this.localizationService.setLanguage(lang);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    document.body.style.overflow = 'auto';
  }
}