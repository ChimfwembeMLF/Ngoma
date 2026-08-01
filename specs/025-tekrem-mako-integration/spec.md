# Feature Specification: Tekrem & Mako Ecosystem Integration

**Feature Branch**: `025-tekrem-mako-integration`

**Created**: 2026-08-01

**Status**: Draft

**Input**: User description: "Implement the unified architecture and future ecosystem capabilities connecting Ngoma (Music Commerce & Distribution), Tekrem ID (Unified Authentication & Single Sign-On), and Mako (AI Marketing Engine & Fan CRM) as described in Recommended Architecture.md and Ngoma Future.md."

## Clarifications

### Session 2026-08-01
- Q: How does Ngoma authenticate users through Tekrem ID without modifying or breaking the external Tekrem Auth system? → A: Standard OIDC Relying Party integration. Ngoma registers as an OAuth 2.0 / OpenID Connect client in Tekrem Auth and utilizes standard Authorization Code Flow with PKCE, requiring zero modifications to Tekrem Auth's Rust identity server or database schema.
- Q: How does Ngoma interact with Mako for one-click promotion and analytics without disrupting Mako's multi-tenant business model or RBAC? → A: Standard Mako tenant and workspace alignment. When an artist is created or promotes a release, Ngoma utilizes standard API endpoints and route payloads (e.g., pre-populating Mako's `/social` workflow within the artist's assigned tenant/workspace), fully preserving Mako's multi-tenancy and permissions model without schema mutations.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Unified Artist Identity via Tekrem ID (Priority: P1)

When an artist signs up or logs into Ngoma, they authenticate via a unified identity platform (Tekrem ID). This account serves as a single sign-on across both Ngoma (for music publishing and commerce) and Mako (for AI-driven promotion), eliminating dual registration or repeated login prompts when moving between services.

**Why this priority**: This is the foundational prerequisite for all cross-platform interactions between Ngoma and Mako. Without shared identity and seamless authentication, connected marketing workflows cannot function smoothly.

**Independent Test**: Can be tested by creating an artist account on Ngoma, verifying that a unified identity profile is established, and confirming that launching promotional features authenticates the user automatically without prompting for credentials again.

**Acceptance Scenarios**:

1. **Given** a new artist registering on Ngoma, **When** they complete registration and profile verification, **Then** a unified identity account is established and linked, granting immediate access to Ngoma music management.
2. **Given** an authenticated artist on the Ngoma dashboard, **When** they transition to any promotion feature powered by Mako, **Then** they enter the promotional environment seamlessly without requiring a separate login or account link step.

---

### User Story 2 - One-Click Song Promotion & Metadata Sync (Priority: P1)

Immediately after publishing a song, album, or music video in Ngoma, artists are presented with an interactive promotion action ("Promote with Mako"). Activating this action securely transfers release metadata (title, artist name, cover artwork, genre, description, and landing page link) into the marketing engine, pre-loading an AI promotional campaign without manual copy-pasting.

**Why this priority**: This core differentiator transforms standard music publishing into immediate promotional action, removing technical friction and enabling independent artists to market their music instantly.

**Independent Test**: Can be tested by publishing a new track in Ngoma, selecting the promotion action, and verifying that the promotional campaign interface opens pre-populated with the exact track details, audio landing links, and artwork ready for deployment.

**Acceptance Scenarios**:

1. **Given** an artist who has just successfully published a music release on Ngoma, **When** they view the release confirmation display or track management dashboard, **Then** a prominent action to promote the release is presented.
2. **Given** an artist selecting the promotion action for a published song, **When** the marketing campaign builder launches, **Then** all release attributes (title, artist display name, artwork graphic, release link, and genre) are automatically filled into the campaign parameters.

---

### User Story 3 - Smart Link Generation & Conversion Tracking (Priority: P2)

For each promoted music release, the marketing system generates traceable smart links. When fans visit these links from social channels or messaging apps (Facebook, Instagram, WhatsApp, X, Telegram), the system monitors visitor actions—from initial click through to streaming, downloading, tipping, or purchasing—offering transparency into audience conversion funnels.

**Why this priority**: Connects social promotion directly to financial performance, allowing artists to discern which marketing campaigns generate tangible engagement and revenue.

**Independent Test**: Can be tested by creating a smart link for a release, simulating external listener visits and purchases via that promotional link, and confirming that audience analytics reflect the attribution correctly.

**Acceptance Scenarios**:

1. **Given** a promotional campaign created for a music release, **When** a smart link is shared on external social channels, **Then** visitors accessing the link are directed to the release listing page while logging anonymous campaign referral metrics.
2. **Given** a listener arriving via a promotional smart link, **When** they complete a track purchase or provide a tip to the artist, **Then** the financial transaction is explicitly attributed to that originating promotional campaign.

---

### User Story 4 - Unified ROI Analytics Dashboard (Priority: P2)

Inside the artist's analytics workspace, music performance metrics (streams, downloads, direct sales revenue, tips) are paired with marketing performance metrics (campaign reach, impressions, link clicks, ad expenditure, conversion rates). This presents artists with a concise summary of their return on investment (ROI) per release and per promotional campaign.

**Why this priority**: Empowers musicians to manage their careers with clear financial transparency, clearly determining whether a specific marketing campaign is profitable.

**Independent Test**: Can be tested by observing the analytics workspace during an active promotional campaign, verifying that advertising expenditure and audience reach are combined with sales revenue to compute accurate ROI percentages.

**Acceptance Scenarios**:

1. **Given** an active promotion campaign that resulted in song purchases, **When** the artist examines their analytics dashboard, **Then** they observe a unified report displaying total audience reach, total clicks, resulting purchases, total revenue, and calculated Net ROI percentage.
2. **Given** multiple campaigns across varied tracks or marketing channels, **When** exploring the analytics view, **Then** the artist can filter and segment ROI metrics by track title, time window, or promotion method.

---

### User Story 5 - Fan CRM & Automated Audience Intelligence (Priority: P3)

As listeners stream, download, buy music, or tip artists on Ngoma, an automated audience intelligence system (Fan CRM) organizes fan profile patterns (such as genre preferences, geographic location, purchase frequency, and lifetime financial support). When an artist prepares a subsequent release or announcement, the system suggests targeting relevant audience segments that previously engaged with matching content.

**Why this priority**: Drives long-term career sustainability by building recurring direct fan relationships and repeat sales rather than relying solely on organic discovery.

**Independent Test**: Can be tested by simulating fan interactions and purchases across multiple genre categories, confirming that the audience management engine categorizes fans by preference and lifetime engagement value, and testing targeted promotional list suggestions for a new release.

**Acceptance Scenarios**:

1. **Given** a listener who repeatedly purchases tracks within a specific genre from an artist, **When** their interactions are completed, **Then** their profile within the artist's audience insights is enriched with genre interest labels and lifetime expenditure metrics.
2. **Given** an artist initiating promotion for a new release in an established genre, **When** setting up audience outreach, **Then** the system automatically identifies and highlights the existing segment of fans who engaged with similar previous releases.

---

### Edge Cases

- What happens if the promotional marketing service experiences temporary unavailability or network separation when an artist attempts to promote a release?
  - System presents a gracious status notification with an option to queue the promotional action or retry later, without impacting music publishing or commerce features.
- How does the system manage smart link tracking and conversion attribution when listeners browse with stringent privacy settings or disabled tracking tokens?
  - System gracefully falls back to core streaming and purchase fulfillment without logging individualized referral attribution, preserving complete user privacy and core application functionality.
- What happens when an artist alters track metadata (such as modifying song title or replacing cover art) after a promotional campaign has already gone live?
  - Existing promotional campaigns receive updated metadata dynamically where supported by target channels, or alert the artist if fixed media content requires voluntary re-publishing.
- How does the system normalize financial figures in the unified analytics dashboard if transactions occur across differing currencies or payment providers?
  - All revenue figures and expenditures are converted and consolidated into the artist's selected account currency to ensure accurate, unified ROI arithmetic.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST support a unified identity authentication protocol that enables seamless single sign-on across the music commerce platform and marketing capabilities without secondary login challenges.
- **FR-002**: System MUST automatically provision or link an associated promotional identity upon successful completion of an artist profile registration or verification.
- **FR-003**: System MUST provide a conspicuous promotional activation trigger immediately upon successful track, album, or video publication, as well as within permanent catalog management layouts.
- **FR-004**: System MUST securely package and transfer release metadata—comprising release identifier, title, artist display name, artwork location, genre classification, release synopsis, and landing link—upon activation of the promotional workflow.
- **FR-005**: System MUST generate shortened promotional smart links that reliably log referral channel identity, visit timestamps, and destination release identifiers with negligible routing latency.
- **FR-006**: System MUST correlate track purchases, tips, and paid downloads with originating campaign smart links whenever a transaction is initiated during a tracked listening session.
- **FR-007**: System MUST calculate and present unified campaign performance reports within the analytics dashboard, clearly exhibiting audience reach, clicks, transactions, gross revenue, advertising expenditure, and Net ROI percentage.
- **FR-008**: System MUST synthesize listener interaction events (purchase totals, streaming frequency, favorite genres, and geographic region) into structured audience segmentation profiles for artist community insights.
- **FR-009**: System MUST enforce rigorous access controls ensuring artists only view audience intelligence, engagement histories, and financial conversions pertaining strictly to their own music catalog.
- **FR-010**: System MUST interface with the identity provider strictly as a standard OpenID Connect (OIDC 1.0) relying party utilizing Authorization Code Flow with PKCE, ensuring zero modifications or breaking changes to external identity server schemas or token endpoints.
- **FR-011**: System MUST integrate with the promotional marketing engine by mapping artists to standardized tenant and workspace constructs, preserving multi-tenant isolation and RBAC without altering external database structures or core service contracts.
- **FR-012**: System MUST perform one-click promotion metadata transfers and unified analytics aggregation solely via standard public API payloads or authenticated route pre-filling into dedicated social marketing workspaces.

### Key Entities

- **Unified Artist Identity**: Represents the centralized profile and authentication credential bridging music distribution, commerce wallets, and marketing engine execution.
- **Release Metadata Package**: Represents the immutable or versioned collection of track descriptors and visual assets shared between distribution and promotion services during one-click promotion.
- **Campaign Attribution Record**: Records the linkage connecting external promotion distributions (smart links), visitor engagement actions, and resulting revenue transactions.
- **Audience Segment Profile**: Summarizes aggregated fan behavior, favorite genres, transaction frequency, and supporter levels to facilitate personalized marketing outreach.
- **Integrated ROI Summary**: Combines advertising inputs (expenditures, placements) with commerce outputs (sales, tips, stream volumes) to calculate overall campaign profitability.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of newly registered or authenticated artists can open promotional marketing workflows without encountering secondary sign-in prompts or credential inquiries.
- **SC-002**: Activating one-click promotion for any published song prepopulates all required campaign variables in under 3 seconds, requiring zero manual data re-entry from the artist.
- **SC-003**: Campaign attribution tracking successfully correlates at least 95% of listener purchases and tips back to originating smart promotional links in standard browsing environments.
- **SC-004**: Consolidated ROI analytics and revenue totals reflect new purchase transactions within 60 seconds of payment verification.
- **SC-005**: Releases utilizing intelligent campaign links and unified promotional distribution demonstrate a 25% increase in visitor-to-listener conversion rate compared to basic direct URL sharing.

## Assumptions

- **Assumption 1**: Artists desire a streamlined experience where marketing functions as an intuitive extension of their existing music business dashboard rather than an isolated software tool.
- **Assumption 2**: Mobile money transaction processing and automated payment verification remain the core payment fulfillment mechanisms for music sales and listener tips.
- **Assumption 3**: Token exchange and shared identity authorization between core ecosystem platforms operate over secure, modern identity protocol standards without introducing account vulnerabilities.
- **Assumption 4**: Collection of listener interaction histories and audience CRM segmentation will fully comply with regional privacy regulations and respect listener communication opt-out preferences.
- **Assumption 5**: Core marketing features and basic campaign generators are made available to all verified artists upon registration, while expanded ad network distribution or heightened promotional tiering may utilize promotion marketplace budgets.
- **Assumption 6**: The external identity service (Tekrem Auth) provides enterprise OIDC discovery, JWT token issuance, and client registration capabilities out of the box, requiring no custom extensions to authenticate music platform users.
- **Assumption 7**: The external marketing service (Mako) provides standard social publishing workflows and multi-tenant workspaces, allowing music promotion features to integrate seamlessly without disrupting existing business or non-music tenant workflows.
