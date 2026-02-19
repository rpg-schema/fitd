import { useEffect, useState } from "react";
import fitdLogo from "@/assets/fitd-logo.png";

const VERSION = "2.0.0";
const NAMESPACE = "https://schema.rpg-schema.org/fitd#";

/* ── NAV SECTIONS ── */
const NAV = [
  { id: "resolution",  label: "Resolution" },
  { id: "position",   label: "Position" },
  { id: "effect",     label: "Effect" },
  { id: "attributes", label: "Attributes" },
  { id: "harm",       label: "Harm & Stress" },
  { id: "trackers",   label: "Trackers" },
  { id: "clocks",     label: "Clocks" },
  { id: "actors",     label: "Actors" },
  { id: "playbook",   label: "Playbook" },
  { id: "score",      label: "Score" },
  { id: "downtime",   label: "Downtime" },
  { id: "items",      label: "Items" },
];

/* ── TYPES ── */
type Card  = { title: string; body: string };
type TermRow = {
  term: string;
  type: "owl:Class" | "owl:NamedIndividual" | "owl:ObjectProperty" | "owl:DatatypeProperty" | "rpg:RuleSetAttribute" | "rpg:Tracker" | "rpg:Tag" | "rpg:Phase" | "rpg:LLMArtifactType";
  note: string;
};
type Section = {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  intro?: string;
  cards?: Card[];
  terms?: TermRow[];
};

/* ── CONTENT ── */
const SECTIONS: Section[] = [
  {
    id: "resolution",
    num: "§01",
    title: "Resolution Model",
    subtitle: "Roll types and dice pool mechanics",
    intro: "Every uncertain moment resolves through a pool of d6s. Read the single highest die: 1–3 bad outcome, 4–5 partial success, 6 full success, two or more 6s = critical. Pool ≤ 0: roll 2d6 take the lowest; no critical possible. Six roll types cover every situation.",
    cards: [
      { title: "Action Roll", body: "Primary roll. Pre-roll checklist: Goal, Action (one of 12), Position (GM-set), Effect (GM-set). Desperate roll grants 1 XP in the rolled attribute." },
      { title: "Resistance Roll", body: "Offered by a player to reduce or avoid a consequence. Pool = attribute rating. Cost = 6 − highest die in stress. Critical clears 1 stress instead of costing it." },
      { title: "Fortune Roll", body: "GM-called roll for off-screen outcomes — faction activity, NPC actions, healing progress, or any uncertain situation where PCs are not directly involved." },
      { title: "Engagement Roll", body: "Made once per score after planning. Fortune roll starting at 1d. Modifiers for plan advantages/disadvantages. Result: 1–3 Desperate, 4–5 Risky, 6 Controlled, Crit = beyond first obstacle." },
      { title: "Vice Roll", body: "Downtime roll to clear stress. Pool = lowest attribute rating. Stress cleared = highest die. Overindulge if clearing more than currently marked." },
      { title: "Downtime Roll", body: "Resolves downtime activities. Pool = relevant action or Tier. Coin may be spent 1-for-1 after rolling to raise result level." },
    ],
    terms: [
      { term: "fitd:FITDRuleSet",        type: "rpg:RuleSetAttribute",   note: "Root ruleset individual; links all components." },
      { term: "fitd:DicePoolModel_FITD", type: "owl:NamedIndividual",    note: "Nd6 take highest; ≤0 pool rolls 2d take lowest." },
      { term: "fitd:Roll",               type: "owl:Class",              note: "owl:equivalentClass rpg:Roll. Abstract superclass." },
      { term: "fitd:ActionRoll",         type: "owl:Class",              note: "rdfs:subClassOf rpg:Roll. Requires Position + Effect." },
      { term: "fitd:ResistanceRoll",     type: "owl:Class",              note: "rdfs:subClassOf rpg:Roll. Always reduces consequence." },
      { term: "fitd:FortuneRoll",        type: "owl:Class",              note: "rdfs:subClassOf rpg:Roll. GM-called; no Position framing." },
      { term: "fitd:EngagementRoll",     type: "owl:Class",              note: "rdfs:subClassOf fitd:FortuneRoll. Sets score opening." },
      { term: "fitd:ViceRoll",           type: "owl:Class",              note: "rdfs:subClassOf fitd:DowntimeRoll. Stress relief." },
      { term: "fitd:DowntimeRoll",       type: "owl:Class",              note: "rdfs:subClassOf rpg:Roll. Coin spend 1-for-1." },
      { term: "fitd:AssistModifier",     type: "owl:NamedIndividual",    note: "rpg:RollModifier. Teammate takes 1 stress → +1d." },
      { term: "fitd:PushYourselfModifier", type: "owl:NamedIndividual",  note: "rpg:RollModifier. 2 stress → +1d or +1 effect." },
      { term: "fitd:DevilsBargainModifier", type: "owl:NamedIndividual", note: "rpg:RollModifier. +1d but complication regardless." },
    ],
  },
  {
    id: "position",
    num: "§02",
    title: "Position",
    subtitle: "Risk level governing consequence severity",
    intro: "Position is set before every action roll. It determines how bad the consequences are on a partial or bad outcome. The GM sets it; players may push for a better one. Position is equivalent to rpg:RiskPosition.",
    cards: [
      { title: "Controlled", body: "You have the upper hand. Worst result is a minor complication, reduced effect, or trivial cost — no immediate serious harm." },
      { title: "Risky", body: "The default. Moderate danger. Bad outcome brings real harm or a potent consequence. The typical position for most action rolls." },
      { title: "Desperate", body: "Serious trouble. Even partial success carries a stiff cost. Bad outcome brings severe harm or catastrophic consequences. Grants 1 XP in the rolled attribute." },
    ],
    terms: [
      { term: "fitd:Position",      type: "owl:Class",           note: "owl:equivalentClass rpg:RiskPosition." },
      { term: "fitd:Position_Knob", type: "owl:NamedIndividual", note: "rpg:RiskPosition individual for the ruleset." },
      { term: "fitd:Controlled",    type: "owl:NamedIndividual", note: "rpg:RiskPosition. Least risky; minor consequences." },
      { term: "fitd:Risky",         type: "owl:NamedIndividual", note: "rpg:RiskPosition. Default; moderate danger." },
      { term: "fitd:Desperate",     type: "owl:NamedIndividual", note: "rpg:RiskPosition. High danger; +1 XP on roll." },
    ],
  },
  {
    id: "effect",
    num: "§03",
    title: "Effect Level",
    subtitle: "Magnitude of impact when a roll succeeds",
    intro: "Effect is assessed alongside Position before the roll. Factors: Potency (how suited is the action?), Quality/Tier (equipment vs obstacle tier), Scale (how many vs how many?). Each factor can independently raise or lower the level. Equivalent to rpg:EffectLevel.",
    cards: [
      { title: "Zero Effect", body: "The action accomplishes nothing. A wall cannot be climbed without equipment; a guard cannot be bribed with a reputation like yours." },
      { title: "Limited Effect", body: "Partial impact. Ticks 1 clock segment. The obstacle resists, or the situation constrains your ability to fully act." },
      { title: "Standard Effect", body: "Normal expected impact. Ticks 2 clock segments. You accomplish what the action is meant to accomplish." },
      { title: "Great Effect", body: "Exceptional impact. Ticks 3 clock segments. A significant advantage, extra progress, or a striking result beyond the norm." },
      { title: "Extreme Effect", body: "Beyond Great. Exceptional circumstances only. Reserved for overwhelming advantages or supernatural power." },
    ],
    terms: [
      { term: "fitd:EffectLevel",      type: "owl:Class",           note: "owl:equivalentClass rpg:EffectLevel." },
      { term: "fitd:EffectLevel_Knob", type: "owl:NamedIndividual", note: "Assess Potency, Quality/Tier, Scale independently." },
      { term: "fitd:ZeroEffect",       type: "owl:NamedIndividual", note: "rpg:EffectLevel. 0 clock ticks." },
      { term: "fitd:LimitedEffect",    type: "owl:NamedIndividual", note: "rpg:EffectLevel. 1 clock tick." },
      { term: "fitd:StandardEffect",   type: "owl:NamedIndividual", note: "rpg:EffectLevel. 2 clock ticks." },
      { term: "fitd:GreatEffect",      type: "owl:NamedIndividual", note: "rpg:EffectLevel. 3 clock ticks." },
      { term: "fitd:ExtremeEffect",    type: "owl:NamedIndividual", note: "rpg:EffectLevel. Exceptional circumstances only." },
    ],
  },
  {
    id: "attributes",
    num: "§04",
    title: "Attributes & Actions",
    subtitle: "Three attributes, twelve actions — all as rpg:RuleSetAttribute",
    intro: "Each character has ratings (0–4) in twelve actions grouped into three parent attributes. The attribute rating equals the number of filled dots in the first (leftmost) column of its grouped actions. Resistance rolls use the attribute pool; XP is tracked per attribute.",
    cards: [
      { title: "Insight", body: "Hunt — track targets, ranged precision. Study — research, detect lies. Survey — observe, anticipate, spot trouble. Tinker — devices, lock-picking, wound treatment." },
      { title: "Prowess", body: "Finesse — dextrous manipulation, vehicle handling, formal dueling. Prowl — stealth, traversal, backstabbing. Skirmish — close combat, brawling. Wreck — explosive force, sabotage." },
      { title: "Resolve", body: "Attune — arcane perception, ghost communication. Command — intimidation, leading cohorts. Consort — networking, gaining access. Sway — guile, charm, persuasion, convincing lies." },
    ],
    terms: [
      { term: "fitd:Insight",  type: "rpg:RuleSetAttribute", note: "Parent attribute. Resists deception/understanding." },
      { term: "fitd:Prowess",  type: "rpg:RuleSetAttribute", note: "Parent attribute. Resists physical strain/injury." },
      { term: "fitd:Resolve",  type: "rpg:RuleSetAttribute", note: "Parent attribute. Resists mental/willpower strain." },
      { term: "fitd:Hunt",     type: "rpg:RuleSetAttribute", note: "schema:isPartOf fitd:Insight. Rating 0-4." },
      { term: "fitd:Study",    type: "rpg:RuleSetAttribute", note: "schema:isPartOf fitd:Insight. Rating 0-4." },
      { term: "fitd:Survey",   type: "rpg:RuleSetAttribute", note: "schema:isPartOf fitd:Insight. Rating 0-4." },
      { term: "fitd:Tinker",   type: "rpg:RuleSetAttribute", note: "schema:isPartOf fitd:Insight. Rating 0-4." },
      { term: "fitd:Finesse",  type: "rpg:RuleSetAttribute", note: "schema:isPartOf fitd:Prowess. Rating 0-4." },
      { term: "fitd:Prowl",    type: "rpg:RuleSetAttribute", note: "schema:isPartOf fitd:Prowess. Rating 0-4." },
      { term: "fitd:Skirmish", type: "rpg:RuleSetAttribute", note: "schema:isPartOf fitd:Prowess. Rating 0-4." },
      { term: "fitd:Wreck",    type: "rpg:RuleSetAttribute", note: "schema:isPartOf fitd:Prowess. Rating 0-4." },
      { term: "fitd:Attune",   type: "rpg:RuleSetAttribute", note: "schema:isPartOf fitd:Resolve. Rating 0-4." },
      { term: "fitd:Command",  type: "rpg:RuleSetAttribute", note: "schema:isPartOf fitd:Resolve. Rating 0-4." },
      { term: "fitd:Consort",  type: "rpg:RuleSetAttribute", note: "schema:isPartOf fitd:Resolve. Rating 0-4." },
      { term: "fitd:Sway",     type: "rpg:RuleSetAttribute", note: "schema:isPartOf fitd:Resolve. Rating 0-4." },
    ],
  },
  {
    id: "harm",
    num: "§05",
    title: "Harm, Stress & Consequences",
    subtitle: "Lasting debility, expenditure resource, and five consequence types",
    intro: "Harm is modelled as rpg:Harm instances with consequenceSeverity 1–4. Trauma conditions are rpg:Condition individuals, permanent and always active as a personality filter. Five consequence types cover all negative outcomes from rolls.",
    cards: [
      { title: "Lesser Harm (L1)", body: "Reduced Effect on rolls directly impeded. Examples: Battered, Drained, Distracted, Scared. Two L1 slots per character." },
      { title: "Moderate Harm (L2)", body: "−1d on rolls directly impeded. Examples: Exhausted, Deep Cut, Concussion, Panicked. Two L2 slots; full row escalates to L3." },
      { title: "Severe Harm (L3)", body: "Incapacitated / Need Help for affected activity. Examples: Impaled, Broken Leg, Shot in Chest. One L3 slot." },
      { title: "Fatal Harm (L4)", body: "Death unless resisted to L3. Examples: Drowned, Stabbed in Heart, Electrocuted. Healing clock (4 segments) fills → all harm drops one level." },
      { title: "Stress & Trauma", body: "Stress pool 0–9. Spent for Push Yourself (2), Assist (1 per ally), or Resist. At 9: mark trauma, clear all stress. Four traumas = retire or imprisonment." },
      { title: "Trauma Conditions", body: "Cold · Haunted · Obsessed · Paranoid · Reckless · Soft · Unstable · Vicious. Each is a permanent rpg:Condition individual, granting XP when it causes trouble in play." },
    ],
    terms: [
      { term: "fitd:Harm",          type: "owl:Class",           note: "owl:equivalentClass rpg:Harm. Levels 1-4." },
      { term: "fitd:LesserHarm",    type: "owl:NamedIndividual", note: "rpg:Harm. consequenceSeverity 1. Reduced Effect." },
      { term: "fitd:ModerateHarm",  type: "owl:NamedIndividual", note: "rpg:Harm. consequenceSeverity 2. -1d." },
      { term: "fitd:SevereHarm",    type: "owl:NamedIndividual", note: "rpg:Harm. consequenceSeverity 3. Incapacitated." },
      { term: "fitd:FatalHarm",     type: "owl:NamedIndividual", note: "rpg:Harm. consequenceSeverity 4. Death." },
      { term: "fitd:Trauma",        type: "owl:Class",           note: "owl:equivalentClass rpg:Condition. Permanent." },
      { term: "fitd:Cold",          type: "owl:NamedIndividual", note: "rpg:Condition. Flat affect, clipped sentences." },
      { term: "fitd:Haunted",       type: "owl:NamedIndividual", note: "rpg:Condition. Lost in reverie, seeing things." },
      { term: "fitd:Obsessed",      type: "owl:NamedIndividual", note: "rpg:Condition. Enthralled by one fixation." },
      { term: "fitd:Paranoid",      type: "owl:NamedIndividual", note: "rpg:Condition. Imagines danger everywhere." },
      { term: "fitd:Reckless",      type: "owl:NamedIndividual", note: "rpg:Condition. Dismissive of danger." },
      { term: "fitd:Soft",          type: "owl:NamedIndividual", note: "rpg:Condition. Sentimental, passive." },
      { term: "fitd:Unstable",      type: "owl:NamedIndividual", note: "rpg:Condition. Volatile emotional state." },
      { term: "fitd:Vicious",       type: "owl:NamedIndividual", note: "rpg:Condition. Seeks cruelty as comfort." },
      { term: "fitd:Consequence",   type: "owl:Class",           note: "owl:equivalentClass rpg:Consequence. Five types." },
      { term: "fitd:ReducedEffect",   type: "owl:NamedIndividual", note: "rpg:Consequence. Effect drops one level." },
      { term: "fitd:Complication",    type: "owl:NamedIndividual", note: "rpg:Consequence. New problem/danger clock." },
      { term: "fitd:LostOpportunity", type: "owl:NamedIndividual", note: "rpg:Consequence. Window closed permanently." },
      { term: "fitd:WorsePosition",   type: "owl:NamedIndividual", note: "rpg:Consequence. Position degrades one step." },
      { term: "fitd:HarmConsequence", type: "owl:NamedIndividual", note: "rpg:Consequence. Harm at position severity." },
    ],
  },
  {
    id: "trackers",
    num: "§06",
    title: "Trackers",
    subtitle: "Numeric state machines for characters and crew",
    intro: "All persistent numeric state is modelled as rpg:Tracker instances linked to the ruleset. Character trackers: Stress (0–9), Stash (0–40). Crew trackers: Heat (0–9), Wanted Level (0–4), Rep (0–12 minus turf), Tier (0–6).",
    cards: [
      { title: "Stress (0–9)", body: "Primary expenditure and risk accumulator. Spent for Push Yourself (2), Resist, or Assist (teammate takes 1). Vice roll clears stress = highest die. At 9: mark trauma, clear all." },
      { title: "Heat (0–9)", body: "Crew authority attention. Sources: operation type (0/2/4/6) + modifiers: +1 high-profile, +1 hostile turf, +1 at war, +2 killing. At 9: +1 wanted level, clear heat." },
      { title: "Wanted Level (0–4)", body: "Permanent law-enforcement pressure. Level 4 = life sentence or execution. Reduced only via incarceration entanglement during downtime." },
      { title: "Rep (0–12)", body: "Crew social capital. Earn base 2 per score ± Tier differential (min 0). Fill the track (12 − turf count) to develop: strengthen hold or pay to raise Tier." },
      { title: "Stash (0–40)", body: "Character long-term savings. Each 10 stash = 1 lifestyle quality level. 2 stash = 1 coin conversion. Reaching 40 = comfortable retirement." },
      { title: "Tier (0–6)", body: "Crew power level. Governs quality of all assets, gang scale, cohort quality, and advancement costs. Raise Tier = new Tier × 8 coin; drops hold to Weak." },
    ],
    terms: [
      { term: "fitd:StressTracker",      type: "rpg:Tracker", note: "0-9. At 9 → trauma tick + clear all stress." },
      { term: "fitd:HeatTracker",        type: "rpg:Tracker", note: "0-9. At 9 → +1 wanted level, clear heat." },
      { term: "fitd:WantedLevelTracker", type: "rpg:Tracker", note: "0-4. Level 4 = no legal escape." },
      { term: "fitd:RepTracker",         type: "rpg:Tracker", note: "rpg:ReputationTracker. 0 to 12−turf." },
      { term: "fitd:StashTracker",       type: "rpg:Tracker", note: "0-40. Per 10 = 1 lifestyle quality." },
      { term: "fitd:TierTracker",        type: "rpg:Tracker", note: "0-6. Governs asset quality and scale." },
    ],
  },
  {
    id: "clocks",
    num: "§07",
    title: "Progress Clocks",
    subtitle: "Segmented circles tracking effort, danger, and time — owl:equivalentClass rpg:Clock",
    intro: "Progress clocks are the primary pacing tool. Named after the obstacle or threat (never the method). Ticked by action roll effect: Great = 3 segments, Standard = 2, Limited = 1. The GM may also tick clocks directly on complications.",
    cards: [
      { title: "Danger Clock (6 seg)", body: "Tracks progressive danger. Ticked on complications. Filling it materialises the threat — narrate as a scene change, not a footnote." },
      { title: "Racing Clock", body: "Two opposed clocks. First to fill wins. Used for competing efforts: the crew vs an alarm, a rival faction vs the same target." },
      { title: "Linked Clock", body: "Unlocked by filling another clock. Used for layered defences or multi-stage challenges requiring sequential completion." },
      { title: "Tug-of-War Clock", body: "Ticks both up and down. Back-and-forth struggles: turf wars, political revolutions, contested negotiations." },
      { title: "Long-Term Project (8 seg)", body: "Multi-downtime effort. May span multiple linked clocks for complex projects: research, crafting, building a contact." },
      { title: "Healing Clock (4 seg)", body: "Tracks recovery. Filling it drops all character harm one level. Ticked by Recover downtime activities." },
    ],
    terms: [
      { term: "fitd:ProgressClock",         type: "owl:Class",           note: "owl:equivalentClass rpg:Clock. 4/6/8 segments." },
      { term: "fitd:DangerClock",           type: "owl:NamedIndividual", note: "rpg:Clock. 6 seg. Complication tracker." },
      { term: "fitd:RacingClock",           type: "owl:NamedIndividual", note: "rpg:Clock. Two competing clocks." },
      { term: "fitd:LinkedClock",           type: "owl:NamedIndividual", note: "rpg:Clock. Unlocked by another clock." },
      { term: "fitd:MissionClock",          type: "owl:NamedIndividual", note: "rpg:Clock. Time window — fill = mission fails." },
      { term: "fitd:TugOfWarClock",         type: "owl:NamedIndividual", note: "rpg:Clock. Ticks both directions." },
      { term: "fitd:LongTermProjectClock",  type: "owl:NamedIndividual", note: "rpg:Clock. 8 seg. Multi-downtime effort." },
      { term: "fitd:FactionGoalClock",      type: "owl:NamedIndividual", note: "rpg:Clock. GM-ticked NPC long-term goal." },
      { term: "fitd:HealingClock",          type: "owl:NamedIndividual", note: "rpg:Clock. 4 seg. Filling = harm −1 level." },
    ],
  },
  {
    id: "actors",
    num: "§08",
    title: "Actors",
    subtitle: "Character, Crew, Faction, Cohort — all owl:equivalentClass rpg counterparts",
    intro: "Actors are entities that take actions in the fiction. Characters are owl:equivalentClass rpg:Character; Crew is owl:equivalentClass rpg:Crew; Faction is owl:equivalentClass rpg:Faction; Cohort is owl:equivalentClass rpg:Creature.",
    cards: [
      { title: "Character", body: "Player character. Has playbook, action ratings, stress, trauma, harm, vice, load, coin, stash. Action ratings modelled as rpg:CharacterAttributeValue instances. Trauma as rpg:AppliedState." },
      { title: "Crew", body: "Collective actor. Tier, hold (Weak/Strong), rep, heat, wanted level, coin, lair, hunting grounds, claims, cohorts. War status halves downtime to 1 action per PC." },
      { title: "Faction", body: "NPC organisation with Tier, hold, faction clocks, and rpg:Relationship instances. Status: −3 (War) to +3 (Allies). War: +1 heat/score, −1 hold, 1 downtime/PC." },
      { title: "Cohort", body: "Gang (group NPC) or Expert (single NPC). Quality = crew Tier. Harm track L1–L4; breaks at L3. Edge: +1 effect in specialty. Flaw triggers entanglements." },
    ],
    terms: [
      { term: "fitd:Actor",              type: "owl:Class",           note: "owl:equivalentClass rpg:Actor. Abstract base." },
      { term: "fitd:Character",          type: "owl:Class",           note: "owl:equivalentClass rpg:Character. PC entity." },
      { term: "fitd:Crew",               type: "owl:Class",           note: "owl:equivalentClass rpg:Crew. Collective actor." },
      { term: "fitd:Faction",            type: "owl:Class",           note: "owl:equivalentClass rpg:Faction. NPC org." },
      { term: "fitd:Cohort",             type: "owl:Class",           note: "owl:equivalentClass rpg:Creature. Gang or Expert." },
      { term: "fitd:FactionRelationship",type: "owl:Class",           note: "owl:equivalentClass rpg:Relationship. −3 to +3." },
    ],
  },
  {
    id: "playbook",
    num: "§09",
    title: "Playbook, Advancement & Score",
    subtitle: "Character templates, XP triggers, and crew advancement",
    intro: "A Playbook is owl:equivalentClass rpg:RuleSetClass. It defines starting action dots, special ability pool, XP trigger, contacts, and starting items. Advancement: fill XP track → new special ability OR advance an attribute track (+1 action dot).",
    cards: [
      { title: "Playbook", body: "Character template. Focus and preferred method, not immutable identity. Defines: starting action dots, special ability pool, XP trigger, contacts, load items." },
      { title: "Special Ability", body: "Rule-breaking power from a playbook or crew. May grant bonus dice, special armor uses, unique mechanics, or immunities. Defines the playbook's mechanical identity." },
      { title: "XP Trigger", body: "Evaluated at end of session. Standard: Desperate roll (1 XP attribute), expressed beliefs/drives (1–2 XP), vice/trauma struggle (1–2 XP), playbook-specific trigger (1–2 XP)." },
      { title: "Crew Advance", body: "When crew XP fills: take new crew special ability OR mark two upgrade boxes. Cannot split between both." },
    ],
    terms: [
      { term: "fitd:Playbook",       type: "owl:Class", note: "owl:equivalentClass rpg:RuleSetClass. Character template." },
      { term: "fitd:SpecialAbility", type: "owl:Class", note: "owl:equivalentClass rpg:SpecialAbility. Rule-breaking power." },
      { term: "fitd:XPTrigger",      type: "owl:Class", note: "owl:equivalentClass rpg:AdvancementRule. End-of-session." },
      { term: "fitd:CrewXPTrigger",  type: "owl:NamedIndividual", note: "rpg:AdvancementRule. Crew-level XP evaluation." },
      { term: "fitd:CrewAdvance",    type: "owl:Class", note: "owl:equivalentClass rpg:Unlock. Special ability or upgrades." },
    ],
  },
  {
    id: "score",
    num: "§10",
    title: "Score & Flashback",
    subtitle: "The primary dramatic unit — lifecycle and FITD-exclusive mechanics",
    intro: "A Score is a FITD-exclusive owl:Class. Lifecycle: choose Plan + Detail → Engagement Roll → Score Phase (action rolls, flashbacks, teamwork) → Outcome → Downtime. Six plan types with required details.",
    cards: [
      { title: "Assault Plan", body: "Required detail: point of attack. Direct confrontation — breaking through, overwhelming by force." },
      { title: "Deception Plan", body: "Required detail: method. Mislead, impersonate, forge, create false pretences." },
      { title: "Stealth Plan", body: "Required detail: point of infiltration. Avoid notice, move unseen, bypass undetected." },
      { title: "Occult Plan", body: "Required detail: arcane method. Supernatural approach — ritual, ghost-channel, spirit-binding." },
      { title: "Social Plan", body: "Required detail: social connection. Leverage relationships, negotiate, manipulate through charm." },
      { title: "Transport Plan", body: "Required detail: route and means. Move something (or someone) from A to B safely or secretly." },
    ],
    terms: [
      { term: "fitd:Score",                      type: "owl:Class",           note: "FITD-exclusive. Single operation arc." },
      { term: "fitd:Flashback",                  type: "owl:Class",           note: "FITD-exclusive. Retroactive action; 0-2 stress." },
      { term: "fitd:Payoff",                     type: "owl:Class",           note: "FITD-exclusive. Coin, rep, heat, XP." },
      { term: "fitd:ScoreType_CriminalActivity", type: "owl:NamedIndividual", note: "Core score type for crew." },
      { term: "fitd:ScoreType_ClaimSeizure",     type: "owl:NamedIndividual", note: "Seize a claim from another faction." },
      { term: "fitd:ScoreType_SpecialMission",   type: "owl:NamedIndividual", note: "Player-defined goal." },
      { term: "fitd:AssaultPlan",                type: "owl:NamedIndividual", note: "Detail: point of attack." },
      { term: "fitd:DeceptionPlan",              type: "owl:NamedIndividual", note: "Detail: method." },
      { term: "fitd:StealthPlan",                type: "owl:NamedIndividual", note: "Detail: infiltration point." },
      { term: "fitd:OccultPlan",                 type: "owl:NamedIndividual", note: "Detail: arcane method." },
      { term: "fitd:SocialPlan",                 type: "owl:NamedIndividual", note: "Detail: social connection." },
      { term: "fitd:TransportPlan",              type: "owl:NamedIndividual", note: "Detail: route and means." },
      { term: "fitd:Assist",                     type: "owl:NamedIndividual", note: "Teamwork. 1 stress → +1d; share risk." },
      { term: "fitd:GroupAction",                type: "owl:NamedIndividual", note: "Teamwork. Best result; excess failures → leader stress." },
      { term: "fitd:Protect",                    type: "owl:NamedIndividual", note: "Teamwork. Absorb consequence for ally." },
      { term: "fitd:SetUp",                      type: "owl:NamedIndividual", note: "Teamwork. Improve position or effect for next roll." },
    ],
  },
  {
    id: "downtime",
    num: "§11",
    title: "Downtime, Vice & Rituals",
    subtitle: "Recovery, advancement, and arcane working",
    intro: "After each score the crew enters downtime. Each character gets two activity slots (one if crew is at war). Downtime activities are rpg:Phase individuals. Vice is the only official stress relief. Rituals are transgressive arcane acts requiring the Ritual special ability.",
    cards: [
      { title: "Indulge Vice", body: "Vice Roll: pool = lowest attribute rating. Clear stress = highest die. Overindulge if clearing more stress than marked — consequences: Attract Trouble, Brag (+2 heat), Lost (vanish weeks), Tapped (lose purveyor)." },
      { title: "Recover", body: "Roll healer quality or Tinker. Tick healing clock (4 segments). Fill → all harm drops one level. Downtime tick scale: Crit=5, 6=3, 4-5=2, 1-3=1." },
      { title: "Long-Term Project", body: "Tick a project clock. Any clock-based goal: crafting, research, building a contact, faction infiltration. Same tick scale as Recover." },
      { title: "Acquire Asset / Reduce Heat / Train", body: "Acquire: roll Tier, result determines quality tier. Reduce Heat: roll action, same scale. Train: mark 1 XP in an attribute or playbook track." },
      { title: "Vice Types", body: "Faith · Gambling · Luxury · Obligation · Pleasure · Stupor · Weird. Each has a named purveyor. Not indulging costs stress = trauma count (can cascade to trauma)." },
      { title: "Ritual", body: "Requires Ritual special ability. Learned via 8-segment LTP clock. Stress cost = magnitude value. Attune roll required. Each ritual defines: effect, price, and belief/fear instilled." },
    ],
    terms: [
      { term: "fitd:Vice",            type: "owl:Class",           note: "FITD-exclusive. Stress relief via indulgence." },
      { term: "fitd:Ritual",          type: "owl:Class",           note: "FITD-exclusive. Arcane working; requires ability." },
      { term: "fitd:Crafting",        type: "owl:Class",           note: "FITD-exclusive. Downtime item creation." },
      { term: "fitd:Invention",       type: "owl:Class",           note: "FITD-exclusive. Novel formula; Study LTP." },
      { term: "fitd:Magnitude",       type: "owl:Class",           note: "FITD-exclusive. 0-6 scale for supernatural power." },
      { term: "fitd:Claim",           type: "owl:Class",           note: "FITD-exclusive. Turf node; ongoing benefit." },
      { term: "fitd:IndulgeVice",     type: "rpg:Phase",           note: "Downtime activity. Vice Roll." },
      { term: "fitd:Recover",         type: "rpg:Phase",           note: "Downtime activity. Ticks healing clock." },
      { term: "fitd:LongTermProject", type: "rpg:Phase",           note: "Downtime activity. Ticks project clock." },
      { term: "fitd:AcquireAsset",    type: "rpg:Phase",           note: "Downtime activity. Roll Tier for quality." },
      { term: "fitd:ReduceHeat",      type: "rpg:Phase",           note: "Downtime activity. Roll action → lower heat." },
      { term: "fitd:Train",           type: "rpg:Phase",           note: "Downtime activity. Mark 1 XP." },
      { term: "fitd:AttractTrouble",  type: "owl:NamedIndividual", note: "rpg:Consequence. Overindulgence: extra entanglement." },
      { term: "fitd:Brag",            type: "owl:NamedIndividual", note: "rpg:Consequence. Overindulgence: +2 heat." },
      { term: "fitd:Lost",            type: "owl:NamedIndividual", note: "rpg:Consequence. Overindulgence: vanish weeks; return healed." },
      { term: "fitd:Tapped",          type: "owl:NamedIndividual", note: "rpg:Consequence. Overindulgence: lose purveyor." },
      { term: "fitd:FaithVice",       type: "rpg:Tag",             note: "Ritual, prayer, devotion." },
      { term: "fitd:GamblingVice",    type: "rpg:Tag",             note: "Cards, dice, risky bets." },
      { term: "fitd:LuxuryVice",      type: "rpg:Tag",             note: "Fine food, clothes, extravagance." },
      { term: "fitd:ObligationVice",  type: "rpg:Tag",             note: "Family, debt, unavoidable person." },
      { term: "fitd:PleasureVice",    type: "rpg:Tag",             note: "Physical indulgence." },
      { term: "fitd:StuporVice",      type: "rpg:Tag",             note: "Heavy drink, oblivion-seeking." },
      { term: "fitd:WeirdVice",       type: "rpg:Tag",             note: "Arcane dabbling, forbidden knowledge." },
    ],
  },
  {
    id: "items",
    num: "§12",
    title: "Items, Load & LLMArtifact Types",
    subtitle: "Equipment, drawbacks, armor, load, and ontology annotation vocabulary",
    intro: "Items are owl:equivalentClass rpg:Item; possession instances are rpg:ItemInstance on an Actor. Fine quality adds +1 quality on top of Tier. Load is chosen per score (1–9 slots). Three LLMArtifact annotation types structure all rpg:LLMArtifact nodes in the ontology.",
    cards: [
      { title: "Item Drawbacks", body: "Complex (multi-stage creation), Conspicuous (+1 heat if used), Consumable (limited uses), Rare (needs rare material), Unreliable (Fortune roll on use), Volatile (dangerous side-effect on activation)." },
      { title: "Armor Tags", body: "Standard Armor: mark to reduce consequence one level. Heavy Armor: mark after Standard for second reduction. Special Armor: activated by specific special abilities for defined consequence types." },
      { title: "Load Tags", body: "Light (1–3): faster, less conspicuous — blend with citizens. Normal (4–5): look like a scoundrel. Heavy (6): look like an operative. Encumbered (7–9): very slow movement only." },
      { title: "LLMArtifact: Descriptor", body: "Explains what an element is, when to use it, and what constraints matter for LLM reasoning. The most common annotation type across the ontology." },
      { title: "LLMArtifact: SystemPrompt", body: "Full system-prompt text for an Actor node (Character, Crew, Faction), injected directly into LLM context to give the actor its voice and behavioural constraints." },
      { title: "LLMArtifact: StyleGuide", body: "Tonal and narrative guidance for GM or LLM narration of this element — prose register, what to avoid, how to render the fictional texture of the concept." },
    ],
    terms: [
      { term: "fitd:Item",                 type: "owl:Class",              note: "owl:equivalentClass rpg:Item. Definition term." },
      { term: "fitd:ComplexDrawback",      type: "rpg:Tag",                note: "Multi-stage creation (one activity + roll/stage)." },
      { term: "fitd:ConspicuousDrawback",  type: "rpg:Tag",                note: "+1 heat if used on operation." },
      { term: "fitd:ConsumableDrawback",   type: "rpg:Tag",                note: "Limited uses; alchemicals default 1." },
      { term: "fitd:RareDrawback",         type: "rpg:Tag",                note: "Requires rare material to craft." },
      { term: "fitd:UnreliableDrawback",   type: "rpg:Tag",                note: "Fortune roll on use." },
      { term: "fitd:VolatileDrawback",     type: "rpg:Tag",                note: "Dangerous side-effect; resistable." },
      { term: "fitd:StandardArmorTag",     type: "rpg:Tag",                note: "Mark to reduce consequence one level." },
      { term: "fitd:HeavyArmorTag",        type: "rpg:Tag",                note: "Second reduction; increases load." },
      { term: "fitd:SpecialArmorTag",      type: "rpg:Tag",                note: "Activated by specific special abilities." },
      { term: "fitd:LightLoadTag",         type: "rpg:Tag",                note: "1-3 slots. Blend with citizens." },
      { term: "fitd:NormalLoadTag",        type: "rpg:Tag",                note: "4-5 slots. Look like a scoundrel." },
      { term: "fitd:HeavyLoadTag",         type: "rpg:Tag",                note: "6 slots. Look like an operative." },
      { term: "fitd:EncumberedLoadTag",    type: "rpg:Tag",                note: "7-9 slots. Very slow movement." },
      { term: "fitd:MundaneCreation",      type: "rpg:Tag",                note: "Standard non-magical item." },
      { term: "fitd:AlchemicalCreation",   type: "rpg:Tag",                note: "Chemical/biological. Consumable required." },
      { term: "fitd:ArcaneCreation",       type: "rpg:Tag",                note: "Magically enhanced. Strange Methods bonus." },
      { term: "fitd:SparkCraftCreation",   type: "rpg:Tag",                note: "Electroplasmic gadget. Artificer bonus." },
      { term: "fitd:ArtifactType_Descriptor",   type: "rpg:LLMArtifactType", note: "What it is, when to use, key constraints." },
      { term: "fitd:ArtifactType_SystemPrompt", type: "rpg:LLMArtifactType", note: "Full system-prompt for Actor nodes." },
      { term: "fitd:ArtifactType_StyleGuide",   type: "rpg:LLMArtifactType", note: "Tonal/narrative guidance for narration." },
    ],
  },
];

/* ─────────────────────────────────────────────── */

export default function Index() {
  const [activeSection, setActiveSection] = useState("resolution");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

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

        {/* Version badge */}
        <p
          className="text-xs font-mono px-3 py-1 border border-border"
          style={{ color: "hsl(var(--muted-foreground))", background: "hsl(0 0% 8%)" }}
        >
          v{VERSION} · owl:imports &lt;https://schema.rpg-schema.org/rpg&gt; · 1,039 triples
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
            {NAV.map((n) => (
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
                {n.label}
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
        {SECTIONS.map((sec) => (
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

            {sec.intro && (
              <p className="mb-8 text-base leading-relaxed" style={{ color: "hsl(var(--foreground) / 0.8)", fontFamily: "var(--font-body)" }}>
                {sec.intro}
              </p>
            )}

            {sec.cards && (
              <div className={`grid gap-4 mb-10 ${sec.cards.length >= 6 ? "sm:grid-cols-2 lg:grid-cols-3" : sec.cards.length === 4 ? "sm:grid-cols-2" : sec.cards.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
                {sec.cards.map((card) => (
                  <div
                    key={card.title}
                    className="p-5 border border-border transition-colors"
                    style={{ background: "hsl(var(--card))" }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = "hsl(var(--gold-dim))")}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = "hsl(var(--border))")}
                  >
                    <h3 className="text-base font-bold mb-2" style={{ color: "hsl(var(--foreground))", fontFamily: "var(--font-body)" }}>
                      {card.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--foreground) / 0.7)", fontFamily: "var(--font-body)" }}>
                      {card.body}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {sec.terms && (
              <div>
                <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "hsl(var(--muted-foreground))", fontFamily: "var(--font-mono)" }}>
                  Ontology Terms
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
            )}
          </section>
        ))}

        {/* ONTOLOGY FILE */}
        <section id="ttl" className="scroll-mt-16 pt-8 border-t border-border">
          <p className="text-sm mb-1" style={{ color: "hsl(var(--gold))", fontFamily: "var(--font-mono)" }}>§TTL</p>
          <h2 className="text-4xl font-bold mb-2" style={{ color: "hsl(var(--gold))", fontFamily: "var(--font-display)" }}>Ontology File</h2>
          <p className="italic text-base mb-6" style={{ color: "hsl(var(--foreground) / 0.6)", fontFamily: "var(--font-display)" }}>Download the complete Turtle / OWL 2 file</p>
          <div className="h-px w-full mb-8" style={{ background: "hsl(var(--border))" }} />

          <p className="mb-6 leading-relaxed" style={{ color: "hsl(var(--foreground) / 0.8)", fontFamily: "var(--font-body)" }}>
            <code className="font-mono text-sm px-1.5 py-0.5" style={{ background: "hsl(0 0% 10%)", color: "hsl(var(--gold))" }}>fitd.ttl</code> is a single Turtle file containing the complete
            OWL 2 ontology — 1,039 lines, 12 rule modules, aligned to rpg-schema.org/rpg via{" "}
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
{`@prefix fitd:   <https://schema.rpg-schema.org/fitd#> .
@prefix rpg:    <https://schema.rpg-schema.org/rpg#> .
@prefix owl:    <http://www.w3.org/2002/07/owl#> .
@prefix rdf:    <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs:   <http://www.w3.org/2000/01/rdf-schema#> .
@prefix xsd:    <http://www.w3.org/2001/XMLSchema#> .
@prefix schema: <https://schema.org/> .
@prefix skos:   <http://www.w3.org/2004/02/skos/core#> .
@prefix dc:     <http://purl.org/dc/elements/1.1/> .

<https://schema.rpg-schema.org/fitd>
    a owl:Ontology ;
    dc:title "Forged in the Dark — General Rules Ontology (rpg-schema aligned)" ;
    dc:source "Blades in the Dark SRD — John Harper, Evil Hat Productions" ;
    owl:imports <https://schema.rpg-schema.org/rpg> ;
    owl:versionInfo "${VERSION}" .`}
          </pre>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border mt-16" style={{ background: "hsl(0 0% 4%)" }}>
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))", fontFamily: "var(--font-mono)" }}>
            fitd.rpg-schema.org · v{VERSION} · Based on the{" "}
            <em>Blades in the Dark</em> SRD by John Harper · Evil Hat Productions · CC-BY
          </p>
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
