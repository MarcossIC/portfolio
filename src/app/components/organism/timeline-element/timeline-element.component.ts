import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Directions } from '@app/models/types';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'timeline-element',
  templateUrl: './timeline-element.component.html',
  styleUrls: ['./timeline-element.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeIn', [
      state('active', style({
        opacity: 1,
        transform: 'translateX(-25px) translateY(0) scale(1)'
      })),
      transition('* => active', [
        animate('0.8s cubic-bezier(0.25, 0.8, 0.25, 1)', keyframes([
          style({
            opacity: 0,
            transform: 'translateX(-250px) translateY(30px) scale(0.95)',
            offset: 0
          }),
          style({
            opacity: 0.7,
            transform: 'translateX(-250px) translateY(10px) scale(0.98)',
            offset: 0.6
          }),
          style({
            opacity: 1,
            transform: 'translateX(-25px) translateY(0) scale(1)',
            offset: 1
          })
        ]))
      ])
    ]),
    trigger('nodeAnimation', [
      state('active', style({
        transform: 'scale(1) rotate(0deg)',
        opacity: 1
      })),
      transition('* => active', [
        animate('0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)', keyframes([
          style({
            transform: 'scale(0) rotate(-180deg)',
            opacity: 0,
            offset: 0
          }),
          style({
            transform: 'scale(1.1) rotate(-90deg)',
            opacity: 0.8,
            offset: 0.7
          }),
          style({
            transform: 'scale(1) rotate(0deg)',
            opacity: 1,
            offset: 1
          })
        ]))
      ])
    ]),
    trigger('cardHover', [
      state('default', style({
        transform: 'translateY(0) scale(1)'
      })),
      state('hovered', style({
        transform: 'translateY(-8px) scale(1.02)'
      })),
      transition('default <=> hovered', [
        animate('0.4s cubic-bezier(0.23, 1, 0.32, 1)')
      ])
    ]),
    trigger('backgroundHover', [
      state('default', style({
        opacity: 0,
        transform: 'scale(0.95)'
      })),
      state('hovered', style({
        opacity: 1,
        transform: 'scale(1)'
      })),
      transition('default <=> hovered', [
        animate('0.6s cubic-bezier(0.23, 1, 0.32, 1)')
      ])
    ]),
    trigger('tagStagger', [
      transition('* => *', [
        animate('0.4s ease-out', keyframes([
          style({
            opacity: 0,
            transform: 'scale(0.8) translateY(10px)',
            offset: 0
          }),
          style({
            opacity: 1,
            transform: 'scale(1.05) translateY(-2px)',
            offset: 0.8
          }),
          style({
            opacity: 1,
            transform: 'scale(1) translateY(0)',
            offset: 1
          })
        ]))
      ])
    ])
  ]
})
export class TimelineElementComponent {
  protected readonly DIRECTION = {
    LEFT: Directions.LEFT,
    RIGHT: Directions.RIGHT,
  };

  public description = input.required<string>();
  public state = input.required<string>();
  public title = input.required<string>();
  public cardDirection = input.required<string>();
  public tags = input<string[]>([]);
  public time = input<string>("");

  // State for animations and interactions
  public isHovered = false;
  public animationState = 'active';

  onCardMouseEnter() {
    this.isHovered = true;
  }

  onCardMouseLeave() {
    this.isHovered = false;
  }

  getHoverState() {
    return this.isHovered ? 'hovered' : 'default';
  }
}
