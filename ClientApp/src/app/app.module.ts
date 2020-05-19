import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';

import { SetupComponent } from './setup/setup.component';

import { HomeComponent } from './home/home.component';
import { BoardComponent } from './components/board/board.component';
import { ComposerComponent } from './components/composer/composer.component';

import { VotingComponent } from './voting/voting.component';


@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    SetupComponent,
    HomeComponent,
    BoardComponent,
    ComposerComponent,
    VotingComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'setup', component: SetupComponent },
      { path: 'voting', component: VotingComponent },
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
