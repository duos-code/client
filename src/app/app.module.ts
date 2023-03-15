import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { RoomPageComponent } from './pages/room-page/room-page.component';

import { CodeEditorModule } from '@ngstack/code-editor';
import { CodeEditorComponent } from './shared/code-editor/code-editor.component';
import { NgCodeEditorComponent } from './shared/ng-code-editor/ng-code-editor.component';

@NgModule({
  declarations: [AppComponent, HomePageComponent, RoomPageComponent, CodeEditorComponent, NgCodeEditorComponent],
  imports: [BrowserModule, AppRoutingModule, CodeEditorModule.forRoot(
    {  typingsWorkerUrl: 'assets/workers/typings-worker.js'}
  ),CodeEditorModule.forChild()],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
