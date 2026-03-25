import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { jwtInterceptor } from './app/interceptors/jwt.interceptors';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([jwtInterceptor])),
    provideRouter(routes)
  ]
});