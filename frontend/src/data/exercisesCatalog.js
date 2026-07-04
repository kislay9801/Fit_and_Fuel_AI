/**
 * Rehab / prevention / training exercise catalog (informational — demos + the
 * angle to film/watch from). Separate from the 10 camera-analysis exercises.
 *
 * VIDEO URLS: the source doc listed demos as "Link 1 / Link 2" placeholders and
 * the actual URLs weren't included. Paste real URLs into each `videos[].url`
 * (replace null) and they'll render as play links automatically.
 */

export const EXERCISE_CATEGORIES = ['Injury Prevention', 'Injury Recovery', 'Plyometrics', 'Resistance Training']

const v = (n, labels = []) =>
  Array.from({ length: n }, (_, i) => ({ label: labels[i] || `Demo ${i + 1}`, url: null }))

export const CATALOG_EXERCISES = [
  // ── Injury Prevention (also used for Injury Recovery per the guide) ──
  { name: 'Spanish Squat', categories: ['Injury Prevention', 'Injury Recovery'], angle: 'Lateral only', videos: v(2) },
  { name: 'Banded TKEs', categories: ['Injury Prevention', 'Injury Recovery'], angle: 'Lateral only', videos: v(2) },
  { name: 'Banded Sissy Planks', categories: ['Injury Prevention', 'Injury Recovery'], angle: 'Lateral only', videos: v(2, ['Beginners / injured', 'More advanced']) },
  { name: '90 Degree Banded Hip Flexor Isometric', categories: ['Injury Prevention', 'Injury Recovery'], angle: 'Lateral only', videos: v(2) },
  { name: 'Wall Supported Calf Raise', categories: ['Injury Prevention', 'Injury Recovery'], angle: 'Diagonal back (easy) + Lateral (advanced)', videos: v(2, ['Beginners / injured', 'More advanced']) },
  { name: 'Floating Heel Split Squat Isometric', categories: ['Injury Prevention', 'Injury Recovery'], angle: 'Lateral + Front diagonal', videos: v(3, ['Demo 1', 'Different angle', 'Different angle & depth']) },
  { name: 'Slant Board Tibialis Raises', categories: ['Injury Prevention', 'Injury Recovery'], angle: 'Front diagonal', videos: v(2) },
  { name: 'Toe Tucks', categories: ['Injury Prevention', 'Injury Recovery'], angle: 'Both angles (at end of video)', videos: v(1) },
  { name: 'Toe Tuck Sit', categories: ['Injury Prevention', 'Injury Recovery'], angle: 'Incorrect & correct form shown', videos: v(1) },
  { name: 'Half Kneeling Lunge Hold', categories: ['Injury Prevention', 'Injury Recovery'], angle: 'Both angles (at end of video)', videos: v(1) },
  { name: 'Child Rockers', categories: ['Injury Prevention', 'Injury Recovery'], angle: 'Front & back (at end of video)', videos: v(1) },

  // ── Plyometrics ──
  { name: 'Pogo Jumps', categories: ['Plyometrics'], angle: 'Different angles', videos: v(2) },
  { name: 'Single Leg Pogo Jumps', categories: ['Plyometrics'], angle: 'Different angles', videos: v(2) },

  // ── Resistance Training ──
  { name: 'Barbell Back Squat', categories: ['Resistance Training'], angle: 'Front, lateral, front diagonal, back', videos: v(4, ['Front', 'Lateral', 'Front diagonal', 'Back']) },
  { name: 'Pushups', categories: ['Resistance Training'], angle: 'Lateral', videos: v(2) },
]
