import { useEffect, useState } from "react";
import fitdLogo from "@/assets/fitd-logo.png";

/* ──────────────────────────────────────────────────────────────
   TURTLE PARSER
   Parses a raw .ttl string and extracts:
   - ontology metadata (version, title, triples count)
   - per-subject blocks: label, comment, types, llmDescriptor,
     rdfs:subClassOf, owl:equivalentClass, schema:isPartOf
   Returns a flat list of ParsedTerm entries grouped by section
────────────────────────────────────────────────────────────── */

type ParsedTerm = {
  uri: string;          // e.g. fitd:ActionRoll
  label: string;
  types: string[];      // owl:Class, owl:NamedIndividual, rpg:*, …
  comment: string;
  equivalentClass?: string;
  subClassOf?: string;
  isPartOf?: string;
  llmDescriptor?: string;
  sectionHint?: string; // derived from comment section headers
};

type OntologyMeta = {
  version: string;
  title: string;
  tripleCount: number;
  namespace: string;
};

function parseTurtle(raw: string): { meta: OntologyMeta; terms: ParsedTerm[] } {
  // Normalise line endings
  const text = raw.replace(/\r\n/g, "\n");

  /* ── 1. extract ontology meta ── */
  const versionMatch = text.match(/owl:versionInfo\s+"([^"]+)"/);
  const titleMatch = text.match(/dc:title\s+"([^"]+)"/);
  const nsMatch = text.match(/@prefix fitd:\s+<([^>]+)>/);

  const meta: OntologyMeta = {
    version: versionMatch?.[1] ?? "2.0.0",
    title: titleMatch?.[1] ?? "Forged in the Dark Ontology",
    tripleCount: (text.match(/\./g) ?? []).length, // rough proxy
    namespace: nsMatch?.[1] ?? "https://schema.rpg-schema.org/fitd#",
  };

  /* ── 2. split into subject blocks ── */
  // Blocks are separated by blank lines before a fitd: or rpg: subject line
  const terms: ParsedTerm[] = [];

  // Collect inline prefix mappings for expansion
  const prefixMap: Record<string, string> = {};
  for (const m of text.matchAll(/@prefix\s+(\S+):\s+<([^>]+)>/g)) {
    prefixMap[m[1]] = m[2];
  }

  // We parse subject blocks delimited by lines starting with `fitd:XYZ`
  // Strategy: collect everything between two "fitd:\w+" subject lines
  // We use a simple state machine over lines.
  const lines = text.split("\n");
  let currentSubject = "";
  let blockLines: string[] = [];

  const flushBlock = (subject: string, bLines: string[]) => {
    if (!subject.startsWith("fitd:")) return;
    const block = bLines.join("\n");

    const getStr = (pred: string) => {
      // triple-quoted
      const tq = block.match(new RegExp(`${pred}\\s+"""([\\s\\S]*?)"""`, "m"));
      if (tq) return tq[1].trim();
      // single-quoted
      const sq = block.match(new RegExp(`${pred}\\s+"([^"]*)"`, "m"));
      return sq?.[1]?.trim() ?? "";
    };

    const getRef = (pred: string) => {
      const m = block.match(new RegExp(`${pred}\\s+(\\S+?)\\s*[;\\.]`, "m"));
      return m?.[1]?.trim() ?? "";
    };

    const getAllTypes = (): string[] => {
      // collect everything after `a ` and before `;` or `.`
      // handles multi-value: a owl:Class, rpg:RuleSetAttribute ;
      const types: string[] = [];
      for (const m of block.matchAll(/(?:^|\s)a\s+([\w:]+(?:\s*,\s*[\w:]+)*)/gm)) {
        for (const t of m[1].split(",")) {
          const clean = t.trim();
          if (clean) types.push(clean);
        }
      }
      return types;
    };

    const mapType = (t: string): string => {
      // normalise types to human-readable ontology terms
      if (t === "owl:Class") return "owl:Class";
      if (t === "owl:NamedIndividual") return "owl:NamedIndividual";
      if (t === "owl:ObjectProperty") return "owl:ObjectProperty";
      if (t === "owl:DatatypeProperty") return "owl:DatatypeProperty";
      if (t === "rpg:RuleSetAttribute") return "rpg:RuleSetAttribute";
      if (t === "rpg:Tracker") return "rpg:Tracker";
      if (t === "rpg:Tag") return "rpg:Tag";
      if (t === "rpg:Phase") return "rpg:Phase";
      if (t === "rpg:LLMArtifactType") return "rpg:LLMArtifactType";
      if (t === "rpg:RollModifier") return "rpg:RollModifier";
      if (t === "rpg:RiskPosition") return "rpg:RiskPosition";
      if (t === "rpg:EffectLevel") return "rpg:EffectLevel";
      if (t === "rpg:DicePoolModel") return "rpg:DicePoolModel";
      if (t === "rpg:RuleSet") return "rpg:RuleSet";
      if (t === "rpg:Clock") return "rpg:Clock";
      return t;
    };

    const rawTypes = getAllTypes();
    const types = rawTypes.map(mapType).filter(Boolean);

    // Derive best display type in priority order
    const bestType = (() => {
      const priority = [
        "owl:Class", "owl:ObjectProperty", "owl:DatatypeProperty",
        "rpg:RuleSetAttribute", "rpg:Tracker", "rpg:Tag", "rpg:Phase",
        "rpg:LLMArtifactType", "rpg:RollModifier", "rpg:RiskPosition",
        "rpg:EffectLevel", "rpg:DicePoolModel", "rpg:RuleSet", "rpg:Clock",
        "owl:NamedIndividual",
      ];
      for (const p of priority) {
        if (types.includes(p)) return p;
      }
      return types[0] ?? "owl:NamedIndividual";
    })();

    const label = getStr("rdfs:label") || getStr("schema:name") || subject.replace("fitd:", "");
    const comment = getStr("rdfs:comment") || getStr("schema:description");
    const llmDescriptor = getStr("rpg:llmDescriptor");
    const equivalentClass = getRef("owl:equivalentClass");
    const subClassOf = getRef("rdfs:subClassOf");
    const isPartOf = getRef("schema:isPartOf");

    terms.push({
      uri: subject,
      label,
      types: [bestType],
      comment,
      equivalentClass,
      subClassOf,
      isPartOf,
      llmDescriptor,
    });
  };

  for (const line of lines) {
    const subjectMatch = line.match(/^(fitd:\w+)\s*$/);
    const subjectInlineMatch = line.match(/^(fitd:\w+)\s+\S/);
    const subject = subjectMatch?.[1] ?? subjectInlineMatch?.[1];

    if (subject && subject !== currentSubject) {
      flushBlock(currentSubject, blockLines);
      currentSubject = subject;
      blockLines = [line];
    } else {
      blockLines.push(line);
    }
  }
  flushBlock(currentSubject, blockLines);

  return { meta, terms };
}

/* ──────────────────────────────────────────────────────────────
   SECTION GROUPING
   Map terms into sections using a keyword/type heuristic.
   This mirrors the ontology's own comment-based section headers.
────────────────────────────────────────────────────────────── */

type DynSection = {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  terms: { term: string; type: string; note: string }[];
};

const SECTION_MAP: { id: string; num: string; title: string; subtitle: string; keywords: RegExp }[] = [
  { id: "resolution",  num: "§01", title: "Resolution Model",        subtitle: "Roll types and dice pool mechanics",                               keywords: /Roll|DicePool|Modifier|AssistModifier|PushYourself|DevilsBargain|FITDRuleSet|DicePoolModel/i },
  { id: "position",    num: "§02", title: "Position",                 subtitle: "Risk level governing consequence severity",                        keywords: /Position|Controlled|Risky|Desperate/i },
  { id: "effect",      num: "§03", title: "Effect Level",             subtitle: "Magnitude of impact when a roll succeeds",                        keywords: /Effect(?!Level_Knob|Level$)|ZeroEffect|LimitedEffect|StandardEffect|GreatEffect|ExtremeEffect|EffectLevel/i },
  { id: "attributes",  num: "§04", title: "Attributes & Actions",     subtitle: "Three attributes, twelve actions — all as rpg:RuleSetAttribute",  keywords: /Insight|Prowess|Resolve|Hunt|Study|Survey|Tinker|Finesse|Prowl|Skirmish|Wreck|Attune|Command|Consort|Sway/i },
  { id: "harm",        num: "§05", title: "Harm, Stress & Consequences", subtitle: "Lasting debility, expenditure resource, and consequence types", keywords: /Harm|Trauma|Cold|Haunted|Obsessed|Paranoid|Reckless|Soft|Unstable|Vicious|Consequence|ReducedEffect|Complication|LostOpportunity|WorsePosition/i },
  { id: "trackers",    num: "§06", title: "Trackers",                 subtitle: "Numeric state machines for characters and crew",                   keywords: /Tracker/i },
  { id: "clocks",      num: "§07", title: "Progress Clocks",          subtitle: "Segmented circles tracking effort, danger, and time",             keywords: /Clock|ProgressClock/i },
  { id: "actors",      num: "§08", title: "Actors",                   subtitle: "Character, Crew, Faction, Cohort",                                keywords: /Actor|Character|Crew|Faction|Cohort|FactionRelationship/i },
  { id: "playbook",    num: "§09", title: "Playbook & Advancement",   subtitle: "Character templates, XP triggers, crew advancement",              keywords: /Playbook|SpecialAbility|XPTrigger|CrewAdvance/i },
  { id: "score",       num: "§10", title: "Score & Flashback",        subtitle: "The primary dramatic unit and FITD-exclusive mechanics",          keywords: /Score|Flashback|Payoff|Plan|Assist$|GroupAction|Protect|SetUp/i },
  { id: "downtime",    num: "§11", title: "Downtime, Vice & Rituals", subtitle: "Recovery, advancement, and arcane working",                       keywords: /Vice|Ritual|Crafting|Invention|Magnitude|Claim|IndulgeVice|Recover|LongTermProject|AcquireAsset|ReduceHeat|Train$|AttractTrouble|Brag|Lost|Tapped/i },
  { id: "items",       num: "§12", title: "Items, Load & LLMArtifact Types", subtitle: "Equipment, drawbacks, armor, load, and annotation vocabulary", keywords: /Item|Drawback|Armor|Load|ArtifactType|MundaneCreation|AlchemicalCreation|ArcaneCreation|SparkCraftCreation/i },
];

function groupTermsIntoSections(terms: ParsedTerm[]): DynSection[] {
  const buckets: Record<string, { term: string; type: string; note: string }[]> = {};
  SECTION_MAP.forEach((s) => { buckets[s.id] = []; });

  for (const t of terms) {
    const localName = t.uri.replace("fitd:", "");
    // skip the ruleset root individual itself — it's shown in the header
    if (localName === "FITDRuleSet" || localName === "DicePoolModel_FITD") {
      buckets["resolution"].push({
        term: t.uri,
        type: t.types[0],
        note: t.comment || t.llmDescriptor?.slice(0, 120) || "",
      });
      continue;
    }

    let placed = false;
    for (const sec of SECTION_MAP) {
      if (sec.keywords.test(localName)) {
        buckets[sec.id].push({
          term: t.uri,
          type: t.types[0],
          note: t.comment || t.llmDescriptor?.slice(0, 120) || "",
        });
        placed = true;
        break;
      }
    }
    if (!placed) {
      // fallback: use subClassOf / equivalentClass / isPartOf hints
      const ref = (t.subClassOf || t.equivalentClass || "").toLowerCase();
      const sec = SECTION_MAP.find((s) => s.keywords.test(ref));
      if (sec) {
        buckets[sec.id].push({ term: t.uri, type: t.types[0], note: t.comment || "" });
      }
      // truly unclassified — silently skip rather than pollute UI
    }
  }

  return SECTION_MAP.map((s) => ({
    id: s.id,
    num: s.num,
    title: s.title,
    subtitle: s.subtitle,
    terms: buckets[s.id],
  }));
}

/* ──────────────────────────────────────────────────────────────
   COMPONENT
────────────────────────────────────────────────────────────── */

export default function Index() {
  const [activeSection, setActiveSection] = useState("resolution");
  const [meta, setMeta] = useState<OntologyMeta>({
    version: "2.0.0",
    title: "Forged in the Dark Ontology",
    tripleCount: 1039,
    namespace: "https://schema.rpg-schema.org/fitd#",
  });
  const [sections, setSections] = useState<DynSection[]>([]);
  const [rawTtl, setRawTtl] = useState<string>("");
  const [loading, setLoading] = useState(true);

  /* ── fetch + parse TTL ── */
  useEffect(() => {
    fetch("/fitd.ttl")
      .then((r) => r.text())
      .then((text) => {
        setRawTtl(text);
        const { meta: m, terms } = parseTurtle(text);
        setMeta(m);
        setSections(groupTermsIntoSections(terms));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  /* ── intersection observer for nav ── */
  useEffect(() => {
    if (!sections.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [sections]);

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = "/fitd.ttl";
    a.download = "fitd.ttl";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /* ── prefix snippet for the code block ── */
  const prefixSnippet = rawTtl.split("\n").filter((l) => l.startsWith("@prefix") || l.startsWith("<https://schema.rpg-schema.org/fitd>") || l.startsWith("    a owl:Ontology") || l.startsWith("    dc:") || l.startsWith("    owl:")).slice(0, 18).join("\n");

  const NAMESPACE = meta.namespace;

  return (
    <div className="relative min-h-screen bg-background text-foreground">

      {/* HERO */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-32 min-h-[90vh]">
        <p
          className="uppercase tracking-[0.25em] text-xs mb-10 flex items-center gap-2"
          style={{ color: "hsl(var(--gold))", fontFamily: "var(--font-mono)" }}
        >
          <span className="inline-block w-3 h-px" style={{ background: "hsl(var(--gold))" }} />
          rpg-schema.org — System Reference Document
          <span className="inline-block w-3 h-px" style={{ background: "hsl(var(--gold))" }} />
        </p>

        <h1
          className="text-[clamp(4rem,14vw,9rem)] leading-none font-black uppercase tracking-tight mb-2"
          style={{
            fontFamily: "var(--font-display)",
            color: "hsl(var(--gold))",
            textShadow: "0 2px 40px hsl(var(--gold) / 0.18)",
          }}
        >
          Forged in the Dark
        </h1>

        <p
          className="text-xl md:text-2xl italic max-w-xl mt-6 mb-8 leading-relaxed"
          style={{ fontFamily: "var(--font-display)", color: "hsl(var(--foreground) / 0.75)" }}
        >
          "You've assembled your crew. The target is chosen. What could go wrong?"
        </p>

        <p
          className="text-xs uppercase tracking-[0.2em] flex items-center gap-3 mb-8"
          style={{ color: "hsl(var(--muted-foreground))", fontFamily: "var(--font-mono)" }}
        >
          <span>John Harper</span>
          <span style={{ color: "hsl(var(--gold-dim))" }}>•</span>
          <span>Evil Hat Productions</span>
          <span style={{ color: "hsl(var(--gold-dim))" }}>•</span>
          <span>CC-BY</span>
        </p>

        {/* Version badge — dynamically populated */}
        <p
          className="text-xs font-mono px-3 py-1 border border-border"
          style={{ color: "hsl(var(--muted-foreground))", background: "hsl(0 0% 8%)" }}
        >
          {loading
            ? "Loading ontology…"
            : `v${meta.version} · owl:imports <https://schema.rpg-schema.org/rpg> · ${sections.reduce((a, s) => a + s.terms.length, 0)} terms parsed`}
        </p>
      </section>

      {/* STICKY NAV */}
      <nav
        className="sticky top-0 z-50 border-b border-border overflow-x-auto"
        style={{ background: "hsl(var(--background) / 0.97)", backdropFilter: "blur(8px)" }}
      >
        <div className="flex items-center min-w-max px-6">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="shrink-0 mr-6 py-3 pr-6 border-r border-border"
          >
            <img src={fitdLogo} alt="FITD" className="h-6 w-auto" style={{ filter: "invert(1) brightness(0.85)" }} />
          </button>

          <div className="flex items-center">
            {SECTION_MAP.map((n) => (
              <button
                key={n.id}
                onClick={() => scrollTo(n.id)}
                className="px-3 py-3.5 text-xs uppercase tracking-widest transition-colors whitespace-nowrap"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: activeSection === n.id ? "hsl(var(--gold))" : "hsl(var(--muted-foreground))",
                  borderBottom: activeSection === n.id ? "2px solid hsl(var(--gold))" : "2px solid transparent",
                }}
              >
                {n.title.split(" ")[0]}
              </button>
            ))}
          </div>

          <div className="ml-auto pl-6 border-l border-border shrink-0">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-3.5 text-xs uppercase tracking-widest transition-colors"
              style={{ fontFamily: "var(--font-mono)", color: "hsl(var(--gold))" }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = "0.7")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = "1")}
            >
              <DownloadIcon />
              TTL
            </button>
          </div>
        </div>
      </nav>

      {/* CONTENT */}
      <main className="max-w-5xl mx-auto px-6 py-16 space-y-24">

        {loading && (
          <div className="flex items-center justify-center py-32">
            <p className="text-sm font-mono animate-pulse" style={{ color: "hsl(var(--gold))" }}>
              Parsing ontology…
            </p>
          </div>
        )}

        {!loading && sections.map((sec) => (
          <section key={sec.id} id={sec.id} className="scroll-mt-16">
            <div className="mb-8">
              <p className="text-sm mb-1" style={{ color: "hsl(var(--gold))", fontFamily: "var(--font-mono)" }}>
                {sec.num}
              </p>
              <h2
                className="text-4xl md:text-5xl font-bold mb-2"
                style={{ color: "hsl(var(--gold))", fontFamily: "var(--font-display)" }}
              >
                {sec.title}
              </h2>
              <p className="text-base italic" style={{ color: "hsl(var(--foreground) / 0.6)", fontFamily: "var(--font-display)" }}>
                {sec.subtitle}
              </p>
              <div className="mt-4 h-px w-full" style={{ background: "hsl(var(--border))" }} />
            </div>

            {sec.terms.length > 0 ? (
              <div>
                <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "hsl(var(--muted-foreground))", fontFamily: "var(--font-mono)" }}>
                  Ontology Terms — {sec.terms.length} parsed
                </p>
                <table className="w-full text-sm border border-border">
                  <thead>
                    <tr style={{ background: "hsl(0 0% 6%)" }}>
                      {["Term", "Type", "Notes"].map((h) => (
                        <th
                          key={h}
                          className="text-left px-4 py-2.5 font-mono text-xs tracking-widest border-b border-border"
                          style={{ color: "hsl(var(--muted-foreground))" }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {sec.terms.map((t) => (
                      <tr
                        key={t.term}
                        style={{ background: "hsl(var(--card))" }}
                        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "hsl(0 0% 10%)")}
                        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "hsl(var(--card))")}
                      >
                        <td className="px-4 py-2.5 font-mono text-xs" style={{ color: "hsl(var(--gold))" }}>{t.term}</td>
                        <td className="px-4 py-2.5 font-mono text-xs">
                          <TypeBadge type={t.type} />
                        </td>
                        <td className="px-4 py-2.5 font-mono text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{t.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs font-mono py-4" style={{ color: "hsl(var(--muted-foreground))" }}>
                No terms parsed for this section from the current TTL file.
              </p>
            )}
          </section>
        ))}

        {/* ONTOLOGY FILE */}
        {!loading && (
          <section id="ttl" className="scroll-mt-16 pt-8 border-t border-border">
            <p className="text-sm mb-1" style={{ color: "hsl(var(--gold))", fontFamily: "var(--font-mono)" }}>§TTL</p>
            <h2 className="text-4xl font-bold mb-2" style={{ color: "hsl(var(--gold))", fontFamily: "var(--font-display)" }}>Ontology File</h2>
            <p className="italic text-base mb-6" style={{ color: "hsl(var(--foreground) / 0.6)", fontFamily: "var(--font-display)" }}>Download the complete Turtle / OWL 2 file</p>
            <div className="h-px w-full mb-8" style={{ background: "hsl(var(--border))" }} />

            <p className="mb-6 leading-relaxed" style={{ color: "hsl(var(--foreground) / 0.8)", fontFamily: "var(--font-body)" }}>
              <code className="font-mono text-sm px-1.5 py-0.5" style={{ background: "hsl(0 0% 10%)", color: "hsl(var(--gold))" }}>fitd.ttl</code> is a single Turtle file containing the complete
              OWL 2 ontology — v{meta.version}, aligned to rpg-schema.org/rpg via{" "}
              <code className="font-mono text-sm px-1.5 py-0.5" style={{ background: "hsl(0 0% 10%)", color: "hsl(var(--gold))" }}>owl:equivalentClass</code> and{" "}
              <code className="font-mono text-sm px-1.5 py-0.5" style={{ background: "hsl(0 0% 10%)", color: "hsl(var(--gold))" }}>owl:imports</code>.
              Load it into Protégé, Apache Jena, ROBOT, or any OWL-compatible tool.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-3 px-6 py-3 border text-sm uppercase tracking-widest transition-all"
                style={{ fontFamily: "var(--font-mono)", color: "hsl(var(--gold))", borderColor: "hsl(var(--gold))" }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = "hsl(var(--gold))";
                  (e.currentTarget as HTMLElement).style.color = "hsl(var(--ink))";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "hsl(var(--gold))";
                }}
              >
                <DownloadIcon />
                Download fitd.ttl
              </button>
              <a
                href={NAMESPACE}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 border text-sm uppercase tracking-widest transition-colors"
                style={{ fontFamily: "var(--font-mono)", color: "hsl(var(--muted-foreground))", borderColor: "hsl(var(--border))" }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "hsl(var(--foreground))")}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "hsl(var(--muted-foreground))")}
              >
                Namespace URI ↗
              </a>
            </div>

            <pre
              className="text-xs p-5 overflow-x-auto border border-border"
              style={{ background: "hsl(0 0% 4%)", fontFamily: "var(--font-mono)", lineHeight: 1.8, color: "hsl(var(--foreground) / 0.75)" }}
            >
              {prefixSnippet || rawTtl.slice(0, 600)}
            </pre>
          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border mt-16" style={{ background: "hsl(0 0% 4%)" }}>
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))", fontFamily: "var(--font-mono)" }}>
              fitd.rpg-schema.org · v{meta.version} · Based on the{" "}
              <em>Blades in the Dark</em> SRD by John Harper · Evil Hat Productions · CC-BY
            </p>
            <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))", fontFamily: "var(--font-mono)" }}>
              made with ❤️ in Bologna by FantasyMaps
            </p>
          </div>
          <a
            href="https://rpg-schema.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs transition-colors"
            style={{ color: "hsl(var(--muted-foreground))", fontFamily: "var(--font-mono)" }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "hsl(var(--gold))")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "hsl(var(--muted-foreground))")}
          >
            ← rpg-schema.org
          </a>
        </div>
      </footer>
    </div>
  );
}

/* ── helpers ── */
function TypeBadge({ type }: { type: string }) {
  const palette: Record<string, { bg: string; color: string }> = {
    "owl:Class":              { bg: "hsl(10 70% 35% / 0.25)",  color: "hsl(10 80% 65%)" },
    "owl:NamedIndividual":    { bg: "hsl(210 60% 40% / 0.2)",  color: "hsl(210 80% 70%)" },
    "owl:ObjectProperty":     { bg: "hsl(140 50% 30% / 0.2)",  color: "hsl(140 60% 55%)" },
    "owl:DatatypeProperty":   { bg: "hsl(270 40% 40% / 0.2)",  color: "hsl(270 60% 70%)" },
    "rpg:RuleSetAttribute":   { bg: "hsl(35 60% 30% / 0.25)",  color: "hsl(35 80% 60%)" },
    "rpg:Tracker":            { bg: "hsl(180 50% 25% / 0.25)", color: "hsl(180 70% 55%)" },
    "rpg:Tag":                { bg: "hsl(300 40% 30% / 0.2)",  color: "hsl(300 60% 65%)" },
    "rpg:Phase":              { bg: "hsl(60 50% 25% / 0.2)",   color: "hsl(60 70% 55%)" },
    "rpg:LLMArtifactType":    { bg: "hsl(0 0% 15%)",           color: "hsl(0 0% 65%)" },
    "rpg:RollModifier":       { bg: "hsl(25 60% 30% / 0.25)",  color: "hsl(25 80% 62%)" },
    "rpg:RiskPosition":       { bg: "hsl(0 55% 30% / 0.25)",   color: "hsl(0 70% 65%)" },
    "rpg:EffectLevel":        { bg: "hsl(190 50% 25% / 0.25)", color: "hsl(190 70% 55%)" },
    "rpg:DicePoolModel":      { bg: "hsl(45 60% 25% / 0.25)",  color: "hsl(45 80% 58%)" },
    "rpg:RuleSet":            { bg: "hsl(220 50% 30% / 0.25)", color: "hsl(220 80% 68%)" },
    "rpg:Clock":              { bg: "hsl(160 50% 25% / 0.25)", color: "hsl(160 70% 55%)" },
  };
  const s = palette[type] ?? { bg: "hsl(0 0% 15%)", color: "hsl(0 0% 60%)" };
  return (
    <span className="px-2 py-0.5 text-xs font-mono rounded-sm" style={{ background: s.bg, color: s.color }}>
      {type}
    </span>
  );
}

function DownloadIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 1v7M3 5l3 3 3-3M1 10h10" />
    </svg>
  );
}
