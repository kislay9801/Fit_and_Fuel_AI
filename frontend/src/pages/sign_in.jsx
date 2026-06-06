<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&amp;family=Montserrat:wght@600;700&amp;family=JetBrains+Mono:wght@500&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
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
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            display: inline-block;
            vertical-align: middle;
        }
        .glass-hud {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.3);
        }
    </style>
</head>
<body class="bg-background text-on-surface min-h-screen flex flex-col font-body-md text-body-md overflow-x-hidden">
<!-- Top Navigation Bar (Shared Component Reference) -->
<header class="w-full top-0 sticky bg-surface dark:bg-on-background border-b border-outline-variant dark:border-on-surface-variant z-50">
<div class="flex justify-between items-center h-16 px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto">
<div class="font-display-lg text-display-lg-mobile md:text-display-lg text-primary dark:text-primary-fixed tracking-tight">
                Fit &amp; Fuel AI
            </div>
<div class="hidden md:flex items-center space-x-md">
<button class="text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-low dark:hover:bg-inverse-surface transition-colors px-sm py-xs rounded cursor-pointer active:scale-95 duration-150">
                    Support
                </button>
</div>
</div>
</header>
<main class="flex-grow flex items-stretch">
<div class="w-full flex flex-col md:flex-row min-h-[calc(100vh-64px)]">
<!-- Visual Section (Left side on desktop) -->
<div class="relative hidden md:block md:w-1/2 lg:w-3/5 overflow-hidden">
<img alt="Professional athlete preparing for a high-intensity workout" class="absolute inset-0 w-full h-full object-cover" data-alt="A cinematic, low-angle shot of a determined professional athlete tying their training shoes in a sleek, modern, high-tech gym environment. The scene is illuminated by cool, clinical daylight flooding through large industrial windows, emphasizing sharp anatomical precision and muscle definition. The color palette features Action Blue accents against neutral Slate grays and whites, reflecting a high-performance, medical-tech fitness aesthetic. Soft atmospheric dust particles catch the light, adding a sense of focus and elite preparation." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQOQtE006eVDZTzLTIIopl6QgqVOETx4UhTr8IjQ4s_r9yY0jcIT4Ukahbz1RHJQ7Nh0VCVb2nVN9l1BPTuZQKumKdMKT5S5zEk-Jxm2b3YX2bHHYNzj6GrSgUuDGXDAGs0WSunUwCsypDFU3PMEZo6BHJ-hhSPzV6ZYkGZ9HVTuaC5bIib2_SNvDkWABF9hM3QhiKaS2jk0t5fpnHbk93dRSfRXVjmpGQvu-TdlSyEuji_ii1c7pHx1SuY-46UbEgOFEqiGxNVU4"/>
<!-- HUD Overlay Elements -->
<div class="absolute inset-0 bg-gradient-to-t from-on-background/40 to-transparent"></div>
<div class="absolute bottom-lg left-lg right-lg space-y-md">
<div class="glass-hud p-md rounded-xl max-w-md">
<div class="flex items-center gap-sm mb-xs">
<span class="material-symbols-outlined text-primary" style="font-variation-settings: 'FILL' 1;">monitoring</span>
<span class="font-data-label text-data-label text-primary uppercase">Real-Time Biometrics</span>
</div>
<h2 class="font-headline-md text-headline-md text-on-surface mb-xs">Precision Analytics</h2>
<p class="font-body-md text-body-md text-on-surface-variant">Our proprietary AI tracks joint articulation with 99.8% clinical accuracy to maximize your output.</p>
</div>
<div class="flex gap-sm">
<div class="glass-hud px-md py-sm rounded-full flex items-center gap-xs">
<div class="w-2 h-2 rounded-full bg-secondary"></div>
<span class="font-data-label text-data-label text-on-surface">CALIBRATED</span>
</div>
<div class="glass-hud px-md py-sm rounded-full flex items-center gap-xs">
<div class="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
<span class="font-data-label text-data-label text-on-surface">AI ACTIVE</span>
</div>
</div>
</div>
</div>
<!-- Form Section (Right side on desktop) -->
<div class="w-full md:w-1/2 lg:w-2/5 flex items-center justify-center p-margin-mobile md:p-xl bg-surface">
<div class="w-full max-w-md space-y-xl">
<!-- Header -->
<div class="space-y-xs">
<h1 class="font-headline-md text-headline-md text-on-surface text-3xl font-bold">Welcome back</h1>
<p class="font-body-md text-body-md text-on-surface-variant">Access your performance dashboard and fuel plan.</p>
</div>
<!-- Social Logins -->
<div class="grid grid-cols-2 gap-md">
<button class="flex items-center justify-center gap-sm px-md py-sm border border-outline-variant rounded-lg hover:bg-surface-container-low transition-all duration-200 active:scale-95">
<img alt="Google" class="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyM7EWnWedhNk8QQLaTsmhgII6TQb7J7eCXZCDtn3pU90n8jlxEzFn8M_9yu4knqIcp1bub6RWHd-ixh2V0gW6a5nIbQTe5CJK7YF9CIgfGY71S4baEe1VPPmqNXsMBc6T-_Ew123WxoU6ZYaAjLoCpJkd91NnCzhu1cdG90utmuLA1dEuYMmXYiGKvt9TpwxvOBldqXPwelgUwx83Ppx1A9iz-ghY4zk2a0pxOGG2a7O9Evzyx5T8nj7qt6H2FKGgdGfjLeAUYtU"/>
<span class="font-caption text-caption uppercase tracking-wider">Google</span>
</button>
<button class="flex items-center justify-center gap-sm px-md py-sm border border-outline-variant rounded-lg hover:bg-surface-container-low transition-all duration-200 active:scale-95">
<span class="material-symbols-outlined text-xl">apps</span>
<span class="font-caption text-caption uppercase tracking-wider">Apple</span>
</button>
</div>
<div class="relative flex items-center">
<div class="flex-grow border-t border-outline-variant"></div>
<span class="flex-shrink mx-md font-caption text-caption text-outline uppercase tracking-widest">or email</span>
<div class="flex-grow border-t border-outline-variant"></div>
</div>
<!-- Sign In Form -->
<form class="space-y-md">
<div class="space-y-xs">
<label class="font-data-label text-data-label text-on-surface-variant ml-xs" for="email">ATHLETE EMAIL</label>
<div class="relative">
<span class="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline text-[20px]">mail</span>
<input class="w-full pl-[52px] pr-md py-sm bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" id="email" placeholder="name@athlete.com" type="email"/>
</div>
</div>
<div class="space-y-xs">
<label class="font-data-label text-data-label text-on-surface-variant ml-xs" for="password">SECURE PASSWORD</label>
<div class="relative">
<span class="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline text-[20px]">lock</span>
<input class="w-full pl-[52px] pr-[52px] py-sm bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" id="password" placeholder="••••••••" type="password"/>
<button class="absolute right-md top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors" type="button">
<span class="material-symbols-outlined text-[20px]">visibility</span>
</button>
</div>
</div>
<div class="flex items-center justify-between">
<label class="flex items-center gap-xs cursor-pointer group">
<div class="relative flex items-center">
<input class="peer h-5 w-5 rounded border-outline-variant text-primary focus:ring-primary transition-all" type="checkbox"/>
</div>
<span class="font-body-md text-body-md text-on-surface-variant group-hover:text-on-surface transition-colors">Remember me</span>
</label>
<a class="font-body-md text-body-md text-primary hover:underline transition-all" href="#">Forgot password?</a>
</div>
<button class="w-full bg-primary text-on-primary font-headline-md text-headline-md py-md rounded-lg hover:shadow-lg hover:brightness-110 active:scale-95 transition-all duration-200" type="submit">
                            Sign In
                        </button>
</form>
<!-- Footer Link -->
<div class="text-center pt-md">
<p class="font-body-md text-body-md text-on-surface-variant">
                            Don't have an account? 
                            <a class="text-primary font-bold hover:underline ml-xs" href="#">Sign Up</a>
</p>
</div>
</div>
</div>
</div>
</main>
<!-- Footer (Shared Component Reference) -->
<footer class="w-full py-lg mt-auto bg-surface-container-lowest dark:bg-inverse-surface border-t border-outline-variant dark:border-on-surface-variant">
<div class="grid grid-cols-1 md:grid-cols-2 gap-md px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto">
<div class="flex flex-col gap-xs">
<span class="font-headline-md text-headline-md text-primary">Fit &amp; Fuel AI</span>
<p class="font-caption text-caption text-secondary dark:text-secondary-fixed">© 2024 Fit &amp; Fuel AI Coach. Performance &amp; Nutrition Analytics.</p>
</div>
<div class="flex flex-wrap items-center gap-md md:justify-end">
<a class="font-caption text-caption text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed transition-all duration-200" href="#">Privacy Policy</a>
<a class="font-caption text-caption text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed transition-all duration-200" href="#">Terms of Service</a>
<a class="font-caption text-caption text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed transition-all duration-200" href="#">Athlete Portal</a>
</div>
</div>
</footer>
<script>
        // Micro-interaction for form inputs
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.parentElement.classList.add('scale-[1.01]');
                input.parentElement.parentElement.style.transition = 'all 0.2s ease-out';
            });
            input.addEventListener('blur', () => {
                input.parentElement.parentElement.classList.remove('scale-[1.01]');
            });
        });

        // Simple button active state reinforcement
        const buttons = document.querySelectorAll('button');
        buttons.forEach(btn => {
            btn.addEventListener('mousedown', () => btn.classList.add('opacity-80'));
            btn.addEventListener('mouseup', () => btn.classList.remove('opacity-80'));
            btn.addEventListener('mouseleave', () => btn.classList.remove('opacity-80'));
        });
    </script>
</body></html>