import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface StorefrontMenu {
  id: string;
  label: string;
  slug: string;
  url: string;
  display: 'link' | 'categories';
  icon?: string;
}

@Injectable({ providedIn: 'root' })
export class MenuService {
  private readonly baseUrl = `${environment.apiUrl}/menus`;
  private readonly menusSubject = new BehaviorSubject<StorefrontMenu[]>([]);
  private isLoaded = false;

  readonly menus$ = this.menusSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  async preload(force = false): Promise<void> {
    if (this.isLoaded && !force) {
      return;
    }
    const response = await firstValueFrom(
      this.http.get<ApiResponse<StorefrontMenu[]>>(this.baseUrl)
    );
    this.menusSubject.next(response.data ?? []);
    this.isLoaded = true;
  }
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
