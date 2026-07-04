/**
 * Nutrition content for the Nutrition section — organized by the body function
 * each nutrient supports, plus an injury/condition → nutrient lookup.
 * Descriptions are the full text from the Fit & Fueled nutrition guide.
 */

export const NUTRITION_CATEGORIES = [
  {
    key: 'energy',
    emoji: '⚡',
    title: 'Energy Production',
    why: 'Carbohydrates, fats, and key vitamins and minerals power your mitochondrial energy pathways — the reason an iron-deficient athlete "hits a wall" faster than their fitness should allow.',
    nutrients: [
      { name: 'Carbohydrates', desc: "Carbs are your body's fastest and preferred fuel source, especially during high-intensity efforts like sprinting or explosive jumps. They get broken down into glucose, which your muscles either use immediately or store as glycogen for later. Running low on carbs is a major reason athletes feel gassed out halfway through a game.", sources: 'Sweet Potato, Honey, Bananas' },
      { name: 'Fats', desc: "Fats are your body's long-lasting fuel source, kicking in more during lower-intensity, longer-duration activity like distance running. They also help your body absorb certain vitamins and support hormone production, which matters for muscle growth and recovery. Cutting fats too low can actually hurt performance, not help it.", sources: 'Avocado, Butter, Sardines' },
      { name: 'Vitamin B1', desc: "B1 helps your body convert carbs into usable energy at the cellular level. Without enough of it, that energy conversion slows down, leaving you fatigued even if you're eating enough food overall. It's especially important for athletes training hard on a carb-heavy diet.", sources: 'Pork, sunflower seeds, salmon' },
      { name: 'Iron', desc: "In the context of energy, iron is critical for carrying oxygen to your working muscles so they can produce fuel efficiently. Without enough iron, your muscles are essentially running on a limited oxygen supply, making everything feel harder than it should. This is one of the most common deficiencies among young athletes, especially those training in endurance sports.", sources: 'Red meat, oysters, beef liver' },
      { name: 'Magnesium', desc: "Magnesium is directly involved in the chemical reactions that convert food into usable energy. It also helps regulate blood sugar, which keeps your energy levels steady during longer training sessions. Low magnesium is often linked to fatigue that doesn't seem to match how hard you're training.", sources: 'Pumpkin seeds, almonds, dark chocolate' },
    ],
  },
  {
    key: 'muscle',
    emoji: '💪',
    title: 'Muscle Repair & Growth',
    why: 'Protein synthesis and the enzyme cofactors that rebuild the muscle fibers training breaks down.',
    nutrients: [
      { name: 'Protein', desc: "Protein provides the building blocks your body uses to repair and rebuild muscle fibers after training breaks them down. The harder you train, the more your body relies on a steady protein supply to come back stronger instead of just staying sore. It's the single most important nutrient for actually seeing progress from your workouts.", sources: 'Chicken, eggs, yogurt' },
      { name: 'Zinc', desc: 'Zinc plays a direct role in protein synthesis, the process your body uses to build new muscle tissue. It also supports the hormones involved in muscle growth and repair after training. Low zinc levels are linked to slower recovery and reduced strength gains over time.', sources: 'Oysters, beef liver, chickpeas' },
      { name: 'Magnesium', desc: 'For muscle repair specifically, magnesium helps your muscles relax properly after contracting, which is essential for recovery between training sessions. It also supports the protein-building process your body relies on to rebuild muscle fibers. Athletes low in magnesium often notice muscles that stay tight or sore longer than expected.', sources: 'Pumpkin seeds, spinach, dark chocolate' },
      { name: 'Vitamin B6', desc: "B6 helps your body break down and use the protein you eat, making sure those amino acids actually get put toward building muscle. It's also involved in producing new red blood cells, which support oxygen delivery to your muscles during recovery. Without enough B6, your body struggles to fully use the protein in your diet.", sources: 'Beef liver, tuna, bananas' },
    ],
  },
  {
    key: 'bone',
    emoji: '🦴',
    title: 'Bone Strength',
    why: 'Bone remodeling — including why vitamin K2 directs calcium into your bones instead of your arteries.',
    nutrients: [
      { name: 'Calcium', desc: "Calcium is the primary mineral your body uses to build and maintain bone density, giving your skeleton the strength to handle repeated impact from running, jumping, and contact. Beyond bones, it's also involved in muscle contraction, so low levels can affect both bone strength and muscle performance. Young athletes still growing need consistent calcium intake since this is when peak bone density is being built.", sources: 'Milk, yogurt, sardines (with bones)' },
      { name: 'Vitamin D', desc: "Vitamin D is essential for actually absorbing the calcium you eat, meaning without enough of it, calcium intake alone won't build strong bones. It also plays a role in muscle function and has been linked to reduced risk of stress fractures in athletes. Since it's produced by sun exposure, athletes who train mostly indoors are at higher risk of running low.", sources: 'Salmon, egg yolks, the sun' },
      { name: 'Vitamin A', desc: 'Vitamin A supports the cells responsible for bone growth and remodeling, which matters most for young athletes whose bones are still developing. It also plays a role in maintaining the cartilage that cushions your joints. Both too little and too much vitamin A can actually harm bone health, so balance matters.', sources: 'Liver, carrots, sweet potatoes' },
      { name: 'Vitamin K2', desc: 'K2 directs calcium to where it actually needs to go, your bones, instead of letting it build up in places like your arteries. This makes it essential for building strong, dense bones that can handle the repeated impact of running, jumping, and cutting. Most people get plenty of calcium but not enough K2 to use it properly.', sources: 'Egg yolks, hard cheese, beef liver' },
      { name: 'Magnesium', desc: 'For bone health, magnesium works alongside calcium and vitamin K2 to actually build bone density, not just support muscle function. Roughly half the magnesium in your body is stored in your bones. Weak bone density from low magnesium raises the risk of stress fractures, especially in high-impact sports.', sources: 'Pumpkin seeds, spinach, dark chocolate' },
    ],
  },
  {
    key: 'blood',
    emoji: '🩸',
    title: 'Oxygen Delivery & Blood',
    why: 'Hemoglobin synthesis and red blood cell production — why endurance athletes are prone to anemia.',
    nutrients: [
      { name: 'Iron', desc: "Iron is the core component of hemoglobin, the protein in your blood that actually carries oxygen from your lungs to your muscles. Without enough iron, your blood can't deliver oxygen efficiently, making even light activity feel exhausting. This is especially common in young athletes, particularly females and endurance athletes.", sources: 'Red meat, oysters, lentils' },
      { name: 'Vitamin B12', desc: "B12 is essential for producing healthy red blood cells, which are what actually transport oxygen through your bloodstream. Low B12 can lead to fewer, weaker red blood cells, directly limiting how much oxygen reaches your working muscles. It's mostly found in animal products, so it's a common gap for athletes eating plant-based diets.", sources: 'Liver, clams, sardines' },
      { name: 'Folate', desc: "Folate works alongside B12 to produce healthy red blood cells that carry oxygen through your bloodstream. Low folate leads to fewer, oversized red blood cells that deliver oxygen poorly — showing up as fatigue and hitting a wall earlier than your fitness should allow. It's especially important for growing and heavily-training athletes.", sources: 'Spinach, lentils, asparagus' },
      { name: 'Copper', desc: "Copper works alongside iron to help your body actually form functional red blood cells that carry oxygen through your bloodstream. Without enough copper, iron can't be used properly even if you're getting plenty of it in your diet. This makes copper a quiet but essential partner to iron in preventing fatigue caused by poor oxygen delivery.", sources: 'Beef liver, oysters, dark chocolate' },
    ],
  },
  {
    key: 'immune',
    emoji: '🛡️',
    title: 'Immune Defense & Inflammation',
    why: 'The oxidative stress of training, and why hard training temporarily suppresses immunity.',
    nutrients: [
      { name: 'Vitamin C', desc: "Vitamin C supports the immune cells that fight off illness, which matters most when your training load is high and your immune system is already under stress. It's also a powerful antioxidant, helping your body recover from the oxidative stress caused by intense workouts. Athletes training heavily are actually at higher risk of getting sick if intake is too low.", sources: 'Oranges, bell peppers, guavas' },
      { name: 'Vitamin E', desc: 'Vitamin E acts as an antioxidant that protects your cells, including immune cells, from damage caused by intense training. It helps your body recover from the physical stress of hard workouts while keeping your immune system functioning properly. Athletes under heavy training loads often need more of it than sedentary people.', sources: 'Almonds, sunflower seeds, hazelnuts' },
      { name: 'Zinc', desc: 'Zinc is one of the most important nutrients for immune function, directly supporting the cells that fight off infection. Intense training can temporarily suppress your immune system, making adequate zinc intake especially important for athletes. Low zinc is linked to getting sick more often and longer recovery times from illness.', sources: 'Oysters, beef liver, chickpeas' },
      { name: 'Choline', desc: "Choline supports the production and function of immune cells, helping your body respond properly to illness or infection. It also helps regulate inflammation, which is relevant for athletes whose bodies are frequently managing training-induced inflammation. Most young athletes don't get enough of it through diet alone.", sources: 'Eggs, liver, soybeans' },
    ],
  },
  {
    key: 'signaling',
    emoji: '🧠',
    title: 'Nerve & Muscle Signaling',
    why: 'The electrical signaling behind muscle contraction — and the real, mechanistic cause of cramping.',
    nutrients: [
      { name: 'Magnesium', desc: 'Magnesium helps regulate the electrical signals between your nerves and muscles, which is directly tied to how well your muscles contract and relax. Low magnesium is one of the most common causes of muscle cramps in athletes. It also helps prevent the kind of muscle twitching that shows up after long or intense training sessions.', sources: 'Pumpkin seeds, spinach, dark chocolate' },
      { name: 'Potassium', desc: 'Potassium works opposite sodium to help your muscles relax after contracting, making the two minerals a team in keeping muscle function smooth. Low potassium is strongly linked to cramping and muscle weakness, especially during long training sessions or hot weather. It also plays a role in maintaining a steady heartbeat during intense exercise.', sources: 'Bananas, potatoes, coconut water' },
      { name: 'Sodium', desc: 'Sodium is essential for generating the electrical signals that tell your muscles when to contract, and it also helps your body hold onto the fluid needed for proper muscle function. Heavy sweating during training depletes sodium fast, which is a major reason athletes cramp up during long or hot sessions. Replacing it properly is just as important as replacing water.', sources: 'Salt, red meat, beets' },
      { name: 'Choline', desc: 'Choline is used to make a chemical messenger that allows your brain to communicate with your muscles, controlling everything from reaction time to muscle contraction. Low choline can affect coordination and muscle control during fast, high-intensity movements. It becomes especially important during long training sessions when this messenger gets depleted faster.', sources: 'Eggs, liver, soybeans' },
    ],
  },
]

/**
 * Injury / condition → the nutrients most linked to its prevention and recovery.
 * Names match entries in NUTRITION_CATEGORIES so full details can be shown.
 */
export const INJURY_NUTRIENTS = [
  { condition: 'Stress Fractures', note: 'Bone density and remodeling depend on these working together.', nutrients: ['Calcium', 'Vitamin D', 'Vitamin K2', 'Magnesium'] },
  { condition: 'Muscle Cramps', note: 'Cramping is largely an electrolyte and nerve-signaling problem.', nutrients: ['Magnesium', 'Potassium', 'Sodium'] },
  { condition: 'ACL Tear / Strain', note: 'Ligament repair relies on collagen-building and protein synthesis.', nutrients: ['Protein', 'Vitamin C', 'Zinc'] },
  { condition: 'Achilles Tear / Strain', note: 'Tendon collagen and muscle recovery need these building blocks.', nutrients: ['Protein', 'Vitamin C', 'Magnesium'] },
  { condition: 'Adductor / Muscle Strain', note: 'Rebuilding torn muscle fibers is protein-driven.', nutrients: ['Protein', 'Vitamin B6', 'Zinc', 'Magnesium'] },
  { condition: 'Labrum Tear (cartilage)', note: 'Cartilage repair leans on collagen synthesis and protein.', nutrients: ['Vitamin C', 'Protein', 'Zinc'] },
  { condition: 'Anemia / Early Fatigue', note: 'Poor oxygen delivery from low red-blood-cell production.', nutrients: ['Iron', 'Vitamin B12', 'Folate', 'Copper'] },
  { condition: 'Getting Sick Often', note: 'Heavy training suppresses immunity — support your defenses.', nutrients: ['Vitamin C', 'Zinc', 'Vitamin E'] },
  { condition: 'Slow Recovery / Soreness', note: 'Muscle repair and relaxation need protein and its cofactors.', nutrients: ['Protein', 'Magnesium', 'Zinc'] },
]

/** Flat lookup of nutrient name → { desc, sources } (first occurrence wins). */
export const NUTRIENT_INFO = (() => {
  const map = {}
  for (const cat of NUTRITION_CATEGORIES) {
    for (const n of cat.nutrients) {
      if (!map[n.name]) map[n.name] = { desc: n.desc, sources: n.sources }
    }
  }
  return map
})()
