export function parseLine(line: string) {
  const match = line.match(/(\d+)\s+(\w+)([!\-\*\+]?)(?:\s+(\d+)(?:>(\d))?)?/);

  if (!match) return null;

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
    point: line.includes("="),
    targetPosition
  };
}
