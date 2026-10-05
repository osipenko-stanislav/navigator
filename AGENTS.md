# Project conventions

## SVG icons

- Every outlined SVG icon must use an explicit `stroke-width="1.5"` on every stroked shape.
- Preserve this stroke width when adding, replacing, or exporting icons.
- This rule applies to UI icons. Logos, masks, filled icons, and decorative illustrations are excluded unless explicitly requested.

## Shared controls

- Build every interactive control through the shared factories in `components/controls.js`.
- Use `controlButton()` for buttons of every visual variant, including navigation, cards, tabs, dialog actions, and icon buttons.
- Use `checkboxControl()` for every checkbox and preserve the shared 24×24 wrapper, the centered 20×20 visual box, and the centered 16×16 check icon.
- Use `fieldControl()` for text inputs and selects so normal, focus, error, and disabled states remain consistent.
- Extend a shared factory when a new control state is needed; do not duplicate raw button, checkbox, input, or select markup in screen templates.
- Use 14px/20px for all body, label, helper, field, dialog-description, and card-copy text across the product. Reserve larger sizes for headings and numeric display values.

## Page transitions

- Always use the shared page-background fade when navigating between screens in either direction.
- Fade the current screen into the page background `#F4F4F5`, replace the content only while the overlay is fully opaque, then reveal the next screen.
- Apply the fade only to page content. Persistent desktop and mobile navigation must remain visible and stationary above the transition layer.
- Use `300ms ease-in-out` for each fade phase.
- Do not move, scale, slide, or independently animate page content during navigation.
- Respect `prefers-reduced-motion` by replacing the transition immediately.
- Modal and dialog animations are separate from page transitions.

## Persistent interface

- Keep the `informer-footer` chat-assistant button mounted on every screen.
- Position it at the bottom-right using the library component geometry and keep it on the same z-index layer as navigation.
- Page-transition overlays must remain below both navigation and `informer-footer`.

## Form validation

- Keep a 20px vertical gap between adjacent fields in every form.
- Use the shared `goal-dialog--sm` size (440px) for simple deletion and reset confirmations.
- Never use the browser's native validation UI or system validation bubbles.
- Add `novalidate` to forms and implement validation using the matching design-system input component states.
- Error states must reproduce the component's border, background, message typography, spacing, and accessibility attributes.
- Validate on submit, focus the first invalid control, and clear or update its error state as the user corrects the value.
- Disabled fields must not be treated as invalid.

## Goal-setting forms

- Use the shared `surveyCompleteTemplate()` screen after successful completion of every goal-setting flow, regardless of the selected goal or form variant.
- Show the job-expectations second step only for `first-job`, `freelance`, `change-company`, and `change-specialty`; all other goal flows finish after the first form step.
- Mark the final form in a goal-setting flow with `data-goal-form-final`; after successful component validation, submit it through the shared page-background transition to `surveyCompleteTemplate()`.
- Intermediate forms may use `data-goal-form`, but must continue to the next step instead of showing success early.
- Do not create goal-specific success screens unless the user explicitly replaces this rule.
- A student can keep at most two goals. Persist selected goal IDs between route entries and enforce the limit both when choosing and when rendering goals.
- Allow no more than one saved goal per track: one Industry goal and one Study goal.
- Keep the `+ Цель` button enabled at the two-goal limit. At the limit, clicking it must open a warning that one current goal needs to be deleted before adding another.
- Render only goals the student has actually added; one saved goal produces one goal card, and two saved goals produce two cards.
- Every newly added goal starts at `0%` and `0 / 5 этапов завершено`.
- Industry selections render an Industry goal card; Study selections render a Study goal card.
- The Study goal opens `/study-goal/`. Its progress is derived from completed checklist tasks, and an entire stage counts as complete only when all of its tasks are checked.
- Open the Study goal on its `Моя цель` tab by default; other tabs open only after an explicit tab selection.
- Study-detail tabs use one animated sliding background indicator and remain keyboard-accessible.

## Study planner

- Treat `roadmap.cu3rd.ru/planner` only as a behavior reference; never copy its visual language.
- Keep the planner inside the existing Study goal tab and compose it from subscribed OTUS/Figma components.
- Use `education-card` for course items, `input-search` for course search, `chip-filled` for multi-select course filters, the shared toggle, progress bar, flat button, and dialog patterns for their matching roles.
- Match the Study planner island geometry to the Study goal tab: 4px shell gaps, white nested surfaces, and the same 24/32px content rhythm.
- Render added course cards as white outline cards, never gray filled cards.
- Reuse the same outlined course-card geometry in search results; place the compact flat `Добавить` action in the card footer.
- Course cards use the same purple-tinted hover, inset outline, soft shadow, and pressed scale as goal-selection cards.
- Move and reorder courses only with drag-and-drop between semester islands, and allow dragging search-result courses from the available group into any eligible semester. Do not render arrow buttons for course transfer or ordering.
- Implement course drag-and-drop with pointer events and a movement threshold; do not rely on native HTML `draggable` for cards containing interactive controls.
- Exclude footer gestures on the checkbox and card actions from drag start. Preserve the `Alt` + arrow-key fallback for keyboard users.
- Mandatory courses cannot be removed, but they can be dragged to another semester where the course is available.
- Semester islands expand and collapse with the same chevron and reveal pattern as Study goal stages.
- Course details open in the subscribed `OTUS | Component → side-sheet` drawer and follow that component's geometry and motion.
- Do not invent missing components or icons. Ask the user to add the required Figma instance when the subscribed libraries do not contain it.
- The prototype is local-only: persist the semester plan in `localStorage` and simulate trajectory generation without APIs or authentication.
- Support eight semesters, course add/remove/move/reorder, completion, search, filters, workload totals, prerequisite conflicts, per-semester reset, full reset, and trajectory presets.

## Study catalog and glossary

- Keep Catalog and Glossary inside their existing Study goal tabs and match the Study goal island geometry.
- Catalog filters use `input-search` and multi-select `chip-filled` controls for available semesters, course types, and weekly workload.
- Catalog course cards remain white outline cards and show category, workload, available semesters, prerequisite count, plan status, description, and a clear details affordance.
- A catalog card opens the shared course side-sheet. Unplanned courses can be added to any eligible semester from that side-sheet.
- Glossary terms use the same expandable island and chevron pattern as Study goal stages, with no more than one term expanded at a time.

## Client-side routes

- Every screen in the goal-setting flow must have its own URL path and physical static entry point so direct links, refreshes, and browser history work without a server fallback.
- Use `/goals/`, `/work-experience/`, `/job-expectations/`, `/success/`, `/my-goals/`, `/study-goal/`, and `/profile/` for the current flow.
- Navigate through the shared `renderScreen()` function so page transitions remain consistent.
- Browser back and forward navigation must render through the same page-background fade while persistent navigation remains visible.
