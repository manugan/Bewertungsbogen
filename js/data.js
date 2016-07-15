/**
 * Created by Manuel Garni on 13.07.16.
 */
"use strict";
/*
 * Globale Namespacess
 */
var Kriterien = Kriterien || {};
var Bewertung = Bewertung || {};


/* relativer Serverpfad zu JSON Handler */
var linkToServer = "kriterienListe.json";


/**
 * Kriterien
 * zum direkten Abruf aller Kriterien bei Website Aufruf
 * @type {{liste: Array, listeAbrufen: Kriterien.listeAbrufen, listeAnzeigen: Kriterien.listeAnzeigen}}
 */
Kriterien = {
    listeFachgespraech: [],              //Array aller FAchgespräch Kriterien
    listePraesentation: [],
    generateOptions: function (selectItem) {
        var option = document.createElement("option");
        option.text = "10";
        selectItem.add(option);
        option = document.createElement("option");
        option.text = "9.5";
        selectItem.add(option);
        option = document.createElement("option");
        option.text = "9";
        selectItem.add(option);
        option = document.createElement("option");
        option.text = "8";
        selectItem.add(option);
        option = document.createElement("option");
        option.text = "7";
        selectItem.add(option);
        option = document.createElement("option");
        option.text = "6";
        selectItem.add(option);
        option = document.createElement("option");
        option.text = "5";
        selectItem.add(option);
        option = document.createElement("option");
        option.text = "4";
        selectItem.add(option);
        option = document.createElement("option");
        option.text = "3";
        selectItem.add(option);
        option = document.createElement("option");
        option.text = "0";
        selectItem.add(option);
        selectItem.selectedIndex = 9;

    },
    /**
     * Kriterien.listeAbrufen
     * Liste aller Kriterien von Server abrufen
     */
    listeAbrufen: function () {
        var load = new XMLHttpRequest();
        load.open("GET", linkToServer, true);
        load.send();
        load.onreadystatechange = function () {
            /* Request bearbeitet */
            if (load.readyState == 4 && load.status == 200) {
                var response = JSON.parse(load.responseText);
                console.log("listeAbrufen response:" + JSON.stringify(load.responseText));
                Kriterien.listeFachgespraech = response['fachgespraech'];
                Kriterien.listePraesentation = response['praesentation'];
                console.log("liste präsentation:" + JSON.stringify(Kriterien.listePraesentation));
                Kriterien.listeAnzeigen("fachgespraech__liste", Kriterien.listeFachgespraech);
                Kriterien.listeAnzeigen("praesentation__liste", Kriterien.listePraesentation);
                var select = document.getElementsByClassName("punkte__select");
                for (var i = 0; i < select.length; i++) {
                    Kriterien.generateOptions(select.item(i));
                }

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
    listeAnzeigen: function (parentDivId, listName) {
        var kriterium;    //ein Kriterien
        var KriterienNr;  //Kriteriennummer
        for (KriterienNr in listName) {
            kriterium = listName[KriterienNr];
            /* Div erstellen und einfügen */
            var div = document.createElement("div");
            div.className = "tableContainer";
            div.id = parentDivId + "--" + KriterienNr;
            document.getElementById(parentDivId).appendChild(div);
            var gewichtung = Number(kriterium.gewichtung);
            var show = "<div class='tableContainer__cell'>" +
                "<div class='tableContainer__cell tableContainer__cell--name'> " +
                kriterium.name + "</div>" +

                "<div class='tableContainer__cell'>" +
                "<div class='tableContainer__add'>" +
                "<select class='punkte__select button__hell' id='" + div.id + "__select' onchange='Bewertung.update(\"" +
                div.id +
                "\", " +
                gewichtung +
                ", this.value);'></select></div>" +
                "<div class='tableContainer__cell tableContainer__cell--gewichtung'>x " +
                gewichtung.toFixed(1).replace(/\./g, ',') + " = </div>" +
                "<div class='tableContainer__cell tableContainer__cell--ergebnis " + parentDivId + "__ergebnis' id='" + div.id + "__ergebnis'>0</div>" +
                " </div>";

            div.innerHTML = show;
        }
    }
};


/* Kriterien abrufen und anzeigen */
Kriterien.listeAbrufen();


Bewertung = {

    /**
     * Bestellung.update
     */
    update: function (parentDivId, gewichtung, selected) {
        /* update derzeitiges Feld */
        var div2 = document.getElementById(parentDivId + "__ergebnis");
        div2.innerHTML = selected * gewichtung;

        /* update Zwischenergebnisse - Präsentation */
        var div3 = document.getElementsByClassName("praesentation__liste__ergebnis");
        var summe = 0;
        for (var i = 0; i < div3.length; i++) {
            summe += Number(div3.item(i).innerHTML);
        }
        document.getElementById("praesentation__summe").innerHTML = summe;
        document.getElementById("praesentation__summe__ergebnis").innerHTML = summe;

        /* update Zwischenergebnisse - Fachgespräch */
        div3 = document.getElementsByClassName("fachgespraech__liste__ergebnis");
        summe = 0;
        for (var i = 0; i < div3.length; i++) {
            summe += Number(div3.item(i).innerHTML);
        }
        document.getElementById("fachgespraech__summe").innerHTML = summe;
        document.getElementById("fachgespraech__summe__ergebnis").innerHTML = summe;


        /* update gesamtergebnis */
        var ergebnis = Number(document.getElementById("praesentation__summe").innerHTML);
        ergebnis += Number(document.getElementById("fachgespraech__summe").innerHTML);
        document.getElementById("ergebnis__summe").innerHTML = ergebnis / 2;
            


    }
};