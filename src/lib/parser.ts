export function parseLine(line: string) {
  const match = line.match(
    /(\d+)\s+([A-Z]{1,2})([!\-\*\+123]?)(?:\s+(\d+)(?:>(\d))?)?/i
  );

  if (!match) return null;

  const [, player, actionCode, qualitySymbol, target, targetPositionStr] =
    match;
  console.log(match);

  let quality: string;
  if (actionCode === "R") {
    if (qualitySymbol === "1") quality = "Poor";
    else if (qualitySymbol === "2") quality = "Normal";
    else if (qualitySymbol === "3") quality = "Good";
    else quality = "Normal";
  } else {
    const qualityMap: Record<string, string> = {
      "!": "Good",
      "-": "Poor",
      "*": "Error",
      "+": "Normal",
    };
    quality = qualityMap[qualitySymbol] || "Normal";
  }
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
    quality,
    target: target ? `#${target}` : undefined,
    point: line.includes("="),
    targetPosition,
  };
}
