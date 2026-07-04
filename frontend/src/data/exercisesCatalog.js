/**
 * Rehab / prevention / training exercise catalog (informational — demos + the
 * angle to film/watch from). Separate from the 10 camera-analysis exercises.
 * Demo links open in a new tab (YouTube / Instagram).
 */

export const EXERCISE_CATEGORIES = ['Injury Prevention', 'Injury Recovery', 'Plyometrics', 'Resistance Training']

const PREVENTION = ['Injury Prevention', 'Injury Recovery']

export const CATALOG_EXERCISES = [
  // ── Injury Prevention (also used for Injury Recovery per the guide) ──
  {
    name: 'Spanish Squat',
    categories: PREVENTION,
    angle: 'Lateral only',
    videos: [
      { label: 'Demo 1', url: 'https://www.youtube.com/shorts/wT4DjGCFmXU' },
      { label: 'Demo 2', url: 'https://www.youtube.com/shorts/lqAh-DpfoZA' },
    ],
  },
  {
    name: 'Banded TKEs',
    categories: PREVENTION,
    angle: 'Lateral only',
    videos: [
      { label: 'Demo 1', url: 'https://www.youtube.com/shorts/CU7Fn11YMTw' },
      { label: 'Demo 2', url: 'https://www.youtube.com/shorts/3d4pIE9iG04' },
    ],
  },
  {
    name: 'Banded Sissy Planks',
    categories: PREVENTION,
    angle: 'Lateral only',
    videos: [
      { label: 'Beginners / injured', url: 'https://www.youtube.com/shorts/58sCqAmGfnw' },
      { label: 'More advanced', url: 'https://www.youtube.com/shorts/tFbaOIZ6HAI' },
    ],
  },
  {
    name: '90 Degree Banded Hip Flexor Isometric',
    categories: PREVENTION,
    angle: 'Lateral only',
    videos: [
      { label: 'Demo 1', url: 'https://www.youtube.com/shorts/WZyroBVYHgM' },
      { label: 'Demo 2', url: 'https://www.youtube.com/watch?v=4JH176EG5-g' },
    ],
  },
  {
    name: 'Wall Supported Calf Raise',
    categories: PREVENTION,
    angle: 'Diagonal back (easy) + Lateral (advanced)',
    videos: [
      { label: 'Beginners / injured', url: 'https://www.youtube.com/shorts/ms-DDjXN2rU' },
      { label: 'More advanced', url: 'https://www.youtube.com/watch?v=Xmwmi2ayd18' },
    ],
  },
  {
    name: 'Floating Heel Split Squat Isometric',
    categories: PREVENTION,
    angle: 'Lateral + Front diagonal',
    videos: [
      { label: 'Demo 1', url: 'https://www.youtube.com/shorts/6AbssOxKnOQ' },
      { label: 'Different angle', url: 'https://www.youtube.com/shorts/aovlBNlqh8w' },
      { label: 'Different angle & depth', url: 'https://www.youtube.com/shorts/FibV65GPE0M' },
    ],
  },
  {
    name: 'Slant Board Tibialis Raises',
    categories: PREVENTION,
    angle: 'Front diagonal',
    videos: [
      { label: 'Demo 1', url: 'https://www.youtube.com/watch?v=D1xs_QPOuuk' },
      { label: 'Demo 2', url: 'https://www.youtube.com/shorts/sTDzGQyLajo' },
    ],
  },
  {
    name: 'Toe Tucks',
    categories: PREVENTION,
    angle: 'Both angles (at end of video)',
    videos: [{ label: 'Watch demo', url: 'https://www.instagram.com/p/DaJZEZSM27H/' }],
  },
  {
    name: 'Toe Tuck Sit',
    categories: PREVENTION,
    angle: 'Incorrect & correct form shown',
    videos: [{ label: 'Watch demo', url: 'https://www.instagram.com/p/DYYHNb6sS1i/' }],
  },
  {
    name: 'Half Kneeling Lunge Hold',
    categories: PREVENTION,
    angle: 'Both angles (at end of video)',
    videos: [{ label: 'Watch demo', url: 'https://www.instagram.com/p/DZEE-ohsqIK/' }],
  },
  {
    name: 'Child Rockers',
    categories: PREVENTION,
    angle: 'Front & back (at end of video)',
    videos: [{ label: 'Watch demo', url: 'https://www.instagram.com/p/DXaOoyRjPfz/' }],
  },

  // ── Plyometrics ──
  {
    name: 'Pogo Jumps',
    categories: ['Plyometrics'],
    angle: 'Different angles',
    videos: [
      { label: 'Demo 1', url: 'https://www.youtube.com/shorts/p6SAfr8kN6w' },
      { label: 'Demo 2', url: 'https://www.youtube.com/shorts/4iGjxt6EOVA' },
    ],
  },
  {
    name: 'Single Leg Pogo Jumps',
    categories: ['Plyometrics'],
    angle: 'Different angles',
    videos: [
      { label: 'Demo 1', url: 'https://www.youtube.com/shorts/j-urCVp1xEM' },
      { label: 'Demo 2', url: 'https://www.youtube.com/shorts/iKHzmF_T-PU' },
    ],
  },

  // ── Resistance Training ──
  {
    name: 'Barbell Back Squat',
    categories: ['Resistance Training'],
    angle: 'Front, lateral, front diagonal, back',
    videos: [
      { label: 'Front', url: 'https://www.youtube.com/watch?v=ultWZbUMPL8' },
      { label: 'Lateral', url: 'https://www.youtube.com/watch?v=QmZAiBqPvZw' },
      { label: 'Front diagonal', url: 'https://www.youtube.com/shorts/N2Ixubbn9Uw' },
      { label: 'Back', url: 'https://www.youtube.com/shorts/1eq5Oz__6b0' },
    ],
  },
  {
    name: 'Pushups',
    categories: ['Resistance Training'],
    angle: 'Lateral',
    videos: [
      { label: 'Demo 1', url: 'https://www.youtube.com/watch?v=WDIpL0pjun0' },
      { label: 'Demo 2', url: 'https://www.youtube.com/shorts/04FqT6lC0i4' },
    ],
  },
]
