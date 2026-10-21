# Visual source

The layout and decorative vector assets were matched to the owner-supplied
`Desktop - 45.svg` (1440 × 7509). Its actual page frame is at (70, 139),
1299.7 pixels wide: desktop spacing is normalized to the site's 1440-pixel canvas.

The wordmark and five feature illustrations in `assets/icons/` are isolated
vector artwork from that reference. All page headings and copy remain semantic
HTML. The hero background is a 1440 × 854 WebP export of the reference's background
layers; the foreground shutters animate with CSS transforms and opacity only.
Animation ends within three seconds and respects `prefers-reduced-motion`.

Desktop headings keep the reference's natural letter spacing. Negative tracking
was narrowing the hero title by roughly 36 pixels at a 1440-pixel viewport;
compact tracking is retained only in the mobile layout. The desktop navigation
is centered on the page, independently of the two different-width side controls.

Sections reveal once with a short opacity/translation transition. This is a
progressive enhancement: the HTML is always visible before JavaScript starts,
when IntersectionObserver is unavailable, and with JavaScript disabled. The
hero heading never animates, so its visibility and LCP do not wait for motion.
Keyboard focus cancels an active reveal, and changing the reduced-motion
preference immediately cancels all pending reveals. Hover effects are limited
to fine pointers; no cards become misleading links or extra keyboard stops.
The carousel also supports ArrowLeft/ArrowRight, Home and End without autoplay.

WOFF2 fonts retain Latin, Cyrillic, common punctuation, ruble and arrow glyphs.
The original TTF files remain available for the separate legal-page stylesheet.
