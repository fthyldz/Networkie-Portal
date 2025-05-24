import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { MainRoutingModule } from "./main.routes";
import { DashboardService } from "../../core/services/dashboard/dashboard.service";
import { MapComponent } from "../../shared/components/map/map.component";
import { GenderPieChartComponent } from "../../shared/components/charts/gender-pie-chart.component";
import { SharedComponentModule } from "../../shared/components/shared-component.module";
import { ChartsService } from "../../core/services/dashboard/charts.service";
import { ProfileComponent } from "./profile/profile.component";
import { NgxIntlTelInputModule } from "ngx-intl-tel-input";

@NgModule({
    declarations: [
        DashboardComponent,
        ProfileComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        MainRoutingModule,
        NgxIntlTelInputModule,
        SharedComponentModule
    ],
    exports: [],
    providers: [
        DashboardService,
        ChartsService
    ]
})
export class MainModule { }