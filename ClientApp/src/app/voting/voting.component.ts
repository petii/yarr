import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { Subscription } from 'rxjs';

import { RetroItemsService, PublishedRetroItem } from '../services/retroitems.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RetroSetup } from '../setup/setup.component';

@Component({
  selector: 'retro-grouping-board',
  templateUrl: './voting.component.html',
})
export class VotingComponent implements OnInit, OnDestroy {

  public availableVotes: number = 5;

  public items: PublishedRetroItem[] = [];
  public groups: Group[] = [];

  private itemSubscription: Subscription;

  public votes: number[] = [];

  constructor(
    private http: HttpClient, @Inject('BASE_URL') private baseUrl: string,
    private retroItemService: RetroItemsService
  ) {
    http.get<RetroSetup>(`${this.baseUrl}api/retro/setup`).subscribe(result => {
      console.log(result);
      this.availableVotes = Math.max(0, result.votes);
    });
  }

  getGroupItems(id: number): PublishedRetroItem[] {
    return this.items.filter(
      item => {
        if (item.group) return item.group.id == id;
        return false;
      }
    );
  }

  getUngroupedItems(): PublishedRetroItem[] {
    return this.items.filter(
      item => !item.group
    );
  }

  kickFromGroup(item: PublishedRetroItem) {
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

  setGroup(item: PublishedRetroItem, groupId: number) {
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

  addVote(item: PublishedRetroItem) {
    //if (!item.voteCount) { item.voteCount = 0; }
    //item.voteCount++;
    this.votes.push(item.id);
    this.availableVotes--;
  }

  removeVote(item: PublishedRetroItem) {
    //item.voteCount--;
    let voteIndex = this.votes.findIndex(i => i == item.id);
    this.votes.splice(voteIndex, 1);
    this.availableVotes++;
  }

  public voted: boolean = false;

  canRemoveVote(item: PublishedRetroItem): boolean {
    let vote = this.votes.find(i => i == item.id);
    return vote != null;
  }

  canAddVote(item: PublishedRetroItem): boolean {
    
    return this.availableVotes > 0;
  }


  saveVotes() {
    console.log(this.votes);
    this.http.post(
      `${this.baseUrl}api/retro/vote`,
      JSON.stringify(this.votes),
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    ).subscribe(result => console.log(result));
    this.voted = true;
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
