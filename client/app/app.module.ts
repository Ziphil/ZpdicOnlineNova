//

import {
  NgModule as ngModule
} from "@angular/core";
import {
  BrowserModule
} from "@angular/platform-browser";
import {
  AppComponent
} from "./app.component";


@ngModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

}