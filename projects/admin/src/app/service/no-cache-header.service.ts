import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable()
export class NoCacheHeaderService implements HttpInterceptor {
intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authReq = req.clone({
      // Prevent caching in IE, in particular IE11.
      // See: https://support.microsoft.com/en-us/help/234067/how-to-prevent-caching-in-internet-explorer
      setHeaders: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache'
      }
    });
    return next.handle(authReq);
  }
}
