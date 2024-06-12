import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'AngularIcon',
  template: `
    <svg
      fill="#fff"
      width="20px"
      height="20px"
      viewBox="0 0 32 32"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>angular</title>
      <path
        d="M24.826 23.885h-3.297l-1.777-4.377h-7.507l-1.777 4.379h-3.299l8.83-19.571zM15.999 1.004l-14.145 4.976 2.157 18.458 11.989 6.557 11.992-6.551 2.154-18.462-14.147-4.977zM13.414 16.806h5.171l-2.587-6.133z"
      ></path>
    </svg>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AngularIconComponent {}
