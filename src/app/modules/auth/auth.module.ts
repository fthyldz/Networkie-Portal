import { NgModule } from "@angular/core";
import { LoginComponent } from "./login/login.component";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { AuthRoutingModule } from "./auth.routes";
import { RegisterComponent } from "./register/register.component";
import { VerifyEmailComponent } from "./verify-email/verify-email.component";
import { CompleteProfileComponent } from "./complete-profile/complete-profile.component";
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { SharedComponentModule } from "../../shared/components/shared-component.module";

@NgModule({
    declarations: [
        LoginComponent,
        RegisterComponent,
        VerifyEmailComponent,
        CompleteProfileComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        AuthRoutingModule,
        NgxIntlTelInputModule,
        SharedComponentModule
    ],
    exports: []
})
export class AuthModule { }