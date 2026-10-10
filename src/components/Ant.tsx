/** Top-down ant facing +x. One purple antenna, like the AntBox mark. */
export function AntShape({ carry = false, walking = false }: { carry?: boolean; walking?: boolean }) {
  const legs = [
    [-6, -1, -11, -12],
    [0, -1, 1, -13],
    [5, -1, 11, -11],
  ]
  return (
    <g className={walking ? 'ant ant--walk' : 'ant'}>
      {legs.map(([x1, y1, x2, y2], i) => (
        <g key={i} className={`ant__leg ant__leg--${i % 2 ? 'b' : 'a'}`}>
          <path d={`M${x1} ${y1} Q${(x1 + x2) / 2} ${y2 - 2} ${x2} ${y2}`} stroke="#0b0b0d" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <path d={`M${x1} ${-y1} Q${(x1 + x2) / 2} ${-y2 + 2} ${x2} ${-y2}`} stroke="#0b0b0d" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        </g>
      ))}
      <ellipse cx="-12" cy="0" rx="8" ry="6" fill="#0b0b0d" />
      <ellipse cx="0" cy="0" rx="5" ry="3.6" fill="#0b0b0d" />
      <circle cx="9" cy="0" r="5" fill="#0b0b0d" />
      <path d="M12 -3 Q17 -9 22 -8" stroke="#0b0b0d" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M12 3 Q17 9 22 8" stroke="#8e43ac" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {carry && (
        <g transform="translate(-14 -16) rotate(-8)">
          <rect x="-7" y="-7" width="14" height="14" rx="2.5" fill="#8e43ac" />
          <path d="M-7 -1h14" stroke="#c991df" strokeWidth="1.6" />
        </g>
      )}
    </g>
  )
}
