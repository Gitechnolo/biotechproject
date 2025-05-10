// imposta le variabili globali per l'identificazione del
        // browser
        
        browser navigator.appName;
        browserNum parseInt(navigator.appVersion);
        N4 false;
        NE false;
        IE false;

        if ((browser== "Netscape") && (browserNum < 5))
        {
           // Netscape 4.x
        layerRef "document.layers['";        
        endLayerRef= "']";
        styleRef = "";
        N4 = true;
        
        }
        else if ((browser "Netscape") && (browserNum >= 5))
        {
        // Netscape 6
        layerRef = "document.getElementById('"; 
        styleRef = ".style";
        endLayerRef = "')";
        N6 = true;
        }      
        else
        {
        // Internet Explorer
        layerRef = "document.all['";
        endLayerRef = "']";
        styleRef = ".style";
        IE = true;
        }
        // crea un modo per memorizzare quale livello è visibile oldLayer = "none";
        // imposta le variabili per l'animazione
        initialTop = 120;
        newTop = initialTop;
        function showMenu (layerName)
        {
        // mostra il livello che l'utente desidera vedere
        eval (layerRef + layerName + endLayerRef + styleRef + ".visibility = 'visible'");
        // sposta l'altra finestra
        if (oldLayer != "none")
        {
        // modifica gli z-index dei livelli per
        // posizionare
        // il nuovo menu sopra il vecchio menu
        eval(layerRef + layerName + endLayerRef + styleRef + ".zIndex = 11");
        eval(layerRef + oldLayer + endLayerRef + styleRef + ". zIndex = 10");
        // fa scorrere il vecchio menu verso l'alto
        // e lo nasconde
        slideMenu(oldLayer);
        }
        // aggiorna la finestra attualmente visibile
        if (oldLayer == layerName)
        {
        oldLayer = "none";
        }
        else
        {
        oldLayer = layerName;
          }
        }
        function slideMenu (layerName)
        {
        // trova l'altezza del livello
        if (N4)
        {
        height = eval (layerRef + layerName + endLayerRef + ".clip.height");
        }
        else
        {
        height = eval(layerRef + layerName + endLayerRef + ".offsetHeight");
        }
        // esegue l'animazione del livello verso l'alto
        moveLayer(layerName,height);
        return;
        }

        function moveLayer(layerName, height)
        
        {
        // newTop e initialTop sono variabili globali,
        // impostate in precedenza
        endTop = initialTop - height;
        newHeight = height - newTop;
        
        if (newTop > endTop)
        {
        // sposta di nuovo il livello
        newTop = newTop - 20;
        eval(layerRef + layerName + endLayerRef + styleRef + ".top = " + newTop);  
        }
        else
        {
        // nasconde il vecchio menu e reimposta la
        //sua posizione
        eval(layerRef + layerName + endLayerRef + styleRef + ".visibility = 'hidden'");
        eval(layerRef + layerName + endLayerRef + styleRef  + ".top = " + initialTop);
        // reimposta la variabile globale in preparazione
        // del prossimo menu
        newTop = initialTop;
        return;
        }
        // attende un istante, quindi esegue di nuovo la
        // chiamata alla funzione
        setTimeout("moveLayer('" + layerName + "'," + height + ")",1);        
        }