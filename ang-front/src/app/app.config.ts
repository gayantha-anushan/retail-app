import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { APIInterceptor } from './apiinterceptor';

export const appConfig: ApplicationConfig = {
  providers: [{
    provide:HTTP_INTERCEPTORS,
    useClass:APIInterceptor,
    multi:true
  },
    provideRouter(routes),importProvidersFrom(HttpClientModule)]
};
