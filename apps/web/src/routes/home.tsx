import type { Route } from './+types/home';
import { seo } from '@/lib/seo';
import { getProducts } from '@/api/ecommerce-api';
import { loadCmsContent } from '@/lib/cms.server';
import { resolveCms } from '@/lib/cms';
import { Hero } from '@/components/home/hero';
import { Trust } from '@/components/home/trust';
import { Capabilities } from '@/components/home/capabilities';
import { Workflow } from '@/components/home/workflow';
import { ToolsShowcase } from '@/components/home/tools-showcase';
import { Packages } from '@/components/home/packages';
import { ProductsShowcase } from '@/components/home/products-showcase';
import { CaseStudy } from '@/components/home/case-study';
import { Founder } from '@/components/home/founder';
import { Faq } from '@/components/home/faq';
import { Newsletter } from '@/components/newsletter';
export function meta({matches,location}:Route.MetaArgs){return seo({matches,location},{title:'HelloB2C — Design, Digital & Business Systems',description:'Design expertise, digital products and productivity systems. Explore HelloB2C services, practical business tools and a connected client workspace.'});}
export async function loader(){
	const [products,cms]=await Promise.all([
		getProducts({exclude_types:'subscription',limit:12}).then(r=>r.products).catch(()=>[]),
		loadCmsContent(['home_hero','trust','faqs','founder']),
	]);
	return {products,cms};
}
export default function HomePage({loaderData}:Route.ComponentProps){
	const cms=loaderData.cms;
	return <><Hero content={resolveCms(cms,'home_hero')}/><Trust content={resolveCms(cms,'trust')}/><Capabilities/><Workflow/><Packages products={loaderData.products}/><ToolsShowcase/><ProductsShowcase products={loaderData.products}/><CaseStudy/><Founder content={resolveCms(cms,'founder')}/><Faq items={resolveCms(cms,'faqs')}/><Newsletter/></>;
}
