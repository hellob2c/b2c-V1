import { pocketbaseAdmin } from '@/lib/pocketbase-client.server';
import { type CmsContentMap, type CmsKey } from '@/data/cms-defaults';

/**
 * Load published CMS content for the given keys, server-side. Returns a partial
 * map — any key without a published record (or when PocketBase is unreachable)
 * is simply absent, so callers fall back to `cmsDefaults`. CMS content is
 * public and user-agnostic, so it is safe to load in a server `loader` and
 * edge-cache.
 */
export async function loadCmsContent(
	keys: CmsKey[],
): Promise<Partial<CmsContentMap>> {
	if (!keys.length) return {};
	try {
		const filter = keys.map((k) => `key = "${k}"`).join(' || ');
		const res = await pocketbaseAdmin.listRecords<{
			key: string;
			data: unknown;
			status: string;
		}>('cms_content', { filter, perPage: 100 });
		const out: Partial<CmsContentMap> = {};
		for (const r of res.items) {
			if (r.status !== 'published' || r.data == null) continue;
			(out as Record<string, unknown>)[r.key] = r.data;
		}
		return out;
	} catch {
		return {};
	}
}

// `resolveCms` lives in `@/lib/cms` (a pure, client-safe helper). Import it
// from there directly; this server module only handles loading published records.
