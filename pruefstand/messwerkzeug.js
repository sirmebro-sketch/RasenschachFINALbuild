/* ==========================================================================
   MESSWERKZEUG — gehoert NICHT zum Spiel.
   Liegt ausserhalb des Buendels und fasst die App nicht an. Solange die
   Messung aus ist (Vorgabe), laeuft hier kein einziger Bildschleifenaufruf.
   Der Griff unten links ist 30x30 px gross und laesst sich ganz ausblenden.

   WAS DIESES WERKZEUG NICHT SEHEN KANN: requestAnimationFrame misst den
   HAUPTFADEN. Ruckeln durch teures Zeichnen entsteht auf dem Zeichenfaden.
   Bei einem Wischer, den der Verbund allein abwickelt, kann hier 60 stehen,
   waehrend der Bildschirm sichtbar stockt (graue Kacheln). Die Zahlen sind
   deshalb ein Nebenzeuge — der Hauptzeuge ist das Auge im A/B-Vergleich.
   ========================================================================== */
(function () {
  "use strict";
  var an = false, roh = [], letzte = 0, handle = 0, lauf = null;

  /* ---------- Aufsatzstile fuer den A/B-Vergleich ----------
     Kommen ans Ende von <body>, also hinter das <style> der App, und tragen
     zusaetzlich !important — damit schlagen sie auch die Stilangaben, die
     direkt im JSX stehen. */
  var stil = document.createElement("style");
  document.body.appendChild(stil);
  var aus = { raster: false, schatten: false, lage: false };
  function stileSetzen() {
    var s = "";
    /* Papier ohne jede Struktur: Faser und Halbtonraster fallen weg, die
       Papierfarbe bleibt. Vorher stand hier der alte Rasenverlauf — der hätte
       beim A/B-Vergleich das Papier gleich mit ausgetauscht und die Messung
       wertlos gemacht. */
    if (aus.raster) s += ".fl{background:var(--bg)!important}"
                       + ".raster{background-image:none!important}";
    if (aus.schatten) s += ".klebe{box-shadow:none!important}";
    if (aus.lage) s += ".klebe{transform:none!important}.leerfeld{opacity:1!important}";
    stil.textContent = s;
  }

  /* ---------- Diagnose ---------- */
  function ja(b) { return b ? "ja" : "NEIN"; }
  function diagnose() {
    var sp;
    try { window.localStorage.setItem("__probe", "1"); window.localStorage.removeItem("__probe"); sp = "schreibbar"; }
    catch (e) { sp = "GESPERRT"; }
    return [
      ["Protokoll", location.protocol],
      ["Sicherer Kontext", ja(window.isSecureContext)],
      ["navigator.wakeLock", "wakeLock" in navigator ? "vorhanden" : "FEHLT"],
      ["localStorage", sp],
      ["Geraetepixel", String(window.devicePixelRatio || 1)],
      ["Fenster", window.innerWidth + " x " + window.innerHeight]
    ];
  }

  /* ---------- Bildratenmessung ---------- */
  function schleife(t) {
    if (!an) return;
    if (letzte) roh.push(t - letzte);
    letzte = t;
    if (roh.length > 4000) roh.splice(0, 2000);
    handle = requestAnimationFrame(schleife);
  }
  function werte(f) {
    if (!f.length) return null;
    var summe = 0, schlimm = 0, lang = 0;
    for (var i = 0; i < f.length; i++) {
      summe += f[i];
      if (f[i] > schlimm) schlimm = f[i];
      if (f[i] > 32) lang++;
    }
    var letzteN = f.slice(-60), s2 = 0;
    for (var j = 0; j < letzteN.length; j++) s2 += letzteN[j];
    return {
      jetzt: Math.round(1000 / (s2 / letzteN.length)),
      mittel: Math.round(1000 / (summe / f.length)),
      lang: (100 * lang / f.length).toFixed(1),
      schlimm: Math.round(schlimm),
      n: f.length
    };
  }

  /* ---------- Messlauf: gleicher Weg, gleiches Tempo, damit A und B
       vergleichbar sind. Der Daumen ist es nicht. ---------- */
  function messlauf(fertig) {
    window.scrollTo(0, 0);
    var f = [], v = 0, start = 0, hoch = false, l = 0;
    function schritt(t) {
      if (!start) { start = t; l = t; requestAnimationFrame(schritt); return; }
      var dt = t - l; l = t; f.push(dt);
      var weg = 0.9 * dt;                       /* 900 px je Sekunde */
      if (!hoch) {
        window.scrollBy(0, weg); v += weg;
        if (v > 6000 || (window.innerHeight + window.scrollY) >= document.body.scrollHeight - 2) hoch = true;
      } else {
        window.scrollBy(0, -weg); v -= weg;
        if (window.scrollY <= 0) { fertig(werte(f.slice(2))); return; }
      }
      if (t - start > 20000) { fertig(werte(f.slice(2))); return; }
      requestAnimationFrame(schritt);
    }
    requestAnimationFrame(schritt);
  }

  /* ---------- Oberflaeche ---------- */
  var griff = document.createElement("button");
  griff.textContent = "fps";
  griff.setAttribute("aria-label", "Messwerkzeug oeffnen");
  griff.style.cssText = "position:fixed;left:6px;bottom:6px;z-index:2147483647;width:30px;height:30px;"
    + "font:600 10px/1 system-ui,sans-serif;color:#EDF2E9;background:rgba(7,13,10,.72);"
    + "border:1px solid #2C3A31;padding:0;opacity:.34;";
  document.body.appendChild(griff);

  var kasten = document.createElement("div");
  kasten.style.cssText = "position:fixed;left:0;right:0;bottom:0;z-index:2147483646;display:none;"
    + "background:rgba(7,13,10,.96);border-top:2px solid #2C3A31;color:#EDF2E9;"
    + "font:11px/1.45 system-ui,sans-serif;padding:9px 11px 12px;max-height:62vh;overflow:auto;";
  document.body.appendChild(kasten);

  kasten.innerHTML =
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">'
    + '<b style="letter-spacing:.09em">MESSUNG \u00b7 nicht Teil des Spiels</b>'
    + '<button id="mw-zu" style="background:none;border:1px solid #2C3A31;color:#EDF2E9;font:11px system-ui;padding:3px 9px">schliessen</button></div>'
    + '<div id="mw-diag" style="color:#8A9690;margin-bottom:8px"></div>'
    + '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:7px">'
    + '<button id="mw-an" style="background:#EDF2E9;border:0;color:#070D0A;font:600 11px system-ui;padding:5px 11px">Messung an</button>'
    + '<button id="mw-null" style="background:none;border:1px solid #2C3A31;color:#EDF2E9;font:11px system-ui;padding:5px 11px">zuruecksetzen</button>'
    + '<button id="mw-lauf" style="background:none;border:1px solid #2C3A31;color:#EDF2E9;font:11px system-ui;padding:5px 11px">Messlauf</button></div>'
    + '<div id="mw-zahl" style="font:600 13px/1.5 ui-monospace,monospace;color:#F2C230;margin-bottom:8px">aus</div>'
    + '<div style="border-top:1px solid #2C3A31;padding-top:7px">'
    + '<div style="color:#8A9690;margin-bottom:4px">A/B \u2014 abgeschaltet wird, was verdaechtig ist:</div>'
    + '<label style="display:block;margin:3px 0"><input type="checkbox" id="mw-raster"> Halbtonraster (Seitengrund + Menuestreifen)</label>'
    + '<label style="display:block;margin:3px 0"><input type="checkbox" id="mw-schatten"> Klebeschatten (box-shadow der Karten)</label>'
    + '<label style="display:block;margin:3px 0"><input type="checkbox" id="mw-lage"> Schraeglage + Deckkraft der Felder</label></div>'
    + '<div style="color:#8A9690;margin-top:8px;border-top:1px solid #2C3A31;padding-top:7px">'
    + 'requestAnimationFrame sieht nur den Hauptfaden. Ruckeln durch teures Zeichnen '
    + 'entsteht auf dem Zeichenfaden und kann hier unsichtbar bleiben \u2014 graue Kacheln '
    + 'beim schnellen Wischen sind das verlaesslichere Zeichen.</div>';

  var eZahl = kasten.querySelector("#mw-zahl"), eAn = kasten.querySelector("#mw-an");

  function diagZeigen() {
    kasten.querySelector("#mw-diag").innerHTML = diagnose()
      .map(function (z) { return z[0] + ": <b style=\"color:#EDF2E9\">" + z[1] + "</b>"; }).join(" \u00b7 ");
  }
  function anzeigen() {
    if (!an) return;
    var w = werte(roh);
    eZahl.textContent = w
      ? "jetzt " + w.jetzt + " \u00b7 mittel " + w.mittel + " \u00b7 >32ms " + w.lang + "% \u00b7 schlimmstes "
        + w.schlimm + "ms \u00b7 " + w.n + " Bilder"
      : "misst \u2026";
    setTimeout(anzeigen, 400);
  }
  function schalten(neu) {
    an = neu;
    eAn.textContent = an ? "Messung aus" : "Messung an";
    if (an) { roh = []; letzte = 0; handle = requestAnimationFrame(schleife); anzeigen(); }
    else { cancelAnimationFrame(handle); eZahl.textContent = "aus"; }
  }

  griff.onclick = function () {
    kasten.style.display = "block"; griff.style.display = "none"; diagZeigen();
  };
  kasten.querySelector("#mw-zu").onclick = function () {
    kasten.style.display = "none"; griff.style.display = "";
    if (an) schalten(false);
  };
  eAn.onclick = function () { schalten(!an); };
  kasten.querySelector("#mw-null").onclick = function () { roh = []; letzte = 0; };
  kasten.querySelector("#mw-lauf").onclick = function () {
    if (lauf) return;
    lauf = 1; eZahl.textContent = "Messlauf laeuft \u2026";
    messlauf(function (w) {
      lauf = null;
      eZahl.textContent = w
        ? "MESSLAUF: mittel " + w.mittel + " \u00b7 >32ms " + w.lang + "% \u00b7 schlimmstes "
          + w.schlimm + "ms \u00b7 " + w.n + " Bilder"
        : "Messlauf ohne Bilder";
    });
  };
  ["raster", "schatten", "lage"].forEach(function (k) {
    kasten.querySelector("#mw-" + k).onchange = function (e) { aus[k] = e.target.checked; stileSetzen(); };
  });

  /* Mit #mess in der Adresse geht der Kasten gleich auf. */
  if (location.hash === "#mess") griff.onclick();
})();
