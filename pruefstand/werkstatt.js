/* ==========================================================================
   WERKSTATT — Abkürzungen zum Prüfen. GEHÖRT NICHT ZUM SPIEL.
   --------------------------------------------------------------------------
   Wird von `browsertest.sh` in die Testseite gehängt — aber NUR mit einem der
   beiden Schalter:

       WERKSTATT=1 bash pruefstand/browsertest.sh    zum Anschauen, Menü sofort
       ERSTSTART=1 bash pruefstand/browsertest.sh    wie eine frische App

   Ohne Schalter ist sie NICHT dabei: das ist die Fassung für den Prüfstand,
   und dort würden ihre dreizehn Knöpfe in jeder Zählung mitlaufen.

   BIS 35.55 STAND HIER, sie werde von browsertest.sh eingehängt — ohne diese
   Einschränkung. Wer die Datei normal baute, suchte danach vergeblich nach
   einem Werkzeug, das laut dieser Zeile da sein sollte. Genau so ist es
   passiert. Eine Datei, die über sich selbst etwas Falsches behauptet, kostet
   mehr Zeit als eine, die gar nichts sagt.

   In der APK ist sie nicht vorhanden. Zweck: alle Bildschirme erreichen, ohne dafür stundenlang
   spielen zu müssen — Akademie ab 2 Laufbahnen, Verein ab 5, Vollausbau nach
   rund 28. Wer das erspielt, prüft eine Woche lang.

   ARCHITEKTUR, bewusst wie beim Messwerkzeug: dieses Werkzeug fasst die App
   NICHT an. Es kennt keine ihrer Funktionen und keinen ihrer Zustände. Es
   schreibt ausschliesslich in den `localStorage` — also genau dort hinein, wo
   die App beim Start ohnehin nachsieht — und lädt danach neu.

   Warum das so sein MUSS: griffe das Werkzeug in die laufende App, würde der
   Browsertest etwas anderes prüfen als die APK. Genau dieser Fehler steckt in
   der Projektgeschichte (33.3: die Vorschau lud Schriften aus dem Netz, die
   App nicht — die Abweichung blieb Monate unbemerkt). Ein Prüfmittel, das den
   Prüfling verändert, prüft sich selbst.

   WAS DAMIT NICHT GEHT, und warum es hier steht statt zu fehlen:
   Eine laufende Spielerlaufbahn vorspulen. Der Spielstand unter
   `rasenschach:stand` ist der Zustand einer halb gespielten Laufbahn mit
   Verlauf, Verein, Vertrag und Ereignisgedächtnis. Ihn von aussen
   weiterzurechnen hiesse, die Entwicklungsformeln des Spiels hier ein zweites
   Mal zu bauen — und dann prüft man die Kopie, nicht das Spiel. Stattdessen
   setzt die Werkstatt die VORAUSSETZUNGEN (abgeschlossene Laufbahnen, Coins,
   Ausbaustufen, Talente) und überlässt das Spielen dem Spiel.
   ========================================================================== */
(function () {
  "use strict";

  var K = {
    aka:  "rasenschach:akademie",
    ver:  "rasenschach:verein",
    life: "rasenschach:gesamt",
    save: "rasenschach:stand",
    will: "rasenschach:willkommen",
    hall: "rasenschach:halle",
    ach:  "rasenschach:erfolge",
    meta: "rasenschach:meta",
    /* NACHGESEHEN, nicht aus dem Gedaechtnis: `rasenschach:karten` und
       `rasenschach:raute` fehlten im ersten Entwurf, weil mein Suchmuster die
       Zeilen mit doppeltem Leerzeichen (`WC_KEY  = `) uebersprang. "Alles
       loeschen" haette dann zwei Schluessel stehen lassen — und der naechste
       Prueflauf waere auf Resten gelaufen, ohne dass es auffaellt. */
    karten: "rasenschach:karten",
    raute: "rasenschach:raute",
    gesehen: "rasenschach:gesehen",
  };

  /* EINSTELLUNGEN getrennt gefuehrt: Ruhe, Schwierigkeit, Tempo, Textgroesse,
     Vibration, Wachsperre. Sie gehoeren nicht zum Spielstand, sondern zu den
     Vorlieben — wer den Stand zuruecksetzt, will nicht auch seine
     Einstellungen verlieren. Deshalb zwei Knoepfe statt eines, der beides
     macht und nur eines im Namen traegt. */
  var E = {
    ruhe: "rasenschach:ruhe", schwer: "rasenschach:schwer",
    speed: "rasenschach:speed", text: "rasenschach:text",
    vib: "rasenschach:vib", wach: "rasenschach:wach",
  };

  function lies(k, vorgabe) {
    try {
      var r = localStorage.getItem(k);
      return r == null ? vorgabe : JSON.parse(r);
    } catch (e) { return vorgabe; }
  }
  function schreib(k, w) {
    try { localStorage.setItem(k, JSON.stringify(w)); return true; }
    catch (e) { melde("Speicher schreibgeschützt: " + e.message); return false; }
  }

  var meldung = null;
  function melde(t) {
    if (!meldung) return;
    meldung.textContent = t;
    meldung.style.display = "block";
  }
  function neuLaden() { location.reload(); }

  /* ---- Die einzelnen Abkürzungen ---------------------------------------
     Jede fasst genau einen Schlüssel an und sagt danach, was sie getan hat.
     Kein "alles auf einmal"-Knopf: wer nicht weiss, was gesetzt wurde, kann
     einen Fehlschlag nicht einordnen. */

  function laufbahnen(n) {
    var g = lies(K.life, null);
    if (!g || typeof g !== "object") g = {};
    g.karrieren = Math.max(0, (g.karrieren || 0) + n);
    if (!schreib(K.life, g)) return;
    melde("Abgeschlossene Laufbahnen: " + g.karrieren
      + "  (Akademie ab 2, Verein ab 5)");
  }

  function coins(n) {
    var a = lies(K.aka, null);
    if (!a || !a.gegruendet) {
      melde("Noch keine Akademie gegründet — erst im Spiel gründen, dann geht das.");
      return;
    }
    a.vc = Math.max(0, (a.vc || 0) + n);
    a.verdient = (a.verdient || 0) + Math.max(0, n);
    if (!schreib(K.aka, a)) return;
    melde("Vermächtnis-Coins: " + a.vc);
  }

  function akademieAusbauen() {
    var a = lies(K.aka, null);
    if (!a || !a.gegruendet) { melde("Noch keine Akademie gegründet."); return; }
    if (!a.stufen || typeof a.stufen !== "object") {
      melde("Akademie hat kein Stufenfeld — Stand vermutlich aus einer älteren Fassung.");
      return;
    }
    /* Die Abteilungsnamen stehen im Spielstand selbst. Sie hier NICHT
       aufzuzählen ist Absicht: die Liste ist von sechs auf neun gewachsen,
       und eine Kopie davon wäre beim nächsten Ausbau still veraltet. */
    var n = 0;
    Object.keys(a.stufen).forEach(function (id) { a.stufen[id] = 6; n++; });
    if (!schreib(K.aka, a)) return;
    melde(n + " Abteilungen auf Höchststufe gesetzt.");
  }

  function vereinEinschreiben() {
    var v = lies(K.ver, null);
    if (!v || !v.gegruendet) { melde("Noch kein Verein gegründet."); return; }
    v.eingeschrieben = true;
    if (!schreib(K.ver, v)) return;
    melde("Verein eingeschrieben — spielt ab jetzt bei jeder beendeten Laufbahn.");
  }

  function willkommenZeigen() {
    try { localStorage.removeItem(K.will); } catch (e) {}
    melde("Willkommensschirm erscheint beim nächsten Laden wieder.");
  }

  function standLoeschen() {
    if (!confirm("Spielstand, Akademie, Verein, Halle und Erfolge löschen?\n\nEinstellungen bleiben.")) return;
    Object.keys(K).forEach(function (n) {
      try { localStorage.removeItem(K[n]); } catch (e) {}
    });
    melde("Spielstand gelöscht (" + Object.keys(K).length + " Schlüssel). Einstellungen sind geblieben.");
  }

  function einstellungenLoeschen() {
    Object.keys(E).forEach(function (n) {
      try { localStorage.removeItem(E[n]); } catch (e) {}
    });
    melde("Einstellungen zurückgesetzt (" + Object.keys(E).length + " Schlüssel).");
  }

  function stand() {
    var g = lies(K.life, {}) || {};
    var a = lies(K.aka, null);
    var v = lies(K.ver, null);
    var s = lies(K.save, null);
    var z = [];
    z.push("Laufbahnen: " + (g.karrieren || 0));
    z.push("Akademie: " + (a && a.gegruendet
      ? (a.vc || 0) + " VC, " + (a.talente ? a.talente.length : 0) + " Talente"
      : "keine"));
    z.push("Verein: " + (v && v.gegruendet
      ? v.name + ", Jahr " + (v.jahr || 0) + ", " + (v.eingeschrieben ? "eingeschrieben" : "nicht eingeschrieben")
      : "keiner"));
    z.push("Laufender Spielstand: " + (s ? "ja" : "nein"));
    melde(z.join("  ·  "));
  }

  /* ---- Oberfläche -------------------------------------------------------
     Unten RECHTS, damit sie dem Messwerkzeug unten links nicht ins Gehege
     kommt. Zugeklappt ist sie ein 30x30-Griff wie jenes. */
  var auf = false;
  var kasten = document.createElement("div");
  kasten.id = "werkstatt";
  kasten.setAttribute("style",
    "position:fixed;right:0;bottom:0;z-index:2147483647;font:12px system-ui,sans-serif;");

  var griff = document.createElement("button");
  griff.textContent = "\u2699";
  griff.title = "Werkstatt (nur im Browsertest)";
  griff.setAttribute("style",
    "width:30px;height:30px;border:1px solid #7a6;background:#111;color:#9c8;"
    + "cursor:pointer;font-size:15px;line-height:1;padding:0;");

  var tafel = document.createElement("div");
  tafel.setAttribute("style",
    "display:none;background:#111;border:1px solid #7a6;color:#dcd;padding:8px;"
    + "max-width:min(92vw,340px);max-height:70vh;overflow:auto;");

  function reihe(text) {
    var d = document.createElement("div");
    d.textContent = text;
    d.setAttribute("style", "color:#8a8;margin:6px 0 3px;font-size:10.5px;letter-spacing:.06em;");
    return d;
  }
  function knopf(text, tun) {
    var b = document.createElement("button");
    b.textContent = text;
    b.setAttribute("style",
      "display:inline-block;margin:2px 3px 2px 0;padding:6px 9px;background:#1b1b1b;"
      + "border:1px solid #565;color:#dfd;cursor:pointer;font:inherit;");
    b.addEventListener("click", tun);
    return b;
  }

  tafel.appendChild(reihe("WERKSTATT — nur im Browsertest, nicht in der APK"));

  tafel.appendChild(reihe("STAND"));
  tafel.appendChild(knopf("Was ist gesetzt?", stand));

  tafel.appendChild(reihe("ABGESCHLOSSENE LAUFBAHNEN  (Akademie ab 2, Verein ab 5)"));
  tafel.appendChild(knopf("+1", function () { laufbahnen(1); }));
  tafel.appendChild(knopf("+5", function () { laufbahnen(5); }));
  tafel.appendChild(knopf("+20", function () { laufbahnen(20); }));
  tafel.appendChild(knopf("auf 0", function () {
    var g = lies(K.life, {}) || {}; g.karrieren = 0; schreib(K.life, g);
    melde("Laufbahnen auf 0.");
  }));

  tafel.appendChild(reihe("VERMÄCHTNIS-COINS  (Akademie muss gegründet sein)"));
  tafel.appendChild(knopf("+500", function () { coins(500); }));
  tafel.appendChild(knopf("+3000", function () { coins(3000); }));
  tafel.appendChild(knopf("Alles ausgebaut", akademieAusbauen));

  tafel.appendChild(reihe("VEREIN"));
  tafel.appendChild(knopf("Einschreiben", vereinEinschreiben));

  tafel.appendChild(reihe("SONSTIGES"));
  tafel.appendChild(knopf("Willkommen wieder zeigen", willkommenZeigen));
  tafel.appendChild(knopf("Spielstand löschen", standLoeschen));
  tafel.appendChild(knopf("Einstellungen zurücksetzen", einstellungenLoeschen));

  tafel.appendChild(reihe("Änderungen wirken erst nach dem Neuladen."));
  var nl = knopf("\u21bb  Neu laden", neuLaden);
  nl.style.background = "#243";
  tafel.appendChild(nl);

  meldung = document.createElement("div");
  meldung.setAttribute("style",
    "display:none;margin-top:8px;padding:6px;background:#0c0c0c;border-left:2px solid #7a6;"
    + "color:#cdc;font-size:11px;line-height:1.45;word-break:break-word;");
  tafel.appendChild(meldung);

  griff.addEventListener("click", function () {
    auf = !auf;
    tafel.style.display = auf ? "block" : "none";
    griff.textContent = auf ? "\u00d7" : "\u2699";
  });

  kasten.appendChild(tafel);
  kasten.appendChild(griff);
  document.body.appendChild(kasten);
})();
