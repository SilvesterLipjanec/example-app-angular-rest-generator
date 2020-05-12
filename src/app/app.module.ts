import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { GatewayModule } from './gateway/gateway.module';


@NgModule( {
    declarations: [
        AppComponent
    ],
    imports: [
        FormsModule,
        BrowserModule,
        GatewayModule
    ],
    providers: [],
    bootstrap: [AppComponent],

} )
export class AppModule { }
