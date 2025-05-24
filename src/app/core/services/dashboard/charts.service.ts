import { Injectable } from "@angular/core";
import { BaseApiService } from "../base-api.service";
import { HttpClient } from "@angular/common/http";
import { Result } from "../../../shared/models/results/result.model";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ChartsService extends BaseApiService {
    protected override baseUrl = `${this.environment.apiUrl}/dashboard/charts`;

    constructor(protected override http: HttpClient) {
        super(http);
    }

    getGenderPieChartData(queryParams: string): Observable<Result<any, any>> {
        return this.get<Result<any, any>>('gender-pie-chart?' + queryParams);
    }

    getAgeBarChartData(queryParams: string): Observable<Result<any, any>> {
        return this.get<Result<any, any>>('age-bar-chart?' + queryParams);
    }

    getUniversityChartData(queryParams: string): Observable<Result<any, any>> {
        return this.get<Result<any, any>>('university-chart?' + queryParams);
    }

    getDepartmentChartData(queryParams: string): Observable<Result<any, any>> {
        return this.get<Result<any, any>>('department-chart?' + queryParams);
    }

    getProfessionChartData(queryParams: string): Observable<Result<any, any>> {
        return this.get<Result<any, any>>('profession-chart?' + queryParams);
    }

    getCountryChartData(queryParams: string): Observable<Result<any, any>> {
        return this.get<Result<any, any>>('country-chart?' + queryParams);
    }

    getCityChartData(queryParams: string): Observable<Result<any, any>> {
        return this.get<Result<any, any>>('city-chart?' + queryParams);
    }

    getEmploymentChartData(queryParams: string): Observable<Result<any, any>> {
        return this.get<Result<any, any>>('employment-chart?' + queryParams);
    }

    getEmploymentStatusChartData(queryParams: string): Observable<Result<any, any>> {
        return this.get<Result<any, any>>('employment-status-chart?' + queryParams);
    }

    getSocialPlatformChartData(queryParams: string): Observable<Result<any, any>> {
        return this.get<Result<any, any>>('social-platform-chart?' + queryParams);
    }
}