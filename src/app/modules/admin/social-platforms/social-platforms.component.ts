import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from '../../../shared/services/modal.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { SocialPlatformsService } from '../../../core/services/admin/social-platforms.service';
import { LoadingService } from '../../../shared/services/loading.service';

@Component({
    selector: 'app-social-platforms',
    standalone: false,
    templateUrl: './social-platforms.component.html'
})
export class SocialPlatformsComponent implements OnInit {
    socialPlatformForm!: FormGroup;
    isEditMode: boolean = false;
    selectedSocialPlatformId: string | null = null;

    Math = Math;
    filters!: FormGroup;
    filteredSocialPlatforms: any[] = [];

    pageIndex = 0;
    pageSize = 25;
    totalCount = 0;

    constructor(
        private fb: FormBuilder,
        private socialPlatformsService: SocialPlatformsService,
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
        this.socialPlatformForm = this.fb.group({
            name: ['', [Validators.required]],
            isRequired: [false, [Validators.required]]
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

        this.socialPlatformsService.getAllSocialPlatforms(queryParams).subscribe({
            next: (response) => {
                if (response && response.data) {
                    this.filteredSocialPlatforms = response.data.data || [];
                    this.totalCount = response.data.totalCount || 0;
                } else {
                    console.error('Error fetching social platforms data:', response?.message || 'Invalid response format');
                    this.filteredSocialPlatforms = [];
                    this.totalCount = 0;
                }
            },
            error: (error) => {
                console.error('Error fetching social platforms data:', error);
                this.filteredSocialPlatforms = [];
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
        if (this.socialPlatformForm.valid) {
            this.loadingService.show();
            if (this.isEditMode && this.selectedSocialPlatformId) {
                this.updateSocialPlatform();
            } else {
                this.createSocialPlatform();
            }
        }
    }

    createSocialPlatform(): void {
        this.socialPlatformsService.createSocialPlatform(this.socialPlatformForm.value).subscribe({
            next: (response) => {
                this.loadingService.hide();
                if (response) {
                    this.modalService.success('Sosya platform başarıyla oluşturuldu');
                    this.resetForm();
                    this.getData();
                } else {
                    this.modalService.error('Bir hata oluştu');
                }
            },
            error: (error) => {
                this.loadingService.hide();
                this.modalService.error('Sosya platform oluşturulurken bir hata oluştu');
            }
        });
    }

    updateSocialPlatform(): void {
        if (!this.selectedSocialPlatformId) return;

        this.socialPlatformsService.updateSocialPlatform(this.selectedSocialPlatformId, this.socialPlatformForm.value).subscribe({
            next: (response) => {
                this.loadingService.hide();
                if (response) {
                    this.modalService.success('Sosya platform başarıyla güncellendi');
                    this.resetForm();
                    this.getData();
                } else {
                    this.modalService.error('Bir hata oluştu');
                }
            },
            error: (error) => {
                this.loadingService.hide();
                this.modalService.error('Sosya platform güncellenirken bir hata oluştu');
            }
        });
    }

    deleteSocialPlatform(id: string | null): void {
        if (!id) return;
        const confirmed = confirm('Bu sosyal platformu silmek istediğinizden emin misiniz?');
        if (!confirmed) return;
        this.loadingService.show();
        this.socialPlatformsService.deleteSocialPlatform(id).subscribe({
            next: (response) => {
                this.loadingService.hide();
                if (response) {
                    this.modalService.success('Sosya platform başarıyla silindi');
                    this.getData();
                } else {
                    this.modalService.error('Bir hata oluştu');
                }
            },
            error: (error) => {
                this.loadingService.hide();
                this.modalService.error('Sosya platform silinirken bir hata oluştu');
            }
        });
}

    editSocialPlatform(socialPlatform: any): void {
        this.isEditMode = true;
        this.selectedSocialPlatformId = socialPlatform.id;
        this.socialPlatformForm.patchValue({
            name: socialPlatform.name,
            isRequired: socialPlatform.isRequired
        });
    }

    resetForm(): void {
        this.isEditMode = false;
        this.selectedSocialPlatformId = null;
        this.socialPlatformForm.reset();
    }
} 