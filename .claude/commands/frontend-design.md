You are about to make a visual change to the website. Follow these steps before writing any code:

## 1. Check Brand Assets
- Look inside `brand_assets/` for logos, color palettes, and style guides.
- Use real assets where available — no placeholders when the real thing exists.

## 2. Design Guardrails (apply to every visual change)

**Colors:** Never use default Tailwind palette (indigo-500, blue-600, etc.). Use the established brand color and derive from it.

**Shadows:** Never flat `shadow-md`. Use layered, color-tinted shadows with low opacity.

**Typography:** Headings and body must use different font families. Apply tight tracking (`-0.03em`) on large headings, generous line-height (`1.7`) on body.

**Gradients:** Layer multiple radial gradients. Add grain/texture via SVG noise filter for depth.

**Animations:** Only animate `transform` and `opacity`. Never `transition-all`. Use spring-style easing.

**Interactive states:** Every clickable element needs hover, focus-visible, and active states. No exceptions.

**Images:** Add a gradient overlay (`bg-gradient-to-t from-black/60`) and a color treatment layer with `mix-blend-multiply`.

**Spacing:** Use intentional, consistent spacing tokens — not random Tailwind steps.

**Depth:** Surfaces must have a layering system (base → elevated → floating).

## 3. Screenshots
- Only take screenshots and do visual comparison if the user explicitly asks for it.
- If asked: serve via `node serve.mjs`, screenshot via `node screenshot.mjs http://localhost:3000`, then read the PNG and compare.
