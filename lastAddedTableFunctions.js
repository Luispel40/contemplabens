function filtrarUltimos7Dias() {
  const tabela = document.querySelector(".ritz table.waffle");
  if (!tabela) return;

  const hoje = new Date();
  const limite = new Date();
  limite.setDate(hoje.getDate() - 7);

  const linhas = tabela.querySelectorAll("tbody tr");

  linhas.forEach((row, index) => {
    // 👉 pula as duas primeiras linhas
    if (index < 2) return;

    const celulas = row.querySelectorAll("td");
    if (!celulas.length) return;

    const dataTexto = celulas[celulas.length - 1].textContent.trim();

    const [dia, mes, ano] = dataTexto.split("/");
    const dataLinha = new Date(ano, mes - 1, dia);

    if (isNaN(dataLinha) || dataLinha < limite) {
      row.remove();
    }
  });
}
const menu = document.getElementById("menuNav");

function hideMenu() {
  menu.classList.remove("active");
}

const lastAddedButton = document.querySelectorAll(".last-added-button");
lastAddedButton.forEach((button) => {
  button.addEventListener("click", function () {
    filtrarUltimos7Dias();
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

