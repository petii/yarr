import { Component, Inject, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgForm } from '@angular/forms';

import { RetroItem } from '../../home/home.component';
import { PublishedRetroItem } from '../../services/retroitems.service';
import { ComposerService } from './composer.service';
import { UsernameService } from '../../services/username.service';

@Component({
  selector: 'retro-item-composer',
  templateUrl: './composer.component.html',
})
export class ComposerComponent {
  @Input() areas: string[];

  public retroItems: RetroItem[] = [];

  public currentArea: number = 0;

  constructor(
    private http: HttpClient, @Inject('BASE_URL') private baseUrl: string,
    private usernameService: UsernameService,
    public composerService: ComposerService,
  ) {
  }

  addItem(newitemForm: NgForm) {
    let item = newitemForm.value as RetroItem;
    item.area = this.areas[this.currentArea]
    let currentItemCount = this.retroItems.length;
    item.id = this.retroItems.length + 1;
    if (this.retroItems.length > 0) {
      item.id = Math.max(item.id, this.retroItems.slice(-1)[0].id + 1);
    }
    this.composerService.addDraft(item);
    //this.retroItems.push(item);
    newitemForm.reset();
  }

  removeItem(item: RetroItem) {
    //this.retroItems = this.retroItems.filter(item => item.id != id);
    this.composerService.removeDraft(item);
  }

  publishItem(item: RetroItem) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let publishedItem: PublishedRetroItem = { id: -1, area: item.area, text: item.text, author: this.usernameService.changed ? this.usernameService.username : '' };
    console.log(JSON.stringify(publishedItem));
    // TODO: error case
    this.http.post(`${this.baseUrl}api/retro/publish`, JSON.stringify(publishedItem), { headers: headers }).subscribe(result => {
      this.removeItem(item);
    });
  }
}
