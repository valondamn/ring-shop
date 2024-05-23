import {
  Component,
  forwardRef,
  HostBinding,
  HostListener,
  Input,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgClass } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => InputComponent),
    },
  ],
  standalone: true,
  imports: [AngularSvgIconModule, NgClass, FormsModule, TranslateModule],
})
export class InputComponent implements ControlValueAccessor {
  @Input() placeholder: string = '';
  @Input() label!: string;
  @Input() helper!: string;
  @Input() font: 'normal' | 'bold' = 'normal';
  @Input() size: 'small' | 'medium' | 'big' = 'medium';
  @Input() type: '' | 'search' = '';
  @Input() width: string = '';
  @Input() bgHidden: boolean = false;
  @Input() control!: AbstractControl | null;
  @Input() clearBtnShown: boolean = false;

  constructor(private sanitizer: DomSanitizer) {}

  value: string = '';
  disabled: boolean = false;
  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  clearValue() {
    this.value = '';
    this.onChange('');
  }

  @HostBinding('style') get myStyle(): SafeStyle {
    let width = this.width;
    return this.sanitizer.bypassSecurityTrustStyle(`
      width: ${width};    `);
  }

  @HostListener('keydown.enter', ['$event']) onEnter(
    event: KeyboardEvent
  ): void {
    event.preventDefault();
  }
}
