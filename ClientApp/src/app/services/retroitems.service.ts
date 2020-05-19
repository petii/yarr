import { Injectable, Inject } from '@angular/core';
import { Subject, Observable, Subscription, interval } from 'rxjs'
import { HttpClient } from '@angular/common/http';

import { PublishedRetroItem } from '../home/home.component';

@Injectable({
  providedIn: 'root',
})
export class RetroItemsService {
  public itemsSubject = new Subject<PublishedRetroItem[]>();
  public items: PublishedRetroItem[] = [];

  private lastUpdate: Date;
  private refreshTimer: RefreshContainer;


  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
    this.fetchNew();
    this.refreshTimer = { timer: interval(1000), subscription: new Subscription() };
    this.refreshTimer.subscription = this.refreshTimer.timer.subscribe(val => this.checkUpToDate());
  }

  pingItems() {
    this.itemsSubject.next(this.items);
  }

  checkUpToDate() {
    this.http.get<string>(`${this.baseUrl}api/retro/lastupdate`).subscribe(updateResult => {
      let recieved: Date = new Date(Date.parse(updateResult));
      if (this.lastUpdate < recieved) {
        this.fetchNew();
      }
    });
  }

  fetchNew() {
    this.http.get<UpdateType>(`${this.baseUrl}api/retro/items`).subscribe(result => {
      this.lastUpdate = new Date(Date.parse(result.timestamp));
      this.items = result.items;
      this.pingItems();
    });
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
