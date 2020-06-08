import { Injectable } from '@angular/core';
import { Subject } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class UsernameService {
  private usernameSubj = new Subject<string>();
  public username: string = Defaults.default_user;
  public changed: boolean = false;

  setUsername(newName: string) {
    this.username = newName;
    this.changed = true;
    this.usernameSubj.next(newName);
  }

  usernameSubject(): Subject<string> {
    return this.usernameSubj;
  }
}

export class Defaults {
  static default_user: string = 'user';
}
