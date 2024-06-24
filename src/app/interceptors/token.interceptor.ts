import { RenewTokenResponse, TokenApiModel } from '../models/token-api.model';
import { Router } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import checkTokenValid from '../helpers/checkTokenValid';
import { UserStoreService } from '../services/user-store.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private userStore: UserStoreService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let myToken = this.authService.getAccessToken();

    // this.start.load();
    // if (!checkTokenValid(myToken)) {
    //   let tokeApiModel: TokenApiModel = {
    //     accessToken: this.authService.getAccessToken(),
    //     refreshToken: this.authService.getRefreshToken(),
    //   };
    //   this.authService.renewToken(tokeApiModel).subscribe({
    //     next: (data: TokenApiModel) => {
    //       this.authService.storeToken(data.accessToken, data.refreshToken);
    //       const tokenPayload = this.authService.decodedToken();
    //       this.userStore.setFullNameForStore(tokenPayload.name);
    //       this.userStore.setRoleForStore(tokenPayload.role);
    //       myToken = data.accessToken;
    //     },
    //     error: (err) => {
    //       this.toastr.warning('Token is expired, Please Login again');
    //       this.authService.signOut();
    //       this.router.navigate(['login']);
    //     },
    //   });
    // }
    if (myToken) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${myToken}` }, // "Bearer "+myToken
      });
    }

    return next.handle(request).pipe(
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            // this.toast.warning({detail:"Warning", summary:"Token is expired, Please Login again"});
            // this.router.navigate(['login'])
            //handle
            return this.handleUnAuthorizedError(request, next);
          }
        }
        return throwError(() => err);
      })
    );
  }

  handleUnAuthorizedError(req: HttpRequest<any>, next: HttpHandler) {
    let tokeApiModel: TokenApiModel = {
      accessToken: this.authService.getAccessToken(),
      refreshToken: this.authService.getRefreshToken(),
    };
    return this.authService.renewToken(tokeApiModel).pipe(
      switchMap((data: RenewTokenResponse) => {
        this.authService.storeToken(
          data.result.accessToken,
          data.result.refreshToken
        );
        const tokenPayload = this.authService.decodedToken();
        this.userStore.setFullNameForStore(tokenPayload.name);
        this.userStore.setRoleForStore(tokenPayload.role);
        req = req.clone({
          setHeaders: { Authorization: `Bearer ${data.result.accessToken}` }, // "Bearer "+myToken
        });
        return next.handle(req);
      }),
      catchError((err) => {
        return throwError(() => {
          console.log('error refresh token');

          this.authService.signOut();
          this.toastr.warning('Token is expired, Please Login again');
        });
      })
    );
  }
}
