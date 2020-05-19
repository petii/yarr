import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { UsernameService } from '../services/username.service';
import { RetroItemsService } from '../services/retroitems.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  public areas: string[];
  private items: PublishedRetroItem[];

  private itemSubscription: Subscription;


  constructor(
    private http: HttpClient, @Inject('BASE_URL') private baseUrl: string,
    private usernameService: UsernameService,
    public retroItemsService: RetroItemsService
  ) {
    http.get<RetroSetup>(`${baseUrl}api/retro/setup`).subscribe(result => {
      this.areas = result.areas;
    });


    this.usernameService.usernameSubject().subscribe({
      next: newName => console.log(`recieved ${newName}`)
    });
  };

  ngOnInit() {
    this.itemSubscription = this.retroItemsService.itemsSubject.subscribe({
      next: (items: PublishedRetroItem[]) => this.items = items
    });
    this.retroItemsService.pingItems();
  }

  ngOnDestroy() {
    this.itemSubscription.unsubscribe();
  }
}

export interface PublishedRetroItem {
  area: string;
  text: string;
}

export class RetroItem {
  id?: number
  text: string;
  area: string;
}

interface RetroSetup {
  areas: string[];
  votes: number;
}
