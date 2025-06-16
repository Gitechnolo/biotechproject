let day;
    switch (new Date().getDay()) {
      case 0:
        day = "buona domenica!";
        break;
      case 1:
        day = "<span style='--i:26'>b</span><span style='--i:27'>u</span><span style='--i:28'>o</span><span style='--i:29'>n</span><span style='--i:30'>&nbsp;</span><span style='--i:31'>l</span><span style='--i:32'>u</span><span style='--i:33'>n</span><span style='--i:34'>e</span><span style='--i:35'>d</span><span style='--i:36'>ì</span><span style='--i:37'>!</span>";
        break;
      case 2:
        day = "<span style='--i:26'>b</span><span style='--i:27'>u</span><span style='--i:28'>o</span><span style='--i:29'>n</span><span style='--i:30'>&nbsp;</span><span style='--i:31'>m</span><span style='--i:32'>a</span><span style='--i:33'>r</span><span style='--i:34'>t</span><span style='--i:35'>e</span><span style='--i:36'>d</span><span style='--i:37'>ì</span><span style='--i:38'>!</span>";
        break;
      case 3:
        day = "<span style='--i:26'>b</span><span style='--i:27'>u</span><span style='--i:28'>o</span><span style='--i:29'>n</span><span style='--i:30'>&nbsp;</span><span style='--i:31'>m</span><span style='--i:32'>e</span><span style='--i:33'>r</span><span style='--i:34'>c</span><span style='--i:35'>o</span><span style='--i:36'>l</span><span style='--i:37'>e</span><span style='--i:38'>d</span><span style='--i:39'>ì</span><span style='--i:40'>!</span>";
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
    document.getElementById("week").innerHTML = "<span style='--i:1'>B</span><span style='--i:2'>i</span><span style='--i:3'>o</span><span style='--i:4'>t</span><span style='--i:5'>e</span><span style='--i:6'>c</span><span style='--i:7'>h</span><span style='--i:8'>&nbsp;</span><span style='--i:9'>P</span><span style='--i:10'>r</span><span style='--i:11'>o</span><span style='--i:12'>j</span><span style='--i:13'>e</span><span style='--i:14'>c</span><span style='--i:15'>t</span><span style='--i:16'>&nbsp;</span><span style='--i:17'>v</span><span style='--i:18'>i</span><span style='--i:19'>&nbsp;</span><span style='--i:20'>a</span><span style='--i:21'>u</span><span style='--i:22'>g</span><span style='--i:23'>u</span><span style='--i:24'>r</span><span style='--i:25'>a</span> " + day;