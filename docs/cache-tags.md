# Cache Tags

This file is the human-readable registry for cache tags used with Next.js `cacheTag`, `revalidateTag`, and `updateTag`.

The code registry lives in [`lib/cache-tags.ts`](../lib/cache-tags.ts). Add new tags there first, then document them here.

## Hierarchy

```text
projects
├─ projects:db
├─ projects:list
├─ projects:grid
├─ projects:{projectId}
│  └─ projects:{projectId}:image
└─ open-collective:projects:{slug}:balance
```

## Tag Reference

| Tag | Owner | Current lifetime | What it covers |
| --- | --- | --- | --- |
| `projects` | Project domain | Mixed | Broad project-domain tag. Invalidates every project listing, project card, and project balance cache currently used on the landing page. |
| `projects:db` | Database project records | `days` | DB-backed project listing data: project id, title, short description, OpenCollective slug, and primary image URL. |
| `projects:list` | Database project list | `days` | The ordered list of projects shown in listing UIs. Use when list membership or sort order changes. |
| `projects:grid` | Landing page project UI | `hours` | The cached rendered project grid shell on the landing page. |
| `projects:{projectId}` | One DB project | `hours`/`days` depending on caller | All cached data derived from one local project row. |
| `projects:{projectId}:image` | One project's primary image | `days` | Cached data derived from the project's primary image selection or URL. |
| `open-collective:projects:{id}:balance` | OpenCollective | `hours` | Cached OpenCollective balance for one project. |

## Invalidation Guide

Use the narrowest tags that match the mutation.
Use `updateTag` from Server Actions when the user should see their own write immediately.
Use `revalidateTag` from Route Handlers, cron jobs, webhooks, or other non-action contexts.

| Event | Invalidate these tags |
| --- | --- |
| Create project | `projects:list`, `projects:grid` |
| Delete project | `projects:list`, `projects:grid`, `projects:{projectId}` |
| Edit project title or short description | `projects:{projectId}`, `projects:grid` |
| Change project creation date or any list sort field | `projects:list`, `projects:grid`, `projects:{projectId}` |
| Change project primary image | `projects:{projectId}:image`, `projects:{projectId}`, `projects:grid` |
| Change project OpenCollective slug | `projects:{projectId}`, `projects:grid`, `open-collective:projects:{oldSlug}:balance`, `open-collective:projects:{newSlug}:balance` |
| OpenCollective balance webhook or scheduled balance refresh | `open-collective:projects:{slug}:balance`, `projects:grid` |
| Successful contribution through the project-page embed | `open-collective:projects:{slug}:balance`, `projects:grid` |
| Bulk project import or admin repair | `projects` |

## Notes

- Prefer feature/domain tags over implementation tags. For example,
  `projects:list` describes the data surface; it does not assume Drizzle,
  Postgres, or a specific component.
- Keep `projects` as the emergency broad invalidation tag. Normal writes should
  use narrower tags so unrelated cached work survives.
- If a new page renders a different project collection, add a page/surface tag
  such as `projects:admin-table` rather than reusing `projects:grid`.
- If a tag needs an id, prefer local database ids for local data and external
  slugs/ids for external data.
