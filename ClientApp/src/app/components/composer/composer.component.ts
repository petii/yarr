import { Component, Inject, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgForm } from '@angular/forms';

import { RetroItem } from '../../home/home.component';
import { PublishedRetroItem } from '../../services/retroitems.service';

@Component({
  selector: 'retro-item-composer',
  templateUrl: './composer.component.html',
})
export class ComposerComponent {
  @Input() areas: string[];

  public retroItems: RetroItem[] = [];

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

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
    let publishedItem: PublishedRetroItem = { id: -1, area: tmp.area, text: tmp.text };
    console.log(JSON.stringify(publishedItem));
    // TODO: error case
    this.http.post(`${this.baseUrl}api/retro/publish`, JSON.stringify(publishedItem), { headers: headers }).subscribe(result => {
      this.removeItem(id);
    });
  }
}
