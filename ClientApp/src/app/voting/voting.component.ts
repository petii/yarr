import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

import { RetroItemsService, PublishedRetroItem } from '../services/retroitems.service';

@Component({
  selector: 'retro-grouping-board',
  templateUrl: './voting.component.html',
})
export class VotingComponent implements OnInit, OnDestroy {

  public availableVotes: number = 5;

  public items: VoteableItem[] = [];
  public groups: string[] = ['group1', 'group2'];

  private itemSubscription: Subscription;

  constructor(private retroItemService: RetroItemsService, private fb: FormBuilder) {
   }

  private newGroup() : number {
    let newId = this.groups.length;
    this.groups.push(`Group ${newId + 1}`);
    return newId;
    //this.items.find(item => item.id == initialItem).groupId = newId;
  }

  getGroupItems(id: number): VoteableItem[]{
    return this.items.filter(
      item => item.groupId == id
    );
  }

  getUngroupedItems(): VoteableItem[] {
    return this.items.filter(
      item => item.groupId == undefined
    );
  }

  setGroup(id: number, groupId?: number) {
    //console.log(`${id} -> ${groupId}`);
    if (groupId < 0) {
      groupId = this.newGroup();
    }
    this.items.find(item => item.id == id).groupId = groupId;
  }

  addVote(id: number) {
    let item = this.items.find(i => i.id == id);
    if (!item.voteCount) { item.voteCount = 0; }
    item.voteCount++;
    this.availableVotes--;
  }

  removeVote(id: number) {
    let item = this.items.find(i => i.id == id);
    item.voteCount--;
    this.availableVotes++;
  }

  groupNameChange(id: number, newName: string) {
    this.groups[id] = newName;
  }

  saveVotes() {

  }

  ngOnInit() {
    this.itemSubscription = this.retroItemService.itemsSubject.subscribe({
      next: (items: PublishedRetroItem[]) => this.items = items
    });
    this.retroItemService.pingItems();
  }

  ngOnDestroy() {
    this.itemSubscription.unsubscribe();
  }
}

export interface VoteableItem extends PublishedRetroItem {
  groupId?: number;
  voteCount?: number;
}
