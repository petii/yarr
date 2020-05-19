import { Injectable } from '@angular/core';
import { Subject } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class UsernameService {
  private username = new Subject<string>();

  setUsername(newName: string) {
    this.username.next(newName);
  }

  usernameSubject(): Subject<string> {
    return this.username;
  }
}
