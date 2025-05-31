import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { DashboardService } from '../../../core/services/dashboard/dashboard.service';
import { MapClickedEvent } from '../../../shared/models/common/map.model';
import { ChartsService } from '../../../core/services/dashboard/charts.service';
import { MapComponent } from '../../../shared/components/map/map.component';

@Component({
    selector: 'app-dashboard',
    standalone: false,
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

    @ViewChild(MapComponent) map: MapComponent | undefined;

    Math = Math;
    filters!: FormGroup;
    filteredUsers: any[] = [];

    pageIndex = 0;
    pageSize = 25;
    totalCount = 0;

    mapClickEvent: MapClickedEvent | null = null;
    clearMarkerTrigger: boolean = false;

    customCountryName: string | null = null;
    customStateName: string | null = null;
    customCityName: string | null = null;
    customDistrictName: string | null = null;

    keywords: {keyword: string}[] = [];

    constructor(
        private fb: FormBuilder,
        private dashboardService: DashboardService,
        private chartsService: ChartsService
    ) { }

    ngOnInit(): void {
        this.filters = this.fb.group({
            firstName: [''],
            middleName: [''],
            lastName: [''],
            gender: [''],
            profession: [''],
            country: [''],
            state: [''],
            city: [''],
            district: [''],
            university: ['Karadeniz Teknik Üniversitesi'],
            department: [''],
            entryYear: ['']
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

        this.dashboardService.getListData(queryParams).subscribe({
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
            },
            complete: () => {
                this.getMapOverviewData(queryParams);
                //this.getChartsData();
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

    mapClick(event: MapClickedEvent) {
        this.mapClickEvent = event;
        console.log('Map clicked:', event);
        this.customCountryName = event.country || null;
        this.customStateName = event.state || null;
        this.customCityName = event.city || null;
        this.customDistrictName = event.district || null;
        this.filters.patchValue({
            country: this.customCountryName,
            state: this.customStateName,
            city: this.customCityName,
            // district: this.customDistrictName
        });
    }

    getChartsData() {
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

        if (this.isSelected('Cinsiyet'))
            this.getGenderPieChartData(queryParams);
        if (this.isSelected('Yaş'))
            this.getAgeBarChartData(queryParams);
        if (this.isSelected('Üniversite'))
            this.getUniversityChartData(queryParams);
        if (this.isSelected('Bölüm'))
            this.getDepartmentChartData(queryParams);
        if (this.isSelected('Meslek'))
            this.getProfessionChartData(queryParams);
        if (this.isSelected('Ülke'))
            this.getCountryChartData(queryParams);
        if (this.isSelected('İl'))
            this.getCityChartData(queryParams);
        if (this.isSelected('Çalışma'))
            this.getEmploymentChartData(queryParams);
        if (this.isSelected('Çalışma Durumu'))
            this.getEmploymentStatusChartData(queryParams);
        if (this.isSelected('Sosyal Platform'))
            this.getSocialPlatformChartData(queryParams);
    }

    femaleCount = 0;
    maleCount = 0;
    getGenderPieChartData(queryParams: string): void {
        this.chartsService.getGenderPieChartData(queryParams).subscribe({
            next: (response) => {
                if (response && response.data) {
                    const { maleCount, femaleCount } = response.data;
                    this.maleCount = maleCount || 0;
                    this.femaleCount = femaleCount || 0;
                } else {
                    console.error('Error fetching gender chart data:', response?.message || 'Invalid response format');
                    this.maleCount = 0;
                    this.femaleCount = 0;
                }
            },
            error: (error) => {
                console.error('Error fetching gender chart data:', error);
                this.maleCount = 0;
                this.femaleCount = 0;
            }
        });
    }

    ageBarChartData: {
        age: number;
        count: number;
    }[] = [];
    getAgeBarChartData(queryParams: string): void {
        this.chartsService.getAgeBarChartData(queryParams).subscribe({
            next: (response) => {
                if (response && response.data) {
                    this.ageBarChartData = response.data;
                } else {
                    console.error('Error fetching age chart data:', response?.message || 'Invalid response format');
                    this.ageBarChartData = [];
                }
            },
            error: (error) => {
                console.error('Error fetching age chart data:', error);
                this.ageBarChartData = [];
            }
        });
    }

    universityChartData: {
        universityName: number;
        count: number;
    }[] = [];
    getUniversityChartData(queryParams: string): void {
        this.chartsService.getUniversityChartData(queryParams).subscribe({
            next: (response) => {
                if (response && response.data) {
                    this.universityChartData = response.data;
                } else {
                    console.error('Error fetching university chart data:', response?.message || 'Invalid response format');
                    this.universityChartData = [];
                }
            },
            error: (error) => {
                console.error('Error fetching university chart data:', error);
                this.universityChartData = [];
            }
        });
    }

    departmentChartData: {
        departmentName: number;
        count: number;
    }[] = [];
    getDepartmentChartData(queryParams: string): void {
        this.chartsService.getDepartmentChartData(queryParams).subscribe({
            next: (response) => {
                if (response && response.data) {
                    this.departmentChartData = response.data;
                } else {
                    console.error('Error fetching department chart data:', response?.message || 'Invalid response format');
                    this.departmentChartData = [];
                }
            },
            error: (error) => {
                console.error('Error fetching department chart data:', error);
                this.departmentChartData = [];
            }
        });
    }

    professionChartData: {
        professionName: number;
        count: number;
    }[] = [];
    getProfessionChartData(queryParams: string): void {
        this.chartsService.getProfessionChartData(queryParams).subscribe({
            next: (response) => {
                if (response && response.data) {
                    this.professionChartData = response.data;
                } else {
                    console.error('Error fetching profession chart data:', response?.message || 'Invalid response format');
                    this.professionChartData = [];
                }
            },
            error: (error) => {
                console.error('Error fetching profession chart data:', error);
                this.professionChartData = [];
            }
        });
    }

    countryChartData: {
        countryName: number;
        count: number;
    }[] = [];
    getCountryChartData(queryParams: string): void {
        this.chartsService.getCountryChartData(queryParams).subscribe({
            next: (response) => {
                if (response && response.data) {
                    this.countryChartData = response.data;
                } else {
                    console.error('Error fetching country chart data:', response?.message || 'Invalid response format');
                    this.countryChartData = [];
                }
            },
            error: (error) => {
                console.error('Error fetching country chart data:', error);
                this.countryChartData = [];
            }
        });
    }

    cityChartData: {
        cityName: number;
        count: number;
    }[] = [];
    getCityChartData(queryParams: string): void {
        this.chartsService.getCityChartData(queryParams).subscribe({
            next: (response) => {
                if (response && response.data) {
                    this.cityChartData = response.data;
                } else {
                    console.error('Error fetching city chart data:', response?.message || 'Invalid response format');
                    this.cityChartData = [];
                }
            },
            error: (error) => {
                console.error('Error fetching city chart data:', error);
                this.cityChartData = [];
            }
        });
    }

    employmentChartData = {
        isEmployed: 0,
        isNotEmployed: 0
    };
    getEmploymentChartData(queryParams: string): void {
        this.chartsService.getEmploymentChartData(queryParams).subscribe({
            next: (response) => {
                if (response && response.data) {
                    const { isEmployed, isNotEmployed } = response.data;
                    this.employmentChartData = {
                        isEmployed: isEmployed || 0,
                        isNotEmployed: isNotEmployed || 0
                    };
                } else {
                    console.error('Error fetching employment chart data:', response?.message || 'Invalid response format');
                    this.employmentChartData = {
                        isEmployed: 0,
                        isNotEmployed: 0
                    };
                }
            },
            error: (error) => {
                console.error('Error fetching employment chart data:', error);
                this.employmentChartData = {
                    isEmployed: 0,
                    isNotEmployed: 0
                };
            }
        });
    }

    employmentStatusChartData = {
        isSeekingForJob: 0,
        isHiring: 0
    };
    getEmploymentStatusChartData(queryParams: string): void {
        this.chartsService.getEmploymentStatusChartData(queryParams).subscribe({
            next: (response) => {
                if (response && response.data) {
                    const { isSeekingForJob, isHiring } = response.data;
                    this.employmentStatusChartData = {
                        isSeekingForJob: isSeekingForJob || 0,
                        isHiring: isHiring || 0
                    };
                } else {
                    console.error('Error fetching employment status chart data:', response?.message || 'Invalid response format');
                    this.employmentStatusChartData = {
                        isSeekingForJob: 0,
                        isHiring: 0
                    };
                }
            },
            error: (error) => {
                console.error('Error fetching employment status chart data:', error);
                this.employmentStatusChartData = {
                    isSeekingForJob: 0,
                    isHiring: 0
                };
            }
        });
    }

    socialPlatformChartData: {
        socialPlatformName: number;
        count: number;
    }[] = [];
    getSocialPlatformChartData(queryParams: string): void {
        this.chartsService.getSocialPlatformChartData(queryParams).subscribe({
            next: (response) => {
                if (response && response.data) {
                    this.socialPlatformChartData = response.data;
                } else {
                    console.error('Error fetching social platform chart data:', response?.message || 'Invalid response format');
                    this.socialPlatformChartData = [];
                }
            },
            error: (error) => {
                console.error('Error fetching social platform chart data:', error);
                this.socialPlatformChartData = [];
            }
        });
    }

    columnOptions = [
        { label: 'Meslek', value: 'Meslek', selected: true },
        { label: 'Bölüm', value: 'Bölüm', selected: true },
        { label: 'Üniversite', value: 'Üniversite', selected: true },
        { label: 'Yaş', value: 'Yaş', selected: false },
        { label: 'Cinsiyet', value: 'Cinsiyet', selected: false },
        { label: 'İl', value: 'İl', selected: false },
        { label: 'Çalışma', value: 'Çalışma', selected: false },
        { label: 'Çalışma Durumu', value: 'Çalışma Durumu', selected: false },
        { label: 'Sosyal Platform', value: 'Sosyal Platform', selected: false },
        { label: 'Ülke', value: 'Ülke', selected: false }
    ];
    
    showCharts = false;
    
    generateCharts() {
        this.getChartsData();
        this.showCharts = true;
    }
    
    isSelected(label: string): boolean {
        return this.columnOptions.find(c => c.label === label)?.selected || false;
    }

    clearSelection() {
        this.clearMarkerTrigger = true;
        this.customCountryName = null;
        this.customStateName = null;
        this.customCityName = null;
        this.customDistrictName = null;
        this.filters.patchValue({
            country: this.customCountryName,
            state: this.customStateName,
            city: this.customCityName,
            // district: this.customDistrictName
        });
        setTimeout(() => {
            this.clearMarkerTrigger = false;
        }, 500);
    }

    getMapOverviewData(queryParams: string) {
        this.dashboardService.getMapOverviewData(queryParams).subscribe({
            next: (response) => {
                if (response && response.data) {
                    this.keywords = response.data;
                    setTimeout(() => {
                        this.map?.searchAndPlaceMarker();
                    }, 100);
                } else {
                    console.error('Error fetching map overview data:', response?.message || 'Invalid response format');
                    this.keywords = [];
                }
            },
            error: (error) => {
                console.error('Error fetching map overview data:', error);
                this.keywords = [];
            }
        });
    }
}