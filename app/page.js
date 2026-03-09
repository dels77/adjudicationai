"use client";
import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════
   adjudicationai.co.uk — Construction Adjudication Drafting
   ═══════════════════════════════════════════════════════════ */

const C = {
  bg:"#fafafa", white:"#ffffff", navy:"#1a2332", navyLight:"#2a3647",
  border:"#e2e5ea", borderDark:"#d0d4db", gold:"#8b6914", goldLight:"#a67e1e",
  goldBg:"#f8f5ee", text:"#3a3f47", textLight:"#6b7280", textVLight:"#9ca3af",
  green:"#166534", red:"#991b1b", amber:"#92400e", inputBg:"#f5f6f8",
};
const S = {
  page:{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Georgia','Times New Roman',serif"},
  card:{background:C.white,border:`1px solid ${C.border}`,borderRadius:6,padding:28},
  btn:{background:C.navy,color:"#fff",border:"none",borderRadius:4,padding:"12px 28px",fontWeight:600,fontSize:14,cursor:"pointer",fontFamily:"inherit"},
  btnSecondary:{background:"transparent",color:C.navy,border:`1px solid ${C.navy}`,borderRadius:4,padding:"11px 26px",fontWeight:600,fontSize:14,cursor:"pointer",fontFamily:"inherit"},
  btnGhost:{background:"transparent",color:C.textLight,border:"none",padding:"8px 16px",cursor:"pointer",fontFamily:"inherit",fontSize:14},
  input:{width:"100%",padding:"10px 14px",background:C.inputBg,border:`1px solid ${C.border}`,borderRadius:4,color:C.text,fontSize:14,fontFamily:"inherit",outline:"none",boxSizing:"border-box"},
  textarea:{width:"100%",padding:"10px 14px",background:C.inputBg,border:`1px solid ${C.border}`,borderRadius:4,color:C.text,fontSize:14,fontFamily:"inherit",outline:"none",minHeight:110,resize:"vertical",boxSizing:"border-box"},
  label:{display:"block",fontSize:12,color:C.textLight,marginBottom:5,fontWeight:600,letterSpacing:.3,textTransform:"uppercase"},
  h1:{fontSize:36,fontWeight:700,color:C.navy,margin:0,lineHeight:1.25},
  h2:{fontSize:22,fontWeight:700,color:C.navy,margin:"0 0 6px 0"},
  h3:{fontSize:16,fontWeight:600,color:C.navy,margin:"0 0 4px 0"},
};

const Logo = ({size=18}) => <span style={{fontSize:size,fontWeight:700,color:C.navy,letterSpacing:-.3}}>adjudicationai<span style={{color:C.textLight,fontWeight:400}}>.co.uk</span></span>;
const Rule = () => <div style={{height:1,background:C.border,margin:"20px 0"}} />;
const Tag = ({children}) => <span style={{background:C.goldBg,color:C.gold,padding:"3px 10px",borderRadius:3,fontSize:11,fontWeight:600,letterSpacing:.3,textTransform:"uppercase"}}>{children}</span>;

function Input({label,...props}){return<div style={{marginBottom:14}}>{label&&<label style={S.label}>{label}</label>}<input style={S.input}{...props}/></div>}
function Textarea({label,...props}){return<div style={{marginBottom:14}}>{label&&<label style={S.label}>{label}</label>}<textarea style={S.textarea}{...props}/></div>}
function Select({label,options,...props}){return<div style={{marginBottom:14}}>{label&&<label style={S.label}>{label}</label>}<select style={{...S.input,cursor:"pointer"}}{...props}>{options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select></div>}

const SUB_TYPES = {
  party:[
    {id:"notice",label:"Notice of Adjudication",desc:"Identifies the dispute, parties, contract and redress sought"},
    {id:"referral",label:"Referral Notice (General)",desc:"Substantive submission covering defects, variations or quantum"},
    {id:"referral-smash",label:"Referral Notice (Smash and Grab)",desc:"Unpaid payment application where no valid pay less notice was served"},
    {id:"referral-delay",label:"Referral Notice (Delay)",desc:"Extension of time, prolongation costs and loss and expense"},
    {id:"response",label:"Response",desc:"The responding party's answer to a Referral Notice"},
    {id:"reply",label:"Reply",desc:"The referring party's reply to the Response"},
    {id:"rejoinder",label:"Rejoinder",desc:"The responding party's answer to the Reply"},
    {id:"surrejoinder",label:"Surrejoinder",desc:"Further submission in response to the Rejoinder"},
    {id:"jurisdiction",label:"Jurisdiction Submission",desc:"Challenging or defending the adjudicator's jurisdiction"},
    {id:"witness",label:"Witness Statement",desc:"First-hand evidence from a witness of fact"},
  ],
  adjudicator:[{id:"decision",label:"Draft Decision",desc:"AI-assisted draft decision based on the submissions received"}],
};

// ─── NAV ─────────────────────────────────────────────────
function Nav({onAction,actionLabel="Get started"}){
  return <nav style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 40px",borderBottom:`1px solid ${C.border}`,background:C.white}}>
    <Logo size={18} />
    <button style={S.btn} onClick={onAction}>{actionLabel}</button>
  </nav>;
}

// ─── LANDING ─────────────────────────────────────────────
function Landing({onStart}){
  return <div style={S.page}>
    <Nav onAction={onStart} />

    <div style={{maxWidth:640,margin:"0 auto",padding:"80px 40px 60px",textAlign:"center"}}>
      <h1 style={S.h1}>Draft adjudication submissions<br/>with AI assistance</h1>
      <p style={{color:C.textLight,fontSize:16,lineHeight:1.7,margin:"20px auto 0",maxWidth:520}}>
        Describe your dispute, upload your documents, and receive a professionally structured draft submission grounded in construction law and established case law. Ready for review by your solicitor.
      </p>
      <div style={{display:"flex",gap:12,justifyContent:"center",marginTop:32}}>
        <button style={{...S.btn,padding:"14px 32px"}} onClick={onStart}>Start a submission</button>
      </div>
      <p style={{color:C.textVLight,fontSize:12,marginTop:12}}>£500 per submission. Based on HGCRA 1996 s.108.</p>
    </div>

    <Rule />

    <div style={{maxWidth:780,margin:"0 auto",padding:"40px 40px 60px"}}>
      <h2 style={{...S.h2,textAlign:"center",marginBottom:32}}>What you can draft</h2>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        {[
          {t:"Notices of Adjudication",d:"The formal notice identifying the dispute, contract and redress sought, served on the responding party and nominating body."},
          {t:"Referral Notices",d:"Full substantive submissions for smash and grab claims, delay, defects and general disputes, with case law citations."},
          {t:"Responses, Replies and Rejoinders",d:"Responding to or building on earlier submissions with proper legal structure and cross-referencing."},
          {t:"Jurisdiction Submissions",d:"Challenging or defending jurisdiction with reference to crystallisation, scope and statutory requirements."},
          {t:"Witness Statements",d:"Structured statements of fact with proper introductions, chronological evidence and statement of truth."},
          {t:"Draft Decisions (Adjudicators)",d:"For adjudicators: upload the parties' submissions and receive a structured draft decision framework."},
        ].map((f,i) => (
          <div key={i} style={{padding:"16px 20px",border:`1px solid ${C.border}`,borderRadius:4,background:C.white}}>
            <h3 style={S.h3}>{f.t}</h3>
            <p style={{color:C.textLight,fontSize:13,lineHeight:1.5,margin:"4px 0 0"}}>{f.d}</p>
          </div>
        ))}
      </div>
    </div>

    <div style={{background:C.white,borderTop:`1px solid ${C.border}`,padding:"40px 40px"}}>
      <div style={{maxWidth:640,margin:"0 auto",textAlign:"center"}}>
        <h2 style={{...S.h2,marginBottom:8}}>How it works</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:20,marginTop:24}}>
          {[
            {n:"1",t:"Pay",d:"Secure payment of £500 via Stripe."},
            {n:"2",t:"Enter details",d:"Parties, contract, dispute and your arguments."},
            {n:"3",t:"Upload documents",d:"Contract, correspondence, site records."},
            {n:"4",t:"Receive your draft",d:"AI-generated submission with case law."},
          ].map((s,i) => (
            <div key={i} style={{textAlign:"center"}}>
              <div style={{width:32,height:32,borderRadius:16,background:C.navy,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto",fontSize:13,fontWeight:700}}>{s.n}</div>
              <h3 style={{...S.h3,marginTop:10}}>{s.t}</h3>
              <p style={{color:C.textLight,fontSize:12,lineHeight:1.4}}>{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div style={{padding:"40px 40px",maxWidth:640,margin:"0 auto",textAlign:"center"}}>
      <h2 style={{...S.h2,marginBottom:8}}>Professional review</h2>
      <p style={{color:C.textLight,fontSize:14,lineHeight:1.6}}>
        Every draft includes the option to forward your completed submission to a construction solicitor or claims consultant for independent review, refinement and advice before service.
      </p>
    </div>

    <footer style={{padding:"20px 40px",borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <Logo size={14} />
        <span style={{color:C.textVLight,fontSize:11}}>© {new Date().getFullYear()}</span>
      </div>
      <p style={{color:C.textVLight,fontSize:10,maxWidth:420,textAlign:"right",margin:0}}>This tool generates draft submissions only and does not constitute legal advice. Based on the Housing Grants, Construction and Regeneration Act 1996.</p>
    </footer>
  </div>;
}

// ─── MODE SELECT ─────────────────────────────────────────
function ModeSelect({onSelect,onBack}){
  return <div style={S.page}>
    <Nav onAction={onBack} actionLabel="Back" />
    <div style={{maxWidth:600,margin:"0 auto",padding:"60px 40px",textAlign:"center"}}>
      <h2 style={S.h2}>Select your role</h2>
      <p style={{color:C.textLight,marginBottom:32}}>Are you a party to the dispute, or the adjudicator?</p>
      <div style={{display:"flex",gap:16,justifyContent:"center"}}>
        {[
          {mode:"party",t:"Party to a dispute",d:"Draft Notices, Referrals, Responses, Replies, Rejoinders or Witness Statements."},
          {mode:"adjudicator",t:"Adjudicator",d:"Upload the parties' submissions and receive a draft decision framework."},
        ].map(m => (
          <div key={m.mode} onClick={()=>onSelect(m.mode)}
            style={{...S.card,width:260,cursor:"pointer",textAlign:"left",transition:"border-color 0.15s"}}
            onMouseEnter={e=>e.currentTarget.style.borderColor=C.navy}
            onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
            <h3 style={S.h3}>{m.t}</h3>
            <p style={{color:C.textLight,fontSize:13,lineHeight:1.5,margin:"6px 0 0"}}>{m.d}</p>
          </div>
        ))}
      </div>
    </div>
  </div>;
}

// ─── PAYMENT ─────────────────────────────────────────────
function Payment({mode,onPaid,onBack}){
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const handleCheckout = async()=>{
    setLoading(true); setError("");
    try{
      const res=await fetch("/api/create-checkout",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mode,submissionType:mode==="adjudicator"?"decision":"submission"})});
      const data=await res.json();
      if(data.url){window.location.href=data.url;}
      else{setError(data.error||"Failed to create checkout session");setLoading(false);}
    }catch(err){setError("Network error. Please try again.");setLoading(false);}
  };
  return <div style={S.page}>
    <Nav onAction={onBack} actionLabel="Back" />
    <div style={{maxWidth:400,margin:"0 auto",padding:"60px 40px"}}>
      <div style={{...S.card,textAlign:"center"}}>
        <Logo />
        <Rule />
        <div style={{fontSize:36,fontWeight:700,color:C.navy,margin:"8px 0 4px"}}>£500</div>
        <p style={{color:C.textLight,fontSize:14,margin:"0 0 20px"}}>One complete AI-drafted {mode==="adjudicator"?"draft decision":"submission"}</p>
        <div style={{textAlign:"left",margin:"0 0 20px"}}>
          {["AI-drafted submission","Case law analysis and citations","Professional formatting","Option to forward to a solicitor","Includes full document structure"].map((t,i)=>(
            <div key={i} style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:6}}>
              <span style={{color:C.green,fontSize:12,flexShrink:0}}>&#10003;</span>
              <span style={{color:C.text,fontSize:13}}>{t}</span>
            </div>
          ))}
        </div>
        {error&&<p style={{color:C.red,fontSize:13,marginBottom:10}}>{error}</p>}
        <button style={{...S.btn,width:"100%",opacity:loading?.6:1}} onClick={handleCheckout} disabled={loading}>
          {loading?"Redirecting to Stripe...":"Pay £500 — proceed to checkout"}
        </button>
        <p style={{color:C.textVLight,fontSize:11,marginTop:12}}>Secured by Stripe. PCI compliant.</p>
      </div>
    </div>
  </div>;
}

// ─── WIZARD ──────────────────────────────────────────────
const STEPS=["Type","Parties","Contract","Dispute","Arguments","Documents"];
const ADJ_STEPS=["Setup","Parties","Submissions","Issues","Documents"];

function Wizard({mode,onGenerate,onBack}){
  const isAdj=mode==="adjudicator";
  const steps=isAdj?ADJ_STEPS:STEPS;
  const [step,setStep]=useState(0);
  const [data,setData]=useState({
    submissionType:isAdj?"decision":"",referringParty:{},respondingParty:{},
    contract:{},dispute:{},arguments:{},
    witnessSide:"referring",witnessName:"",witnessRole:"",witnessFacts:"",
    witnessAddress:"",witnessYears:"",witnessProjectRole:"",witnessSubmissionType:"Referral",
    witnessDisputeEvidence:"",witnessPriorExperience:"",
    tabs:{},documents:[],adjudicatorIssue1:"",adjudicatorIssue2:"",adjudicatorAnalysis1:"",adjudicatorAnalysis2:"",
  });
  const u=(path,val)=>{setData(prev=>{const next={...prev};const parts=path.split(".");if(parts.length===2){next[parts[0]]={...(next[parts[0]]||{}),[parts[1]]:val};}else{next[parts[0]]=val;}return next;});};
  const types=isAdj?SUB_TYPES.adjudicator:SUB_TYPES.party;
  const isWitness=data.submissionType==="witness";
  const isResponse=["response","rejoinder","surrejoinder"].includes(data.submissionType);

  function renderStep(){
    if(isAdj) return renderAdjStep();
    switch(step){
      case 0: return <div>
        <h2 style={S.h2}>Submission type</h2>
        <p style={{color:C.textLight,marginBottom:20,fontSize:14}}>Select the document you need drafted.</p>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {types.map(t=>(
            <div key={t.id} onClick={()=>u("submissionType",t.id)}
              style={{padding:"12px 16px",border:`1px solid ${data.submissionType===t.id?C.navy:C.border}`,borderRadius:4,cursor:"pointer",background:data.submissionType===t.id?C.goldBg:C.white,transition:"all 0.15s"}}>
              <div style={{color:C.navy,fontWeight:600,fontSize:14}}>{t.label}</div>
              <div style={{color:C.textLight,fontSize:12,marginTop:2}}>{t.desc}</div>
            </div>
          ))}
        </div>
      </div>;
      case 1: return <div>
        <h2 style={S.h2}>Party details</h2>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
          <div>
            <p style={{color:C.navy,fontWeight:700,fontSize:14,marginBottom:12}}>Referring Party</p>
            <Input label="Company / individual name" value={data.referringParty?.name||""} onChange={e=>u("referringParty.name",e.target.value)} />
            <Input label="Short name" value={data.referringParty?.shortName||""} onChange={e=>u("referringParty.shortName",e.target.value)} />
            <Input label="Company number" value={data.referringParty?.regNo||""} onChange={e=>u("referringParty.regNo",e.target.value)} />
            <Input label="Registered address" value={data.referringParty?.address||""} onChange={e=>u("referringParty.address",e.target.value)} />
            <Input label="Representative" value={data.referringParty?.representative||""} onChange={e=>u("referringParty.representative",e.target.value)} />
            <Input label="Email for service" value={data.referringParty?.email||""} onChange={e=>u("referringParty.email",e.target.value)} />
          </div>
          <div>
            <p style={{color:C.navy,fontWeight:700,fontSize:14,marginBottom:12}}>Responding Party</p>
            <Input label="Company / individual name" value={data.respondingParty?.name||""} onChange={e=>u("respondingParty.name",e.target.value)} />
            <Input label="Short name" value={data.respondingParty?.shortName||""} onChange={e=>u("respondingParty.shortName",e.target.value)} />
            <Input label="Company number" value={data.respondingParty?.regNo||""} onChange={e=>u("respondingParty.regNo",e.target.value)} />
            <Input label="Registered address" value={data.respondingParty?.address||""} onChange={e=>u("respondingParty.address",e.target.value)} />
            <Input label="Representative" value={data.respondingParty?.representative||""} onChange={e=>u("respondingParty.representative",e.target.value)} />
            <Input label="Email" value={data.respondingParty?.email||""} onChange={e=>u("respondingParty.email",e.target.value)} />
          </div>
        </div>
      </div>;
      case 2: return <div>
        <h2 style={S.h2}>Contract</h2>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <Select label="Contract form" value={data.contract?.type||""} onChange={e=>u("contract.type",e.target.value)}
            options={[{value:"",label:"Select..."},{value:"JCT Design and Build 2016",label:"JCT DB 2016"},{value:"JCT Standard Building Contract 2016",label:"JCT SBC 2016"},{value:"JCT Minor Works",label:"JCT Minor Works"},{value:"JCT Intermediate",label:"JCT Intermediate"},{value:"NEC4 ECC",label:"NEC4 ECC"},{value:"NEC3 ECC",label:"NEC3 ECC"},{value:"JCT Sub-Contract",label:"JCT Sub-Contract"},{value:"bespoke contract",label:"Bespoke"},{value:"oral contract",label:"Oral / no written terms"}]} />
          <Input label="Contract date" type="date" value={data.contract?.date||""} onChange={e=>u("contract.date",e.target.value)} />
        </div>
        <Textarea label="Description of works" value={data.contract?.description||""} onChange={e=>u("contract.description",e.target.value)} placeholder="e.g. Design and construction of a 50-unit residential development including external works" />
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <Input label="Site address" value={data.contract?.site||""} onChange={e=>u("contract.site",e.target.value)} />
          <Input label="Contract value" value={data.contract?.value||""} onChange={e=>u("contract.value",e.target.value)} placeholder="e.g. £2,500,000" />
        </div>
        <Select label="Adjudication basis" value={data.contract?.adjBasis||"statutory"} onChange={e=>u("contract.adjBasis",e.target.value)}
          options={[{value:"statutory",label:"Statutory (HGCRA 1996 s.108 and the Scheme)"},{value:"contractual",label:"Contractual (adjudication clause in the contract)"}]} />
        {data.contract?.adjBasis==="contractual"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <Input label="Clause reference" value={data.contract?.clauseRef||""} onChange={e=>u("contract.clauseRef",e.target.value)} />
          <Input label="Adjudication rules" value={data.contract?.rules||""} onChange={e=>u("contract.rules",e.target.value)} placeholder="e.g. CIArb Rules" />
        </div>}
        <Input label="Nominating body" value={data.contract?.nominatingBody||""} onChange={e=>u("contract.nominatingBody",e.target.value)} placeholder="e.g. RICS, CIArb, TeCSA, RIBA" />
        <Textarea label="Relevant clauses" value={data.contract?.relevantClauses||""} onChange={e=>u("contract.relevantClauses",e.target.value)} placeholder="List the key clauses relevant to your dispute" />
      </div>;
      case 3: return <div>
        <h2 style={S.h2}>The dispute</h2>
        <Textarea label="Description of the dispute" value={data.dispute?.description||""} onChange={e=>u("dispute.description",e.target.value)} placeholder="e.g. Outstanding payment of Interim Application No. 7 dated 15 January 2026 in the sum of £187,500 where no valid pay less notice was served" />
        <Input label="Amount claimed" value={data.dispute?.amount||""} onChange={e=>u("dispute.amount",e.target.value)} placeholder="e.g. £187,500" />
        <Textarea label="Background" value={data.dispute?.background||""} onChange={e=>u("dispute.background",e.target.value)} placeholder="Chronological factual background to the dispute" style={{minHeight:150}} />
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
          <Input label="Crystallisation date" type="date" value={data.dispute?.crystallisationDate||""} onChange={e=>u("dispute.crystallisationDate",e.target.value)} />
          <Input label="Notice date" type="date" value={data.dispute?.noticeDate||""} onChange={e=>u("dispute.noticeDate",e.target.value)} />
          <Input label="Appointment date" type="date" value={data.dispute?.appointmentDate||""} onChange={e=>u("dispute.appointmentDate",e.target.value)} />
        </div>
        {data.submissionType==="referral-smash"&&<><Rule /><p style={{color:C.navy,fontWeight:700,fontSize:14,marginBottom:12}}>Smash and grab details</p>
          <Input label="Payment application date" type="date" value={data.dispute?.paymentAppDate||""} onChange={e=>u("dispute.paymentAppDate",e.target.value)} />
          <Input label="Payment application reference" value={data.dispute?.paymentAppRef||""} onChange={e=>u("dispute.paymentAppRef",e.target.value)} />
          <Input label="Pay less notice deadline" type="date" value={data.dispute?.payLessDeadline||""} onChange={e=>u("dispute.payLessDeadline",e.target.value)} /></>}
        {data.submissionType==="referral-delay"&&<><Rule /><p style={{color:C.navy,fontWeight:700,fontSize:14,marginBottom:12}}>Delay claim details</p>
          <Input label="Contractual completion date" type="date" value={data.dispute?.completionDate||""} onChange={e=>u("dispute.completionDate",e.target.value)} />
          <Input label="Extension of time claimed" value={data.dispute?.eotClaimed||""} onChange={e=>u("dispute.eotClaimed",e.target.value)} placeholder="e.g. 14 weeks" />
          <Textarea label="Delay events" value={data.dispute?.delayEvents||""} onChange={e=>u("dispute.delayEvents",e.target.value)} placeholder="List each delay event with dates and duration" />
          <Input label="Loss and expense claimed" value={data.dispute?.lossAndExpense||""} onChange={e=>u("dispute.lossAndExpense",e.target.value)} />
          <Textarea label="Loss breakdown" value={data.dispute?.lossBreakdown||""} onChange={e=>u("dispute.lossBreakdown",e.target.value)} /></>}
        {isResponse&&<Input label="Referral date" type="date" value={data.dispute?.referralDate||""} onChange={e=>u("dispute.referralDate",e.target.value)} />}
      </div>;
      case 4: return <div>
        {isWitness?<>
          <h2 style={S.h2}>Witness statement</h2>
          <Select label="Filed on behalf of" value={data.witnessSide} onChange={e=>u("witnessSide",e.target.value)} options={[{value:"referring",label:"Referring Party"},{value:"responding",label:"Responding Party"}]} />
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <Input label="Witness full name" value={data.witnessName} onChange={e=>u("witnessName",e.target.value)} />
            <Input label="Job title / role" value={data.witnessRole} onChange={e=>u("witnessRole",e.target.value)} />
          </div>
          <Input label="Address" value={data.witnessAddress} onChange={e=>u("witnessAddress",e.target.value)} />
          <Input label="Role on this project" value={data.witnessProjectRole} onChange={e=>u("witnessProjectRole",e.target.value)} />
          <Textarea label="The facts (chronological account)" value={data.witnessFacts} onChange={e=>u("witnessFacts",e.target.value)} style={{minHeight:180}} />
          <Textarea label="Evidence on the dispute" value={data.witnessDisputeEvidence} onChange={e=>u("witnessDisputeEvidence",e.target.value)} />
        </>:<>
          <h2 style={S.h2}>Your arguments and position</h2>
          <Textarea label="Executive summary" value={data.arguments?.executiveSummary||""} onChange={e=>u("arguments.executiveSummary",e.target.value)} placeholder="A concise overview of your case" />
          <Textarea label="Key arguments" value={data.arguments?.keyPoints||""} onChange={e=>u("arguments.keyPoints",e.target.value)} placeholder="The main arguments you want the submission to advance" style={{minHeight:150}} />
          {isResponse&&<Textarea label="Response points" value={data.arguments?.responsePoints||""} onChange={e=>u("arguments.responsePoints",e.target.value)} placeholder="Your specific responses to the claim" />}
          <Textarea label="Relief sought (leave blank for standard relief)" value={data.arguments?.relief||""} onChange={e=>u("arguments.relief",e.target.value)} />
        </>}
      </div>;
      case 5: return <div>
        <h2 style={S.h2}>Supporting documents</h2>
        <p style={{color:C.textLight,marginBottom:20,fontSize:14}}>Upload the contract, correspondence, site records and any supporting documents. These will be referenced as Tabs in your submission.</p>
        <div style={{border:`1px dashed ${C.borderDark}`,borderRadius:4,padding:32,textAlign:"center",background:C.inputBg}}>
          <p style={{color:C.text,fontWeight:600,fontSize:14,margin:"0 0 4px"}}>Upload files</p>
          <p style={{color:C.textLight,fontSize:12,margin:"0 0 12px"}}>PDF, DOCX, XLSX, images or emails</p>
          <input type="file" multiple style={{fontSize:13}} onChange={e=>{u("documents",[...(data.documents||[]),...Array.from(e.target.files).map(f=>f.name)]);}} />
        </div>
        {data.documents?.length>0&&<div style={{marginTop:12}}>{data.documents.map((f,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",background:C.inputBg,borderRadius:4,marginBottom:4,border:`1px solid ${C.border}`}}>
            <span style={{color:C.text,fontSize:13,flex:1}}>Tab {i+1}: {f}</span>
            <span style={{color:C.red,cursor:"pointer",fontSize:11,fontWeight:600}} onClick={()=>u("documents",data.documents.filter((_,j)=>j!==i))}>Remove</span>
          </div>
        ))}</div>}
        <Textarea label="Additional tab references" value={data.tabs?.additional||""} onChange={e=>u("tabs.additional",e.target.value)} placeholder="e.g. Tab 5: Payment Application No. 7" />
      </div>;
      default: return null;
    }
  }

  function renderAdjStep(){
    switch(step){
      case 0: return <div>
        <h2 style={S.h2}>Adjudicator — draft decision</h2>
        <div style={{padding:"12px 16px",background:"#fef3c7",border:"1px solid #fcd34d",borderRadius:4,marginBottom:20}}>
          <p style={{color:C.amber,fontSize:13,margin:0}}><strong>Important:</strong> This produces a draft for the adjudicator's review only. It does not constitute legal advice and must be independently reviewed.</p>
        </div>
        <Select label="Contract form" value={data.contract?.type||""} onChange={e=>u("contract.type",e.target.value)}
          options={[{value:"",label:"Select..."},{value:"JCT DB 2016",label:"JCT DB 2016"},{value:"NEC4 ECC",label:"NEC4 ECC"},{value:"bespoke",label:"Bespoke"},{value:"other",label:"Other"}]} />
        <Input label="Contract date" type="date" value={data.contract?.date||""} onChange={e=>u("contract.date",e.target.value)} />
        <Textarea label="Description of works" value={data.contract?.description||""} onChange={e=>u("contract.description",e.target.value)} />
        <Input label="Site" value={data.contract?.site||""} onChange={e=>u("contract.site",e.target.value)} />
      </div>;
      case 1: return <div>
        <h2 style={S.h2}>Parties</h2>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
          <div><p style={{color:C.navy,fontWeight:700,fontSize:14,marginBottom:12}}>Referring Party</p>
            <Input label="Name" value={data.referringParty?.name||""} onChange={e=>u("referringParty.name",e.target.value)} />
            <Input label="Representative" value={data.referringParty?.representative||""} onChange={e=>u("referringParty.representative",e.target.value)} /></div>
          <div><p style={{color:C.navy,fontWeight:700,fontSize:14,marginBottom:12}}>Responding Party</p>
            <Input label="Name" value={data.respondingParty?.name||""} onChange={e=>u("respondingParty.name",e.target.value)} />
            <Input label="Representative" value={data.respondingParty?.representative||""} onChange={e=>u("respondingParty.representative",e.target.value)} /></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginTop:14}}>
          <Input label="Appointment date" type="date" value={data.dispute?.appointmentDate||""} onChange={e=>u("dispute.appointmentDate",e.target.value)} />
          <Input label="Referral date" type="date" value={data.dispute?.referralDate||""} onChange={e=>u("dispute.referralDate",e.target.value)} />
          <Input label="Decision deadline" type="date" value={data.dispute?.decisionDeadline||""} onChange={e=>u("dispute.decisionDeadline",e.target.value)} />
        </div>
      </div>;
      case 2: return <div>
        <h2 style={S.h2}>Submissions received</h2>
        <Textarea label="Nature of the dispute" value={data.dispute?.description||""} onChange={e=>u("dispute.description",e.target.value)} />
        <Input label="Amount claimed" value={data.dispute?.amount||""} onChange={e=>u("dispute.amount",e.target.value)} />
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
          <Input label="Response date" type="date" value={data.dispute?.responseDate||""} onChange={e=>u("dispute.responseDate",e.target.value)} />
          <Input label="Reply date" type="date" value={data.dispute?.replyDate||""} onChange={e=>u("dispute.replyDate",e.target.value)} />
          <Input label="Rejoinder date" type="date" value={data.dispute?.rejoinderDate||""} onChange={e=>u("dispute.rejoinderDate",e.target.value)} />
        </div>
        <Textarea label="Relief sought by referring party" value={data.arguments?.relief||""} onChange={e=>u("arguments.relief",e.target.value)} />
      </div>;
      case 3: return <div>
        <h2 style={S.h2}>Issues to determine</h2>
        <Input label="Issue 1" value={data.adjudicatorIssue1} onChange={e=>u("adjudicatorIssue1",e.target.value)} placeholder="e.g. Is the notified sum payable?" />
        <Textarea label="Analysis — Issue 1" value={data.adjudicatorAnalysis1} onChange={e=>u("adjudicatorAnalysis1",e.target.value)} style={{minHeight:150}} />
        <Input label="Issue 2" value={data.adjudicatorIssue2} onChange={e=>u("adjudicatorIssue2",e.target.value)} />
        <Textarea label="Analysis — Issue 2" value={data.adjudicatorAnalysis2} onChange={e=>u("adjudicatorAnalysis2",e.target.value)} />
      </div>;
      case 4: return <div>
        <h2 style={S.h2}>Documents</h2>
        <div style={{border:`1px dashed ${C.borderDark}`,borderRadius:4,padding:32,textAlign:"center",background:C.inputBg}}>
          <p style={{color:C.text,fontWeight:600,fontSize:14,margin:"0 0 12px"}}>Upload submissions and evidence bundles</p>
          <input type="file" multiple style={{fontSize:13}} onChange={e=>{u("documents",[...(data.documents||[]),...Array.from(e.target.files).map(f=>f.name)]);}} />
        </div>
        {data.documents?.length>0&&data.documents.map((f,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",background:C.inputBg,borderRadius:4,marginBottom:4,marginTop:i===0?12:0,border:`1px solid ${C.border}`}}><span style={{color:C.text,fontSize:13}}>{f}</span></div>))}
      </div>;
      default: return null;
    }
  }

  const canNext=step===0?!!data.submissionType:true;
  const isLast=step===steps.length-1;

  return <div style={S.page}>
    <nav style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 40px",borderBottom:`1px solid ${C.border}`,background:C.white}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <Logo />
        {isAdj&&<Tag>Adjudicator</Tag>}
      </div>
      <button style={S.btnGhost} onClick={onBack}>Exit</button>
    </nav>

    {/* Progress */}
    <div style={{display:"flex",justifyContent:"center",gap:4,padding:"20px 40px",background:C.white,borderBottom:`1px solid ${C.border}`}}>
      {steps.map((s,i)=>(
        <div key={i} style={{display:"flex",alignItems:"center",gap:4}}>
          <div style={{width:24,height:24,borderRadius:12,background:i<=step?C.navy:C.inputBg,border:`1px solid ${i<=step?C.navy:C.border}`,color:i<=step?"#fff":C.textLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:600}}>{i+1}</div>
          <span style={{color:i<=step?C.navy:C.textVLight,fontSize:12,marginRight:12}}>{s}</span>
        </div>
      ))}
    </div>

    <div style={{maxWidth:720,margin:"0 auto",padding:"32px 40px"}}>
      <div style={S.card}>{renderStep()}</div>
      <div style={{display:"flex",justifyContent:"space-between",marginTop:20}}>
        <button style={S.btnSecondary} onClick={()=>step>0?setStep(step-1):onBack()}>{step>0?"Previous":"Exit"}</button>
        {isLast
          ?<button style={{...S.btn,opacity:canNext?1:.5}} onClick={()=>canNext&&onGenerate(data)} disabled={!canNext}>Generate submission</button>
          :<button style={{...S.btn,opacity:canNext?1:.5}} onClick={()=>canNext&&setStep(step+1)} disabled={!canNext}>Next</button>}
      </div>
    </div>
  </div>;
}

// ─── GENERATING ──────────────────────────────────────────
function Generating({data,onDone,onError}){
  const [progress,setProgress]=useState(0);
  const [stage,setStage]=useState(0);
  const stages=["Analysing dispute details","Reviewing contract provisions","Cross-referencing case law","Structuring the submission","Drafting legal arguments","Applying HGCRA 1996 principles","Generating with AI","Finalising"];
  const called=useRef(false);
  useEffect(()=>{const iv=setInterval(()=>{setProgress(p=>Math.min(p+0.5,95));},100);return()=>clearInterval(iv);},[]);
  useEffect(()=>{setStage(Math.min(Math.floor(progress/(100/stages.length)),stages.length-1));},[progress]);
  useEffect(()=>{
    if(called.current) return; called.current=true;
    fetch("/api/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)})
      .then(r=>r.json()).then(res=>{if(res.document){setProgress(100);setTimeout(()=>onDone(res.document),500);}else{onError(res.error||"Generation failed");}}).catch(err=>onError(err.message));
  },[]);

  return <div style={{...S.page,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",padding:48}}>
    <Logo size={20} />
    <div style={{width:360,marginTop:40}}>
      <div style={{height:3,background:C.border,borderRadius:2,overflow:"hidden",marginBottom:16}}>
        <div style={{height:"100%",width:`${progress}%`,background:C.navy,borderRadius:2,transition:"width 0.3s"}} />
      </div>
      <p style={{color:C.navy,fontSize:15,fontWeight:600,textAlign:"center"}}>{stages[stage]}...</p>
      <p style={{color:C.textVLight,fontSize:12,textAlign:"center"}}>{Math.round(progress)}%</p>
    </div>
  </div>;
}

// ─── RESULT ──────────────────────────────────────────────
function Result({document:doc,submissionType,onConnect,onBack}){
  const [copied,setCopied]=useState(false);
  const labels={"notice":"Notice of Adjudication","referral":"Referral Notice","referral-smash":"Referral (Smash and Grab)","referral-delay":"Referral (Delay)","response":"Response","reply":"Reply","rejoinder":"Rejoinder","surrejoinder":"Surrejoinder","jurisdiction":"Jurisdiction Submission","witness":"Witness Statement","decision":"Draft Decision"};
  const handleCopy=()=>{navigator.clipboard.writeText(doc).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2000);});};
  return <div style={S.page}>
    <nav style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 40px",borderBottom:`1px solid ${C.border}`,background:C.white}}>
      <Logo />
      <div style={{display:"flex",gap:10,alignItems:"center"}}>
        <button style={S.btnSecondary} onClick={handleCopy}>{copied?"Copied":"Copy to clipboard"}</button>
        <button style={S.btn} onClick={onConnect}>Forward to solicitor</button>
      </div>
    </nav>
    <div style={{maxWidth:800,margin:"0 auto",padding:"24px 40px"}}>
      <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:16}}>
        <Tag>{labels[submissionType]||"Submission"}</Tag>
        <span style={{color:C.green,fontSize:12}}>Draft generated</span>
      </div>
      <div style={{...S.card,padding:0,overflow:"hidden"}}>
        <div style={{background:C.inputBg,padding:"10px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{color:C.navy,fontSize:13,fontWeight:600}}>{labels[submissionType]}</span>
          <span style={{color:C.textVLight,fontSize:11}}>{new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})}</span>
        </div>
        <pre style={{padding:28,margin:0,whiteSpace:"pre-wrap",wordWrap:"break-word",fontFamily:"Georgia,'Times New Roman',serif",fontSize:13,lineHeight:1.75,color:C.text,maxHeight:"65vh",overflowY:"auto",background:C.white}}>{doc}</pre>
      </div>
      <div style={{...S.card,marginTop:20,textAlign:"center"}}>
        <h3 style={S.h3}>Take this further</h3>
        <p style={{color:C.textLight,fontSize:13,lineHeight:1.6,maxWidth:520,margin:"6px auto 16px"}}>Forward this draft to a construction solicitor or claims consultant for independent review, refinement and advice before service.</p>
        <div style={{display:"flex",gap:10,justifyContent:"center"}}>
          <button style={S.btn} onClick={onConnect}>Find a solicitor</button>
          <button style={S.btnSecondary} onClick={onBack}>New submission</button>
        </div>
      </div>
      <p style={{color:C.textVLight,fontSize:10,textAlign:"center",marginTop:14}}>AI-generated draft. Does not constitute legal advice. Seek independent legal advice before service.</p>
    </div>
  </div>;
}

// ─── CONNECT ─────────────────────────────────────────────
function Connect({onBack}){
  const pros=[
    {name:"Construction Legal Partners LLP",type:"Solicitors",spec:"Adjudication, TCC litigation, contract disputes",loc:"London"},
    {name:"BuildResolve Claims Consultants",type:"Claims Consultants",spec:"Delay analysis, quantum, adjudication support",loc:"Manchester"},
    {name:"Adjudication Chambers",type:"Barristers",spec:"Construction advisory, adjudication advocacy",loc:"London"},
    {name:"Construct Legal Advisory",type:"Solicitors",spec:"JCT and NEC disputes, payment claims",loc:"Birmingham"},
    {name:"Quantum Claims Group",type:"Claims Consultants",spec:"Final accounts, variations, loss and expense",loc:"Leeds"},
    {name:"Apex Construction Law",type:"Solicitors",spec:"Adjudication enforcement, TCC proceedings",loc:"Bristol"},
  ];
  return <div style={S.page}>
    <nav style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 40px",borderBottom:`1px solid ${C.border}`,background:C.white}}>
      <Logo />
      <button style={S.btnGhost} onClick={onBack}>Back to draft</button>
    </nav>
    <div style={{maxWidth:720,margin:"0 auto",padding:"32px 40px"}}>
      <h2 style={{...S.h2,textAlign:"center"}}>Forward to a specialist</h2>
      <p style={{color:C.textLight,textAlign:"center",maxWidth:500,margin:"8px auto 28px",fontSize:14}}>Select a professional to review and refine your draft submission before service.</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        {pros.map((p,i)=>(
          <div key={i} style={{...S.card,transition:"border-color 0.15s",cursor:"pointer"}}
            onMouseEnter={e=>e.currentTarget.style.borderColor=C.navy} onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
            <Tag>{p.type}</Tag>
            <h3 style={{...S.h3,marginTop:10}}>{p.name}</h3>
            <p style={{color:C.textLight,fontSize:12}}>{p.spec}</p>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10}}>
              <span style={{color:C.textVLight,fontSize:11}}>{p.loc}</span>
              <button style={{...S.btnSecondary,padding:"5px 14px",fontSize:11}}>Forward draft</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>;
}

// ─── MAIN APP ────────────────────────────────────────────
export default function App(){
  const [screen,setScreen]=useState("landing");
  const [mode,setMode]=useState("party");
  const [generatedDoc,setGeneratedDoc]=useState("");
  const [submissionType,setSubmissionType]=useState("");
  const [formData,setFormData]=useState(null);

  useEffect(()=>{
    const params=new URLSearchParams(window.location.search);
    if(params.get("paid")==="true"){
      const sessionId=params.get("session_id");
      if(sessionId){
        fetch("/api/verify-payment",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sessionId})})
          .then(r=>r.json()).then(data=>{if(data.paid){setMode(data.mode||"party");setScreen("wizard");window.history.replaceState({},"","/");}});
      }
    }
  },[]);

  const handleGenerate=(data)=>{setFormData(data);setSubmissionType(data.submissionType);setScreen("generating");};

  switch(screen){
    case "landing": return <Landing onStart={()=>setScreen("mode")} />;
    case "mode": return <ModeSelect onSelect={m=>{setMode(m);setScreen("payment");}} onBack={()=>setScreen("landing")} />;
    case "payment": return <Payment mode={mode} onPaid={()=>setScreen("wizard")} onBack={()=>setScreen("mode")} />;
    case "wizard": return <Wizard mode={mode} onGenerate={handleGenerate} onBack={()=>setScreen("landing")} />;
    case "generating": return <Generating data={formData} onDone={doc=>{setGeneratedDoc(doc);setScreen("result");}} onError={err=>{alert("Error: "+err);setScreen("wizard");}} />;
    case "result": return <Result document={generatedDoc} submissionType={submissionType} onConnect={()=>setScreen("connect")} onBack={()=>{setScreen("landing");setGeneratedDoc("");}} />;
    case "connect": return <Connect onBack={()=>setScreen("result")} />;
    default: return <Landing onStart={()=>setScreen("mode")} />;
  }
}
