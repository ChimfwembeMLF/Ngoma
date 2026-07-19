# Contract: Long Form Inventory

**Feature**: 018-break-down-long-forms

## In-scope forms

| ID | Location | Pattern | Steps/tabs |
|----|----------|---------|------------|
| F-01 | `client/src/pages/AuthPage.tsx` | Wizard (register) | 2 |
| F-02 | `client/src/components/tracks/TrackUploadForm.tsx` | Wizard | 4 |
| F-03 | `client/src/pages/CheckoutPage.tsx` | Wizard | 2 |
| F-04 | `client/src/pages/TipArtistPage.tsx` | Wizard | 2 |
| F-05 | `client/src/pages/AdminBrandingPage.tsx` | Tabs | 4 |
| F-06 | `client/src/components/admin/ThemeEditor.tsx` | Tabs | 2 |

## Out-of-scope (short forms)

| Location | Reason |
|----------|--------|
| `AuthPage` login mode | 2 fields |
| `ArtistProfilePage` | 3 fields |
| `PlaylistsPage` create | 1–2 fields |
| `MobileMoneyForm` | Sub-component; parent wizard owns steps |

## Submit contracts (unchanged)

| Form | API | Payload |
|------|-----|---------|
| Register | `POST /api/v1/auth/register` | email, password, fullName, phone, country, role, artistName |
| Track upload | `POST /tracks` + upload + publish | existing track DTO |
| Checkout | `POST /api/v1/payments/deposit` | existing deposit DTO |
| Tip | tip initiate endpoint | existing tip DTO |
| Branding/theme | admin settings PUT | existing branding/theme DTOs |

No new endpoints required.
