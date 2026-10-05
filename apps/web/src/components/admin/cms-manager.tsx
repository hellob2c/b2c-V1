import { useEffect, useState } from 'react';
import type { RecordModel } from 'pocketbase';
import { pocketbaseClient as pb } from '@/lib/pocketbase-client';
import { cmsDefaults, type CmsKey } from '@/data/cms-defaults';

type FieldDef = { name: string; label: string; kind: 'text' | 'textarea' };
type BlockSchema =
	| {
			shape: 'object';
			fields: FieldDef[];
			lists: { name: string; label: string; itemFields: FieldDef[] }[];
	  }
	| { shape: 'list'; itemFields: FieldDef[] }
	| { shape: 'stringList' };

type BlockDef = {
	key: CmsKey;
	title: string;
	description: string;
	schema: BlockSchema;
};

const BLOCKS: BlockDef[] = [
	{
		key: 'home_hero',
		title: 'Home hero',
		description: 'Headline and intro shown at the top of the homepage.',
		schema: {
			shape: 'object',
			fields: [
				{ name: 'eyebrow', label: 'Eyebrow label', kind: 'text' },
				{ name: 'headlineMain', label: 'Main headline (use Enter for line breaks)', kind: 'textarea' },
				{ name: 'headlineEm', label: 'Emphasised headline (use Enter for line breaks)', kind: 'textarea' },
				{ name: 'subtext', label: 'Supporting paragraph', kind: 'textarea' },
			],
			lists: [],
		},
	},
	{
		key: 'trust',
		title: 'Trust strip',
		description: 'Credibility band beneath the homepage hero.',
		schema: {
			shape: 'object',
			fields: [{ name: 'label', label: 'Strip label (use Enter for line breaks)', kind: 'textarea' }],
			lists: [
				{
					name: 'items',
					label: 'Trust items',
					itemFields: [
						{ name: 'title', label: 'Title', kind: 'text' },
						{ name: 'subtitle', label: 'Subtitle', kind: 'text' },
					],
				},
			],
		},
	},
	{
		key: 'faqs',
		title: 'FAQs',
		description: 'Frequently asked questions on the home and services pages.',
		schema: {
			shape: 'list',
			itemFields: [
				{ name: 'question', label: 'Question', kind: 'text' },
				{ name: 'answer', label: 'Answer', kind: 'textarea' },
			],
		},
	},
	{
		key: 'founder',
		title: 'Founder & company story',
		description: 'Founder narrative and capability timeline.',
		schema: {
			shape: 'object',
			fields: [
				{ name: 'eyebrow', label: 'Eyebrow label', kind: 'text' },
				{ name: 'heading', label: 'Heading (use Enter for line breaks)', kind: 'textarea' },
				{ name: 'intro', label: 'Intro paragraph', kind: 'textarea' },
				{ name: 'tag', label: 'Status tag', kind: 'text' },
			],
			lists: [
				{
					name: 'timeline',
					label: 'Timeline entries',
					itemFields: [
						{ name: 'stage', label: 'Stage', kind: 'text' },
						{ name: 'title', label: 'Title', kind: 'text' },
						{ name: 'body', label: 'Body', kind: 'textarea' },
					],
				},
			],
		},
	},
	{
		key: 'case_studies',
		title: 'Case studies',
		description: 'Illustrative concept studies on the case-studies page.',
		schema: {
			shape: 'list',
			itemFields: [
				{ name: 'title', label: 'Title', kind: 'text' },
				{ name: 'area', label: 'Area / disciplines', kind: 'text' },
				{ name: 'challenge', label: 'Challenge', kind: 'textarea' },
				{ name: 'strategy', label: 'Strategy', kind: 'textarea' },
				{ name: 'approach', label: 'Design approach', kind: 'textarea' },
				{ name: 'outcome', label: 'Expected outcome', kind: 'textarea' },
			],
		},
	},
	{
		key: 'insights',
		title: 'Insights',
		description: 'Editorial insight articles on the insights page.',
		schema: {
			shape: 'list',
			itemFields: [
				{ name: 'title', label: 'Title', kind: 'text' },
				{ name: 'body', label: 'Body', kind: 'textarea' },
			],
		},
	},
	{
		key: 'roadmap',
		title: 'Platform roadmap',
		description: 'Planned platform capabilities on the solutions page.',
		schema: { shape: 'stringList' },
	},
];

const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));

function TextRow({
	label,
	value,
	onChange,
}: {
	label: string;
	value: string;
	onChange: (v: string) => void;
}) {
	return (
		<label className="field">
			{label}
			<input value={value} onChange={(e) => onChange(e.target.value)} />
		</label>
	);
}

function AreaRow({
	label,
	value,
	onChange,
}: {
	label: string;
	value: string;
	onChange: (v: string) => void;
}) {
	return (
		<label className="field">
			{label}
			<textarea value={value} onChange={(e) => onChange(e.target.value)} />
		</label>
	);
}

function FieldEditor({
	field,
	value,
	onChange,
}: {
	field: FieldDef;
	value: string;
	onChange: (v: string) => void;
}) {
	return field.kind === 'textarea' ? (
		<AreaRow label={field.label} value={value} onChange={onChange} />
	) : (
		<TextRow label={field.label} value={value} onChange={onChange} />
	);
}

function ItemList({
	itemFields,
	items,
	onChange,
}: {
	itemFields: FieldDef[];
	items: Record<string, string>[];
	onChange: (items: Record<string, string>[]) => void;
}) {
	const update = (i: number, name: string, v: string) =>
		onChange(items.map((it, idx) => (idx === i ? { ...it, [name]: v } : it)));
	const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
	const add = () =>
		onChange([
			...items,
			Object.fromEntries(itemFields.map((f) => [f.name, ''])),
		]);
	return (
		<div>
			{items.map((item, i) => (
				<div
					key={i}
					style={{
						border: '1px solid hsl(var(--border))',
						padding: 15,
						marginBottom: 12,
						display: 'grid',
						gap: 12,
					}}
				>
					{itemFields.map((f) => (
						<FieldEditor
							key={f.name}
							field={f}
							value={item[f.name] || ''}
							onChange={(v) => update(i, f.name, v)}
						/>
					))}
					<button
						type="button"
						className="text-link"
						style={{ color: '#a83939' }}
						onClick={() => remove(i)}
					>
						Remove entry
					</button>
				</div>
			))}
			<button type="button" className="button outline" onClick={add}>
				+ Add entry
			</button>
		</div>
	);
}

export function CmsManager() {
	const [records, setRecords] = useState<Record<string, RecordModel>>({});
	const [selected, setSelected] = useState<CmsKey | null>(null);
	const [draft, setDraft] = useState<unknown>(null);
	const [status, setStatus] = useState<'draft' | 'published'>('published');
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [notice, setNotice] = useState('');
	const [error, setError] = useState('');

	useEffect(() => {
		let live = true;
		pb.collection('cms_content')
			.getList(1, 100, { sort: '-updated', requestKey: null })
			.then((r) => {
				if (!live) return;
				const map: Record<string, RecordModel> = {};
				for (const item of r.items) map[item.key] = item;
				setRecords(map);
			})
			.catch(() => {
				if (live) setError('Content records could not be loaded.');
			})
			.finally(() => {
				if (live) setLoading(false);
			});
		return () => {
			live = false;
		};
	}, []);

	const select = (key: CmsKey) => {
		const rec = records[key];
		setSelected(key);
		setDraft(rec ? clone(rec.data) : clone(cmsDefaults[key]));
		setStatus((rec?.status as 'draft' | 'published') || 'published');
		setNotice('');
		setError('');
	};

	const validate = (block: BlockDef, data: unknown): string | null => {
		const s = block.schema;
		if (s.shape === 'stringList') {
			const arr = data as string[];
			if (!arr.length) return 'Add at least one roadmap item.';
			if (arr.some((x) => !x.trim())) return 'Roadmap items cannot be empty.';
			return null;
		}
		if (s.shape === 'list') {
			const arr = data as Record<string, string>[];
			if (!arr.length) return 'Add at least one entry.';
			for (const f of s.itemFields) {
				if (arr.some((it) => !String(it[f.name] || '').trim()))
					return `Every "${f.label}" is required.`;
			}
			return null;
		}
		const obj = data as Record<string, unknown>;
		for (const f of s.fields) {
			if (!String(obj[f.name] || '').trim())
				return `"${f.label}" is required.`;
		}
		for (const list of s.lists) {
			const arr = (obj[list.name] as Record<string, string>[]) || [];
			if (!arr.length) return `"${list.label}" needs at least one entry.`;
			for (const f of list.itemFields) {
				if (arr.some((it) => !String(it[f.name] || '').trim()))
					return `Every "${f.label}" is required.`;
			}
		}
		return null;
	};

	const save = async () => {
		if (!selected) return;
		const block = BLOCKS.find((b) => b.key === selected)!;
		const verr = validate(block, draft);
		if (verr) {
			setError(verr);
			return;
		}
		setError('');
		setSaving(true);
		setNotice('');
		try {
			const payload = {
				key: selected,
				title: block.title,
				data: draft,
				status,
			};
			const existing = records[selected];
			let saved: RecordModel;
			if (existing) {
				saved = await pb
					.collection('cms_content')
					.update(existing.id, payload);
			} else {
				saved = await pb.collection('cms_content').create(payload);
			}
			setRecords({ ...records, [selected]: saved });
			setNotice(
				status === 'published'
					? 'Saved and published. Changes are live on the public site.'
					: 'Saved as draft. Publish to show on the public site.',
			);
		} catch (e) {
			setError(
				'Could not save content. ' +
					(e instanceof Error ? e.message : 'Please try again.'),
			);
		} finally {
			setSaving(false);
		}
	};

	const resetToDefault = () => {
		if (!selected) return;
		setDraft(clone(cmsDefaults[selected]));
		setNotice('Reverted to the default content. Save to keep the change.');
		setError('');
	};

	const renderEditor = () => {
		if (!selected || draft == null) return null;
		const block = BLOCKS.find((b) => b.key === selected)!;
		const s = block.schema;
		if (s.shape === 'stringList') {
			const arr = draft as string[];
			const set = (next: string[]) => setDraft(next);
			return (
				<div>
					{arr.map((item, i) => (
						<div
							key={i}
							style={{ display: 'flex', gap: 10, marginBottom: 10 }}
						>
							<input
								value={item}
								onChange={(e) =>
									set(arr.map((x, idx) => (idx === i ? e.target.value : x)))
								}
							/>
							<button
								type="button"
								className="text-link"
								style={{ color: '#a83939' }}
								onClick={() => set(arr.filter((_, idx) => idx !== i))}
							>
								Remove
							</button>
						</div>
					))}
					<button
						type="button"
						className="button outline"
						onClick={() => set([...arr, ''])}
					>
						+ Add roadmap item
					</button>
				</div>
			);
		}
		if (s.shape === 'list') {
			return (
				<ItemList
					itemFields={s.itemFields}
					items={draft as Record<string, string>[]}
					onChange={(items) => setDraft(items)}
				/>
			);
		}
		const obj = draft as Record<string, unknown>;
		const setField = (name: string, v: unknown) =>
			setDraft({ ...obj, [name]: v });
		return (
			<div style={{ display: 'grid', gap: 15 }}>
				{s.fields.map((f) => (
					<FieldEditor
						key={f.name}
						field={f}
						value={String(obj[f.name] || '')}
						onChange={(v) => setField(f.name, v)}
					/>
				))}
				{s.lists.map((list) => (
					<div key={list.name}>
						<h3 style={{ fontSize: 14, margin: '10px 0' }}>{list.label}</h3>
						<ItemList
							itemFields={list.itemFields}
							items={(obj[list.name] as Record<string, string>[]) || []}
							onChange={(items) => setField(list.name, items)}
						/>
					</div>
				))}
			</div>
		);
	};

	return (
		<div className="rail section">
			<div className="section-heading">
				<div>
					<div className="eyebrow">Content management</div>
					<h1 style={{ fontSize: 32, marginTop: 15 }}>
						Website content manager
					</h1>
				</div>
				<span className="tag">Restricted · Administrator only</span>
			</div>
			<p
				className="notice"
				style={{ maxWidth: 760 }}
			>
				Edit the public-facing copy on your marketing pages, case studies,
				founder story, FAQs and insights. Published changes appear on the live
				site immediately. Drafts are saved without being shown to visitors.
			</p>
			{loading ? (
				<p className="notice">Loading content blocks…</p>
			) : (
				<div className="tools-grid" style={{ marginBottom: 30 }}>
					{BLOCKS.map((b) => {
						const rec = records[b.key];
						const isActive = selected === b.key;
						return (
							<article
								key={b.key}
								className="panel"
								style={{
									cursor: 'pointer',
									outline: isActive ? '2px solid var(--gold)' : 'none',
								}}
								onClick={() => select(b.key)}
							>
								<span
									className="tag"
									style={
										rec?.status === 'draft'
											? { background: '#f3e9d8', color: '#7d6841' }
											: rec?.status === 'published'
												? { background: '#e3efe6', color: '#3d6b48' }
												: {}
									}
								>
									{rec?.status === 'draft'
										? 'Draft'
										: rec?.status === 'published'
											? 'Published'
											: 'Not edited yet'}
								</span>
								<h3 style={{ marginTop: 18 }}>{b.title}</h3>
								<p>{b.description}</p>
								{rec?.updated && (
									<small style={{ fontSize: 9, color: 'var(--quiet)' }}>
										Updated {new Date(rec.updated).toLocaleString('en-GB')}
									</small>
								)}
							</article>
						);
					})}
				</div>
			)}
			{selected && (
				<form
					className="panel"
					onSubmit={(e) => {
						e.preventDefault();
						void save();
					}}
				>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							marginBottom: 20,
							gap: 15,
							flexWrap: 'wrap',
						}}
					>
						<h2 style={{ fontSize: 21 }}>
							{BLOCKS.find((b) => b.key === selected)?.title}
						</h2>
						<label
							className="field"
							style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center' }}
						>
							<span style={{ fontSize: 11, color: 'var(--quiet)' }}>Status</span>
							<select
								style={{ width: 150 }}
								value={status}
								onChange={(e) =>
									setStatus(e.target.value as 'draft' | 'published')
								}
							>
								<option value="published">Published</option>
								<option value="draft">Draft</option>
							</select>
						</label>
					</div>
					{renderEditor()}
					{error && (
						<p className="notice error" role="alert" style={{ marginTop: 18 }}>
							{error}
						</p>
					)}
					{notice && (
						<p className="notice" role="status" style={{ marginTop: 18 }}>
							{notice}
						</p>
					)}
					<div style={{ display: 'flex', gap: 12, marginTop: 22, flexWrap: 'wrap' }}>
						<button className="button gold" disabled={saving}>
							{saving ? 'Saving…' : 'Save content'}
						</button>
						<button
							type="button"
							className="button outline"
							onClick={resetToDefault}
							disabled={saving}
						>
							Revert to default
						</button>
					</div>
				</form>
			)}
		</div>
	);
}
