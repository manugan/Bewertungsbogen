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
var linkToServer = "js/kriterien.json";


/**
 * Kriterien
 * zum direkten Abruf aller Kriterien bei Website Aufruf
 * @type {{liste: Array, listeAbrufen: Kriterien.listeAbrufen, listeAnzeigen: Kriterien.listeAnzeigen}}
 */
Kriterien = {
    listeFachgespraech: [],              //Array aller Kriterien
    listePraesentation: [],
    generateOptions: function (selectItem) {
        var option = document.createElement("option");
        option.text = "0";
        selectItem.add(option);
        option = document.createElement("option");
        option.text = "3";
        selectItem.add(option);
        option = document.createElement("option");
        option.text = "4";
        selectItem.add(option);
        option = document.createElement("option");
        option.text = "5.5";
        selectItem.add(option);

    },
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
                "<select class='punkte__select' id='" + div.id + "__select' onchange='Bewertung.update(\"" +
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
     * Bestellung.artikel.addArtikel
     * Artikel zum Warenkorb hinzufügen, bzw Anzahl +1
     * @param artikelNeu
     */
    update: function (parentDivId, gewichtung, selected) {
        var div2 = document.getElementById(parentDivId + "__ergebnis");
        div2.innerHTML = selected * gewichtung;

        var div3 = document.getElementsByClassName("praesentation__liste__ergebnis");
        var summe = 0;
        for (var i = 0; i < div3.length; i++) {
            summe += div3.innerHTML;
        }

        document.getElementById("praesentation__summe").innerHTML = summe;
            


    },
    /**
     * Artikel aus Warenkorb entfernen, bzw -1
     * @param artikelAlt
     */
    rmvPunkte: function (artikelAlt) {
        var liste = JSON.parse(sessionStorage.liste);
        var storageArtikel = liste.Artikel;
        var vorhanden = 0;
        var index;
        for (var i = 0; i < storageArtikel.length; i++) {
            if (storageArtikel[i].id == artikelAlt) {
                vorhanden = storageArtikel[i].anzahl - 1;
                index = i;
            }
        }
        var div = document.getElementById("bestellung__artikel--" + artikelAlt);
        var div2 = document.getElementById("bestellung__liste--" + artikelAlt);
        div2.getElementsByClassName("tableContainer__add")[0].innerHTML = "<div class='tableContainer__add'>" +
            "<a onclick='Bestellung.artikel.addArtikel(" + artikelAlt + ");'>" +
            "<i class='material-icons md-48'>add_circle</i>" +
            "</a><p>" + vorhanden + "</p><a onclick='Bestellung.artikel.rmvArtikel(" + artikelAlt + ");'>" +
            "<i class='material-icons md-48'>remove_circle</i>" +
            "</a></div>";
        if (vorhanden == 0) {       //Eintrag löschen
            if (document.getElementById("bestellung__artikel--" + artikelAlt)) {
                div.parentNode.removeChild(div);
                /* Gesamtpreis herunterrechnen */
                Bestellung.artikel.gesamtpreis -= Number(Artikel.liste[artikelAlt].preis);
                document.getElementById("bestellung__übersicht--gesamtpreis").innerHTML = "<b>" +
                    Bestellung.artikel.gesamtpreis.toFixed(2).replace(/\./g, ',').replace(/\-/g, '') + "€</b>";
            }
            storageArtikel.splice(index, 1);
        } else {                    //Eintrag updaten
            storageArtikel[index].anzahl -= 1;
            div.innerHTML = Bestellung.artikel.outputListe(artikelAlt, vorhanden, true);
            /* Gesamtpreis herunterrechnen */
            Bestellung.artikel.gesamtpreis -= Number(Artikel.liste[artikelAlt].preis);
            document.getElementById("bestellung__übersicht--gesamtpreis").innerHTML = "<b>" +
                Bestellung.artikel.gesamtpreis.toFixed(2).replace(/\./g, ',') + "€</b>";
        }
        /* Artikelliste abspeichern */
        sessionStorage.liste = JSON.stringify(liste);
        /* Weiter Button deaktivieren wenn unter Mindestbestellwert */
        if (Bestellung.artikel.gesamtpreis < Bestellung.minBestellwert) {
            document.getElementById("bestellung__weiter").classList.add("inaktiv");
            document.getElementById("bestellung__weiter--bottom").classList.add("inaktiv");
        }
    }
};