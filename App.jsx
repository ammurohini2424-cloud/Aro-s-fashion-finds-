import React, { useState, useEffect } from 'react'
import Admin from './Admin.jsx'

const STORAGE_KEY = 'aros_items_v1'
const ADMIN_SESSION_KEY = 'aros_admin_session'
const ADMIN_PASSWORD = 'Arofinds2424' // DO NOT change here unless you want to update

function ItemCard({it, isAdmin, onEdit, onDelete}) {
  return (
    <div className="card">
      {it.image ? <img src={it.image} alt={it.name} className="card-img" /> : <div className="no-img">No image</div>}
      <div className="card-body">
        <a className="item-name" href={it.link} target="_blank" rel="noreferrer">{it.name}</a>
        <div className="item-price">{it.price}</div>
        <div className="tags">{(it.tags||[]).map((t,i)=>(<span key={i} className="tag">{t}</span>))}</div>
        {isAdmin && (
          <div className="admin-actions">
            <button onClick={()=>onEdit(it)}>Edit</button>
            <button onClick={()=>onDelete(it.id)}>Delete</button>
            <button onClick={()=>{navigator.clipboard.writeText(it.link); alert('Link copied')}}>Copy Link</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function App(){
  const [items, setItems] = useState([])
  const [query, setQuery] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [viewAdminPanel, setViewAdminPanel] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if(raw) {
      try { setItems(JSON.parse(raw)) } catch(e) { console.error(e) }
    }
    const session = localStorage.getItem(ADMIN_SESSION_KEY)
    setIsAdmin(!!session)
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  function handleLogin(password){
    if(password === ADMIN_PASSWORD){
      localStorage.setItem(ADMIN_SESSION_KEY, 'active')
      setIsAdmin(true)
      setViewAdminPanel(true)
      return true
    }
    return false
  }

  function handleLogout(){
    localStorage.removeItem(ADMIN_SESSION_KEY)
    setIsAdmin(false)
    setViewAdminPanel(false)
  }

  function addOrUpdate(item){
    setItems(prev => {
      if(prev.some(p=>p.id===item.id)) return prev.map(p=>p.id===item.id?item:p)
      return [item, ...prev]
    })
  }

  function handleDelete(id){
    if(!confirm('Delete this item?')) return
    setItems(prev => prev.filter(p=>p.id!==id))
  }

  const filtered = items.filter(it => {
    const q = query.trim().toLowerCase()
    if(!q) return true
    return it.name.toLowerCase().includes(q) || (it.tags||[]).some(t=>t.toLowerCase().includes(q))
  })

  return (
    <div className="app">
      <header className="top">
        <div className="brand">Aro's Fashion Finds</div>
        <div className="right">
          <input placeholder="Search by name or tag" value={query} onChange={e=>setQuery(e.target.value)} />
          {isAdmin ? (
            <>
              <button onClick={()=>setViewAdminPanel(v=>!v)}>{viewAdminPanel?'Close Admin':'Open Admin'}</button>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <button onClick={()=>setViewAdminPanel(true)}>Admin Login</button>
          )}
        </div>
      </header>

      {viewAdminPanel && !isAdmin && <Admin onLogin={handleLogin} />}

      {viewAdminPanel && isAdmin && (
        <Admin
          isAdmin={true}
          items={items}
          onSave={addOrUpdate}
          onDelete={handleDelete}
          onClose={()=>setViewAdminPanel(false)}
        />
      )}

      <main className="grid">
        {filtered.length === 0 && <div className="empty">No items yet — admin can add items.</div>}
        {filtered.map(it=>(
          <ItemCard key={it.id} it={it} isAdmin={isAdmin} onEdit={(it)=>{ setViewAdminPanel(true); setTimeout(()=>{ window.dispatchEvent(new CustomEvent('edit-item', {detail: it})) },100) }} onDelete={handleDelete} />
        ))}
      </main>

      <footer className="footer">Made with ❤️ — Aro's Fashion Finds</footer>
    </div>
  )
}
