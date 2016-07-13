/**
 * Created by Manuel Garni on 03.03.16.
 */
"use strict";

/*
 * Globale Namespacess
 */
var Navigate = Navigate || {};

/**
 * Navigatation Anzeige
 * @type {{main: Navigate.show.main, impressum: Navigate.show.impressum}}
 */
Navigate.show = {
    main: function () {
        Navigate.hideAll();
        var main = document.getElementById("content");
        main.style.display = "block";
    },
    impressum: function () {
            Navigate.hideAll();
            var impressum = document.getElementById("impressum");
            impressum.style.display = "block";
    }
};

/**
 * Error Anzeigefenster
 * @type {{show: Error.show, hide: Error.hide}}
 */
Error = {
    /**
     * Error.show
     * Mit Fehlermeldung anzeigen
     * @param errorCode
     * @param errorMessage
     */
    show: function (errorCode, errorMessage) {
        var output;
        switch (errorCode) {
            case "0": /* Zu viele Sessions */
                output = "<a onclick='Error.hide();' class='error--schließen'><i class='material-icons'>close</i>Schließen</a>" +
                    "<p><i class='material-icons'>sync_problem</i>" +
                    "Leider ist aufgrund der vielen zurzeit eintreffenden Bestellungen keine weitere Sitzung möglich. Bitte probiere es in ein paar Minuten nochmal!</p>";
                break;

            default: /* case 3 und Unbekannt */
                output = "<a onclick='Error.hide();' class='error--schließen'><i class='material-icons'>close</i>Schließen</a>" +
                    "Entschuldige, aber das hätte nicht passieren dürfen. Bitte versuche, die Seite von einem anderen Gerät aufzurufen." +
                    "Tritt der Fehler dennoch auf, kontaktiere uns bitte und nenne den Fehler sowie den Namen der Website.<br>" +
                    "Folgender Fehler ist aufgetreten: <b>" + errorCode + "</b>:<br>" + errorMessage;
                break;
        }
        var divError = document.getElementById('error');
        divError.style.display = "block";
        document.getElementById('error--message').innerHTML = output;
    },
    /**
     * Error.hide
     * Schließen
     */
    hide: function () {
        document.getElementById('error').style.display = "none";
    }
};