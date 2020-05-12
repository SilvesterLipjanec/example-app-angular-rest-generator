import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Observable } from 'rxjs';

/** Transform the free-form body into a serialized format suitable for transmission to the server.
 *  According Content-Type set in header
  */
@Injectable()
export class GatewayInterceptor implements HttpInterceptor {

    intercept( req: HttpRequest<any>, next: HttpHandler ):
        Observable<HttpEvent<any>> {

        const serializedBody = req.serializeBody();
        const newReq = req.clone( { body: serializedBody } );
        
        return next.handle( newReq );
    }
}