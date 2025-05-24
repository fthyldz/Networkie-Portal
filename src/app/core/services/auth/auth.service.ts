import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { LoginDto } from "../../../shared/models/auth/login.model";
import { Result } from "../../../shared/models/results/result.model";
import { BaseApiService } from "../base-api.service";

@Injectable({
    providedIn: 'root'
})
export class AuthService extends BaseApiService {
    private readonly TOKEN_KEY = 'token';
    private readonly REFRESH_TOKEN_KEY = 'refreshToken';
    private readonly authSubject = new BehaviorSubject<boolean>(this.hasToken());
    
    isAuthenticated$ = this.authSubject.asObservable();

    protected override baseUrl = `${this.environment.apiUrl}/auth`;

    constructor(protected override http: HttpClient) {
        super(http);
    }

    login(data: LoginDto): Observable<Result<any, any>> {
        return this.post<Result<any, any>>('login', data).pipe(
            tap(response => {
                if (response.data?.token) {
                    this.setToken(response.data.token);
                }
                if (response.data?.refreshToken) {
                    this.setRefreshToken(response.data.refreshToken);
                }
            })
        );
    }

    logout(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        this.authSubject.next(false);
    }

    setToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
        this.authSubject.next(true);
    }

    removeToken(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
        this.authSubject.next(false);
    }

    setRefreshToken(refreshToken: string): void {
        localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    }

    hasToken(): boolean {
        return !!localStorage.getItem(this.TOKEN_KEY);
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    getRefreshToken(): string | null {
        return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }

    register(data: any): Observable<Result<any, any>> {
        return this.post<Result<any, any>>('register', data);
    }

    verifyEmail(verificationCode: string): Observable<Result<any, any>> {
        return this.post<Result<any, any>>('verify-email', { verificationCode });
    }

    resendEmailVerificationCode(uniqueCode: string): Observable<Result<any, any>> {
        return this.post<Result<any, any>>('resend-email-verification-code', { uniqueCode });
    }

    completeProfile(data: any): Observable<Result<any, any>> {
        return this.post<Result<any, any>>('complete-profile', data);
    }

    profileCompleted(userId: string): Observable<Result<boolean, any>> {
        return this.get<Result<boolean, any>>('profile-completed', { userId });
    }

    forgotPassword(email: string): Observable<Result<any, any>> {
        return this.post<Result<any, any>>('forgot-password', { email });
    }

    refreshToken(): Observable<Result<any, any>> {
        return this.post<Result<any, any>>('refresh-token', { refreshToken: this.getRefreshToken() });;
    }
}