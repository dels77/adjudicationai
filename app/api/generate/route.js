import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─── SYSTEM PROMPT: UK CONSTRUCTION ADJUDICATION EXPERT ─────
const SYSTEM_PROMPT = `You are an expert UK construction law drafter specialising in statutory adjudication under the Housing Grants, Construction and Regeneration Act 1996 (as amended by the Local Democracy, Economic Development and Construction Act 2009) and the Scheme for Construction Contracts (England and Wales) Regulations 1998 (as amended).

You draft professional adjudication submissions that are:
- Legally precise and properly structured
- Based on established case law authorities
- Written in the formal, authoritative tone expected in UK construction adjudication
- Properly numbered with paragraph references
- Cross-referenced to supporting document Tabs

KEY LEGISLATION YOU MUST REFERENCE WHERE APPLICABLE:
- Housing Grants, Construction and Regeneration Act 1996 ("HGCRA" / "the Act"), especially:
  - s.104 (meaning of "construction contract")
  - s.105 (meaning of "construction operations")
  - s.108 (right to refer disputes to adjudication)
  - s.110A (payment notices)
  - s.110B (default payment notice — the application becomes the payment notice)
  - s.111 (requirement to pay notified sum / pay less notices)
  - s.113 (prohibition of conditional payment provisions)
- Scheme for Construction Contracts (England and Wales) Regulations 1998 (as amended) ("the Scheme")
- Local Democracy, Economic Development and Construction Act 2009 (the amending Act)
- Late Payment of Commercial Debts (Interest) Act 1998

KEY CASE LAW YOU SHOULD CITE WHERE RELEVANT:

Payment / Smash & Grab:
- ISG Construction Ltd v Seevic College [2014] EWHC 4007 (TCC) — notified sum payable where no valid pay less notice served
- Grove Developments Ltd v S&T (UK) Ltd [2018] EWCA Civ 2448 — true value adjudication after paying notified sum
- Leeds City Council v Waco UK Ltd [2015] EWHC 1400 (TCC) — pay less notice must strictly comply
- Surrey & Sussex Healthcare NHS Trust v Logan Construction [2017] EWHC 17 (TCC) — mandatory obligation to pay notified sum
- Henia Investments Inc v Beck Interiors Ltd [2015] EWHC 2433 (TCC) — requirements of payment notices
- Galliford Try Building Ltd v Estura Ltd [2015] EWHC 412 (TCC) — payment application as notified sum

Enforcement:
- Macob Civil Engineering Ltd v Morrison Construction Ltd [1999] BLR 93 — Parliament intended immediate enforcement
- Carillion Construction Ltd v Devonport Royal Dockyard [2005] EWCA Civ 1358 — strong predisposition to enforce; errors not fatal
- Bouygues (UK) Ltd v Dahl-Jensen (UK) Ltd [2000] BLR 49 (CA) — temporarily binding nature is cornerstone of scheme

Jurisdiction:
- Pegram Shopfitters Ltd v Tally Wiejl (UK) Ltd [2003] EWCA Civ 1750 — adjudicator's jurisdiction decision not finally binding
- Balfour Beatty Construction Ltd v Serco Ltd [2004] EWHC 3336 (TCC) — dispute must crystallise before referral
- Collins (Contractors) Ltd v Baltic Quay Management [2004] EWCA Civ 1757 — Notice must describe dispute with sufficient particularity
- Amec Civil Engineering Ltd v Secretary of State for Transport [2005] EWCA Civ 291 — Referral cannot widen scope of Notice
- RJT Consulting Engineers Ltd v DM Engineering [2002] EWCA Civ 270 — agreement must be evidenced in writing

Delay:
- Walter Lilly & Co Ltd v Mackay [2012] EWHC 1773 (TCC) — concurrent delay; contractor entitled to EOT if relevant event caused critical delay
- Henry Boot Construction v Malmaison Hotel [1999] 70 Con LR 32 — concurrent delay apportionment
- Multiplex Constructions v Honeywell [2007] EWHC 447 (TCC) — prevention principle
- Balfour Beatty v London Borough of Lambeth [2002] EWHC 597 (TCC) — global claims must be particularised

Defects:
- East Ham Corp v Bernard Sunley & Sons Ltd [1966] AC 406 (HL) — cost of rectification as primary measure
- Ruxley Electronics v Forsyth [1996] AC 344 (HL) — disproportionate cost of cure; diminution in value
- McGlinn v Waltham Contractors Ltd [2007] EWHC 149 (TCC) — departure from specification = defect

Natural Justice:
- PBS Energo AS v Bester Generacion UK Ltd [2020] EWHC 223 (TCC) — only material breaches invalidate
- Cantillon Ltd v Urvasco Ltd [2008] EWHC 282 (TCC) — must not decide matters outside those referred
- Amec Capital Projects Ltd v Whitefriars City Estates [2005] BLR 1 (CA) — right to be heard is fundamental

Repudiation:
- Hochster v De La Tour [1853] EWHC QB J72 — anticipatory breach
- Woodar Investment Development Ltd v Wimpey Construction [1980] 1 WLR 277 — breach must go to root
- Thomas-Fredric's (Construction) Ltd v Wilson [2004] BLR 23 — wrongful termination as repudiation

FORMATTING RULES:
1. Use the formal heading structure: "IN THE MATTER OF AN ADJUDICATION / B E T W E E N / [Party] / Referring Party / and / [Party] / Responding Party / [DOCUMENT TITLE]"
2. Number paragraphs with section numbers (1.1, 1.2, etc.)
3. Use section headings in CAPITALS (INTRODUCTION, EXECUTIVE SUMMARY, JURISDICTION, etc.)
4. Reference supporting documents as "Tab [X]" throughout
5. Always include an INTRODUCTION, EXECUTIVE SUMMARY, JURISDICTION section, and RELIEF SOUGHT
6. End with "Served on [date] / On behalf of [Party] / By: [Representative]"
7. For witness statements: use "I, [Name], ... WILL SAY AS FOLLOWS:" format with Statement of Truth
8. For decisions: use "Appointment and Timetable / Nature of Dispute / Submissions / Issues / Analysis / Declarations" structure
9. Write in British English throughout
10. Be thorough, authoritative, and persuasive — this is a real legal submission`;

// ─── BUILD THE USER PROMPT FROM FORM DATA ───────────────────
function buildPrompt(data) {
  const { submissionType, referringParty, respondingParty, contract, dispute, arguments: args } = data;

  const typeLabels = {
    "notice": "Notice of Adjudication",
    "referral": "Referral Notice (General)",
    "referral-smash": "Referral Notice — Smash & Grab (unpaid payment application, no valid pay less notice)",
    "referral-delay": "Referral Notice — Delay (extension of time and loss & expense)",
    "response": "Response to a Referral Notice",
    "reply": "Reply to a Response",
    "rejoinder": "Rejoinder to a Reply",
    "surrejoinder": "Surrejoinder to a Rejoinder",
    "jurisdiction": "Jurisdiction Submission (challenging the adjudicator's jurisdiction)",
    "witness": "Witness Statement",
    "decision": "Draft Adjudicator's Decision",
  };

  let prompt = `Please draft a complete, professional ${typeLabels[submissionType] || "adjudication submission"} based on the following information.\n\n`;

  // Party details
  prompt += `REFERRING PARTY:\n`;
  prompt += `- Name: ${referringParty?.name || "[To be confirmed]"}\n`;
  if (referringParty?.shortName) prompt += `- Short name: ${referringParty.shortName}\n`;
  if (referringParty?.regNo) prompt += `- Company number: ${referringParty.regNo}\n`;
  if (referringParty?.address) prompt += `- Address: ${referringParty.address}\n`;
  if (referringParty?.representative) prompt += `- Representative: ${referringParty.representative}\n`;
  if (referringParty?.email) prompt += `- Email: ${referringParty.email}\n`;

  prompt += `\nRESPONDING PARTY:\n`;
  prompt += `- Name: ${respondingParty?.name || "[To be confirmed]"}\n`;
  if (respondingParty?.shortName) prompt += `- Short name: ${respondingParty.shortName}\n`;
  if (respondingParty?.regNo) prompt += `- Company number: ${respondingParty.regNo}\n`;
  if (respondingParty?.address) prompt += `- Address: ${respondingParty.address}\n`;
  if (respondingParty?.representative) prompt += `- Representative: ${respondingParty.representative}\n`;
  if (respondingParty?.email) prompt += `- Email: ${respondingParty.email}\n`;

  // Contract
  prompt += `\nTHE CONTRACT:\n`;
  if (contract?.type) prompt += `- Form: ${contract.type}\n`;
  if (contract?.date) prompt += `- Date: ${contract.date}\n`;
  if (contract?.description) prompt += `- Works: ${contract.description}\n`;
  if (contract?.site) prompt += `- Site: ${contract.site}\n`;
  if (contract?.value) prompt += `- Value: ${contract.value}\n`;
  if (contract?.conditions) prompt += `- Conditions: ${contract.conditions}\n`;
  if (contract?.amendments) prompt += `- Amendments: ${contract.amendments}\n`;
  prompt += `- Adjudication basis: ${contract?.adjBasis === "contractual" ? `Contractual — clause ${contract?.clauseRef || "[XX]"}${contract?.rules ? `, ${contract.rules}` : ""}` : "Statutory — HGCRA 1996 s.108 + Scheme 1998"}\n`;
  if (contract?.nominatingBody) prompt += `- Nominating body: ${contract.nominatingBody}\n`;
  if (contract?.relevantClauses) prompt += `- Relevant clauses: ${contract.relevantClauses}\n`;
  if (contract?.interestClause) prompt += `- Interest clause: ${contract.interestClause}\n`;

  // Dispute
  prompt += `\nTHE DISPUTE:\n`;
  if (dispute?.description) prompt += `- Description: ${dispute.description}\n`;
  if (dispute?.amount) prompt += `- Amount claimed: ${dispute.amount}\n`;
  if (dispute?.background) prompt += `- Background: ${dispute.background}\n`;
  if (dispute?.crystallisationDate) prompt += `- Crystallisation date: ${dispute.crystallisationDate}\n`;
  if (dispute?.noticeDate) prompt += `- Notice of Adjudication date: ${dispute.noticeDate}\n`;
  if (dispute?.appointmentDate) prompt += `- Adjudicator appointment date: ${dispute.appointmentDate}\n`;
  if (dispute?.referralDate) prompt += `- Referral date: ${dispute.referralDate}\n`;
  if (dispute?.responseDate) prompt += `- Response date: ${dispute.responseDate}\n`;
  if (dispute?.replyDate) prompt += `- Reply date: ${dispute.replyDate}\n`;
  if (dispute?.rejoinderDate) prompt += `- Rejoinder date: ${dispute.rejoinderDate}\n`;
  if (dispute?.decisionDeadline) prompt += `- Decision deadline: ${dispute.decisionDeadline}\n`;

  // Smash & grab specific
  if (submissionType === "referral-smash") {
    prompt += `\nSMASH & GRAB DETAILS:\n`;
    prompt += `This is a "smash and grab" adjudication — the referring party submitted a payment application and no valid pay less notice was served by the responding party. The notified sum is therefore due under s.111 HGCRA.\n`;
    if (dispute?.paymentAppDate) prompt += `- Payment application date: ${dispute.paymentAppDate}\n`;
    if (dispute?.paymentAppRef) prompt += `- Payment application reference: ${dispute.paymentAppRef}\n`;
    if (dispute?.payLessDeadline) prompt += `- Pay less notice deadline: ${dispute.payLessDeadline}\n`;
    if (dispute?.paymentNoticeIssued) prompt += `- Payment notice issued: ${dispute.paymentNoticeIssued}\n`;
    prompt += `\nYou MUST cite ISG v Seevic [2014], Grove v S&T [2018], and Leeds v Waco [2015] in the payment section.\n`;
  }

  // Delay specific
  if (submissionType === "referral-delay") {
    prompt += `\nDELAY CLAIM DETAILS:\n`;
    if (dispute?.completionDate) prompt += `- Contractual completion date: ${dispute.completionDate}\n`;
    if (dispute?.eotClaimed) prompt += `- Extension of time claimed: ${dispute.eotClaimed}\n`;
    if (dispute?.delayEvents) prompt += `- Delay events: ${dispute.delayEvents}\n`;
    if (dispute?.lossAndExpense) prompt += `- Loss and expense: ${dispute.lossAndExpense}\n`;
    if (dispute?.lossBreakdown) prompt += `- Breakdown: ${dispute.lossBreakdown}\n`;
    if (contract?.eotClause) prompt += `- EOT clause: ${contract.eotClause}\n`;
    if (contract?.lossClause) prompt += `- Loss & expense clause: ${contract.lossClause}\n`;
    prompt += `\nYou MUST cite Walter Lilly v Mackay [2012], Multiplex v Honeywell [2007], and Henry Boot v Malmaison [1999].\n`;
  }

  // Arguments / position
  prompt += `\nKEY ARGUMENTS / POSITION:\n`;
  if (args?.executiveSummary) prompt += `- Executive summary: ${args.executiveSummary}\n`;
  if (args?.keyPoints) prompt += `- Key points: ${args.keyPoints}\n`;
  if (args?.summaryPoints) prompt += `- Summary points: ${args.summaryPoints}\n`;
  if (args?.responsePoints) prompt += `- Response points: ${args.responsePoints}\n`;
  if (args?.jurisdictionGrounds) prompt += `- Jurisdiction grounds: ${args.jurisdictionGrounds}\n`;
  if (args?.jurisdictionResponse) prompt += `- Jurisdiction position: ${args.jurisdictionResponse}\n`;
  if (args?.jurisdictionFindings) prompt += `- Jurisdiction findings: ${args.jurisdictionFindings}\n`;
  if (args?.counterclaim) prompt += `- Counterclaim/set-off: ${args.counterclaim}\n`;
  if (args?.relief) prompt += `- Relief sought: ${args.relief}\n`;

  // Witness statement specific
  if (submissionType === "witness") {
    prompt += `\nWITNESS DETAILS:\n`;
    if (data.witnessName) prompt += `- Name: ${data.witnessName}\n`;
    if (data.witnessRole) prompt += `- Role: ${data.witnessRole}\n`;
    if (data.witnessAddress) prompt += `- Address: ${data.witnessAddress}\n`;
    if (data.witnessYears) prompt += `- Years with company: ${data.witnessYears}\n`;
    if (data.witnessPriorExperience) prompt += `- Prior experience: ${data.witnessPriorExperience}\n`;
    if (data.witnessProjectRole) prompt += `- Project role: ${data.witnessProjectRole}\n`;
    if (data.witnessSide) prompt += `- Filed on behalf of: ${data.witnessSide} party\n`;
    if (data.witnessFacts) prompt += `- Facts: ${data.witnessFacts}\n`;
    if (data.witnessDisputeEvidence) prompt += `- Dispute evidence: ${data.witnessDisputeEvidence}\n`;
    if (data.witnessSubmissionType) prompt += `- Supporting submission: ${data.witnessSubmissionType}\n`;
  }

  // Adjudicator decision specific
  if (submissionType === "decision") {
    prompt += `\nADJUDICATOR'S NOTES:\n`;
    prompt += `This is a DRAFT decision for the adjudicator's review. Include a prominent disclaimer that this is AI-assisted and must be independently reviewed.\n`;
    if (data.adjudicatorIssue1) prompt += `- Issue 1: ${data.adjudicatorIssue1}\n`;
    if (data.adjudicatorAnalysis1) prompt += `- Analysis 1: ${data.adjudicatorAnalysis1}\n`;
    if (data.adjudicatorIssue2) prompt += `- Issue 2: ${data.adjudicatorIssue2}\n`;
    if (data.adjudicatorAnalysis2) prompt += `- Analysis 2: ${data.adjudicatorAnalysis2}\n`;
  }

  // Documents
  if (data.documents?.length > 0) {
    prompt += `\nDOCUMENTS PROVIDED (reference as Tabs):\n`;
    data.documents.forEach((doc, i) => {
      prompt += `- Tab ${i + 1}: ${doc}\n`;
    });
  }
  if (data.tabs?.additional) {
    prompt += `- Additional tabs: ${data.tabs.additional}\n`;
  }

  prompt += `\nIMPORTANT INSTRUCTIONS:
- Draft the COMPLETE submission from start to finish — do not leave sections blank or use placeholder text like "[to be completed]"
- Where the user has not provided specific information, make reasonable inferences or use appropriate general language
- Cite specific case law authorities with full citations where relevant
- Use proper paragraph numbering (1.1, 1.2, etc.) with section headings
- Reference supporting documents by Tab number
- Include the full formal heading and sign-off
- Be persuasive, authoritative, and thorough
- Today's date is ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
- Write in British English`;

  return prompt;
}

// ─── API ROUTE ──────────────────────────────────────────────
export async function POST(req) {
  try {
    const data = await req.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "Anthropic API key not configured" },
        { status: 500 }
      );
    }

    const userPrompt = buildPrompt(data);

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 16000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    const generatedText = message.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    return NextResponse.json({ document: generatedText });
  } catch (err) {
    console.error("Generation error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to generate document" },
      { status: 500 }
    );
  }
}
