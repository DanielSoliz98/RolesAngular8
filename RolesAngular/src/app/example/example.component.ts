import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css']
})
export class ExampleComponent implements OnInit {

  countries = [
    { id: 1, name: "United States" },
    { id: 2, name: "Australia" },
    { id: 3, name: "Canada" },
    { id: 4, name: "Brazil" },
    { id: 5, name: "England" }
  ];
  form: FormGroup;

  constructor() {
    this.form = new FormGroup({
      country: new FormControl('', Validators.required),
      name: new FormControl({value: '', disabled: true})
    })
  }

  get country(): string {
    return this.form.get('country').value;
  }

  ngOnInit() {
    this.form.get('country').valueChanges.subscribe(  
      value=> {  
         this.form.get('name').setValue(value.name)
      }  
   ); 
  }

}
