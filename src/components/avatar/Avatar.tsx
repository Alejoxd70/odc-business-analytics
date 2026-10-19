export type AvatarProps = React.ComponentProps<'svg'> & {
  /**
   * - `loop`: idle talking animation (default).
   * - `external`: mouth openness is driven by the `--avatar-mouth` CSS variable
   *   (0 = closed, 1 = fully open) set on the `<svg>` element, e.g. from an
   *   audio analyser via `svgRef.current.style.setProperty('--avatar-mouth', v)`.
   *   Writing the variable straight to the DOM avoids re-rendering on every frame.
   */
  mouth?: 'loop' | 'external'
}

export const Avatar = ({ mouth = 'loop', ...props }: AvatarProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={200}
      height={200}
      fill="none"
      aria-hidden="true"
      viewBox="0 0 180 180"
      {...props}
    >
      <defs>
        <g id="h">
          <mask
            id="a"
            style={{
              maskType: 'luminance',
            }}
          >
            <rect width={36} height={14} y={31} fill="#fff" rx={4} />
            <rect width={36} height={48} x={12} y={14} fill="#fff" rx={4} />
            <rect width={36} height={24} x={120} y={28} fill="#fff" rx={4} />
            <path fill="#fff" d="M5 11h2v20H5z" />
          </mask>
          <g mask="url(#a)">
            <path fill="url(#b)" d="M-6 0h180v76H-6z" />
            <path fill="#fff" fillOpacity={0.3} d="M-6 0h180v76H-6z" />
            <path fill="#000" fillOpacity={0.1} d="M-6 38h180v38H-6z" />
          </g>
          <path fill="#fff" fillOpacity={0.4} d="M5 11h2v20H5z" />
          <circle cx={6} cy={8} r={4} fill="#FFEA8F" />
          <circle cx={7} cy={7} r={2} fill="#fff" />
        </g>
        <g id="i">
          <mask
            id="c"
            style={{
              maskType: 'luminance',
            }}
          >
            <path
              fill="#fff"
              d="M47.54 34.98 43 45.59h-3.74l4.92-10.43-6.05-10.43 3.22-11.84 2.9.8-2.9 10.6z"
            />
            <path fill="#fff" d="M30 39.59h24v13H30z" />
          </mask>
          <g mask="url(#c)">
            <path fill="url(#b)" d="M-8 .6H92v52H-8z" />
            <path fill="#fff" fillOpacity={0.3} d="M-8 6.6H92v52H-8z" />
            <path fill="#fff" fillOpacity={0.2} d="M30 39.59h24v13H30z" />
          </g>
          <circle cx={42} cy={8.59} r={8} fill="#FFE65C" />
          <circle cx={45} cy={5.59} r={3} fill="#fff" />
        </g>
        <g id="e" fill="#000" fillRule="evenodd" clipRule="evenodd">
          <path
            fillOpacity={0.2}
            d="M143 130.65c-3.19-17.34-9.55-2.58-24.85-5.63-6.76-1.35-1.3-7.25-6.34-9.8-4.26-2.17-10.06-.43-14.94-1.82-7.04-2.02-6.95-6.12-13.5-6.73-6.2-.58-12.7 1.33-18.97.61-11.8-1.35-6.96-19.22-15.82-22.38-8.85-3.15-23.43 2.3-25.34 11.23-1.86 8.71 10.57 41.12 10.57 41.12H143"
          />
          <path
            fillOpacity={0.1}
            d="M179 122.77c-51.24 0-56.58-25.8-81.8-37.61C72 73.34 49.9 103.9 41.44 74.2S33 137.07 33 137.07h146z"
          />
          <path
            fillOpacity={0.4}
            d="M184.58 9.18c-11.94-.98-5.04 10.8-9.75 10.8-6.97 0-2.1-7.97-10.58-7.78-2.22.06-4.95 1.94-5.12 4.5-.36 5.52 3.72 15.03-1.83 15.3-5.18.25-1.1-9.64-1.65-16.24-.3-3.77-4.18-6.75-6.97-6.75-7.57 0-1.68 15.7-7.13 15.7s-1.21-9.05-5.08-13.84c-4.5-5.57-19.3-8.3-8.75-10.87h57.15"
          />
        </g>
        <g id="j">
          <mask
            id="d"
            style={{
              maskType: 'luminance',
            }}
          >
            <rect width={130} height={120} fill="#fff" rx={18} />
          </mask>
          <g mask="url(#d)">
            <path fill="url(#b)" d="M-2-2h134v124H-2z" />
            <use href="#e" transform="translate(-44 -7)" />
          </g>
        </g>
        <mask
          id="f"
          style={{
            maskType: 'luminance',
          }}
        >
          <path
            fill="#fff"
            fillRule="evenodd"
            d="M14 6.22C14 17.78 20.47 24 34 24c13.52 0 20-6.34 20-17.78C54 5.5 53.17 4 51 4H17c-2.05 0-3 1.38-3 2.22"
            clipRule="evenodd"
          />
        </mask>
        <linearGradient id="b">
          <stop offset="0%" stopColor="#15a876" />
          <stop offset="50%" stopColor="#15a594" />
          <stop offset="100%" stopColor="#15a2a9" />
        </linearGradient>
        <clipPath id="g">
          <rect width={180} height={180} rx={0} ry={0} />
        </clipPath>
      </defs>
      <g clipPath="url(#g)">
        <use href="#h" transform="translate(6 66)" />
        <use href="#i" transform="translate(49 -.6)" />
        <use href="#j" transform="translate(25 44)" />
        {/* Mouth: scales from the upper lip (y=4 → 6px below the fill-box top at y=-2) */}
        <g transform="translate(56 128)">
          <g
            className={
              mouth === 'loop'
                ? 'transform-fill origin-[50%_6px] animate-talk motion-reduce:animate-none'
                : 'transform-fill origin-[50%_6px] transition-transform duration-60 ease-out'
            }
            style={
              mouth === 'external'
                ? { transform: 'scaleY(var(--avatar-mouth, 0.2))' }
                : undefined
            }
          >
            <path
              fill="#000"
              fillOpacity={0.8}
              fillRule="evenodd"
              d="M14 6.22C14 17.78 20.47 24 34 24c13.52 0 20-6.34 20-17.78C54 5.5 53.17 4 51 4H17c-2.05 0-3 1.38-3 2.22"
              clipRule="evenodd"
            />
            <g mask="url(#f)">
              <rect width={16} height={14} x={26} y={-2} fill="#fff" rx={2} />
            </g>
          </g>
        </g>
        {/* Eyes: the visor stays still, eyeballs + pupils blink */}
        <g transform="translate(38 76)">
          <rect
            width={104}
            height={34}
            y={11}
            fill="#000"
            fillOpacity={0.8}
            rx={17}
          />
          <g className="transform-fill origin-center animate-blink motion-reduce:animate-none">
            <circle cx={29} cy={28} r={13} fill="#F1EEDA" />
            <circle cx={75} cy={28} r={13} fill="#F1EEDA" />
            <rect
              width={10}
              height={10}
              x={24}
              y={23}
              fill="#000"
              fillOpacity={0.8}
              rx={2}
            />
            <rect
              width={10}
              height={10}
              x={70}
              y={23}
              fill="#000"
              fillOpacity={0.8}
              rx={2}
            />
          </g>
        </g>
      </g>
    </svg>
  )
}
