import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { CompleteProfileComponent } from './complete-profile/complete-profile.component';
import { authGuard, publicGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
    { path: 'login/:verificationCode', canActivate: [publicGuard], component: LoginComponent },
    { path: 'login', canActivate: [publicGuard], component: LoginComponent },
    { path: 'register', canActivate: [publicGuard], component: RegisterComponent },
    { path: 'verify-email/:uniqueCode', canActivate: [authGuard], component: VerifyEmailComponent },
    { path: 'complete-profile', canActivate: [authGuard], component: CompleteProfileComponent },
    { path: '**', redirectTo: 'login' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }