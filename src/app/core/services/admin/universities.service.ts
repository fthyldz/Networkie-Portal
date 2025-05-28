import { Injectable } from "@angular/core";
import { BaseApiService } from "../base-api.service";
import { HttpClient } from "@angular/common/http";
import { Result } from "../../../shared/models/results/result.model";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class UniversitiesService extends BaseApiService {
    protected override baseUrl = `${this.environment.apiUrl}/admin/universities`;

    constructor(protected override http: HttpClient) {
        super(http);
    }

    public getAllUniversities(queryParams: string): Observable<Result<any,  any>> {
        return this.get<Result<any, any>>('?' + queryParams);
    }

    public createUniversity(university: any): Observable<Result<any, any>> {
        return this.post<Result<any, any>>('', university);
    }

    public updateUniversity(universityId: string, university: any): Observable<Result<any, any>> {
        return this.put<Result<any, any>>(`${universityId}`, university);
    }

    public deleteUniversity(universityId: string): Observable<Result<any, any>> {
        return this.delete<Result<any, any>>(`${universityId}`);
    }
}