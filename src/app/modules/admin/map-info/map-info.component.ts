import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MapInfoService } from "../../../core/services/admin/map-info.service";
import { ModalService } from "../../../shared/services/modal.service";
import { debounceTime, distinctUntilChanged } from "rxjs";

@Component({
    selector: 'app-map-info',
    standalone: false,
    templateUrl: './map-info.component.html'
})
export class MapInfoComponent implements OnInit {
    Math = Math;
    activeTab: 'countries' | 'cities' = 'countries';

    filteredCountries: any[] = [];
    filteredCities: any[] = [];

    countryForm!: FormGroup;
    cityForm!: FormGroup;
    filtersCountry!: FormGroup;
    filtersCity!: FormGroup;

    selectedCountry: string | null = null;
    selectedCity: string | null = null;

    pageIndex = 0;
    pageSize = 25;
    totalCount = 0;

    constructor(
        private fb: FormBuilder,
        private mapInfoService: MapInfoService,
        private modalService: ModalService) { }

    ngOnInit(): void {
        this.filtersCountry = this.fb.group({
            search: ['']
        });
        this.filtersCity = this.fb.group({
            searchCity: [''],
            searchCountry: ['']
        });

        this.filtersCountry.valueChanges
            .pipe(debounceTime(400), distinctUntilChanged())
            .subscribe(() => {
                this.pageIndex = 0;
                this.activeTab === 'countries' ? this.getCountriesData() : this.getCitiesData();
            });

            this.filtersCity.valueChanges
            .pipe(debounceTime(400), distinctUntilChanged())
            .subscribe(() => {
                this.pageIndex = 0;
                this.activeTab === 'countries' ? this.getCountriesData() : this.getCitiesData();
            });

        this.initForm();
        this.activeTab === 'countries' ? this.getCountriesData() : this.getCitiesData();
    }

    initForm(): void {
        this.countryForm = this.fb.group({
            name: ['', Validators.required]
        });

        this.cityForm = this.fb.group({
            name: ['', Validators.required],
            country: ['', Validators.required]
        });
    }

    onCountryMapClick(event: any) {
        this.selectedCountry = event.country;
        this.countryForm.patchValue({ name: this.selectedCountry });
    }

    onCityMapClick(event: any) {
        this.selectedCountry = event.country;
        this.selectedCity = event.state || event.city;
        this.cityForm.patchValue({ name: this.selectedCity, country: this.selectedCountry });
    }

    saveCountry() {
        if (this.countryForm.invalid || !this.selectedCountry) return;

        this.mapInfoService.createCountry({ name: this.selectedCountry }).subscribe({
            next: (response) => {
                if (response) {
                    this.modalService.success('Ülke başarıyla oluşturuldu');
                    this.selectedCountry = null;
                    this.countryForm.reset();
                    this.getCountriesData();
                } else {
                    this.modalService.error('Bir hata oluştu');
                }
            },
            error: (error) => {
                this.modalService.error('Ülke oluşturulurken bir hata oluştu');
            }
        });   
    }

    saveCity() {
        if (this.cityForm.invalid || !this.selectedCity || !this.selectedCountry) return;

        this.mapInfoService.createCity({ name: this.selectedCity, country: this.selectedCountry }).subscribe({
            next: (response) => {
                if (response) {
                    this.modalService.success('Eyalet/Şehir başarıyla oluşturuldu');
                    this.selectedCountry = null;
                    this.selectedCity = null;
                    this.cityForm.reset();
                    this.getCitiesData();
                } else {
                    this.modalService.error('Bir hata oluştu');
                }
            },
            error: (error) => {
                this.modalService.error('Eyalet/Şehir oluşturulurken bir hata oluştu');
            }
        });        
    }

    getCountriesData() {
        const filterValues = this.filtersCountry.value;
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

        this.mapInfoService.getAllCountries(queryParams).subscribe({
            next: (response) => {
                if (response && response.data) {
                    this.filteredCountries = response.data.data || [];
                    this.totalCount = response.data.totalCount || 0;
                } else {
                    console.error('Error fetching countries data:', response?.message || 'Invalid response format');
                    this.filteredCountries = [];
                    this.totalCount = 0;
                }
            },
            error: (error) => {
                console.error('Error fetching countries data:', error);
                this.filteredCountries = [];
                this.totalCount = 0;
            }
        });
    }

    getCitiesData() {
        const filterValues = this.filtersCity.value;
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

        this.mapInfoService.getAllCities(queryParams).subscribe({
            next: (response) => {
                if (response && response.data) {
                    this.filteredCities = response.data.data || [];
                    this.totalCount = response.data.totalCount || 0;
                } else {
                    console.error('Error fetching cities data:', response?.message || 'Invalid response format');
                    this.filteredCities = [];
                    this.totalCount = 0;
                }
            },
            error: (error) => {
                console.error('Error fetching cities data:', error);
                this.filteredCities = [];
                this.totalCount = 0;
            }
        });
    }

    changePage(newPageIndex: number): void {
        this.pageIndex = newPageIndex;
        this.activeTab === 'countries' ? this.getCountriesData() : this.getCitiesData();
    }

    changePageSize(newSize: number): void {
        this.pageSize = typeof newSize === 'string' ? parseInt(newSize, 10) : newSize;
        this.pageSize = Math.max(25, Math.min(this.pageSize, 100));
        this.pageIndex = 0;
        this.activeTab === 'countries' ? this.getCountriesData() : this.getCitiesData();
    }

    changeTab(tab: 'countries' | 'cities') {
        this.activeTab = tab;
        this.selectedCity = null;
        this.selectedCountry = null;
        this.pageIndex = 0;
        this.totalCount = 0;
        this.activeTab === 'countries' ? this.getCountriesData() : this.getCitiesData();
    }
}