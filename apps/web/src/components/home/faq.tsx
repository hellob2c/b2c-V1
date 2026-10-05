import { cmsDefaults, type FaqItem } from '@/data/cms-defaults';

export function Faq({ items }: { items?: FaqItem[] }) {
	const faqs = items ?? cmsDefaults.faqs;
	return (
		<section className="rail section">
			<div className="section-heading">
				<div>
					<div className="eyebrow">Before we begin</div>
					<h2>A few things worth knowing.</h2>
				</div>
				<p>Client testimonials and logos are awaiting permission and verification. No endorsements are implied by the demonstration content.</p>
			</div>
			{faqs.map((f) => (
				<details className="faq-row" key={f.question}>
					<summary>{f.question}</summary>
					<p>{f.answer}</p>
				</details>
			))}
		</section>
	);
}
