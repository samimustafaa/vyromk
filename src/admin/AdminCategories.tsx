import { useState, type FormEvent } from 'react'
import { useStore } from '../context/StoreContext'
import { PRESET_IMAGES } from './adminData'

export function AdminCategories() {
  const { products, categories, addCategory, updateCategory, deleteCategory, categoryInUse } = useStore()
  const [labelEn, setLabelEn] = useState('')
  const [labelMk, setLabelMk] = useState('')
  const [image, setImage] = useState(PRESET_IMAGES[0].value)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState<string | null>(null)
  const [draftEn, setDraftEn] = useState('')
  const [draftMk, setDraftMk] = useState('')

  const handleAdd = (e: FormEvent) => {
    e.preventDefault()
    const ok = addCategory({ labelEn, labelMk: labelMk || labelEn, image })
    if (!ok) {
      setError('A category with that name already exists.')
      return
    }
    setLabelEn('')
    setLabelMk('')
    setError(null)
  }

  const startEdit = (slug: string, en: string, mk: string) => {
    setEditing(slug)
    setDraftEn(en)
    setDraftMk(mk)
  }

  const saveEdit = () => {
    if (!editing) return
    updateCategory(editing, { labelEn: draftEn.trim() || 'Untitled', labelMk: draftMk.trim() || draftEn.trim() })
    setEditing(null)
  }

  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <div>
          <h1>Categories</h1>
          <p>Group the catalog. Categories power the shop filters and home page shelves.</p>
        </div>
        <span className="adm-chip">{categories.length} active</span>
      </div>

      <div className="adm-grid adm-grid--sidebar">
        <section className="adm-card">
          <div className="adm-card-head">
            <h2>All categories</h2>
          </div>
          <ul className="adm-cat-list">
            {categories.map((c) => {
              const count = products.filter((p) => p.category === c.slug).length
              const inUse = categoryInUse(c.slug)
              return (
                <li key={c.slug}>
                  <img src={c.image} alt="" className="adm-thumb" />
                  <div className="adm-cat-info">
                    {editing === c.slug ? (
                      <div className="adm-cat-edit">
                        <input value={draftEn} onChange={(e) => setDraftEn(e.target.value)} aria-label="English name" />
                        <input value={draftMk} onChange={(e) => setDraftMk(e.target.value)} aria-label="Macedonian name" />
                        <button type="button" className="adm-btn adm-btn--lime adm-btn--xs" onClick={saveEdit}>
                          Save
                        </button>
                        <button type="button" className="adm-btn adm-btn--ghost adm-btn--xs" onClick={() => setEditing(null)}>
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <strong>{c.labelEn}</strong>
                        <span>
                          {c.labelMk} · /{c.slug}
                        </span>
                      </>
                    )}
                  </div>
                  <span className={`adm-pill${count === 0 ? ' adm-pill--out' : ' adm-pill--ok'}`}>{count} products</span>
                  <div className="adm-row-actions">
                    <button
                      type="button"
                      className="adm-icon-btn"
                      title="Rename category"
                      onClick={() => startEdit(c.slug, c.labelEn, c.labelMk)}
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M15 4.5l4.5 4.5M4.5 19.5l1-4.5L15.8 4.7a1.8 1.8 0 012.5 0l1 1a1.8 1.8 0 010 2.5L9 18.5z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="adm-icon-btn adm-icon-btn--danger"
                      title={inUse > 0 ? `Move ${inUse} products first` : 'Delete category'}
                      disabled={inUse > 0}
                      onClick={() => deleteCategory(c.slug)}
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
          {categories.length === 0 && <p className="adm-empty">No categories yet. Create the first one.</p>}
        </section>

        <form className="adm-card adm-form" onSubmit={handleAdd}>
          <div className="adm-card-head">
            <h2>New category</h2>
          </div>
          <label className="adm-field">
            <span>Name (EN)</span>
            <input value={labelEn} onChange={(e) => setLabelEn(e.target.value)} required placeholder="Socks" />
          </label>
          <label className="adm-field">
            <span>Name (MK)</span>
            <input value={labelMk} onChange={(e) => setLabelMk(e.target.value)} placeholder="Чорапи" />
          </label>
          <label className="adm-field">
            <span>Cover image</span>
            <select value={image} onChange={(e) => setImage(e.target.value)}>
              {PRESET_IMAGES.map((img) => (
                <option key={img.value} value={img.value}>
                  {img.label}
                </option>
              ))}
            </select>
          </label>
          {error && <p className="adm-error">{error}</p>}
          <button type="submit" className="adm-btn adm-btn--lime">
            Create category
          </button>
          <p className="adm-hint">Categories with products can’t be deleted until those products are moved.</p>
        </form>
      </div>
    </div>
  )
}
