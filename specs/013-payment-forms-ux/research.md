# Research: 013-payment-forms-ux

**Date**: 2026-07-19

## R1: Operator identity — slug vs PawaPay code

**Decision**: Introduce stable `operatorId` slugs (e.g. `zm-mtn`, `zm-airtel`, `zm-zamtel`). API catalog maps `operatorId → pawapayCode`. Client never receives or sends PawaPay codes in normal flow.

**Rationale**: Decouples UX from gateway naming (`MTN_MOMO_ZMB`). Matches admin config mockup in PROJECT REQUIREMENTS §5.3.1 which shows friendly name + internal code separately.

**Alternatives considered**:
- Client-side mapping file — rejected; duplicates API, leaks codes to bundle
- Send display name string — rejected; fragile i18n/typos

---

## R2: Country flags without new dependencies

**Decision**: Use Unicode regional indicator flag emoji derived from ISO 3166-1 alpha-2 (`ZM` → 🇿🇲) via helper `flagEmoji(iso2)`.

**Rationale**: Zero deps, works in modern mobile browsers, matches mobile-first product. No sprite/CDN asset pipeline.

**Alternatives considered**:
- `country-flag-icons` npm — rejected for NFR-1301
- SVG flag sprites — rejected; maintenance overhead

---

## R3: Operator UI pattern

**Decision**: Radio group / selectable cards on mobile (`OperatorOption` rows with display name + optional emoji 📱). Desktop may use same pattern or shadcn Select with rich item labels — prefer **card list** on all breakpoints for consistency with wireframe §3.

**Rationale**: Wireframes show radio-style MTN/Airtel/Zamtel cards, not opaque dropdown of codes.

**Alternatives considered**:
- Plain Select with long labels — acceptable fallback but cards preferred
- Logos from CDN — deferred; emoji 📱 + color accent sufficient for MVP

---

## R4: Country catalog scope (MVP)

**Decision**: Ship **Zambia only** as `enabled: true`. Include catalog entries for Nigeria, Kenya, Ghana as `enabled: false` (visible in API for future, hidden or disabled in client) OR omit disabled countries from API until verified — **ship ZM only in API response for MVP** to avoid dead-end country selection.

**Rationale**: Only ZM PawaPay codes are tested in codebase. PROJECT REQUIREMENTS lists multi-country as roadmap.

**Alternatives considered**:
- Show all countries disabled — rejected; confusing UX
- Multi-country live — rejected without verified correspondent codes

---

## R5: DTO backward compatibility

**Decision**: Add optional `operatorId` to `InitiatePaymentDto` / `InitiateTipDto`. Validation: require exactly one of `operatorId` OR legacy `provider` (PawaPay code). Service resolves to single `correspondent` string for gateway.

**Rationale**: Avoid breaking existing curl/tests from spec 011; new client uses `operatorId` only.

---

## R6: Shared form component

**Decision**: `MobileMoneyForm` controlled component exposing `{ countryId, operatorId, phone }` via props/callback. Used by Checkout and Tip.

**Rationale**: Eliminates duplicated Select/Input blocks; single place for pawapayEnabled phone validation messaging.

---

## R7: Phone input UX

**Decision**: Show static dial prefix badge (`+260`) beside input based on selected country; placeholder `97XXXXXXX` for Zambia. Continue server-side `normalizeMobileMoneyPhone(dialCode, phone)`.

**Rationale**: Matches wireframe "Mobile Money Number" with country context.

---

## R8: Purchase history labels

**Decision**: Add `resolveOperatorDisplayName(pawapayCode)` helper on API for history response enrichment OR map on client from cached options catalog.

**Rationale**: Payment row stores PawaPay code in `provider` column — map to display name at read time without migration.

**Alternatives considered**:
- Store display name in DB — rejected; redundant

---

## R9: Operator display names (Zambia)

| operatorId | displayName | pawapayCode |
|------------|-------------|-------------|
| `zm-mtn` | MTN Mobile Money | `MTN_MOMO_ZMB` |
| `zm-airtel` | Airtel Money | `AIRTEL_OAPI_ZMB` |
| `zm-zamtel` | Zamtel Kwacha | `ZAMTEL_ZMB` |

Per PROJECT REQUIREMENTS checkout wireframe §3.
