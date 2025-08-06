// Market trend graph with forecast (storico + previsione)
            const ctx = document.getElementById('marketGraph').getContext('2d');
            // Dati storici (2017-2023)
            const data = [120, 135, 150, 170, 160, 180, 210];
            // Previsioni (per il 2028)
            const forecast = [230, 250, 270, 300, 340, 380];
            ctx.clearRect(0, 0, 500, 220);
            ctx.fillStyle = "#1a1a1a";
            ctx.fillRect(0, 0, 500, 220);

            // Dati storici (bianco #e7e7e7)
            ctx.strokeStyle = "#e7e7e7";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(30, 200 - data[0]);
            for(let i=1; i<data.length; i++){
              ctx.lineTo(30 + i*40, 200 - data[i]);
            }
            ctx.stroke();

            // Previsioni (verde #00ff55)
            ctx.save();
            ctx.setLineDash([8, 6]);
            ctx.strokeStyle = "#00ff55";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(30 + (data.length-1)*40, 200 - data[data.length-1]);
            for(let i=0; i<forecast.length; i++){
              ctx.lineTo(30 + (data.length + i)*40, 200 - forecast[i]);
            }
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.restore();

            // Punti previsione (verde)
            ctx.fillStyle = "#00ff55";
            for(let i=0; i<forecast.length; i++){
              ctx.beginPath();
              ctx.arc(30 + (data.length + i)*40, 200 - forecast[i], 4, 0, 2*Math.PI);
              ctx.fill();
            }

            // Punti storico (bianco)
            ctx.fillStyle = "#e7e7e7";
            for(let i=0; i<data.length; i++){
              ctx.beginPath();
              ctx.arc(30 + i*40, 200 - data[i], 4, 0, 2*Math.PI);
              ctx.fill();
            }

            // Etichette
            ctx.fillStyle = "#e7e7e7";
            ctx.font = "bold 16px monospace";
            ctx.fillText("Crescita Mercato Cibernetica", 80, 30);
            ctx.font = "12px monospace";
            // Anni asse X
            const years = [
              "2017","2018","2019","2020","2021","2022","2023",
              "2024","2025","2026","2027","2028"
            ];
            for(let i=0; i<data.length+forecast.length; i++){
              ctx.fillStyle = i < data.length ? "#e7e7e7" : "#00ff55";
              ctx.fillText(years[i], 30 + i*40, 215);
            }
            // Etichetta asse Y
            ctx.fillStyle = "#e7e7e7";
            ctx.fillText("Valore", 2, 15);

            // Legenda 
            // Storico
            ctx.fillStyle = "#e7e7e7";
            ctx.fillRect(340, 40, 18, 4);
            ctx.fillText("Storico", 365, 46);
            // Previsione
            ctx.strokeStyle = "#00ff55";
            ctx.setLineDash([8, 6]);
            ctx.beginPath();
            ctx.moveTo(340, 60);
            ctx.lineTo(358, 60);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = "#00ff55";
            ctx.fillText("Previsione", 365, 65);

            // Indicazione grafica 
            ctx.font = "italic 13px monospace";
            ctx.fillStyle = "#00ff55";
            ctx.fillText("Previsioni per il 2028", 320, 90);