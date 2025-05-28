import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../../../../../core/services/admin/users.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
    selector: 'app-user-list',
    standalone: false,
    templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit {
    
    Math = Math;
    filters!: FormGroup;
    filteredUsers: any[] = [];

    pageIndex = 0;
    pageSize = 25;
    totalCount = 0;

    constructor(private userService: UsersService, private router: Router, private fb: FormBuilder) { }

    ngOnInit(): void {
            this.filters = this.fb.group({
                firstName: [''],
                middleName: [''],
                lastName: [''],
                email: [''],
                phoneNumber: ['']
            });
    
            this.filters.valueChanges
                .pipe(debounceTime(400), distinctUntilChanged())
                .subscribe(() => {
                    this.pageIndex = 0;
                    this.getData();
                });
    
            // Initial data load
            this.getData();
        }
    
        getData(): void {
            const filterValues = this.filters.value;
            const hasEnough = Object.values(filterValues).some((v: any) => v && v.length >= 3);
    
            // Only require filter values if not on first page
            if (!hasEnough && this.pageIndex !== 0) {
                return;
            }
    
            const queryParams = [
                ...Object.entries(filterValues)
                    .filter(([_, v]: any) => v && v.length >= 3)
                    .map(([key, value]: any) => `${key}=${encodeURIComponent(value)}`),
                `pageIndex=${this.pageIndex}`,
                `pageSize=${this.pageSize}`
            ].join('&');
    
            this.userService.getAllUsers(queryParams).subscribe({
                next: (response) => {
                    if (response && response.data) {
                        this.filteredUsers = response.data.data || [];
                        this.totalCount = response.data.totalCount || 0;
                    } else {
                        console.error('Error fetching dashboard data:', response?.message || 'Invalid response format');
                        this.filteredUsers = [];
                        this.totalCount = 0;
                    }
                },
                error: (error) => {
                    console.error('Error fetching dashboard data:', error);
                    this.filteredUsers = [];
                    this.totalCount = 0;
                }
            });
        }
    
        changePage(newPageIndex: number): void {
            this.pageIndex = newPageIndex;
            this.getData();
        }
    
        changePageSize(newSize: number): void {
            this.pageSize = typeof newSize === 'string' ? parseInt(newSize, 10) : newSize;
            this.pageSize = Math.max(25, Math.min(this.pageSize, 100));
            this.pageIndex = 0;
            this.getData();
        }

    editUser(userId: string): void {
        this.router.navigate(['/admin/users', userId]);
    }

    deleteUser(userId: string): void {
        const confirmed = confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?');
        if (!confirmed) return;

        this.userService.deleteUser(userId).subscribe({
            next: () => {
                this.filteredUsers = this.filteredUsers.filter(u => u.id !== userId);
            },
            error: (err) => {
                console.error('Kullanıcı silinirken hata oluştu:', err);
            }
        });
    }
}