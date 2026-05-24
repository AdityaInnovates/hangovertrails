# UI Component Guidelines

All public, auth, and admin screens use the same core tokens and component states.

- Components must expose explicit `variant`, `size`, `disabled`, and `loading` states where relevant.
- Form controls must render labels, helper text, and field-level errors with accessible relationships.
- Icon-only controls must include an `aria-label`.
- Loading states should use stable skeleton dimensions to avoid layout shift.
- Status badges must combine color with readable text; never rely on color alone.
- Public pages may use cinematic image-forward composition; admin pages should stay compact and operational.
