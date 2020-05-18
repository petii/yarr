import { Component, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Subject, timer, Observable } from 'rxjs';

import { UsernameService } from '../services/username.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  public areas: string[]
  public retroItems: RetroItem[];

  public retroBoard = new Map<string, string[]>();

  private refreshTimer: Observable<number>;

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string,
    private usernameService: UsernameService) {
    http.get<RetroSetup>(`${baseUrl}api/retro/setup`).subscribe(result => {
      this.areas = result.areas;
      this.retroItems = this.areas.map((value, index) => {
        return { id: index, text: `item${index}`, area: value };
      });
      result.areas.forEach(area => this.retroBoard.set(area, []));
      console.log(this.retroBoard);
    });

    usernameService.usernameSubject().subscribe({ next: newName => { console.log(`recieved ${newName}`); } });

    this.refreshTimer = timer(100, 1000);
    this.refreshTimer.subscribe(val => {
      //console.log(val);
      http.get(`${baseUrl}api/retro/lastupdate`).subscribe(result => console.log(result));
    })
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
    this.http.post(`${this.baseUrl}api/retro/publish`, JSON.stringify(publishedItem), { headers : headers }).subscribe(result => {
      this.retroBoard.get(publishedItem.area).push(publishedItem.text);
      this.removeItem(id);
    });
  }
}

export class RetroItem {
  id?: number
  text: string;
  area: string;
}

interface PublishedRetroItem {
  area: string;
  text: string;
}

interface RetroSetup {
  areas: string[];
  votes: number;
}
