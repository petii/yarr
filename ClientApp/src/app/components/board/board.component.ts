import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { RetroItemsService, PublishedRetroItem } from '../../services/retroitems.service';

@Component({
  selector: 'retro-board',
  templateUrl: './board.component.html',
})
export class BoardComponent {
  @Input() areas: string[];
  @Input() items: PublishedRetroItem[];

  public retroBoard = new Map<string, string[]>();

  processRetroItems() {
    // whatever happened to optional chaining
    if (this.areas) {
      this.areas.forEach(area => this.retroBoard.set(area, []));
    }
    if (this.items) {
      this.items.forEach(item => {
        if (this.retroBoard.has(item.area)) this.retroBoard.get(item.area).push(item.text);
      });
    }
  }

  
}
