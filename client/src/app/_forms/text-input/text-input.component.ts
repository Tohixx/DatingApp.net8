import { NgIf } from '@angular/common';
import { Component, input, Self } from '@angular/core';
import { ControlValueAccessor, Form, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';

// Custom text input component that integrates with Angular forms
@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.css'
})
export class TextInputComponent implements ControlValueAccessor {

  label = input<string>(''); // Input label text
  type = input<string>('text'); // Input type (text by default)

  constructor(@Self() public ngControl: NgControl){
    this.ngControl.valueAccessor = this; // Connects this component to Angular form control
  }

  // Called by Angular to write value to input
  writeValue(obj: any): void { }

  // Called by Angular to register change handler
  registerOnChange(fn: any): void { }

  // Called by Angular to register touched handler
  registerOnTouched(fn: any): void { }

  // Gets the FormControl instance
  get control(): FormControl {
    return this.ngControl.control as FormControl
  }
}
