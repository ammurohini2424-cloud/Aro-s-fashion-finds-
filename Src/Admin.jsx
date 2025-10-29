import React, { useState, useEffect } from 'react'
const STORAGE_KEY = 'aros_items_v1'

export default function Admin({onLogin, isAdmin, items=[], onSave, onDelete, onClose}){
  const [password, setPassword] = useState('')
  const [editing, setEditing] = useState(null)
  const [name, setName] = useState('')
  const [image, setImage] = useState('')
  const [link, setLink] = useState('')
  const [price, setPrice] = useState('')
  const [tags, setTags] = useState('')

  useEffect(()=>{
    function handler(e){
      const it = e.detail
      if(it){
        setEditing(it)
        setName(it.name); setImage(it.image||''); setLink(it.link); setPrice(it.price||''); setTags((it.tags||[]).join(', '))
      }
    }
    window.addEventListener('edit-item', handler)
    return ()=> window.removeEventListener('edit-item', handler)
  },[])

  function tryLogin(e){
    e.preventDefault()
    const ok = onLogin(password)
    if(!ok) alert('Wrong password')
    else {
      setPassword('')
    }
  }

  function resetForm(){
    setEditing(null); setName(''); setImage(''); setLink(''); setPrice(''); setTags('')
  }

  function save(e){
    e.preventDefault()
    if(!name.trim() || !link.trim()) return alert('Please add name and link')
    const item = {
      id: editing ? editing.id : Date.now().toString(),
      name: name.trim(),
      image: image.trim(),
      link: link.trim(),
      price: price.trim(),
      tags: tags.split(',').map(t=>t.trim()).filter(Boolean),
      createdAt: new Date().toISOString()
    }
    onSave && onSave(item)
    resetForm()
  }

  return (
    <div className="admin-panel">
      {!isAdmin && (
        <form onSubmit={tryLogin} className="login">
          <h3>Admin Login</h3>
          <input placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
          <div className="actions">
            <button type="submit">Login</button>
            <button type="button" onClick={()=>{ if(onClose) onClose() }}>Close</button>
          </div>
        </form>
      )}

      {isAdmin && (
        <div className="admin-controls">
          <h3>Admin Panel</h3>
          <form onSubmit={save} className="form">
            <input placeholder="Name (required)" value={name} onChange={e=>setName(e.target.value)} />
            <input placeholder="Image URL (optional)" value={image} onChange={e=>setImage(e.target.value)} />
            <input placeholder="Buy link (required)" value={link} onChange={e=>setLink(e.target.value)} />
            <input placeholder="Price (e.g. ₹799)" value={price} onChange={e=>setPrice(e.target.value)} />
            <input placeholder="Tags (comma separated)" value={tags} onChange={e=>setTags(e.target.value)} />
            <div className="actions">
              <button type="submit">Save Item</button>
              <button type="button" onClick={resetForm}>Clear</button>
              <button type="button" onClick={()=>{ navigator.clipboard.writeText(JSON.stringify({exportedAt: new Date().toISOString(), items: items||[] })); alert('Exported JSON copied to clipboard') }}>Export JSON</button>
              <button type="button" onClick={()=>{ const raw = prompt('Paste JSON to import (will replace current items)'); if(!raw) return; try{ const parsed = JSON.parse(raw); if(!parsed.items) return alert('Invalid format'); if(!confirm('Replace current items?')) return; localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed.items)); window.location.reload(); } catch(e){ alert('Invalid JSON') } }}>Import JSON</button>
              <button type="button" onClick={()=>{ if(onClose) onClose() }}>Close Admin</button>
            </div>
          </form>

          <div className="current-list">
            <h4>Current items</h4>
            {(items||[]).map(it=>(
              <div key={it.id} className="list-item">
                <div>{it.name}</div>
                <div className="list-actions">
                  <button onClick={()=>{ setEditing(it); setName(it.name); setImage(it.image||''); setLink(it.link); setPrice(it.price||''); setTags((it.tags||[]).join(', ')) }}>Edit</button>
                  <button onClick={()=>onDelete && onDelete(it.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
