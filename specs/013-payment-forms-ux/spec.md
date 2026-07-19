# Feature Specification: Payment Forms UX — Countries, Flags & Mobile Operators

**Feature Branch**: `013-payment-forms-ux`

**Created**: 2026-07-19

**Status**: Draft

**Input**: User description: "For all payment forms add countries and flags etc, and mobile operators to be user friendly not what PawaPay expects"

**Depends on**: `011-payments-pawapay-integration` (PawaPay deposit/tip flow, `GET /mobile-money/options`, Checkout + Tip pages)

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Country Selector with Flag (Priority: P1)

A listener on checkout or tip sees their country with a flag emoji and currency, and can switch country when multiple are supported. Phone placeholder and currency label update with the selected country.

**Why this priority**: Product wireframes (§3 checkout, §5.3.2) show country-aware mobile money; current UI hardcodes Zambia index `[0]` with no country picker.

**Independent Test**: VS-1301 — Checkout shows 🇿🇲 Zambia (ZMW); phone hint shows local format.

**Acceptance Scenarios**:

1. **Given** payment form loads, **When** options fetched, **Then** country displays with flag + name + currency — not a raw country code.
2. **Given** only one country enabled, **When** form renders, **Then** country is shown (not hidden) with flag for clarity.
3. **Given** user switches country (when multiple enabled), **When** selection changes, **Then** operator list and dial prefix update.

---

### User Story 2 — User-Friendly Mobile Operator Selection (Priority: P1)

Operators appear as human-readable choices (e.g. "MTN Mobile Money", "Airtel Money", "Zamtel Kwacha") with optional brand styling — never as PawaPay correspondent codes like `MTN_MOMO_ZMB` in the UI or as the value the user selects.

**Why this priority**: Core user pain point — internal gateway codes are meaningless to listeners.

**Independent Test**: VS-1302 — Operator dropdown/cards show "MTN Mobile Money"; network tab POST body uses `operatorId` (e.g. `zm-mtn`), API maps to PawaPay code server-side.

**Acceptance Scenarios**:

1. **Given** Zambia selected, **When** operators listed, **Then** labels match product mockups (MTN Mobile Money, Airtel Money, Zamtel Kwacha).
2. **Given** user selects an operator, **When** payment submitted, **Then** client sends stable `operatorId`; API resolves to PawaPay `correspondent` internally.
3. **Given** invalid/disabled operator, **When** submitted, **Then** 400 with friendly message — not raw PawaPay error codes in UI.

---

### User Story 3 — Shared Mobile Money Form Component (Priority: P1)

Checkout and Tip artist pages use one shared mobile money form (country, operator, phone) so UX and validation stay consistent.

**Why this priority**: DRY — both pages duplicate the same Select + Input pattern today.

**Independent Test**: VS-1303 — Checkout and `/tip/:artistId` render identical operator/country/phone controls.

**Acceptance Scenarios**:

1. **Given** `MobileMoneyForm` component, **When** embedded in Checkout and Tip, **Then** same layout, labels, and validation messages.
2. **Given** PawaPay disabled (dev auto-complete), **When** form renders, **Then** phone field optional; operator still required for consistency.

---

### User Story 4 — Enriched Payment Options API (Priority: P1)

The options endpoint returns structured country and operator metadata for the client — flags, dial codes, display names, operator IDs — while keeping PawaPay codes server-side only.

**Why this priority**: Client must not embed operator mapping; single source of truth on API.

**Independent Test**: VS-1304 — `GET /api/v1/payments/mobile-money/options` returns countries with `flag`, `operators[].displayName`, `operators[].id`; no `pawapayCode` field exposed.

**Acceptance Scenarios**:

1. **Given** public options request, **When** response parsed, **Then** each country has `iso2`, `flag`, `name`, `dialCode`, `currency`, `operators[]`.
2. **Given** deposit/tip DTO, **When** `operatorId` provided, **Then** service resolves to PawaPay correspondent before gateway call.
3. **Given** legacy `provider` field with PawaPay code, **When** sent, **Then** still accepted (backward compat) but deprecated in Swagger.

---

### User Story 5 — Purchase History Friendly Labels (Priority: P2)

Payment history shows operator display name (e.g. "MTN Mobile Money") instead of stored PawaPay code where possible.

**Independent Test**: VS-1305 — Purchase history row shows friendly operator label.

---

## Functional Requirements

- **FR-1301**: All payment forms (checkout, tip) MUST include country display with flag emoji or equivalent.
- **FR-1302**: Operators MUST use consumer-facing `displayName` per `PROJECT REQUIREMENTS.md` checkout wireframes.
- **FR-1303**: Client MUST submit `operatorId` (stable slug); API MUST map to PawaPay correspondent internally.
- **FR-1304**: PawaPay correspondent codes MUST NOT appear in client UI or public API operator objects.
- **FR-1305**: Shared `MobileMoneyForm` component MUST be used on Checkout and Tip pages.
- **FR-1306**: Phone input MUST show country dial prefix hint (e.g. +260) based on selected country.
- **FR-1307**: MVP country catalog: **Zambia** fully enabled; catalog structure MUST support additional countries without client refactor.
- **FR-1308**: Operator selection SHOULD use radio/card pattern on mobile (wireframe) — not plain code dropdown alone.

## Non-Functional Requirements

- **NFR-1301**: No new npm dependencies for flags (use Unicode flag emoji from ISO 3166-1 alpha-2).
- **NFR-1302**: Options endpoint response cacheable; static catalog in code.

## Success Criteria

- **SC-1301**: Zero PawaPay correspondent strings visible in checkout/tip UI.
- **SC-1302**: User can complete Zambia mobile money payment selecting "MTN Mobile Money" by label only.
- **SC-1303**: Checkout and Tip share one form component.

## Out of Scope

- Admin UI to edit countries/operators (see PROJECT REQUIREMENTS §5.3.2 — future admin)
- Enabling Nigeria/Kenya/Ghana live PawaPay flows until correspondent codes verified in sandbox
- Saved payment methods / wallet
- Country auto-detection via IP

## Assumptions

- Zambia operators and PawaPay codes remain: MTN → `MTN_MOMO_ZMB`, Airtel → `AIRTEL_OAPI_ZMB`, Zamtel → `ZAMTEL_ZMB`
- Existing `normalizeMobileMoneyPhone()` reused per country dial code
- No database schema change — catalog and mapping in `payment-countries.ts`
