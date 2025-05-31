import { Injectable } from "@angular/core";
import { BaseApiService } from "../base-api.service";
import { HttpClient } from "@angular/common/http";
import { Result } from "../../../shared/models/results/result.model";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class UsersService extends BaseApiService {
    protected override baseUrl = `${this.environment.apiUrl}/admin/users`;

    constructor(protected override http: HttpClient) {
        super(http);
    }

    public getAllUsers(queryParams: string): Observable<Result<any,  any>> {
        return this.get<Result<any, any>>('?' + queryParams);
    }

    public getUserById(userId: any): Observable<Result<any, any>> {
        return this.get<Result<any, any>>(`${userId}`);
    }

    public updateUser(userId: any, data: any): Observable<Result<any, any>> {
        return this.put<Result<any, any>>(`${userId}`, data);
    }

    public deleteUser(userId: any): Observable<Result<any, any>> {
        return this.delete<Result<any, any>>(`${userId}`);
    }

    public createUser(user: any): Observable<Result<any, any>> {
        return this.post<Result<any, any>>('', user);
    }
}