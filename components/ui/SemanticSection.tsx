"use client"

import { ReactNode } from "react"

interface SemanticSectionProps {
  children: ReactNode
  heading: string
  level?: 1 | 2 | 3 | 4 | 5 | 6
  description?: string
  className?: string
  id?: string
}

export function SemanticSection({
  children,
  heading,
  level = 2,
  description,
  className = "",
  id
}: SemanticSectionProps) {
  const renderHeading = () => {
    const headingId = id ? `${id}-heading` : undefined
    const className = "sr-only"

    switch (level) {
      case 1:
        return <h1 id={headingId} className={className}>{heading}</h1>
      case 2:
        return <h2 id={headingId} className={className}>{heading}</h2>
      case 3:
        return <h3 id={headingId} className={className}>{heading}</h3>
      case 4:
        return <h4 id={headingId} className={className}>{heading}</h4>
      case 5:
        return <h5 id={headingId} className={className}>{heading}</h5>
      case 6:
        return <h6 id={headingId} className={className}>{heading}</h6>
      default:
        return <h2 id={headingId} className={className}>{heading}</h2>
    }
  }

  return (
    <section
      className={className}
      id={id}
      aria-labelledby={id ? `${id}-heading` : undefined}
      aria-describedby={description && id ? `${id}-description` : undefined}
    >
      {renderHeading()}

      {description && (
        <p
          id={id ? `${id}-description` : undefined}
          className="sr-only"
        >
          {description}
        </p>
      )}

      {children}
    </section>
  )
}

interface SemanticListProps {
  children: ReactNode
  label: string
  className?: string
  orientation?: "horizontal" | "vertical"
}

export function SemanticList({
  children,
  label,
  className = "",
  orientation = "vertical"
}: SemanticListProps) {
  return (
    <div
      role="list"
      aria-label={label}
      className={className}
      aria-orientation={orientation}
    >
      {children}
    </div>
  )
}

interface SemanticListItemProps {
  children: ReactNode
  className?: string
}

export function SemanticListItem({
  children,
  className = ""
}: SemanticListItemProps) {
  return (
    <div
      role="listitem"
      className={className}
    >
      {children}
    </div>
  )
}

interface SemanticButtonProps {
  children: ReactNode
  onClick: () => void
  disabled?: boolean
  loading?: boolean
  variant?: "primary" | "secondary" | "danger"
  className?: string
  ariaLabel?: string
  ariaDescribedBy?: string
}

export function SemanticButton({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = "primary",
  className = "",
  ariaLabel,
  ariaDescribedBy
}: SemanticButtonProps) {
  const baseClasses = "brutal-button px-4 py-2 font-mono text-sm uppercase"
  const variantClasses = {
    primary: "bg-yellow-300 hover:bg-lime-300 text-black",
    secondary: "bg-gray-200 hover:bg-gray-300 text-black",
    danger: "bg-red-400 hover:bg-red-500 text-white"
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-disabled={disabled || loading}
    >
      {loading ? "Loading..." : children}
    </button>
  )
}

interface SemanticFormProps {
  children: ReactNode
  onSubmit: (event: React.FormEvent) => void
  title: string
  description?: string
  className?: string
}

export function SemanticForm({
  children,
  onSubmit,
  title,
  description,
  className = ""
}: SemanticFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className={className}
      role="form"
      aria-label={title}
      aria-describedby={description ? "form-description" : undefined}
    >
      <h2 className="sr-only">{title}</h2>
      {description && (
        <p id="form-description" className="sr-only">
          {description}
        </p>
      )}
      {children}
    </form>
  )
}

interface SemanticInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  type?: "text" | "email" | "password" | "number" | "search"
  placeholder?: string
  required?: boolean
  error?: string
  description?: string
  className?: string
  id?: string
}

export function SemanticInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  error,
  description,
  className = "",
  id
}: SemanticInputProps) {
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, "-")}`
  const errorId = `${inputId}-error`
  const descriptionId = `${inputId}-description`

  return (
    <div className={className}>
      <label
        htmlFor={inputId}
        className="block text-sm font-mono uppercase mb-2"
      >
        {label}
        {required && <span aria-label="required">*</span>}
      </label>

      {description && (
        <p
          id={descriptionId}
          className="text-xs text-gray-600 mb-2"
        >
          {description}
        </p>
      )}

      <input
        id={inputId}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : description ? descriptionId : undefined}
        className="brutal-border brutal-shadow bg-white px-3 py-2 font-mono text-sm w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />

      {error && (
        <p
          id={errorId}
          role="alert"
          className="text-red-600 text-xs mt-1"
        >
          {error}
        </p>
      )}
    </div>
  )
}