import { Component } from '@angular/core';

import { UsernameService } from '../services/username.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  isExpanded: boolean = false;
  public user: string = 'user';

  constructor(private usernameService: UsernameService) {}

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  nameChange(newName: string) {
    if (newName.length == 0) {
      console.log('empty name');
      this.user = ' ';
      return;
    }
    this.usernameService.setUsername(newName);
  }
}
