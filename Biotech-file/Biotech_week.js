let day;
    switch (new Date().getDay()) {
      case 0:
        day = "buona domenica!";
        break;
      case 1:
        day = "buon lunedì!";
        break;
      case 2:
        day = "buon martedì!";
        break;
      case 3:
        day = "buon mercoledì!";
        break;
      case 4:
        day = "buon giovedì!";
        break;
      case 5:
        day = "buon venerdì!";
        break;
      case  6:
        day = "buon sabato!";
    }
    document.getElementById("week").innerHTML = "Biotech Project vi augura " + day;