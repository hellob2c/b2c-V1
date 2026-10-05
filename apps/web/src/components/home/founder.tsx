import { cmsDefaults, type FounderContent } from '@/data/cms-defaults';

export function Founder({ content }: { content?: FounderContent }) {
	const c = content ?? cmsDefaults.founder;
	return (
		<section style={{ background: 'var(--cool)' }}>
			<div className="rail section founder">
				<div>
					<div className="eyebrow">{c.eyebrow}</div>
					<h2>{c.heading.split('\n').map((l, i) => (
						<span key={i}>{i > 0 && <br />}{l}</span>
					))}</h2>
					<p style={{ fontSize: 11, color: 'var(--quiet)', marginTop: 20 }}>{c.intro}</p>
					<span className="tag" style={{ marginTop: 20 }}>{c.tag}</span>
				</div>
				<div>
					{c.timeline.map((t) => (
						<div className="timeline-row" key={t.stage}>
							<small>{t.stage}</small>
							<div>
								<h3>{t.title}</h3>
								<p>{t.body}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
