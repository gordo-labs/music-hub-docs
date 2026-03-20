# Plan: Shared Links & Hubs

Implementation spec for evolving today's share-link flow into a hub-centric multi-hub model.

**Status:** Partially implemented.

- Already live today: share links for playlist/artist/album/track, crawler metadata, standalone share pages, public bootstrap endpoints, signed media sessions, and share-session heartbeat renewal.
- Planned from here: stable hub identity, a hub-side shared registry, a mobile no-hub standby shell, hub-to-hub gateway behavior, and Shared/Hubs product surfaces.

---

## 1. Direction

Multi-hub v1 is **hub-centric federation**.

- The main desktop hub acts as the **canonical registry** for shared hubs and shared items whenever a main hub exists.
- The main desktop hub acts as the **client of remote hubs** for share import, metadata retrieval, availability checks, and media/bootstrap proxying.
- The main desktop hub acts as the **gateway/relay** for shared metadata and media so the mobile client can keep talking to a single trusted hub.
- The mobile app:
  - with a main hub connected: remains a **passive client** of that hub
  - without a main hub: uses a **local fallback inbox + open-link mode** until a main hub exists

The goal of v1 is to keep multi-hub complexity in the hub, not to turn the mobile app into an active multi-hub orchestrator.

---

## 2. App States

### `standby_no_hub`

The default root state when the app has no main hub configured or the user explicitly disconnects.

- This is the new no-hub shell for the mobile app.
- It must offer:
  - `Connect a hub`
  - `Open a link`
  - local `Shared with me` inbox
- The app can stay installed in this state and simply wait for:
  - a QR/manual hub connection
  - an incoming `musichub://open` deeplink

### `connected_main_hub`

The normal operating mode once the mobile app has a main hub.

- The main hub becomes canonical for shared hubs and shared items.
- The mobile app talks only to the main hub for shared content consumption.
- The mobile app does **not** talk directly to remote hubs in this state.
- Shared links are imported into the main hub and then consumed via the main hub.

### `standalone_share_session`

A temporary mode for opening a shared link when no main hub exists yet.

- The incoming link is saved to the local inbox.
- The app tries to open the shared content immediately if the remote hub is reachable.
- If the remote hub is unavailable later, the entry remains listed in the inbox with offline/error state.

---

## 3. Responsibilities Split

### Desktop hub principal

The main desktop hub is responsible for:

- stable `hubId`
- shared registry
- hub-to-hub connector
- dedupe and canonicalization
- availability checks with TTL/backoff
- proxy/relay for shared bootstrap, artwork, `/stream`, and `/hls`
- sync/import of the mobile app's local fallback inbox

The desktop hub should also expose a minimal operator/admin view of known shared hubs, but full federated desktop browsing is not part of v1.

### Mobile

The mobile app is responsible for:

- no-hub standby shell
- local fallback inbox for shared links
- deeplink handling for `musichub://connect` and `musichub://open`
- consuming shared content from the main hub when one exists
- temporary standalone opening when no main hub exists

The mobile app should not carry active multi-hub runtime logic once connected to its main hub.

---

## 4. User Flows

### First install / no hub

- User opens the app for the first time.
- App lands in `standby_no_hub`.
- User can:
  - scan a QR code
  - paste a hub URI manually
  - wait for a shared link to arrive

### Receive share with no hub

- App receives `musichub://open`.
- The link is saved to the local inbox immediately.
- The app attempts to open the shared content right away.
- If the remote hub later becomes unavailable, the item remains visible and is marked offline.

### Receive share with main hub connected

- App is already connected to Hub A.
- User receives a share for Hub B.
- The app does **not** disconnect from Hub A.
- The app imports the link into Hub A.
- The shared content is then consumed via Hub A.

### Reconnect after standalone period

- User has accumulated local inbox entries while no main hub existed.
- User later connects or reconnects to their main hub.
- The app syncs pending inbox entries upstream.
- The main hub dedupes them and becomes the canonical owner of that shared state.

---

## 5. API / Interface Changes

### Desktop hub APIs

The plan assumes these interfaces:

- `GET /api/hub/info`
- `POST /api/shared-links/import`
- `GET /api/shared-hubs`
- `GET /api/shared-hubs/:hubId/items`
- `GET /api/shared-hubs/:hubId/status`

Shared bootstrap should be proxied by the main hub through hub-scoped endpoints:

- `GET /api/shared/:hubId/playlist/:id/bootstrap`
- `GET /api/shared/:hubId/artist/:id/bootstrap`
- `GET /api/shared/:hubId/album/:id/bootstrap`
- `GET /api/shared/:hubId/track/:id/bootstrap`

When a main hub exists, the media URLs and tokens returned to the mobile client must belong to the **main hub**, not to the remote hub.

### Deeplink contract

- `musichub://connect`
  - connect/pair a main hub
- `musichub://open`
  - open or import shared content

They serve different purposes and should stay separate.

### Response/source metadata

Shared results or shared entity wrappers should include enough origin context for UI and playback decisions:

- `sourceKind: 'local' | 'shared'`
- `sourceHubId`
- `sourceHubName`
- `sourceOnline`

The existing local Library entities keep their local semantics; shared content should layer origin metadata on top instead of pretending to be local library data.

---

## 6. Product Surface Rules

- `Library` continues to mean **your own hub library**.
- `Shared / Hubs` is a **separate surface**.
- Search may include shared results, but they must be:
  - grouped separately
  - visibly badged with hub identity
  - shown with online/offline state
- v1 does **not** mix shared items into normal library surfaces as if they were local.
- v1 does **not** mix hubs inside one playback queue.
- If desktop surfaces shared hubs in v1, they should be operator/admin-oriented first, not a promise of full federated browsing.

---

## 7. Non-goals

The following are explicitly out of scope for v1:

- merged federated library
- mixed-hub playback queue
- direct mobile-to-remote runtime when a main hub exists
- full paired secondary-hub browsing in the same phase as the base refactor
- device bonding / permissions / link time window in the same phase as the base refactor
- full end-user federated desktop browsing

---

## 8. Acceptance Criteria

- Opening a share from Hub B while connected to Hub A does not disconnect Hub A.
- The mobile local inbox survives app restarts.
- Syncing the local inbox into the main hub dedupes correctly and promotes the main hub to canonical owner.
- Shared playback is served via the main hub whenever a main hub exists.
- Shared search results are visible but clearly separated from local library results.
- Offline state for shared content is visible without breaking the overall UX.
- No mixed-hub queues can be created in v1.

---

## References

- Share bootstrap + heartbeat: `desktop/src/api/routes.ts`, `desktop/ui-src/hooks/useShareSession.ts`
- Mobile deep linking: `mobile/src/services/connectionLinking.ts`, `mobile/App.tsx`
- Mobile connection/auth: `mobile/src/services/connection.ts`
- Mobile API/store: `mobile/src/services/api.ts`, `mobile/src/store/index.ts`
- QR/connect payloads: `desktop/src/tunnel/qr.ts`, `desktop/src/index.ts`
