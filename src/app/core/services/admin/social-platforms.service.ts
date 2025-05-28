import { Injectable } from "@angular/core";
import { BaseApiService } from "../base-api.service";
import { HttpClient } from "@angular/common/http";
import { Result } from "../../../shared/models/results/result.model";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SocialPlatformsService extends BaseApiService {
    protected override baseUrl = `${this.environment.apiUrl}/admin/social-platforms`;

    constructor(protected override http: HttpClient) {
        super(http);
    }

    public getAllSocialPlatforms(queryParams: string): Observable<Result<any,  any>> {
        return this.get<Result<any, any>>('?' + queryParams);
    }

    public createSocialPlatform(socialPlatform: any): Observable<Result<any, any>> {
        return this.post<Result<any, any>>('', socialPlatform);
    }

    public updateSocialPlatform(socialPlatformId: string, socialPlatform: any): Observable<Result<any, any>> {
        return this.put<Result<any, any>>(`${socialPlatformId}`, socialPlatform);
    }

    public deleteSocialPlatform(socialPlatformId: string): Observable<Result<any, any>> {
        return this.delete<Result<any, any>>(`${socialPlatformId}`);
    }
}