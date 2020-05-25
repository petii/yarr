import { Component, Inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http'

@Component({
  selector: 'app-setup-component',
  templateUrl: './setup.component.html'
})
export class SetupComponent {
  setupForm: FormGroup;

  constructor(
    private http: HttpClient, @Inject('BASE_URL')
    private baseUrl: string,
    private fb: FormBuilder
  ) {
    this.setupForm = this.fb.group({
      votes: 5,
      areas: this.fb.array([this.fb.control('glad'), this.fb.control('sad')])
    });
  }

  getAreas() {
    let tmp = this.setupForm.controls.areas as FormArray;
    return tmp.controls;
  }

  updateRetroSettings() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let body = JSON.stringify(this.setupForm.value);
    console.log(`sent: ${body}`);
    this.http.put(this.baseUrl + 'api/retro/setup', body, { headers: headers }).subscribe(val => console.log(`got: ${val}`));
  }

  removeArea(id: number) {
    let areas = this.setupForm.controls.areas as FormArray;
    areas.removeAt(id);
  }

  newArea() {
    let areas = this.setupForm.controls.areas as FormArray;
    areas.push(this.fb.control(''));
  }
}

export interface RetroSetup {
  areas: string[];
  votes: number;
}
