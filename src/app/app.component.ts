/**
 * author: Silvester Lipjanec (2019-2020)
 * Main component of example application created for testing purposes 
 * of angular-rest-generator (https://www.npmjs.com/package/angular-rest-generator).
 */

import { Component, Inject, Injector, ViewChild, ElementRef } from '@angular/core';
import { GatewayService } from './gateway/gateway.service';
import { BehaviorSubject, config } from 'rxjs';
import { API_KEYS, METHOD_CONFIG, API_ENDPOINT, API_BASIC_TOKEN, API_BEARER_TOKEN } from './gateway/gateway.module';
import { ApiKeys, MethodConfig, methodConfig, configOptions, apiEndpoints } from './gateway/configuration';
import * as _ from 'lodash';


@Component( {
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
} )
export class AppComponent {
    methodName: string;
    method: any;
    parameters: string;
    body: string;
    successResponse: string;
    errorResponse: string;
    server: string;
    servers: string[];
    gatewayProto;
    methods = [];
    basicTokenVal: string;
    hasBasicToken: boolean;
    hasBearerToken: boolean;
    bearerTokenVal: string;
    apiKeysVal: ApiKeys;
    hasApiKeys: boolean;
    contentType: string;
    contentTypes: string[] = [];
    accept: string;
    accepts: string[] = [];
    hasParameters = false;
    hasBody = false;
    params = [];
    methodStr: string;
    apiKeysNames: string[];

    @ViewChild( 'methodForm' ) methodForm: HTMLFormElement;
    constructor(
        private gateway: GatewayService,
        @Inject( API_KEYS ) private keys: BehaviorSubject<ApiKeys>,
        @Inject( METHOD_CONFIG ) private methodConfiguration$: BehaviorSubject<MethodConfig>,
        @Inject( API_ENDPOINT ) private apiEndpoint$: BehaviorSubject<string>,
        @Inject( API_BASIC_TOKEN ) private basicToken$: BehaviorSubject<string>,
        @Inject( API_BEARER_TOKEN ) private bearerToken$: BehaviorSubject<string>,
        @Inject( API_KEYS ) private apiKeys$: BehaviorSubject<ApiKeys>,
    ) {
        this.gatewayProto = Object.getPrototypeOf( this.gateway );
        this.getAllMethods();
        this.getServer();
    }

    getServer() {
        this.server = this.apiEndpoint$.value;
        this.servers = apiEndpoints;

    }

    /**
     * Method will call method from gateway service - make HTTP request.
     */
    callGateway(): void {
        this.initResponse();

        let functionParameters = [];
        if ( this.hasParameters ) {
            try {
                functionParameters.push( JSON.parse( this.parameters ) );
            } catch ( e ) {
                this.methodForm.form.controls['parameters'].setErrors( { 'invalidJson': true } );
                return;
            }
        }
        if ( this.hasBody ) {
            try {
                functionParameters.push( this.isJsonMime( this.contentType ) ? JSON.parse( this.body ) : this.body );
            } catch ( e ) {
                this.methodForm.form.controls['body'].setErrors( { 'invalidJson': true } );
                return;
            }

        }
        this.gatewayProto[this.methodName].apply( this.gateway, functionParameters ).subscribe( res => {
            this.successResponse = JSON.stringify( res, undefined, 4 );
        }, err => this.errorResponse = err );
    }

    /**
     * Function detects parameters of gateway service methods.
     * Inspired by answer from Stack Overflow https://stackoverflow.com/questions/1007981/how-to-get-function-parameter-names-values-dynamically
     * author Jack Allan (https://stackoverflow.com/users/315017/jack-allan)
     * @param func method name.
     * @returns list of parameter names.
     */
    getParamNames( func: string ): string[] {
        var ARGUMENT_NAMES = /([^\s,]+)/g;
        var result = this.methodStr.slice( this.methodStr.indexOf( '(' ) + 1, this.methodStr.indexOf( ')' ) ).match( ARGUMENT_NAMES );
        if ( result === null )
            result = [];
        return result;
    }

    /**
     * Function detects all methods which appear in gateway service, excluding error methods.
     */
    getAllMethods(): void {
        Object.getOwnPropertyNames( this.gatewayProto ).forEach( member => {
            if ( typeof this.gatewayProto[member] == "function" ) { // Is it a function?
                if ( this.gatewayProto.hasOwnProperty( member ) ) { // Not inherited
                    if ( !member.endsWith( "Error" ) && member != "constructor" && !member.endsWith( "ErrorDefault" ) ) {
                        this.methods.push( member );

                    }
                }
            }
        } );
    }

    initParams() {
        this.parameters = null;
    }

    initForm() {
        this.initParams();
        this.initResponse();
    }

    onMethodChange( methodName: string ): void {

        this.methodName = methodName;
        this.method = this.gatewayProto[this.methodName];
        this.initForm();

        this.getContentTypes();
        this.getAcceptTypes();
        this.parseMethodImplementation();
    }

    setApiKey( apiKey: string ) {
        let apiKeysConfig = this.apiKeys$.value;
        apiKeysConfig[apiKey] = this.apiKeysVal[apiKey];
        this.apiKeys$.next( apiKeysConfig );
    }

    setBasicToken(): void {
        this.basicToken$.next( this.basicTokenVal );
    }
    setBearerToken(): void {
        this.bearerToken$.next( this.bearerTokenVal );
    }

    /**
     * Function detects whether gateway method uses authentication tokens.
     */
    getUsedTokens(): void {
        if ( this.methodStr.search( 'basicToken' ) != -1 ) {
            this.basicTokenVal = this.basicToken$.value;
            this.hasBasicToken = true;
        } else {
            this.hasBasicToken = false;
            this.basicTokenVal = null;
        }

        if ( this.methodStr.search( 'bearerToken' ) != -1 ) {
            this.bearerTokenVal = this.bearerToken$.value;
            this.hasBearerToken = true;
        } else {
            this.hasBearerToken = false;
            this.bearerTokenVal = null;
        }
    }
    
    /**
     * Function detects whether gateway method uses authentication api keys.
     */
    parseApiKeys(): void {
        if ( this.methodStr.search( 'apiKeys' ) != -1 ) {
            this.apiKeysVal = _.clone( this.apiKeys$.value );
            this.apiKeysNames = Object.keys( this.apiKeysVal );
            this.hasApiKeys = true;
        } else {
            this.hasApiKeys = false;
        }
    }

    /**
     * Function parse method implementation as string.
     * Inspired by answer from Stack Overflow https://stackoverflow.com/questions/1007981/how-to-get-function-parameter-names-values-dynamically
     * author Jack Allan (https://stackoverflow.com/users/315017/jack-allan)
     */
    parseMethodImplementation(): void {
        var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
        this.methodStr = this.method.toString().replace( STRIP_COMMENTS, '' );
        this.getUsedTokens();
        this.parseParameters();
        this.parseApiKeys();
    }

    initResponse(): void {
        this.successResponse = null;
        this.errorResponse = null;
    }

    /**
     * Function detects used parameters for method from gateway.
     */
    parseParameters(): void {
        this.params = this.getParamNames( this.gatewayProto[this.methodName] );
        if ( this.params[0] === 'parameters' ) {
            this.hasParameters = true;
            if ( this.params[1] === 'body' ) {
                this.hasBody = true;
            } else {
                this.hasBody = false;
            }
        } else if ( this.params[0] === 'body' ) {
            this.hasBody = true;
            this.hasParameters = false;
        } else {
            this.hasBody = false;
            this.hasParameters = false;
        }
    }

    /**
     * Function detects used configuration options of method from gateway.
     */
    getContentTypes(): void {
        this.contentTypes = [];
        if ( this.methodName in configOptions && 'consume' in configOptions[this.methodName] ) {
            this.contentTypes = configOptions[this.methodName].consume;

            let actConfig = this.methodConfiguration$.value;
            this.contentType = actConfig[this.methodName].consume;
        }
    }

    onContentTypeChange( contentTypeName: string ) {
        let config = this.methodConfiguration$.value;
        config[this.methodName].consume = contentTypeName;
        this.methodConfiguration$.next( config );
    }

    /**
     * Function detects used configuration options of method from gateway.
     */
    getAcceptTypes(): void {
        this.accepts = [];
        if ( this.methodName in configOptions && 'accept' in configOptions[this.methodName] ) {
            this.accepts = configOptions[this.methodName].accept;

            let actConfig = this.methodConfiguration$.value;
            this.accept = actConfig[this.methodName].accept;
        }
    }

    onAcceptTypeChange( acceptName: string ) {
        let config = this.methodConfiguration$.value;
        config[this.methodName].accept = acceptName;
        this.methodConfiguration$.next( config );
    }

    onServerChange( endpoint: string ) {
        this.server = endpoint;
        this.apiEndpoint$.next( endpoint );
    }

    /** 
    * Piece of code generated by openapi-generator-cli
    * URL: https://www.npmjs.com/package/@openapitools/openapi-generator-cli
    * Check if the given MIME is a JSON MIME.
    * JSON MIME examples:
    *   application/json
    *   application/json; charset=UTF8
    *   APPLICATION/JSON
    *   application/vnd.company+json
    * @param mime - MIME (Multipurpose Internet Mail Extensions)
    * @return True if the given MIME is JSON, false otherwise.
    */
    isJsonMime( mime: string ): boolean {
        const jsonMime: RegExp = new RegExp( '^(application\/json|[^;/ \t]+\/[^;/ \t]+[+]json)[ \t]*(;.*)?$', 'i' );
        return mime !== null && ( jsonMime.test( mime ) || mime.toLowerCase() === 'application/json-patch+json' );
    }

}
