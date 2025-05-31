import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from '../../../shared/services/modal.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { DepartmentsService } from '../../../core/services/admin/departments.service';
import { LoadingService } from '../../../shared/services/loading.service';

@Component({
    selector: 'app-departments',
    standalone: false,
    templateUrl: './departments.component.html'
})
export class DepartmentsComponent implements OnInit {
    departmentForm!: FormGroup;
    isEditMode: boolean = false;
    selectedDepartmentId: string | null = null;

    Math = Math;
    filters!: FormGroup;
    filteredDepartments: any[] = [];

    pageIndex = 0;
    pageSize = 25;
    totalCount = 0;

    constructor(
        private fb: FormBuilder,
        private departmentsService: DepartmentsService,
        private modalService: ModalService,
        private loadingService: LoadingService
    ) { }

    ngOnInit(): void {
        this.filters = this.fb.group({
            search: ['']
        });

        this.filters.valueChanges
            .pipe(debounceTime(400), distinctUntilChanged())
            .subscribe(() => {
                this.pageIndex = 0;
                this.getData();
            });

        this.initForm();
        this.getData();
    }

    initForm(): void {
        this.departmentForm = this.fb.group({
            name: ['', [Validators.required]]
        });
    }

    getData(): void {
        const filterValues = this.filters.value;
        const hasEnough = Object.values(filterValues).some((v: any) => v && v.length >= 3);

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

        this.departmentsService.getAllDepartments(queryParams).subscribe({
            next: (response) => {
                if (response && response.data) {
                    this.filteredDepartments = response.data.data || [];
                    this.totalCount = response.data.totalCount || 0;
                } else {
                    console.error('Error fetching departments data:', response?.message || 'Invalid response format');
                    this.filteredDepartments = [];
                    this.totalCount = 0;
                }
            },
            error: (error) => {
                console.error('Error fetching departments data:', error);
                this.filteredDepartments = [];
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

    onSubmit(): void {
        if (this.departmentForm.valid) {
            this.loadingService.show();
            if (this.isEditMode && this.selectedDepartmentId) {
                this.updateDepartment();
            } else {
                this.createDepartment();
            }
        }
    }

    createDepartment(): void {
        this.departmentsService.createDepartment(this.departmentForm.value).subscribe({
            next: (response) => {
                this.loadingService.hide();
                if (response) {
                    this.modalService.success('Bölüm başarıyla oluşturuldu');
                    this.resetForm();
                    this.getData();
                } else {
                    this.modalService.error('Bir hata oluştu');
                }
            },
            error: (error) => {
                this.loadingService.hide();
                this.modalService.error('Bölüm oluşturulurken bir hata oluştu');
            }
        });
    }

    updateDepartment(): void {
        if (!this.selectedDepartmentId) return;

        this.departmentsService.updateDepartment(this.selectedDepartmentId, this.departmentForm.value).subscribe({
            next: (response) => {
                this.loadingService.hide();
                if (response) {
                    this.modalService.success('Bölüm başarıyla güncellendi');
                    this.resetForm();
                    this.getData();
                } else {
                    this.modalService.error('Bir hata oluştu');
                }
            },
            error: (error) => {
                this.loadingService.hide();
                this.modalService.error('Bölüm güncellenirken bir hata oluştu');
            }
        });
    }

    deleteDepartment(id: string | null): void {
        if (!id) return;
        const confirmed = confirm('Bu bölümü silmek istediğinizden emin misiniz?');
        if (!confirmed) return;
        this.loadingService.show();
        this.departmentsService.deleteDepartment(id).subscribe({
            next: (response) => {
                this.loadingService.hide();
                if (response) {
                    this.modalService.success('Bölüm başarıyla silindi');
                    this.getData();
                } else {
                    this.modalService.error('Bir hata oluştu');
                }
            },
            error: (error) => {
                this.loadingService.hide();
                this.modalService.error('Bölüm silinirken bir hata oluştu');
            }
        });
}

    editDepartment(department: any): void {
        this.isEditMode = true;
        this.selectedDepartmentId = department.id;
        this.departmentForm.patchValue({
            name: department.name
        });
    }

    resetForm(): void {
        this.isEditMode = false;
        this.selectedDepartmentId = null;
        this.departmentForm.reset();
    }
} 