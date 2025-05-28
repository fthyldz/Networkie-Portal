import { Injectable } from "@angular/core";
import { BaseApiService } from "../base-api.service";
import { HttpClient } from "@angular/common/http";
import { Result } from "../../../shared/models/results/result.model";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ProfessionsService extends BaseApiService {
    protected override baseUrl = `${this.environment.apiUrl}/admin/professions`;

    constructor(protected override http: HttpClient) {
        super(http);
    }

    public getAllProfessions(queryParams: string): Observable<Result<any,  any>> {
        return this.get<Result<any, any>>('?' + queryParams);
    }

    public createProfession(profession: any): Observable<Result<any, any>> {
        return this.post<Result<any, any>>('', profession);
    }

    public updateProfession(professionId: string, profession: any): Observable<Result<any, any>> {
        return this.put<Result<any, any>>(`${professionId}`, profession);
    }

    public deleteProfession(professionId: string): Observable<Result<any, any>> {
        return this.delete<Result<any, any>>(`${professionId}`);
    }
}