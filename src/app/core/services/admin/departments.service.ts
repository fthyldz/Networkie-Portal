import { Injectable } from "@angular/core";
import { BaseApiService } from "../base-api.service";
import { HttpClient } from "@angular/common/http";
import { Result } from "../../../shared/models/results/result.model";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DepartmentsService extends BaseApiService {
    protected override baseUrl = `${this.environment.apiUrl}/admin/departments`;

    constructor(protected override http: HttpClient) {
        super(http);
    }

    public getAllDepartments(queryParams: string): Observable<Result<any,  any>> {
        return this.get<Result<any, any>>('?' + queryParams);
    }

    public createDepartment(department: any): Observable<Result<any, any>> {
        return this.post<Result<any, any>>('', department);
    }

    public updateDepartment(departmentId: string, department: any): Observable<Result<any, any>> {
        return this.put<Result<any, any>>(`${departmentId}`, department);
    }

    public deleteDepartment(departmentId: string): Observable<Result<any, any>> {
        return this.delete<Result<any, any>>(`${departmentId}`);
    }
}