import React, { useState } from "react";
import styles from "../assets/Matches.module.css";
import { useRouter } from "next/navigation";

interface Match {
  _id: string;
  name: string;
}

interface MatchesProps {
  matches: Match[];
}

export const Matches: React.FC<MatchesProps> = ({ matches }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleTips = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (id: string) => {
    router.push(`/scouting/${id}`);
  };

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
                <th
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {" "}
                  *{" "}
                </th>
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
              <tr>
                <td>
                  <button
                    onClick={() => router.push("/scouting")}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 hover:pointer transition-colors"
                  >
                    Criar Novo
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
