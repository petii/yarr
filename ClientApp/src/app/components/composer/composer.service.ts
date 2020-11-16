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
    if (rawCookies.length == 0) { return; }

    var cookedCookies = rawCookies.split(';').map(item => item.split('='))
    if (cookedCookies.length == 0) { return; }

    var draftCookie = cookedCookies.find(element => element[0] == 'drafts');
    if (draftCookie === undefined) { return; }

    var jsonDrafts = draftCookie[1];
    console.log(jsonDrafts);
    this.drafts = JSON.parse(jsonDrafts);
  }

  pushDraftCookies() {
    document.cookie = "drafts=" + JSON.stringify(this.drafts);
  }

  addDraft(item: RetroItem) {
    this.drafts.push(item);
    this.pushDraftCookies();
  }

  removeDraft(item: RetroItem) {
    this.drafts = this.drafts.filter(element => element.id != item.id);
    this.pushDraftCookies();
  }

  addEmpty(): number {
    var newIndex = this.drafts.length;
    this.drafts.push({ id: newIndex, area: "", text: "" });
    return newIndex;
  }
}
