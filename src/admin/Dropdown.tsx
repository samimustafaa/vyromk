import { useEffect, useId, useRef, useState } from 'react'

export interface DropdownOption {
  value: string
  label: string
  /** Optional secondary line, e.g. a hint. */
  hint?: string
  /** Optional colour dot rendered before the label. */
  dot?: string
  disabled?: boolean
}

interface Props {
  value: string
  options: DropdownOption[]
  onChange: (value: string) => void
  /** Used for the trigger's accessible name when no visible label is nearby. */
  label?: string
  placeholder?: string
  className?: string
  size?: 'sm' | 'md'
  align?: 'left' | 'right'
  /** Compact icon-only trigger, for toolbars. */
  icon?: boolean
  disabled?: boolean
}

/**
 * Animated admin dropdown. Native <select> cannot be styled consistently, so
 * this renders a button + listbox with keyboard support.
 */
export function Dropdown({
  value,
  options,
  onChange,
  label,
  placeholder = 'Select',
  className = '',
  size = 'md',
  align = 'left',
  icon = false,
  disabled = false,
}: Props) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const listRef = useRef<HTMLUListElement | null>(null)
  const listId = useId()

  const selectedIndex = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  )
  const selected = options[selectedIndex]

  useEffect(() => {
    if (!open) return
    setActive(selectedIndex)
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        rootRef.current?.querySelector<HTMLButtonElement>('.adm-dd-trigger')?.focus()
      }
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, selectedIndex])

  useEffect(() => {
    if (!open || !listRef.current) return
    const node = listRef.current.children[active] as HTMLElement | undefined
    node?.scrollIntoView({ block: 'nearest' })
  }, [active, open])

  const commit = (index: number) => {
    const option = options[index]
    if (!option || option.disabled) return
    onChange(option.value)
    setOpen(false)
    rootRef.current?.querySelector<HTMLButtonElement>('.adm-dd-trigger')?.focus()
  }

  const step = (dir: 1 | -1) => {
    let next = active
    for (let i = 0; i < options.length; i += 1) {
      next = (next + dir + options.length) % options.length
      if (!options[next]?.disabled) break
    }
    setActive(next)
  }

  const onTriggerKey = (e: React.KeyboardEvent) => {
    if (disabled) return
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setOpen(true)
    }
  }

  const onListKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      step(1)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      step(-1)
    } else if (e.key === 'Home') {
      e.preventDefault()
      setActive(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      setActive(options.length - 1)
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      commit(active)
    } else if (e.key === 'Tab') {
      setOpen(false)
    }
  }

  return (
    <div
      ref={rootRef}
      className={`adm-dd adm-dd--${size}${open ? ' is-open' : ''}${icon ? ' adm-dd--icon' : ''} ${className}`}
    >
      <button
        type="button"
        className="adm-dd-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={label}
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onTriggerKey}
      >
        {selected?.dot && <span className="adm-dd-dot" style={{ background: selected.dot }} />}
        <span className={`adm-dd-value${selected ? '' : ' is-placeholder'}`}>
          {selected?.label ?? placeholder}
        </span>
        <svg className="adm-dd-caret" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M7 10l5 5 5-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <ul
          id={listId}
          ref={listRef}
          className={`adm-dd-menu adm-dd-menu--${align}`}
          role="listbox"
          tabIndex={-1}
          aria-label={label}
          onKeyDown={onListKey}
          autoFocus
        >
          {options.map((option, i) => (
            <li key={option.value} role="none">
              <button
                type="button"
                role="option"
                aria-selected={option.value === value}
                className={`adm-dd-option${option.value === value ? ' is-selected' : ''}${
                  i === active ? ' is-active' : ''
                }`}
                disabled={option.disabled}
                onMouseEnter={() => setActive(i)}
                onClick={() => commit(i)}
              >
                {option.dot ? (
                  <span className="adm-dd-dot" style={{ background: option.dot }} />
                ) : (
                  <span className="adm-dd-dot adm-dd-dot--empty" />
                )}
                <span className="adm-dd-option-text">
                  <span>{option.label}</span>
                  {option.hint && <em>{option.hint}</em>}
                </span>
                {option.value === value && (
                  <svg className="adm-dd-check" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M5 12.5l4.2 4.2L19 6.8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
