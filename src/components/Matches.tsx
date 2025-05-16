import { getMatches } from "@/Services/MatchService";
import React, { useEffect, useState } from "react";
import styles from "../assets/Matches.module.css";
import { useRouter } from "next/navigation";

export const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleTips = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (id: string) => {
    router.push(`/scouting/${id}`);
  };

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const data = await getMatches();
        setMatches(data);
      } catch (error) {
        console.error("Error fetching matches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);
  if (loading && isOpen) {
    return <div>Loading...</div>;
  }
  if (matches.length === 0 && isOpen) {
    return <div>No matches found</div>;
  }

  return (
    <div style={{ position: "fixed", top: 80, right: 24, zIndex: 100 }}>
      <button
        className="tips-button"
        onClick={toggleTips}
        style={{
          backgroundColor: isOpen ? "#0070f3" : "#eaeaea",
          color: isOpen ? "#fff" : "#000",
          borderRadius: "50%",
          width: 40,
          height: 40,
          fontSize: 22,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          border: "none",
          cursor: "pointer",
        }}
        aria-label="Abrir dicas"
        title="Dicas de uso"
      >
        {isOpen ? "❌" : "🎼"}
      </button>
      {isOpen && (
        <div className={styles.container}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th style={{display: "flex", justifyContent: "center", alignItems: "center"}}> * </th>
              </tr>
            </thead>
            <tbody>
              {matches.map((match) => (
                <tr key={match._id}>
                  <td>{match.name}</td>
                  <td>
                    <button
                      onClick={() => handleSelect(match._id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 hover:pointer transition-colors"
                    >
                      Selecionar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
