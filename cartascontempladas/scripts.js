document.addEventListener("DOMContentLoaded", async function () {
  const menuBtn = document.querySelector("#hamburgerBtn");
  const menuClose = document.querySelector("#closeMenu");
  const menu = document.getElementById("menuNav");

  menuBtn.addEventListener("click", () => {
    menu.classList.toggle("active");
  });

  menuClose.addEventListener("click", () => {
    menu.classList.remove("active");
  });

  const urlCSV =
    "https://docs.google.com/spreadsheets/d/1bUFgA8qUTXSAC4gqhsUTU25_dMEaKbM3YgWp4yg8tcU/export?format=csv&gid=0#gid=0";

  try {
    let csvText = sessionStorage.getItem("csvText");

    // Se não existir no cache → faz fetch
    if (!csvText) {
      console.log("Buscando CSV da internet...");

      const response = await fetch(urlCSV);
      csvText = await response.text();

      // salva no sessionStorage
      sessionStorage.setItem("csvText", csvText);
    } else {
    }

    // processamento normal
    const linhas = csvText.trim().split("\n");

    const tabelaDados = linhas.map((line) =>
      line.split(",").map((cell) => cell.replace(/"/g, "")),
    );

    // Criar a div .ritz e tabela .waffle
    const divRitz = document.createElement("div");
    divRitz.classList.add("ritz");

    const tabela = document.createElement("table");
    tabela.classList.add("waffle");

    // Número total de colunas do CSV
    const numColunas = tabelaDados[0].length;

    // Montar thead com células vazias (colunas + 1 por causa do th extra)
    const thead = document.createElement("thead");
    const trHead = document.createElement("tr");

    for (let i = 0; i <= numColunas; i++) {
      const th = document.createElement("th");
      th.textContent = ""; // célula vazia
      trHead.appendChild(th);
    }
    thead.appendChild(trHead);
    tabela.appendChild(thead);

    // Montar tbody com todos os dados, inclusive a antiga "linha cabeçalho"
    const tbody = document.createElement("tbody");
    for (let i = 0; i < tabelaDados.length; i++) {
      // começa do zero, pega todas as linhas
      const tr = document.createElement("tr");

      // Criar <th> vazio no início de cada linha do tbody
      const thLinhaVazio = document.createElement("th");
      thLinhaVazio.textContent = "";
      tr.appendChild(thLinhaVazio);

      // Criar as células td para essa linha
      tabelaDados[i].slice(0, 11).forEach((celula) => {
        const td = document.createElement("td");
        td.textContent = celula;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    }
    tabela.appendChild(tbody);

    divRitz.appendChild(tabela);

    // Inserir no container principal (limpando o que tinha antes)
    const paiDaTabela = document.querySelector(".tabela");
    paiDaTabela.innerHTML = "";
    paiDaTabela.appendChild(divRitz);

    // Executar seu código para manipular linhas, caso queira manter
    const rows = paiDaTabela.querySelectorAll(".waffle tr");

    rows.forEach(function (row) {
      if (row.childElementCount > 3) {
        var newCell = document.createElement("td");
        row.insertBefore(newCell, row.children[1]);
      } else {
        row.classList.add("demarcation");
      }
    });

    //Previne se acaso tiver algun span dentro das celulas de qualisquer coluna.
    var myCells = document.querySelectorAll(".waffle td");
    myCells.forEach(function (myCell) {
      // Seleciona todos os spans dentro da célula
      var spans = myCell.querySelectorAll("span");
      if (spans.length > 0) {
        var combinedText = "";

        // Itera sobre todos os spans e combina o conteúdo de cada um
        spans.forEach(function (span) {
          combinedText += span.innerHTML;
        });

        myCell.innerHTML = combinedText
          .replace(/r\$|R\$/g, "")
          .replace(/junção/, "");
      }
    });

    // Formatação de valores
    $("td:not(:nth-child(4))")
      .filter(function () {
        return $(this).text().toLowerCase().includes("x");
      })
      .each(function () {
        var parcelaTexto = $(this).text().toLocaleLowerCase();

        // Encontra a posição do primeiro "x"
        var posicaoDoX = parcelaTexto.toLocaleLowerCase().indexOf("x");

        if (posicaoDoX !== -1) {
          var valorAntesDoX = parcelaTexto.substring(0, posicaoDoX).trim(); // Valor antes do primeiro "x"
          var valorDepoisDoX = parcelaTexto.substring(posicaoDoX + 1).trim(); // Valor depois do primeiro "x"

          var numerosAntesDoX = valorAntesDoX.match(/\d+/g);
          if (numerosAntesDoX) {
            numerosAntesDoX = numerosAntesDoX.join("");
          } else {
            numerosAntesDoX = "";
          }

          // Copia o valor antigo das células "Prazo" e "Parcelas"
          var oldParcelas = $(this)
            .closest("tr")
            .find("td:eq(6)")
            .text()
            .replace("junção", "")
            .replace("R$", "")
            .replace("sendo", "");

          // Adiciona "+" depois dos dois números após uma vírgula, se necessário
          var decimalpadron = /(\d{1},\d{2})(?![\d,]*\+)/g;
          oldParcelas = oldParcelas.replace(decimalpadron, function (match) {
            var index = oldParcelas.indexOf(match) + match.length;
            if (
              index < oldParcelas.length &&
              !oldParcelas.includes("+", index)
            ) {
              return match + "+";
            }
            return match;
          });

          // Atualize as células da coluna "Prazo" e "Parcelas" com os números extraídos
          $(this).closest("tr").find("td:eq(5)").text(numerosAntesDoX);
          $(this).closest("tr").find("td:eq(6)").text(valorDepoisDoX);
        }

        var cellText = $(this).text();
        var newText = cellText.replace(/r\$|R\$/g, "").replace(/junção/, ""); // Remove "R$" ou "r$" e junção.
        $(this).text(newText);
      });

    // Função para adicionar classes às linhas da tabela e definir o atributo "data-value"
    function adicionarClassesTabela() {
      // Função para remover acentuação e converter para letras minúsculas
      function normalizeText(text) {
        return text
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase();
      }

      $("tr").each(function () {
        var segundaCelula = $(this).find("td:eq(2)");
        var primeiraCelula = $(this).find("td:eq(1)");
        var textoInterno = segundaCelula.text().trim();
        var textoInterno2 = primeiraCelula.text().trim();

        // Remove espaços em branco, acentuação e converte para letras minúsculas
        var classeSegundaCelula = normalizeText(
          textoInterno.replace(/\s+/g, ""),
        );
        var classePrimeiraCelula = normalizeText(
          textoInterno2.replace(/\s+/g, ""),
        );

        $(this).addClass(classeSegundaCelula);
        $(this).addClass(classePrimeiraCelula);

        if (primeiraCelula.text().replace(/\s+/g, "") == "Imovel") {
          primeiraCelula.html(`<i class="fa-solid fa-house"></i>`);
        } else if (primeiraCelula.text().replace(/\s+/g, "") == "Auto") {
          primeiraCelula.html(`<i class="fa-solid fa-car"></i>`);
        } else if (primeiraCelula.text() == "Seguimento") {
          primeiraCelula.html(`<i class="fa-solid fa-gears"></i>`);
        }

        var sextaCelula = $(this).find("td:eq(6)");
        var textoSextaCelula = sextaCelula.text().trim();

        var decimalPattern = /(\d{1},\d{2})(?![\d,]*\+)/g;
        textoSextaCelula = textoSextaCelula.replace(
          decimalPattern,
          function (match) {
            // Verifica se há mais números após os dois números decimais e se não há um "+"
            var index = textoSextaCelula.indexOf(match) + match.length;
            if (
              index < textoSextaCelula.length &&
              !textoSextaCelula.includes("+", index)
            ) {
              return match + "+";
            }
            return match;
          },
        );

        sextaCelula.text(textoSextaCelula);

        // Verifica se o valor contém "+" ou "x"
        if (
          textoSextaCelula.includes("+") ||
          textoSextaCelula.toLocaleLowerCase().includes("x")
        ) {
          $(this).attr("data-value", "11");
        }

        $('.waffle tr[data-value="11"]').each(function () {
          var $row = $(this);
          var value5 = $row.find("td:eq(5)").text().trim();
          var value6 = $row.find("td:eq(6)").text().trim();

          // Remover o "+" no final do texto da td:eq(6) se existir
          if (value6.endsWith("+")) {
            value6 = value6.slice(0, -1).trim(); // Remove o último caractere "+"
          }

          // Criar a variável combinada para "realValue" da td:eq(6)
          var newValue6 = value5 + "x" + value6;
          $row.find("td:eq(6)").attr("realValue", newValue6);

          // Criar o "realValue" da td:eq(4)
          var modifiedValue6 = newValue6.replace(/\+/g, ">").replace(/x/g, ">");
          var parts = modifiedValue6.split(">");
          var sum = 0;
          for (var i = 0; i < parts.length; i++) {
            if (i % 2 == 0) {
              // Posições ímpares na contagem começam em 0
              sum += parseInt(parts[i]);
            }
          }
          $row.find("td:eq(5)").attr("realValue", sum);
        });
      });
    }

    const isAvaliableYesOrNot = () => {
      $(".waffle tr td:nth-child(9)").each(function () {
        const disponibility = $(this).text().trim();
        $(this).parent().attr("disponibility", disponibility);
      });
    };

    const tableClassifications = () => {
      let rowsForGuide;
      if ($(".waffle tr").children.length >= 5) {
        rowsForGuide;
      } else {
        return;
      }
    };

    $(document).ready(function () {
      adicionarClassesTabela();
      isAvaliableYesOrNot();
      tableClassifications();
    });
  } catch (error) {
    console.error("Erro ao obter o HTML:", error);
  }

  const coluna3 = document.querySelectorAll("td:nth-child(2)");
  const coluna4 = document.querySelectorAll("td:nth-child(3)");

  if (coluna4.length > 1) {
    coluna4[0].innerHTML = "Seguimento";
  }

  // Filtra os elementos, excluindo o segundo filho
  const elementosFiltrados = Array.from(coluna3).filter(
    (celula, index) => index !== 1,
  );

  elementosFiltrados.forEach((celula) => {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "chk checkbox";
    if (celula.parentElement.childElementCount > 3) {
      celula.appendChild(checkbox);
    }
  });

  disableClick = () => {
    $("input[type=checkbox]").on("change", function () {
      var estaLinha = $(this);

      const specialActionButtons = document.querySelector(
        ".action-special-buttons",
      );
      if (this.checked >= 1) {
        specialActionButtons.style.display = "flex";
        setTimeout(function () {
          specialActionButtons.style.bottom = "0px";
        });
      }

      $("tr").each(function () {
        if ($(this).attr("class") !== estaLinha.closest("tr").attr("class")) {
          $(this).addClass("disableClick");
        }
      });

      if ($("input[type=checkbox]:checked").length === 0) {
        $("tr").removeClass("disableClick");
        specialActionButtons.style.bottom = "-150px";
        setTimeout(function () {
          specialActionButtons.style.display = "none";
        }, 1000);
      }
    });
  };

  disableClick();
  function saveLocalTable() {
    const tabela = document.querySelector(".ritz table.waffle");
    if (!tabela) {
      console.warn("Tabela não encontrada.");
      return;
    }

    const tabelaHTML = tabela.outerHTML;

    // Salva no sessionStorage
    sessionStorage.setItem("localTableHTML", tabelaHTML);

    console.log("Tabela salva no sessionStorage com sucesso.");
  }

  const imoveisFilterButton = document.querySelector(".imoveisFilterButton");
  const autoFilterButton = document.querySelector(".autoFilterButton");
  onlyHousesButton = document.querySelector(".only-houses");
  onlyCarsButton = document.querySelector(".only-cars");

  const introductionAnimation = document.querySelector(
    ".introduction-animation",
  );

  filterOnlyHouses = () => {
    const imoveis = document.querySelectorAll(".imovel");
    imoveis.forEach((imovel) => {
      if (imovel.classList.contains("disabled")) {
        imovel.classList.remove("disabled");
        imoveisFilterButton.style.opacity = 1;
        imoveisFilterButton.style.pointerEvents = "all";
      } else {
        imovel.remove();
        imoveisFilterButton.style.opacity = 0.5;
        imoveisFilterButton.style.pointerEvents = "none";
        onlyCarsButton.style.display = "none";
      }
    });
  };

  filterOnlyCars = () => {
    const auto = document.querySelectorAll(".auto");
    auto.forEach((auto) => {
      if (auto.classList.contains("disabled")) {
        auto.classList.remove("disabled");
        autoFilterButton.style.opacity = 1;
        autoFilterButton.style.pointerEvents = "all";
      } else {
        auto.remove();
        autoFilterButton.style.opacity = 0.5;
        autoFilterButton.style.pointerEvents = "none";
        onlyHousesButton.style.display = "none";
      }
    });
  };

  imoveisFilterButton.addEventListener("click", function () {
    saveLocalTable();
    filterOnlyCars();
    introductionAnimation.classList.add("inactive");
  });

  autoFilterButton.addEventListener("click", function () {
    saveLocalTable();
    filterOnlyHouses();
    introductionAnimation.classList.add("inactive");
  });

  function restoreLocalTable() {
    const tabelaSalva = sessionStorage.getItem("localTableHTML");
    if (!tabelaSalva) return;

    const container = document.querySelector(".ritz");
    if (container) {
      container.innerHTML = tabelaSalva;
    }
  }

  onlyCarsButton.addEventListener("click", function () {
    onlyCarsButton.style.display = "none";
    onlyHousesButton.style.display = "block";
    restoreLocalTable();
    disableClick();
    filterOnlyHouses();
    introductionAnimation.classList.add("inactive");
  });

  onlyHousesButton.addEventListener("click", function () {
    onlyHousesButton.style.display = "none";
    onlyCarsButton.style.display = "block";
    restoreLocalTable();
    disableClick();
    filterOnlyCars();
    introductionAnimation.classList.add("inactive");
  });
});
