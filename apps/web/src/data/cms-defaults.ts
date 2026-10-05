import { faqs as faqRows, roadmap } from '@/data/company';
import { conceptStudies, insights } from '@/data/editorial';

export type FaqItem = { question: string; answer: string };
export type InsightItem = { title: string; body: string };
export type CaseStudy = {
	title: string;
	area: string;
	challenge: string;
	strategy: string;
	approach: string;
	outcome: string;
};
export type FounderTimeline = { stage: string; title: string; body: string };
export type FounderContent = {
	eyebrow: string;
	heading: string;
	intro: string;
	tag: string;
	timeline: FounderTimeline[];
};
export type HeroContent = {
	eyebrow: string;
	headlineMain: string;
	headlineEm: string;
	subtext: string;
};
export type TrustItem = { title: string; subtitle: string };
export type TrustContent = { label: string; items: TrustItem[] };

export type CmsContentMap = {
	home_hero: HeroContent;
	trust: TrustContent;
	faqs: FaqItem[];
	founder: FounderContent;
	case_studies: CaseStudy[];
	insights: InsightItem[];
	roadmap: string[];
};

export type CmsKey = keyof CmsContentMap;

export const cmsDefaults: CmsContentMap = {
	home_hero: {
		eyebrow: 'Your partner in design & digital business',
		headlineMain: 'Design, digital products\nand productivity systems.',
		headlineEm: 'Built to move\nbusinesses forward.',
		subtext:
			'From brand communication and UI/UX to frontend execution, CRM systems and practical business tools. One connected partner, from first idea to everyday operations.',
	},
	trust: {
		label: 'Designed for enterprise.\nBuilt around your business.',
		items: [
			{ title: 'Enterprise thinking', subtitle: 'Complex workflows, clear interfaces' },
			{ title: 'Cross-functional expertise', subtitle: 'Design · Frontend · Business systems' },
			{ title: 'Practical enablement', subtitle: 'Resources your team can use' },
			{ title: 'Credentials forthcoming', subtitle: 'Founder profile & client proof pending' },
		],
	},
	faqs: faqRows.map(([q, a]) => ({ question: q, answer: a })),
	founder: {
		eyebrow: 'The foundation of HelloB2C',
		heading: 'Built on experience.\nLooking forward.',
		intro:
			'Founder profile awaiting source resume. The capability journey below is a company narrative framework, not a verified employment history.',
		tag: 'Profile pending verification',
		timeline: [
			{
				stage: 'Foundation',
				title: 'Website design & visual communication',
				body: 'Founder name, dates, employers and early experience to be supplied.',
			},
			{
				stage: 'Evolution',
				title: 'Product UX & enterprise applications',
				body: 'Verified responsibilities, industries and project achievements to be supplied.',
			},
			{
				stage: 'Next chapter',
				title: 'Business systems & digital enablement',
				body: 'CRM, learning design and AI-assisted product experience to be confirmed from the profile.',
			},
		],
	},
	case_studies: conceptStudies.map((c) => ({
		title: c.title,
		area: c.area,
		challenge: c.challenge,
		strategy: c.strategy,
		approach: c.approach,
		outcome: c.outcome,
	})),
	insights: insights.map((i) => ({ title: i.title, body: i.body })),
	roadmap: [...roadmap],
};
