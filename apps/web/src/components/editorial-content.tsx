import { Link } from 'react-router';
import { useState } from 'react';
import { Founder } from '@/components/home/founder';
import { CaseStudy } from '@/components/home/case-study';
import { cmsDefaults, type CmsContentMap } from '@/data/cms-defaults';

export function EditorialContent({ section, cms }: { section: string; cms?: Partial<CmsContentMap> }) {
	const [query, setQuery] = useState('');
	if (section === 'about') {
		return <><Founder content={cms?.founder ?? cmsDefaults.founder}/><div className="rail section content-grid"><div><h2>A connected way to work.</h2><p style={{fontSize:13,color:'var(--quiet)',marginTop:20}}>HelloB2C is structured around the relationship between brand communication, product usability and business operations. Services, resources and tools are designed to support that complete journey.</p></div><div className="panel"><span className="tag">Founder credentials pending</span><h3 style={{marginTop:20}}>A profile grounded in verified experience.</h3><p>Founder biography, employers, years of experience, industries, achievements, client logos and testimonials will be added from the missing resume and approved source material. We will not substitute invented proof.</p></div></div></>;
	}
	if (section === 'case-studies') {
		const studies = cms?.case_studies ?? cmsDefaults.case_studies;
		return <><CaseStudy/><div className="rail section">{studies.map(c => <article className="panel" style={{marginBottom:25}} key={c.title}><span className="tag">Illustrative concept · {c.area}</span><h2 style={{marginTop:20}}>{c.title}</h2><div className="content-grid">{[['Challenge',c.challenge],['Strategy',c.strategy],['Design approach',c.approach],['Expected outcome',c.outcome]].map(([t,b]) => <div key={t}><h3>{t}</h3><p>{b}</p></div>)}</div></article>)}</div></>;
	}
	if (section === 'academy') {
		return <div className="rail section"><div className="notice">Academy preview. No live courses, certificates or learning purchases are available yet.</div><div className="tools-grid">{['UI/UX for Business Applications','Design Systems in Practice','Business Productivity Essentials'].map((title,i) => <article className="panel" key={title}><span className="tag">Curriculum planned</span><h2 style={{marginTop:20,fontSize:20}}>{title}</h2><p>{['Research, journeys, wireframes and interface decisions for complex products.','Tokens, reusable patterns, documentation and accessible components.','Business calculations, estimation and repeatable workflows.'][i]}</p><Link className="text-link" to="/contact">Enquire about learning resources</Link></article>)}</div><div className="panel" style={{marginTop:35}}><h2>Built for practical application.</h2><p>Future courses will include lessons, downloadable workbooks, assessments and completion certificates. Course assets, instructor credentials, prices and certification rules must be supplied before launch.</p></div></div>;
	}
	if (section === 'insights') {
		const items = cms?.insights ?? cmsDefaults.insights;
		return <div className="rail section"><div className="toolbar"><input aria-label="Search insights" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search practical insights"/></div>{items.filter(x => (x.title + x.body).toLowerCase().includes(query.toLowerCase())).map(x => <article className="panel" style={{marginBottom:20}} key={x.title}><span className="tag">HelloB2C editorial</span><h2 style={{marginTop:20}}>{x.title}</h2><p style={{maxWidth:850}}>{x.body}</p></article>)}</div>;
	}
	const roadmap = cms?.roadmap ?? cmsDefaults.roadmap;
	return <div className="rail section"><div className="content-grid">{[['Brand & growth','A consistent identity and campaign language, supported by templates your team can maintain.','graphic-design'],['Digital product & experience','User journeys, interfaces and frontend handoff for a focused product build.','ui-ux'],['Business operations','CRM workflows, dashboard design and shared systems for operational clarity.','crm'],['Team enablement','Practical tools, learning resources and reusable business assets.','productivity']].map(([t,b,s]) => <article className="panel" key={t}><h2>{t}</h2><p>{b}</p><Link className="text-link" to={`/services/${s}`}>Explore this solution</Link></article>)}</div><div className="panel" style={{marginTop:35}}><span className="tag">Platform roadmap</span><h2 style={{marginTop:20}}>A foundation designed to grow.</h2><ul style={{fontSize:12,lineHeight:2.5}}>{roadmap.map(r => <li key={r}>{r} — planned</li>)}</ul><Link className="button" to="/contact">Discuss your business requirements</Link></div></div>;
}
