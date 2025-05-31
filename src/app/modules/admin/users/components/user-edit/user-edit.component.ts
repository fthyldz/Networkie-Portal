import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { ListDto, ListWithRequiredDto } from '../../../../../shared/models/common/list.model';
import { MapClickedEvent } from '../../../../../shared/models/common/map.model';
import { UsersService } from '../../../../../core/services/admin/users.service';
import { CommonService } from '../../../../../core/services/common/common.service';
import { ModalService } from '../../../../../shared/services/modal.service';
import { DateUtils } from '../../../../../shared/utils/date.utils';
import { LoadingService } from '../../../../../shared/services/loading.service';

@Component({
    selector: 'app-user-edit',
    standalone: false,
    templateUrl: './user-edit.component.html'
})
export class UserEditComponent implements OnInit {
    SearchCountryField = SearchCountryField;
    PhoneNumberFormat = PhoneNumberFormat;
    preferredCountries: CountryISO[] = [CountryISO.Turkey];

    editForm!: FormGroup;
    userId!: string;

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

    customCountryName = '';
    customStateName = '';
    customCityName = '';
    customDistrictName = '';

    selectFromMap = false;
    mapClickEvent: MapClickedEvent | null = null;

    constructor(
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private userService: UsersService,
        private commonService: CommonService,
        private modalService: ModalService,
        private router: Router,
        private loadingService: LoadingService
    ) {}

    ngOnInit(): void {
        this.userId = this.route.snapshot.paramMap.get('id')!;
        this.initForm();
        this.loadLookupData();
        setTimeout(() => this.getUser(), 500);
    }

    initForm(): void {
        this.editForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            firstName: ['', Validators.required],
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
    }

    get universitiesFormArray(): FormArray {
        return this.editForm.get('universities') as FormArray;
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

    loadLookupData(): void {
        this.commonService.getUniversities().subscribe(res => this.universitiesList = res.data || []);
        this.commonService.getDepartments().subscribe(res => this.departmentsList = res.data || []);
        this.commonService.getProfessions().subscribe(res => this.professionsList = res.data || []);
        this.commonService.getCountries().subscribe(res => {
            this.countriesList = this._countriesList = res.data || [];
        });
        this.commonService.getSocialPlatforms().subscribe(res => {
            this.socialPlatforms = res.data || [];
            this.socialPlatforms.forEach(p => {
                this.editForm.addControl(
                    `social_${p.id}`,
                    this.fb.control('', p.isRequired ? Validators.required : [])
                );
            });
        });
    }

    getUser(): void {
        this.userService.getUserById(this.userId).subscribe({
            next: res => {
                this.editForm.patchValue({
                    email: res.data.email,
                    firstName: res.data.firstName,
                    middleName: res.data.middleName,
                    lastName: res.data.lastName,
                    phoneCountryCode: res.data.phoneCountryCode,
                    phoneNumber: res.data.phoneNumber,
                    gender: res.data.gender,
                    birthOfDate: DateUtils.formatDate(new Date(res.data.birthOfDate)),
                    isEmployed: res.data.isEmployed,
                    isSeekingForJob: res.data.isSeekingForJob,
                    isHiring: res.data.isHiring,
                    professionId: res.data.professionId,
                    countryId: res.data.countryId,
                    stateId: res.data.stateId,
                    cityId: res.data.cityId,
                    districtId: res.data.districtId
                });

                res.data.universities.forEach((u: any) => {
                    this.universitiesFormArray.push(this.fb.group({
                        universityId: [u.universityId],
                        customUniversityName: [''],
                        departmentId: [u.departmentId],
                        customDepartmentName: [''],
                        universityEntryYear: [u.entryYear]
                    }));
                });

                res.data.socialPlatforms.forEach((s: any) => {
                    this.editForm.controls[`social_${s.socialPlatformId}`]?.setValue(s.url);
                });

                this.getStates();
                this.getCities();
                this.getDistricts();
            }
        });
    }

    getStates(): void {
        this.commonService.getStates(this.editForm.value.countryId).subscribe(res => {
            this.statesList = this._statesList = res.data || [];
        });
    }

    getCities(): void {
        this.commonService.getCities(this.editForm.value.countryId, this.editForm.value.stateId).subscribe(res => {
            this.citiesList = this._citiesList = res.data || [];
        });
    }

    getDistricts(): void {
        this.commonService.getDistricts(this.editForm.value.cityId).subscribe(res => {
            this.districtsList = this._districtsList = res.data || [];
        });
    }

    selectLocation(): void {
        this.selectFromMap = !this.selectFromMap;
        if (!this.selectFromMap) {
            this.editForm.patchValue({
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

    mapClick(event: MapClickedEvent): void {
        this.mapClickEvent = event;
        this.customCountryName = event.country || '';
        this.customStateName = event.state || '';
        this.customCityName = event.city || '';
        this.customDistrictName = event.district || '';

        // aynı şekilde ID eşleşmesiyle patchValue işlemleri yapılabilir
    }

    onSubmit(): void {
        if (this.editForm.invalid) return;
        this.loadingService.show();
        const formValue = this.editForm.value;

        const dto: any = {
            phoneCountryCode: formValue.phoneCountryCode,
            phoneNumber: formValue.phoneNumber.e164Number.replace(formValue.phoneNumber.dialCode, ''),
            gender: Number(formValue.gender),
            birthOfDate: formValue.birthOfDate,
            isEmployed: formValue.isEmployed,
            isSeekingForJob: formValue.isSeekingForJob,
            isHiring: formValue.isHiring,
            profession: formValue.professionId !== 'custom' ? null : formValue.customProfessionName,
            professionId: formValue.professionId !== 'custom' ? formValue.professionId : null,
            universities: formValue.universities.map((u: any) => ({
                university: u.universityId !== 'custom' ? null : u.customUniversityName,
                universityId: u.universityId !== 'custom' ? u.universityId : null,
                department: u.departmentId !== 'custom' ? null : u.customDepartmentName,
                departmentId: u.departmentId !== 'custom' ? u.departmentId : null,
                entryYear: u.universityEntryYear
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
                dto.socialPlatforms.push(socialPlatform);
            }
        });

        this.userService.updateUser(this.userId, dto).subscribe({
            next: () => {
                this.loadingService.hide();
                this.modalService.success('Kullanıcı bilgileri güncellendi.');
                this.router.navigate(['/admin/users']);
            },
            error: (err) => {
                this.loadingService.hide();
                this.modalService.error('Kullanıcı bilgileri güncellenirken bir hata oluştu');
            },
        });
    }
}