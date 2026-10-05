import { Link } from 'react-router';
import { ArrowUpRight, Layers, Wrench, BookOpen, Package, LayoutDashboard, Check } from 'lucide-react';
import { cmsDefaults, type HeroContent } from '@/data/cms-defaults';

const lines = (s: string) => s.split('\n');

export function Hero({ content }: { content?: HeroContent }) {
	const c = content ?? cmsDefaults.home_hero;
	return (
		<section className="hero">
			<div className="rail hero-inner">
				<div className="entrance">
					<div className="eyebrow">{c.eyebrow}</div>
					<h1>
						{lines(c.headlineMain).map((l, i) => (
							<span key={i}>{i > 0 && <br />}{l}</span>
						))}
						<br />
						<em>
							{lines(c.headlineEm).map((l, i) => (
								<span key={i}>{i > 0 && <br />}{l}</span>
							))}
						</em>
					</h1>
					<p>{c.subtext}</p>
					<div className="hero-actions">
						<Link className="button gold" to="/services">Explore Services <ArrowUpRight size={14}/></Link>
						<Link className="button light" to="/contact">Build Your Solution <ArrowUpRight size={14}/></Link>
					</div>
					<div className="hero-note">
						<span><Check size={12}/> Business-first thinking</span>
						<span><Check size={12}/> End-to-end delivery</span>
						<span><Check size={12}/> Built for scale</span>
					</div>
				</div>
				<div className="ecosystem entrance" style={{animationDelay:'.15s'}} aria-label="HelloB2C business ecosystem">
					<div className="eco-top"><span>THE HELLOB2C ECOSYSTEM</span><span>CONNECTED BY DESIGN</span></div>
					<svg className="eco-lines" viewBox="0 0 400 300" aria-hidden="true"><path d="M70 78 L200 130 L335 78 M65 215 L200 130 L335 215 M200 130 L200 300" fill="none" stroke="#72809a" strokeWidth="1" strokeDasharray="3 4"/></svg>
					<div className="eco-core"><strong>HelloB2C</strong><small>YOUR BUSINESS. CONNECTED.</small></div>
					<Link className="eco-node n1" to="/services"><Layers size={16}/> Services</Link>
					<Link className="eco-node n2" to="/tools"><Wrench size={16}/> Tools</Link>
					<Link className="eco-node n3" to="/products"><Package size={16}/> Products</Link>
					<Link className="eco-node n4" to="/academy"><BookOpen size={16}/> Academy</Link>
					<Link className="eco-node n5" to="/workspace"><LayoutDashboard size={15}/> Client Workspace <ArrowUpRight size={12}/></Link>
					<div className="eco-caption">STRATEGY → EXECUTION → ENABLEMENT</div>
				</div>
			</div>
		</section>
	);
}
