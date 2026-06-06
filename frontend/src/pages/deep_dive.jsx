<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Session Review | Fit &amp; Fuel AI</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&amp;family=Inter:wght@400;500;600&amp;family=JetBrains+Mono:wght@500&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "primary-fixed-dim": "#b3c5ff",
                        "on-error-container": "#93000a",
                        "primary-fixed": "#dae1ff",
                        "on-primary-fixed": "#001849",
                        "on-tertiary-fixed-variant": "#783200",
                        "on-surface": "#0b1c30",
                        "on-tertiary-container": "#fff6f3",
                        "surface-container": "#e5eeff",
                        "inverse-primary": "#b3c5ff",
                        "outline": "#727687",
                        "on-primary": "#ffffff",
                        "on-background": "#0b1c30",
                        "surface-variant": "#d3e4fe",
                        "secondary": "#006c49",
                        "primary-container": "#0066ff",
                        "on-error": "#ffffff",
                        "tertiary-fixed": "#ffdbca",
                        "error": "#ba1a1a",
                        "outline-variant": "#c2c6d8",
                        "surface-dim": "#cbdbf5",
                        "error-container": "#ffdad6",
                        "surface": "#f8f9ff",
                        "primary": "#0050cb",
                        "on-secondary-container": "#00714d",
                        "on-primary-fixed-variant": "#003fa4",
                        "inverse-surface": "#213145",
                        "surface-container-high": "#dce9ff",
                        "on-tertiary": "#ffffff",
                        "tertiary-fixed-dim": "#ffb690",
                        "secondary-container": "#6cf8bb",
                        "on-surface-variant": "#424656",
                        "tertiary": "#954000",
                        "tertiary-container": "#bc5200",
                        "surface-container-low": "#eff4ff",
                        "secondary-fixed-dim": "#4edea3",
                        "on-primary-container": "#f8f7ff",
                        "surface-container-lowest": "#ffffff",
                        "surface-container-highest": "#d3e4fe",
                        "on-secondary-fixed": "#002113",
                        "secondary-fixed": "#6ffbbe",
                        "inverse-on-surface": "#eaf1ff",
                        "surface-tint": "#0054d6",
                        "background": "#f8f9ff",
                        "surface-bright": "#f8f9ff",
                        "on-secondary-fixed-variant": "#005236",
                        "on-tertiary-fixed": "#341100",
                        "on-secondary": "#ffffff"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "lg": "40px",
                        "gutter": "16px",
                        "xs": "4px",
                        "xl": "64px",
                        "sm": "12px",
                        "margin-desktop": "32px",
                        "md": "24px",
                        "margin-mobile": "16px",
                        "base": "8px"
                    },
                    "fontFamily": {
                        "headline-md": ["Montserrat"],
                        "display-lg": ["Montserrat"],
                        "caption": ["Inter"],
                        "body-md": ["Inter"],
                        "data-label": ["JetBrains Mono"],
                        "body-lg": ["Inter"],
                        "display-lg-mobile": ["Montserrat"]
                    },
                    "fontSize": {
                        "headline-md": ["24px", {"lineHeight": "32px", "fontWeight": "600"}],
                        "display-lg": ["48px", {"lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
                        "caption": ["12px", {"lineHeight": "16px", "fontWeight": "500"}],
                        "body-md": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
                        "data-label": ["14px", {"lineHeight": "20px", "letterSpacing": "0.05em", "fontWeight": "500"}],
                        "body-lg": ["18px", {"lineHeight": "28px", "fontWeight": "400"}],
                        "display-lg-mobile": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.02em", "fontWeight": "700"}]
                    }
                },
            },
        }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .glass-overlay {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .skeleton-line {
            stroke: #6cf8bb; /* secondary-container / safety green */
            stroke-width: 2;
        }
        .skeleton-joint {
            fill: #ffffff;
            stroke: #0066ff; /* primary-container / action blue */
            stroke-width: 2;
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #c2c6d8; border-radius: 10px; }
    </style>
</head>
<body class="bg-background text-on-background font-body-md selection:bg-primary-container selection:text-on-primary-container">
<div class="flex min-h-screen">
<!-- Sidebar Navigation -->
<aside class="hidden md:flex flex-col h-screen w-64 left-0 sticky bg-surface-container-lowest border-r border-outline-variant p-md space-y-base z-50">
<div class="flex items-center gap-3 px-2 mb-8">
<div class="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center text-on-primary-container">
<span class="material-symbols-outlined">fitness_center</span>
</div>
<div>
<h1 class="font-headline-md text-headline-md font-semibold text-primary">Fit &amp; Fuel AI</h1>
<p class="text-caption font-caption text-on-surface-variant uppercase tracking-wider">Elite Coaching</p>
</div>
</div>
<nav class="flex-1 space-y-2">
<a class="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all active:translate-x-1 duration-200" href="#">
<span class="material-symbols-outlined">dashboard</span>
<span class="font-body-md">Dashboard</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all active:translate-x-1 duration-200" href="#">
<span class="material-symbols-outlined">fitness_center</span>
<span class="font-body-md">Library</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 bg-primary-container text-on-primary-container rounded-lg font-bold transition-all active:translate-x-1 duration-200" href="#">
<span class="material-symbols-outlined">history</span>
<span class="font-body-md">History</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all active:translate-x-1 duration-200" href="#">
<span class="material-symbols-outlined">person</span>
<span class="font-body-md">Profile</span>
</a>
</nav>
<div class="pt-base border-t border-outline-variant">
<div class="flex items-center gap-3 p-2">
<img alt="User profile avatar" class="w-10 h-10 rounded-full border border-outline-variant" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCv8X0l8ZVFRQyAKVRtiLiw33GCiF_d1LVPASrkVnx4OYU23a4lNzDejko5JqN5MHSGbYx9Pv0Z9ybRIVc4pK75m36t_38OGUkLg0uAEfdWMyb7SkckFze4nwmMbqZg_7NEaP2AsCE01WYerS5WzbQdzeApx1dpT2c3_SPU-vv4-NWonAKKbH4c1InkhU4-Se6lj24S3DcaR9XxXCu7sYq3qSE_7fNgQ_BtmYuGi2kqB-1OJy9B5H3AIULrswHnugN-D3FjgLD_5RY"/>
<div class="overflow-hidden">
<p class="text-sm font-bold truncate">Alex Johnson</p>
<p class="text-xs text-on-surface-variant">Pro Athlete</p>
</div>
</div>
</div>
</aside>
<!-- Main Content Area -->
<main class="flex-1 flex flex-col h-screen overflow-hidden">
<!-- Header -->
<header class="w-full top-0 sticky bg-surface border-b border-outline-variant flex justify-between items-center px-margin-desktop py-sm z-40">
<div class="flex items-center gap-4">
<button class="md:hidden p-2 hover:bg-surface-container-low rounded-full">
<span class="material-symbols-outlined">menu</span>
</button>
<div class="flex flex-col">
<h2 class="font-headline-md text-headline-md text-primary">Session Deep-Dive</h2>
<div class="flex items-center gap-2 text-on-surface-variant">
<span class="text-sm font-data-label">03 Oct 2023</span>
<span class="w-1 h-1 bg-outline rounded-full"></span>
<span class="text-sm font-data-label">Barbell Back Squat</span>
</div>
</div>
</div>
<div class="flex items-center gap-base">
<button class="flex items-center gap-2 bg-primary-container text-on-primary-container px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity active:scale-95">
<span class="material-symbols-outlined">share</span>
<span>Export Report</span>
</button>
<button class="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors active:scale-95">
<span class="material-symbols-outlined">notifications</span>
</button>
</div>
</header>
<!-- Dashboard Layout -->
<div class="flex-1 flex flex-col md:flex-row overflow-hidden">
<!-- Left Panel: Video & Timeline -->
<section class="flex-1 flex flex-col p-md space-y-md bg-surface overflow-y-auto md:overflow-hidden">
<!-- Video Player Container -->
<div class="relative flex-1 bg-black rounded-xl overflow-hidden shadow-sm group">
<img class="w-full h-full object-cover opacity-80" data-alt="A focused male athlete performing a heavy barbell back squat in a high-tech gym environment. The scene is captured in a clinical, brightly lit space with slate grey walls and blue-accented gym equipment. Overlaid on the athlete is a digital skeleton tracking his movement with teal lines connecting joints, showcasing advanced biometrics in a professional sports science setting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUqypNeqsgIfMYqAtMf2-dDpwMDx3gLqDmDunt1-hATn9aWK8eEoha5KJROd0FpuuqUO91JqC7YqVtvCmVeMBOqakVhL6vddC6WDdxHgmP1TAZAXerQVvg67ptRPJyN1M2_H4MJc3c4Mz_2y7T7MFZaxLzdQ-lUW2obFHj5Ucj-XAzlcCuxKqgrsirgkfGwUq3ZBcbpPR8j7hzxsefJC7hTJV7JLJDCM-Ln8mUCFHLiVjCrbHV0dTIWLljc5IZNHLGKWG5gwYQ2K8"/>
<!-- SVG Skeleton Overlay -->
<svg class="absolute inset-0 w-full h-full pointer-events-none" viewbox="0 0 1000 600">
<!-- Example skeleton for a squat pose -->
<line class="skeleton-line" x1="500" x2="500" y1="150" y2="250"></line> <!-- Torso -->
<line class="skeleton-line" x1="500" x2="420" y1="250" y2="350"></line> <!-- Left Thigh -->
<line class="skeleton-line" x1="500" x2="580" y1="250" y2="350"></line> <!-- Right Thigh -->
<line class="skeleton-line" style="stroke: #ba1a1a;" x1="420" x2="430" y1="350" y2="480"></line> <!-- Left Calf - Warning State -->
<line class="skeleton-line" x1="580" x2="570" y1="350" y2="480"></line> <!-- Right Calf -->
<!-- Joints -->
<circle class="skeleton-joint" cx="500" cy="150" r="6"></circle> <!-- Neck -->
<circle class="skeleton-joint" cx="500" cy="250" r="6"></circle> <!-- Hips -->
<circle class="skeleton-joint" cx="420" cy="350" r="6"></circle> <!-- Left Knee -->
<circle class="skeleton-joint" cx="580" cy="350" r="6"></circle> <!-- Right Knee -->
</svg>
<!-- HUD Overlays -->
<div class="absolute top-4 right-4 glass-overlay px-4 py-2 rounded-lg flex flex-col gap-1">
<span class="text-caption font-data-label text-on-surface-variant uppercase">Real-time Knee Angle</span>
<span class="text-xl font-bold font-display-lg text-primary">84.2°</span>
</div>
<div class="absolute bottom-4 left-4 glass-overlay px-4 py-2 rounded-lg flex items-center gap-4">
<button class="w-10 h-10 bg-primary text-on-primary rounded-full flex items-center justify-center">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">play_arrow</span>
</button>
<div class="flex flex-col">
<span class="text-xs font-data-label text-on-surface-variant">TIMECODE</span>
<span class="text-sm font-bold">00:02.4 / 00:45.0</span>
</div>
</div>
</div>
<!-- Timeline Scrubber -->
<div class="h-24 bg-surface-container-lowest rounded-xl border border-outline-variant p-4 flex flex-col justify-between">
<div class="flex justify-between items-center mb-1">
<span class="text-caption font-data-label text-on-surface-variant">REPETITION TIMELINE</span>
<div class="flex gap-2">
<div class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-secondary"></span> <span class="text-[10px] uppercase">Optimal</span></div>
<div class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-tertiary"></span> <span class="text-[10px] uppercase">Deviation</span></div>
<div class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-error"></span> <span class="text-[10px] uppercase">Alert</span></div>
</div>
</div>
<div class="relative w-full h-8 bg-surface-container-high rounded-full flex items-center overflow-hidden">
<!-- Timeline Regions -->
<div class="absolute h-full bg-secondary opacity-30 left-0 w-[15%]"></div>
<div class="absolute h-full bg-tertiary opacity-40 left-[15%] w-[10%]"></div>
<div class="absolute h-full bg-secondary opacity-30 left-[25%] w-[40%]"></div>
<div class="absolute h-full bg-error opacity-40 left-[65%] w-[5%]"></div> <!-- Deviation marker at 2.4s -->
<div class="absolute h-full bg-secondary opacity-30 left-[70%] w-[30%]"></div>
<!-- Scrubber Thumb -->
<div class="absolute h-full w-1 bg-primary left-[65%] z-10 shadow-[0_0_8px_rgba(0,80,203,0.5)]">
<div class="absolute -top-1 -translate-x-1/2 left-1/2 w-3 h-3 bg-primary rounded-full"></div>
</div>
</div>
<div class="flex justify-between px-2 text-[10px] font-data-label text-on-surface-variant">
<span>0s</span>
<span>10s</span>
<span>20s</span>
<span>30s</span>
<span>40s</span>
</div>
</div>
</section>
<!-- Right Panel: Data & Biometrics -->
<aside class="w-full md:w-96 border-l border-outline-variant bg-surface-container-low flex flex-col p-md space-y-md overflow-y-auto">
<!-- Performance Overview -->
<div class="grid grid-cols-2 gap-md">
<div class="bg-surface-container-lowest p-md rounded-xl border border-outline-variant flex flex-col items-center">
<span class="text-caption font-caption text-on-surface-variant uppercase mb-2">Form Score</span>
<div class="relative w-20 h-20 flex items-center justify-center">
<svg class="w-full h-full -rotate-90">
<circle class="text-surface-container-high" cx="40" cy="40" fill="transparent" r="34" stroke="currentColor" stroke-width="6"></circle>
<circle class="text-primary" cx="40" cy="40" fill="transparent" r="34" stroke="currentColor" stroke-dasharray="213.6" stroke-dashoffset="38.4" stroke-width="6"></circle>
</svg>
<span class="absolute text-xl font-bold font-display-lg">82</span>
</div>
</div>
<div class="bg-surface-container-lowest p-md rounded-xl border border-outline-variant flex flex-col items-center justify-center">
<span class="text-caption font-caption text-on-surface-variant uppercase mb-2">Risk Level</span>
<span class="text-tertiary font-bold font-headline-md">MODERATE</span>
<span class="text-[10px] text-on-surface-variant mt-1">Slight Valgus Detected</span>
</div>
</div>
<!-- AI Feedback Card -->
<div class="bg-primary-container text-on-primary-container p-md rounded-xl shadow-md">
<div class="flex items-center gap-2 mb-3">
<span class="material-symbols-outlined text-secondary-container">psychology</span>
<h3 class="font-bold text-sm uppercase tracking-wider">AI Frame Analysis</h3>
</div>
<p class="text-sm leading-relaxed mb-4">
                            "Knee tracking shows medial collapse (Valgus) during the ascent phase at <strong class="font-data-label">2.4s</strong>. Focus on pushing knees outward to maintain lateral stability."
                        </p>
<div class="bg-on-primary-container/10 p-sm rounded-lg flex items-center gap-3">
<span class="material-symbols-outlined text-sm">lightbulb</span>
<span class="text-xs">Cue: "Screw your feet into the floor."</span>
</div>
</div>
<!-- Biometric Details -->
<div class="space-y-sm">
<h4 class="text-caption font-caption text-on-surface-variant uppercase tracking-widest px-2">Joint Angle Analysis</h4>
<!-- Knee Flexion -->
<div class="bg-surface-container-lowest p-sm rounded-xl border border-outline-variant">
<div class="flex justify-between items-center mb-2">
<span class="text-sm font-medium">Knee Flexion (Max)</span>
<span class="text-sm font-bold text-primary font-data-label">112°</span>
</div>
<div class="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
<div class="h-full bg-secondary w-[85%]"></div>
</div>
<div class="flex justify-between mt-1 text-[10px] text-on-surface-variant font-data-label">
<span>0°</span>
<span>Target: 110-120°</span>
<span>180°</span>
</div>
</div>
<!-- Hip Hinge -->
<div class="bg-surface-container-lowest p-sm rounded-xl border border-outline-variant">
<div class="flex justify-between items-center mb-2">
<span class="text-sm font-medium">Hip Hinge Angle</span>
<span class="text-sm font-bold text-primary font-data-label">64°</span>
</div>
<div class="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
<div class="h-full bg-secondary w-[70%]"></div>
</div>
</div>
</div>
<!-- Symmetry Metrics -->
<div class="space-y-sm">
<h4 class="text-caption font-caption text-on-surface-variant uppercase tracking-widest px-2">Symmetry Metrics</h4>
<div class="bg-surface-container-lowest p-md rounded-xl border border-outline-variant relative">
<div class="flex justify-between mb-4">
<div class="text-center">
<span class="text-[10px] uppercase text-on-surface-variant block">Left</span>
<span class="font-bold text-lg font-data-label">48%</span>
</div>
<div class="text-center">
<span class="text-[10px] uppercase text-on-surface-variant block">Right</span>
<span class="font-bold text-lg font-data-label">52%</span>
</div>
</div>
<div class="w-full h-2 bg-surface-container-high rounded-full relative">
<div class="absolute top-0 bottom-0 left-1/2 w-0.5 bg-outline z-10"></div>
<div class="h-full bg-primary rounded-l-full w-[48%] ml-auto"></div>
<div class="h-full bg-primary-fixed-dim rounded-r-full w-[52%] mr-auto absolute top-0 left-1/2"></div>
</div>
<p class="text-[10px] text-center mt-3 text-on-surface-variant italic">Right-side dominant load shift detected</p>
</div>
</div>
<!-- Injury Risk Assessment -->
<div class="bg-error-container text-on-error-container p-md rounded-xl border border-error/20">
<div class="flex items-center gap-2 mb-2">
<span class="material-symbols-outlined">warning</span>
<h3 class="font-bold text-sm uppercase tracking-wider">Injury Risk Alert</h3>
</div>
<ul class="space-y-2">
<li class="flex gap-2 text-xs">
<span class="font-bold">•</span>
<span><strong>Knee Valgus:</strong> Detected at 2.4s and 18.1s. Potential ACL stress.</span>
</li>
<li class="flex gap-2 text-xs">
<span class="font-bold">•</span>
<span><strong>Lumbar Flexion:</strong> Minor "Butt Wink" at maximum depth.</span>
</li>
</ul>
</div>
</aside>
</div>
</main>
</div>
<!-- Mobile Navigation Bar -->
<nav class="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-outline-variant flex justify-around py-2 z-50">
<button class="flex flex-col items-center p-2 text-on-surface-variant">
<span class="material-symbols-outlined">dashboard</span>
<span class="text-[10px]">Home</span>
</button>
<button class="flex flex-col items-center p-2 text-on-surface-variant">
<span class="material-symbols-outlined">fitness_center</span>
<span class="text-[10px]">Workouts</span>
</button>
<button class="flex flex-col items-center p-2 text-primary">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">history</span>
<span class="text-[10px] font-bold">History</span>
</button>
<button class="flex flex-col items-center p-2 text-on-surface-variant">
<span class="material-symbols-outlined">person</span>
<span class="text-[10px]">Profile</span>
</button>
</nav>
<script>
        // Simple micro-interaction for the timeline
        const scrubber = document.querySelector('.absolute.h-full.w-1.bg-primary');
        let isDragging = false;

        if (scrubber) {
            scrubber.addEventListener('mousedown', () => isDragging = true);
            window.addEventListener('mouseup', () => isDragging = false);
            
            window.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    const timeline = scrubber.parentElement;
                    const rect = timeline.getBoundingClientRect();
                    let x = e.clientX - rect.left;
                    let percentage = (x / rect.width) * 100;
                    percentage = Math.max(0, Math.min(100, percentage));
                    scrubber.style.left = percentage + '%';
                }
            });
        }

        // Pulse effect for the error warning
        setInterval(() => {
            const warning = document.querySelector('.bg-error-container');
            if (warning) {
                warning.style.opacity = '0.9';
                setTimeout(() => warning.style.opacity = '1', 500);
            }
        }, 2000);
    </script>
</body></html>