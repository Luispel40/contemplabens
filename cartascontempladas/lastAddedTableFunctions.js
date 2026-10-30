function reorganizarPorDataHora() {
  const tabela = document.querySelector(".ritz table.waffle");
  if (!tabela) return;

  const tbody = tabela.querySelector("tbody");
  const linhas = Array.from(tbody.querySelectorAll("tr"));

  // 1. Defina aqui qual coluna contém a data (0 é a primeira, 1 a segunda...)
  // Se for sempre a última, mantenha o cálculo dinâmico dentro do loop.
  const COLUNA_DATA_INDEX = -1; // -1 para usar a última coluna

  // 2. Preserva o cabeçalho (Ajuste para 1 ou 2 conforme sua necessidade)
  const cabecalho = linhas.slice(0, 1); 
  const dados = linhas.slice(1);

  const comData = [];
  const semData = [];

  dados.forEach(row => {
    const celulas = row.querySelectorAll("td");
    if (celulas.length === 0) return;

    // Pega a célula da data (seja a última ou um índice fixo)
    const index = COLUNA_DATA_INDEX === -1 ? celulas.length - 1 : COLUNA_DATA_INDEX;
    const dataTexto = celulas[index]?.textContent.trim() || "";

    if (!dataTexto) {
      semData.push(row);
      return;
    }

    // Regex para extrair data e hora com mais segurança
    // Formato esperado: "DD/MM/YYYY HH:MM" ou "DD/MM/YYYY"
    const match = dataTexto.match(/(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?/);

    if (!match) {
      semData.push(row);
      return;
    }

    const [_, dia, mes, ano, horas, minutos] = match;
    
    // Mês no JS começa em 0 (Janeiro = 0)
    const dataObj = new Date(
      parseInt(ano), 
      parseInt(mes) - 1, 
      parseInt(dia), 
      parseInt(horas) || 0, 
      parseInt(minutos) || 0
    );

    if (isNaN(dataObj.getTime())) {
      semData.push(row);
    } else {
      comData.push({ row, data: dataObj });
    }
  });

  // 3. Ordenação: Mais recente primeiro (Descendente)
  comData.sort((a, b) => b.data.getTime() - a.data.getTime());

  // 4. Reinserção eficiente usando DocumentFragment
  const fragment = document.createDocumentFragment();
  
  // Adiciona cabeçalho
  cabecalho.forEach(row => fragment.appendChild(row));
  
  // Adiciona ordenadas
  comData.forEach(item => fragment.appendChild(item.row));
  
  // Adiciona sem data por último
  semData.forEach(row => fragment.appendChild(row));

  // Limpa e aplica tudo de uma vez para melhor performance
  tbody.innerHTML = "";
  tbody.appendChild(fragment);
}

// --- Restante do script (Lógica de UI) ---

const menu = document.getElementById("menuNav");

function hideMenu() {
  if (menu) menu.classList.remove("active");
}

const lastAddedButtons = document.querySelectorAll(".last-added-button");
lastAddedButtons.forEach((button) => {
  button.addEventListener("click", function () {
    reorganizarPorDataHora();
    hideMenu();
    
    // Estilização de feedback
    button.innerText = "Ordenado"; // Mudei para "Ordenado" para fazer mais sentido
    Object.assign(button.style, {
      "background-color": "#b83939",
      "color": "#fff",
      "pointer-events": "none",
      "opacity": "0.8"
    });
  });
});

const hideMenuButton = document.getElementById("hideMenuButton");
if (hideMenuButton) {
  hideMenuButton.addEventListener("click", hideMenu);
}