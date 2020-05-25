import { Injectable } from '@angular/core';
import { Subject } from 'rxjs'

import { RetroItem } from '../../home/home.component';

@Injectable({
  providedIn: 'root',
})
export class ComposerService {

  public drafts: RetroItem[] = [];

  addDraft(item: RetroItem) {
    this.drafts.push(item);
  }

  getDrafts(): RetroItem[] {
    return this.drafts;
  }

  removeDraft(item: RetroItem) {

  }

}
