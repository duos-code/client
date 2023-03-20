import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { RoomPageComponent } from './pages/room-page/room-page.component';

import { CodeEditorModule } from '@ngstack/code-editor';
import { CodeEditorComponent } from './shared/code-editor/code-editor.component';

import { FormsModule } from '@angular/forms';

import {
  HashLocationStrategy,
  LocationStrategy,
  PathLocationStrategy,
} from '@angular/common';

import { HttpClientModule } from '@angular/common/http';

import {
  GoogleSigninButtonModule,
  SocialAuthServiceConfig,
  SocialLoginModule,
} from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';

import {
  MonacoEditorModule,
  NgxMonacoEditorConfig,
} from 'ngx-monaco-editor-v2';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GoogleAuthComponent } from './shared/google-auth/google-auth.component';

const monacoConfig: NgxMonacoEditorConfig = {
  baseUrl: 'app-name/assets', // configure base path for monaco editor. Starting with version 8.0.0 it defaults to './assets'. Previous releases default to '/assets'
  defaultOptions: { scrollBeyondLastLine: false }, // pass default options to be used
  onMonacoLoad: () => {
    console.log((<any>window).monaco);
  }, // here monaco object will be available as window.monaco use this function to extend monaco editor functionalities.
};

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    RoomPageComponent,
    CodeEditorComponent,
    GoogleAuthComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CodeEditorModule.forRoot({
      typingsWorkerUrl: 'assets/workers/typings-worker.js',
    }),
    CodeEditorModule.forChild(),
    MonacoEditorModule.forRoot(monacoConfig),
    FormsModule,
    FontAwesomeModule,
    SocialLoginModule,
    GoogleSigninButtonModule,
  ],
  providers: [
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '17524549635-g6flutpenm7fdoie4vaing94tqiir4b6.apps.googleusercontent.com'
            ),
          },
        ],
        onError: (err) => {
          console.error(err);
        },
      } as SocialAuthServiceConfig,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
