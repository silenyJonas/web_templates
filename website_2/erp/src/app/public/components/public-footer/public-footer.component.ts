import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LocalizationService } from '../../services/localization.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface FooterNavLink {
  route: string;
  text: string;
}

@Component({
  selector: 'app-public-footer',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './public-footer.component.html',
  styleUrls: ['./public-footer.component.css']
})
export class PublicFooterComponent implements OnInit, OnDestroy {
  currentYear: number = new Date().getFullYear();
  
  // Ikony
  tt_link = 'assets/images/icons/tik-tok.png';
  ig_link = 'assets/images/icons/ig.png';
  fb_link = 'assets/images/icons/fb.png';

  // Texty
  company_name_text = '';
  address_label_text = '';
  address_value_text = '';
  ico_label_text = '';
  ico_value_text = '';
  dic_label_text = '';
  dic_value_text = '';
  quick_links_header_text = '';
  contact_header_text = '';
  email_value_text = '';
  phone_value_text = '';
  legal_info_header_text = '';
  copyright_text = '';

  footerNavLinks: FooterNavLink[] = [];
  footerLegalLinks: FooterNavLink[] = [];

  private destroy$ = new Subject<void>();

  constructor(private localizationService: LocalizationService) {}

  ngOnInit(): void {
    this.localizationService.currentTranslations$
      .pipe(takeUntil(this.destroy$))
      .subscribe(translations => {
        if (translations) {
          this.company_name_text = this.localizationService.getText('footer.company_name');
          this.address_label_text = this.localizationService.getText('footer.address_label');
          this.address_value_text = this.localizationService.getText('footer.address_value');
          this.ico_label_text = this.localizationService.getText('footer.ico_label');
          this.ico_value_text = this.localizationService.getText('footer.ico_value');
          this.dic_label_text = this.localizationService.getText('footer.dic_label');
          this.dic_value_text = this.localizationService.getText('footer.dic_value');
          this.quick_links_header_text = this.localizationService.getText('footer.quick_links_header');
          this.contact_header_text = this.localizationService.getText('footer.contact_header');
          this.email_value_text = this.localizationService.getText('footer.email_value');
          this.phone_value_text = this.localizationService.getText('footer.phone_value');
          this.legal_info_header_text = this.localizationService.getText('footer.legal_info_header');
          
          this.loadLinks();
          
          const rawCopyright = this.localizationService.getText('footer.copyright_text');
          this.copyright_text = rawCopyright.replace('{year}', this.currentYear.toString());
        }
      });
  }

  private loadLinks(): void {
    const navKeys = [
      { route: '/home', key: 'navigation.home' },
      { route: '/services', key: 'navigation.services' },
      { route: '/shop', key: 'navigation.shop' },
      { route: '/academy', key: 'navigation.academy' },
    ];

    const legalKeys = [
      { route: '/privacy-policy', key: 'footer.privacy_policy' },
      { route: '/tos', key: 'footer.terms_of_service' }
    ];

    this.footerNavLinks = navKeys.map(k => ({ route: k.route, text: this.localizationService.getText(k.key) }));
    this.footerLegalLinks = legalKeys.map(k => ({ route: k.route, text: this.localizationService.getText(k.key) }));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}