/**
 * Injury & Recovery content — basic description, recovery outlook, and the
 * recommended prevention/recovery exercises. Exercise names match entries in
 * the exercise catalog (data/exercisesCatalog.js).
 */

export const INJURIES = [
  {
    key: 'acl',
    name: 'ACL Tear / Strain',
    area: 'Knee',
    emoji: '🦵',
    description: "The ACL is a ligament that keeps your knee stable when you plant, cut, or land. A strain is a stretched or partially damaged ligament that's still intact, while a tear is a partial or full rupture, often felt as a pop followed by the knee giving out.",
    recovery: 'A strain usually heals with rest and targeted strengthening, no surgery needed. A tear often requires surgery followed by a pretty long rehab process to rebuild strength and balance before returning to sport.',
    exercises: ['Banded TKEs', 'Spanish Squat', 'Hand Resisted Spanish Squat', 'Banded Sissy Planks', '90 Degree Banded Hip Flexor Isometric', '3 Way Banded Calf Raise'],
  },
  {
    key: 'achilles',
    name: 'Achilles Tear / Strain',
    area: 'Ankle',
    emoji: '🦶',
    description: 'The Achilles tendon connects your calf to your heel and takes a beating every time you sprint or jump. A strain is an overstretched but intact tendon, while a tear is a partial or full rupture, often felt as a sudden pop or sharp pain in the back of the ankle.',
    recovery: 'A strain usually heals with rest and gradual strengthening, no surgery needed. A tear often requires surgery or a boot, followed by a long rehab process to rebuild strength before returning to sport.',
    exercises: ['Wall Supported Calf Raise', 'Floating Heel Split Squat Isometric', 'Slant Board Tibialis Raises', 'Calf Raise Isometric / Seated', 'Single Leg Calf Raise Eccentric', 'Single Leg Pogo Jumps'],
  },
  {
    key: 'adductor',
    name: 'Adductor Tear / Strain',
    area: 'Groin',
    emoji: '🦵',
    description: 'The adductors are the inner thigh muscles that pull your leg inward, and they take a hit during cutting and quick changes of direction. A strain is an overstretched but intact muscle, while a tear is a partial or full rupture, often felt as a sudden pull in the groin.',
    recovery: 'A strain usually heals with rest and gradual strengthening, no surgery needed. A tear often needs a longer rest period and structured rehab, with surgery reserved for severe full ruptures.',
    exercises: [],
  },
  {
    key: 'labrum',
    name: 'Labrum Tear',
    area: 'Hip / Shoulder',
    emoji: '🩻',
    description: "The labrum is a ring of cartilage that stabilizes your hip or shoulder joint and helps it move smoothly. Since it's cartilage, injuries are usually called a tear rather than a strain, ranging from minor fraying to a full tear, often felt as a deep ache, clicking, or a sense of instability in the joint.",
    recovery: 'Minor fraying can sometimes heal with rest and targeted physical therapy, no surgery needed. A full tear often requires surgery to repair or clean up the cartilage, followed by a structured rehab process before returning to sport.',
    exercises: [],
  },
]
