# Changelog — 2026-03-16

Summary of changes from the 2026-03-16 session: analytics, dates, library filters, and listening history.

---

## Related: Sync System

These changes extend the **shared sync system** between desktop and mobile:

| Sync component | Docs | 2026-03-16 impact |
|----------------|------|-------------------|
| **Playback session** | `working/docs/ARCHITECTURE.md`, `working/STATUS.md` (2026-03-13) | `track_play_events` and `last_heard_at` feed from both clients |
| **Saved library** | `desktop/ui-src/services/crate.ts` — "Shared saved/crate state synced with the hub API" | Heard status persists via `last_heard_at`; `play_count` and play history are shared |
| **Play events** | `POST /api/play/events`, `PUT /api/saved/tracks/:id` (status: heard) | `recordPlayEvent` with `source: 'desktop'|'mobile'` — both clients contribute to analytics |

**Architecture:** Desktop hub = source of truth. Mobile and desktop sync via REST API (`/api/playback/session`, `/api/saved`, `/api/play/events`). See `working/docs/ARCHITECTURE.md` and `working/STATUS.md` (2026-03-13 "Shared playback session + recent searches + mobile library search sync").

---

## 1. Por escuchar (To listen)

**Goal:** Know what you’ve downloaded recently that you haven’t listened to yet.

- **Home:** New section "Por escuchar" with recently added unheard tracks (grouped by album/track). "See more" → Library with filter active.
- **Library:** New filter "Por escuchar" using `/api/library/to-listen` with pagination.
- **API:** `GET /api/library/to-listen?days=30&limit=500&offset=0`
- **DB:** Filters `unheard` (`last_heard_at IS NULL`) and `added_days` (`date_added >= since`).

---

## 2. Crate vs DB — concepts

- **Crate:** Product/UI concept (new, saved, heard). Status derived from DB.
- **DB:** Persistence layer. `track_states` (saved), `last_heard_at` (heard), `track_play_events` (analytics).

---

## 3. Library sort — order by date added

**Goal:** Default sort by date added instead of alphabetical.

- **Default:** Sort by Date added (newest first).
- **Sort options:** Date added, Date scanned, Title, Artist, Album.
- **Store:** `librarySortBy`, `librarySortDir`, `SET_LIBRARY_SORT`.
- **Selector:** Sort dropdown in toolbar (hidden when in "Por escuchar" or during search).

---

## 4. date_added + date_scanned

**Goal:** Store both when the file was added to disk and when it was scanned.

- **date_added:** File creation time (`birthtime`) — when downloaded.
- **date_scanned:** When the track was scanned into the library.
- **DB:** New column `date_scanned` (migration).
- **Metadata extractor:** `dateAdded` = `fileStats.birthtime`, `dateScanned` = `new Date()`.
- **Protocol:** `Track.dateScanned?: string`.

---

## 5. Analytics temporales (Temporal analytics)

**Goal:** Support temporal queries and listening history.

### 5.1 Play history

- **DB:** `getPlayHistory(since?, until?, limit?)` — chronological list of play events with track info.
- **API:** `GET /api/analytics/play-history?since=...&until=...&days=7|30|90&limit=100`.
- **Response:** `{ events: [{ track, playedAt, source, completed }] }`.

### 5.2 played_days filter

- **DB:** `getAllTracks` and `getFilteredTrackCount` accept `played_days` — tracks with `last_played >= (now - N days)`.
- **API:** `GET /api/tracks?played_days=7` (or 30, 90).

### 5.3 Library filter "Played"

- **Library:** New filter "Played" — tracks played in last 30 days.
- **Sort options:** Last played, Last heard, Play count (added to sort options).

### 5.4 Listening History view

- **New view:** "History" in sidebar.
- **Filters:** Last 7 days, 30 days, 90 days, All time.
- **Content:** Chronological list of play events with track, artist, album, time, source (desktop/mobile).
- **Home:** "See more" in Recently Played → Listening History.

---

## 6. Files changed

| Area | Files |
|------|-------|
| **Database** | `desktop/src/database/index.ts` |
| **API** | `desktop/src/api/routes.ts` |
| **Metadata** | `desktop/src/metadata/index.ts`, `desktop-win-linux/src/metadata/index.ts` |
| **Protocol** | `desktop/protocol/src/types.ts`, `desktop/protocol/src/validators.ts` |
| **Store** | `desktop/ui-src/store/index.ts` |
| **Views** | `desktop/ui-src/views/HomeView.tsx`, `desktop/ui-src/views/LibraryView.tsx`, `desktop/ui-src/views/PlayHistoryView.tsx`, `desktop/ui-src/views/RecentlyAddedView.tsx` |
| **Components** | `desktop/ui-src/components/Sidebar.tsx`, `desktop/ui-src/App.tsx` |
| **Core** | `desktop/src/core/database/helpers.ts` |

---

## 7. API summary

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/library/to-listen` | GET | Recently added unheard tracks |
| `/api/analytics/play-history` | GET | Chronological play events |
| `/api/tracks?played_days=N` | GET | Tracks played in last N days |
| `/api/tracks?sort_by=...` | GET | Sort by date_added, date_scanned, last_played, last_heard_at, play_count |

---

## 8. DB schema changes

- **tracks:** `date_scanned TEXT` (optional)
- **track_play_events:** (existing) `track_id`, `played_at`, `source`, `completed`, `position_seconds`
- **tracks:** `date_added` now comes from file `birthtime` (not scan time)
