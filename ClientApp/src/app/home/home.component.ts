import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  public areas: string[]
  public retroItems: RetroItem[];

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    http.get<string[]>(baseUrl + 'api/retro/areas').subscribe(result => {
      this.areas = result;

      let item1 = { text: "item1", area: this.areas[0] };
      let item2 = { text: "item2", area: this.areas[1] };
      let item3 = { text: "item3", area: this.areas[2] };
      this.retroItems = [item1, item2, item3];
    });
  };

  addItem(item : RetroItem) {
    this.retroItems.push(item);
  }
}

export class RetroItem {
  text: string;
  area: string;
}
