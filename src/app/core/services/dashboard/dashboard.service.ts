import { Injectable } from "@angular/core";
import { BaseApiService } from "../base-api.service";
import { HttpClient } from "@angular/common/http";
import { Result } from "../../../shared/models/results/result.model";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DashboardService extends BaseApiService {
    protected override baseUrl = `${this.environment.apiUrl}/dashboard`;

    constructor(protected override http: HttpClient) {
        super(http);
    }

    getListData(queryParams: string): Observable<Result<any, any>> {
        return this.get<Result<any, any>>('list-data?' + queryParams);
    }

    getMapOverviewData(queryParams: string): Observable<Result<any, any>> {
        return this.get<Result<any, any>>('map/map-overview?' + queryParams);
    }
}