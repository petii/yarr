import { Injectable } from '@angular/core';
import { Subject } from 'rxjs'

import { RetroItem } from '../../home/home.component';

@Injectable({
  providedIn: 'root',
})
export class ComposerService {

  public drafts: RetroItem[] = [];

  fetchDraftCookies() {
    var rawCookies = document.cookie;
    var cookedCookies = rawCookies.split(';').map(item => item.split('='))
    var jsonDrafts = cookedCookies.find(element => element[0] == 'drafts')[1];

    this.drafts = JSON.parse(jsonDrafts);
  }

  addDraft(item: RetroItem) {
    this.drafts.push(item);
    document.cookie = "drafts=" + JSON.stringify(this.drafts);
  }

  removeDraft(item: RetroItem) {
    this.drafts = this.drafts.filter(element => element.id != item.id);
    document.cookie = "drafts=" + JSON.stringify(this.drafts);
  }
}
