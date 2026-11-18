import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'LogoIcon',
  template: `
    <span class="logo">
      <img
        src="../../../assets/utils/logoWhite.png"
        alt="Marcos Lopez logo"
        width="90"
        height="90"
        decoding="async"
        loading="lazy"
      />
    </span>
  `,
  styles: `
  .logo {
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    flex: 1 1;

    img {
      transform: rotate3d(0, 1, 0, 18deg);
      transform-style: preserve-3d;
      padding-block-end: 2px;
    }
  }
  @media only screen and (min-width: 700px) {
    .logo {
      position: sticky;
    }
  }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoIconComponent {}
