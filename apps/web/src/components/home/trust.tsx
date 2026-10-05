import { cmsDefaults, type TrustContent } from '@/data/cms-defaults';

export function Trust({ content }: { content?: TrustContent }) {
	const c = content ?? cmsDefaults.trust;
	return (
		<section className="trust">
			<div className="rail trust-inner">
				<div className="trust-label">
					{c.label.split('\n').map((l, i) => (
						<span key={i}>{i > 0 && <br />}{l}</span>
					))}
				</div>
				{c.items.map((it) => (
					<div className="trust-item" key={it.title}>{it.title}<small>{it.subtitle}</small></div>
				))}
			</div>
		</section>
	);
}
