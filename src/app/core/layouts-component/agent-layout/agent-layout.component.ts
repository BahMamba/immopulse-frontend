import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-agent-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './agent-layout.component.html',
  styleUrl: './agent-layout.component.css'
})
export class AgentLayoutComponent {
  userName = 'Agent User';
  sidebarOpen = false;
}
