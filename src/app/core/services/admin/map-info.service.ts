import { Injectable } from "@angular/core";
import { BaseApiService } from "../base-api.service";
import { HttpClient } from "@angular/common/http";
import { Result } from "../../../shared/models/results/result.model";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class MapInfoService extends BaseApiService {
    protected override baseUrl = `${this.environment.apiUrl}/admin/map-info`;

    constructor(protected override http: HttpClient) {
        super(http);
    }

    public getAllCountries(queryParams: string): Observable<Result<any,  any>> {
        return this.get<Result<any, any>>('countries/?' + queryParams);
    }

    public createCountry(country: any): Observable<Result<any, any>> {
        return this.post<Result<any, any>>('countries', country);
    }

    public getAllCities(queryParams: string): Observable<Result<any,  any>> {
        return this.get<Result<any, any>>('cities/?' + queryParams);
    }

    public createCity(city: any): Observable<Result<any, any>> {
        return this.post<Result<any, any>>('cities', city);
    }
}