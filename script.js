//objekt pro hru
let hra = {
    element: document.getElementById('hra'),
    sirka: 900,
    vyska: 600,
    dalsiVejce: 150,
    dalsiVir: 250,
    skore: 0,
    skoreElement: document.getElementById('pocet'),
    hudba: document.getElementById('hudba'),
    zvukNaraz: document.getElementById('naraz'),
    zvukSebrano: document.getElementById('sebrano'),
    zvukUtok: document.getElementById('utok'),
    zvukGameOver: document.getElementById('gameover'),
    uvod: document.getElementById('uvod'),
    tlacitkoStart: document.getElementById('start'),
    konec: document.getElementById('konec'),
    tlacitkoZnovu: document.getElementById('znovu'),
    vysledek: document.getElementById('vysledek'),
    cas: 0,
    casElement: document.getElementById('cas'),
    casovac: null
}

//objekt robota
let robot = {
    element: document.getElementById('robot'),
    x: 0,
    y: 600-120,
    sirka: 93,
    vyska: 120,
    rychlost: 10
}


//objekt letajicich sani

let zajic = {
    element: document.getElementById('zajic'),
    x: 0,
    y: 10,
    sirka: 165,
    vyska: 104,
    rychlost: 2
}

//prázdný seznam (pole) vajec a virů
let VsechnaVejce = [];
let VsechnyViry = [];

// počkáme, až se v okně prohlížeče načte veškerý
// obsah a pak zavoláme funkci startHr
window.addEventListener('load', uvodHry);

//funkce pro spuštění hry
//volá se po načtení obsahu stránky
function startHry () {
    //na začátku hry vynulujeme skóre
    hra.skore = 0;
    hra.skoreElement.textContent = '0';

   //nastavíme objekty do výchozí polohy
   robot.x = Math.floor(hra.sirka/2-robot.sirka/2);
   umistiObjekt(robot);
   umistiObjekt(zajic); 
   document.addEventListener('keydown', priStiskuKlavesy);
   //nastavujeme časovač, který bude 50x za vteřinu posouvat sáně, dárky, atp.
   hra.casovac = setInterval(aktualizujHru, 20);

   //spustíme hudbu
   hra.hudba.play();

   //přepneme obrazovku na herní plochu
   prepniObrazovku('hra');

   //nastavíme výchopzí čas a zobrazíme ho
   hra.cas = 90;
   zobrazCas();
}

//funkce pro aktualizování polohy objektů na obrazovce
//spouští se 50x za vteřinu
function aktualizujHru () {
    //posuneme sáně
    posunZajic();

    //posuneme padající dárky
    posunVsechnaVejce();

    //posuneme padající viry
    posunVsechnyViry();

    //otestujeme padající dárky
    otestujVsechnaVejce();

    //otestujeme padající viry
    otestujVsechnyViry();

    //odpočítáváme do dalšího dárku
    cekejNaDalsiVejce();

    //odpočítáváme do dalšího viru
    cekejNaDalsiVir();

    //aktualizuje čas a zjistí, zda už nedošel na 0
    aktualizujCas();

    //zjistíme, zda už čas nedoběhl na 0
    if (hra.cas <= 0) {
        konecHry();
    }
}

function priStiskuKlavesy (udalost) {
    //stisknutá šipka vpravo
    if (udalost.key ==='ArrowRight') {
        robot.x = robot.x + robot.rychlost;
        //aby robot nevyjel z herního plánu
        if (robot.x > 900-robot.sirka) {
            robot.x = 900-93;
        }
    }
    //stisknutá šipka vlevo
    if (udalost.key ==='ArrowLeft') {
        robot.x = robot.x - robot.rychlost;
        //pro zastavení vyjíždění robota z herního plánu
        if (robot.x < 0) {
            robot.x=0;
        }
    }
    umistiObjekt(robot);
}


// funkce pro umístění objektu na jeho souřadnice
function umistiObjekt(herniObjekt) {
    herniObjekt.element.style.left = herniObjekt.x + 'px';
    herniObjekt.element.style.top = herniObjekt.y + 'px';
  }

  //funce pro posun sáněmi
  function posunZajic () {
      zajic.x = zajic.x + zajic.rychlost;
      umistiObjekt (zajic);
      //pravý okraj obrazovky
    if (zajic.x > hra.sirka - zajic.sirka) {
        zajic.x = hra.sirka - zajic.sirka;
        zajic.rychlost = -zajic.rychlost;
        }

        //levý okraj obrazovky
    if (zajic.x < 0) {
        zajic.x = 0;
        zajic.rychlost = -zajic.rychlost;
    }

  }

  //funkce pro vytvoření nového vejce
  // nový dárek se přidá do pole dárky
  function pridejVejce() {

    //vytvoříme nový element pro obrázek dárku
    let obrazek = document.createElement('img');
    obrazek.src = 'obrazky/vejce' + nahodneCislo(1,3) + '.png';
    
    //přidejme obrázek dárku na herní plochu
        hra.element.appendChild(obrazek);

        //vytvoříme objekt nového dárku
        let novyVejce = {
            element: obrazek,
            x: Math.floor(zajic.x + zajic.sirka/2 - 20),
            y: Math.floor(zajic.y + zajic.vyska/2),
            sirka: 44,
            vyska: 60,
            rychlost: nahodneCislo(1,3)
        };

        //nový dárek přidáváme do seznamu
        VsechnaVejce.push(novyVejce);

        //ihned umístíme dárek na správnou pozici na obrazovce
        umistiObjekt(novyVejce);
  }

  //funknce pro pohyb padajících dárků
  function posunVsechnaVejce () {
      //projdeme všechny dárky v poli
      for (let i = 0; i < VsechnaVejce.length; i++) {
          //posuneme dárek směrem dolů
          VsechnaVejce[i].y = VsechnaVejce[i].y + VsechnaVejce[i].rychlost;

          //změníme polohu dárku na obrazovce
          umistiObjekt(VsechnaVejce[i]);
      }
  }
//funkce pro vytvoření nového viru
  // nový vir se přidá do pole Viry
  function pridejVir() {

    //vytvoříme nový element pro obrázek viru
    let obrazek = document.createElement('img');
    obrazek.src = 'obrazky/vir.png';
    obrazek.className='vir';
    
    //přidejme obrázek viru na herní plochu
        hra.element.appendChild(obrazek);

        //vytvoříme objekt nového viru
        let novyVir = {
            element: obrazek,
            x: Math.floor(zajic.x + zajic.sirka/2 - 20),
            y: Math.floor(zajic.y + zajic.vyska/2),
            sirka: 60,
            vyska: 60,
            rychlost: nahodneCislo(1,3)
        };

        //nový vir přidáváme do seznamu
        VsechnyViry.push(novyVir);

        //ihned umístíme vir na správnou pozici na obrazovce
        umistiObjekt(novyVir);
  }

  //funknce pro pohyb padajících vajec
  function posunVsechnaVejce () {
      //projdeme všechny vejce v poli
      for (let i = 0; i < VsechnaVejce.length; i++) {
          //posuneme dárek směrem dolů
          VsechnaVejce[i].y = VsechnaVejce[i].y + VsechnaVejce[i].rychlost;

          //změníme polohu dárku na obrazovce
          umistiObjekt(VsechnaVejce[i]);
      }
  }
  
    //funknce pro pohyb padajících virů
    function posunVsechnyViry () {
        //projdeme všechny viry v poli
        for (let i = 0; i < VsechnyViry.length; i++) {
            //posuneme dárek směrem dolů
            VsechnyViry[i].y = VsechnyViry[i].y + VsechnyViry[i].rychlost;
  
            //změníme polohu viru na obrazovce
            umistiObjekt(VsechnyViry[i]);
        }
    }

  //funkce pro testování pdajících dárků
  //- dopadl dárek na zem?
  //- chytil dárek robot?
  function otestujVsechnaVejce() {
    //projdeme pozpátku všechny dárky v poli
    for (let i = VsechnaVejce.length - 1; i >=0; i--) {  
        
        if (protnutiObdelniku(robot, VsechnaVejce[i])) {
            //obrázek dárku se protnul s obrázkem robota = robot sebral dárek
            //odstraníme sebraný dárek ze hry
            odstranVejce(i);

            //zvětšíme skóre
            zvetsiSkore();

            //přičteme čas a zobrazíme
            hra.cas = hra.cas + 3;
            zobrazCas();

            //přehraj zvuk sebraného dárku
            hra.zvukSebrano.play();
   
        } else if (VsechnaVejce[i].y + VsechnaVejce[i].vyska > hra.vyska) {
            //dopadl dárek na zem?
            //odstraníme dárek
            odstranVejce(i);

            //odečteme čas a zobrazíme
            hra.cas = hra.cas - 10; 

            //přehraj zvuk nárazu na zem
            hra.zvukNaraz.play();
        }
    }
  }

//funkce pro testování pdajících virů
  //- dopadl vir na zem?
  //- chytil vir robot?
  function otestujVsechnyViry() {
    //projdeme pozpátku všechny dárky v poli
    for (let i = VsechnyViry.length - 1; i >=0; i--) {  
        
        if (protnutiObdelniku(robot, VsechnyViry[i])) {
            //obrázek viru se protnul s obrázkem robota = robot sebral vir
            //odstraníme sebraný dárek ze hry
            odstranVir(i);

            //přičteme čas a zobrazíme
            hra.cas = hra.cas - 10;
            zobrazCas();

            //přehraj zvuk sebraného viru
            hra.zvukUtok.play();
   
        } else if (VsechnyViry[i].y + VsechnyViry[i].vyska > hra.vyska) {
            //dopadl dárek na zem?
            //odstraníme dárek
            odstranVir(i);

            //přehraj zvuk nárazu na zem
            hra.zvukNaraz.play();
        }
    }
  }

  function odstranVejce(index) {
            //odstraníme obrázek dárku z herní plochy
            VsechnaVejce[index].element.remove();
            //smažeme herní objekt z pole dárků
            VsechnaVejce.splice(index, 1);
  }

  function odstranVir(index) {
    //odstraníme obrázek viru z herní plochy
    VsechnyViry[index].element.remove();
    //smažeme herní objekt z pole dárků
    VsechnyViry.splice(index, 1);
}

  //funkce generuje náhodné číslo od dolniLimit do hortniLimit (oba včetně)
  function nahodneCislo(dolniLimit, horniLimit) {
      return dolniLimit + Math.floor(Math.random() * (horniLimit - dolniLimit + 1));
  }

  //funkce odpočítává čas do shození nového dárku
  function cekejNaDalsiVejce() {
      if (hra.dalsiVejce === 0) {
          //odpočet je na 0 do hry přidáme další dárek
          pridejVejce();

          //vygenerujeme náhodný čas v rozmezí  -  vteřin
          //odpočítává se x za vteřinu, takže potřebujeme číslo  - 50-250
          hra.dalsiVejce = nahodneCislo(50, 250);
      } else {
          //odpočet ještě není na 0, tak ho snížíme o 1
          hra.dalsiVejce--;
      }
  }

  //funkce odpočítává čas do shození nového viru
  function cekejNaDalsiVir() {
    if (hra.dalsiVir === 0) {
        //odpočet je na 0 do hry přidáme další vir
        pridejVir();

        //vygenerujeme náhodný čas v rozmezí  -  vteřin
        //odpočítává se x za vteřinu, takže potřebujeme číslo  - 50-250
        hra.dalsiVir = nahodneCislo(150, 350);
    } else {
        //odpočet ještě není na 0, tak ho snížíme o 1
        hra.dalsiVir--;
    }
}

  //funkce pro zjištění protnutí obdélníku
  //jako parametr se předávají dva herní objekty
  //funkce vrací true/false, podle toho, zda ke kolizi dochází nebo ne
  function protnutiObdelniku (a, b) {
      if (a.x + a.sirka < b.x
        || b.x + b.sirka < a.x
        || a.y + a.vyska < b.y
        || b.y + b.vyska < a.y) {
            //obdélníky se neprotínají
            return false;
        } else {
            //obdélníky se protínají
            return true;
        }
  }

  //zvětší skóre o 1 a vypíše ho na obrazovku
  function zvetsiSkore () {
      //zvětšíme o 1
      hra.skore++;
      //vypíšeme do prvku v hlavičce hry
      hra.skoreElement.textContent = hra.skore;
  }


  //přepínání obrazovky
  function prepniObrazovku(obrazovka) {
      //nejprve všechny obrazovky skryjeme
      hra.uvod.style = 'none'; //úvod
      hra.element.style = 'none'; //herní plocha
      hra.konec.style = 'none'; //závěrečná obrazovka

      //podle parametru zobrazíme příšlušnou obrazovku
      if (obrazovka === 'uvod') {

        //úvod je flexbox, nastavíme na flex
        hra.uvod.style.display = 'flex';

      } else if (obrazovka === 'hra') {

        //herní plocha je blokový prvek, nastavíme na block
        hra.element.style.display = 'block';
      } else if (obrazovka === 'konec') {

        //závěrečná obrazovka je stejně jako úvod flexbox, takže nastavíme na flex
        hra.konec.style.display = 'flex';
      }
  }

  //funknce pro zobrazení úvodu hry
  function uvodHry () {
      //přepne na úvodní obrazovku
      prepniObrazovku('uvod');

      //na tlačítku budeme čekat na kliknutí
      //při kliknutí zavoláme startHry
      hra.tlacitkoStart.addEventListener('click', startHry);

      //čekáme na kliknutí na tlačítko na závěrečné stránce
      hra.tlacitkoZnovu.addEventListener('click', startHry);
  }

  //zobrazí závěrečnou obrazovku a vypíše do ní dosažené skóre
  function konecHry() {
  

    //zastavíme časovač, který se 50x za vteřinu stará o běh hry
    clearInterval(hra.casovac);

    //zrušíme posluchač události, který čeká na stisk klávesy
    document.removeEventListener('keydown', priStiskuKlavesy);

    //vymažeme dárky, které zůstaly na herní ploše
    odeberVsechnaVejce();

    //vymažeme viry, které zůstaly na herní ploše
    odeberVsechnyViry();

    //konec hry - zvuk 
    hra.zvukGameOver.play();
    
    //přepneme na závěrečnou obrazovku
    prepniObrazovku('konec');

    


    //podle dosaženého skóre vypíšeme hlášku
    if (hra.skore === 0) {

        hra.vysledek.textContent = 'Hmmh, tady se někomu nechtělo hrát, že?';
    
    } else if (hra.skore === 1) {
        hra.vysledek.textContent = 'Jedno vejce? Vážně?';
    
    } else if (hra.skore < 5) {
        hra.vysledek.textContent = 'Chytil jsi ' + hra.skore + ' vejce. Tolik času jsem nad tím strávila, a to všechno jen pro ' + hra.skore + ' vejce? Myslím, že si tady někdo zaslouží další pokus.';
    
    } else {

        hra.vysledek.textContent = 'Výborně, chytil(a) jsi ' + hra.skore + ' vajec. To není špatný, uvážíme-li, že je to hra pro dětičky. Přeji hezké a nepromořené Velikonoce :-)';
    }
  }

  //zobrazí čas ve formátu mm:ss v hlaviččce hry
  function zobrazCas() {
      //nikdy nechceme zobrazit čas menší než 0, takže je-li čas menší než 0, nastavíme ho na 0
      if (hra.cas < 0) {
          hra.cas = 0;
      }

      //z celkového počtu vteřin spočítáme minuty a vteřiny
      let minuty = Math.floor(hra.cas / 60);
      let vteriny = Math.round(hra.cas - minuty*60);

      //spočítané vteřiny a minuty převedemne na formát mm:ss
      let naformatovanyCas = ('00' + minuty).slice(-2) + ':' + ('00' + vteriny).slice(-2);

      //naformátovaný čas vypíšeme na obrazovku
      hra.casElement.textContent = naformatovanyCas;
  }

  function aktualizujCas() {
      //odečteme od času 1/50 vteřiny
      hra.cas = hra.cas - 0.02;

        //zobrazíme aktualizovaný čas
        zobrazCas();
  }

  //odstraní všechny dárky z herní plochy při skončení hry
  function odeberVsechnaVejce() {
    //projdeme všechny dárky v seznamu
    for (let i = 0; i < VsechnaVejce.length; i++) {
        //a smažeme z herní plochy jejich obrázky
        VsechnaVejce[i].element.remove();
    }
    //vyprázdníme pole dárků
    VsechnaVejce = [];
  }

  //odstraní všechny viry z herní plochy při skončení hry
  function odeberVsechnyViry() {
    //projdeme všechny viry v seznamu
    for (let i = 0; i < VsechnyViry.length; i++) {
        //a smažeme z herní plochy jejich obrázky
        VsechnyViry[i].element.remove();
    }
    //vyprázdníme pole virů
    VsechnyViry = [];
  }

