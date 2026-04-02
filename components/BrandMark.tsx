type Props = {
  compact?: boolean
}

export default function BrandMark({ compact = false }: Props) {
  return (
    <div className="flex items-center gap-3">
      <div className="brand-mark">
        <span>EE</span>
      </div>
      {!compact && (
        <div className="min-w-0">
          <p className="font-display text-[0.72rem] uppercase tracking-[0.34em] text-[var(--text-3)]">
            UFSCar
          </p>
          <p className="font-display text-sm font-semibold text-[var(--text)]">
            Educacao Especial 2026
          </p>
        </div>
      )}
    </div>
  )
}
