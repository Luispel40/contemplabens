function formatCurrency(value) {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

$(document).ready(function () {
  $("#minValue-credit, #maxValue-credit").on("input", function () {
    var minValue = parseFloat($("#minValue-credit").val());
    var maxValue = parseFloat($("#maxValue-credit").val());

     if (minValue > maxValue) {
      if ($(this).attr("id") === "minValue-credit") {
        $("#maxValue-credit").val(minValue);
        maxValue = minValue;
      } else {
        $("#minValue-credit").val(maxValue);
        minValue = maxValue;
      }
    }

    if (minValue > 10000000) {
      minValue = 10000000;
      $("#minValue-credit").val(minValue);
    }
    if (maxValue > 10000000) {
      maxValue = 10000000;
      $("#maxValue-credit").val(maxValue);
    }

    

    $("#minValueDisplay-credit").text(formatCurrency(minValue));
    $("#maxValueDisplay-credit").text(formatCurrency(maxValue));
  });

  $("#filterBtn-credit").click(function () {
    var minValue = parseFloat($("#minValue-credit").val());
    var maxValue = parseFloat($("#maxValue-credit").val());
    console.log(minValue, maxValue);

    $("tr").each(function () {
      function parseCurrency(value) {
        return parseFloat(value.replace(/\./g, "").replace(",", "."));
      }
      var cellValue = parseCurrency($(this).find("td:eq(3)").text());

      if (!isNaN(minValue) && !isNaN(maxValue)) {
        if (cellValue < minValue || cellValue > maxValue) {
          $(this).hide();
        } else {
          $(this).show();
        }
      }
    });
  });

  $("#minValue-entry, #maxValue-entry").on("input", function () {
    var minValue = parseCurrency($("#minValue-entry").val());
    var maxValue = parseCurrency($("#maxValue-entry").val());

    if (minValue > maxValue) {
      if ($(this).attr("id") === "minValue-entry") {
        $("#maxValue-entry").val(minValue);
        maxValue = minValue;
      } else {
        $("#minValue-entry").val(maxValue);
        minValue = maxValue;
      }
    }

    if (minValue > 5000000) {
      minValue = 5000000;
      $("#minValue-entry").val(minValue);
    }
    if (maxValue > 5000000) {
      maxValue = 5000000;
      $("#maxValue-entry").val(maxValue);
    }

    $("#minValueDisplay-entry").text(formatCurrency(minValue));
    $("#maxValueDisplay-entry").text(formatCurrency(maxValue));
  });

  $("#filterBtn-entry").click(function () {
    var minValue = parseFloat($("#minValue-entry").val());
    var maxValue = parseFloat($("#maxValue-entry").val());

    $("tr").each(function () {
      function parseCurrency(value) {
        return parseFloat(value.replace(/\./g, "").replace(",", "."));
      }
      var cellValue = parseCurrency($(this).find("td:eq(4)").text());

      if (!isNaN(minValue) && !isNaN(maxValue)) {
        if (cellValue < minValue || cellValue > maxValue) {
          $(this).hide();
        } else {
          $(this).show();
        }
      }
    });
  });

  $("#minValue-parts, #maxValue-parts").on("input", function () {
    var minValue = parseFloat($("#minValue-parts").val());
    var maxValue = parseFloat($("#maxValue-parts").val());

     if (minValue > maxValue) {
      if ($(this).attr("id") === "minValue-parts") {
        $("#maxValue-parts").val(minValue);
        maxValue = minValue;
      } else {
        $("#minValue-parts").val(maxValue);
        minValue = maxValue;
      }
    }

    if (minValue > 300) {
      minValue = 300;
      $("#minValue-parts").val(minValue);
    }
    if (maxValue > 300) {
      maxValue = 300;
      $("#maxValue-parts").val(maxValue);
    }

    $("#minValueDisplay-parts").text(minValue);
    $("#maxValueDisplay-parts").text(maxValue);
  });

  $("#filterBtn-parts").click(function () {
    var minValue = parseFloat($("#minValue-parts").val());
    var maxValue = parseFloat($("#maxValue-parts").val());
    console.log(minValue, maxValue);

    $("tr").each(function () {
      function parseCurrency(value) {
        return parseFloat(value.replace(/\./g, "").replace(",", "."));
      }
      var cellValue = Number($(this).find("td:eq(5)").text());

      if (!isNaN(minValue) && !isNaN(maxValue)) {
        if (cellValue < minValue || cellValue > maxValue) {
          $(this).hide();
        } else {
          $(this).show();
        }
      }
    });
  });
});
