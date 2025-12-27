import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalizationService } from '../../services/localization.service';
import { PublicDataService } from '../../services/public-data.service';
import { GenericFormComponent } from '../../components/generic-form/generic-form.component';
import { FormFieldConfig } from '../../../shared/interfaces/form-field-config';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-home', // Opraven selektor pro Home
  standalone: true,
  imports: [CommonModule, GenericFormComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  header_1: string = '';
  text_1: string = '';

  form_header: string = '';
  form_description: string = '';
  form_button: string = '';
  
  form_consent: string = '';
  form_privacy_link: string = '';
  
  contactFormConfig: FormFieldConfig[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private localizationService: LocalizationService,
    private publicDataService: PublicDataService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.localizationService.currentTranslations$
      .pipe(takeUntil(this.destroy$))
      .subscribe(translations => {
        if (translations) {
          // Home texty (změněno z academy na home klíče)
          this.header_1 = this.localizationService.getText('home.header_1');
          this.text_1 = this.localizationService.getText('home.text_1');

          // Texty nad formulářem (můžeš použít home klíče nebo nechat tyto, pokud existují)
          this.form_header = this.localizationService.getText('form.form_1.header');
          this.form_description = this.localizationService.getText('form.form_1.description');
          
          // Načtení klíčů z form.form_1 (včetně opravených cest pro souhlasy)
          this.form_button = this.localizationService.getText('form.form_1.button_text');
          this.form_consent = this.localizationService.getText('form.form_1.consent');
          this.form_privacy_link = this.localizationService.getText('form.form_1.privacy_policy_link');

          this.setupFormConfig();
          this.cdr.detectChanges();
        }
      });
  }

  private setupFormConfig(): void {
    this.contactFormConfig = [
      {
        label: this.localizationService.getText('form.form_1.topic_label'),
        name: 'thema',
        type: 'select',
        required: true,
        value: 'Obecný dotaz',
        options: [
          { value: 'Web', label: this.localizationService.getText('form.form_1.topic_1') },
          { value: 'Desktop', label: this.localizationService.getText('form.form_1.topic_2') },
          { value: 'AI', label: this.localizationService.getText('form.form_1.topic_3') },
          { value: 'Other', label: this.localizationService.getText('form.form_1.topic_other') }
        ]
      },
      {
        label: this.localizationService.getText('form.form_1.email_label'),
        name: 'contact_email',
        type: 'email',
        required: true,
        placeholder: this.localizationService.getText('form.form_1.email_placeholder'),
        pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'
      },
      {
        label: this.localizationService.getText('form.form_1.phone_label'),
        name: 'contact_phone',
        type: 'tel',
        required: false,
        placeholder: this.localizationService.getText('form.form_1.phone_placeholder')
      },
      {
        label: this.localizationService.getText('form.form_1.description_label'),
        name: 'order_description',
        type: 'textarea',
        required: true,
        rows: 5,
        placeholder: this.localizationService.getText('form.form_1.description_placeholder')
      }
    ];
  }

  handleFormSubmission(formData: any): void {
    // Error při odesílání může být způsoben chybějícím polem thema v backendu 
    // nebo špatnou strukturou JSONu.
    this.publicDataService.submitContactForm(formData).subscribe({
      next: (res) => {
        console.log('Formulář úspěšně odeslán', res);
      },
      error: (err) => {
        console.error('Chyba při odesílání formuláře:', err);
      }
    });
  }

  handleFormReset(): void { }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}