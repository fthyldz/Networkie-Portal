import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IHttpOptions } from '../../shared/models/base/http-options.model';
import { environment } from "../../../environments/environment";

export abstract class BaseApiService {
    protected environment = environment;
    protected abstract baseUrl: string;

    constructor(
        protected http: HttpClient
    ) { }

    protected get<T>(endpoint: string = '', params?: any, options: IHttpOptions = { loading: true }): Observable<T> {
        const url = this.buildUrl(endpoint);
        const httpParams = this.buildParams(params);
        const headers = this.buildHeaders(options);

        return this.http.get<T>(url, { params: httpParams, headers });
    }

    protected post<T>(endpoint: string = '', body?: any, options: IHttpOptions = { loading: true }): Observable<T> {
        const url = this.buildUrl(endpoint);
        const headers = this.buildHeaders(options);

        return this.http.post<T>(url, body, { headers });
    }

    protected put<T>(endpoint: string = '', body?: any, options: IHttpOptions = { loading: true }): Observable<T> {
        const url = this.buildUrl(endpoint);
        const headers = this.buildHeaders(options);

        return this.http.put<T>(url, body, { headers });
    }

    protected delete<T>(endpoint: string = '', params?: any, options: IHttpOptions = { loading: true }): Observable<T> {
        const url = this.buildUrl(endpoint);
        const httpParams = this.buildParams(params);
        const headers = this.buildHeaders(options);

        return this.http.delete<T>(url, { params: httpParams, headers });
    }

    private buildUrl(endpoint: string): string {
        return `${this.baseUrl}/${endpoint}`;
    }

    private buildParams(params?: any): HttpParams {
        let httpParams = new HttpParams();
        if (params) {
            Object.entries(params)
                .filter(([_, value]) => value !== null && value !== undefined)
                .forEach(([key, value]: [key: string, value: any]) => {
                    httpParams = httpParams.append(key, value.toString());
                });
        }
        return httpParams;
    }

    private buildHeaders(options: IHttpOptions): HttpHeaders {
        let headers = new HttpHeaders();
        if (!options.loading) {
            headers = headers.set('no-loading', 'true');
        }
        return headers;
    }
}