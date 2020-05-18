import { Component, Input, OnInit, OnDestroy, Inject } from '@angular/core';
import { Observable, Subscription, interval } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { PublishedRetroItem } from '../../home/home.component'

@Component({
  selector: 'retro-board',
  templateUrl: './board.component.html',
})
export class BoardComponent implements OnInit, OnDestroy {
  @Input() areas: string[]
  public retroBoard = new Map<string, string[]>();

  private lastUpdate: Date;
  private refreshTimer: RefreshContainer;

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
    http.get<UpdateType>(`${baseUrl}api/retro/items`).subscribe(result => this.processRetroItems(result))
    this.refreshTimer = { timer: interval(1000), subscription: new Subscription() };
  }

  processRetroItems(update: UpdateType) {
    console.log(update)
    this.lastUpdate = new Date(Date.parse(update.timestamp));
    this.areas.forEach(area => this.retroBoard.set(area, []));
    update.items.forEach(item => this.retroBoard.get(item.area).push(item.text));
  }

  ngOnInit() {
    this.refreshTimer.subscription = this.refreshTimer.timer.subscribe(val => {
      this.http.get<string>(`${this.baseUrl}api/retro/lastupdate`).subscribe(result => {
        let recieved: Date = new Date(Date.parse(result));
        if (this.lastUpdate < recieved) {
          this.http.get<UpdateType>(`${this.baseUrl}api/retro/items`).subscribe(result => this.processRetroItems(result));
        }
      });
    })
  }

  ngOnDestroy() {
    this.refreshTimer.subscription.unsubscribe();
  }
}


export interface UpdateType {
  timestamp: string;
  items: PublishedRetroItem[];
}

class RefreshContainer {
  timer: Observable<number>;
  subscription: Subscription;
}
