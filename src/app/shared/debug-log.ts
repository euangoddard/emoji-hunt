const COLOURS = [
  '#ff1744',
  '#f50057',
  '#d500f9',
  '#651fff',
  '#3d5afe',
  '#2979ff',
  '#00b0ff',
  '#00e5ff',
  '#1de9b6',
  '#00e676',
  '#76ff03',
  '#c6ff00',
  '#ffea00',
  '#ffc400',
  '#ff9100',
  '#ff3d00',
  '#8d6e63',
  '#bdbdbd',
  '#78909c',
];

export function debugLog(prefix: string, ...args: any[]) {
  let count = 0;
  for (let i = 0; i < prefix.length; i++) {
    count += prefix.charCodeAt(i);
  }
  const colour = COLOURS[count % COLOURS.length];
  const css = `background: ${colour}; color: white; padding: 2px 0.5em; border-radius: 0.5em;`;
  console.log(`%c${prefix}`, css, ...args);
}
