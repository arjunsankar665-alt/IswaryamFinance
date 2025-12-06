import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LiveRatesPayload {
  location: string;
  goldPerGram: number;
  silverPerGram: number;
  updatedAt: string;
  source: string;
  stale: boolean;
}

interface LiveRatesResponse {
  success: boolean;
  data: LiveRatesPayload;
  stale?: boolean;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class LiveRatesService {
  private readonly endpoint = `${environment.apiUrl}/live-rates`;

  constructor(private readonly http: HttpClient) {}

  async fetchRates(): Promise<LiveRatesPayload> {
    const response = await firstValueFrom(
      this.http.get<LiveRatesResponse>(this.endpoint)
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Unable to fetch live rates');
    }

    return {
      ...response.data,
      stale: response.stale ?? response.data.stale ?? false
    };
  }
}
