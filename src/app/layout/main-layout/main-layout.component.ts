import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
    selector: 'app-main-layout',
    template: `
        <div class="min-h-screen bg-neutral-50">
            <app-navbar></app-navbar>
            
            <main class="pt-16">
                <div class="max-w-7xl mx-auto px-6 py-8">
                    <div class="grid grid-cols-12 gap-8">
                        <div class="col-span-12">
                            <div class="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
                                <router-outlet></router-outlet>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    `,
    standalone: true,
    imports: [RouterOutlet, NavbarComponent]
})
export class MainLayoutComponent {}