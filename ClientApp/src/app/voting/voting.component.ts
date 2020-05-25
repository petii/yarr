import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { Subscription } from 'rxjs';

import { RetroItemsService, PublishedRetroItem } from '../services/retroitems.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RetroSetup } from '../setup/setup.component';
import { VotesService } from '../services/votes.service';

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
    private retroItemService: RetroItemsService, public voteService: VotesService
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
      JSON.stringify([item]),
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
      JSON.stringify([item]),
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    ).subscribe(
      result => console.log(result)
    );
  }

  groupNameChange(group: Group, newName: string) {
    group.name = newName;
    let itemsInGroup = this.items.filter(i => i.group ? i.group.id == group.id : false);
    itemsInGroup.forEach(item => item.group.name = newName);
    console.log(itemsInGroup);
    this.http.patch(
      `${this.baseUrl}api/retro/items`,
      JSON.stringify(itemsInGroup),
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    ).subscribe(
      result => console.log(result)
    );
  }

  addVote(item: PublishedRetroItem) {
    if (!this.canAddVote(item)) return;
    this.votes.push(item.id);
    this.availableVotes--;
  }

  removeVote(item: PublishedRetroItem)
  {
    if (!this.canRemoveVote(item)) return;
    let voteIndex = this.votes.findIndex(i => i == item.id);
    this.votes.splice(voteIndex, 1);
    this.availableVotes++;
  }

  canRemoveVote(item: PublishedRetroItem): boolean {
    let vote = this.votes.find(i => i == item.id);
    return vote != null;
  }

  canAddVote(item: PublishedRetroItem): boolean {
    return this.availableVotes > 0;
  }

  getVoteCount(item: PublishedRetroItem): number {
    return this.votes.filter(i => i == item.id).length;
  }


  saveVotes() {
    console.log(this.votes);
    this.http.post(
      `${this.baseUrl}api/retro/vote`,
      JSON.stringify(this.votes),
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    ).subscribe(result => console.log(result));
    this.voteService.alreadyVoted = true;
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
