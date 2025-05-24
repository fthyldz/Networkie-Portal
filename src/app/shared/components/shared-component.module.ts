import { NgModule } from "@angular/core";
import { MapComponent } from "./map/map.component";
import { CommonModule } from "@angular/common";
import { GoogleMapsModule } from "@angular/google-maps";
import { BaseChartDirective } from "ng2-charts";
import { GenderPieChartComponent } from "./charts/gender-pie-chart.component";
import { AgeBarChartComponent } from "./charts/age-bar-chart.component";
import { UniversityChartComponent } from "./charts/university-chart.component";
import { DepartmentChartComponent } from "./charts/department-chart.component";
import { ProfessionChartComponent } from "./charts/profession-chart.component";
import { CountryChartComponent } from "./charts/country-chart.component";
import { CityChartComponent } from "./charts/city-chart.component";
import { EmploymentChartComponent } from "./charts/employment-chart.component";
import { EmploymentStatusChartComponent } from "./charts/employment-status-chart.component";
import { SocialPlatformChartComponent } from "./charts/social-platform-chart.component";
import { LoadingService } from "../services/loading.service";

@NgModule({
    declarations: [
        MapComponent,
        GenderPieChartComponent,
        AgeBarChartComponent,
        UniversityChartComponent,
        DepartmentChartComponent,
        ProfessionChartComponent,
        CountryChartComponent,
        CityChartComponent,
        EmploymentChartComponent,
        EmploymentStatusChartComponent,
        SocialPlatformChartComponent
    ],
    imports: [
        CommonModule,
        GoogleMapsModule,
        BaseChartDirective
    ],
    exports: [
        MapComponent,
        GenderPieChartComponent,
        AgeBarChartComponent,
        UniversityChartComponent,
        DepartmentChartComponent,
        ProfessionChartComponent,
        CountryChartComponent,
        CityChartComponent,
        EmploymentChartComponent,
        EmploymentStatusChartComponent,
        SocialPlatformChartComponent
    ],
    providers: []
})
export class SharedComponentModule { }