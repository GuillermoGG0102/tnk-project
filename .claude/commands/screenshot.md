Take a screenshot of the current localhost site and analyze it:

1. Check if the server is running: `lsof -i :3000 | grep LISTEN`
   - If no output: start it in the background with `node serve.mjs`
   - If already running: skip this step

2. Run: `node screenshot.mjs http://localhost:3000`
   - To add a label: `node screenshot.mjs http://localhost:3000 <label>`

3. Read the saved PNG from `temporary screenshots/` using the Read tool and analyze it visually.
   - Check: spacing/padding, font size/weight, colors (exact hex), alignment, border-radius, shadows, image sizing
   - If comparing against a reference: be specific about any differences found
