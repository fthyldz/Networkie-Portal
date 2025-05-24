import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ModalContainerComponent } from './shared/modals/modal-container.component';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { LoadingService } from './shared/services/loading.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ModalContainerComponent, LoadingComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(public loadingService: LoadingService) {}
}
