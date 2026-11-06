import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  try {
    const token: string | null =
      JSON.parse(localStorage.getItem('chat.token') ?? '')?.token ?? null;
    if (!token) return next(req);
    return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
  } catch {
    return next(req);
  }
};
