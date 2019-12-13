import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css']
})
export class ExampleComponent implements OnInit {

  rooms = [
    { id: 1, sound: { name: "normal" }, format: { name: "3d" } },
    { id: 2, sound: { name: "atmos" }, format: { name: "2d" } },
    { id: 3, sound: { name: "normal" }, format: { name: "2d" } },
    { id: 4, sound: { name: "atmos" }, format: { name: "3d" } }
  ];
  form: FormGroup;

  constructor() {
    this.form = new FormGroup({
      room: new FormControl('', Validators.required),
      format: new FormControl({ value: '', disabled: true }),
      sound: new FormControl({ value: '', disabled: true })
    })
  }

  get room(): string {
    return this.form.get('room').value;
  }

  ngOnInit() {
    this.form.get('room').valueChanges.subscribe(
      value => {
        this.form.get('sound').setValue(value.sound['name'])
        this.form.get('format').setValue(value.format['name'])
      }
    );
  }

}
