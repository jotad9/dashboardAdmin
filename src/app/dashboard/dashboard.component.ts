import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { JwtInterceptor } from '../core/interceptors/Jwt.Interceptor';
import { FooterComponent } from "../shared/footer/footer.component";
import { SidebarComponent } from '../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, HttpClientModule, FooterComponent],
  providers: [{provide: HTTP_INTERCEPTORS,
    useClass: JwtInterceptor,
    multi: true}],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
