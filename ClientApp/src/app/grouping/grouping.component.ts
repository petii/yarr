import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

import { RetroItemsService, PublishedRetroItem } from '../services/retroitems.service';

@Component({
  selector: 'retro-grouping-board',
  templateUrl: './grouping.component.html',
})
export class GroupingComponent implements OnInit, OnDestroy {

  private itemSubscription: Subscription;

  public areas = new Set<string>();
  public retroBoard = new Map<string, PublishedRetroItem[]>();

  public groupLookup = new Map<number, number>();

  groupEdit: FormGroup;

  constructor(private retroItemService: RetroItemsService, private fb: FormBuilder) {
    this.groupEdit = this.fb.group({
      groups: this.fb.array([]),
      addNew: '+',
    });
  }

  onGroupNameEdit(id: number) {
    let groups = this.groupEdit.get('groups') as FormArray;
    console.log(groups.at(id).value);
  }

  newGroup() {
    let groups = this.groupEdit.get('groups') as FormArray;
    groups.push(this.fb.control(''));
  }

  removeGroup(id: number) {
    let groups = this.groupEdit.get('groups') as FormArray;
    groups.removeAt(id);
  }

  setGroup(item: number, groupId: number) {
    console.log(`${item} -> ${groupId}`);
    //this.groupLookup.set(item, groupId);
    // send new item group to server
  }

  ngOnInit() {
    this.itemSubscription = this.retroItemService.itemsSubject.subscribe({
      next: (items: PublishedRetroItem[]) => {
        this.areas = new Set<string>(items.map(item => item.area));
        this.areas.forEach(area => this.retroBoard.set(area, []));
        items.forEach(item => {
          if (item.groupId >= 0) {
            let groups = this.groupEdit.get('groups') as FormArray;

          }
          this.retroBoard.get(item.area).push(item);
        });
      }
    });
    this.retroItemService.pingItems();
  }

  ngOnDestroy() {
    this.itemSubscription.unsubscribe();
  }
}
