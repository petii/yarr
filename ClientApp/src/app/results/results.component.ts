import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import * as xlsx from 'xlsx';

import { RetroItemsService, PublishedRetroItem } from '../services/retroitems.service';
import { VotesService } from '../services/votes.service';

@Component({
  selector: 'retro-grouping-board',
  templateUrl: './results.component.html',
})
export class ResultsComponent implements OnInit, OnDestroy {
  constructor(
    private retroItemService: RetroItemsService,
    private voteService: VotesService) { }

  private itemSubscription: Subscription;
  private items: PublishedRetroItem[] = [];

  private voteSubscription: Subscription;
  private votes: number[] = [];

  public votedItems: VoteContainer[] = [];
  public actionItems: ActionArea[] = [];

  getItem(vote: number): PublishedRetroItem {
    return this.items.find(i => i.id == vote);
  }

  accumulate(votes: number[]) {
    this.votedItems = [];
    votes.forEach(vote => {
      let item = this.getItem(vote);
      let votedItem = this.votedItems.find(i => i.id == item.id);
      if (votedItem) {
        votedItem.votes++;
      }
      else {
        this.votedItems.push({ id: item.id, area: item.area, text: item.text, group: item.group, votes: 1 });
      }
    });
    console.log(this.votedItems);
    this.actionItems = [];
    this.votedItems.forEach(item => {
      if (item.group) {
        let group = item.group;
        let action = this.actionItems.find(i => i.text == group.name);
        if (action) {
          action.votes += item.votes;
          action.subitems.push(item);
        }
        else {
          this.actionItems.push({ text: group.name, votes: item.votes, subitems: [item] })
        }
      }
      else {
        this.actionItems.push({ text: item.text, votes: item.votes });
      }
    });
    this.actionItems = this.actionItems.sort((lhs, rhs) => rhs.votes - lhs.votes);
    console.log(this.actionItems);
  }

  ngOnInit() {
    this.itemSubscription = this.retroItemService.itemsSubject.subscribe({
      next: (items: PublishedRetroItem[]) => this.items = items
    });
    this.retroItemService.pingItems();
    this.voteSubscription = this.voteService.votesSubject.subscribe({
      next: (votes: number[]) => {
        this.votes = votes
        this.accumulate(votes);
      }
    });
    this.voteService.pingVotes();
  }

  ngOnDestroy() {
    this.itemSubscription.unsubscribe();
    this.voteSubscription.unsubscribe();
  }
}

interface VoteContainer extends PublishedRetroItem {
  votes: number;
}

interface ActionArea {
  text: string;
  votes: number;
  subitems?: VoteContainer[];
  ai?: string;
}
