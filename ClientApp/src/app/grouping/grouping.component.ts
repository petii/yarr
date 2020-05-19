import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { RetroItemsService } from '../services/retroitems.service';
import { PublishedRetroItem } from '../home/home.component';

@Component({
  selector: 'retro-grouping-board',
  templateUrl: './grouping.component.html',
})
export class GroupingComponent implements OnInit, OnDestroy {

  private itemSubscription: Subscription;

  public areas = new Set<string>();
  public retroBoard = new Map<string, string[]>();

  constructor(private retroItemService: RetroItemsService) { }

  ngOnInit() {
    this.itemSubscription = this.retroItemService.itemsSubject.subscribe({
      next: (items: PublishedRetroItem[]) => {
        this.areas = new Set<string>(items.map(item => item.area));
        this.areas.forEach(area => this.retroBoard.set(area, []));
        items.forEach(item => this.retroBoard.get(item.area).push(item.text));
      }
    });
    this.retroItemService.pingItems();
  }

  ngOnDestroy() {
    this.itemSubscription.unsubscribe();
  }
}

class GroupItems {
  item: PublishedRetroItem;
  group: string;
}
