import { Component, Input, OnInit, OnDestroy, Inject } from '@angular/core';
import { Observable, Subscription, interval } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { PublishedRetroItem } from '../../home/home.component'
import { RetroItemsService } from '../../services/retroitems.service';

@Component({
  selector: 'retro-board',
  templateUrl: './board.component.html',
})
export class BoardComponent implements OnInit, OnDestroy {
  @Input() areas: string[]
  public retroBoard = new Map<string, string[]>();

  private itemSubscription: Subscription;

  constructor(
    private http: HttpClient, @Inject('BASE_URL') private baseUrl: string,
    private retroItemsService: RetroItemsService) { }

  processRetroItems(update: PublishedRetroItem[]) {
    console.log(update)
    this.areas.forEach(area => this.retroBoard.set(area, []));
    update.forEach(item => this.retroBoard.get(item.area).push(item.text));
  }

  ngOnInit() {
    this.itemSubscription = this.retroItemsService.itemsSubject.subscribe({
      next: (items: PublishedRetroItem[]) => this.processRetroItems(items)
    });
  }

  ngOnDestroy() {
    this.itemSubscription.unsubscribe();
  }
}
