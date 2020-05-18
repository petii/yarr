import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Subject, timer, Observable, interval, Subscription } from 'rxjs';

import { UsernameService } from '../services/username.service';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  public areas: string[]
  public retroItems: RetroItem[];

  public retroBoard = new Map<string, string[]>();

  private lastUpdate = new Date();

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
      http.get<UpdateType>(`${baseUrl}api/retro/items`).subscribe(result => this.processRetroItems(result));
    });

    usernameService.usernameSubject().subscribe({ next: newName => { console.log(`recieved ${newName}`); } });

    this.refreshTimer = interval(1000);
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
      this.retroBoard.get(publishedItem.area).push(publishedItem.text);
      this.removeItem(id);
    });
  }

  processRetroItems(update: UpdateType) {
    console.log(update)
    //console.log(typeof(update.serverTime));
    //console.log(typeof(update.items))
    //this.lastUpdate = update.serverTime;
    //update.items.forEach(item => { this.retroBoard.get(item.area).push(item.text); });
  }

  private timerSubscription: Subscription;

  ngOnInit() {
    this.timerSubscription = this.refreshTimer.subscribe(val => {
      this.http.get<Date>(`${this.baseUrl}api/retro/lastupdate`).subscribe(result => {
        console.log(`${result} > ${this.lastUpdate} = ${this.lastUpdate < result}`);
      });
    })
  }

  ngOnDestroy() {
    this.timerSubscription.unsubscribe();
  }

}

export class RetroItem {
  id?: number
  text: string;
  area: string;
}

interface UpdateType {
  serverTime: Date;
  items: PublishedRetroItem[];
}

interface PublishedRetroItem {
  area: string;
  text: string;
}

interface RetroSetup {
  areas: string[];
  votes: number;
}
