import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from '../../../shared/services/modal.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ProfessionsService } from '../../../core/services/admin/professions.service';
import { LoadingService } from '../../../shared/services/loading.service';

@Component({
    selector: 'app-professions',
    standalone: false,
    templateUrl: './professions.component.html'
})
export class ProfessionsComponent implements OnInit {
    professionForm!: FormGroup;
    isEditMode: boolean = false;
    selectedProfessionId: string | null = null;

    Math = Math;
    filters!: FormGroup;
    filteredProfessions: any[] = [];

    pageIndex = 0;
    pageSize = 25;
    totalCount = 0;

    constructor(
        private fb: FormBuilder,
        private professionsService: ProfessionsService,
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
        this.professionForm = this.fb.group({
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

        this.professionsService.getAllProfessions(queryParams).subscribe({
            next: (response) => {
                if (response && response.data) {
                    this.filteredProfessions = response.data.data || [];
                    this.totalCount = response.data.totalCount || 0;
                } else {
                    console.error('Error fetching professions data:', response?.message || 'Invalid response format');
                    this.filteredProfessions = [];
                    this.totalCount = 0;
                }
            },
            error: (error) => {
                console.error('Error fetching professions data:', error);
                this.filteredProfessions = [];
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
        if (this.professionForm.valid) {
            this.loadingService.show();
            if (this.isEditMode && this.selectedProfessionId) {
                this.updateProfession();
            } else {
                this.createProfession();
            }
        }
    }

    createProfession(): void {
        this.professionsService.createProfession(this.professionForm.value).subscribe({
            next: (response) => {
                this.loadingService.hide();
                if (response) {
                    this.modalService.success('Meslek başarıyla oluşturuldu');
                    this.resetForm();
                    this.getData();
                } else {
                    this.modalService.error('Bir hata oluştu');
                }
            },
            error: (error) => {
                this.loadingService.hide();
                this.modalService.error('Meslek oluşturulurken bir hata oluştu');
            }
        });
    }

    updateProfession(): void {
        if (!this.selectedProfessionId) return;

        this.professionsService.updateProfession(this.selectedProfessionId, this.professionForm.value).subscribe({
            next: (response) => {
                this.loadingService.hide();
                if (response) {
                    this.modalService.success('Meslek başarıyla güncellendi');
                    this.resetForm();
                    this.getData();
                } else {
                    this.modalService.error('Bir hata oluştu');
                }
            },
            error: (error) => {
                this.loadingService.hide();
                this.modalService.error('Meslek güncellenirken bir hata oluştu');
            }
        });
    }

    deleteProfession(id: string | null): void {
        if (!id) return;
        const confirmed = confirm('Bu mesleği silmek istediğinizden emin misiniz?');
        if (!confirmed) return;
        this.loadingService.show();
        this.professionsService.deleteProfession(id).subscribe({
            next: (response) => {
                this.loadingService.hide();
                if (response) {
                    this.modalService.success('Meslek başarıyla silindi');
                    this.getData();
                } else {
                    this.modalService.error('Bir hata oluştu');
                }
            },
            error: (error) => {
                this.loadingService.hide();
                this.modalService.error('Meslek silinirken bir hata oluştu');
            }
        });
}

    editProfession(profession: any): void {
        this.isEditMode = true;
        this.selectedProfessionId = profession.id;
        this.professionForm.patchValue({
            name: profession.name
        });
    }

    resetForm(): void {
        this.isEditMode = false;
        this.selectedProfessionId = null;
        this.professionForm.reset();
    }
} 