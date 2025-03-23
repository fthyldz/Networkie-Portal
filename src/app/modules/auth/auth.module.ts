import { NgModule } from "@angular/core";
import { LoginComponent } from "./login/login.component";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { AuthRoutingModule } from "./auth.routes";
import { RegisterComponent } from "./register/register.component";
import { VerifyEmailComponent } from "./verify-email/verify-email.component";
import { CompleteProfileComponent } from "./complete-profile/complete-profile.component";

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
        AuthRoutingModule
    ],
    exports: []
})
export class AuthModule { }