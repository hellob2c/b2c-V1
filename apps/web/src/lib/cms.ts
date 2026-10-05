import { cmsDefaults, type CmsContentMap, type CmsKey } from '@/data/cms-defaults';

/**
 * Resolve a single CMS key to its published value or the static default.
 * Pure helper — safe to import from client components and server loaders alike.
 */
export function resolveCms<K extends CmsKey>(
	content: Partial<CmsContentMap>,
	key: K,
): CmsContentMap[K] {
	return (content[key] as CmsContentMap[K] | undefined) ?? cmsDefaults[key];
}
