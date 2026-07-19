# Contract: Shared Component Restyles

**Location**: `client/src/components/`  
**Reference**: [003 ui-components](../003-client-design-system/contracts/ui-components.md)

---

## TrackUploadForm

**File**: `client/src/components/tracks/TrackUploadForm.tsx`

| Element | Before (legacy) | After (design system) |
|---------|-----------------|----------------------|
| Container | indigo-950 border | `Card` or `Card`-equivalent classes |
| Heading | text-cream | `text-ink title-md` |
| File/title/price inputs | indigo-950 bg | `Input` component or matching classes |
| Submit | bg-terracotta | `Button variant="primary"` |
| Secondary | border-indigo | `Button variant="outline"` |

**Behavior**: Unchanged — same props, mutations, validation.

---

## PaymentStatusPanel

**File**: `client/src/components/payments/PaymentStatusPanel.tsx`

| Element | After |
|---------|-------|
| Container | `Card` with `border-hairline` |
| Title | `text-ink font-semibold` |
| Status line | `text-muted text-sm`; FAILED → `text-error` |
| Deposit ID | `text-muted-soft text-xs` optional |

**Behavior**: Unchanged polling and callbacks.

---

## UserTable

**File**: `client/src/components/admin/UserTable.tsx`

| Element | After |
|---------|-------|
| Wrapper | `rounded-md border border-hairline overflow-x-auto` |
| thead | `bg-surface-soft text-muted text-xs uppercase` |
| tbody tr | `border-t border-hairline text-ink` |
| tbody td secondary | `text-muted` |
| Deactivate | `Button variant="ghost"` with `text-error` or confirm + outline |

**Props**: Unchanged — `users`, `onDeactivate`.

---

## AdminRoute (loading only)

**File**: `client/src/components/AdminRoute.tsx`

Replace `LegacyLayout` loading branch with:

```tsx
<DesignSystemLayout>
  <div className="p-8 text-center text-muted">Loading…</div>
</DesignSystemLayout>
```

Auth redirect logic unchanged.

---

## LegacyLayout — REMOVED

**File**: `client/src/components/layout/LegacyLayout.tsx`

Delete after all imports removed. No replacement — pages use `DesignSystemLayout` directly.

---

## Optional: Textarea styling

If bio field does not use `Input` component, apply shared field classes:

```text
w-full min-h-[120px] rounded-sm border border-hairline bg-canvas px-3 py-2
text-ink placeholder:text-muted
focus:border-border-strong focus:outline-none focus:ring-2 focus:ring-primary/20
```

Extract to shared constant only if duplicated twice.
