function reorganizarPorDataHora() {
  const tabela = document.querySelector(".ritz table.waffle");
  if (!tabela) return;

  const tbody = tabela.querySelector("tbody");
  const linhas = Array.from(tbody.querySelectorAll("tr"));

  // 👉 preserva as duas primeiras linhas
  const cabecalho = linhas.slice(0, 1);
  const dados = linhas.slice(1);

  const comData = [];
  const semData = [];

  dados.forEach(row => {
    const celulas = row.querySelectorAll("td");
    if (!celulas.length) {
      semData.push(row);
      return;
    }

    const dataTexto = celulas[celulas.length - 1].textContent.trim();

    if (!dataTexto) {
      semData.push(row);
      return;
    }

    // Suporta formato: DD/MM/AAAA ou DD/MM/AAAA HH:MM
    const [dataParte, horaParte] = dataTexto.split(" ");
    const [dia, mes, ano] = dataParte.split("/");

    if (!dia || !mes || !ano) {
      semData.push(row);
      return;
    }

    let horas = 0;
    let minutos = 0;

    if (horaParte) {
      const partesHora = horaParte.split(":");
      horas = parseInt(partesHora[0]) || 0;
      minutos = parseInt(partesHora[1]) || 0;
    }

    const dataObj = new Date(ano, mes - 1, dia, horas, minutos);

    if (isNaN(dataObj)) {
      semData.push(row);
    } else {
      comData.push({ row, data: dataObj });
    }
  });

  // 🔽 Ordena da mais nova para a mais antiga
  comData.sort((a, b) => b.data - a.data);

  // 🔁 Limpa tbody
  tbody.innerHTML = "";

  // 🔒 Reinsere cabeçalho
  cabecalho.forEach(row => tbody.appendChild(row));

  // 📅 Reinsere ordenadas
  comData.forEach(item => tbody.appendChild(item.row));

  // 📌 Linhas sem data ficam logo após
  semData.forEach(row => tbody.appendChild(row));
}
const menu = document.getElementById("menuNav");

function hideMenu() {
  menu.classList.remove("active");
}

const lastAddedButton = document.querySelectorAll(".last-added-button");
lastAddedButton.forEach((button) => {
  button.addEventListener("click", function () {
    reorganizarPorDataHora();
    hideMenu();
    button.innerText = "Últimas";
    Object.assign(button.style, {
      "background-color": "#b83939",
      "color": "#fff",
      "pointer-events": "none",
    })
  });
})

const hideMenuButton = document.getElementById("hideMenuButton");
hideMenuButton.addEventListener("click", hideMenu);

