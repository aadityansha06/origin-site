/**
 * ComparisonTable
 *
 * "How is your delete different" is the question every technical reader
 * asks first. This answers it directly instead of making them dig through
 * the write-up.
 *
 * NOTE on accuracy: row descriptions reflect the general, documented
 * behavior of each product's delete API as of when this was written —
 * confirmed Pinecone's delete/namespace-delete endpoints execute
 * immediately and irreversibly given a valid API key. The others are
 * described at the level of "how vector DB delete APIs work in general"
 * (immediate execution once authenticated, no independent local/human
 * confirmation step) rather than citing a specific current doc page for
 * each — verify against each vendor's current docs before publishing,
 * since delete semantics are exactly the kind of thing vendors change.
 */
const ROWS = [
  {
    system: "OriginDB",
    trigger: "Network request queues it; nothing executes automatically",
    who: "A human, locally, on the server",
    reversible: "Tombstoned — recoverable until process-deletes runs",
    leakedKey: "Can queue requests, cannot delete anything",
  },
  {
    system: "Pinecone",
    trigger: "API call with a valid API key",
    who: "Whoever holds the key — no separate confirmation step",
    reversible: "No — namespace/vector delete is immediate and permanent",
    leakedKey: "Can delete or wipe a namespace directly",
  },
  {
    system: "pgvector (Postgres)",
    trigger: "A DELETE statement from any writer role",
    who: "Whoever has DB write credentials",
    reversible: "No, unless you've built your own soft-delete column",
    leakedKey: "Can delete rows directly, same as any other table",
  },
  {
    system: "Qdrant / Milvus / Weaviate",
    trigger: "Authenticated delete/points-delete API call",
    who: "Whoever holds a write-scoped API key",
    reversible: "Generally no built-in tombstone-and-review step",
    leakedKey: "Can delete points/objects directly, same request path as insert",
  },
];

export function ComparisonTable() {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-neutral-800">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-neutral-800 bg-neutral-900/60 text-left">
            <th className="px-4 py-3 font-medium text-neutral-300">System</th>
            <th className="px-4 py-3 font-medium text-neutral-300">What triggers deletion</th>
            <th className="px-4 py-3 font-medium text-neutral-300">Who can finalize it</th>
            <th className="px-4 py-3 font-medium text-neutral-300">Reversible?</th>
            <th className="px-4 py-3 font-medium text-neutral-300">If the API key leaks</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr
              key={r.system}
              className={
                "border-b border-neutral-800 last:border-0 " +
                (r.system === "OriginDB" ? "bg-amber-500/5" : "")
              }
            >
              <td className="px-4 py-3 font-medium text-neutral-100 whitespace-nowrap">
                {r.system === "OriginDB" ? (
                  <span className="text-amber-400">{r.system}</span>
                ) : (
                  r.system
                )}
              </td>
              <td className="px-4 py-3 text-neutral-300">{r.trigger}</td>
              <td className="px-4 py-3 text-neutral-300">{r.who}</td>
              <td className="px-4 py-3 text-neutral-300">{r.reversible}</td>
              <td className="px-4 py-3 text-neutral-300">{r.leakedKey}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
