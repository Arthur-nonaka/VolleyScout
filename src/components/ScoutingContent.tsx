"use client";
import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { parseLine } from "@/lib/parser";
import { Tips } from "@/components/Tips";
import { VideoPlayer } from "@/components/VideoPlayer";
import { Excel } from "./Excel";
import {
  createMatch,
  updateMatch,
  getMatchById,
  getMatches,
} from "@/Services/MatchService";
import { Matches } from "@/components/Matches";

type ParsedAction = {
  player: string;
  action: string;
  quality: string;
  target?: string;
  point: boolean;
  targetPosition?: number;
};

type PlayerStats = {
  receives: number[];
  digs: number[];
  serves: number[];
  aces: number;
  spikes: { quality: number; target?: string }[];
  sets: { quality: number; target?: string; targetPosition?: number }[];
  freeBall: number[];
  blocks: number[];
  errors: number;
  points: number;
};

type TeamStats = {
  team1Points: number;
  team2Points: number;
};

export default function ScoutingContent() {
  const [input, setInput] = useState("");
  const [matchName, setName] = useState("");
  const [matches, setMatches] = useState([]);
  const [playerStats, setPlayerStats] = useState<Record<string, PlayerStats>>(
    {}
  );
  const [teamStats, setTeamStats] = useState<TeamStats>({
    team1Points: 0,
    team2Points: 0,
  });
  const params = useParams();
  const id = params?.id as string | undefined;

  const fetchMatches = useCallback(async () => {
    try {
      const data = await getMatches();
      setMatches(data);
    } catch (error) {
      console.error("Error fetching matches:", error);
    }
  }, []);

  const fetchMatch = useCallback(async () => {
    if (id) {
      try {
        const data = await getMatchById(id);

        setInput(data.actions);
        setName(data.name);
      } catch (error) {
        console.error("Error fetching match:", error);
      }
    }
  }, [id]);

  const handleParse = useCallback(() => {
    const lines = input.split("\n").filter(Boolean);
    const result = lines.map(parseLine).filter(Boolean) as ParsedAction[];

    const updatedStats: Record<string, PlayerStats> = {};
    const updatedTeamStats = { team1Points: 0, team2Points: 0 };

    result.forEach(
      ({ player, action: act, quality, target, point, targetPosition }) => {
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
            : quality === "Poor"
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

          case "Receive":
            updatedStats[player].receives.push(q);
            if (q === -1) {
              updatedStats[player].errors += 1;
              updatedTeamStats.team2Points += 1;
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
            updatedStats[player].sets.push({
              quality: q,
              target,
              targetPosition: targetPosition,
            });
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
      }
    );

    setPlayerStats(updatedStats);
    setTeamStats(updatedTeamStats);
  }, [input]);

  useEffect(() => {
    fetchMatch();
    fetchMatches();
    if (id) {
      handleParse();
    }
  }, [fetchMatch, fetchMatches, id, handleParse]);

  const countQualities = (arr: number[]) => {
    return {
      good: arr.filter((q) => q === 2).length,
      normal: arr.filter((q) => q === 1).length,
      poor: arr.filter((q) => q === 0).length,
      error: arr.filter((q) => q === -1).length,
    };
  };

  const groupByTarget = (arr: { quality: number; target?: string }[]) => {
    const result: Record<
      string,
      {
        total: number;
        good: number;
        normal: number;
        poor: number;
        error: number;
      }
    > = {};
    arr.forEach(({ quality, target }) => {
      const t = target || "-";
      if (!result[t]) {
        result[t] = { total: 0, good: 0, normal: 0, poor: 0, error: 0 };
      }
      result[t].total += 1;
      if (quality === 2) result[t].good += 1;
      else if (quality === 1) result[t].normal += 1;
      else if (quality === 0) result[t].poor += 1;
      else if (quality === -1) result[t].error += 1;
    });
    return result;
  };

  const groupSetsByTarget = (
    arr: { quality: number; target?: string; targetPosition?: number }[]
  ) => {
    const result: Record<
      string,
      {
        total: number;
        good: number;
        normal: number;
        poor: number;
        error: number;
      }
    > = {};
    arr.forEach(({ quality, target, targetPosition }) => {
      let t = target || "-";
      if (targetPosition !== undefined) t += `>${targetPosition}`;
      if (!result[t]) {
        result[t] = { total: 0, good: 0, normal: 0, poor: 0, error: 0 };
      }
      result[t].total += 1;
      if (quality === 2) result[t].good += 1;
      else if (quality === 1) result[t].normal += 1;
      else if (quality === 0) result[t].poor += 1;
      else if (quality === -1) result[t].error += 1;
    });
    return result;
  };

  const createMatchHandler = async () => {
    if (id) {
      const matchNameInput = prompt("Nome da Partida:", matchName);
      if (!matchNameInput) return;

      const actions = input;
      try {
        await updateMatch(id, matchNameInput, actions);
      } catch (error) {
        console.error("Error updating match:", error);
      }
    } else {
      const matchName = prompt("Nome da Partida:");
      if (!matchName) return;

      const actions = input;
      try {
        await createMatch(matchName, actions);
      } catch (error) {
        console.error("Error creating match:", error);
      }
    }
  };

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <Tips />
      <Matches matches={matches} />
      <VideoPlayer />
      <h1 className="text-2xl font-bold mb-4">Volleyball Scouting Tool</h1>

      <textarea
        className="w-full h-40 p-3 border rounded text-md font-mono"
        placeholder={`1 S\n5 R3\n1 ST 2\n4 A! 1=`}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleParse();
          }
        }}
      />
      <button
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer transition-colors"
        onClick={handleParse}
      >
        Parse
      </button>
      <button
        className="mt-2 ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer transition-colors"
        onClick={createMatchHandler}
      >
        {id ? "Atualizar" : "Salvar"}
      </button>
      <Excel playerStats={playerStats} countQualities={countQualities} />

      <div className="mt-6">
        <h2 className="font-semibold">Player Stats</h2>
        <table className="min-w-full w-full table-auto mt-4 border-collapse text-sm">
          <thead>
            <tr>
              <th className="border p-2">Player</th>
              <th className="border p-2">Receives</th>
              <th className="border p-2">Digs</th>
              <th className="border p-2">Serves</th>
              <th className="border p-2">Aces</th>
              <th className="border p-2">Spikes</th>
              <th className="border p-2">Spikes Adv.</th>
              <th className="border p-2">Sets</th>
              <th className="border p-2">Sets Adv.</th>
              <th className="border p-2">Free Balls</th>
              <th className="border p-2">Blocks</th>
              <th className="border p-2">Errors</th>
              <th className="border p-2">Points</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(playerStats).map(([player, stats]) => {
              const receiveCounts = countQualities(stats.receives);
              const setCounts = countQualities(
                stats.sets.map((s) => s.quality)
              );
              const spikeCounts = countQualities(
                stats.spikes.map((s) => s.quality)
              );
              const blockCounts = countQualities(stats.blocks);
              const serveCounts = countQualities(stats.serves);
              const freeBallCounts = countQualities(stats.freeBall);
              const digCounts = countQualities(stats.digs);

              return (
                <tr key={player}>
                  <td className="border p-2">{player}</td>
                  <td className="border p-2">
                    {stats.receives.length > 0 ? (
                      <>
                        <span style={{ color: "#16a34a" }}>
                          {receiveCounts.good}
                        </span>
                        ,{" "}
                        <span style={{ color: "#2563eb" }}>
                          {receiveCounts.normal}
                        </span>
                        ,{" "}
                        <span style={{ color: "#f59e42" }}>
                          {receiveCounts.poor}
                        </span>
                        ,{" "}
                        <span style={{ color: "#dc2626" }}>
                          {receiveCounts.error}
                        </span>
                      </>
                    ) : (
                      "0"
                    )}
                  </td>
                  <td className="border p-2">
                    {stats.digs.length > 0 ? (
                      <>
                        <span style={{ color: "#16a34a" }}>
                          {digCounts.good}
                        </span>
                        ,{" "}
                        <span style={{ color: "#2563eb" }}>
                          {digCounts.normal}
                        </span>
                        ,{" "}
                        <span style={{ color: "#f59e42" }}>
                          {digCounts.poor}
                        </span>
                        ,{" "}
                        <span style={{ color: "#dc2626" }}>
                          {digCounts.error}
                        </span>
                      </>
                    ) : (
                      "0"
                    )}
                  </td>
                  <td className="border p-2">
                    {stats.serves.length > 0 ? (
                      <>
                        <span style={{ color: "#16a34a" }}>
                          {serveCounts.good}
                        </span>
                        ,{" "}
                        <span style={{ color: "#2563eb" }}>
                          {serveCounts.normal}
                        </span>
                        ,{" "}
                        <span style={{ color: "#f59e42" }}>
                          {serveCounts.poor}
                        </span>
                        ,{" "}
                        <span style={{ color: "#dc2626" }}>
                          {serveCounts.error}
                        </span>
                      </>
                    ) : (
                      "0"
                    )}
                  </td>
                  <td className="border p-2">{stats.aces}</td>
                  <td className="border p-2">
                    {stats.spikes.length > 0 ? (
                      <>
                        <span style={{ color: "#16a34a" }}>
                          {spikeCounts.good}
                        </span>
                        ,{" "}
                        <span style={{ color: "#2563eb" }}>
                          {spikeCounts.normal}
                        </span>
                        ,{" "}
                        <span style={{ color: "#f59e42" }}>
                          {spikeCounts.poor}
                        </span>
                        ,{" "}
                        <span style={{ color: "#dc2626" }}>
                          {spikeCounts.error}
                        </span>
                      </>
                    ) : (
                      "0"
                    )}
                  </td>
                  <td className="border p-2">
                    {stats.spikes.length > 0 ? (
                      <div>
                        <table className="min-w-full table-auto mt-2 border-collapse text-xs">
                          <thead>
                            <tr>
                              <th className="border p-1"></th>
                              {[1, 2, 3, 4, 5, 6].map((pos) => (
                                <th key={pos} className="border p-1">
                                  {pos}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {["good", "normal", "poor", "error"].map(
                              (quality, qIdx) => (
                                <tr key={quality}>
                                  <td className="border p-1 text-center">
                                    <span
                                      style={{
                                        color:
                                          quality === "good"
                                            ? "#16a34a"
                                            : quality === "normal"
                                            ? "#2563eb"
                                            : quality === "poor"
                                            ? "#f59e42"
                                            : quality === "error"
                                            ? "#dc2626"
                                            : undefined,
                                      }}
                                    >
                                      {quality[0].toUpperCase()}
                                    </span>
                                  </td>
                                  {[1, 2, 3, 4, 5, 6].map((pos) => {
                                    const count = stats.spikes.filter(
                                      (s) =>
                                        s.target === `#${pos}` &&
                                        ((qIdx === 0 && s.quality === 2) ||
                                          (qIdx === 1 && s.quality === 1) ||
                                          (qIdx === 2 && s.quality === 0) ||
                                          (qIdx === 3 && s.quality === -1))
                                    ).length;
                                    return (
                                      <td
                                        key={pos}
                                        className="border p-1 text-center"
                                      >
                                        {count > 0 ? count : ""}
                                      </td>
                                    );
                                  })}
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="border p-2">
                    {stats.sets.length > 0 ? (
                      <>
                        <span style={{ color: "#16a34a" }}>
                          {setCounts.good}
                        </span>
                        ,{" "}
                        <span style={{ color: "#2563eb" }}>
                          {setCounts.normal}
                        </span>
                        ,{" "}
                        <span style={{ color: "#f59e42" }}>
                          {setCounts.poor}
                        </span>
                        ,{" "}
                        <span style={{ color: "#dc2626" }}>
                          {setCounts.error}
                        </span>
                      </>
                    ) : (
                      "0"
                    )}
                  </td>
                  <td className="border p-2">
                    {stats.sets.length > 0 ? (
                      <div>
                        <table className="min-w-full table-auto mt-2 border-collapse text-xs">
                          <thead>
                            <tr>
                              <th className="border p-1"></th>
                              {[1, 2, 3, 4, 5, 6].map((pos) => (
                                <th key={pos} className="border p-1">
                                  {pos}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {["good", "normal", "poor", "error"].map(
                              (quality, qIdx) => (
                                <tr key={quality}>
                                  <td className="border p-1 text-center">
                                    <span
                                      style={{
                                        color:
                                          quality === "good"
                                            ? "#16a34a"
                                            : quality === "normal"
                                            ? "#2563eb"
                                            : quality === "poor"
                                            ? "#f59e42"
                                            : quality === "error"
                                            ? "#dc2626"
                                            : undefined,
                                      }}
                                    >
                                      {quality[0].toUpperCase()}
                                    </span>
                                  </td>
                                  {[1, 2, 3, 4, 5, 6].map((pos) => {
                                    const count = stats.sets.filter(
                                      (s) =>
                                        s.target === `#${pos}` &&
                                        ((qIdx === 0 && s.quality === 2) ||
                                          (qIdx === 1 && s.quality === 1) ||
                                          (qIdx === 2 && s.quality === 0) ||
                                          (qIdx === 3 && s.quality === -1))
                                    ).length;
                                    return (
                                      <td
                                        key={pos}
                                        className="border p-1 text-center"
                                      >
                                        {count > 0 ? count : ""}
                                      </td>
                                    );
                                  })}
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="border p-2">
                    {stats.freeBall.length > 0 ? (
                      <>
                        <span style={{ color: "#16a34a" }}>
                          {freeBallCounts.good}
                        </span>
                        ,{" "}
                        <span style={{ color: "#2563eb" }}>
                          {freeBallCounts.normal}
                        </span>
                        ,{" "}
                        <span style={{ color: "#f59e42" }}>
                          {freeBallCounts.poor}
                        </span>
                        ,{" "}
                        <span style={{ color: "#dc2626" }}>
                          {freeBallCounts.error}
                        </span>
                      </>
                    ) : (
                      "0"
                    )}
                  </td>
                  <td className="border p-2">
                    {stats.blocks.length > 0 ? (
                      <>
                        <span style={{ color: "#16a34a" }}>
                          {blockCounts.good}
                        </span>
                        ,{" "}
                        <span style={{ color: "#2563eb" }}>
                          {blockCounts.normal}
                        </span>
                        ,{" "}
                        <span style={{ color: "#f59e42" }}>
                          {blockCounts.poor}
                        </span>
                        ,{" "}
                        <span style={{ color: "#dc2626" }}>
                          {blockCounts.error}
                        </span>
                      </>
                    ) : (
                      "0"
                    )}
                  </td>
                  <td
                    className="border p-2"
                    style={{ backgroundColor: "#dc2626", color: "white" }}
                  >
                    {stats.errors}
                  </td>
                  <td
                    className="border p-2"
                    style={{ backgroundColor: "#16a34a", color: "white" }}
                  >
                    {stats.points}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <h2 className="font-semibold"> Pontos</h2>
        <p>Time Casa: {teamStats.team1Points}</p>
        <p>Time Fora: {teamStats.team2Points}</p>
      </div>
    </main>
  );
}
