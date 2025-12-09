import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface LiveRatesResponse {
  success: boolean;
  data?: {
    location: string;
    goldPerGram: number | null;
    silverPerGram: number | null;
    updatedAt: string;
    source: string;
    stale: boolean;
  };
  stale?: boolean;
  message?: string;
}

@Component({
  selector: 'app-gold-rate',
  templateUrl: './gold-rate.component.html',
  styleUrls: ['./gold-rate.component.css']
})
export class GoldRateComponent implements OnInit {
  loading = true;
  error: string | null = null;
  stale = false;
  location = '—';
  goldPerGram: number | null = null;
  silverPerGram: number | null = null;
  updatedAt: string | null = null;
  source = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadRates();
  }

  loadRates(): void {
    this.loading = true;
    this.error = null;
    this.http.get<LiveRatesResponse>(`${environment.apiUrl}/live-rates`).subscribe({
      next: (res) => {
        const data = res.data;
        this.stale = !!res.stale || !!data?.stale;
        this.location = data?.location ?? 'Live rates';
        this.goldPerGram = data?.goldPerGram ?? null;
        this.silverPerGram = data?.silverPerGram ?? null;
        this.updatedAt = data?.updatedAt ?? null;
        this.source = data?.source ?? '';
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Unable to fetch live rates right now. Please try again shortly.';
        console.error('Live rates error', err);
        this.loading = false;
      }
    });
  }

  get updatedLabel(): string {
    if (!this.updatedAt) return '—';
    const date = new Date(this.updatedAt);
    return date.toLocaleString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true, month: 'short', day: 'numeric' });
  }

  get goldStatusLabel(): string {
    if (this.loading) return 'Loading';
    if (this.goldPerGram === null) return 'Pending';
    return this.stale ? 'Stale' : 'Live';
  }

  get silverStatusLabel(): string {
    if (this.loading) return 'Loading';
    if (this.silverPerGram === null) return 'Pending';
    return this.stale ? 'Stale' : 'Live';
  }
}
