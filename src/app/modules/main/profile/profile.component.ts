import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../../core/services/profile/profile.service';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListDto, ListWithRequiredDto } from '../../../shared/models/common/list.model';
import { MapClickedEvent } from '../../../shared/models/common/map.model';
import { AuthService } from '../../../core/services/auth/auth.service';
import { CommonService } from '../../../core/services/common/common.service';
import { Router } from '@angular/router';
import { ModalService } from '../../../shared/services/modal.service';
import { DateUtils } from '../../../shared/utils/date.utils';
import { first } from 'rxjs';
import { LoadingService } from '../../../shared/services/loading.service';

@Component({
    selector: 'app-profile',
    standalone: false,
    templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
    SearchCountryField = SearchCountryField;
    PhoneNumberFormat = PhoneNumberFormat;
    preferredCountries: CountryISO[] = [CountryISO.Turkey];

    profileForm!: FormGroup;

    professionsList: ListDto[] = [];

    universitiesList: ListDto[] = [];

    departmentsList: ListDto[] = [];

    _countriesList: ListDto[] = [];
    countriesList: ListDto[] = [];

    _statesList: ListDto[] = [];
    statesList: ListDto[] = [];

    _citiesList: ListDto[] = [];
    citiesList: ListDto[] = [];

    _districtsList: ListDto[] = [];
    districtsList: ListDto[] = [];

    socialPlatforms: ListWithRequiredDto[] = [];

    customCountryName: string = '';
    customStateName: string = '';
    customCityName: string = '';
    customDistrictName: string = '';

    now: Date = new Date(Date.now());

    mapClickEvent: MapClickedEvent | null = null;

    selectFromMap: boolean = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private commonService: CommonService,
        private router: Router,
        private modalService: ModalService,
        private profileService: ProfileService,
        private loadingService: LoadingService
    ) { }

    ngOnInit(): void {
        this.getUniversities();
        this.getDepartments();
        this.getProfessions();

        this.getCountries();
        this.getSocialPlatforms();

        this.profileForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            firstName: ['', [Validators.required]],
            middleName: [''],
            lastName: [''],
            phoneCountryCode: ['+90'],
            phoneNumber: [''],
            gender: [null],
            birthOfDate: [DateUtils.formatDate(new Date())],
            isEmployed: [false],
            isSeekingForJob: [false],
            isHiring: [false],
            professionId: [''],
            customProfessionName: [''],
            countryId: [''],
            stateId: [''],
            cityId: [''],
            districtId: [''],
            universities: this.fb.array([])
        });

        setTimeout(() => {
            this.getUser();
        }, 500);
    }

    get universitiesFormArray(): FormArray {
        return this.profileForm.get('universities') as FormArray;
    }

    createUniversityGroup(): FormGroup {
        return this.fb.group({
            universityId: [''],
            customUniversityName: [''],
            departmentId: [''],
            customDepartmentName: [''],
            universityEntryYear: [null]
        });
    }

    addUniversity(): void {
        this.universitiesFormArray.push(this.createUniversityGroup());
    }

    removeUniversity(index: number): void {
        this.universitiesFormArray.removeAt(index);
    }

    getUniversities(): void {
        this.commonService.getUniversities().subscribe({
            next: (response) => {
                if (response.data) {
                    this.universitiesList = response.data;
                } else {
                    console.error('Üniversiteleri alma hatası:', response.message);
                }
            },
            error: (error) => {
                console.error('Üniversiteleri alma hatası:', error);
            }
        });
    }

    getDepartments(): void {
        this.commonService.getDepartments().subscribe({
            next: (response) => {
                if (response.data) {
                    this.departmentsList = response.data;
                } else {
                    console.error('Departmanları alma hatası:', response.message);
                }
            },
            error: (error) => {
                console.error('Departmanları alma hatası:', error);
            }
        });
    }

    getProfessions(): void {
        this.commonService.getProfessions().subscribe({
            next: (response) => {
                if (response.data) {
                    this.professionsList = response.data;
                } else {
                    console.error('Meslekleri alma hatası:', response.message);
                }
            },
            error: (error) => {
                console.error('Meslekleri alma hatası:', error);
            }
        });
    }

    getCountries(): void {
        this.commonService.getCountries().subscribe({
            next: (response) => {
                if (response.data) {
                    this.countriesList = response.data;
                    this._countriesList = response.data;
                } else {
                    console.error('Ülkeleri alma hatası:', response.message);
                }
            },
            error: (error) => {
                console.error('Ülkeleri alma hatası:', error);
            }
        });
    }

    getStates(): void {
        this.commonService.getStates(this.profileForm.value.countryId).subscribe({
            next: (response) => {
                if (response.data) {
                    this.statesList = response.data;
                    this._statesList = response.data;
                } else {
                    console.error('Eyaletleri alma hatası:', response.message);
                }
            },
            error: (error) => {
                console.error('Eyaletleri alma hatası:', error);
            }
        });
    }

    getCities(): void {
        this.commonService.getCities(this.profileForm.value.countryId, this.profileForm.value.stateId).subscribe({
            next: (response) => {
                if (response.data) {
                    this.citiesList = response.data;
                    this._citiesList = response.data;
                } else {
                    console.error('Şehirleri alma hatası:', response.message);
                }
            },
            error: (error) => {
                console.error('Şehirleri alma hatası:', error);
            }
        });
    }

    getDistricts(): void {
        this.commonService.getDistricts(this.profileForm.value.cityId).subscribe({
            next: (response) => {
                if (response.data) {
                    this.districtsList = response.data;
                    this._districtsList = response.data;
                } else {
                    console.error('İlçeleri alma hatası:', response.message);
                }
            },
            error: (error) => {
                console.error('İlçeleri alma hatası:', error);
            }
        });
    }

    getSocialPlatforms(): void {
        this.commonService.getSocialPlatforms().subscribe({
            next: (response) => {
                if (response.data) {
                    this.socialPlatforms = response.data;
                    this.socialPlatforms.forEach(platform => {
                        this.profileForm.addControl(
                            `social_${platform.id}`,
                            this.fb.control('', platform.isRequired ? Validators.required : [])
                        );
                    });
                } else {
                    console.error('Sosyal Platformları alma hatası:', response.message);
                }
            },
            error: (error) => {
                console.error('Sosyal Platformları alma hatası:', error);
            }
        });
    }

    onSubmit(): void {
        if (this.profileForm.invalid) return;
        this.loadingService.show();
        const formValue = this.profileForm.value;

        const dataToSubmit: any = {
            phoneCountryCode: formValue.phoneCountryCode,
            phoneNumber: formValue.phoneNumber.e164Number.replace(formValue.phoneNumber.dialCode, ''),
            gender: Number(formValue.gender),
            birthOfDate: formValue.birthOfDate,
            isEmployed: formValue.isEmployed,
            isSeekingForJob: formValue.isSeekingForJob,
            isHiring: formValue.isHiring,
            profession: formValue.professionId !== 'custom' ? null : formValue.customProfessionName,
            professionId: formValue.professionId !== 'custom' ? formValue.professionId : null,
            universities: formValue.universities.map((university: any) => ({
                university: university.universityId !== 'custom' ? null : university.customUniversityName,
                universityId: university.universityId !== 'custom' ? university.universityId : null,
                department: university.departmentId !== 'custom' ? null : university.customDepartmentName,
                departmentId: university.departmentId !== 'custom' ? university.departmentId : null,
                entryYear: university.universityEntryYear
            })),
            country: (!formValue.countryId || formValue.countryId === '0') && this.customCountryName ? this.customCountryName : null,
            countryId: formValue.countryId && formValue.countryId !== '0' ? formValue.countryId : null,
            state: (!formValue.stateId || formValue.stateId === '0') && this.customStateName ? this.customStateName : null,
            stateId: formValue.stateId && formValue.stateId !== '0' ? formValue.stateId : null,
            city: (!formValue.cityId || formValue.cityId === '0') && this.customCityName ? this.customCityName : null,
            cityId: formValue.cityId && formValue.cityId !== '0' ? formValue.cityId : null,
            district: (!formValue.districtId || formValue.districtId === '0') && this.customDistrictName ? this.customDistrictName : null,
            districtId: formValue.districtId && formValue.districtId !== '0' ? formValue.districtId : null,
            socialPlatforms: []
        };

        this.socialPlatforms.map(platform => {
            const socialPlatform = formValue['social_' + platform.id] ? { socialPlatformId: platform.id, url: (formValue['social_' + platform.id] as string) } : null;
            if (socialPlatform && socialPlatform.url) {
                dataToSubmit.socialPlatforms.push(socialPlatform);
            }
        })


        console.log('Profil Verisi:', dataToSubmit);

        this.profileService.updateProfile(dataToSubmit).subscribe({
            next: (response) => {
                this.loadingService.hide();
                if (response.data) {
                    console.log('Profil başarıyla güncellendi:', response.data);
                    this.modalService.success('Profil Güncellendi.');
                }
                if (response.message) {
                    console.error('Profil güncelleme hatası:', response.message);
                }
            },
            error: (error) => {
                this.loadingService.hide();
                console.error('Profil güncelleme hatası:', error);
            }
        });
    }

    mapClick(event: MapClickedEvent) {
        this.mapClickEvent = event;
        console.log('Map clicked:', event);

        if (this._countriesList.find(c => c.name === event.country)?.id) {
            this.profileForm.patchValue({ countryId: this._countriesList.find(c => c.name === event.country)?.id })
        } else {
            this.countriesList = [...this._countriesList, { id: '0', name: event.country || '' }];
            this.profileForm.patchValue({ countryId: '0' });
        }
        this.customCountryName = event.country || '';
        if (this._statesList.find(c => c.name === event.state)?.id) {
            this.profileForm.patchValue({ stateId: this._statesList.find(c => c.name === event.state)?.id })
        } else {
            this.statesList = [...this._statesList, { id: '0', name: event.state || '' }];
            this.profileForm.patchValue({ stateId: '0' });
        }
        this.customStateName = event.state || '';
        if (this._citiesList.find(c => c.name === event.city)?.id) {
            this.profileForm.patchValue({ cityId: this._citiesList.find(c => c.name === event.city)?.id })
        } else {
            this.citiesList = [...this._citiesList, { id: '0', name: event.city || '' }];
            this.profileForm.patchValue({ cityId: '0' });
        }
        this.customCityName = event.city || '';
        if (this._districtsList.find(c => c.name === event.district)?.id) {
            this.profileForm.patchValue({ districtId: this._districtsList.find(c => c.name === event.district)?.id })
        } else {
            this.districtsList = [...this._districtsList, { id: '0', name: event.district || '' }];
            this.profileForm.patchValue({ districtId: '0' });
        }
        this.customDistrictName = event.district || '';
    }

    selectLocation() {
        this.selectFromMap = !this.selectFromMap;
        if (!this.selectFromMap) {
            this.profileForm.patchValue({
                countryId: '',
                stateId: '',
                cityId: '',
                districtId: ''
            });
            this.countriesList = this._countriesList;
            this.statesList = this._statesList;
            this.citiesList = this._citiesList;
            this.districtsList = this._districtsList;
        }
    }

    getUser() {
        this.profileService.getUser().subscribe({
            next: (response) => {
                if (response.data) {
                    console.log('User data:', response.data);
                    const user = response.data;
                    this.profileForm.patchValue({
                        email: user.email,
                        firstName: user.firstName,
                        middleName: user.middleName,
                        lastName: user.lastName,
                        phoneCountryCode: user.phoneCountryCode,
                        phoneNumber: user.phoneNumber,
                        gender: user.gender,
                        birthOfDate: DateUtils.formatDate(new Date(user.birthOfDate)),
                        isEmployed: user.isEmployed,
                        isSeekingForJob: user.isSeekingForJob,
                        isHiring: user.isHiring,
                        professionId: user.professionId,
                        countryId: user.countryId,
                        stateId: user.stateId,
                        cityId: user.cityId,
                        districtId: user.districtId
                    });
                    user.universities.forEach((university: any) => {
                        this.universitiesFormArray.push(this.fb.group({
                            universityId: [university.universityId],
                            customUniversityName: [''],
                            departmentId: [university.departmentId],
                            customDepartmentName: [''],
                            universityEntryYear: [university.entryYear]
                        }));
                    });
                    user.socialPlatforms.forEach((socialPlatform: any) => {
                        this.profileForm.controls[`social_${socialPlatform.socialPlatformId}`]?.setValue(socialPlatform.url);
                    });
                    this.getStates();
                    this.getCities();
                    this.getDistricts();
                } else {
                    console.error('Error fetching user data:', response.message);
                }
            }
            , error: (error) => {
                console.error('Error fetching user data:', error);
            }
            , complete: () => {
                console.log('User data fetch complete');
            }
        });
    }
}