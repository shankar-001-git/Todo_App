import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from "./component/dashboard/dashboard.component";

@Component({
  imports: [RouterModule, DashboardComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'TodoList';
}
