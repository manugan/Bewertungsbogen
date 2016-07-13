/**
 * Created by Manuel Garni on 13.07.16.
 */
"use strict";
/*
 * Globale Namespacess
 */
//var Kriterien = Kriterien || {};


/* relativer Serverpfad zu JSON Handler */
var linkToServer = "/kriterienListe.json";

/* Kriterien abrufen und anzeigen */
Kriterien.listeAbrufen();

/**
 * Kriterien
 * zum direkten Abruf aller Kriterien bei Website Aufruf
 * @type {{liste: Array, listeAbrufen: Kriterien.listeAbrufen, listeAnzeigen: Kriterien.listeAnzeigen}}
 */
Kriterien = {
    listeFachgespraech: [],              //Array aller Kriterien
    listePraesentation: [],
    /**
     * Kriterien.listeAbrufen
     * Liste aller Kriterien von Server abrufen
     */
    listeAbrufen: function () {
        var load = new XMLHttpRequest();
        load.open("POST", linkToServer, true);
        load.send();
        load.onreadystatechange = function () {
            /* Request bearbeitet */
            if (load.readyState == 4 && load.status == 200) {
                var response = JSON.parse(load.responseText);
                console.log("listeAbrufen response:" + JSON.stringify(load.responseText));
                Kriterien.listeFachgespraech = response['fachgespraech'];
                Kriterien.listePraesentation = response['praesentation'];
               // Kriterien.listeAnzeigen("fachgespraech__liste");
                Kriterien.listeAnzeigen("praesentation__liste");

                Error.hide();

            } else if (load.readyState >= 4) {
                Error.show("keineVerbindung");
            }
        }
    },
    /**
     * Kriterien.listeAnzeigen
     * Fügt Liste in übergebenen Div ein
     * @param parentDivId übergeodneter Div
     * @param bestellung boolean true für Bestellungsansicht mit Buttons
     */
    listeAnzeigen: function (parentDivId) {
        var Kriterium;    //ein Kriterien
        var KriterienNr;  //Kriteriennummer
        for (KriterienNr in listePraesentation.liste) {
            Kriterium = listePraesentation.liste[KriterienNr];
            /* Div erstellen und einfügen */
            var div = document.createElement("div");
            div.className = "tableContainer";
            div.id = parentDivId + "--" + KriterienNr;
            document.getElementById(parentDivId).appendChild(div);
            var preis = Number(Kriterium.name);
            var show = "<div class='tableContainer__cell'>" +
                "<div class='tableContainer__cell tableContainer__cell--price'>" +
                preis.toFixed(2).replace(/\./g, ',') + "€</div>";

            div.innerHTML = show;
        }
    }
};