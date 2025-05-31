import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from '../../../shared/services/modal.service';
import { UniversitiesService } from '../../../core/services/admin/universities.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { LoadingService } from '../../../shared/services/loading.service';

@Component({
    selector: 'app-universities',
    standalone: false,
    templateUrl: './universities.component.html'
})
export class UniversitiesComponent implements OnInit {
    universityForm!: FormGroup;
    isEditMode: boolean = false;
    selectedUniversityId: string | null = null;

    Math = Math;
    filters!: FormGroup;
    filteredUniversities: any[] = [];

    pageIndex = 0;
    pageSize = 25;
    totalCount = 0;

    constructor(
        private fb: FormBuilder,
        private universitiesService: UniversitiesService,
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
        this.universityForm = this.fb.group({
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

        this.universitiesService.getAllUniversities(queryParams).subscribe({
            next: (response) => {
                if (response && response.data) {
                    this.filteredUniversities = response.data.data || [];
                    this.totalCount = response.data.totalCount || 0;
                } else {
                    console.error('Error fetching universities data:', response?.message || 'Invalid response format');
                    this.filteredUniversities = [];
                    this.totalCount = 0;
                }
            },
            error: (error) => {
                console.error('Error fetching universities data:', error);
                this.filteredUniversities = [];
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
        if (this.universityForm.valid) {
            this.loadingService.show();
            if (this.isEditMode && this.selectedUniversityId) {
                this.updateUniversity();
            } else {
                this.createUniversity();
            }
        }
    }

    createUniversity(): void {
        this.universitiesService.createUniversity(this.universityForm.value).subscribe({
            next: (response) => {
                this.loadingService.hide();
                if (response) {
                    this.modalService.success('Üniversite başarıyla oluşturuldu');
                    this.resetForm();
                    this.getData();
                } else {
                    this.modalService.error('Bir hata oluştu');
                }
            },
            error: (error) => {
                this.loadingService.hide();
                this.modalService.error('Üniversite oluşturulurken bir hata oluştu');
            }
        });
    }

    updateUniversity(): void {
        if (!this.selectedUniversityId) return;

        this.universitiesService.updateUniversity(this.selectedUniversityId, this.universityForm.value).subscribe({
            next: (response) => {
                this.loadingService.hide();
                if (response) {
                    this.modalService.success('Üniversite başarıyla güncellendi');
                    this.resetForm();
                    this.getData();
                } else {
                    this.modalService.error('Bir hata oluştu');
                }
            },
            error: (error) => {
                this.loadingService.hide();
                this.modalService.error('Üniversite güncellenirken bir hata oluştu');
            }
        });
    }

    deleteUniversity(id: string | null): void {
        if (!id) return;
        const confirmed = confirm('Bu üniversiteyi silmek istediğinizden emin misiniz?');
        if (!confirmed) return;

        this.loadingService.show();
        this.universitiesService.deleteUniversity(id).subscribe({
            next: (response) => {
                this.loadingService.hide();
                if (response) {
                    this.modalService.success('Üniversite başarıyla silindi');
                    this.getData();
                } else {
                    this.modalService.error('Bir hata oluştu');
                }
            },
            error: (error) => {
                this.loadingService.hide();
                this.modalService.error('Üniversite silinirken bir hata oluştu');
            }
        });
}

    editUniversity(university: any): void {
        this.isEditMode = true;
        this.selectedUniversityId = university.id;
        this.universityForm.patchValue({
            name: university.name
        });
    }

    resetForm(): void {
        this.isEditMode = false;
        this.selectedUniversityId = null;
        this.universityForm.reset({ isActive: true });
    }
} 