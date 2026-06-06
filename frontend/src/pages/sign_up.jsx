<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Register | Fit &amp; Fuel AI Coach</title>
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<!-- Material Symbols -->
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<!-- Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&amp;family=Montserrat:wght@600;700&amp;family=JetBrains+Mono:wght@500&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "error-container": "#ffdad6",
                    "surface-container-lowest": "#ffffff",
                    "inverse-primary": "#b3c5ff",
                    "surface-variant": "#d3e4fe",
                    "surface-container-low": "#eff4ff",
                    "primary": "#0050cb",
                    "on-primary-fixed-variant": "#003fa4",
                    "outline-variant": "#c2c6d8",
                    "surface-container-high": "#dce9ff",
                    "surface-container": "#e5eeff",
                    "on-surface-variant": "#424656",
                    "surface-container-highest": "#d3e4fe",
                    "secondary-container": "#6cf8bb",
                    "primary-container": "#0066ff",
                    "on-surface": "#0b1c30",
                    "tertiary": "#954000",
                    "primary-fixed": "#dae1ff",
                    "on-secondary": "#ffffff",
                    "on-primary-container": "#f8f7ff",
                    "background": "#f8f9ff",
                    "on-primary-fixed": "#001849",
                    "on-secondary-fixed": "#002113",
                    "inverse-surface": "#213145",
                    "secondary": "#006c49",
                    "on-tertiary-fixed-variant": "#783200",
                    "tertiary-container": "#bc5200",
                    "surface-dim": "#cbdbf5",
                    "on-secondary-fixed-variant": "#005236",
                    "on-secondary-container": "#00714d",
                    "surface": "#f8f9ff",
                    "on-primary": "#ffffff",
                    "on-background": "#0b1c30",
                    "on-tertiary": "#ffffff",
                    "tertiary-fixed": "#ffdbca",
                    "surface-bright": "#f8f9ff",
                    "secondary-fixed": "#6ffbbe",
                    "on-error": "#ffffff",
                    "tertiary-fixed-dim": "#ffb690",
                    "on-tertiary-fixed": "#341100",
                    "error": "#ba1a1a",
                    "on-error-container": "#93000a",
                    "inverse-on-surface": "#eaf1ff",
                    "secondary-fixed-dim": "#4edea3",
                    "primary-fixed-dim": "#b3c5ff",
                    "surface-tint": "#0054d6",
                    "outline": "#727687",
                    "on-tertiary-container": "#fff6f3"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "spacing": {
                    "md": "24px",
                    "sm": "12px",
                    "margin-mobile": "16px",
                    "xs": "4px",
                    "lg": "40px",
                    "xl": "64px",
                    "gutter": "16px",
                    "margin-desktop": "32px",
                    "base": "8px"
            },
            "fontFamily": {
                    "display-lg-mobile": ["Montserrat"],
                    "data-label": ["JetBrains Mono"],
                    "display-lg": ["Montserrat"],
                    "body-md": ["Inter"],
                    "headline-md": ["Montserrat"],
                    "caption": ["Inter"],
                    "body-lg": ["Inter"]
            },
            "fontSize": {
                    "display-lg-mobile": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
                    "data-label": ["14px", {"lineHeight": "20px", "letterSpacing": "0.05em", "fontWeight": "500"}],
                    "display-lg": ["48px", {"lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
                    "body-md": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
                    "headline-md": ["24px", {"lineHeight": "32px", "fontWeight": "600"}],
                    "caption": ["12px", {"lineHeight": "16px", "fontWeight": "500"}],
                    "body-lg": ["18px", {"lineHeight": "28px", "fontWeight": "400"}]
            }
          },
        },
      }
    </script>
<style>
        .glass-hud {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
    </style>
</head>
<body class="bg-background text-on-background font-body-md selection:bg-primary-container selection:text-on-primary-container overflow-x-hidden">
<!-- TopAppBar (Suppressed FAB/Nav logic: Transactional flow, no BottomNavBar) -->
<header class="w-full top-0 sticky bg-surface dark:bg-on-background border-b border-outline-variant dark:border-on-surface-variant z-50">
<div class="flex justify-between items-center h-16 px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto">
<div class="font-display-lg text-headline-md md:text-display-lg text-primary dark:text-primary-fixed tracking-tight cursor-pointer">
                Fit &amp; Fuel AI
            </div>
<div class="hidden md:flex gap-md items-center">
<button class="text-on-surface-variant hover:bg-surface-container-low transition-colors px-md py-xs rounded-lg cursor-pointer active:scale-95 duration-150 font-medium">
                    Support
                </button>
</div>
</div>
</header>
<main class="min-h-[calc(100vh-64px)] flex flex-col md:flex-row">
<!-- Left Side: Aesthetic/Branding (Clinical Precision) -->
<section class="hidden md:flex md:w-1/2 bg-surface-container-highest relative overflow-hidden items-center justify-center p-xl">
<div class="absolute inset-0 opacity-20 pointer-events-none" style="background-image: radial-gradient(circle at 2px 2px, #0050cb 1px, transparent 0); background-size: 32px 32px;"></div>
<div class="relative z-10 max-w-lg">
<div class="mb-lg">
<span class="inline-block px-sm py-xs bg-primary text-on-primary text-caption font-data-label rounded-full mb-md uppercase tracking-widest">Clinical Grade Analysis</span>
<h2 class="font-display-lg text-display-lg text-on-surface mb-md leading-tight">Precision Performance for Elite Athletes.</h2>
<p class="font-body-lg text-on-surface-variant">Experience real-time biomechanical feedback and personalized nutrition plans driven by advanced AI protocols.</p>
</div>
<!-- HUD Mockup Element -->
<div class="glass-hud rounded-xl p-md shadow-lg border border-white/50 relative overflow-hidden">
<div class="flex items-center gap-sm mb-md">
<span class="material-symbols-outlined text-primary">analytics</span>
<span class="font-data-label text-caption text-primary uppercase">Biometric Telemetry</span>
</div>
<div class="space-y-sm">
<div class="h-1.5 w-full bg-surface-container-low rounded-full overflow-hidden">
<div class="h-full bg-secondary w-3/4"></div>
</div>
<div class="flex justify-between font-data-label text-caption">
<span class="text-on-surface-variant">Knee Alignment</span>
<span class="text-secondary font-bold">OPTIMAL</span>
</div>
</div>
</div>
</div>
<!-- Background Image Decorator -->
<div class="absolute -bottom-20 -right-20 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl"></div>
</section>
<!-- Right Side: Registration Form -->
<section class="w-full md:w-1/2 flex items-center justify-center p-margin-mobile md:p-xl bg-surface">
<div class="w-full max-w-md">
<div class="mb-lg">
<h1 class="font-headline-md text-headline-md text-on-surface mb-xs">Create your Athlete Profile</h1>
<p class="text-on-surface-variant font-body-md">Join the frontier of data-driven fitness coaching.</p>
</div>
<form class="space-y-md" onsubmit="event.preventDefault();">
<!-- Full Name -->
<div class="space-y-xs">
<label class="block font-data-label text-caption text-on-surface-variant uppercase ml-xs">Full Name</label>
<input class="w-full h-12 px-md bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" placeholder="Dr. Sarah Chen" type="text"/>
</div>
<!-- Email -->
<div class="space-y-xs">
<label class="block font-data-label text-caption text-on-surface-variant uppercase ml-xs">Athlete Email</label>
<input class="w-full h-12 px-md bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" placeholder="athlete@fitfuel.ai" type="email"/>
</div>
<!-- Password -->
<div class="space-y-xs">
<label class="block font-data-label text-caption text-on-surface-variant uppercase ml-xs">Secure Password</label>
<input class="w-full h-12 px-md bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" placeholder="••••••••" type="password"/>
</div>
<!-- Primary Goal (Toggle Buttons Pattern) -->
<div class="space-y-xs">
<label class="block font-data-label text-caption text-on-surface-variant uppercase ml-xs">Primary Focus</label>
<div class="grid grid-cols-1 gap-sm">
<select class="w-full h-12 px-md bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none appearance-none">
<option>Performance Enhancement</option>
<option>Injury Prevention</option>
<option>Learning Form &amp; Mechanics</option>
<option>Nutrition Optimization</option>
</select>
</div>
</div>
<!-- Terms -->
<div class="flex items-start gap-sm py-xs">
<input class="mt-1 w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary" id="terms" type="checkbox"/>
<label class="text-caption text-on-surface-variant" for="terms">
                            I agree to the <a class="text-primary hover:underline" href="#">Terms of Service</a> and <a class="text-primary hover:underline" href="#">Privacy Policy</a> including clinical data handling.
                        </label>
</div>
<!-- Action Button -->
<button class="w-full h-14 bg-primary text-on-primary font-headline-md rounded-lg shadow-sm hover:bg-primary-container transition-all active:scale-[0.98] duration-150">
                        Create Account
                    </button>
<!-- Divider -->
<div class="flex items-center gap-md py-sm">
<div class="flex-grow h-px bg-outline-variant"></div>
<span class="font-data-label text-caption text-outline uppercase">Or register with</span>
<div class="flex-grow h-px bg-outline-variant"></div>
</div>
<!-- Social Sign-up -->
<div class="grid grid-cols-2 gap-md">
<button class="flex items-center justify-center gap-sm h-12 border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors font-medium">
<img alt="Google" class="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRQFA6pO3Wy5BUBKLSF61m79rzx6DUIoA_ilZ0d9k8pNqvBY-C1WqliB75Gp8UkMYZe_8rRCPzSJiusWSZbhnXUHxNzGMJ_qzsBO7gATqJzHpdlHgXdNZ3Gny7jYrMKP6oBeca2v3nPXCtSCgnx6jPzEnVZ7LW3neZhIuD-FESgKcs_y6Fv5ay1iEQVvzDFzFLwc6ekF56SkKmHIvloTHa04Iu85wTjnp-g8QmJob-wiN29lO-5gr6WfqGr0b6Mvyd9TVL4eujXxA"/>
<span>Google</span>
</button>
<button class="flex items-center justify-center gap-sm h-12 border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors font-medium">
<span class="material-symbols-outlined text-on-surface">apps</span>
<span>Apple</span>
</button>
</div>
</form>
<div class="mt-xl text-center">
<p class="font-body-md text-on-surface-variant">
                        Already have an account? 
                        <a class="text-primary font-bold hover:underline" href="#">Sign In</a>
</p>
</div>
</div>
</section>
</main>
<!-- Footer (Suppressed active navigation as it's a focused transactional screen) -->
<footer class="w-full py-lg mt-auto bg-surface-container-lowest dark:bg-inverse-surface border-t border-outline-variant dark:border-on-surface-variant">
<div class="grid grid-cols-1 md:grid-cols-2 gap-md px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto">
<div class="space-y-sm">
<div class="font-headline-md text-headline-md text-primary">Fit &amp; Fuel AI</div>
<p class="font-caption text-caption text-on-surface-variant dark:text-surface-variant">
                    © 2024 Fit &amp; Fuel AI Coach. Performance &amp; Nutrition Analytics. Precision engineered for results.
                </p>
</div>
<div class="flex flex-wrap gap-md md:justify-end items-center">
<a class="text-caption font-caption text-on-surface-variant dark:text-surface-variant hover:text-primary transition-all duration-200" href="#">Privacy Policy</a>
<a class="text-caption font-caption text-on-surface-variant dark:text-surface-variant hover:text-primary transition-all duration-200" href="#">Terms of Service</a>
<a class="text-caption font-caption text-on-surface-variant dark:text-surface-variant hover:text-primary transition-all duration-200" href="#">Athlete Portal</a>
<a class="text-caption font-caption text-on-surface-variant dark:text-surface-variant hover:text-primary transition-all duration-200" href="#">Coach Dashboard</a>
</div>
</div>
</footer>
<script>
        // Simple micro-interaction for input focus effects
        document.querySelectorAll('input, select').forEach(el => {
            el.addEventListener('focus', () => {
                el.parentElement.querySelector('label')?.classList.add('text-primary');
            });
            el.addEventListener('blur', () => {
                el.parentElement.querySelector('label')?.classList.remove('text-primary');
            });
        });
    </script>
</body></html>