import { Component, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgForm } from '@angular/forms';

import { UsernameService } from '../services/username.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  public areas: string[]
  public retroItems: RetroItem[];

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string,
    private usernameService: UsernameService) {
    http.get<RetroSetup>(`${baseUrl}api/retro/setup`).subscribe(result => {
      this.areas = result.areas;
      this.retroItems = this.areas.map((value, index) => {
        return { id: index, text: `item${index}`, area: value };
      });
    });

    usernameService.usernameSubject().subscribe({ next: newName => { console.log(`recieved ${newName}`); } });
  };

  addItem(newitemForm: NgForm) {
    let item = newitemForm.value;
    let currentItemCount = this.retroItems.length;
    item.id = this.retroItems.length + 1;
    if (this.retroItems.length > 0) {
      item.id = Math.max(item.id, this.retroItems.slice(-1)[0].id + 1);
    }
    this.retroItems.push(item);
    newitemForm.reset();
  }

  removeItem(id: number) {
    this.retroItems = this.retroItems.filter(item => item.id != id);
  }

  publishItem(id: number) {
    let tmp = this.retroItems.filter(item_ => item_.id == id)[0];

    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let publishedItem: PublishedRetroItem = { area: tmp.area, text: tmp.text };
    console.log(JSON.stringify(publishedItem));
    // TODO: error case
    this.http.post(`${this.baseUrl}api/retro/publish`, JSON.stringify(publishedItem), { headers: headers }).subscribe(result => {
      this.removeItem(id);
    });
  }
}

export interface PublishedRetroItem {
  area: string;
  text: string;
}

class RetroItem {
  id?: number
  text: string;
  area: string;
}

interface RetroSetup {
  areas: string[];
  votes: number;
}
