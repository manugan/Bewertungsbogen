/**
 * Created by Manuel Garni on 13.07.16.
 */
"use strict";
/*
 * Globale Namespacess
 */
var Kriterien = Kriterien || {};


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
    listeFachgespräch: [],              //Array aller Kriterien
    listePräsentation: [],
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
                Kriterien.listeFachgespräch = response['fachgespräch'];
                Kriterien.listePräsentation = response['präsentation'];
                Kriterien.listeAnzeigen("fachgespräch__liste");
                Kriterien.listeAnzeigen("präsentation__liste");

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
        var Kriterien;    //ein Kriterien
        var KriterienNr;  //Kriteriennummer
        for (KriterienNr in Kriterien.liste) {
            Kriterien = Kriterien.liste[KriterienNr];
            /* Div erstellen und einfügen */
            var div = document.createElement("div");
            div.className = "tableContainer";
            div.id = parentDivId + "--" + KriterienNr;
            document.getElementById(parentDivId).appendChild(div);
            var preis = Number(Kriterien.preis);
            var show = "<div class='tableContainer__cell'>" +
                "<img id='Kriterien__bild--" + KriterienNr + "' src='" + Kriterien.getBild(300, KriterienNr) + "' onclick='Kriterien.switchBild(this.id);'/></div>" +
                "<div class='tableContainer__cell tableContainer__cell--name'>" +
                Kriterien.beschreibung + "</div>" +
                "<div class='tableContainer__sub'> <div class='tableContainer__cell tableContainer__cell--art'>" +
                Kriterien.art + "</div>" +
                "<div class='tableContainer__cell tableContainer__cell--inhalt'>" +
                Kriterien.inhaltsstoffe + "</div>" +
                "<div class='tableContainer__cell tableContainer__cell--inhalt'>" +
                Kriterien.mwst + "% Mwst.</div></div> " +
                "<div class='tableContainer__cell tableContainer__cell--price'>" +
                preis.toFixed(2).replace(/\./g, ',') + "€</div>";

            div.innerHTML = show;
        }
        /* Bestellbutton aktivieren */
        document.getElementById("button__bestellung--start").classList.remove("inaktiv");
    }
};