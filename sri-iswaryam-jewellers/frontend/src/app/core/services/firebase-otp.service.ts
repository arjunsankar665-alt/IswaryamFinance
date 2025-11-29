import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { FirebaseApp, FirebaseOptions, initializeApp } from 'firebase/app';
import {
	Auth,
	ConfirmationResult,
	RecaptchaVerifier,
	UserCredential,
	getAuth,
	signInWithPhoneNumber
} from 'firebase/auth';

interface ApiResponse<T> {
	success: boolean;
	data: T;
	message?: string;
}

export interface FirebaseOtpSession {
	confirmation: ConfirmationResult;
	phoneNumber: string;
}

@Injectable({ providedIn: 'root' })
export class FirebaseOtpService {
	private app?: FirebaseApp;
	private auth?: Auth;
	private recaptcha?: RecaptchaVerifier;
	private currentSession?: FirebaseOtpSession;
	private configPromise?: Promise<FirebaseOptions>;

	constructor(private http: HttpClient, private zone: NgZone) {}

	private async ensureAuth(): Promise<Auth> {
		if (this.auth) {
			return this.auth;
		}

		const config = await this.loadFirebaseConfig();
		this.app = initializeApp(config);
		this.auth = getAuth(this.app);
		this.auth.useDeviceLanguage();
		return this.auth;
	}

	private async loadFirebaseConfig(): Promise<FirebaseOptions> {
		if (!this.configPromise) {
			this.configPromise = lastValueFrom(
				this.http.get<ApiResponse<FirebaseOptions>>('/api/config/firebase-web')
			).then((response) => {
				if (!response?.success || !response.data?.apiKey) {
					throw new Error(response?.message || 'Unable to load Firebase configuration');
				}
				return response.data;
			});
		}
		return this.configPromise;
	}

	private async ensureRecaptcha(containerId: string): Promise<RecaptchaVerifier> {
		if (this.recaptcha) {
			return this.recaptcha;
		}

		const auth = await this.ensureAuth();

		this.recaptcha = new RecaptchaVerifier(auth, containerId, {
			size: 'normal'
		});

		await this.recaptcha.render();
		return this.recaptcha;
	}

	async requestOtp(containerId: string, countryCode: string, phone: string): Promise<FirebaseOtpSession> {
		const recaptcha = await this.ensureRecaptcha(containerId);
		const auth = await this.ensureAuth();
		const formatted = this.formatNumber(countryCode, phone);

		const confirmation = await signInWithPhoneNumber(auth, formatted, recaptcha);
		this.currentSession = { confirmation, phoneNumber: formatted };
		return this.currentSession;
	}

	async confirmOtp(code: string): Promise<{ credential: UserCredential; idToken: string }> {
		if (!this.currentSession) {
			throw new Error('OTP session not initialized');
		}

		const credential = await this.currentSession.confirmation.confirm(code);
		const idToken = await credential.user.getIdToken(true);
		return { credential, idToken };
	}

	reset(): void {
		this.currentSession = undefined;

		if (this.recaptcha) {
			this.zone.runOutsideAngular(() => {
				this.recaptcha?.clear();
			});
			this.recaptcha = undefined;
		}
	}

	private formatNumber(countryCode: string, phone: string): string {
		const trimmedCode = countryCode.startsWith('+') ? countryCode : `+${countryCode}`;
		const digits = phone.replace(/[^0-9]/g, '');
		return `${trimmedCode}${digits}`;
	}
}
