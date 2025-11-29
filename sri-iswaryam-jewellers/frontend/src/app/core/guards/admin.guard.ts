import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AdminAccessService } from '../services/admin-access.service';

export const adminGuard: CanActivateFn = (_route, state) => {
  const router = inject(Router);
  const adminAccessService = inject(AdminAccessService);

  if (adminAccessService.hasAccess()) {
    return true;
  }

  adminAccessService.rememberRedirect(state.url);
  return router.createUrlTree(['/admin-access'], {
    queryParams: { redirect: state.url }
  });
};
