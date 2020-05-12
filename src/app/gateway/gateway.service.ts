import { Injectable, Inject, } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { API_ENDPOINT, API_BEARER_TOKEN, API_KEYS, API_BASIC_TOKEN, METHOD_CONFIG } from './gateway.module';
import { MethodConfig, ApiKeys } from './configuration';
import {
    FindPetsByStatusParameters,
    FindPetsByTagsParameters,
    GetPetByIdParameters,
    UpdatePetWithFormParameters,
    DeletePetParameters,
    UploadFileParameters,
    GetOrderByIdParameters,
    DeleteOrderParameters,
    LoginUserParameters,
    GetUserByNameParameters,
    UpdateUserParameters,
    DeleteUserParameters,
    Category,
    Tag,
    Pet,
    UpdatePetWithForm,
    UploadFile,
    ApiResponse,
    GetInventory,
    Order,
    User,
    PetStatus,
    Status,
    OrderStatus,
} from './models';

export interface ErrorObject {
    code: string;
    description: string;
}

export class BaseService {

    appendArrayHttpParams( name: string, parameter: any[], httpParams: HttpParams ): HttpParams {
        if ( !parameter ) return null;
        parameter.forEach( value =>
            httpParams.append( name, value?.toString() )
        );
        return httpParams;
    }

    getSerializedCookieParams( parameters: any ) {
        let cookieValue = '';
        Object.keys( parameters ).forEach( ( name ) => {
            if ( Array.isArray( parameters[name] ) ) {
                parameters[name].forEach( value =>
                    cookieValue += `${ name }=${ value }; ` );
            } else {
                cookieValue += `${ name }=${ parameters[name] }; `;
            }
        } );
        return cookieValue;
    }

    isFormDataMime( mime: string ): boolean {
        return mime === 'multipart/form-data';
    }

    getSerializedFormDataBody( body: any ): FormData {
        if ( !body ) return null;
        let formData = new FormData();
        if ( typeof body === 'object') {
            Object.keys( body ).forEach( key => {
                if ( Array.isArray( body[key] ) ) {
                    body[key].forEach( value => formData.append( key, value ) );
                } else {
                    formData.append( key, body[key] );
                }
            } );
        } else {
            formData.append( 'body', body );
        }
        return formData;
    }
}

@Injectable()
export class GatewayService extends BaseService {

    private apiEndpoint: string;
    private bearerToken: string;
    private basicToken: string;
    private apiKeys: ApiKeys;
    private methodConfig: MethodConfig;

    constructor(
        private http: HttpClient,
        @Inject( API_ENDPOINT ) endpoint: BehaviorSubject<string>,
        @Inject( API_BEARER_TOKEN ) bearerToken: BehaviorSubject<string>,
        @Inject( API_BASIC_TOKEN ) basicToken: BehaviorSubject<string>,
        @Inject( API_KEYS ) keys: BehaviorSubject<ApiKeys>,
        @Inject( METHOD_CONFIG ) methodConfig: BehaviorSubject<MethodConfig>,
    ) {
        super();
        endpoint.subscribe( value => {
            this.apiEndpoint = value;
        } );

        bearerToken.subscribe( value => {
            this.bearerToken = value;
        } );

        basicToken.subscribe( value => {
            this.basicToken = value;
        } );

        keys.subscribe( value => {
            this.apiKeys = value;
        } );

        methodConfig.subscribe( value => {
            this.methodConfig = value;
        } );
    }

    updatePet( body?: string, observe?: 'body' ): Observable<any>;
    updatePet( body?: string, observe?: 'response' ): Observable<HttpResponse<any>>;
    updatePet( body?: string, observe?: 'events' ): Observable<HttpEvent<any>>;
    updatePet( body?: string, observe: any = 'body' ): Observable<any> {

        let _headers = new HttpHeaders();
        _headers = _headers.set( 'Content-Type', this.methodConfig.updatePet.consume );


        const httpOptions = { 
            headers: _headers,
            observe: observe,
            reportProgress: this.methodConfig.updatePet.reportProgress,
            withCredentials: this.methodConfig.updatePet.withCredentials
        };

        return this.http.put<any>( `${ this.apiEndpoint }/pet`, 
            body, 
            httpOptions )
            .pipe(
                retry( 2 ),
                catchError( err => this.handleUpdatePetError( err ) )
            );
    }

    addPet( body?: Pet | string, observe?: 'body' ): Observable<any>;
    addPet( body?: Pet | string, observe?: 'response' ): Observable<HttpResponse<any>>;
    addPet( body?: Pet | string, observe?: 'events' ): Observable<HttpEvent<any>>;
    addPet( body?: Pet | string, observe: any = 'body' ): Observable<any> {

        let _headers = new HttpHeaders();
        _headers = _headers.set( 'Content-Type', this.methodConfig.addPet.consume );


        const httpOptions = { 
            headers: _headers,
            observe: observe,
            reportProgress: this.methodConfig.addPet.reportProgress,
            withCredentials: this.methodConfig.addPet.withCredentials
        };

        return this.http.post<any>( `${ this.apiEndpoint }/pet`, 
            body, 
            httpOptions )
            .pipe(
                retry( 2 ),
                catchError( err => this.handleAddPetError( err ) )
            );
    }

    findPetsByStatus( parameters: FindPetsByStatusParameters, observe?: 'body' ): Observable<string | Pet>;
    findPetsByStatus( parameters: FindPetsByStatusParameters, observe?: 'response' ): Observable<HttpResponse<string | Pet>>;
    findPetsByStatus( parameters: FindPetsByStatusParameters, observe?: 'events' ): Observable<HttpEvent<string | Pet>>;
    findPetsByStatus( parameters: FindPetsByStatusParameters, observe: any = 'body' ): Observable<any> {

        let _headers = new HttpHeaders();
        _headers = _headers.set( 'Accept', this.methodConfig.findPetsByStatus.accept );

        let _params = new HttpParams();
        this.appendArrayHttpParams( 'status', parameters.status, _params);

        const httpOptions = { 
            headers: _headers,
            params: _params,
            observe: observe,
            reportProgress: this.methodConfig.findPetsByStatus.reportProgress,
            withCredentials: this.methodConfig.findPetsByStatus.withCredentials
        };

        return this.http.get<string | Pet>( `${ this.apiEndpoint }/pet/findByStatus`, 
            httpOptions )
            .pipe(
                retry( 2 ),
                catchError( err => this.handleFindPetsByStatusError( err ) )
            );
    }

    findPetsByTags( parameters: FindPetsByTagsParameters, observe?: 'body' ): Observable<string | Pet>;
    findPetsByTags( parameters: FindPetsByTagsParameters, observe?: 'response' ): Observable<HttpResponse<string | Pet>>;
    findPetsByTags( parameters: FindPetsByTagsParameters, observe?: 'events' ): Observable<HttpEvent<string | Pet>>;
    findPetsByTags( parameters: FindPetsByTagsParameters, observe: any = 'body' ): Observable<any> {

        let _headers = new HttpHeaders();
        _headers = _headers.set( 'Accept', this.methodConfig.findPetsByTags.accept );

        let _params = new HttpParams();
        this.appendArrayHttpParams( 'tags', parameters.tags, _params);

        const httpOptions = { 
            headers: _headers,
            params: _params,
            observe: observe,
            reportProgress: this.methodConfig.findPetsByTags.reportProgress,
            withCredentials: this.methodConfig.findPetsByTags.withCredentials
        };

        return this.http.get<string | Pet>( `${ this.apiEndpoint }/pet/findByTags`, 
            httpOptions )
            .pipe(
                retry( 2 ),
                catchError( err => this.handleFindPetsByTagsError( err ) )
            );
    }

    getPetById( parameters: GetPetByIdParameters, observe?: 'body' ): Observable<string | Pet>;
    getPetById( parameters: GetPetByIdParameters, observe?: 'response' ): Observable<HttpResponse<string | Pet>>;
    getPetById( parameters: GetPetByIdParameters, observe?: 'events' ): Observable<HttpEvent<string | Pet>>;
    getPetById( parameters: GetPetByIdParameters, observe: any = 'body' ): Observable<any> {

        let _headers = new HttpHeaders();
        this.apiKeys['api_key'] && ( _headers = _headers.append( 'api_key', `${ this.apiKeys['api_key'] }` ));
        _headers = _headers.set( 'Accept', this.methodConfig.getPetById.accept );


        const httpOptions = { 
            headers: _headers,
            observe: observe,
            reportProgress: this.methodConfig.getPetById.reportProgress,
            withCredentials: this.methodConfig.getPetById.withCredentials
        };

        return this.http.get<string | Pet>( `${ this.apiEndpoint }/pet/${ encodeURIComponent( parameters.petId ) }`, 
            httpOptions )
            .pipe(
                retry( 2 ),
                catchError( err => this.handleGetPetByIdError( err ) )
            );
    }

    updatePetWithForm( parameters: UpdatePetWithFormParameters, body?: UpdatePetWithForm, observe?: 'body' ): Observable<any>;
    updatePetWithForm( parameters: UpdatePetWithFormParameters, body?: UpdatePetWithForm, observe?: 'response' ): Observable<HttpResponse<any>>;
    updatePetWithForm( parameters: UpdatePetWithFormParameters, body?: UpdatePetWithForm, observe?: 'events' ): Observable<HttpEvent<any>>;
    updatePetWithForm( parameters: UpdatePetWithFormParameters, body?: UpdatePetWithForm, observe: any = 'body' ): Observable<any> {

        let _headers = new HttpHeaders();
        _headers = _headers.set( 'Content-Type', this.methodConfig.updatePetWithForm.consume );


        const httpOptions = { 
            headers: _headers,
            observe: observe,
            reportProgress: this.methodConfig.updatePetWithForm.reportProgress,
            withCredentials: this.methodConfig.updatePetWithForm.withCredentials
        };

        return this.http.post<any>( `${ this.apiEndpoint }/pet/${ encodeURIComponent( parameters.petId ) }`, 
            body, 
            httpOptions )
            .pipe(
                retry( 2 ),
                catchError( err => this.handleUpdatePetWithFormError( err ) )
            );
    }

    deletePet( parameters: DeletePetParameters, observe?: 'body' ): Observable<any>;
    deletePet( parameters: DeletePetParameters, observe?: 'response' ): Observable<HttpResponse<any>>;
    deletePet( parameters: DeletePetParameters, observe?: 'events' ): Observable<HttpEvent<any>>;
    deletePet( parameters: DeletePetParameters, observe: any = 'body' ): Observable<any> {



        const httpOptions = { 
            observe: observe,
            reportProgress: this.methodConfig.deletePet.reportProgress,
            withCredentials: this.methodConfig.deletePet.withCredentials
        };

        return this.http.delete<any>( `${ this.apiEndpoint }/pet/${ encodeURIComponent( parameters.petId ) }`, 
            httpOptions )
            .pipe(
                retry( 2 ),
                catchError( err => this.handleDeletePetError( err ) )
            );
    }

    uploadFile( parameters: UploadFileParameters, body?: UploadFile, observe?: 'body' ): Observable<ApiResponse>;
    uploadFile( parameters: UploadFileParameters, body?: UploadFile, observe?: 'response' ): Observable<HttpResponse<ApiResponse>>;
    uploadFile( parameters: UploadFileParameters, body?: UploadFile, observe?: 'events' ): Observable<HttpEvent<ApiResponse>>;
    uploadFile( parameters: UploadFileParameters, body?: UploadFile, observe: any = 'body' ): Observable<any> {

        let _headers = new HttpHeaders();
        _headers = _headers.set( 'Content-Type', this.methodConfig.uploadFile.consume );
        _headers = _headers.set( 'Accept', this.methodConfig.uploadFile.accept );


        const httpOptions = { 
            headers: _headers,
            observe: observe,
            reportProgress: this.methodConfig.uploadFile.reportProgress,
            withCredentials: this.methodConfig.uploadFile.withCredentials
        };

        return this.http.post<ApiResponse>( `${ this.apiEndpoint }/pet/${ encodeURIComponent( parameters.petId ) }/uploadImage`, 
            this.isFormDataMime( this.methodConfig.uploadFile.consume ) ? this.getSerializedFormDataBody( body ) : body , 
            httpOptions )
            .pipe(
                retry( 2 ),
                catchError( err => this.handleErrorDefault( err ) )
            );
    }

    getInventory( observe?: 'body' ): Observable<GetInventory>;
    getInventory( observe?: 'response' ): Observable<HttpResponse<GetInventory>>;
    getInventory( observe?: 'events' ): Observable<HttpEvent<GetInventory>>;
    getInventory( observe: any = 'body' ): Observable<any> {

        let _headers = new HttpHeaders();
        this.apiKeys['api_key'] && ( _headers = _headers.append( 'api_key', `${ this.apiKeys['api_key'] }` ));
        _headers = _headers.set( 'Accept', this.methodConfig.getInventory.accept );


        const httpOptions = { 
            headers: _headers,
            observe: observe,
            reportProgress: this.methodConfig.getInventory.reportProgress,
            withCredentials: this.methodConfig.getInventory.withCredentials
        };

        return this.http.get<GetInventory>( `${ this.apiEndpoint }/store/inventory`, 
            httpOptions )
            .pipe(
                retry( 2 ),
                catchError( err => this.handleErrorDefault( err ) )
            );
    }

    placeOrder( body?: Order, observe?: 'body' ): Observable<string | Order>;
    placeOrder( body?: Order, observe?: 'response' ): Observable<HttpResponse<string | Order>>;
    placeOrder( body?: Order, observe?: 'events' ): Observable<HttpEvent<string | Order>>;
    placeOrder( body?: Order, observe: any = 'body' ): Observable<any> {

        let _headers = new HttpHeaders();
        _headers = _headers.set( 'Content-Type', this.methodConfig.placeOrder.consume );
        _headers = _headers.set( 'Accept', this.methodConfig.placeOrder.accept );


        const httpOptions = { 
            headers: _headers,
            observe: observe,
            reportProgress: this.methodConfig.placeOrder.reportProgress,
            withCredentials: this.methodConfig.placeOrder.withCredentials
        };

        return this.http.post<string | Order>( `${ this.apiEndpoint }/store/order`, 
            body, 
            httpOptions )
            .pipe(
                retry( 2 ),
                catchError( err => this.handlePlaceOrderError( err ) )
            );
    }

    getOrderById( parameters: GetOrderByIdParameters, observe?: 'body' ): Observable<string | Order>;
    getOrderById( parameters: GetOrderByIdParameters, observe?: 'response' ): Observable<HttpResponse<string | Order>>;
    getOrderById( parameters: GetOrderByIdParameters, observe?: 'events' ): Observable<HttpEvent<string | Order>>;
    getOrderById( parameters: GetOrderByIdParameters, observe: any = 'body' ): Observable<any> {

        let _headers = new HttpHeaders();
        _headers = _headers.set( 'Accept', this.methodConfig.getOrderById.accept );


        const httpOptions = { 
            headers: _headers,
            observe: observe,
            reportProgress: this.methodConfig.getOrderById.reportProgress,
            withCredentials: this.methodConfig.getOrderById.withCredentials
        };

        return this.http.get<string | Order>( `${ this.apiEndpoint }/store/order/${ encodeURIComponent( parameters.orderId ) }`, 
            httpOptions )
            .pipe(
                retry( 2 ),
                catchError( err => this.handleGetOrderByIdError( err ) )
            );
    }

    deleteOrder( parameters: DeleteOrderParameters, observe?: 'body' ): Observable<any>;
    deleteOrder( parameters: DeleteOrderParameters, observe?: 'response' ): Observable<HttpResponse<any>>;
    deleteOrder( parameters: DeleteOrderParameters, observe?: 'events' ): Observable<HttpEvent<any>>;
    deleteOrder( parameters: DeleteOrderParameters, observe: any = 'body' ): Observable<any> {



        const httpOptions = { 
            observe: observe,
            reportProgress: this.methodConfig.deleteOrder.reportProgress,
            withCredentials: this.methodConfig.deleteOrder.withCredentials
        };

        return this.http.delete<any>( `${ this.apiEndpoint }/store/order/${ encodeURIComponent( parameters.orderId ) }`, 
            httpOptions )
            .pipe(
                retry( 2 ),
                catchError( err => this.handleDeleteOrderError( err ) )
            );
    }

    createUser( body?: User, observe?: 'body' ): Observable<any>;
    createUser( body?: User, observe?: 'response' ): Observable<HttpResponse<any>>;
    createUser( body?: User, observe?: 'events' ): Observable<HttpEvent<any>>;
    createUser( body?: User, observe: any = 'body' ): Observable<any> {

        let _headers = new HttpHeaders();
        _headers = _headers.set( 'Content-Type', this.methodConfig.createUser.consume );


        const httpOptions = { 
            headers: _headers,
            observe: observe,
            reportProgress: this.methodConfig.createUser.reportProgress,
            withCredentials: this.methodConfig.createUser.withCredentials
        };

        return this.http.post<any>( `${ this.apiEndpoint }/user`, 
            body, 
            httpOptions )
            .pipe(
                retry( 2 ),
                catchError( err => this.handleCreateUserError( err ) )
            );
    }

    createUsersWithArrayInput( body?: User, observe?: 'body' ): Observable<any>;
    createUsersWithArrayInput( body?: User, observe?: 'response' ): Observable<HttpResponse<any>>;
    createUsersWithArrayInput( body?: User, observe?: 'events' ): Observable<HttpEvent<any>>;
    createUsersWithArrayInput( body?: User, observe: any = 'body' ): Observable<any> {

        let _headers = new HttpHeaders();
        _headers = _headers.set( 'Content-Type', this.methodConfig.createUsersWithArrayInput.consume );


        const httpOptions = { 
            headers: _headers,
            observe: observe,
            reportProgress: this.methodConfig.createUsersWithArrayInput.reportProgress,
            withCredentials: this.methodConfig.createUsersWithArrayInput.withCredentials
        };

        return this.http.post<any>( `${ this.apiEndpoint }/user/createWithArray`, 
            body, 
            httpOptions )
            .pipe(
                retry( 2 ),
                catchError( err => this.handleCreateUsersWithArrayInputError( err ) )
            );
    }

    createUsersWithListInput( body?: User, observe?: 'body' ): Observable<any>;
    createUsersWithListInput( body?: User, observe?: 'response' ): Observable<HttpResponse<any>>;
    createUsersWithListInput( body?: User, observe?: 'events' ): Observable<HttpEvent<any>>;
    createUsersWithListInput( body?: User, observe: any = 'body' ): Observable<any> {

        let _headers = new HttpHeaders();
        _headers = _headers.set( 'Content-Type', this.methodConfig.createUsersWithListInput.consume );


        const httpOptions = { 
            headers: _headers,
            observe: observe,
            reportProgress: this.methodConfig.createUsersWithListInput.reportProgress,
            withCredentials: this.methodConfig.createUsersWithListInput.withCredentials
        };

        return this.http.post<any>( `${ this.apiEndpoint }/user/createWithList`, 
            body, 
            httpOptions )
            .pipe(
                retry( 2 ),
                catchError( err => this.handleCreateUsersWithListInputError( err ) )
            );
    }

    loginUser( parameters: LoginUserParameters, observe?: 'body' ): Observable<string | string>;
    loginUser( parameters: LoginUserParameters, observe?: 'response' ): Observable<HttpResponse<string | string>>;
    loginUser( parameters: LoginUserParameters, observe?: 'events' ): Observable<HttpEvent<string | string>>;
    loginUser( parameters: LoginUserParameters, observe: any = 'body' ): Observable<any> {

        let _headers = new HttpHeaders();
        _headers = _headers.set( 'Accept', this.methodConfig.loginUser.accept );

        let _params = new HttpParams();
        _params.append( 'username', parameters.username.toString() );
        _params.append( 'password', parameters.password.toString() );

        const httpOptions = { 
            headers: _headers,
            params: _params,
            observe: observe,
            reportProgress: this.methodConfig.loginUser.reportProgress,
            withCredentials: this.methodConfig.loginUser.withCredentials
        };

        return this.http.get<string | string>( `${ this.apiEndpoint }/user/login`, 
            httpOptions )
            .pipe(
                retry( 2 ),
                catchError( err => this.handleLoginUserError( err ) )
            );
    }

    logoutUser( observe?: 'body' ): Observable<any>;
    logoutUser( observe?: 'response' ): Observable<HttpResponse<any>>;
    logoutUser( observe?: 'events' ): Observable<HttpEvent<any>>;
    logoutUser( observe: any = 'body' ): Observable<any> {



        const httpOptions = { 
            observe: observe,
            reportProgress: this.methodConfig.logoutUser.reportProgress,
            withCredentials: this.methodConfig.logoutUser.withCredentials
        };

        return this.http.get<any>( `${ this.apiEndpoint }/user/logout`, 
            httpOptions )
            .pipe(
                retry( 2 ),
                catchError( err => this.handleLogoutUserError( err ) )
            );
    }

    getUserByName( parameters: GetUserByNameParameters, observe?: 'body' ): Observable<string | User>;
    getUserByName( parameters: GetUserByNameParameters, observe?: 'response' ): Observable<HttpResponse<string | User>>;
    getUserByName( parameters: GetUserByNameParameters, observe?: 'events' ): Observable<HttpEvent<string | User>>;
    getUserByName( parameters: GetUserByNameParameters, observe: any = 'body' ): Observable<any> {

        let _headers = new HttpHeaders();
        _headers = _headers.set( 'Accept', this.methodConfig.getUserByName.accept );


        const httpOptions = { 
            headers: _headers,
            observe: observe,
            reportProgress: this.methodConfig.getUserByName.reportProgress,
            withCredentials: this.methodConfig.getUserByName.withCredentials
        };

        return this.http.get<string | User>( `${ this.apiEndpoint }/user/${ encodeURIComponent( parameters.username ) }`, 
            httpOptions )
            .pipe(
                retry( 2 ),
                catchError( err => this.handleGetUserByNameError( err ) )
            );
    }

    updateUser( parameters: UpdateUserParameters, body?: User, observe?: 'body' ): Observable<any>;
    updateUser( parameters: UpdateUserParameters, body?: User, observe?: 'response' ): Observable<HttpResponse<any>>;
    updateUser( parameters: UpdateUserParameters, body?: User, observe?: 'events' ): Observable<HttpEvent<any>>;
    updateUser( parameters: UpdateUserParameters, body?: User, observe: any = 'body' ): Observable<any> {

        let _headers = new HttpHeaders();
        _headers = _headers.set( 'Content-Type', this.methodConfig.updateUser.consume );


        const httpOptions = { 
            headers: _headers,
            observe: observe,
            reportProgress: this.methodConfig.updateUser.reportProgress,
            withCredentials: this.methodConfig.updateUser.withCredentials
        };

        return this.http.put<any>( `${ this.apiEndpoint }/user/${ encodeURIComponent( parameters.username ) }`, 
            body, 
            httpOptions )
            .pipe(
                retry( 2 ),
                catchError( err => this.handleUpdateUserError( err ) )
            );
    }

    deleteUser( parameters: DeleteUserParameters, observe?: 'body' ): Observable<any>;
    deleteUser( parameters: DeleteUserParameters, observe?: 'response' ): Observable<HttpResponse<any>>;
    deleteUser( parameters: DeleteUserParameters, observe?: 'events' ): Observable<HttpEvent<any>>;
    deleteUser( parameters: DeleteUserParameters, observe: any = 'body' ): Observable<any> {



        const httpOptions = { 
            observe: observe,
            reportProgress: this.methodConfig.deleteUser.reportProgress,
            withCredentials: this.methodConfig.deleteUser.withCredentials
        };

        return this.http.delete<any>( `${ this.apiEndpoint }/user/${ encodeURIComponent( parameters.username ) }`, 
            httpOptions )
            .pipe(
                retry( 2 ),
                catchError( err => this.handleDeleteUserError( err ) )
            );
    }


    handleUpdatePetError( error: HttpErrorResponse ) {
        return this.handleError( error, [
            {
                code: "400",
                description: "Invalid ID supplied",
            },
            {
                code: "404",
                description: "Pet not found",
            },
            {
                code: "405",
                description: "Validation exception",
            },
        ] );
    }

    handleAddPetError( error: HttpErrorResponse ) {
        return this.handleError( error, [
            {
                code: "405",
                description: "Invalid input",
            },
        ] );
    }

    handleFindPetsByStatusError( error: HttpErrorResponse ) {
        return this.handleError( error, [
            {
                code: "400",
                description: "Invalid status value",
            },
        ] );
    }

    handleFindPetsByTagsError( error: HttpErrorResponse ) {
        return this.handleError( error, [
            {
                code: "400",
                description: "Invalid tag value",
            },
        ] );
    }

    handleGetPetByIdError( error: HttpErrorResponse ) {
        return this.handleError( error, [
            {
                code: "400",
                description: "Invalid ID supplied",
            },
            {
                code: "404",
                description: "Pet not found",
            },
        ] );
    }

    handleUpdatePetWithFormError( error: HttpErrorResponse ) {
        return this.handleError( error, [
            {
                code: "405",
                description: "Invalid input",
            },
        ] );
    }

    handleDeletePetError( error: HttpErrorResponse ) {
        return this.handleError( error, [
            {
                code: "400",
                description: "Invalid ID supplied",
            },
            {
                code: "404",
                description: "Pet not found",
            },
        ] );
    }

    handlePlaceOrderError( error: HttpErrorResponse ) {
        return this.handleError( error, [
            {
                code: "400",
                description: "Invalid Order",
            },
        ] );
    }

    handleGetOrderByIdError( error: HttpErrorResponse ) {
        return this.handleError( error, [
            {
                code: "400",
                description: "Invalid ID supplied",
            },
            {
                code: "404",
                description: "Order not found",
            },
        ] );
    }

    handleDeleteOrderError( error: HttpErrorResponse ) {
        return this.handleError( error, [
            {
                code: "400",
                description: "Invalid ID supplied",
            },
            {
                code: "404",
                description: "Order not found",
            },
        ] );
    }

    handleCreateUserError( error: HttpErrorResponse ) {
        return this.handleError( error, [
            {
                code: "default",
                description: "successful operation",
            },
        ] );
    }

    handleCreateUsersWithArrayInputError( error: HttpErrorResponse ) {
        return this.handleError( error, [
            {
                code: "default",
                description: "successful operation",
            },
        ] );
    }

    handleCreateUsersWithListInputError( error: HttpErrorResponse ) {
        return this.handleError( error, [
            {
                code: "default",
                description: "successful operation",
            },
        ] );
    }

    handleLoginUserError( error: HttpErrorResponse ) {
        return this.handleError( error, [
            {
                code: "400",
                description: "Invalid username/password supplied",
            },
        ] );
    }

    handleLogoutUserError( error: HttpErrorResponse ) {
        return this.handleError( error, [
            {
                code: "default",
                description: "successful operation",
            },
        ] );
    }

    handleGetUserByNameError( error: HttpErrorResponse ) {
        return this.handleError( error, [
            {
                code: "400",
                description: "Invalid username supplied",
            },
            {
                code: "404",
                description: "User not found",
            },
        ] );
    }

    handleUpdateUserError( error: HttpErrorResponse ) {
        return this.handleError( error, [
            {
                code: "400",
                description: "Invalid user supplied",
            },
            {
                code: "404",
                description: "User not found",
            },
        ] );
    }

    handleDeleteUserError( error: HttpErrorResponse ) {
        return this.handleError( error, [
            {
                code: "400",
                description: "Invalid username supplied",
            },
            {
                code: "404",
                description: "User not found",
            },
        ] );
    }


    private handleErrorDefault( error: HttpErrorResponse ) {
        return this.handleError( error );
    }

    private handleError( error: HttpErrorResponse, errorList?: ErrorObject[] ) {
        let description = 'Something bad happened; please try again later.';
        if ( error.error instanceof ErrorEvent ) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error( 'An error occurred:', error.error.message );
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            let defaultDescription = errorList?.find( e => e.code === "default" )?.description;
            let codeDescription = errorList?.find( e => e.code === error.status.toString() )?.description;
            description = codeDescription == null ? ( defaultDescription == null ? description : defaultDescription ) : codeDescription;

            console.error(
                `Backend returned code ${ error.status }> ${ description }` +
                `body was: ${ error.error }` );
        }
        // return an observable with a user-facing error message
        return throwError( description );
    }
}