import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, EMPTY, Observable, tap, throwError } from "rxjs";
import { AuthService } from "../services/auth/auth.service";

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {

    constructor(
        private authService: AuthService,
        private router: Router,
    ) { }

  intercept(req: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Request URL: ' + req.url);
    return handler.handle(req).pipe(
        // Response başarılı geldiğinde
        tap((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            console.log('Response:', event);
          }
        }),
  
        // Hatalı durumlar
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.authService.removeToken();
            this.router.navigate(['/auth', 'login']);
            return EMPTY;
          }
  
          // 400 BadRequest
          if (error.status === 400) {
            if (error.error?.isProfileCompleted != null && error.error?.isProfileCompleted === false) {
                this.router.navigate(['/auth', 'complete-profile']);
                return EMPTY;
            }

            if (error.error?.isEmailVerified != null && error.error?.isEmailVerified === false) {
              this.router.navigate(['/auth/verify-email', error.error?.uniqueCode]);
              return EMPTY;
          }
          }
  
          // Genel hata yakalama
          return throwError(() => error);
        })
    );;
  }
}