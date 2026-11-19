const artwork: Record<string, string> = {
  steps: 'M14 75h18V58h17V41h17V24h19M14 84h71',
  grid: 'M19 24h62v52H19zM19 41h62M41 41v35M50 65l8-11 7 5 10-10',
  index: 'M23 21h54v58H23zM31 21v58M39 34h28M39 45h19M39 56h24M39 67h14',
  relay: 'M20 22h25v22H20zM55 56h25v22H55zM45 33h22v15m-5-5 5 5 5-5M55 67H33V52m-5 5 5-5 5 5',
  components: 'M20 20h25v25H20zM55 20h25v25H55zM20 55h25v25H20zM55 55h25v25H55zM25 32.5h15m-7.5-7.5v15M60 32.5h15M25 67.5h15M60 67.5h15',
}

export function Thumbnail({ variant }: { variant: string }) {
  return (
    <div className="thumbnail" aria-hidden="true">
      <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinejoin="round">
        <path d={artwork[variant] ?? artwork.grid} />
      </svg>
    </div>
  )
}
