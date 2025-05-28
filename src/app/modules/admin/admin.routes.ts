import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { UsersComponent } from './users/users.component';
import { UserEditComponent } from './users/components/user-edit/user-edit.component';
import { UniversitiesComponent } from './universities/universities.component';
import { DepartmentsComponent } from './departments/departments.component';
import { ProfessionsComponent } from './professions/professions.component';
import { SocialPlatformsComponent } from './social-platforms/social-platforms.component';
import { MapInfoComponent } from './map-info/map-info.component';

const routes: Routes = [
    { path: 'users', component: UsersComponent },
    { path: 'users/:id', component: UserEditComponent },
    { path: 'universities', component: UniversitiesComponent },
    { path: 'departments', component: DepartmentsComponent },
    { path: 'professions', component: ProfessionsComponent },
    { path: 'social-platforms', component: SocialPlatformsComponent },
    { path: 'map-info', component: MapInfoComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }