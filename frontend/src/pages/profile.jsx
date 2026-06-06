<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&amp;family=Inter:wght@400;500&amp;family=JetBrains+Mono:wght@500&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "surface-container": "#e5eeff",
                    "on-tertiary": "#ffffff",
                    "outline-variant": "#c2c6d8",
                    "on-tertiary-fixed": "#341100",
                    "primary-fixed-dim": "#b3c5ff",
                    "surface-tint": "#0054d6",
                    "tertiary": "#954000",
                    "on-primary-container": "#f8f7ff",
                    "primary-container": "#0066ff",
                    "on-primary-fixed": "#001849",
                    "secondary-fixed": "#6ffbbe",
                    "on-secondary": "#ffffff",
                    "tertiary-container": "#bc5200",
                    "on-error-container": "#93000a",
                    "on-surface": "#0b1c30",
                    "inverse-surface": "#213145",
                    "surface-container-highest": "#d3e4fe",
                    "inverse-primary": "#b3c5ff",
                    "surface": "#f8f9ff",
                    "on-tertiary-fixed-variant": "#783200",
                    "inverse-on-surface": "#eaf1ff",
                    "primary": "#0050cb",
                    "on-secondary-container": "#00714d",
                    "surface-container-lowest": "#ffffff",
                    "on-surface-variant": "#424656",
                    "tertiary-fixed": "#ffdbca",
                    "error-container": "#ffdad6",
                    "outline": "#727687",
                    "tertiary-fixed-dim": "#ffb690",
                    "surface-container-high": "#dce9ff",
                    "surface-bright": "#f8f9ff",
                    "on-secondary-fixed": "#002113",
                    "on-background": "#0b1c30",
                    "surface-variant": "#d3e4fe",
                    "background": "#f8f9ff",
                    "surface-dim": "#cbdbf5",
                    "primary-fixed": "#dae1ff",
                    "secondary": "#006c49",
                    "on-primary-fixed-variant": "#003fa4",
                    "on-primary": "#ffffff",
                    "on-secondary-fixed-variant": "#005236",
                    "error": "#ba1a1a",
                    "surface-container-low": "#eff4ff",
                    "on-tertiary-container": "#fff6f3",
                    "secondary-container": "#6cf8bb",
                    "on-error": "#ffffff",
                    "secondary-fixed-dim": "#4edea3"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "spacing": {
                    "base": "8px",
                    "sm": "12px",
                    "xs": "4px",
                    "xl": "64px",
                    "gutter": "16px",
                    "margin-mobile": "16px",
                    "md": "24px",
                    "lg": "40px",
                    "margin-desktop": "32px"
            },
            "fontFamily": {
                    "body-lg": ["Inter"],
                    "headline-md": ["Montserrat"],
                    "display-lg": ["Montserrat"],
                    "display-lg-mobile": ["Montserrat"],
                    "caption": ["Inter"],
                    "body-md": ["Inter"],
                    "data-label": ["JetBrains Mono"]
            },
            "fontSize": {
                    "body-lg": ["18px", {"lineHeight": "28px", "fontWeight": "400"}],
                    "headline-md": ["24px", {"lineHeight": "32px", "fontWeight": "600"}],
                    "display-lg": ["48px", {"lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
                    "display-lg-mobile": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
                    "caption": ["12px", {"lineHeight": "16px", "fontWeight": "500"}],
                    "body-md": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
                    "data-label": ["14px", {"lineHeight": "20px", "letterSpacing": "0.05em", "fontWeight": "500"}]
            }
          },
        },
      }
    </script>
<style>
        .skeleton-line { stroke: #006c49; stroke-width: 2; }
        .skeleton-node { fill: #ffffff; stroke: #0050cb; stroke-width: 2; }
        .glass-hud {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.4);
        }
        @keyframes pulse-soft {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
        .live-indicator { animation: pulse-soft 2s infinite; }
    </style>
</head>
<body class="bg-background text-on-background font-body-md antialiased overflow-hidden">
<!-- Global Layout Wrapper -->
<div class="flex h-screen w-full">
<!-- Sidebar Navigation (Shared Component Logic) -->
<aside class="bg-surface border-r border-outline-variant h-screen w-64 fixed left-0 top-0 flex flex-col py-md px-gutter z-50">
<div class="mb-lg">
<h1 class="font-headline-md text-headline-md font-bold text-primary">Fit &amp; Fuel AI</h1>
<p class="font-body-md text-on-surface-variant opacity-70">Elite Performance</p>
</div>
<nav class="flex-1 space-y-2">
<div class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant">
<span class="material-symbols-outlined" data-icon="dashboard">dashboard</span>
<span class="font-body-md">Dashboard</span>
</div>
<div class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant">
<span class="material-symbols-outlined" data-icon="exercise">exercise</span>
<span class="font-body-md">Library</span>
</div>
<div class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant">
<span class="material-symbols-outlined" data-icon="history">history</span>
<span class="font-body-md">History</span>
</div>
<div class="flex items-center gap-3 px-4 py-3 rounded-lg text-primary font-bold border-r-4 border-primary bg-surface-container-low">
<span class="material-symbols-outlined" data-icon="person">person</span>
<span class="font-body-md">Profile</span>
</div>
</nav>
<button class="mt-auto w-full bg-primary text-on-primary py-3 rounded-lg font-bold hover:opacity-90 active:scale-95 transition-all">
                Start Workout
            </button>
</aside>
<!-- Main Content Canvas -->
<main class="ml-64 flex-1 flex flex-col relative h-full">
<!-- Top App Bar (Shared Component Logic) -->
<header class="flex justify-between items-center px-margin-desktop h-20 w-full bg-surface/80 backdrop-blur-md sticky top-0 z-40 border-b border-outline-variant">
<div class="flex items-center gap-4">
<div class="flex flex-col">
<span class="font-headline-md text-headline-md font-bold text-primary">Squat Technique Analysis</span>
<div class="flex items-center gap-2">
<span class="w-2 h-2 rounded-full bg-error live-indicator"></span>
<span class="font-data-label text-caption text-error uppercase">Live AI Session</span>
</div>
</div>
</div>
<div class="flex items-center gap-xl">
<div class="flex flex-col items-center">
<span class="font-data-label text-on-surface-variant text-caption uppercase">Session Timer</span>
<span class="font-headline-md text-primary font-bold">04:22.09</span>
</div>
<div class="flex items-center gap-md">
<span class="material-symbols-outlined text-on-surface-variant hover:text-primary transition-all cursor-pointer" data-icon="notifications">notifications</span>
<div class="w-10 h-10 rounded-full bg-surface-container border border-outline-variant overflow-hidden">
<img alt="User avatar" class="w-full h-full object-cover" data-alt="A clean, professional headshot of a male fitness trainer in his late 30s with short hair, wearing a high-performance athletic polo shirt. The background is a brightly lit, modern clinical gym environment with soft white lighting and cool-gray tones, conveying a sense of medical-tech professionalism and expertise in human performance." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfzmWdMbQ1-sOXKLWgqBs4olbPo3KJooXBEOmkv27FQ45AW_h2-5OCpnR_UD3xnVnDZga2J9w0ZTPEK6d8Qe36s8JlbetmxhJE3k0D5Hynw28NIQSOgPKfGyTDj58UQ2BUploZyMbQudOv5rWV2m8L1ZeDqppwqoqk-A2sUrMvhP3_6wWCYsfch0sAp2jON5_bWKJspyCYPaC-jvEfkxT532p-QeILTdMd5xIbCY9uEN3cF7VSuaBRmvmvNim8_hR5W6I8t47xglY"/>
</div>
</div>
</div>
</header>
<!-- Video Feed & Analysis Section -->
<section class="flex-1 flex overflow-hidden">
<!-- Camera Feed Area -->
<div class="flex-1 relative bg-inverse-surface group">
<img alt="Camera Feed" class="w-full h-full object-cover opacity-80" data-alt="A wide shot of a brightly lit, high-end private home gym with minimalist white walls and light wood flooring. A professional athlete is seen from the side performing a deep barbell back squat. The scene is illuminated by crisp, clinical daylight through floor-to-ceiling windows, highlighting anatomical precision and a high-performance tech-fitness aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHff9RUxQv9UEw394nldmeHVpy-qt4m27S3xg_CDXGJYChCTmzlyDQi5paMuN5hQoVCIuvWu5BGuEpgaOADsahxvUCfjuNo9TPJymSRYbeVMV4vy20GLaGirSnAh_pQ4PqtrCrMFP8KdwWNSPO3v75gokp9euSj2bvS2NBuDyPgVEbiwxtPeXLOobZuzCWUQq29rKMQbZG68jDTXg9XUtEAZP6L-WEGq1fWRk2ksiiRXIjE10ugVeveH3NjTxZ3Q-Lz-mGaaSgZQM"/>
<!-- SVG Skeleton Overlay -->
<svg class="absolute inset-0 w-full h-full pointer-events-none" viewbox="0 0 1000 1000">
<!-- Connecting Limbs (Simulated Skeleton) -->
<line class="skeleton-line" x1="500" x2="500" y1="200" y2="400"></line>
<line class="skeleton-line" x1="500" x2="450" y1="400" y2="600"></line>
<line class="skeleton-line" x1="500" x2="550" y1="400" y2="600"></line>
<line class="skeleton-line" style="stroke: #ba1a1a;" x1="450" x2="470" y1="600" y2="850"></line> <!-- Alert State -->
<line class="skeleton-line" style="stroke: #006c49;" x1="550" x2="530" y1="600" y2="850"></line> <!-- Correct State -->
<!-- Joint Nodes -->
<circle class="skeleton-node" cx="500" cy="200" r="6"></circle>
<circle class="skeleton-node" cx="500" cy="400" r="6"></circle>
<circle class="skeleton-node" cx="450" cy="600" r="6"></circle>
<circle class="skeleton-node" cx="550" cy="600" r="6"></circle>
<circle class="skeleton-node" cx="470" cy="850" r="6"></circle>
<circle class="skeleton-node" cx="530" cy="850" r="6"></circle>
</svg>
<!-- HUD Overlays (Glassmorphism) -->
<div class="absolute top-margin-desktop left-margin-desktop space-y-4">
<div class="glass-hud p-md rounded-xl flex items-center gap-md">
<div class="w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center">
<span class="font-data-label text-primary font-bold">85%</span>
</div>
<div>
<p class="font-caption text-on-surface-variant uppercase tracking-wider">Vertical Alignment</p>
<p class="font-body-md font-bold text-on-surface">Optimal Range</p>
</div>
</div>
<div class="glass-hud p-md rounded-xl">
<p class="font-caption text-on-surface-variant uppercase tracking-wider mb-1">Depth Detection</p>
<div class="w-48 h-2 bg-surface-container rounded-full overflow-hidden">
<div class="bg-secondary h-full w-[92%]"></div>
</div>
<p class="font-data-label text-secondary mt-2">PARALLEL ACHIEVED</p>
</div>
</div>
<div class="absolute bottom-margin-desktop left-1/2 -translate-x-1/2 flex gap-md">
<button class="glass-hud px-lg py-sm rounded-full flex items-center gap-2 hover:bg-white transition-all">
<span class="material-symbols-outlined" data-icon="video_settings">video_settings</span>
<span class="font-body-md font-bold">Calibration</span>
</button>
<button class="bg-error text-on-error px-lg py-sm rounded-full flex items-center gap-2 hover:opacity-90 transition-all">
<span class="material-symbols-outlined" data-icon="stop_circle">stop_circle</span>
<span class="font-body-md font-bold">End Session</span>
</button>
</div>
</div>
<!-- Right Sidebar: Feedback & Stats -->
<aside class="w-96 bg-surface border-l border-outline-variant flex flex-col p-md overflow-y-auto">
<!-- Form Score Gauge -->
<div class="bg-surface-container-low p-md rounded-xl mb-md border border-outline-variant/30 text-center">
<p class="font-caption text-on-surface-variant uppercase tracking-widest mb-4">Real-Time Form Score</p>
<div class="relative inline-flex items-center justify-center">
<svg class="w-32 h-32 transform -rotate-90">
<circle class="text-surface-container-high" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" stroke-width="8"></circle>
<circle class="text-primary transition-all duration-500" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" stroke-dasharray="364.4" stroke-dashoffset="43.7" stroke-width="8"></circle>
</svg>
<span class="absolute font-display-lg text-primary text-3xl">88</span>
</div>
<p class="font-body-md text-secondary font-bold mt-2">Excellent Technique</p>
</div>
<!-- Injury Risk Detection -->
<div class="bg-surface-container-low p-md rounded-xl mb-md border border-outline-variant/30">
<div class="flex justify-between items-center mb-4">
<p class="font-caption text-on-surface-variant uppercase tracking-widest">Injury Risk</p>
<span class="px-2 py-1 bg-secondary-container text-on-secondary-container rounded text-[10px] font-bold uppercase tracking-tighter">Verified</span>
</div>
<div class="flex items-center gap-4">
<div class="flex-1 h-2 bg-surface-container rounded-full overflow-hidden flex">
<div class="bg-secondary h-full flex-1"></div>
<div class="bg-surface-container h-full flex-1"></div>
<div class="bg-surface-container h-full flex-1"></div>
</div>
<span class="font-data-label text-secondary font-bold">LOW</span>
</div>
<p class="font-caption text-on-surface-variant mt-3 italic">Kinematic alignment within safe parameters.</p>
</div>
<!-- Real-Time Feedback Feed -->
<div class="flex-1 flex flex-col">
<p class="font-caption text-on-surface-variant uppercase tracking-widest mb-4">AI Feedback</p>
<div class="space-y-4">
<div class="p-sm bg-secondary-container/20 border-l-4 border-secondary rounded-r-lg flex gap-3">
<span class="material-symbols-outlined text-secondary" data-icon="check_circle">check_circle</span>
<div>
<p class="font-body-md font-bold text-on-secondary-container">Good depth!</p>
<p class="font-caption text-on-surface-variant">Hip crease passed knee line perfectly.</p>
</div>
</div>
<div class="p-sm bg-tertiary-container/10 border-l-4 border-tertiary rounded-r-lg flex gap-3">
<span class="material-symbols-outlined text-tertiary" data-icon="warning">warning</span>
<div>
<p class="font-body-md font-bold text-tertiary">Straighten your back</p>
<p class="font-caption text-on-surface-variant">Lumbar rounding detected at the bottom.</p>
</div>
</div>
<div class="p-sm bg-secondary-container/20 border-l-4 border-secondary rounded-r-lg flex gap-3">
<span class="material-symbols-outlined text-secondary" data-icon="check_circle">check_circle</span>
<div>
<p class="font-body-md font-bold text-on-secondary-container">Knee tracking optimal</p>
<p class="font-caption text-on-surface-variant">No lateral deviation in ascent.</p>
</div>
</div>
<div class="p-sm bg-surface-container/30 border-l-4 border-outline rounded-r-lg flex gap-3 opacity-60">
<span class="material-symbols-outlined text-outline" data-icon="info">info</span>
<div>
<p class="font-body-md font-bold text-on-surface-variant">Stance width calibrated</p>
<p class="font-caption text-on-surface-variant">12.4 inches wide.</p>
</div>
</div>
</div>
</div>
<!-- CTA / Action Area -->
<div class="mt-md pt-md border-t border-outline-variant">
<button class="w-full bg-secondary text-on-secondary py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all">
<span class="material-symbols-outlined" data-icon="bolt">bolt</span>
                            Analyze Last Set
                        </button>
</div>
</aside>
</section>
</main>
</div>
<script>
        // Micro-interaction for feedback feed - simple fade-in simulation
        const feedbackItems = document.querySelectorAll('.space-y-4 > div');
        feedbackItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(10px)';
            item.style.transition = `all 0.5s ease ${index * 0.15}s`;
            
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 100);
        });

        // Skeleton dynamic flicker simulation for "Tech" feel
        setInterval(() => {
            const nodes = document.querySelectorAll('.skeleton-node');
            nodes.forEach(node => {
                if(Math.random() > 0.8) {
                    node.style.opacity = '0.5';
                    setTimeout(() => node.style.opacity = '1', 50);
                }
            });
        }, 1000);
    </script>
</body></html>