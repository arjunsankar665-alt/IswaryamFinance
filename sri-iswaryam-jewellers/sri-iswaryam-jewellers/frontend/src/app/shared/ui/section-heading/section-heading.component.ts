import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-section-heading',
  templateUrl: './section-heading.component.html',
  styleUrls: ['./section-heading.component.css']
})
export class SectionHeadingComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() align: 'left' | 'center' | 'right' = 'center';
  @Input() viewAllLink = '';
  @Input() viewAllText = 'View All';
}
