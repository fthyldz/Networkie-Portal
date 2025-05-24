import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Result } from "../../../shared/models/results/result.model";
import { BaseApiService } from "../base-api.service";

@Injectable({
    providedIn: 'root'
})
export class CommonService extends BaseApiService {
    protected override baseUrl = `${this.environment.apiUrl}/common`;

    constructor(protected override http: HttpClient) {
        super(http);
    }

    getUniversities(): Observable<Result<any, any>> {
        return this.get<Result<any, any>>('universities');
    }

    getDepartments(): Observable<Result<any, any>> {
        return this.get<Result<any, any>>('departments');
    }

    getProfessions(): Observable<Result<any, any>> {
        return this.get<Result<any, any>>('professions');
    }

    getCountries(): Observable<Result<any, any>> {
        return this.get<Result<any, any>>('countries');
    }

    getStates(countryId: string): Observable<Result<any, any>> {
        return this.get<Result<any, any>>('states', { countryId });
    }

    getCities(countryId: string, stateId: string): Observable<Result<any, any>> {
        const params: any = { countryId };
        if (stateId) {
            params.stateId = stateId;
        }
        return this.get<Result<any, any>>('cities', params);
    }

    getDistricts(cityId: string): Observable<Result<any, any>> {
        return this.get<Result<any, any>>('districts', { cityId });
    }

    getSocialPlatforms(): Observable<Result<any, any>> {
        return this.get<Result<any, any>>('social-platforms');
    }
}