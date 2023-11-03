import { Injectable } from "@angular/core"; 
import {HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS} from "@angular/common/http"
import { Observable, of, throwError } from "rxjs";
import { delay, materialize, dematerialize } from "rxjs";

import { Role } from "./helpers";


const users = [
    {id: 1, username: 'admin', password : 'admin', firstName: 'Ivan', lastName : 'Ivanov', role: Role.Admin},
    {id: 2, username: 'user', password : 'user', firstName: 'Oleg', lastName : 'Ivanov', role: Role.User}
]

@Injectable()
export class FakeBackendInteceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const {url, method, headers, body} = req;
        
        return handleRoute();
        
        function authentificate(){
            const {username, password} = body;
            const user = users.find(x=> x.username === username && x.password === password);
            if (!user) return error ('User not found!')
            return ok({
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                role: user.role,
                jwtToken: 'fake-jwt-token.${user.id}'
            })
        }

        function getUsers(){
            if (!isLogged()) return unauthorized();
            return ok(users);
        }
        
        function isLogged(){
            const authheader = headers.get('Authorization') ||  '';
            return authheader.startsWith('Bearer fake-jwt-token')

        }
        function unauthorized() { 
            return throwError(() => ({ status: 401, error: { message: 'unauthorized' } })) 
                .pipe(materialize(), delay(500), dematerialize()); // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648); 
        }
        function handleRoute() {
            switch(true) {
                case url.endsWith('/authentificate') && method === 'POST':
                    return authentificate();
                case url.endsWith('/users') && method === 'GET':
                    return getUsers()
                default:
                    return next.handle(req);
            }
        }
        function error(message: string) { 
            return throwError(() => ({ status: 400, error: { message } })) 
                .pipe(materialize(), delay(500), dematerialize()); 
        }
        function ok(body: any) { 
            return of(new HttpResponse({ status: 200, body })) 
                .pipe(delay(500)); // delay observable to simulate server api call 
        }
    }
}

export const fakeBackendProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInteceptor,
    multi: true
}