console.log("olá!");
console.log("Link de tiles para LealLet: https://leaflet-extras.github.io/leaflet-providers/preview/");

let coordenadas = [];
let trechos = [];
let pagamentos = [];


obterDados();
async function obterDados() {
    const resposta = await fetch('2023_Trecho.csv');
    const dadosBrutos = await resposta.text();
    const dados = dadosBrutos.replaceAll('"', '');
    const linhas = dados.split('\n').slice(1);

    linhas.forEach(elemento => {
        const linha = elemento.split(';');
        const id = parseInt(linha[0]);

        trechos.push({
            'identidade': id,
            'origemData': linha[3],
            'origemPais': linha[4],
            'origemUF': linha[5],
            'origemCidade': linha[6],
            'destinoPais': linha[8],
            'destinoUF': linha[9],
            'destinoCidade': linha[10],
            'meioTransporte': linha[11].toLowerCase()
        });
    });

    carregarLatLong();


}


cruzarDados();
////////////////
async function cruzarDados() {
    const resposta = await fetch('2023_Pagamento.csv');
    const dadosBrutos = await resposta.text();
    const dados = dadosBrutos.replaceAll('"', '');
    const linhas = dados.split('\n').slice(1);

    linhas.forEach(elemento => {
        const linha = elemento.split(';');
        const id = parseInt(linha[0]);



        pagamentos.push({
            'identidade': id,
            'nomeOrgao': linha[3],
            'nomePagador': linha[5],
            'nomeUnidade': linha[7]
        });
    });
}
////////////////
async function carregarLatLong() {
    const respostaLatLong = await fetch('coord.json');
    const dadosLatLong = await respostaLatLong.json();
    coordenadas = dadosLatLong;
    carregarMapa();
}

function carregarMapa() {
    // let mapa = L.map('itemMapa').setView([coordenadas[0].latDestino, coordenadas[0].longDestino], 4);
    // //https://api.mapbox.com/styles/v1/{id}/clclftyg2001w14t2egqu4grf/wmts?access_token={accessToken}        

    // let tilesMap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //     maxZoom: 19,
    //     attribution: '© OpenStreetMap'
    // });
    // tilesMap.addTo(mapa);

    ////////////

    //https://api.mapbox.com/styles/v1/arturvc/clcnc0iwi00oy14s1oo4b5v68/wmts?access_token=pk.eyJ1IjoiYXJ0dXJ2YyIsImEiOiJjamVzaXNhaDUwM2dzMnFwa3A2MndjemJ6In0.QkEbXr54ao40qL9I1DuW0g/draft

    const mapa = L.map('itemMapa').setView([-15.7934036, -47.8823172], 4);
    const urlOSM = 'https://api.mapbox.com/styles/v1/{id}/tiles/256/{z}/{x}/{y}?access_token={accessToken}';
    const tilesMap = L.tileLayer(urlOSM, {
        attribution: 'Map data &copy;  <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: MAPBOX_ID,
        accessToken: MAPBOX_API
    });
    tilesMap.addTo(mapa);
    ///////////


    ///////////
    let tam = 28;
    const iconeOrigem = L.icon({
        iconUrl: 'i_origem.png',
        iconSize: [tam / 2, tam / 2], // size of the icon
        iconAnchor: [8, 8], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -tam] // point from which the popup should open relative to the iconAnchor
    });

    const iconeAereo = L.icon({
        iconUrl: 'i_aereo.png',
        iconSize: [tam, tam], // size of the icon
        iconAnchor: [tam, tam], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -tam] // point from which the popup should open relative to the iconAnchor
    });

    const iconeRodoviario = L.icon({
        iconUrl: 'i_rodoviario.png',
        iconSize: [tam, tam], // size of the icon
        iconAnchor: [tam, tam], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -tam] // point from which the popup should open relative to the iconAnchor
    });

    const iconeVeiOficial = L.icon({
        iconUrl: 'i_veiculoOficial.png',
        iconSize: [tam, 21], // size of the icon
        iconAnchor: [tam, 21], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -21] // point from which the popup should open relative to the iconAnchor
    });

    const iconeVeiProprio = L.icon({
        iconUrl: 'i_veiculoProprio.png',
        iconSize: [tam, 16], // size of the icon
        iconAnchor: [tam, 16], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -16] // point from which the popup should open relative to the iconAnchor
    });

    const iconeInvalido = L.icon({
        iconUrl: 'i_invalido.png',
        iconSize: [tam, tam], // size of the icon
        iconAnchor: [0, tam], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -tam] // point from which the popup should open relative to the iconAnchor
    });


    //////////
    for (let i = 0; i < trechos.length; i++) {
        for (let j = 0; j < pagamentos.length; j++) {
            if (pagamentos[j].identidade == trechos[i].identidade) {
                trechos[i].nomeOrgao = pagamentos[j].nomeOrgao;
                //trechos[i].nomePagador = pagamentos[j].nomePagador;
                // trechos[i].nomeUnidade = pagamentos[j].nomeUnidade;
                break;
            }
        }
    }
    //console.log(trechos);


    for (let i = 0; i < trechos.length; i++) {

        let latO = coordenadas[i].latOrigem + Math.random(1) / 50;
        let lonO = coordenadas[i].longOrigem + Math.random(1) / 50;
        let latD = coordenadas[i].latDestino + Math.random(1) / 50;
        let lonD = coordenadas[i].longDestino + Math.random(1) / 50;

        if (trechos[i].nomeOrgao == undefined) {
            trechos[i].nomeOrgao = " - ";
            //trechos[i].nomePagador = " - ";
            //trechos[i].nomeUnidade = " - ";
        }


        let txtOrigem = trechos[i].origemData + "<br> Origem: <strong>" + trechos[i].origemCidade + " - " + trechos[i].origemUF + " - " + trechos[i].origemPais +  "</strong> <br> Destino: " + trechos[i].destinoCidade + " - " + trechos[i].destinoUF + " - " + trechos[i].destinoPais + "<br> Meio de transporte: " + trechos[i].meioTransporte + "<br> Processo nº: " + trechos[i].identidade + "<br>" + trechos[i].nomeOrgao;

        let txtDestino = trechos[i].origemData + "<br> Origem: " + trechos[i].origemCidade + " - " + trechos[i].origemUF + " - " + trechos[i].origemPais + "<br> Destino: <strong>" + trechos[i].destinoCidade + " - " + trechos[i].destinoUF + " - " + trechos[i].destinoPais + "</strong> <br> Meio de transporte: " + trechos[i].meioTransporte + "<br> Processo nº: " + trechos[i].identidade + "<br>" + trechos[i].nomeOrgao;

        let markerOrigem = L.marker([latO, lonO], {
                icon: iconeOrigem
            })
            .bindPopup(txtOrigem)
            .addTo(mapa);

        /////////////////////////


        let markerDestino = new L.marker;



        switch (trechos[i].meioTransporte) {
            case "aéreo":
                markerDestino = L.marker([latD, lonD], {
                        icon: iconeAereo
                    }).bindPopup(txtDestino)
                    .addTo(mapa);
                break;
            case "inválido":
                markerDestino = L.marker([latD, lonD], {
                        icon: iconeInvalido
                    }).bindPopup(txtDestino)
                    .addTo(mapa);
                break;
            case "rodoviário":
                markerDestino = L.marker([latD, lonD], {
                        icon: iconeRodoviario
                    }).bindPopup(txtDestino)
                    .addTo(mapa);
                break;
            case "veículo oficial":
                markerDestino = L.marker([latD, lonD], {
                        icon: iconeVeiOficial
                    }).bindPopup(txtDestino)
                    .addTo(mapa);
                break;
            case "veículo próprio":
                markerDestino = L.marker([latD, lonD], {
                        icon: iconeVeiProprio
                    }).bindPopup(txtDestino)
                    .addTo(mapa);
                break;
            default:
                markerDestino = L.marker([latD, lonD], {
                        icon: iconeOrigem
                    }).bindPopup(txtDestino)
                    .addTo(mapa);
                break;
        }




        arquear(latO, lonO, latD, lonD);

        // let linha = L.polyline([
        //     [latO, lonO],
        //     [latD, lonD]
        // ], {
        //     color: 'gray'
        // }).addTo(mapa);



    }

    function arquear(laOr, loOr, laDe, loDe) {

        // Dica de @ryancatalani: https://gist.github.com/ryancatalani/6091e50bf756088bf9bf5de2017b32e6
        // Plugin https://github.com/elfalem/Leaflet.curve
        var latlngs = [];

        var latlng1 = [laOr, loOr],
            latlng2 = [laDe, loDe];

        var offsetX = latlng2[1] - latlng1[1],
            offsetY = latlng2[0] - latlng1[0];

        var r = Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2)),
            theta = Math.atan2(offsetY, offsetX);

        var thetaOffset = (3.14 / 10);

        var r2 = (r / 2) / (Math.cos(thetaOffset)),
            theta2 = theta + thetaOffset;

        var midpointX = (r2 * Math.cos(theta2)) + latlng1[1],
            midpointY = (r2 * Math.sin(theta2)) + latlng1[0];

        var midpointLatLng = [midpointY, midpointX];

        latlngs.push(latlng1, midpointLatLng, latlng2);

        var pathOptions = {
            color: 'rgba(255,255,255,0.5)',
            weight: 3
        }

        // if (typeof document.getElementById('itemMapa').animate === "function") {
        //     var durationBase = 2000;
        //     var duration = Math.sqrt(Math.log(r)) * durationBase;
        //     // Scales the animation duration so that it's related to the line length
        //     // (but such that the longest and shortest lines' durations are not too different).
        //     // You may want to use a different scaling factor.
        //     pathOptions.animate = {
        //         duration: duration,
        //         iterations: Infinity,
        //         easing: 'ease-in-out',
        //         direction: 'alternate'
        //     }
        // }

        var curvedPath = L.curve(
            [
                'M', latlng1,
                'Q', midpointLatLng,
                latlng2
            ], pathOptions).addTo(mapa);
    }
    ///////////////////


}


// https://portaldatransparencia.gov.br/download-de-dados/viagens
// https://www.portaldatransparencia.gov.br/pagina-interna/603364-dicion%C3%A1rio-de-dados-viagens-a-Servi%C3%A7o-Pagamentos


/*
  let popup = L.popup();

  function onMapClick(e) {
      popup
          .setLatLng(e.latlng)
          .setContent("Você clicou aqui " + e.latlng.toString())
          .openOn(mapa);
  }

  mapa.on('click', onMapClick);
  */