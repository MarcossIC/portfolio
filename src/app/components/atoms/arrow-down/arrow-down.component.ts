import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'arrow-down',
  template: `
    <svg
      class="arrow"
      width="100px"
      height="120px"
      viewBox="0 0 374 275"
      fill="none"
    >
      <g id="TRHEE-ARROWS" clip-path="url(#clip0_648_73)">
        <g id="BOT-ARROW" filter="url(#filter0_d_648_73)">
          <path
            d="M29 154L180.47 245.781L331.94 154"
            stroke="#200B47"
            stroke-width="30"
            stroke-linecap="round"
            stroke-linejoin="round"
            shape-rendering="crispEdges"
          />
        </g>
        <g id="MID-ARROW" filter="url(#filter1_d_648_73)">
          <path
            d="M82 100L179.941 154.312L277.883 100"
            stroke="#200B47"
            stroke-width="28"
            stroke-linecap="round"
            stroke-linejoin="round"
            shape-rendering="crispEdges"
          />
        </g>
        <g id="TOP-ARROW" filter="url(#filter2_d_648_73)">
          <path
            d="M113 45L180 79L247 45"
            stroke="#200B47"
            stroke-width="22"
            stroke-linecap="round"
            stroke-linejoin="round"
            shape-rendering="crispEdges"
          />
        </g>
      </g>
      <defs>
        <filter
          id="filter0_d_648_73"
          x="1.99805"
          y="132.998"
          width="356.944"
          height="145.784"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="6" />
          <feGaussianBlur stdDeviation="6" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.102624 0 0 0 0 0.0150568 0 0 0 0 0.190191 0 0 0 0.3 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_648_73"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_648_73"
            result="shape"
          />
        </filter>
        <filter
          id="filter1_d_648_73"
          x="55.9971"
          y="79.9976"
          width="247.888"
          height="106.315"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="6" />
          <feGaussianBlur stdDeviation="6" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.102624 0 0 0 0 0.0150568 0 0 0 0 0.190191 0 0 0 0.3 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_648_73"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_648_73"
            result="shape"
          />
        </filter>
        <filter
          id="filter2_d_648_73"
          x="89.998"
          y="27.9976"
          width="180.004"
          height="80.0024"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="6" />
          <feGaussianBlur stdDeviation="6" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.102624 0 0 0 0 0.0150568 0 0 0 0 0.190191 0 0 0 0.3 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_648_73"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_648_73"
            result="shape"
          />
        </filter>
        <clipPath id="clip0_648_73">
          <rect width="374" height="275" fill="white" />
        </clipPath>
      </defs>
    </svg>
  `,
  styles: [
    `
      .arrow {
        position: absolute;
        left: 50%;
        bottom: -125%;
        transform: translate(-50%, 0%);
        scale: 0.8;

        #BOT-ARROW {
          --start-anim-y: 0%;
          --percentage-anim-x: 0%;
          --percentage-anim-y: 60%;
          --scale-anim: 0.64;
          animation: bot-top-fortop 1.7s ease 100ms infinite alternate forwards;
        }

        #MID-ARROW {
          --start-anim-y: 0%;
          --percentage-anim-x: -1%;
          --percentage-anim-y: 55%;
          --scale-anim: 0.64;
          animation: bot-top-fortop 1.7s ease 140ms infinite alternate forwards;
        }
        #TOP-ARROW {
          --start-anim-y: 0%;
          --percentage-anim-x: 1%;
          --percentage-anim-y: 52%;
          --scale-anim: 0.59;
          animation: bot-top-fortop 1.7s ease 180ms infinite alternate forwards;
        }
      }

      @keyframes bot-top-fortop {
        to {
          transform: translate(0%, var(--start-anim-y));
          scale: 0.55;
        }
        from {
          transform: translate(
            var(--percentage-anim-x),
            var(--percentage-anim-y)
          );
          scale: var(--scale-anim);
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class ArrowDownComponent {
  constructor() {}
}
