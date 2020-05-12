import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { GatewayService } from './gateway.service';
import { NgModule, InjectionToken } from '@angular/core';
import { GatewayInterceptor } from './gateway.interceptor';
import { BehaviorSubject } from 'rxjs';
import { apiEndpoint, methodConfig, MethodConfig, ApiKeys, apiKeys, basicToken, bearerToken } from './configuration';

export const API_ENDPOINT = new InjectionToken<string>( 'api-endpoint' );
export const API_BEARER_TOKEN = new InjectionToken<string>( 'api-bearer-token' );
export const API_BASIC_TOKEN = new InjectionToken<string>( 'api-base64-token' );
export const API_KEYS = new InjectionToken<ApiKeys>( 'api-keys' );
export const METHOD_CONFIG = new InjectionToken<MethodConfig>( 'method-configuration' );

let ENDPOINT = new BehaviorSubject<string>( apiEndpoint );
let BEARER_TOKEN = new BehaviorSubject<string>( bearerToken );
let BASIC_TOKEN = new BehaviorSubject<string>( basicToken );
let KEYS = new BehaviorSubject<ApiKeys>( apiKeys );
let CONFIG = new BehaviorSubject<MethodConfig>( methodConfig );

@NgModule( {
    imports: [HttpClientModule],
    providers: [
        { provide: API_ENDPOINT, useValue: ENDPOINT },
        { provide: API_BEARER_TOKEN, useValue: BEARER_TOKEN },
        { provide: API_BASIC_TOKEN, useValue: BASIC_TOKEN },
        { provide: API_KEYS, useValue: KEYS },
        { provide: METHOD_CONFIG, useValue: CONFIG },
        { provide: HTTP_INTERCEPTORS, useClass: GatewayInterceptor, multi: true },
        GatewayService
    ]
} )
export class GatewayModule { }