import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-setup-component',
  templateUrl: './setup.component.html'
})
export class SetupComponent {
  public areas: AreaEntry[];
  public votes: number = 5;

  constructor() {
    this.areas = [{ id: 1, name: 'gladd' }, { id: 2, name: 'sadd' }, { id: 3, name: 'ideaa' }];
  }

  updateRetroSettings(newSettings: NgForm) {

  }

  removeArea(id: number) {
    console.log(`removeArea(${id})`);
  }

  newArea() {
    this.areas.push({
      id: Math.max(this.areas.length + 1, this.areas.slice(-1)[0].id + 1),
      name: '',
    });
  }
}

interface AreaEntry {
  id: number;
  name: string;
}
