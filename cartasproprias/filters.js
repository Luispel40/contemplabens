const activateLoadScreen = () => {
  const isLoading = document.querySelector(".isLoading");
  isLoading.style.opacity = 1;
  setTimeout(() => {
    isLoading.style.opacity = 0;
  }, 5000);
}

function formatCurrency(value) {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const displayFilters = document.querySelector(".displayFilters");
const showDisplayForEraseAllFilters = () => {
  setTimeout(function () {
    displayFilters.style.top = "0px";
    displayFilters.style.opacity = "1";
  }, 500);
};

let counters = [
  {
    creditMin: 0,
    creditMax: 0,
    entryMin: 0,
    entryMax: 0,
    partsMin: 0,
    partsMax: 0,
  },
];




const createFiltersOnTableCells = () => {
  $("tr").each(function () {
    function parseCurrency(value) {
      return parseFloat(value.replace(/\./g, "").replace(",", "."));
    }
    var cellValueForCredit = parseCurrency($(this).find("td:eq(3)").text());
    var cellValueForEntry = parseCurrency($(this).find("td:eq(4)").text());
    let cellValueForParts = parseCurrency($(this).find("td:eq(6)").text());

    if (
      !isNaN(counters[0].creditMin) &&
      !isNaN(counters[0].creditMax) &&
      !isNaN(counters[0].entryMin) &&
      !isNaN(counters[0].entryMax) &&
      !isNaN(counters[0].partsMin) &&
      !isNaN(counters[0].partsMax)
    ) {
      //filter all rows, except the ones that don't match or don't have a value
      if (
        cellValueForCredit < counters[0].creditMin && counters[0].creditMax !== 0 ||
        cellValueForCredit > counters[0].creditMax && counters[0].creditMin !== 0 ||
        cellValueForEntry < counters[0].entryMin && counters[0].entryMax !== 0 ||
        cellValueForEntry > counters[0].entryMax && counters[0].entryMin !== 0 ||
        cellValueForParts < counters[0].partsMin && counters[0].partsMax !== 0 ||
        cellValueForParts > counters[0].partsMax && counters[0].partsMin !== 0
      ) {
        $(this).hide();
      }
    }
  });
};

$(document).ready(function () {
  $("#minValue-credit, #maxValue-credit").on("input", function () {
    let minValue = parseFloat($("#minValue-credit").val());
    let maxValue = parseFloat($("#maxValue-credit").val());
    const filterButton = document.getElementById("filterBtn-credit");

    if (minValue > maxValue) {
      if ($(this).attr("id") === "minValue-credit") {
        filterButton.innerHTML = `
        Filtrar Credito <i class="fa-solid fa-circle-exclamation"></i>
        <br><span style="font-size: 12px;">O valor m&aacute;ximo deve ser maior que o valor m&iacute;nimo</span>`;
        filterButton.disabled = true;
      } else {
        filterButton.innerHTML = `
        Filtrar Credito <i class="fa-solid fa-circle-exclamation"></i>
        <br><span style="font-size: 12px;">O valor m&aacute;ximo deve ser maior que o valor m&iacute;nimo</span>`;
        filterButton.disabled = true;
      }
    } else if (minValue <= maxValue) {
      filterButton.innerHTML = `Filtrar Credito`;
      filterButton.disabled = false;
    }

    $("#minValue-credit, #maxValue-credit").on("input", function () {
      this.value = this.value.replace(/\D/g, "");
    });

    if (minValue > 10000000) {
      minValue = 10000000;
      $("#minValue-credit").val(minValue);
    }
    if (maxValue > 10000000) {
      maxValue = 10000000;
      $("#maxValue-credit").val(maxValue);
    }

    if ($(this).val() === "") {
      $(this).val(0);
      $("#minValueDisplay-credit").text(formatCurrency(0));
      $("#maxValueDisplay-credit").text(formatCurrency(0));
    }
    $("#minValueDisplay-credit").text(formatCurrency(minValue));
    $("#maxValueDisplay-credit").text(formatCurrency(maxValue));
  });

  $("#filterBtn-credit").click(function () {
    activateLoadScreen();
    showDisplayForEraseAllFilters();
    counters[0].creditMin = parseFloat($("#minValue-credit").val());
    counters[0].creditMax = parseFloat($("#maxValue-credit").val());
    console.log(counters);

    $("tr").each(function () {

      createFiltersOnTableCells();
    });
  });

  $("#minValue-entry, #maxValue-entry").on("input", function () {
    var minValue = parseFloat($("#minValue-entry").val());
    var maxValue = parseFloat($("#maxValue-entry").val());
    const filterButtonEntry = document.getElementById("filterBtn-entry");

    if (minValue > maxValue) {
      if ($(this).attr("id") === "minValue-entry") {
        filterButtonEntry.innerHTML = `Filtrar Entrada <i class="fa-solid fa-circle-exclamation"></i>
        <br><span style="font-size: 12px;">O valor m&aacute;ximo deve ser maior que o valor m&iacute;nimo</span>`;
        filterButtonEntry.disabled = true;
      } else {
        filterButtonEntry.innerHTML = `Filtrar Entrada <i class="fa-solid fa-circle-exclamation"></i>
        <br><span style="font-size: 12px;">O valor m&aacute;ximo deve ser maior que o valor m&iacute;nimo</span>`;
        filterButtonEntry.disabled = true;
      }
    } else if (minValue <= maxValue) {
      filterButtonEntry.innerHTML = `Filtrar Entrada`;
      filterButtonEntry.disabled = false;
    }

    if (minValue > 5000000) {
      minValue = 5000000;
      $("#minValue-entry").val(minValue);
    }
    if (maxValue > 5000000) {
      maxValue = 5000000;
      $("#maxValue-entry").val(maxValue);
    }

    if ($(this).val() === "") {
      $(this).val(0);
      $("#minValueDisplay-entry").text(formatCurrency(0));
      $("#maxValueDisplay-entry").text(formatCurrency(0));
    }
    $("#minValueDisplay-entry").text(formatCurrency(minValue));
    $("#maxValueDisplay-entry").text(formatCurrency(maxValue));
  });

  $("#filterBtn-entry").click(function () {
    activateLoadScreen();
    showDisplayForEraseAllFilters();
    counters[0].entryMin = parseFloat($("#minValue-entry").val());
    counters[0].entryMax = parseFloat($("#maxValue-entry").val());
    console.log(counters);

    $("tr").each(function () {
      function parseCurrency(value) {
        return parseFloat(value.replace(/\./g, "").replace(",", "."));
      }
      createFiltersOnTableCells();
    });
  });

  $("#minValue-parts, #maxValue-parts").on("input", function () {
    var minValue = parseFloat($("#minValue-parts").val());
    var maxValue = parseFloat($("#maxValue-parts").val());
    const filterButtonParts = document.getElementById("filterBtn-parts");

    if (minValue > maxValue) {
      if ($(this).attr("id") === "minValue-parts") {
        filterButtonParts.innerHTML = `Filtrar Parcelas <i class="fa-solid fa-circle-exclamation"></i>
        <br><span style="font-size: 12px;">O valor m&aacute;ximo deve ser maior que o valor m&iacute;nimo</span>`;
        filterButtonParts.disabled = true;
      } else {
        filterButtonParts.innerHTML = `Filtrar Parcelas <i class="fa-solid fa-circle-exclamation"></i>
        <br><span style="font-size: 12px;">O valor m&aacute;ximo deve ser maior que o valor m&iacute;nimo</span>`;
        filterButtonParts.disabled = true;
      }
    } else if (minValue <= maxValue) {
      filterButtonParts.innerHTML = `Filtrar Parcelas`;
      filterButtonParts.disabled = false;
    }
    //pontuar input automaticamente
    $("#minValue-parts, #maxValue-parts").on("input", function () {
      this.value = this.value.replace(/\D/g, "");
    });
    if (minValue > 300000) {
      minValue = 300000;
      $("#minValue-parts").val(minValue);
    }
    if (maxValue > 300000) {
      maxValue = 300000;
      $("#maxValue-parts").val(maxValue);
    }

    if ($(this).val() === "") {
      $(this).val(0);
      $("#minValueDisplay-parts").text(formatCurrency(0));
      $("#maxValueDisplay-parts").text(formatCurrency(0));
    }
    $("#minValueDisplay-parts").text(formatCurrency(minValue));
    $("#maxValueDisplay-parts").text(formatCurrency(maxValue));
  });

  $("#filterBtn-parts").click(function () {
    activateLoadScreen();
    showDisplayForEraseAllFilters();
    counters[0].partsMin = parseFloat($("#minValue-parts").val());
    counters[0].partsMax = parseFloat($("#maxValue-parts").val());
    console.log(counters); 

    $("tr").each(function () {
      const realValueAttr = $(this).find("td:eq(6)").attr("data-real-value");
      cellValueForParts = parseFloat(
        $(this).find("td:eq(6)").text() || (realValueAttr ? realValueAttr.trim() : '')
      );

      createFiltersOnTableCells();
    });
  });

  const allInputs = document.querySelectorAll(
    "input:not(input[type='checkbox']), #searchInput"
  );

  allInputs.forEach((input) => {
    input.addEventListener("input", function () {
      showDisplayForEraseAllFilters();

      if ($(this).val() === "0") {
        $(this).val("");
      }
    });
  });

  const resetCounters = () => {
    counters[0].entryMin = 0;
    counters[0].entryMax = 0;
    counters[0].creditMin = 0;
    counters[0].creditMax = 0;
    counters[0].partsMin = 0;
    counters[0].partsMax = 0;
  };

  const eraseAllFilters = document.getElementById("eraseAllFilters");

  eraseAllFilters.addEventListener("click", function () {
    allInputs.forEach((input) => {
      input.value = "";
    });

    resetCounters();
    console.log(counters);

    const cellHide = document.querySelectorAll("tr:not(.demarcation)");
    cellHide.forEach((cell) => {
      cell.style.display = "table-row";
    });

    const imoveisFilterButton = document.querySelector(".imoveisFilterButton");
    const autoFilterButton = document.querySelector(".autoFilterButton");

    imoveisFilterButton.style.opacity = 1;
    imoveisFilterButton.style.pointerEvents = "all";
    autoFilterButton.style.opacity = 1;
    autoFilterButton.style.pointerEvents = "all";

    this.parentElement.style.top = "-150px";
    this.parentElement.style.opacity = 0;
  });
});

