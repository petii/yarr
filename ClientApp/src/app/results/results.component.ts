import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { Subscription } from 'rxjs';

import { RetroItemsService, PublishedRetroItem } from '../services/retroitems.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'retro-grouping-board',
  templateUrl: './results.component.html',
})
export class ResultsComponent implements OnInit, OnDestroy {
  constructor(private retroItemService : RetroItemsService){}

  private itemSubscription: Subscription;
  private items : PublishedRetroItem[] = [];

  ngOnInit() {
    this.itemSubscription = this.retroItemService.itemsSubject.subscribe({
      next: (items: PublishedRetroItem[]) => {
        console.log(items);
        this.items = items;
      }
    });
    this.retroItemService.pingItems();
  }
  
  ngOnDestroy() {
    this.itemSubscription.unsubscribe();
  }
}

export interface Group {
  id?: number;
  name: string;
}
