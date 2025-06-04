// Aguarda o carregamento completo do DOM
document.addEventListener("DOMContentLoaded", async function () {
  const introductionAnimation = document.querySelector(
    ".introduction-animation"
  );

  setTimeout(function () {
    introductionAnimation.animate(
      [{ transform: "translateY(0)" }, { transform: "translateY(-100%)" }],
      {
        duration: 1000,
        fill: "forwards",
      }
    );
  }, 2000);

  setTimeout(function () {
    introductionAnimation.remove();
  }, 3000);

  // Função para recarregar o CSS com um parâmetro de "cache busting"
  function reloadCSS() {
    const link = document.getElementById("dynamic-css");
    const baseHref = "style.css";
    const timestamp = new Date().getTime();

    link.href = `${baseHref}?v=${timestamp}`;
  }

  reloadCSS();

  try {
    const response = await fetch(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vTfaFHS3UiNr1svMNMWPgUYsP9Dvcv40S_pSkYp1SQgTAjnYVEDgw2E4VSldyFolAv2BzimJmIwapJ2/pubhtml?gid=0&single=true"
    );
    const html = await response.text();

    const tempElement = document.createElement("div");
    tempElement.innerHTML = html;
    const elementoRitz = tempElement.querySelector(".ritz");

    const paiDaTabela = document.querySelector(".tabela");
    paiDaTabela.appendChild(elementoRitz);

    var rows = document.querySelectorAll(".waffle tr");

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
          var oldPrazo = $(this).closest("tr").find("td:eq(5)").text();
          var oldParcelas = $(this)
            .closest("tr")
            .find("td:eq(6)")
            .text()
            .replace("junção", "")
            .replace("R$", "")
            .replace("sendo", "");

          // Adiciona "+" depois dos dois números após uma vírgula, se necessário
          var decimalpadron = /(\d{1},\d{2})(?![\d,]*\+)/g;
          oldParcelas = oldParcelas.replace(
            decimalpadron,
            function (match, p1) {
              var index = oldParcelas.indexOf(match) + match.length;
              if (
                index < oldParcelas.length &&
                !oldParcelas.includes("+", index)
              ) {
                return match + "+";
              }
              return match;
            }
          );

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
          textoInterno.replace(/\s+/g, "")
        );
        var classePrimeiraCelula = normalizeText(
          textoInterno2.replace(/\s+/g, "")
        );

        $(this).addClass(classeSegundaCelula);
        $(this).addClass(classePrimeiraCelula);

        console.log(primeiraCelula.text());

        if (primeiraCelula.text() == "Imovel") {
          primeiraCelula.html(`<i class="fa-solid fa-house"></i>`);
        } else if (primeiraCelula.text() == "Auto") {
          primeiraCelula.html(`<i class="fa-solid fa-car"></i>`);
        } else if (primeiraCelula.text() == "Seguimento") {
          primeiraCelula.html(`<i class="fa-solid fa-gears"></i>`);
        }

        // Verifica a célula na posição 6 para adicionar o atributo "data-value"
        var sextaCelula = $(this).find("td:eq(6)");
        var textoSextaCelula = sextaCelula.text().trim();

        // Adiciona "+" depois dos dois números após uma vírgula, se necessário
        var decimalPattern = /(\d{1},\d{2})(?![\d,]*\+)/g; // Padrão para encontrar dois números depois de uma vírgula
        textoSextaCelula = textoSextaCelula.replace(
          decimalPattern,
          function (match, p1) {
            // Verifica se há mais números após os dois números decimais e se não há um "+"
            var index = textoSextaCelula.indexOf(match) + match.length;
            if (
              index < textoSextaCelula.length &&
              !textoSextaCelula.includes("+", index)
            ) {
              return match + "+";
            }
            return match;
          }
        );

        sextaCelula.text(textoSextaCelula); // Atualiza o texto da célula

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
      $(".waffle tr td:nth-child(12)").each(function () {
        const disponibility = $(this).text().trim();
        $(this).parent().attr("disponibility", disponibility);
      });
    };

    const tableClassifications = () => {
      let rowsForGuide;
      if ($(".waffle tr").children.length >= 5) {
        rowsForGuide;
        console.log(rowsForGuide);
      } else {
        return;
      }
    };

    // Chama a função para adicionar classes e atributos quando o documento estiver pronto
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
  const coluna5 = document.querySelectorAll("td:nth-child(4)");

  // Inserir o texto "Seguimento" na célula da coluna 3 da linha 1
  if (coluna4.length > 1) {
    // Verificar se há pelo menos 2 elementos na coluna4
    coluna4[0].innerHTML = "Seguimento";
  }

  // Filtra os elementos, excluindo o segundo filho
  const elementosFiltrados = Array.from(coluna3).filter(
    (celula, index) => index !== 1
  );

  elementosFiltrados.forEach((celula) => {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "chk checkbox";
    if (celula.parentElement.childElementCount > 3) {
      celula.appendChild(checkbox);
    }
  });

  $("input[type=checkbox]").on("change", function () {
    var checks = $("input[type=checkbox]:checked");
    var estaLinha = $(this);
    var deselectAll = document;

    const specialActionButtons = document.querySelector(
      ".action-special-buttons"
    );
    if (this.checked >= 1) {
      specialActionButtons.style.display = "flex";
      setTimeout(function () {
        specialActionButtons.style.bottom = "0px";
      });
    }

    // Adicionar classe "disableClick" às linhas que não têm a mesma classe da linha pai
    $("tr").each(function () {
      if ($(this).attr("class") !== estaLinha.closest("tr").attr("class")) {
        $(this).addClass("disableClick");
      }
    });

    // Remover classe "disableClick" de todas as linhas quando nenhum checkbox estiver marcado
    if ($("input[type=checkbox]:checked").length === 0) {
      $("tr").removeClass("disableClick");
      specialActionButtons.style.bottom = "-150px";
      setTimeout(function () {
        specialActionButtons.style.display = "none";
      }, 1000);
    }
  });

  const imoveisFilterButton = document.querySelector(".imoveisFilterButton");
  const autoFilterButton = document.querySelector(".autoFilterButton");
  const tipeOfProperty = document.querySelector(".tipeOfProperty");

  imoveisFilterButton.addEventListener("click", function () {
    const auto = document.querySelectorAll(".auto");
    const imoveis = document.querySelectorAll(".imovel");
    auto.forEach((auto) => {
      if (auto.classList.contains("disabled")) {
        auto.classList.remove("disabled");
        autoFilterButton.style.opacity = 1;
        autoFilterButton.style.pointerEvents = "all";
        tipeOfProperty.innerHTML = "Selecione o tipo:";
      } else {
        auto.classList.add("disabled");
        autoFilterButton.style.opacity = 0.5;
        autoFilterButton.style.pointerEvents = "none";
        tipeOfProperty.innerHTML = "Somente imóveis:";
      }
    });
  });

  autoFilterButton.addEventListener("click", function () {
    const imoveis = document.querySelectorAll(".imovel");
    imoveis.forEach((imovel) => {
      if (imovel.classList.contains("disabled")) {
        imovel.classList.remove("disabled");
        imoveisFilterButton.style.opacity = 1;
        imoveisFilterButton.style.pointerEvents = "all";
        tipeOfProperty.innerHTML = "Selecione o tipo:";
      } else {
        imovel.classList.add("disabled");
        imoveisFilterButton.style.opacity = 0.5;
        imoveisFilterButton.style.pointerEvents = "none";
        tipeOfProperty.innerHTML = "Somente automóveis:";
      }
    });
  });
});
