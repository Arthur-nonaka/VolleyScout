export function parseLine(line: string) {
  const regex = /#(\d+),\s*([A-Z]+)([!#\-\+])?(\d+)?(=)?;?/i
  const match = line.match(regex)

  if (!match) return null

  const [, player, actionCode, qualitySymbol, target, pointSymbol] = match

  const qualityMap: Record<string, string> = {
    '!': 'Good',
    '-': 'Poor',
    '#': 'Error',
    '+': 'Normal',
  }

  const actionMap: Record<string, string> = {
    SR: 'Receive',
    D: 'Dig',
    A: 'Attack',
    ST: 'Set',
    S: 'Serve',
    FB: 'FreeBall',
    B: 'Block',
  }

  return {
    player: `#${player}`,
    action: actionMap[actionCode] || actionCode,
    quality: qualityMap[qualitySymbol] || 'Normal',
    target: target ? `#${target}` : undefined,
    point: !!pointSymbol,
  }
}
