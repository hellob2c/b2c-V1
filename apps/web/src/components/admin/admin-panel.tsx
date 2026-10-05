import { useEffect, useState } from 'react';import type { RecordModel } from 'pocketbase';import { pocketbaseClient as pb } from '@/lib/pocketbase-client';import { ProjectForm } from '@/components/admin/project-form';import { CmsManager } from '@/components/admin/cms-manager';
const modules=['Overview','Leads & enquiries','Clients','Projects','Support','Theme Manager','Content Manager','Orders & invoices','Services & products','Academy','Tools & templates','Content & SEO','Communications','Analytics','Team & permissions','Audit log'];
export function AdminPanel(){const [tab,setTab]=useState('Overview');const [items,setItems]=useState<RecordModel[]>([]);const [notice,setNotice]=useState('');const [loading,setLoading]=useState(false);const [navy,setNavy]=useState('#10233f');const [gold,setGold]=useState('#bba16c');const [radius,setRadius]=useState(4);const [counts,setCounts]=useState({leads:0,projects:0,support:0});const col=tab==='Leads & enquiries'?'enquiries':tab==='Clients'?'users':tab==='Projects'?'projects':tab==='Support'?'support_tickets':null;useEffect(()=>{let live=true;setNotice('');if(col){setLoading(true);pb.collection(col).getFullList({sort:'-created',requestKey:null}).then(r=>{if(live)setItems(r);}).catch(()=>{if(live)setNotice('Records could not be loaded.');}).finally(()=>{if(live)setLoading(false);});}else setItems([]);if(tab==='Overview')Promise.all(['enquiries','projects','support_tickets'].map(c=>pb.collection(c).getList(1,1,{requestKey:null}))).then(r=>{if(live)setCounts({leads:r[0].totalItems,projects:r[1].totalItems,support:r[2].totalItems});}).catch(()=>{if(live)setNotice('Business overview could not be loaded.');});return()=>{live=false;};},[tab,col]);
return (
  <div className="rail section">
    <div className="section-heading">
      <div>
        <div className="eyebrow">Business control centre</div>
        <h1 style={{ fontSize: 32, marginTop: 15 }}>HelloB2C administration</h1>
      </div>
      <span className="tag">Restricted · Administrator only</span>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '40px', alignItems: 'start', marginTop: '20px' }}>
      <aside className="workspace-nav" style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderRight: '1px solid #eaeaea', paddingRight: '20px', minHeight: '60vh' }}>
        {modules.map(m => (
          <button 
            key={m} 
            className={m === tab ? 'active' : ''} 
            onClick={() => setTab(m)}
            style={{ textAlign: 'left', width: '100%', padding: '12px 16px' }}
          >
            {m}
          </button>
        ))}
      </aside>

      <main style={{ minWidth: 0 }}>
        {notice && <p className="notice" role="status">{notice}</p>}
        {tab === 'Overview' ? (
          <div className="tools-grid">
            {Object.entries(counts).map(([label, n]) => (
              <div className="panel" key={label}>
                <span className="eyebrow">{label}</span>
                <div className="plan-price">{n}</div>
                <p>Actual business records</p>
              </div>
            ))}
          </div>
        ) : tab === 'Theme Manager' ? (
          <form className="panel form-grid" onSubmit={async e => { e.preventDefault(); try { const existing = await pb.collection('theme_settings').getList(1, 1); const data = { navy, gold, radius }; if (existing.items[0]) await pb.collection('theme_settings').update(existing.items[0].id, data); else await pb.collection('theme_settings').create(data); document.documentElement.style.setProperty('--navy', navy); document.documentElement.style.setProperty('--gold', gold); setNotice('Brand colours saved. Refresh any public page to apply.'); } catch { setNotice('Could not save your theme.'); } }}>
            <h2>Brand theme tokens</h2>
            <div className="content-grid">
              <label className="field">Deep navy<input type="color" value={navy} onChange={e => setNavy(e.target.value)} /></label>
              <label className="field">Premium gold<input type="color" value={gold} onChange={e => setGold(e.target.value)} /></label>
            </div>
            <label className="field">Button corner radius (pixels)<input type="number" min={0} max={24} value={radius} onChange={e => setRadius(Math.min(24, Math.max(0, Number(e.target.value))))} /></label>
            <div style={{ padding: 25, background: navy, color: gold, borderRadius: radius }}>Brand theme preview</div>
            <button className="button">Save brand theme</button>
            <p>Typography, spacing, dashboard layouts, widget selection and dark mode are planned extensions.</p>
          </form>
        ) : tab === 'Content Manager' ? (
          <CmsManager />
        ) : col ? (
          <div className="panel">
            <h2>{tab}</h2>
            {loading ? <p>Loading business records…</p> : !items.length ? <p className="notice">No records yet. New business activity will appear here.</p> : items.map(r => (
              <div className="record-row" key={r.id}>
                <div>
                  <strong>{r.title || r.name}</strong>
                  <p>{r.email || r.message || r.notes}</p>
                  <small>{r.company || r.service}</small>
                </div>
                {tab === 'Leads & enquiries' && <select style={{ width: 140 }} value={r.status || 'new'} aria-label={`Pipeline stage for ${r.name}`} onChange={async e => { try { const updated = await pb.collection('enquiries').update(r.id, { status: e.target.value }); setItems(items.map(x => x.id === r.id ? updated : x)); } catch { setNotice('Could not update the pipeline.'); } }}>{['new', 'qualified', 'proposal', 'won', 'closed'].map(s => <option key={s}>{s}</option>)}</select>}
                {tab === 'Support' && <select style={{ width: 140 }} aria-label={`Status for ${r.title}`} value={r.status || 'open'} onChange={async e => { try { const updated = await pb.collection('support_tickets').update(r.id, { status: e.target.value }); setItems(items.map(x => x.id === r.id ? updated : x)); } catch { setNotice('Could not update this ticket.'); } }}><option>open</option><option>in progress</option><option>resolved</option></select>}
                {tab === 'Projects' && <label className="field">Progress (%)<input style={{ width: 90 }} type="number" min={0} max={100} defaultValue={r.progress || 0} onBlur={async e => { try { const updated = await pb.collection('projects').update(r.id, { progress: Math.max(0, Math.min(100, Number(e.target.value))) }); setItems(items.map(x => x.id === r.id ? updated : x)); } catch { setNotice('Could not update project progress.'); } }} /></label>}
                {tab === 'Clients' && <select aria-label={`Role for ${r.name || r.email}`} style={{ width: 150 }} value={r.role || 'registered'} onChange={async e => { try { const updated = await pb.collection('users').update(r.id, { role: e.target.value }); setItems(items.map(x => x.id === r.id ? updated : x)); } catch { setNotice('Could not update this user role.'); } }}>{['registered', 'client', 'team', 'admin'].map(role => <option key={role}>{role}</option>)}</select>}
              </div>
            ))}
            {tab === 'Projects' && <ProjectForm onCreated={r => setItems([r, ...items])} />}
          </div>
        ) : (
          <div className="panel">
            <span className="tag">Planned module</span>
            <h2 style={{ marginTop: 20 }}>{tab}</h2>
            <p>This module is part of the business roadmap and is not operational yet. Commerce transactions are managed by the connected store. This portal currently supports enquiries, clients, project records, support and brand tokens.</p>
          </div>
        )}
      </main>
    </div>
  </div>
);
}
