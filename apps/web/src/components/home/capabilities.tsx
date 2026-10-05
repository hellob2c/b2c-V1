import { Link } from 'react-router';
import { ArrowUpRight } from 'lucide-react';
import { capabilities } from '@/data/company';
export function Capabilities(){return <section className="rail section"><div className="section-heading"><div><div className="eyebrow">What we do</div><h2>Specialist capabilities.<br/>One connected approach.</h2></div><p>We bring design, technology and business understanding together—so every investment has a clear purpose.</p></div><div className="capability-grid">{capabilities.map((c,i)=><Link to={`/services/${c.slug}`} className="capability" key={c.slug}><span className="capability-number">0{i+1}</span><ArrowUpRight className="arrow" size={17}/><h3>{c.title}</h3><p>{c.description}</p><div className="tags">{c.tags}</div></Link>)}</div></section>}
