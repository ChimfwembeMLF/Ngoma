# Requirements Checklist: MVP Hardening & Convergence

**Purpose**: Validate requirement quality, clarity, and completeness across all four user stories (admin UI, duration, FTS, dev docs) before or during spec/PR review.
**Created**: 2026-07-19
**Feature**: [spec.md](../spec.md)
**Audience**: Spec author (self-review) and peer reviewer
**Depth**: Standard (~32 items)

**Note**: This checklist tests whether requirements are well-written — not whether the implementation works.

## Requirement Completeness

- [ ] CHK001 Are pagination requirements (default limit, max limit, offset, total count) specified for the admin user list? [Completeness, Spec §FR-101, Contract admin.md]
- [ ] CHK002 Are role-filter requirements defined with allowed values, optional vs required behavior, and empty-result expectations? [Completeness, Spec §US1, Contract admin.md]
- [ ] CHK003 Are requirements for post-deactivation session or token invalidation explicitly documented? [Gap, Spec §US1 Scenario 2]
- [ ] CHK004 Are supported audio formats and MIME types for duration extraction enumerated beyond "valid MP3"? [Completeness, Spec §FR-103, Spec Edge Cases]
- [ ] CHK005 Are requirements defined for when `duration` is zero, null, or omitted in API and UI responses? [Gap, Contract discovery.md, Spec §FR-105]
- [ ] CHK006 Are FTS indexed fields (title, genre, artist name) and sync trigger events explicitly enumerated? [Completeness, data-model.md, Spec §FR-104]
- [ ] CHK007 Are quickstart validation scenarios (VS-101–VS-104) traceable to corresponding functional requirements? [Traceability, Spec §US4, quickstart.md]
- [ ] CHK008 Is the local ADMIN bootstrap path (script, prerequisites, one-time vs repeatable) documented end-to-end? [Completeness, Spec §FR-107, Assumptions]

## Requirement Clarity

- [ ] CHK009 Is "access denied" for non-admin users quantified as redirect, HTTP 403, or client-side empty state? [Clarity, Spec §US1 Scenario 3]
- [ ] CHK010 Is mm:ss display format specified for boundary values (0 seconds, sub-minute, hour-plus tracks)? [Clarity, Spec §FR-105, Spec §US2 Scenario 2]
- [ ] CHK011 Is search "relevance" defined with measurable ranking criteria beyond "ordered by relevance"? [Clarity, Spec §US3, Contract discovery.md]
- [ ] CHK012 Are port-conflict resolution steps specific about which variables (`PORT`, `DATABASE_URL`, Vite proxy) must stay aligned? [Clarity, Spec §FR-106, Spec §US4]
- [ ] CHK013 Is "clear error" for corrupt or zero-length audio defined with HTTP status, error code, or user-facing message shape? [Clarity, Spec Edge Cases]
- [ ] CHK014 Is "within upload request" for duration parsing reconciled with the plan's 500ms parse budget? [Clarity, Spec §SC-102, Plan §Performance Goals]

## Requirement Consistency

- [ ] CHK015 Do admin deactivate requirements align between acceptance scenarios, business rules, and contract error codes (ADM_001, ADM_002)? [Consistency, Spec §US1, Contract admin.md, data-model.md]
- [ ] CHK016 Does duration display in the spec align with contract language that responses include duration "when available"? [Consistency, Spec §FR-105, Contract discovery.md]
- [ ] CHK017 Do FTS requirements in the spec align with the 001 discovery contract delta without leaving ILIKE behavior ambiguous? [Consistency, Spec §FR-104, Contract discovery.md]
- [ ] CHK018 Are quickstart port and health-check requirements consistent between FR-106, US4 scenarios, and SC-104? [Consistency, Spec §FR-106, §US4, §SC-104]

## Acceptance Criteria Quality

- [ ] CHK019 Can SC-101 ("under 30 seconds from dashboard") be measured without undefined navigation or confirmation steps? [Measurability, Spec §SC-101]
- [ ] CHK020 Can SC-103 (p95 < 200ms at 10k tracks) be verified given no load-test or dataset setup procedure in the spec? [Measurability, Spec §SC-103, Gap]
- [ ] CHK021 Is "valid MP3" in SC-102 defined with objective acceptance criteria (codec, min duration, file size)? [Measurability, Spec §SC-102]
- [ ] CHK022 Are VS-1–VS-5 regression pass criteria defined with explicit pass/fail thresholds rather than "pass or documented exceptions"? [Acceptance Criteria, Spec §SC-104, §US4 Scenario 2]

## Scenario Coverage

- [ ] CHK023 Are alternate-flow requirements defined when admin role filter returns zero users or pagination exceeds total? [Coverage, Gap, Spec §US1]
- [ ] CHK024 Are exception-flow requirements defined for FTS migration failure, missing `search_vector`, or backfill partial completion? [Coverage, Gap, data-model.md]
- [ ] CHK025 Are recovery or partial-success requirements defined when duration parsing fails but file storage succeeds? [Coverage, Gap, Spec Edge Cases]
- [ ] CHK026 Are requirements distinguished for search with no matches vs an empty published catalog? [Coverage, Spec §US3 Scenario 2]

## Edge Case Coverage

- [ ] CHK027 Is the deactivated-user download access policy specified precisely enough to prevent conflicting enforcement interpretations? [Edge Case, Spec Edge Cases]
- [ ] CHK028 Are FTS special-character sanitization rules defined beyond "sanitized" (allowed charset, token stripping, empty-query handling)? [Edge Case, Ambiguity, Spec Edge Cases, Contract discovery.md]
- [ ] CHK029 Is self-deactivate prevention specified consistently for API enforcement and client UX (disabled action vs error feedback)? [Edge Case, Spec Edge Cases, Contract ADM_001]

## Non-Functional Requirements & Dependencies

- [ ] CHK030 Are admin authorization requirements specified at both API (RolesGuard) and client (route guard) layers without gaps? [Non-Functional, Spec §US1, Constitution §IV]
- [ ] CHK031 Is the English-only PostgreSQL FTS config documented as an explicit, acceptable locale assumption for MVP? [Assumption, Spec Assumptions]
- [ ] CHK032 Are performance degradation or timeout requirements defined when duration parsing or FTS sync exceeds plan thresholds? [Non-Functional, Gap, Plan §Performance Goals]

## Notes

- Check items off as completed: `[x]`
- Add inline findings referencing spec sections or proposed amendments
- Items marked `[Gap]` indicate missing requirements worth adding to spec.md or contracts/
