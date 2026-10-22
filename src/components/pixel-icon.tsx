const patterns: Record<string, {color: string; paths: string[]}> = {
  diamond: {
    color: '#77e4e0',
    paths: ['M5 2h6v2h2v2h2v4h-2v2h-2v2H5v-2H3v-2H1V6h2V4h2z', 'M5 4h2v2H5V4H3v4h2z'],
  },
  pickaxe: {
    color: '#7ee0d8',
    paths: ['M3 1h8v2h2v2h2v6h-2V7h-2V5H7V3H3z', 'M9 6h2v3H9v2H7v2H5v2H2v-3h3v-2h2V8h2z'],
  },
  book: {
    color: '#e7bc75',
    paths: ['M1 3h6v1h2V3h6v10H9v1H7v-1H1z', 'M3 5h3v1H3zm0 3h3v1H3zm7-3h3v1h-3zm0 3h3v1h-3z'],
  },
  torch: {color: '#ffd78a', paths: ['M6 1h4v2h2v5h-2v2H6V8H4V3h2z', 'M6 10h4v5H6z']},
  portal: {color: '#bda0f0', paths: ['M3 1h10v14H3z', 'M5 3h6v10H5z']},
  flag: {color: '#ecac73', paths: ['M3 1h2v14H3z', 'M5 2h9v6H5z']},
  redstone: {color: '#ee8d86', paths: ['M6 1h4v3h3v3h2v4h-3v3H4v-3H1V7h2V4h3z', 'M6 4h3v3H6z']},
};
export function PixelIcon({name = 'diamond', className = ''}: {name?: string; className?: string}) {
  const icon = patterns[name] || patterns.diamond;
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      shapeRendering="crispEdges"
    >
      <path d={icon.paths[0]} fill={icon.color} />
      <path
        d={icon.paths[1]}
        fill={name === 'pickaxe' || name === 'torch' ? '#997b58' : '#14272e'}
        opacity=".6"
      />
    </svg>
  );
}
