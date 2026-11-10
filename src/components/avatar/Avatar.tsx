import type { CSSProperties } from 'react'
import { AVATAR_VIEWBOX } from './avatarCanvas'

export type AvatarProps = React.ComponentProps<'svg'> & {
  /**
   * Drives the mouth and the arms:
   * - `loop`: idle talking animation (default).
   * - `external`: driven by CSS variables set on the `<svg>` element, e.g. from an
   *   audio analyser via `svgRef.current.style.setProperty(...)`:
   *   `--avatar-mouth` (0 = closed, 1 = fully open) and `--avatar-arm-l` /
   *   `--avatar-arm-r` (0 = resting, 1 = fully raised). Writing the variables
   *   straight to the DOM avoids re-rendering on every frame.
   */
  talk?: 'loop' | 'external'
  /** Shows the thought cloud, which pops up now and then (e.g. while not talking). */
  thinking?: boolean
}

type Talk = 'loop' | 'external'

const JOINT_GREY = '#7D8796'

/**
 * A joint that turns with the voice: by `lift` degrees at full gesture, driven by
 * --avatar-arm-l / --avatar-arm-r (or the gesture loop). Its origin is the pivot.
 */
const Joint = ({ side, lift, talk, children }: { side: 'l' | 'r', lift: number, talk: Talk, children: React.ReactNode }) => {
  const style = (talk === 'external'
    // --avatar-held = 1 while the user carries DataMind: arms up, whatever the voice does
    ? { transform: `rotate(calc(max(var(--avatar-arm-${side}, 0), var(--avatar-held, 0)) * ${lift}deg))` }
    : { '--arm-dir': Math.sign(lift) }) as CSSProperties
  return (
    <g
      className={
        talk === 'loop'
          ? 'transform-fill origin-center animate-gesture motion-reduce:animate-none'
          : 'transform-fill origin-center transition-transform duration-100 ease-out'
      }
      style={style}
    >
      {/* Invisible square centred on the pivot: the fill box's centre is then the joint
          itself, whatever the arm's shape (reliable across browsers in nested SVG). */}
      <rect x={-100} y={-100} width={200} height={200} fill="none" />
      {children}
    </g>
  )
}

/** Arm segment along +y from the joint, with the head's gradient. */
const Segment = ({ length, width }: { length: number, width: number }) => (
  <rect x={-width / 2} width={width} height={length} rx={width / 2} fill="url(#b)" />
)

/** Lego-style hand from the wrist: a grey gripper "C" open away from the arm. */
const Hand = () => (
  <>
    <rect width={7} height={6} x={-3.5} rx={1.5} fill={JOINT_GREY} />
    <path d="M -4.18 14.98 A 6.5 6.5 0 1 1 4.18 14.98" stroke="#A3ABB7" strokeWidth={4.5} strokeLinecap="round" />
    <path d="M -5.32 6.27 A 6.5 6.5 0 0 1 5.32 6.27" stroke="#fff" strokeOpacity={0.35} strokeWidth={1.5} strokeLinecap="round" />
  </>
)

const Forearm = () => (
  <>
    <Segment length={22} width={11} />
    <g transform="translate(0 20)"><Hand /></g>
    <circle r={6} fill={JOINT_GREY} />
  </>
)

/**
 * Left arm (viewer's left), raised in a wave: the upper arm points out and the elbow
 * bends the forearm up. Talking waves the forearm further out from the elbow.
 */
const LeftArm = ({ talk }: { talk: Talk }) => (
  <g transform="translate(52 182) rotate(70)">
    <Segment length={20} width={10} />
    <g transform="translate(0 20) rotate(80)">
      <Joint side="l" lift={-35} talk={talk}>
        <Forearm />
      </Joint>
    </g>
    <circle r={7} fill={JOINT_GREY} />
  </g>
)

/** Right arm, hanging down and slightly bent. Talking lifts it from the shoulder. */
const RightArm = ({ talk }: { talk: Talk }) => (
  <g transform="translate(128 182) rotate(-60)">
    <Joint side="r" lift={-50} talk={talk}>
      <Segment length={20} width={10} />
      <g transform="translate(0 20) rotate(35)">
        <Forearm />
      </g>
      <circle r={7} fill={JOINT_GREY} />
    </Joint>
  </g>
)

/** Body under the head: collar, rounded torso and a chest light that blinks with the bulb. */
const Torso = () => (
  <>
    <path fill="url(#b)" d="M62 172h56q10 0 11.5 10l5.5 32q2 14-13 14H58q-15 0-13-14l5.5-32Q52 172 62 172z" />
    <path fill="#000" fillOpacity={0.1} d="M46.4 206h87.2l1.4 8q2 14-13 14H58q-15 0-13-14z" />
    <rect x={66} y={160} width={48} height={14} rx={5} fill="#000" fillOpacity={0.8} />
    <circle cx={90} cy={200} r={10} fill="#F1EEDA" />
    <circle cx={90} cy={200} r={6} fill="#FFE65C" />
    <circle cx={90} cy={200} r={6} fill="#FFF8C4" className="animate-bulb opacity-15 motion-reduce:animate-none" />
  </>
)

/** Circles whose union draws the cloud (cx, cy, r). */
const CLOUD = [
  [147, 24, 10], [158, 15, 12], [172, 17, 11], [180, 26, 8], [165, 30, 10], [152, 31, 8],
] as const
const CLOUD_TRAIL = [[129, 47, 2.5], [136, 41, 3.5]] as const
/** Mini bar chart inside the cloud: DataMind thinks about data (x, height, color). */
const THINK_BARS = [[152, 8, '#15a594', '0s'], [160, 12, '#15a594', '0.2s'], [168, 16, '#E0A21B', '0.4s']] as const

const ThoughtCloud = () => (
  // Hidden at rest (opacity 0): with reduced motion the animation never runs, so it never shows.
  <g className="transform-fill origin-[0%_100%] animate-think opacity-0 motion-reduce:hidden">
    {/* Outline first, fill on top: only the outer edge of the union keeps the stroke */}
    <g stroke="#000" strokeOpacity={0.15} strokeWidth={3}>
      {[...CLOUD, ...CLOUD_TRAIL].map(([cx, cy, r]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} />)}
    </g>
    <g fill="#fff">
      {[...CLOUD, ...CLOUD_TRAIL].map(([cx, cy, r]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} />)}
    </g>
    {THINK_BARS.map(([x, height, color, delay]) => (
      <rect
        key={x}
        x={x - 2.5}
        y={30 - height}
        width={5}
        height={height}
        rx={1.5}
        fill={color}
        className="transform-fill origin-bottom animate-think-bar"
        style={{ animationDelay: delay }}
      />
    ))}
  </g>
)

export const Avatar = ({ talk = 'loop', thinking = false, ...props }: AvatarProps) => {
  const { x, y, width, height } = AVATAR_VIEWBOX
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={200}
      height={200}
      fill="none"
      aria-hidden="true"
      viewBox={`${x} ${y} ${width} ${height}`}
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
          <rect x={x} y={y} width={width} height={height} rx={0} ry={0} />
        </clipPath>
      </defs>
      <g clipPath="url(#g)">
        <use href="#h" transform="translate(6 66)" />
        <Torso />
        <LeftArm talk={talk} />
        <RightArm talk={talk} />
        <use href="#i" transform="translate(49 -.6)" />
        {/* Top bulb (centre 91, 8): a halo and a bright core drawn over the original bulb
            blink in a loop. Outside <defs>, because animations inside <use> are unreliable. */}
        <circle cx={91} cy={8} r={13} fill="#FFE65C" className="transform-fill origin-center animate-bulb-halo opacity-15 motion-reduce:animate-none" />
        <circle cx={91} cy={8} r={8} fill="#FFF8C4" className="animate-bulb opacity-15 motion-reduce:animate-none" />
        {/* Lit while the user carries DataMind (data-held on the <svg>, a .group) */}
        <circle cx={91} cy={8} r={8} fill="#FFF8C4" className="opacity-0 transition-opacity group-data-held:opacity-100" />
        <use href="#j" transform="translate(25 44)" />
        {/* Mouth: scales from the upper lip (y=4 → 6px below the fill-box top at y=-2) */}
        <g transform="translate(56 128)">
          <g
            className={
              talk === 'loop'
                ? 'transform-fill origin-[50%_6px] animate-talk motion-reduce:animate-none'
                : 'transform-fill origin-[50%_6px] transition-transform duration-60 ease-out'
            }
            style={
              talk === 'external'
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
        {thinking && <ThoughtCloud />}
      </g>
    </svg>
  )
}
