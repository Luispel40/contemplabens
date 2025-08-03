const localFromTable = document.querySelector(".local-from-table");
const urlCSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTfaFHS3UiNr1svMNMWPgUYsP9Dvcv40S_pSkYp1SQgTAjnYVEDgw2E4VSldyFolAv2BzimJmIwapJ2/pub?output=csv";

async function fetchCSV() {
  try {
    const res = await fetch(urlCSV);
    const csvText = await res.text();

    // Parse CSV simples (separado por linhas e vírgula)
    const lines = csvText.trim().split("\n");
    const table = [];

    lines.forEach(line => {
      // Supondo que não tenha vírgula dentro dos dados, só divide por vírgula simples
      const cells = line.split(",");
      table.push(cells);
    });

    // Montar tabela HTML
    let html = "<table border='1' cellpadding='5' cellspacing='0'><thead><tr>";

    // Cabeçalho
    table[0].forEach(head => {
      html += `<th>${head}</th>`;
    });
    html += "</tr></thead><tbody>";

    // Linhas de dados
    for (let i = 1; i < table.length; i++) {
      html += "<tr>";
      table[i].forEach(cell => {
        html += `<td>${cell}</td>`;
      });
      html += "</tr>";
    }

    html += "</tbody></table>";

    localFromTable.innerHTML = html;
  } catch (e) {
    console.error("Erro ao buscar CSV:", e);
  }
}

fetchCSV();
