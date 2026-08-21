/**
 * @file group-navigation.component.ts
 * @author Sergio Romera Rupérez
 * @description Timeline component displaying the group stage matches.
 */

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-group-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './group-navigation.component.html',
  styleUrl: './group-navigation.component.scss'
})
export class GroupNavigationComponent implements OnChanges {
  @Input() groupId: string = 'A';

  prevLabel: string = '';
  prevRoute: string = '';
  prevAria: string = '';

  nextLabel: string = '';
  nextRoute: string = '';
  nextAria: string = '';

  private groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['groupId']) {
      this.calculateRoutes();
    }
  }

  private calculateRoutes(): void {
    const currentIndex = this.groups.indexOf(this.groupId.toUpperCase());
    
    // Safety check
    if (currentIndex === -1) return;

    // Previous Button Logic
    if (this.groupId.toUpperCase() === 'A') {
      this.prevLabel = '← INICIO';
      this.prevRoute = '/home';
      this.prevAria = 'Volver a la página de Inicio';
    } else {
      const prevGroup = this.groups[currentIndex - 1];
      this.prevLabel = `← GRUPO ${prevGroup}`;
      this.prevRoute = `/group/${prevGroup.toLowerCase()}`;
      this.prevAria = `Volver al Grupo ${prevGroup}`;
    }

    // Next Button Logic
    if (this.groupId.toUpperCase() === 'L') {
      this.nextLabel = 'DIECISEISAVOS →';
      this.nextRoute = '/knockouts/dieciseisavos';
      this.nextAria = 'Avanzar a la fase de Dieciseisavos';
    } else {
      const nextGroup = this.groups[currentIndex + 1];
      this.nextLabel = `GRUPO ${nextGroup} →`;
      this.nextRoute = `/group/${nextGroup.toLowerCase()}`;
      this.nextAria = `Avanzar al Grupo ${nextGroup}`;
    }
  }
}
