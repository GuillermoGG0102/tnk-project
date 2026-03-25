Update the measurement plan for the change just made:

1. Update `measurement_plan/measurement_plan.html` and the relevant CSV in `measurement_plan/` to reflect the new event or parameter.
   - CSV map: page_view→tab3, select_content→tab4, generate_lead→tab5, orbit_interaction→tab6, search→tab7, post_engagement→tab8
   - If this is a significant change (new event, renamed event, new parameter), archive the current file first:
     - Copy to `measurement_plan/archive/measurement_plan_vN.html` (increment N from the latest archive)
     - Increment the version badge in the header of `measurement_plan.html`
     - Add a changelog entry to the Version History tab (date, version, summary)

2. Run `node capture_measurement.mjs` to refresh affected screenshots.

3. Run `node build_standalone_measurement.mjs` to regenerate the standalone file.
