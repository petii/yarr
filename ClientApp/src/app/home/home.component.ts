import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';

import { UsernameService } from '../services/username.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  public areas: string[]
  public retroItems: RetroItem[];

  public retroTable: RetroItem[];

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string,
              private usernameService: UsernameService) {
    http.get<string[]>(baseUrl + 'api/retro/areas').subscribe(result => {
      this.areas = result;

      // for testing purposes
      this.retroItems = this.areas.map((value, index) => {
        return { id: index, text: `item${index}`, area: value };
      });
    });

    usernameService.usernameSubject().subscribe({ next: newName => { console.log(`recieved ${newName}`); } });
  };

  addItem(newitemForm: NgForm) {
    let item = newitemForm.value;
    let currentItemCount = this.retroItems.length;
    item.id = Math.max(this.retroItems.length + 1, this.retroItems.slice(-1)[0].id + 1);
    this.retroItems.push(item);
    newitemForm.reset();
  }

  removeItem(id: number) {
    this.retroItems = this.retroItems.filter(item => item.id != id);
  }

  publishItem(id: number) {
    let publishedItem = this.retroItems.filter(item => item.id == id)[0];
    publishedItem.id = undefined;
    this.retroTable.push(publishedItem);
    this.removeItem(id);
    // TODO: notify server about the published item
  }
}

export class RetroItem {
  id?: number
  text: string;
  area: string;
}
