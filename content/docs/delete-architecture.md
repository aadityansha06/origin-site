---
title: Deferred Delete Architecture
description: Why a leaked API key can never delete your data — the full design, compared to how Pinecone, pgvector, Qdrant, Milvus, and Weaviate handle delete.
order: 1
---

# Deferred Delete Architecture: Why a Leaked API Key Can Never Delete Your Data

OriginDB's standout feature isn't a search algorithm — it's what it refuses
to let the network do. Deletion is split into two steps, on purpose:

- **Requesting** a deletion can be done over the network, with a normal
  per-table API key, via `POST /delete-request`.
- **Executing** a deletion — the only thing that actually removes a record
  from disk — can only ever be done locally, on the server itself, by a
  human running `origin delete` or `origin process-deletes`, with an
  explicit `y`/`n` confirmation.

There is no code path from the network into an on-disk deletion. A stolen
or leaked API key can queue delete requests — a nuisance an administrator
reviews and can reject — but it can never, by itself, cause a real,
permanent deletion.

## The flow

1. A backend caller sends `POST /delete-request` with a valid table API key.
2. The `id` is written to that table's pending-delete queue. Nothing else
   happens automatically.
3. The response is identical whether or not `id` corresponds to a real
   record — this is deliberate, so a caller can't work out which ids are
   real by watching how the server responds.
4. Within about 2 seconds, the queued id stops appearing in `/search`
   results, via the same background sync used for making fresh inserts
   visible — well before anyone processes the queue.
5. Nothing is physically removed until an administrator, locally, runs
   `origin process-deletes <table>`, sees the count of pending records, and
   confirms.
6. On confirmation, matching records are tombstoned — a flag flips both in
   memory and on disk. The vector's bytes remain on disk; there's currently
   no compaction step to reclaim that space.

Administrators who don't want to babysit the queue can opt a table into
`origin set-auto-delete <table> <days_from_now>` — a schedule they set,
that fires without further confirmation once it arrives. Nothing runs on a
schedule unless an administrator explicitly configures one; there is no
implicit timeout.

## How this compares to other vector databases

| System | What triggers deletion | Who can finalize it | Reversible? | If the API key leaks |
|---|---|---|---|---|
| **OriginDB** | Network request queues it; nothing executes automatically | A human, locally, on the server | Tombstoned — recoverable until `process-deletes` runs | Can queue requests, cannot delete anything |
| Pinecone | API call with a valid API key | Whoever holds the key — no separate confirmation step | No — vector/namespace delete is immediate and permanent | Can delete or wipe a namespace directly |
| pgvector (Postgres) | A `DELETE` statement from any writer role | Whoever has DB write credentials | No, unless you've built your own soft-delete column | Can delete rows directly, same as any other table |
| Qdrant / Milvus / Weaviate | Authenticated delete/points-delete API call | Whoever holds a write-scoped API key | Generally no built-in tombstone-and-review step | Can delete points/objects directly, same request path as insert |

> These rows describe how vector-database delete APIs work in general —
> execution as soon as the request is authenticated, with no independent
> local or human confirmation step. Vendor APIs change; verify against each
> product's current docs if you're citing this for a decision.

## Frequently asked questions

**Isn't this just soft delete?**
Soft delete usually means a flag flips, and anyone with write access can
still flip it, purge it, or ignore it — all over the network. OriginDB's
queue can only become an actual on-disk change via a human running a
command locally. The tombstone looks similar to soft delete; the access
control around it is the difference.

**What if I need deletion on a schedule, not by hand every time?**
`origin set-auto-delete` — an administrator opts a table in, and only once
that schedule arrives does the queue execute without further confirmation.

**Does this satisfy GDPR / CCPA right-to-erasure requirements?**
It isn't a compliance product and this isn't legal advice — it's a
description of the storage engine's mechanics. What it gives you is a
deliberate, auditable execution step instead of a silent API call. If your
erasure SLA needs deletion within a fixed window, set an auto-delete
schedule tight enough to meet it, or process the queue manually on that
cadence.

**Isn't a mandatory human step just going to slow me down?**
For workloads that delete constantly — a chat app, a social feed — yes,
this is a poor fit by design. For read-heavy, rarely-deletes workloads,
the queue empties on a cadence you control, and search results reflect a
pending delete within ~2 seconds regardless of when the physical write
happens.

**How is `/delete-request` different from a normal `DELETE` endpoint?**
A normal `DELETE` endpoint, once authenticated, performs the deletion.
`/delete-request` only ever writes an entry to a pending queue. The only
way bytes get erased is `origin delete` or `origin process-deletes`, run
locally.

**Can someone probe which IDs exist by watching how `/delete-request` responds?**
No — the response is identical regardless of whether the id is real.
Existence is only resolved later, locally, when an administrator processes
the queue.

**What actually happens on disk when a record is deleted?**
The vector's bytes stay on disk; a flag flips to mark it deleted, in memory
and in the file. There's no compaction step yet to reclaim that space or
shrink the file.

**Does the server have to go down to process a delete?**
Right now, yes. `origin server <port>` runs the accept loop in the
foreground of the same process the admin CLI uses, so admin commands
(including delete) can't run alongside it in that terminal. The workflow
today: stop the server, open the table, run the delete, restart the
server — a real, current limitation, not a design goal.

**Is OriginDB production-ready?**
No — it's explicitly early-stage / work in progress. Treat this document as
an accurate description of what the code does today, not a stability
guarantee.

**What attack does this actually defend against?**
A leaked or stolen API key. In most systems, that key alone is enough to
delete data outright the moment it's used. Here, the same leaked key can
queue delete requests — reviewable and rejectable by an administrator — but
it can never by itself cause a real, permanent deletion.

## Where this fits

**Good fit:** a bank's transaction/document search, a government records or
compliance archive, a media recommendation catalog, an internal
analytics/BI dataset — read-heavy, security-sensitive, and doesn't delete
often.

**Poor fit, for now:** a chat app, social feed, or anything where users
routinely delete their own content in real time, or any system needing
instant delete visibility with no review step.
