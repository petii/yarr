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

  public currentArea: number = 0;

  public editing: number[] = [];

  constructor(
    private http: HttpClient, @Inject('BASE_URL') private baseUrl: string,
    private usernameService: UsernameService,
    public composerService: ComposerService,
  ) {
    if (composerService.drafts.length == 0) {
      composerService.fetchDraftCookies()
    }

  }

  addItem(newitemForm: NgForm) {
    let item = newitemForm.value as RetroItem;
    item.area = this.areas[this.currentArea]
    let currentItemCount = this.composerService.drafts.length;
    item.id = currentItemCount + 1;
    if (currentItemCount > 0) {
      item.id = Math.max(item.id, this.composerService.drafts.slice(-1)[0].id + 1);
    }
    this.composerService.addDraft(item);
    newitemForm.reset();
  }

  removeItem(item: RetroItem) {
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

  addAnother() {
    this.editing.push(this.composerService.addEmpty());
  }

  edit(index: number) { this.editing.push(index); }

  doneEdit(index: number) {
    var textArea: HTMLTextAreaElement = document.getElementById('text' + index) as HTMLTextAreaElement;
    var newText = textArea.value;
    console.log(newText);
    this.composerService.drafts[index].text = newText;
    this.editing = this.editing.filter(item => item != index);

    this.composerService.pushDraftCookies();
  }

  public editingMode(index: number): boolean {
    return this.editing.find(item => item == index) !== undefined;
  }
}
