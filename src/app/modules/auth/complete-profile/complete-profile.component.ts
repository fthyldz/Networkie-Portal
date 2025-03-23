import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-complete-profile',
  standalone: false,
  templateUrl: './complete-profile.component.html'
})
export class CompleteProfileComponent implements OnInit {
  profileForm!: FormGroup;

  professionsList = [
    { id: '1', name: 'Akademisyen' },
    { id: '2', name: 'Yazılım Geliştirici' }
    // Örnek meslekler, gerçek veri API'den çekilmeli
  ];

  universitiesList = [
    { id: '1', name: 'KTÜ' },
    { id: '2', name: 'ODTÜ' }
  ];

  departmentsList = [
    { id: '1', name: 'Bilgisayar Mühendisliği' },
    { id: '2', name: 'Elektrik Elektronik' }
  ];

  socialPlatforms = [
    { id: 'linkedin', name: 'LinkedIn', isRequired: true },
    { id: 'twitter', name: 'Twitter', isRequired: false }
  ];

  countriesList = [
    { id: '1', name: 'Türkiye' },
    { id: '2', name: 'Almanya' }
  ];

  statesList = [
    { id: '1', name: 'İstanbul', countryId: '1' },
    { id: '2', name: 'Bayern', countryId: '2' }
  ];

  citiesList = [
    { id: '1', name: 'Trabzon', countryId: '1', stateId: '1' },
    { id: '2', name: 'Berlin', countryId: '2', stateId: '2' }
  ];

  districtsList = [
    { id: '1', name: 'Ortahisar', cityId: '1' },
    { id: '2', name: 'Mitte', cityId: '2' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      phoneCountryCode: ['+90'],
      phoneNumber: [''],
      gender: ['1'],
      birthOfDate: [''],
      isEmployed: [false],
      isHiring: [false],
      professionId: ['', Validators.required],
      customProfessionName: [''],
      countryId: [''],
      stateId: [''],
      cityId: [''],
      districtId: [''],
      universities: this.fb.array([this.createUniversityGroup()])
    });

    this.socialPlatforms.forEach(platform => {
      this.profileForm.addControl(
        `social_${platform.id}`,
        this.fb.control('', platform.isRequired ? Validators.required : [])
      );
    });
  }

  get universitiesFormArray(): FormArray {
    return this.profileForm.get('universities') as FormArray;
  }

  createUniversityGroup(): FormGroup {
    return this.fb.group({
      universityId: ['', Validators.required],
      customUniversityName: [''],
      departmentId: ['', Validators.required],
      customDepartmentName: [''],
      universityEntryYear: ['']
    });
  }

  addUniversity(): void {
    this.universitiesFormArray.push(this.createUniversityGroup());
  }

  removeUniversity(index: number): void {
    this.universitiesFormArray.removeAt(index);
  }

  onSubmit(): void {
    if (this.profileForm.invalid) return;

    const formValue = this.profileForm.value;

    const dataToSubmit = {
      ...formValue,
      profession: formValue.professionId === 'custom' ? formValue.customProfessionName : formValue.professionId,
      universities: formValue.universities.map((university: any) => ({
        university: university.universityId === 'custom' ? university.customUniversityName : university.universityId,
        department: university.departmentId === 'custom' ? university.customDepartmentName : university.departmentId
      }))
    };

    console.log('Profil Verisi:', dataToSubmit);

    // TODO: Eğer 'custom' alanlar girildiyse, önce yeni kayıtları DB'ye ekle sonra user'a ata
  }
}