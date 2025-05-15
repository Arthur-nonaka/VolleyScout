import React, { useState } from "react";

export const Tips = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleTips = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={{ position: "fixed", top: 24, right: 24, zIndex: 100 }}>
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
        {isOpen ? "❌" : "📘"}
      </button>
      {isOpen && (
        <div
          className="tips"
          style={{
            background: "#fff",
            color: "#222",
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 20,
            marginTop: 8,
            minWidth: 260,
            maxWidth: 340,
            boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
          }}
        >
          <h2 style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>
            📘 Dicas Rápidas
          </h2>
          <h3 style={{ fontWeight: 500, fontSize: 15, marginTop: 10 }}>
            🏷️ Símbolos de Qualidade
          </h3>
          <ul style={{ marginLeft: 16, marginBottom: 12 }}>
            <li>
              <code>!</code> — Bom (<b>Good</b>)
            </li>
            <li>
              <code>+</code> — Normal (<b>Normal</b>)
            </li>
            <li>
              <code>-</code> — Ruim (<b>Poor</b>)
            </li>
            <li>
              <code>*</code> — Erro (<b>Error</b>)
            </li>
          </ul>
          <h3 style={{ fontWeight: 500, fontSize: 15, marginTop: 10 }}>
            🏐 Exemplos de uso
          </h3>
          <ul style={{ marginLeft: 16, marginBottom: 12 }}>
            <li>
              <code>#1, S!6;</code> — Jogador 1 faz um saque bom para a zona 6
            </li>
            <li>
              <code>#5, D-;</code> — Jogador 5 faz uma defesa ruim
            </li>
            <li>
              <code>#1, ST+#2;</code> — Jogador 1 faz um levantamento normal para o jogador 2
            </li>
            <li>
              <code>#2, A!1=;</code> — Jogador 2 faz um ataque bom na zona 1, ponto
            </li>
          </ul>
          <div style={{ fontSize: 13, color: "#666" }}>
            Use os símbolos conforme o <b>parser</b> entende:<br />
            <code>#jogador, AÇÃO[SÍMBOLO][#alvo][{'>'}posição][=];</code>
            <br />
            <br />
            Clique em <b>Parse</b> para ver as estatísticas!
          </div>
        </div>
      )}
    </div>
  );
};