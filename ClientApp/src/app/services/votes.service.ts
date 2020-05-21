import { Injectable, Inject } from '@angular/core';
import { Subject, Observable, Subscription, interval } from 'rxjs'
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class VotesService {
  public votesSubject = new Subject<number[]>();
  public votes: number[] = [];

  private lastUpdate: Date;
  private refreshTimer: RefreshContainer;

  public alreadyVoted: boolean = false;


  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
    this.fetchNew();
    this.refreshTimer = { timer: interval(1000), subscription: new Subscription() };
    this.refreshTimer.subscription = this.refreshTimer.timer.subscribe(val => this.checkUpToDate());
  }

  pingVotes() {
    this.votesSubject.next(this.votes);
  }

  checkUpToDate() {
    this.http.get<string>(`${this.baseUrl}api/retro/lastupdate`).subscribe(updateResult => {
      let recieved: Date = new Date(Date.parse(updateResult));
      if (this.lastUpdate < recieved) {
        this.fetchNew();
      }
    });
  }

  fetchNew() {
    this.http.get<VoteUpdate>(`${this.baseUrl}api/retro/votes`).subscribe(result => {
      this.lastUpdate = new Date(Date.parse(result.timestamp));
      this.votes = result.votes;
      this.pingVotes();
    });
  }
}

interface VoteUpdate {
  timestamp: string;
  votes: number[];
}

class RefreshContainer {
  timer: Observable<number>;
  subscription: Subscription;
}
