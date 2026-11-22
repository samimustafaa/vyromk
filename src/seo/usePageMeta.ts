import { useEffect } from 'react'
import type { PageMeta } from './meta'

function setTag(selector: string, create: () => HTMLElement, apply: (el: HTMLElement) => void) {
  let el = document.head.querySelector<HTMLElement>(selector)
  if (!el) {
    el = create()
    document.head.appendChild(el)
  }
  apply(el)
}

/** Apply a page's metadata to the live document (SPA navigation). */
export function usePageMeta(meta: PageMeta | null) {
  useEffect(() => {
    if (!meta) return
    document.title = meta.title

    setTag('meta[name="description"]', () => {
      const el = document.createElement('meta')
      el.setAttribute('name', 'description')
      return el
    }, (el) => el.setAttribute('content', meta.description))

    setTag('link[rel="canonical"]', () => {
      const el = document.createElement('link')
      el.setAttribute('rel', 'canonical')
      return el
    }, (el) => el.setAttribute('href', `${location.origin}${meta.path}`))

    setTag('meta[property="og:title"]', () => {
      const el = document.createElement('meta')
      el.setAttribute('property', 'og:title')
      return el
    }, (el) => el.setAttribute('content', meta.title))

    setTag('meta[property="og:description"]', () => {
      const el = document.createElement('meta')
      el.setAttribute('property', 'og:description')
      return el
    }, (el) => el.setAttribute('content', meta.description))

    // Structured data for the current view
    document.querySelectorAll('script[data-dynamic-jsonld]').forEach((n) => n.remove())
    ;(meta.jsonLd ?? []).forEach((block) => {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.dataset.dynamicJsonld = 'true'
      script.textContent = JSON.stringify(block)
      document.head.appendChild(script)
    })
  }, [meta])
}
