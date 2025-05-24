import { Injectable } from "@angular/core";
import { BaseApiService } from "../base-api.service";
import { HttpClient } from "@angular/common/http";
import { Result } from "../../../shared/models/results/result.model";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ProfileService extends BaseApiService {
    protected override baseUrl = `${this.environment.apiUrl}/profile`;

    constructor(protected override http: HttpClient) {
        super(http);
    }

    getUser(): Observable<Result<any, any>> {
        return this.get<Result<any, any>>('account');
    }

    updateProfile(data: any): Observable<Result<any, any>> {
        return this.put<Result<any, any>>('update', data);
    }
}