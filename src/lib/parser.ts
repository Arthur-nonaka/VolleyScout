export function parseLine(line: string) {
  const match = line.match(/#(\d+),\s*(\w+)([!\-\*\+]?)(?:#(\d+))?(?:>(\d))?/);

  if (!match) return null;
  let pointSymbol = false;
  if (line.includes("=")) {
    pointSymbol = true;
  }

  const [, player, actionCode, qualitySymbol, target, targetPositionStr] =
    match;
  console.log(match);

  const qualityMap: Record<string, string> = {
    "!": "Good",
    "-": "Poor",
    "*": "Error",
    "+": "Normal",
  };

  const actionMap: Record<string, string> = {
    R: "Receive",
    D: "Dig",
    A: "Attack",
    ST: "Set",
    S: "Serve",
    F: "FreeBall",
    B: "Block",
  };

  const targetPosition = targetPositionStr
    ? parseInt(targetPositionStr)
    : undefined;

  return {
    player: `#${player}` || undefined,
    action: actionMap[actionCode] || actionCode,
    quality: qualityMap[qualitySymbol] || "Normal",
    target: target ? `#${target}` : undefined,
    point: !!pointSymbol,
    targetPosition
  };
}
