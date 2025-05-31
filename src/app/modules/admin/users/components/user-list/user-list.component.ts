import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../../../../../core/services/admin/users.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ModalService } from '../../../../../shared/services/modal.service';
import { LoadingService } from '../../../../../shared/services/loading.service';

@Component({
    selector: 'app-user-list',
    standalone: false,
    templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit {
    
    Math = Math;
    filters!: FormGroup;
    createUserForm!: FormGroup;
    filteredUsers: any[] = [];

    pageIndex = 0;
    pageSize = 25;
    totalCount = 0;

    constructor(
        private userService: UsersService,
        private router: Router,
        private fb: FormBuilder,
        private modalService: ModalService,
        private loadingService: LoadingService
    ) { }

    ngOnInit(): void {
            this.filters = this.fb.group({
                firstName: [''],
                middleName: [''],
                lastName: [''],
                email: [''],
                phoneNumber: [''],
                role: ['']
            });

            this.createUserForm = this.fb.group({
                firstName: ['', Validators.required],
                middleName: [''],
                lastName: [''],
                email: ['', [Validators.required, Validators.email]],
                password: ['', [Validators.required, Validators.minLength(6)]],
                role: ['', Validators.required]
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
        this.loadingService.show();
        this.userService.deleteUser(userId).subscribe({
            next: () => {
                this.loadingService.hide();
                this.filteredUsers = this.filteredUsers.filter(u => u.id !== userId);
            },
            error: (err) => {
                this.loadingService.hide();
                console.error('Kullanıcı silinirken hata oluştu:', err);
            }
        });
    }

    resetForm(): void {
        this.createUserForm.reset();
        this.createUserForm.patchValue({role: ''})
    }

    createUser(): void {
        if (this.createUserForm.valid) {
            this.loadingService.show();
            const newUser = this.createUserForm.value;
            console.log('Yeni kullanıcı:', newUser);
            this.userService.createUser(newUser).subscribe({
                next: (response) => {
                    this.loadingService.hide();
                    if (response && response.data) {
                        this.modalService.success('Kullanıcı başarıyla oluşturuldu');
                        this.resetForm();
                        this.getData();
                    }
                    else if (response && response.errors) {
                        this.modalService.error(response.errors);
                    }
                    else {
                        this.modalService.error('Bir hata oluştu');
                    }
                },
                error: (error) => {
                    this.loadingService.hide();
                    this.modalService.error('Kullanıcı oluşturulurken bir hata oluştu');
                }
            });
        }
    }
}