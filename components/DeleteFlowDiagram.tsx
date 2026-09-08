/**
 * DeleteFlowDiagram
 *
 * Replaces the old client-side "x² + y² = r²" ANN-radius circle demo.
 * That demo illustrated a generic nearest-neighbor concept any vector DB
 * has — it didn't teach anything about what actually makes OriginDB
 * different. This diagram shows the one thing that does: a delete request
 * can cross the network, but only a human, locally, can turn it into an
 * actual deletion.
 *
 * Fully server-rendered SVG — no client JS, no hydration cost, and it's
 * indexable text (via <title>/<desc> and the sr-only fallback below).
 */
export function DeleteFlowDiagram() {
  return (
    <figure className="w-full">
      <svg
        viewBox="0 0 960 320"
        className="w-full h-auto"
        role="img"
        aria-labelledby="delete-flow-title delete-flow-desc"
      >
        <title id="delete-flow-title">
          OriginDB deferred delete flow
        </title>
        <desc id="delete-flow-desc">
          A client sends a delete request over the network with an API key.
          It only ever reaches a pending-delete queue. Crossing into an
          actual on-disk deletion requires a human administrator, running a
          command locally on the server, who confirms before anything is
          written.
        </desc>

        {/* network zone */}
        <rect x="16" y="16" width="420" height="288" rx="16"
          className="fill-neutral-900 stroke-neutral-700" strokeWidth="1" />
        <text x="36" y="46" className="fill-neutral-400 text-[13px] font-mono">
          NETWORK — reachable with an API key
        </text>

        {/* local zone */}
        <rect x="524" y="16" width="420" height="288" rx="16"
          className="fill-neutral-900 stroke-amber-500/40" strokeWidth="1" />
        <text x="544" y="46" className="fill-amber-400 text-[13px] font-mono">
          LOCAL ONLY — requires a human at the server
        </text>

        {/* client box */}
        <rect x="48" y="80" width="180" height="64" rx="10" className="fill-neutral-800 stroke-neutral-600" strokeWidth="1" />
        <text x="138" y="106" textAnchor="middle" className="fill-neutral-100 text-[14px] font-medium">Backend / caller</text>
        <text x="138" y="126" textAnchor="middle" className="fill-neutral-400 text-[11px] font-mono">POST /delete-request</text>

        {/* arrow to queue */}
        <path d="M228 112 H320" className="stroke-neutral-500" strokeWidth="2" markerEnd="url(#arrow)" fill="none" />

        {/* queue box */}
        <rect x="320" y="80" width="96" height="64" rx="10" className="fill-neutral-800 stroke-neutral-600" strokeWidth="1" />
        <text x="368" y="106" textAnchor="middle" className="fill-neutral-100 text-[13px] font-medium">Pending</text>
        <text x="368" y="122" textAnchor="middle" className="fill-neutral-100 text-[13px] font-medium">delete queue</text>

        {/* leaked key annotation */}
        <path d="M138 144 V208" className="stroke-red-500/60" strokeWidth="2" strokeDasharray="4 4" fill="none" />
        <text x="138" y="228" textAnchor="middle" className="fill-red-400 text-[11px] font-mono">leaked key</text>
        <text x="138" y="244" textAnchor="middle" className="fill-red-400 text-[11px] font-mono">stops here —</text>
        <text x="138" y="260" textAnchor="middle" className="fill-red-400 text-[11px] font-mono">can only queue</text>

        {/* boundary marker */}
        <line x1="480" y1="16" x2="480" y2="304" className="stroke-amber-500" strokeWidth="2" strokeDasharray="6 6" />
        <text x="480" y="304" textAnchor="middle" className="fill-amber-500 text-[11px] font-mono" y2="316">boundary</text>

        {/* arrow into local zone (blocked / gated) */}
        <path d="M416 112 H560" className="stroke-neutral-600" strokeWidth="2" strokeDasharray="3 5" markerEnd="url(#arrowMuted)" fill="none" />
        <text x="488" y="100" textAnchor="middle" className="fill-neutral-500 text-[10px] font-mono">no automatic path</text>

        {/* admin box */}
        <rect x="560" y="80" width="180" height="64" rx="10" className="fill-neutral-800 stroke-amber-500/50" strokeWidth="1" />
        <text x="650" y="106" textAnchor="middle" className="fill-neutral-100 text-[14px] font-medium">Administrator</text>
        <text x="650" y="126" textAnchor="middle" className="fill-neutral-400 text-[11px] font-mono">origin process-deletes</text>

        {/* arrow to confirm */}
        <path d="M650 144 V184" className="stroke-amber-500" strokeWidth="2" markerEnd="url(#arrowAmber)" fill="none" />

        {/* confirm box */}
        <rect x="560" y="184" width="180" height="56" rx="10" className="fill-neutral-800 stroke-amber-500/50" strokeWidth="1" />
        <text x="650" y="208" textAnchor="middle" className="fill-neutral-100 text-[13px] font-medium">y/n confirmation</text>
        <text x="650" y="224" textAnchor="middle" className="fill-neutral-400 text-[11px] font-mono">explicit, per run</text>

        {/* arrow to disk */}
        <path d="M650 240 V264" className="stroke-amber-500" strokeWidth="2" markerEnd="url(#arrowAmber)" fill="none" />

        {/* disk box */}
        <rect x="560" y="264" width="180" height="36" rx="8" className="fill-neutral-800 stroke-neutral-600" strokeWidth="1" />
        <text x="650" y="286" textAnchor="middle" className="fill-neutral-100 text-[12px] font-mono">tombstone written to disk</text>

        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0 0 L8 4 L0 8 z" className="fill-neutral-500" />
          </marker>
          <marker id="arrowMuted" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0 0 L8 4 L0 8 z" className="fill-neutral-600" />
          </marker>
          <marker id="arrowAmber" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0 0 L8 4 L0 8 z" className="fill-amber-500" />
          </marker>
        </defs>
      </svg>

      <figcaption className="sr-only">
        A backend caller can only POST a delete request into a pending
        queue over the network. Turning that into a real deletion requires
        an administrator to run a command locally on the server and
        explicitly confirm — only then is a tombstone written to disk. A
        leaked API key can queue requests but cannot cross the boundary
        into an actual deletion.
      </figcaption>
    </figure>
  );
}
