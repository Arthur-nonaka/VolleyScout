"use client";

import { useState } from "react";
import { parseLine } from "@/lib/parser";

type ParsedAction = {
  player: string;
  action: string;
  quality: string;
  target?: string;
  point: boolean;
};

type PlayerStats = {
  receives: number[];
  digs: number[];
  serves: number[];
  aces: number;
  spikes: { quality: number; target?: string }[];
  sets: { quality: number; target?: string }[];
  freeBall: number[];
  blocks: number[];
  errors: number;
  points: number;
};

type TeamStats = {
  team1Points: number;
  team2Points: number;
};

export default function ScoutingPage() {
  const [input, setInput] = useState("");
  const [parsed, setParsed] = useState<ParsedAction[]>([]);
  const [playerStats, setPlayerStats] = useState<Record<string, PlayerStats>>(
    {}
  );
  const [teamStats, setTeamStats] = useState<TeamStats>({
    team1Points: 0,
    team2Points: 0,
  });

  const handleParse = () => {
    const lines = input.split("\n").filter(Boolean);
    const result = lines.map(parseLine).filter(Boolean) as ParsedAction[];
    setParsed(result);

    const updatedStats: Record<string, PlayerStats> = {};
    const updatedTeamStats = { team1Points: 0, team2Points: 0 };

    result.forEach(({ player, action: act, quality, target, point }) => {
      if (!updatedStats[player]) {
        updatedStats[player] = {
          receives: [],
          digs: [],
          serves: [],
          aces: 0,
          spikes: [],
          sets: [],
          freeBall: [],
          blocks: [],
          errors: 0,
          points: 0,
        };
      }

      const q =
        quality === "Good"
          ? 2
          : quality === "Normal"
          ? 1
          : quality === "Bad"
          ? 0
          : -1;

      switch (act) {
        case "Serve":
          updatedStats[player].serves.push(q);
          if (q === -1) {
            updatedStats[player].errors += 1;
            updatedTeamStats.team2Points += 1;
          }
          if (point) {
            updatedStats[player].aces += 1;
            updatedStats[player].points += 1;
          }
          break;

        case "Dig":
          updatedStats[player].digs.push(q);
          if (q === -1) {
            updatedStats[player].errors += 1;
            updatedTeamStats.team2Points += 1;
          }
          break;

        case "Attack":
          updatedStats[player].spikes.push({ quality: q, target });
          if (q === -1) {
            updatedStats[player].errors += 1;
            updatedTeamStats.team2Points += 1;
          }
          if (point) {
            updatedStats[player].points += 1;
          }
          break;

        case "Set":
          updatedStats[player].sets.push({ quality: q, target });
          if (q === -1) {
            updatedStats[player].errors += 1;
            updatedTeamStats.team2Points += 1;
          }
          break;

        case "FreeBall":
          updatedStats[player].freeBall.push(q);
          if (q === -1) {
            updatedStats[player].errors += 1;
            updatedTeamStats.team2Points += 1;
          }
          break;

        case "Block":
          updatedStats[player].blocks.push(q);
          if (q === -1) {
            updatedStats[player].errors += 1;
            updatedTeamStats.team2Points += 1;
          }
          if (point) {
            updatedStats[player].points += 1;
          }
          break;
      }
    });

    setPlayerStats(updatedStats);
    setTeamStats(updatedTeamStats);
  };

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📋 Volleyball Scouting Tool</h1>

      <textarea
        className="w-full h-40 p-3 border rounded text-sm font-mono"
        placeholder={`#1, S!6;\n#5, D-;\n#1, ST+#2;\n#2, A!1=;`}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={handleParse}
      >
        Parse
      </button>

      <div className="mt-6">
        <h2 className="font-semibold">Player Stats</h2>
        <table className="min-w-full table-auto mt-4 border-collapse text-sm">
          <thead>
            <tr>
              <th className="border p-2">Player</th>
              <th className="border p-2">Receives</th>
              <th className="border p-2">Digs</th>
              <th className="border p-2">Serves</th>
              <th className="border p-2">Aces</th>
              <th className="border p-2">Spikes</th>
              <th className="border p-2">Sets</th>
              <th className="border p-2">Free Balls</th>
              <th className="border p-2">Blocks</th>
              <th className="border p-2">Errors</th>
              <th className="border p-2">Points</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(playerStats).map(([player, stats]) => (
              <tr key={player}>
                <td className="border p-2">{player}</td>
                <td className="border p-2">{stats.receives.join(", ")}</td>
                <td className="border p-2">{stats.digs.join(", ")}</td>
                <td className="border p-2">{stats.serves.join(", ")}</td>
                <td className="border p-2">{stats.aces}</td>
                <td className="border p-2">
                  {stats.spikes
                    .map((s) => `${s.quality}${s.target ?? ""}`)
                    .join(", ")}
                </td>
                <td className="border p-2">
                  {stats.sets
                    .map((s) => `${s.quality}${s.target ?? ""}`)
                    .join(", ")}
                </td>
                <td className="border p-2">{stats.freeBall.join(", ")}</td>
                <td className="border p-2">{stats.blocks.join(", ")}</td>
                <td className="border p-2">{stats.errors}</td>
                <td className="border p-2">{stats.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <h2 className="font-semibold">Team Points</h2>
        <p>Team 1 Points: {teamStats.team1Points}</p>
        <p>Team 2 Points: {teamStats.team2Points}</p>
      </div>
    </main>
  );
}
