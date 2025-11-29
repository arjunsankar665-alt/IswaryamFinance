import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  authService.setRedirectUrl(state.url);

  return authService.isAuthenticated$.pipe(
    take(1),
    map((isAuthed) => {
      if (isAuthed) {
        return true;
      }
      authService.promptLogin(state.url);
      router.navigate(['/home']);
      return false;
    })
  );
};
