import ExcelJS from "exceljs";

export const Excel = ({ playerStats, countQualities }) => {
  const handleExport = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Stats", {
      views: [{ state: "frozen", xSplit: 1 }],
    });

    // Header rows
    const headerRow1 = [
      "Player",
      "Receive",
      "",
      "",
      "",
      "Dig",
      "",
      "",
      "",
      "Serve",
      "",
      "",
      "",
      "Aces",
      "Spike",
      "",
      "",
      "",
      "Set",
      "",
      "",
      "",
      "Free Ball",
      "",
      "",
      "",
      "Block",
      "",
      "",
      "",
      "Errors",
      "Points",
    ];
    const headerRow2 = [
      "",
      "G",
      "N",
      "P",
      "E",
      "G",
      "N",
      "P",
      "E",
      "G",
      "N",
      "P",
      "E",
      "",
      "G",
      "N",
      "P",
      "E",
      "G",
      "N",
      "P",
      "E",
      "G",
      "N",
      "P",
      "E",
      "G",
      "N",
      "P",
      "E",
      "",
      "",
    ];
    worksheet.addRow(headerRow1);
    worksheet.addRow(headerRow2);

    const getCellColor = (index: number) => {
      const colors = ["C6EFCE", "FFEB9C", "FCE4D6", "FFC7CE"];
      return colors[index % 4];
    };

    [1, 2].forEach((rowIdx) => {
      const row = worksheet.getRow(rowIdx);
      row.font = { bold: true };
      row.alignment = { horizontal: "center", vertical: "middle" };
      row.eachCell((cell, colNumber) => {
        if (rowIdx === 2 && colNumber > 1 && colNumber < 40) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: getCellColor((colNumber - 2) % 4) },
          };
        }
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    const total = (stat) =>
      stat.good + stat.normal + stat.poor + stat.error || 1;
    const format = (stat) => {
      const sum = total(stat);
      const pct = (val) => ((val / sum) * 100).toFixed(0) + "%";
      return [
        `${stat.good} (${pct(stat.good)})`,
        `${stat.normal} (${pct(stat.normal)})`,
        `${stat.poor} (${pct(stat.poor)})`,
        `${stat.error} (${pct(stat.error)})`,
      ];
    };

    Object.entries(playerStats).forEach(([player, stats], index) => {
      const r = countQualities(stats.receives);
      const d = countQualities(stats.digs);
      const s = countQualities(stats.serves);
      const sp = countQualities(stats.spikes.map((x) => x.quality));
      const se = countQualities(stats.sets.map((x) => x.quality));
      const f = countQualities(stats.freeBall);
      const b = countQualities(stats.blocks);

      const row = worksheet.addRow([
        player,
        ...format(r),
        ...format(d),
        ...format(s),
        ...format(sp),
        ...format(se),
        ...format(f),
        ...format(b),
        stats.errors,
        stats.points,
        stats.aces,
      ]);

      row.eachCell((cell) => {
        cell.alignment = { horizontal: "center", vertical: "middle" };
        if (index % 2 === 1) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "F9F9F9" },
          };
        }
      });
    });

    worksheet.columns.forEach((col) => {
      let maxLength = 10;
      col.eachCell({ includeEmpty: true }, (cell) => {
        const value = cell.value ? cell.value.toString() : "";
        maxLength = Math.max(maxLength, value.length + 2);
      });
      col.width = maxLength;
    });

    worksheet.mergeCells("A1:A2"); // Player
    worksheet.mergeCells("B1:E1"); // Receive
    worksheet.mergeCells("F1:I1"); // Dig
    worksheet.mergeCells("J1:M1"); // Serve
    worksheet.mergeCells("N1:Q2"); // Aces
    worksheet.mergeCells("R1:U1"); // Spike
    worksheet.mergeCells("V1:Y1"); // Set
    worksheet.mergeCells("Z1:AC1"); // Free Ball
    worksheet.mergeCells("AD1:AG1"); // Block
    worksheet.mergeCells("AH1:AH2"); // Errors
    worksheet.mergeCells("AI1:AI2"); // Points
    worksheet.mergeCells("AJ1:AJ2"); // Points

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stats_${new Date().toISOString().slice(0, 10)}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      className="mt-2 ml-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors cursor-pointer"
    >
      📋
    </button>
  );
};
