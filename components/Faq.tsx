/**
 * Faq
 *
 * Native <details>/<summary> accordion — no client JS needed, works with
 * find-in-page, and is fully crawlable. Paired with FAQPage JSON-LD so
 * eligible pages can surface as rich results in search.
 */
const FAQS = [
  {
    q: "Isn't this just soft delete?",
    a: "Soft delete usually just means a flag flips and anyone with write access can still flip it, still purge it, or still write code that ignores the flag — all over the network. OriginDB's queue can only be turned into an actual on-disk change by a human running a command locally on the server. The tombstone mechanism looks similar to soft delete; the access control around it is the actual difference.",
  },
  {
    q: "What if I need to delete data on a schedule, not by hand every time?",
    a: "That's what origin set-auto-delete is for — an administrator opts a table into an automatic run after N days, still decided and set by a human, just not requiring them to be present at execution time. Nothing runs on a schedule unless you explicitly configure it; there's no implicit timeout.",
  },
  {
    q: "Does this satisfy GDPR / CCPA right-to-erasure requirements?",
    a: "It doesn't replace your compliance process, and OriginDB isn't a compliance product — this is a description of the storage engine's mechanics, not legal advice. What it does give you is an audited, deliberate execution step instead of an API call anyone with a key can fire silently. If your erasure SLA requires deletion within a fixed number of hours, set an auto-delete schedule tight enough to meet it, or process the queue manually on that cadence.",
  },
  {
    q: "Isn't a mandatory human step just going to slow me down?",
    a: "For workloads that delete constantly — a chat app, a social feed — yes, this is a poor fit by design; see the README's \"poor fit\" section. For the read-heavy, rarely-deletes workloads this is built for (compliance archives, transaction search, media catalogs), the queue empties on a periodic cadence you control, and search results reflect a pending delete within about 2 seconds regardless of when the admin processes it — so the record stops appearing quickly even before the physical write happens.",
  },
  {
    q: "How is /delete-request different from a normal DELETE endpoint?",
    a: "A normal DELETE endpoint, once authenticated, performs the deletion. /delete-request only ever writes an entry to a pending queue — there is no code path from the network into an on-disk deletion. The only way bytes get erased is origin delete or origin process-deletes, run locally.",
  },
  {
    q: "Can someone probe which IDs exist by watching how /delete-request responds?",
    a: "No — the response is identical whether or not the ID corresponds to a real record. Existence is only resolved later, locally, when an administrator processes the queue, so timing or response-shape differences can't be used to enumerate real IDs.",
  },
  {
    q: "What actually happens on disk when a record is deleted?",
    a: "The vector's bytes stay on disk; a flag flips to mark the record as deleted (a tombstone), both in memory and in the file. There's currently no compaction step to reclaim that space or shrink the file — worth planning for if you expect to delete a large fraction of a table over time.",
  },
  {
    q: "Does the server have to go down to process a delete?",
    a: "Right now, yes — the server's accept loop runs in the foreground of the same process the admin CLI uses, so there's no way to run origin delete or origin process-deletes while origin server is running in that terminal. The workflow is: stop the server, open the table, run the delete, restart the server. That's a real, current limitation, not a design goal — every delete costs a brief outage today.",
  },
  {
    q: "Is OriginDB production-ready?",
    a: "No — it's explicitly early-stage / work in progress. Treat the delete architecture, the API, and the load-test numbers on this site as an accurate description of what the code does today, not a stability guarantee.",
  },
  {
    q: "What's the actual attack this design defends against?",
    a: "A leaked or stolen API key. In most systems, that key alone is enough to delete data outright the moment it's used — no second factor, no local step. Here, the same leaked key can queue delete requests, which is a nuisance an administrator can review and reject, but it can never by itself cause a real, permanent deletion.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.a,
    },
  })),
};

export function Faq() {
  return (
    <div className="w-full">
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="divide-y divide-neutral-800 rounded-xl border border-neutral-800">
        {FAQS.map((f) => (
          <details key={f.q} className="group px-5 py-4 open:pb-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-neutral-100 marker:content-none">
              {f.q}
              <span
                aria-hidden="true"
                className="shrink-0 text-neutral-500 transition-transform duration-150 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-neutral-400">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
