import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { AdminRoutingModule } from "./admin.routes";
import { SharedComponentModule } from "../../shared/components/shared-component.module";
import { NgxIntlTelInputModule } from "ngx-intl-tel-input";
import { UsersComponent } from "./users/users.component";
import { UsersService } from "../../core/services/admin/users.service";
import { UserListComponent } from "./users/components/user-list/user-list.component";
import { UserEditComponent } from "./users/components/user-edit/user-edit.component";
import { UniversitiesComponent } from "./universities/universities.component";
import { UniversitiesService } from "../../core/services/admin/universities.service";
import { DepartmentsComponent } from "./departments/departments.component";
import { DepartmentsService } from "../../core/services/admin/departments.service";
import { ProfessionsService } from "../../core/services/admin/professions.service";
import { ProfessionsComponent } from "./professions/professions.component";
import { SocialPlatformsService } from "../../core/services/admin/social-platforms.service";
import { SocialPlatformsComponent } from "./social-platforms/social-platforms.component";
import { MapInfoComponent } from "./map-info/map-info.component";
import { MapInfoService } from "../../core/services/admin/map-info.service";

@NgModule({
    declarations: [
        UserListComponent,
        UserEditComponent,
        UsersComponent,
        UniversitiesComponent,
        DepartmentsComponent,
        ProfessionsComponent,
        SocialPlatformsComponent,
        MapInfoComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        AdminRoutingModule,
        NgxIntlTelInputModule,
        SharedComponentModule
    ],
    providers: [
        UsersService,
        UniversitiesService,
        DepartmentsService,
        ProfessionsService,
        SocialPlatformsService,
        MapInfoService
    ]
})
export class AdminModule { }