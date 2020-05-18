import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { UsernameService } from '../services/username.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  public areas: string[]

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string,
    private usernameService: UsernameService) {
    http.get<RetroSetup>(`${baseUrl}api/retro/setup`).subscribe(result => {
      this.areas = result.areas;
    });

    this.usernameService.usernameSubject().subscribe({
      next: newName => console.log(`recieved ${newName}`)
    });
  };
}

export interface PublishedRetroItem {
  area: string;
  text: string;
}

export class RetroItem {
  id?: number
  text: string;
  area: string;
}

interface RetroSetup {
  areas: string[];
  votes: number;
}
