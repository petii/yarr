import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { Subscription } from 'rxjs';

import { RetroItemsService, PublishedRetroItem } from '../services/retroitems.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'retro-grouping-board',
  templateUrl: './voting.component.html',
})
export class VotingComponent implements OnInit, OnDestroy {

  public availableVotes: number = 5;

  public items: VoteableItem[] = [];
  public groups: Group[] = [];

  private itemSubscription: Subscription;

  constructor(
    private http: HttpClient, @Inject('BASE_URL') private baseUrl: string,
    private retroItemService: RetroItemsService
  ) {
  }

  getGroupItems(id: number): VoteableItem[] {
    return this.items.filter(
      item => {
        if (item.group) return item.group.id == id;
        return false;
      }
    );
  }

  getUngroupedItems(): VoteableItem[] {
    return this.items.filter(
      item => !item.group
    );
  }

  kickFromGroup(item: VoteableItem) {
    item.group = undefined;
    this.http.patch(
      `${this.baseUrl}api/retro/items`,
      JSON.stringify(item),
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    ).subscribe(
      result => console.log(result)
    );
  }

  private newGroup(): Group {
    let newId = this.groups.length;
    return { name: `Group ${newId + 1}` };
  }

  setGroup(item: VoteableItem, groupId: number) {
    if (groupId < 0) {
      item.group = this.newGroup();
    }
    else {
      item.group = this.groups.find(g => g.id == groupId);
    }
    console.log(JSON.stringify(item));
    this.http.patch(
      `${this.baseUrl}api/retro/items`,
      JSON.stringify(item),
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    ).subscribe(
        result => console.log(result)
      );
  }

  addVote(item: VoteableItem) {
    if (!item.voteCount) { item.voteCount = 0; }
    item.voteCount++;
    this.availableVotes--;
  }

  removeVote(item: VoteableItem) {
    item.voteCount--;
    this.availableVotes++;
  }

  groupNameChange(group: Group, newName: string) {
    group.name = newName;
    let item = this.items.find(i => i.group ? i.group.id == group.id : false);
    this.http.patch(
      `${this.baseUrl}api/retro/items`,
      JSON.stringify(item),
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    ).subscribe(
      result => console.log(result)
    );
  }

  saveVotes() {

  }

  ngOnInit() {
    this.itemSubscription = this.retroItemService.itemsSubject.subscribe({
      next: (items: PublishedRetroItem[]) => {
        console.log(items);
        this.items = items;

        let tmp = items.map<Group>(i => { return i.group; }).filter(i => i != undefined)
        this.groups = [];
        tmp.forEach(group => {
          if (this.groups.find(g => g.id == group.id) == undefined) {
            this.groups.push(group);
          }
        })
      }
    });
    this.retroItemService.pingItems();
  }

  ngOnDestroy() {
    this.itemSubscription.unsubscribe();
  }
}

export interface Group {
  id?: number;
  name: string;
}

type VoteableItem = PublishedRetroItem;
