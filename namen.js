/* ==========================================================================
   namen.js — die Namenskartei, ein Eintrag je Land
   --------------------------------------------------------------------------
   Bis 35.42 hingen 212 Nationen an 21 Sprachraeumen, von denen SIEBEN leer
   waren. Ein Chinese hiess Lukas Brandt, ein Suedkoreaner Sota Nakagawa, ein
   Finne Mikkel Halvorsen. Gemessen am 24.8.2026: 46 Nationen fielen auf die
   deutsche Liste zurueck.

   Diese Datei loest das Land vom Sprachraum. Jedes Land bekommt einen eigenen
   Eintrag. Laender, die sich eine Namenskultur wirklich teilen, duerfen auf
   eine gemeinsame Grundmenge zeigen und eigene Namen ergaenzen — Antigua und
   Barbados teilen sich das anglokaribische Erbe, das ist keine Nachlaessigkeit
   sondern die Sache selbst. Erfundene Unterschiede waeren schlimmer als
   ehrlich geteilte Listen.

   ---- DIE HERKUNFTSMARKE (`q`) ---------------------------------------------
   Das Wichtigste an dieser Datei. Ich kenne die haeufigsten Namen von
   Deutschland, Brasilien, Japan, Nigeria belastbar. Von Tuvalu, Nauru, Bhutan
   und den Komoren nicht. Wer dort plausibel klingende Namen erfindet, baut
   etwas, das authentisch AUSSIEHT und es nicht ist — und das faellt danach
   niemandem mehr auf.

     q: 3   gesichert — haeufige, belegbare Namen des Landes
     q: 2   regional abgeleitet — die Sprachfamilie stimmt, die Haeufigkeit
            ist nicht gepruefte Kenntnis
     q: 1   duenn — Platzhalter aus der Nachbarschaft, gehoert nachgeschaerft

   `pruefstand/namenpruefung.cjs` zaehlt die Marken und nennt die duennen
   Eintraege beim Namen. So steht im Bericht, wo Arbeit liegt, statt dass es
   sich in 8.000 Namen versteckt.

   ---- AUFBAU (`bau`) -------------------------------------------------------
     "VN"    Vorname Nachname                      (Vorgabe)
     "NV"    Nachname Vorname — ostasiatische Ordnung
     "VNN"   Vorname + zwei Nachnamen              (spanisch, portugiesisch)
     "VMN"   Vorname Mittelname Nachname
     "VpN"   Vorname + Partikel + Nachname         (bin, van der, de)

   `v` maennliche Vornamen · `w` weibliche Vornamen · `n` Nachnamen
   `m` Mittelnamen/Partikel, nur wo `bau` sie braucht
   `erbt` zeigt auf einen anderen Eintrag; eigene Felder ueberschreiben ihn.
   ========================================================================== */

export function machNamen() {
  /* ---- Gemeinsame Grundmengen -------------------------------------------
     Nur dort, wo Laender WIRKLICH dieselbe Namenskultur haben. Jede davon
     wird von mindestens zwei Laendern benutzt, sonst waere sie ueberfluessig. */
  const G = {};

  /* Anglokaribik: englische Vornamen, Nachnamen aus der Sklaverei- und
     Plantagengeschichte — daher britische Familiennamen in hoher Dichte. */
  G.karibik_en = {
    v: ["Andre", "Dwight", "Kevon", "Shaquille", "Tyrese", "Jamal", "Kishawn",
        "Akeem", "Trevaughn", "Rondell", "Deshawn", "Kemar", "Javon", "Nigel",
        "Ricardo", "Shane", "Omari", "Tevin", "Damion", "Curtis"],
    w: ["Shanice", "Alicia", "Kayla", "Tanisha", "Shakira", "Renee", "Camille",
        "Latoya", "Britney", "Chantelle", "Nadine", "Simone"],
    n: ["Joseph", "Charles", "Williams", "Thomas", "Francis", "Edwards",
        "Peters", "James", "Samuel", "Christopher", "George", "Benjamin",
        "Alexander", "Phillip", "Daniel", "Matthew", "Isaac", "Solomon",
        "Emmanuel", "Nathaniel"],
  };

  /* Polynesien: Vornamen oft biblisch (Missionsgeschichte), Nachnamen
     einheimisch. Das ist die belegbare Struktur; die Einzelnamen je Insel
     kenne ich nur teilweise, daher q:2 bei den meisten. */
  G.polynesien = {
    v: ["Sione", "Viliami", "Taniela", "Semisi", "Paula", "Mosese", "Lopeti",
        "Tevita", "Malakai", "Filipe", "Sitiveni", "Alipate", "Kelepi", "Manu",
        "Ioane", "Tomasi", "Peni", "Samiu", "Latu", "Vaea"],
    w: ["Ana", "Losa", "Mele", "Sela", "Ofa", "Lupe", "Salote", "Mata",
        "Talia", "Sina", "Fetu", "Moana"],
    n: ["Tupou", "Fifita", "Taufa", "Vaka", "Havili", "Latu", "Piukala",
        "Kaufusi", "Ngata", "Ma'afu", "Tuita", "Fonua", "Halaifonua",
        "Lolohea", "Uluakiola", "Tapueluelu", "Moala", "Puloka"],
  };

  /* Mikronesien: eigene Sprachfamilie, spanische und deutsche Spuren aus der
     Kolonialzeit, dazu biblische Vornamen. */
  G.mikronesien = {
    v: ["Jayson", "Berdon", "Kimson", "Dilnes", "Elmer", "Rickson", "Sylvester",
        "Manuel", "Fransisco", "Junior", "Bruno", "Herman", "Lyndon", "Anton",
        "Wilson", "Kenye", "Rodney", "Marcus"],
    w: ["Marlyn", "Rosita", "Jelinda", "Marleen", "Sabina", "Kiyomi",
        "Tarleen", "Anita", "Merina", "Loreen", "Bernice", "Jolina"],
    n: ["Nakamura", "Silbanuz", "Ligohr", "Panuelo", "Sigrah", "Mori",
        "Elimo", "Aisek", "Hadley", "Weilbacher", "Etscheit", "Kephas",
        "Salik", "Loyola", "Alik", "Note", "Kabua", "Zackios"],
  };

  /* Melanesien (Papua, Salomonen, Vanuatu): Pidgin-gepraegte Vornamen,
     Nachnamen aus lokalen Sprachen — es gibt in PNG allein ueber 800. */
  G.melanesien = {
    v: ["Nigel", "Raymond", "Tommy", "Jacob", "Emmanuel", "David", "Michael",
        "Benjamin", "Samuel", "Peter", "Joseph", "Ronald", "Alwin", "Gideon",
        "Kolu", "Timothy", "Freddy", "Hendrix", "Bradley", "Kensi"],
    w: ["Grace", "Ruth", "Naomi", "Esther", "Miriam", "Rachel", "Lydia",
        "Hannah", "Dorcas", "Priscilla", "Rebecca", "Sarah"],
    n: ["Dabinyaba", "Warpit", "Gerry", "Bala", "Kaltack", "Iwai", "Maemae",
        "Talasasa", "Wasi", "Nanau", "Manu'ari", "Havea", "Bibi", "Tuita",
        "Lulee", "Sam", "Wagi", "Aisa", "Bomai", "Kanam"],
  };

  /* Turksprachen Zentralasiens: gemeinsame Vornamenschicht (persisch-arabisch
     ueberformt), Nachnamen mit russischen Endungen aus der Sowjetzeit. */
  G.zentralasien = {
    nw: "a",   /* Toshmatov -> Toshmatova */
    v: ["Rustam", "Aziz", "Farrukh", "Bekzod", "Otabek", "Sardor", "Jasur",
        "Ulugbek", "Timur", "Islom", "Sanjar", "Nodir", "Alisher", "Dilshod",
        "Shohruh", "Anvar", "Bahodir", "Jahongir", "Murod", "Zafar"],
    w: ["Nilufar", "Dilnoza", "Zarina", "Malika", "Gulnora", "Sevara",
        "Kamila", "Nargiza", "Feruza", "Shahnoza", "Aziza", "Madina"],
    n: ["Nazarov", "Ergashev", "Yusupov", "Ismoilov", "Rahimov", "Karimov",
        "Toshmatov", "Abdullaev", "Sharipov", "Turaev", "Bekmurodov",
        "Qodirov", "Xolmatov", "Umarov", "Saidov", "Juraev", "Mirzaev",
        "Ochilov", "Hasanov", "Nurmatov"],
  };

  /* ---- Die Laenderkartei -------------------------------------------------
     Reihenfolge: die sieben bisher LEEREN Raeume zuerst, danach die
     Trennungen, die sachlich falsch waren. Der Rest folgt in weiteren
     Fassungen — jeder Eintrag traegt seine Marke, die Luecken sind sichtbar. */
  const L = {};

  /* ===== cn — Ostasien, chinesischer Sprachraum ===== */
  L.CHN = { q: 3, bau: "NV",
    v: ["Wei", "Hao", "Jun", "Lei", "Yang", "Peng", "Chao", "Bin", "Tao",
        "Kai", "Xiang", "Zhe", "Cheng", "Yu", "Ming", "Long", "Feng", "Qiang",
        "Bo", "Xin"],
    w: ["Ying", "Li", "Fang", "Na", "Jing", "Xiu", "Yan", "Min", "Hui",
        "Lan", "Mei", "Qing"],
    n: ["Wang", "Li", "Zhang", "Liu", "Chen", "Yang", "Huang", "Zhao", "Wu",
        "Zhou", "Xu", "Sun", "Ma", "Zhu", "Hu", "Guo", "He", "Lin", "Gao",
        "Luo"] };
  L.HKG = { q: 3, erbt: "CHN",
    v: ["Ka Ho", "Chun Lok", "Wai Lun", "Tsz Chun", "Ho Yin", "Kin Wai",
        "Man Fai", "Chi Hong", "Yat Long", "Cheuk Hin", "Hei Chun", "Wing Kit",
        "Pak Hin", "Lok Yin", "Sze Kit", "Ming Yeung"],
    n: ["Chan", "Wong", "Lee", "Cheung", "Lam", "Ng", "Ho", "Cheng", "Tsang",
        "Yeung", "Lau", "Leung", "Kwok", "Tam", "Fung", "Mak"] };
  L.MAC = { q: 2, erbt: "HKG",
    n: ["Chan", "Wong", "Lei", "Cheong", "Lam", "Ho", "Ip", "Kuan", "Tam",
        "Sou", "Iong", "Chao", "Pang", "Loi"] };
  L.TPE = { q: 3, erbt: "CHN",
    n: ["Chen", "Lin", "Huang", "Chang", "Li", "Wang", "Wu", "Liu", "Tsai",
        "Yang", "Hsu", "Cheng", "Hsieh", "Kuo", "Chiu", "Tseng"] };
  L.MNG = { q: 3, bau: "NV",
    v: ["Batbayar", "Ganbold", "Enkhbat", "Tumen", "Munkhbat", "Otgonbayar",
        "Bold", "Naranbaatar", "Chuluun", "Dorj", "Erdene", "Tsogt",
        "Baatar", "Altangerel", "Sukhbat", "Gantulga", "Byambaa", "Nergui"],
    w: ["Saruul", "Oyuun", "Bolormaa", "Enkhtuya", "Narantsetseg", "Altantsetseg",
        "Uranchimeg", "Tsetsegmaa", "Delgermaa", "Odval", "Ariunaa", "Khulan"],
    n: ["Batbold", "Ganbaatar", "Enkhtaivan", "Munkhjargal", "Dashdorj",
        "Tserendorj", "Baatarsuren", "Otgonbat", "Nyamdorj", "Purevdorj",
        "Chimeddorj", "Lkhagvasuren", "Gombosuren", "Sodnom"] };

  /* ===== Korea aus dem japanischen Raum geloest ===== */
  L.KOR = { q: 3, bau: "NV",
    v: ["Min-jun", "Seo-jun", "Do-yun", "Ji-ho", "Ju-won", "Hyun-woo",
        "Jun-seo", "Ye-jun", "Si-woo", "Ha-jun", "Eun-woo", "Seung-min",
        "Heung-min", "Kang-in", "Jae-sung", "Woo-young", "Tae-hwan",
        "Sang-ho", "Young-gwon", "Jin-su"],
    w: ["Seo-yeon", "Ji-woo", "Ha-eun", "Min-seo", "Yu-jin", "Chae-won",
        "Su-bin", "Ye-eun", "Da-eun", "Hye-jin", "Na-yeon", "So-yeon"],
    n: ["Kim", "Lee", "Park", "Choi", "Jung", "Kang", "Cho", "Yoon", "Jang",
        "Lim", "Han", "Oh", "Seo", "Shin", "Kwon", "Hwang", "Ahn", "Song",
        "Ryu", "Hong"] };
  L.PRK = { q: 2, erbt: "KOR",
    v: ["Yong-jik", "Kwang-song", "Chol-min", "Kum-il", "Song-chol",
        "Il-gwan", "Kuk-chol", "Yu-song", "Hyok-chol", "Myong-jun",
        "Ryong-guk", "Chung-guk", "Kyong-il", "Un-chol", "Song-hyok", "Jin-il"] };
  L.JPN = { q: 3, bau: "NV",
    v: ["Sota", "Ren", "Yuto", "Haruto", "Riku", "Kaito", "Sora", "Yuma",
        "Hinata", "Takumi", "Daiki", "Sho", "Kenta", "Ryo", "Yusuke", "Kota",
        "Naoki", "Tatsuya", "Hiroki", "Shunsuke"],
    w: ["Yui", "Aoi", "Sakura", "Hina", "Rin", "Mei", "Yuna", "Koharu",
        "Akari", "Nanami", "Miyu", "Ichika"],
    n: ["Sato", "Suzuki", "Takahashi", "Tanaka", "Ito", "Watanabe", "Yamamoto",
        "Nakamura", "Kobayashi", "Kato", "Yoshida", "Yamada", "Sasaki",
        "Yamaguchi", "Matsumoto", "Inoue", "Kimura", "Hayashi", "Shimizu",
        "Saito"] };

  /* ===== se — Suedostasien, je Land eigene Sprache ===== */
  L.VIE = { q: 3, bau: "NV",
    v: ["Van Hau", "Quang Hai", "Cong Phuong", "Duc Chinh", "Tien Linh",
        "Hoang Duc", "Van Toan", "Ngoc Hai", "Trong Hoang", "Van Lam",
        "Minh Vuong", "Tuan Anh", "Duy Manh", "Xuan Truong", "Van Thanh",
        "Thanh Chung"],
    w: ["Thi Lan", "Ngoc Anh", "Thu Ha", "Kim Chi", "Minh Thu", "Hong Nhung",
        "Thuy Linh", "Mai Anh", "Bich Ngoc", "Phuong Thao", "Hai Yen", "Kieu Trinh"],
    n: ["Nguyen", "Tran", "Le", "Pham", "Hoang", "Phan", "Vu", "Dang", "Bui",
        "Do", "Ho", "Ngo", "Duong", "Ly", "Dinh", "Truong"] };
  L.THA = { q: 3,
    v: ["Chanathip", "Teerasil", "Theerathon", "Sarach", "Kawin", "Adisak",
        "Sanrawat", "Ekanit", "Supachai", "Weerathep", "Tristan", "Peeradon",
        "Sasalak", "Bordin", "Worachit", "Suphanat"],
    w: ["Siriporn", "Kanjana", "Napaporn", "Pimchanok", "Wanida", "Suchada",
        "Nattaya", "Praewa", "Chompoo", "Malee", "Ratana", "Duangjai"],
    n: ["Songkrasin", "Dangda", "Bunmathan", "Yooyen", "Indra-Charoen",
        "Kaewprom", "Chaowana", "Sukha", "Promsuwan", "Wongchai", "Saengsanit",
        "Thongkanya", "Rattanawong", "Boonmathan", "Pinyo", "Srisuwan"] };
  L.IDN = { q: 3,
    v: ["Egy", "Witan", "Asnawi", "Pratama", "Rizky", "Bagus", "Marselino",
        "Rachmat", "Dendy", "Arhan", "Ramadhan", "Yakob", "Ilham", "Saddil",
        "Irfan", "Hansamu"],
    w: ["Siti", "Dewi", "Ayu", "Putri", "Indah", "Rina", "Sari", "Nur",
        "Wulan", "Ratna", "Melati", "Anggun"],
    n: ["Wijaya", "Santoso", "Kusuma", "Setiawan", "Nugroho", "Saputra",
        "Hidayat", "Pratama", "Ramadhan", "Firmansyah", "Maulana", "Susanto",
        "Gunawan", "Wibowo", "Hartono", "Suryanto"] };
  L.PHI = { q: 3, bau: "VNN",
    v: ["Neil", "Stephan", "Amani", "Jefferson", "Patrick", "Mike", "Kevin",
        "Carlo", "Marvin", "Justin", "Jarvey", "Oskari", "Manuel", "Angel",
        "Christian", "Daisuke"],
    w: ["Maria", "Angeline", "Kristine", "Jasmine", "Camille", "Nicole",
        "Patricia", "Danielle", "Sofia", "Andrea", "Katrina", "Chelsea"],
    n: ["Santos", "Reyes", "Cruz", "Bautista", "Ocampo", "Garcia", "Mendoza",
        "Torres", "Ramos", "Aguilar", "Castillo", "Villanueva", "Dela Cruz",
        "Gonzales", "Fernandez", "Manalo"] };
  L.MAS = { q: 3, bau: "VpN", m: ["bin"], mw: ["binti"],
    v: ["Safawi", "Faisal", "Syafiq", "Akhyar", "Hadi", "Aidil", "Shahrul",
        "Nazmi", "Danial", "Arif", "Zaquan", "Matthew", "Dominic", "Junior",
        "Khuzaimi", "Azam"],
    w: ["Nurul", "Siti", "Aisyah", "Farah", "Amirah", "Nadia", "Syafiqah",
        "Hana", "Izzati", "Alia", "Wardina", "Zulaikha"],
    n: ["Rasid", "Halim", "Ahmad", "Ismail", "Yusof", "Hassan", "Rahman",
        "Salleh", "Aziz", "Karim", "Osman", "Latif", "Sulaiman", "Ibrahim",
        "Zainal", "Mokhtar"] };
  L.SIN = { q: 2, erbt: "MAS",
    v: ["Hariss", "Faris", "Ikhsan", "Shawal", "Amirul", "Zulfahmi", "Song Ui",
        "Adam", "Jacob", "Ryhan", "Irfan", "Hafiz", "Kim Lim", "Wei Jian",
        "Zharfan", "Naqiuddin"],
    n: ["Harun", "Ramli", "Fandi", "Sahdan", "Tan", "Lim", "Ong", "Goh",
        "Ang", "Chua", "Rahman", "Hassan", "Iskandar", "Yusof"] };
  /* Myanmar kennt keine Familiennamen — der ganze Name ist EIN Eintrag.
     Damit haengt die Vielfalt allein an der Laenge dieser Liste: bei 16
     Eintraegen gab es 16 moegliche Burmesen im ganzen Spiel. Deshalb hier
     als einzige Kartei bewusst mehr als anderswo. */
  L.MYA = { q: 2, bau: "V",
    v: ["Aung Thu", "Kyaw Ko Ko", "Maung Maung Lwin", "Zaw Min Tun",
        "Hein Thiha", "Nanda Kyaw", "Ye Yint", "Thet Naing", "Myat Kaung",
        "Zin Min", "Soe Moe", "Win Naing", "Kyi Lin", "Hlaing Bo",
        "Thiha Sithu", "Nyein Chan", "Aung Kaung Mann", "Myat Ko Ko",
        "Zaw Ye Tun", "Si Thu Aung", "Yan Naing Oo", "Hein Htet",
        "Kaung Sithu", "Phyo Ko Ko", "Thurein Soe", "Nay Lin Tun",
        "Min Kyaw Khant", "Aung Naing Win", "Htet Phyo Wai", "Kyaw Min Oo",
        "Zin Phyo", "Wai Lin Aung", "Thet Hein Soe", "Pyae Phyo Aung",
        "Naing Zin Htet", "Soe Thura", "Yan Kyaw Htwe", "Myo Ko Tun",
        "Khant Zaw Hein", "Aung Kyaw Naing"],
    w: ["Ei Ei", "Khin Than", "Mya Mya", "Nwe Nwe", "Su Su", "Thida",
        "Yamin", "Aye Aye", "Hla Hla", "Moe Moe", "Nilar", "Zin Mar",
        "Khin Myat", "Thin Thin", "Hnin Wai", "May Thu", "Sandar Win",
        "Ei Mon", "Yu Yu", "Chaw Su", "Nan Htike", "Phyu Phyu",
        "Wai Wai", "Htet Htet"],
    n: [""] };
  L.KHM = { q: 2, bau: "NV",
    v: ["Chanvathanaka", "Sokumpheak", "Sieng", "Vathanaka", "Sothearath",
        "Piseth", "Boripo", "Sokpheng", "Rithy", "Sovannara", "Dara",
        "Visal", "Makara", "Bunthoeun", "Samnang", "Kosal"],
    w: ["Sreymom", "Sokha", "Chanthou", "Bopha", "Kanha", "Sophea", "Davy",
        "Sreyneang", "Chenda", "Mealea", "Sokunthea", "Nary"],
    n: ["Chan", "Keo", "Sok", "Kim", "Prak", "Sam", "Nhem", "Thy", "Ouk",
        "Chhin", "Meas", "Yin", "Hen", "Long", "Ly", "Vong"] };
  L.LAO = { q: 2,
    v: ["Souliyavong", "Khampheng", "Bounlap", "Somsanith", "Vilayvanh",
        "Phatthana", "Kanlaya", "Souksavath", "Thongsavanh", "Bounma",
        "Khamla", "Sengphet", "Viengsavanh", "Anousone", "Somphone", "Khamking"],
    w: ["Manivanh", "Somchit", "Phonesavanh", "Khamphone", "Bouasone",
        "Vilaykone", "Chanthala", "Souphaphone", "Naly", "Keomany",
        "Phetsamone", "Douangchanh"],
    n: ["Sayavongsa", "Vongchiengkham", "Phommachanh", "Keomanivong",
        "Sisomphone", "Latsaphao", "Khampheng", "Inthavong", "Douangdala",
        "Vilaysack", "Sengsavang", "Xaypanya", "Manivong", "Bounthavy"] };
  L.BRU = { q: 1, erbt: "MAS",
    n: ["Abdullah", "Hamzah", "Kasim", "Sharbini", "Duraman", "Jaafar",
        "Momin", "Tuah", "Zainuddin", "Mahmud"] };
  L.TLS = { q: 1, erbt: "IDN",
    n: ["da Costa", "Soares", "Pereira", "de Jesus", "Fernandes", "Guterres",
        "Amaral", "Sarmento", "Belo", "Lopes", "Ximenes", "Alves"] };

  /* ===== in — Suedasien ===== */
  L.IND = { q: 3,
    v: ["Sunil", "Gurpreet", "Sandesh", "Anirudh", "Rahul", "Ashique",
        "Manvir", "Liston", "Brandon", "Vikram", "Arjun", "Rohit", "Amit",
        "Sahal", "Jeakson", "Naorem"],
    w: ["Priya", "Anjali", "Pooja", "Neha", "Divya", "Kavita", "Shreya",
        "Aarti", "Meena", "Sunita", "Ritu", "Nisha"],
    n: ["Chhetri", "Singh", "Sharma", "Kumar", "Patel", "Reddy", "Nair",
        "Gowda", "Jhingan", "Rana", "Thapa", "Das", "Sahoo", "Mandal",
        "Yadav", "Verma", "Mishra", "Naik", "Fernandes", "Colaco"] };
  L.PAK = { q: 3,
    v: ["Hassan", "Ali", "Bilal", "Usman", "Zahid", "Saddam", "Yousuf",
        "Rehman", "Adnan", "Kaleemullah", "Faisal", "Umair", "Shahzad",
        "Rizwan", "Nabi", "Waleed"],
    w: ["Ayesha", "Fatima", "Zainab", "Mariam", "Hina", "Sana", "Amna",
        "Rabia", "Sadia", "Iqra", "Nimra", "Kiran"],
    n: ["Khan", "Ahmed", "Malik", "Butt", "Cheema", "Qureshi", "Bhatti",
        "Shah", "Iqbal", "Hussain", "Raza", "Mehmood", "Nawaz", "Aslam",
        "Farooq", "Sheikh"] };
  L.BAN = { q: 3,
    v: ["Jamal", "Topu", "Rakib", "Mohammad", "Sohel", "Tariq", "Biplu",
        "Robiul", "Masuk", "Jewel", "Anisur", "Shakhawat", "Rimon", "Sabbir",
        "Foysal", "Elita"],
    w: ["Sabina", "Krishna", "Maria", "Rupna", "Shamsunnahar", "Monika",
        "Ritu", "Sanjida", "Masura", "Tohura", "Anucing", "Sultana"],
    n: ["Bhuyan", "Barman", "Hossain", "Islam", "Rahman", "Ahmed", "Sarker",
        "Chowdhury", "Mia", "Uddin", "Akter", "Das", "Roy", "Molla",
        "Talukder", "Sheikh"] };
  L.SRI = { q: 2,
    v: ["Chalana", "Mohamed", "Dilan", "Sujan", "Kavindu", "Ahmed", "Ishan",
        "Duckson", "Hashan", "Charitha", "Nuwan", "Sameera", "Tharindu",
        "Lakshan", "Nipun", "Sudesh"],
    w: ["Nimali", "Chamari", "Dilhani", "Sanduni", "Ishara", "Kumari",
        "Sewwandi", "Malsha", "Hasini", "Anoma", "Thilini", "Nadeeka"],
    n: ["Perera", "Fernando", "Silva", "de Silva", "Jayasuriya", "Bandara",
        "Rathnayake", "Wickramasinghe", "Gunawardena", "Dissanayake",
        "Weerasinghe", "Kumara", "Herath", "Mendis"] };
  L.NEP = { q: 2,
    v: ["Kiran", "Anjan", "Bimal", "Rohit", "Sujal", "Ananta", "Suman",
        "Bishal", "Nawayug", "Tejash", "Arik", "Ayush", "Sunil", "Dinesh",
        "Manish", "Sandip"],
    w: ["Sabitra", "Anita", "Rekha", "Preeti", "Sarita", "Manisha", "Gita",
        "Sunita", "Kabita", "Renuka", "Bimala", "Nirmala"],
    n: ["Chemjong", "Bista", "Gharti Magar", "Rai", "Limbu", "Tamang",
        "Shrestha", "Thapa", "Gurung", "Khadka", "Adhikari", "Karki",
        "Basnet", "Pradhan", "Maharjan", "Lama"] };
  L.MDV = { q: 2,
    v: ["Ali", "Ahmed", "Ibrahim", "Hassan", "Hussain", "Mohamed", "Naiz",
        "Akram", "Hamza", "Sifan", "Nazeeh", "Rilwan", "Shafiu", "Imran",
        "Assadhulla", "Nashid"],
    w: ["Aishath", "Fathimath", "Mariyam", "Hawwa", "Aminath", "Khadeeja",
        "Shifana", "Nazima", "Raufa", "Sheeza", "Zahira", "Leena"],
    n: ["Ashfaq", "Faseeh", "Rasheed", "Naseer", "Latheef", "Waheed",
        "Shareef", "Saleem", "Zahir", "Nizam", "Fayaz", "Riyaz", "Adam",
        "Yoosuf"] };
  L.BHU = { q: 1,
    v: ["Chencho", "Karma", "Tshering", "Nima", "Sonam", "Kinley", "Ugyen",
        "Jigme", "Phuntsho", "Dorji", "Sangay", "Namgay", "Yeshey", "Tandin",
        "Pema", "Wangchuk"],
    w: ["Deki", "Choden", "Dema", "Zangmo", "Lhamo", "Yangchen", "Tshomo",
        "Wangmo", "Selden", "Pelden", "Kezang", "Sonam"],
    n: ["Gyeltshen", "Dorji", "Wangdi", "Tshering", "Namgyel", "Penjor",
        "Rinzin", "Wangchuk", "Zangpo", "Norbu", "Lhendup", "Tobgay"] };

  /* ===== tk — Zentralasien ===== */
  L.UZB = { q: 3, erbt: "zentralasien" };
  L.KAZ = { q: 3, nw: "a", erbt: "zentralasien",
    v: ["Nurlan", "Bauyrzhan", "Yerlan", "Askhat", "Dias", "Islambek",
        "Serikzhan", "Abzal", "Yan", "Maxim", "Aleksandr", "Ruslan",
        "Baktiyar", "Zhaslan", "Gafurzhan", "Ayan"],
    n: ["Islamkhan", "Zhukov", "Abdulin", "Tagybergen", "Suyumbayev",
        "Kuat", "Bystrov", "Erlanov", "Nurgaliev", "Bekbolat", "Sadykov",
        "Zainutdinov", "Kaseinov", "Alip"] };
  L.KGZ = { q: 2, erbt: "zentralasien",
    n: ["Israilov", "Murzaev", "Bekbolotov", "Kichin", "Lux", "Musabekov",
        "Sydykov", "Zhyrgalbekov", "Abdurakhmanov", "Baymatov", "Shamshiev",
        "Kozubaev"] };
  L.TJK = { q: 2, erbt: "zentralasien",
    v: ["Nuriddin", "Manuchehr", "Parvizdzhon", "Komron", "Alisher", "Ehson",
        "Shahrom", "Vahdat", "Rustam", "Amirbek", "Zoir", "Farrukh",
        "Siyovush", "Tabrezi", "Sheriddin", "Akhtam"],
    n: ["Davronov", "Dzhalilov", "Umarbayev", "Panjshanbe", "Rabimov",
        "Nazarov", "Hanonov", "Boboev", "Samiev", "Ergashev", "Tursunov",
        "Sharipov"] };
  L.TKM = { q: 1, erbt: "zentralasien",
    n: ["Annadurdyyev", "Amanov", "Orazsahedov", "Mingazow", "Hojanepesow",
        "Ovekov", "Saparow", "Gurbanow", "Atayew", "Meredow", "Nurmyradow",
        "Berdiyew"] };
  L.AZE = { q: 3, nw: "a",
    v: ["Emin", "Rahid", "Ramil", "Mahir", "Renat", "Anton", "Bahlul",
        "Elvin", "Tural", "Ozan", "Ismayil", "Rufat", "Hojjat", "Abbas",
        "Kamran", "Nariman"],
    w: ["Aysel", "Leyla", "Nigar", "Gunel", "Sevinj", "Aygun", "Turkan",
        "Lala", "Ulviyya", "Zeynab", "Narmin", "Konul"],
    n: ["Mahmudov", "Aliyev", "Guliyev", "Hasanov", "Ismayilov", "Huseynov",
        "Mammadov", "Rahimov", "Qurbanov", "Nuriyev", "Bayramov", "Sadigov",
        "Abdullayev", "Karimov", "Jafarov", "Musayev"] };

  /* ===== fa — persischer Raum ===== */
  L.IRN = { q: 3,
    v: ["Sardar", "Mehdi", "Alireza", "Ehsan", "Karim", "Vahid", "Saman",
        "Ramin", "Milad", "Omid", "Morteza", "Hossein", "Ali", "Reza",
        "Amir", "Shoja"],
    w: ["Fatemeh", "Zahra", "Maryam", "Sara", "Nazanin", "Elham", "Shirin",
        "Mahsa", "Parisa", "Niloofar", "Roya", "Setareh"],
    n: ["Azmoun", "Taremi", "Jahanbakhsh", "Hajsafi", "Ansarifard",
        "Amiri", "Ghoddos", "Rezaeian", "Beiranvand", "Mohammadi",
        "Cheshmi", "Nourollahi", "Karimi", "Daei", "Torabi", "Ezatolahi"] };
  L.AFG = { q: 2,
    v: ["Faysal", "Zohib", "Noor", "Omran", "Hamidullah", "Amredin",
        "Sharif", "Zubayr", "Farshad", "Maziar", "Milad", "Balal",
        "Sayed", "Mustafa", "Ahmad", "Rahmat"],
    w: ["Freshta", "Zainab", "Marina", "Hasina", "Shabnam", "Nadia",
        "Frozan", "Laila", "Roya", "Sadaf", "Nargis", "Storai"],
    n: ["Shayesteh", "Haidary", "Amiri", "Noorzai", "Zazai", "Hotak",
        "Popal", "Stanikzai", "Sadat", "Karimi", "Azizi", "Rahimi",
        "Wafa", "Nabizada"] };

  /* ===== he — Israel ===== */
  L.ISR = { q: 3,
    v: ["Eran", "Manor", "Munas", "Doron", "Oscar", "Idan", "Bibras",
        "Eli", "Sun", "Neta", "Omri", "Shon", "Dor", "Yonatan", "Gavriel",
        "Liel"],
    w: ["Noa", "Shira", "Tamar", "Yael", "Maya", "Adi", "Michal", "Roni",
        "Talia", "Hila", "Efrat", "Sivan"],
    n: ["Zahavi", "Solomon", "Dabbur", "Refaelov", "Bitton", "Peretz",
        "Natcho", "Cohen", "Levi", "Mizrahi", "Ben David", "Avraham",
        "Haziza", "Shechter", "Glazer", "Turgeman"] };

  /* ===== oc — Ozeanien ===== */
  /* Fidschi hat zwei grosse Bevoelkerungsgruppen: itaukei (melanesisch) und
     Indofidschianer. Beide Namenswelten gehoeren hinein — die biblischen
     Vornamen aus `melanesien` allein ergaeben "Dorcas Krishna". */
  L.FIJ = { q: 2, erbt: "melanesien",
    w: ["Ana", "Litia", "Merewalesi", "Sereana", "Adi", "Vani", "Priya",
        "Shalini", "Kavita", "Rashmi", "Losana", "Unaisi"],
    v: ["Roy", "Setareki", "Iosefo", "Rusiate", "Sailasa", "Napolioni",
        "Meli", "Epeli", "Taniela", "Jale", "Ratu", "Waisake", "Semi",
        "Josaia", "Filipe", "Kini"],
    n: ["Krishna", "Tawake", "Verevou", "Baleiwai", "Naidu", "Ravonu",
        "Cakau", "Waqa", "Bolatagici", "Turaganivalu", "Dunadamu", "Vunivalu"] };
  L.PNG = { q: 2, erbt: "melanesien" };
  L.SOL = { q: 2, erbt: "melanesien",
    n: ["Talasasa", "Maemae", "Nanau", "Wasi", "Faarodo", "Suri", "Omokirio",
        "Alick", "Ligiau", "Menapi", "Kaliuae", "Bore"] };
  L.VAN = { q: 1, erbt: "melanesien",
    n: ["Kaltack", "Iaruel", "Naprapol", "Tasso", "Malapa", "Wilkins",
        "Bibi", "Maki", "Lapenmal", "Salemumu"] };
  L.NCL = { q: 2,
    v: ["Georges", "Bertrand", "Cesar", "Jekob", "Roy", "Joel", "Michel",
        "Emile", "Antoine", "Marcel", "Jacques", "Olivier", "Pierre",
        "Henri", "Didier", "Laurent"],
    w: ["Marie", "Jeanne", "Elise", "Nathalie", "Sylvie", "Christine",
        "Denise", "Monique", "Josephine", "Louise", "Helene", "Claire"],
    n: ["Kayara", "Wajoka", "Gope-Fenepej", "Hmae", "Sinedo", "Boawe",
        "Nyikeine", "Poatinda", "Wamytan", "Tein", "Dokunengo", "Xowie"] };
  L.TAH = { q: 2, erbt: "polynesien",
    v: ["Teaonui", "Raimana", "Heimanu", "Tereva", "Alvin", "Yohann",
        "Manutea", "Ariitea", "Tamatoa", "Heiarii", "Vainui", "Moana",
        "Teiva", "Roonui", "Hitiroa", "Marama"],
    n: ["Tehau", "Bennett", "Chong Hue", "Vahirua", "Tetauira", "Temarii",
        "Taputu", "Hauata", "Tinorua", "Maitere", "Faarua", "Teheiura"] };
  L.SAM = { q: 2, erbt: "polynesien",
    n: ["Tuiloma", "Faaiuaso", "Leota", "Fesolai", "Tavita", "Uele",
        "Nansen", "Vaeau", "Salapo", "Iosefo", "Faalogo", "Ropati"] };
  L.ASA = { q: 1, erbt: "polynesien",
    n: ["Nicholas", "Saelua", "Fatiaki", "Toilolo", "Faiivae", "Malaeulu",
        "Tuiasosopo", "Sagapolutele", "Leuma", "Utu"] };
  L.TGA = { q: 2, erbt: "polynesien" };
  L.COK = { q: 1, erbt: "polynesien",
    n: ["Napa", "Tuara", "Maui", "Piri", "Tangata", "Marsters", "Ellis",
        "Nicholas", "Puna", "Wichman", "Tini", "Rasmussen"] };
  L.KIR = { q: 1, erbt: "mikronesien",
    n: ["Tong", "Teatao", "Kaiea", "Bwebwenibeia", "Tekanene", "Uriam",
        "Baraniko", "Iotebatu", "Tabai", "Rimon"] };
  L.TUV = { q: 1, erbt: "polynesien",
    n: ["Sopoaga", "Telavi", "Ionatana", "Paeniu", "Lauti", "Malaefono",
        "Elisala", "Iosefa", "Tausi", "Kofe"] };
  L.NRU = { q: 1, erbt: "mikronesien",
    n: ["Dowiyogo", "Adeang", "Scotty", "Aingimea", "Detudamo", "Harris",
        "Deiye", "Akua", "Batsiua", "Kun"] };
  L.PLW = { q: 1, erbt: "mikronesien",
    n: ["Remengesau", "Whipps", "Toribiong", "Ngirmang", "Sadang",
        "Ueki", "Rechelluul", "Blau", "Ongerung", "Tmetuchl"] };
  L.MHL = { q: 1, erbt: "mikronesien",
    n: ["Kabua", "Note", "Loeak", "Heine", "Zackios", "Muller", "Anjain",
        "deBrum", "Jetnil", "Silk"] };
  L.FSM = { q: 1, erbt: "mikronesien" };
  L.GUM = { q: 1, erbt: "mikronesien",
    n: ["Cruz", "Camacho", "Santos", "Perez", "Taitano", "Quinata",
        "Aguon", "Borja", "Guerrero", "Mendiola", "Blas", "Charfauros"] };

  /* ======================================================================
     en — 38 Nationen. Der groesste Block, und der mit dem schlimmsten
     Zustand: hier hingen Nigeria, Ghana, Suedafrika und Simbabwe an
     „Harry Whitmore". Die englische Amtssprache sagt nichts ueber die Namen —
     ein Nigerianer heisst Yoruba, Igbo oder Hausa, kein Nigerianer heisst
     Whitmore.
     ====================================================================== */

  /* ---- Britische Inseln: vier Laender, vier Namenswelten ---------------- */
  L.ENG = { q: 3,
    v: ["Harry", "Callum", "Reece", "Jordan", "Kyle", "Declan", "Marcus",
        "Jude", "Bukayo", "Phil", "Mason", "Jack", "Conor", "Ollie", "Tyler",
        "Lewis", "Josh", "Ben", "Charlie", "Alfie"],
    w: ["Emily", "Chloe", "Sophie", "Grace", "Millie", "Ella", "Lucy",
        "Amelia", "Isla", "Poppy", "Freya", "Evie"],
    n: ["Smith", "Jones", "Taylor", "Brown", "Wilson", "Johnson", "Davies",
        "Robinson", "Wright", "Thompson", "Walker", "White", "Hughes",
        "Green", "Hall", "Wood", "Harrison", "Clarke", "Bennett", "Foster"] };
  L.SCO = { q: 3,
    v: ["Callum", "Ryan", "Scott", "Kieran", "Andy", "Grant", "Stuart",
        "Kenny", "Lyndon", "Billy", "Greg", "Ross", "Craig", "Fraser",
        "Hamish", "Euan", "Angus", "Rory", "Dougie", "Struan"],
    w: ["Eilidh", "Isla", "Skye", "Ailsa", "Mhairi", "Catriona", "Iona",
        "Morag", "Fiona", "Kirsty", "Shona", "Rhona"],
    n: ["MacDonald", "Campbell", "Stewart", "Robertson", "Fraser", "Murray",
        "Ferguson", "MacLeod", "Cameron", "Ross", "Duncan", "Gallacher",
        "McTominay", "McGinn", "Armstrong", "Hendry", "Christie", "Forrest",
        "Bannan", "Docherty"] };
  L.WAL = { q: 3,
    v: ["Gareth", "Aaron", "Rhys", "Dylan", "Owain", "Ieuan", "Gwilym",
        "Harri", "Ethan", "Ben", "Joe", "Kieffer", "Neco", "Brennan",
        "Wes", "Sion", "Iwan", "Tomos", "Osian", "Emlyn"],
    w: ["Ffion", "Carys", "Seren", "Megan", "Bethan", "Nia", "Elin",
        "Cerys", "Lowri", "Angharad", "Rhian", "Eleri"],
    n: ["Jones", "Williams", "Davies", "Evans", "Thomas", "Roberts", "Lewis",
        "Hughes", "Morgan", "Griffiths", "Owen", "Rees", "Price", "Bale",
        "Ampadu", "Wilson", "Vaughan", "Llewellyn", "Pugh", "Meredith"] };
  L.NIR = { q: 3,
    v: ["Steven", "Jonny", "Corry", "Paddy", "Niall", "Shea", "Conor",
        "Gavin", "Trai", "Dale", "Stuart", "Ciaron", "Ross", "Isaac",
        "Callum", "Eoin", "Ruairi", "Daniel"],
    w: ["Niamh", "Aoife", "Orla", "Caitlin", "Sinead", "Roisin", "Bronagh",
        "Ciara", "Aine", "Maeve", "Clodagh", "Grainne"],
    n: ["McNair", "Evans", "Ferguson", "Magennis", "Saville", "Lafferty",
        "Dallas", "Hughes", "McCann", "Doherty", "Boyce", "Thompson",
        "Bradley", "Hume", "Charles", "Devine", "Mullan", "Ballard"] };
  L.IRL = { q: 3,
    v: ["Seamus", "Cillian", "Oisin", "Darragh", "Eoin", "Ruairi", "Fionn",
        "Padraig", "Tadhg", "Conor", "Sean", "Liam", "Adam", "Jamie",
        "Callum", "Josh", "Evan", "Matt", "Nathan", "Dara"],
    w: ["Saoirse", "Niamh", "Aoife", "Roisin", "Ciara", "Sinead", "Orla",
        "Eabha", "Caoimhe", "Maeve", "Fiadh", "Cara"],
    n: ["Murphy", "Kelly", "O'Sullivan", "Walsh", "Smith", "O'Brien",
        "Byrne", "Ryan", "O'Connor", "O'Neill", "Doyle", "McCarthy",
        "Gallagher", "Duffy", "Kennedy", "Lynch", "Egan", "Brady",
        "Ferguson", "Hourihane"] };
  L.GIB = { q: 2,
    v: ["Liam", "Roy", "Reece", "Ethan", "Kian", "Anthony", "Jayce", "Bernardo",
        "Lee", "Graeme", "Aaron", "Tjay", "Jaylan", "Nicholas", "Julian", "Louie"],
    w: ["Nadia", "Julia", "Carmen", "Sofia", "Nicole", "Emma", "Danielle",
        "Alexia", "Chloe", "Amber", "Leah", "Zara"],
    n: ["Chipolina", "Casciaro", "Sergeant", "Torrilla", "Olivero", "Pons",
        "Britto", "Valarino", "Bosio", "Coombes", "Walker", "Ronan",
        "Garcia", "Mouelhi", "Wiseman", "Lopes"] };

  /* ---- Anglophone Siedlerlaender --------------------------------------- */
  L.AUS = { q: 3, erbt: "ENG",
    v: ["Jackson", "Riley", "Mitchell", "Cooper", "Bailey", "Harrison",
        "Mathew", "Aaron", "Jamie", "Craig", "Awer", "Ajdin", "Cameron",
        "Kye", "Nestory", "Garang", "Marco", "Denis"],
    n: ["Ryan", "Mooy", "Leckie", "Boyle", "Irvine", "Rogic", "Behich",
        "Souttar", "Duke", "Hrustic", "Goodwin", "Atkinson", "Wright",
        "McGree", "Metcalfe", "Cummings", "Bos", "Miller"] };
  /* Neuseeland: Pakeha und Maori nebeneinander — beides ist Neuseeland,
     aber „Rawiri Barbarouses" mischt zwei Herkuenfte in einem Namen. */
  L.NZL = { q: 3, gruppen: [
    { v: ["Chris", "Winston", "Liberato", "Marko", "Matthew", "Michael",
          "Cam", "Joe", "Bill", "Alex", "Storm", "Ben"],
      w: ["Ruby", "Charlotte", "Amelia", "Olivia", "Ella", "Sophie",
          "Grace", "Isla", "Hannah", "Lucy"],
      n: ["Wood", "Reid", "Barbarouses", "Cacace", "Payne", "Garbett",
          "Stamenic", "Waine", "Bell", "Boxall", "Smith", "Thomas"] },
    { v: ["Tama", "Rawiri", "Manaia", "Kauri", "Nikau", "Ari", "Wiremu",
          "Tane", "Hemi", "Matiu", "Rangi", "Kahu"],
      w: ["Aroha", "Kiri", "Anahera", "Mereana", "Ngaire", "Hine", "Maia",
          "Awhina", "Marama", "Tui"],
      n: ["Ngata", "Rangi", "Te Whare", "Kahu", "Wiremu", "Paora", "Waititi",
          "Tamati", "Hohepa", "Rewi", "Kingi", "Manuera"] },
  ] };
  L.CAN = { q: 3,
    v: ["Alphonso", "Jonathan", "Cyle", "Stephen", "Tajon", "Atiba", "Milan",
        "Samuel", "Ismael", "Liam", "Richie", "Kamal", "Jacob", "Lucas",
        "Mathieu", "Olivier", "Ryan", "Dayne"],
    w: ["Christine", "Jessie", "Ashley", "Kadeisha", "Janine", "Nichelle",
        "Emilie", "Sophie", "Camille", "Olivia", "Ava", "Chloe"],
    n: ["Davies", "David", "Larin", "Eustaquio", "Buchanan", "Hutchinson",
        "Borjan", "Adekugbe", "Fraser", "Laryea", "Miller", "Johnston",
        "Tremblay", "Gauthier", "Cornelius", "Bombito", "Kone", "Shaffelburg"] };
  L.USA = { q: 3,
    v: ["Christian", "Weston", "Tyler", "Gio", "Brenden", "Sergino", "Yunus",
        "Ricardo", "Malik", "Josh", "Tim", "Antonee", "Cameron", "Zack",
        "Luca", "Folarin", "Haji", "DeAndre", "Kellyn", "Auston"],
    w: ["Alex", "Megan", "Rose", "Crystal", "Lindsey", "Sophia", "Trinity",
        "Emily", "Mallory", "Naomi", "Catarina", "Alyssa"],
    n: ["Pulisic", "McKennie", "Adams", "Reyna", "Dest", "Musah", "Robinson",
        "Turner", "Aaronson", "Balogun", "Wright", "Ferreira", "Sargent",
        "Richards", "Zimmerman", "Morris", "Weah", "Yedlin", "Johnson",
        "Miller"] };
  L.BER = { q: 2, erbt: "karibik_en",
    n: ["Trott", "Simmons", "Butterfield", "Bascome", "Hall", "Robinson",
        "Wilson", "Smith", "Tucker", "Outerbridge", "Darrell", "Minors"] };

  /* ---- Karibik: gemeinsame Grundmenge, eigene Nachnamen ---------------- */
  L.JAM = { q: 3, erbt: "karibik_en",
    v: ["Leon", "Michail", "Damion", "Bobby", "Andre", "Shamar", "Demarai",
        "Ravel", "Kasey", "Ethan", "Dujuan", "Junior", "Kemar", "Devon",
        "Alvas", "Daniel", "Amari'i", "Tyreek"],
    n: ["Bailey", "Antonio", "Lowe", "Reid", "Gray", "Nicholson", "Pinnock",
        "Morrison", "Brown", "Campbell", "Powell", "Mattocks", "Dixon",
        "Palmer", "Sterling", "Blake", "Levy", "Watson", "Ricketts", "Clarke"] };
  /* Trinidad: afrokaribisch und indostaemmig, fast haelftig. „Rajiv Latapy"
     gaebe es so kaum — deshalb zwei Gruppen. */
  L.TRI = { q: 3, erbt: "karibik_en", gruppen: [
    { v: ["Levi", "Kevin", "Alvin", "Reon", "Aubrey", "Nathaniel", "Marvin",
          "Sheldon", "Dwight", "Joevin", "Neveal", "Kaile"],
      w: ["Shanice", "Kayla", "Renee", "Camille", "Nadine", "Simone",
          "Chantelle", "Latoya", "Alicia", "Britney"],
      n: ["Garcia", "Molino", "Jones", "Bateau", "Phillip", "Hyland",
          "Yorke", "Latapy", "Fenwick", "Cornell", "Alleyne", "Charles"] },
    { v: ["Rajiv", "Nikhil", "Anil", "Ravi", "Justin", "Ryan", "Sunil",
          "Vishal", "Deven", "Amrit", "Kavir", "Rishi"],
      w: ["Priya", "Anita", "Reshma", "Sunita", "Kamla", "Radha", "Nisha",
          "Savitri", "Indira", "Devika"],
      n: ["Ramdhan", "Persad", "Maharaj", "Boodoo", "Singh", "Bushe",
          "Solomon", "Andrews", "Ramkissoon", "Sookdeo", "Bhagwan", "Rampersad"] },
  ] };
  L.GUY = { q: 2, erbt: "TRI",
    n: ["Persaud", "Ramdeen", "Sancho", "Beaton", "Fraser", "Cox", "Layne",
        "Chase", "Rodrigues", "Persaud", "Bhagwandin", "McKinnon"] };
  L.BAH = { q: 2, erbt: "karibik_en",
    n: ["Rolle", "Ferguson", "Munroe", "Sturrup", "Knowles", "Deveaux",
        "Bethel", "Sands", "Cartwright", "Smith", "Adderley", "Pinder"] };
  L.BRB = { q: 2, erbt: "karibik_en",
    n: ["Alleyne", "Griffith", "Weekes", "Holder", "Marshall", "Best",
        "Bynoe", "Forde", "Gaskin", "Harding", "Clarke", "Hinds"] };
  L.ATG = { q: 2, erbt: "karibik_en",
    n: ["Byers", "Simon", "Gonsalves", "Thomas", "Weston", "Jarvis",
        "Frederick", "Athill", "Christian", "Warner", "Nathaniel", "Bailey"] };
  L.SKN = { q: 1, erbt: "karibik_en",
    n: ["Liburd", "Isaac", "Willett", "Hamilton", "Browne", "Caines",
        "Herbert", "Powell", "Wattley", "Freeman"] };
  L.LCA = { q: 1, erbt: "karibik_en",
    n: ["Joseph", "Charlery", "Elva", "Sonson", "Emmanuel", "Xavier",
        "Bousquet", "Auguste", "Fontenelle", "Clarke"] };
  L.VIN = { q: 1, erbt: "karibik_en",
    n: ["Stewart", "Charles", "Sam", "Velox", "Cato", "John", "Bacchus",
        "Providence", "Slater", "Roberts"] };
  L.GRN = { q: 1, erbt: "karibik_en",
    n: ["Modeste", "Bubb", "Charles", "Andall", "Redhead", "Phillip",
        "Straker", "Antoine", "Belfon", "Mitchell"] };
  L.DMA = { q: 1, erbt: "karibik_en",
    n: ["Joseph", "Toussaint", "Charles", "Peltier", "Casimir", "Baptiste",
        "Laurent", "Alexander", "Williams", "Bruno"] };
  L.BLZ = { q: 2, erbt: "karibik_en",
    /* Belize: Kreolisch, Garifuna und Spanisch nebeneinander. */
    v: ["Deon", "Elroy", "Woodrow", "Michael", "Jesse", "Krisean", "Nahjib",
        "Trimayne", "Danny", "Andres", "Jorge", "Luis", "Shane", "Ashley"],
    n: ["McCaulay", "Smith", "West", "Salazar", "Nunez", "Leslie", "Ramirez",
        "Roches", "Guerra", "Flores", "Arzu", "Martinez"] };

  /* ---- Westafrika: hier war der Schaden am groessten ------------------- */
  /* Nigeria: Yoruba, Igbo und Hausa. Drei Sprachen, drei Namenswelten —
     „Chukwuemeka Balogun" waere ein Igbo-Vorname mit Yoruba-Nachnamen. */
  L.NGA = { q: 3, gruppen: [
    { /* Yoruba, Suedwesten */
      v: ["Ademola", "Taiwo", "Kehinde", "Olamide", "Babajide", "Segun",
          "Tunde", "Wale", "Femi", "Bukayo", "Ola", "Kunle"],
      w: ["Folake", "Temitope", "Bisola", "Yetunde", "Adenike", "Simisola",
          "Omolara", "Titilayo", "Bolanle", "Funmilayo"],
      n: ["Balogun", "Adeleke", "Aina", "Awoniyi", "Ogundipe", "Adebayo",
          "Oyelaran", "Bankole", "Ogunleye", "Fashanu", "Sanusi", "Alli"] },
    { /* Igbo, Suedosten */
      v: ["Kelechi", "Chidera", "Chukwuemeka", "Emmanuel", "Ifeanyi",
          "Obinna", "Nnamdi", "Chinedu", "Somtochukwu", "Ekene", "Uche", "Ikenna"],
      w: ["Chiamaka", "Ifeoma", "Ngozi", "Amarachi", "Adaeze", "Chinelo",
          "Nkechi", "Oluchi", "Uchenna", "Ijeoma"],
      n: ["Iheanacho", "Ndidi", "Iwobi", "Chukwueze", "Okoye", "Eze",
          "Onyeka", "Ekong", "Obi", "Nwankwo", "Okonkwo", "Anichebe"] },
    { /* Hausa und Fulani, Norden — ueberwiegend muslimisch */
      v: ["Ahmed", "Sadiq", "Musa", "Ibrahim", "Aliyu", "Yusuf", "Bello",
          "Umar", "Shehu", "Abdullahi", "Kabiru", "Nasir"],
      w: ["Halimat", "Aisha", "Zainab", "Fatima", "Maryam", "Hauwa",
          "Rukayya", "Amina", "Safiya", "Hadiza"],
      n: ["Musa", "Bello", "Abdullahi", "Yakubu", "Aliyu", "Sani", "Garba",
          "Ahmed", "Mohammed", "Lawal", "Danladi", "Usman"] },
    { /* Landesweit, oft christlich-englisch gepraegt */
      v: ["Victor", "Samuel", "Moses", "Wilfred", "Alex", "Kenneth", "Calvin",
          "Frank", "Semi", "Terem", "Bright", "Joseph"],
      w: ["Asisat", "Onome", "Rasheedat", "Blessing", "Peace", "Gift",
          "Precious", "Faith", "Joy", "Success"],
      n: ["Osimhen", "Lookman", "Simon", "Bassey", "Dennis", "Etebo",
          "Onuachu", "Moffi", "Ajayi", "Omeruo", "Troost", "Boniface"] },
  ] };
  L.GHA = { q: 3,
    /* Akan-Tagesnamen (Kwame = Samstag, Kofi = Freitag) sind lebendig und
       gehoeren dazu, nicht nur als Folklore. */
    v: ["Kwame", "Kofi", "Kwesi", "Yaw", "Kojo", "Kwabena", "Mohammed",
        "Thomas", "Jordan", "Andre", "Daniel", "Alexander", "Elisha",
        "Antoine", "Osman", "Fatawu", "Ibrahim", "Abdul", "Emmanuel", "Joseph"],
    w: ["Akosua", "Ama", "Abena", "Adwoa", "Afua", "Yaa", "Esi", "Grace",
        "Portia", "Elizabeth", "Doris", "Priscilla"],
    n: ["Mensah", "Owusu", "Boateng", "Asare", "Amoah", "Appiah", "Ayew",
        "Partey", "Kudus", "Semenyo", "Sulemana", "Salisu", "Odoi",
        "Djiku", "Lamptey", "Osei", "Addo", "Agyemang", "Nkrumah", "Baidoo"] };
  L.SEN = { q: 3,
    v: ["Sadio", "Kalidou", "Idrissa", "Ismaila", "Boulaye", "Cheikhou",
        "Nampalys", "Pape", "Abdou", "Krepin", "Iliman", "Nicolas", "Habib",
        "Moussa", "Mamadou", "Ousmane", "Lamine", "Seydou", "Bamba", "Youssouf"],
    w: ["Aissatou", "Fatou", "Ndeye", "Awa", "Mariama", "Khady", "Astou",
        "Coumba", "Bineta", "Sokhna", "Adama", "Rokhaya"],
    n: ["Mane", "Koulibaly", "Gueye", "Sarr", "Dia", "Ciss", "Diatta",
        "Ndiaye", "Diallo", "Fall", "Seck", "Faye", "Sow", "Cisse",
        "Diouf", "Ba", "Toure", "Camara", "Diagne", "Mendy"] };
  L.GAM = { q: 2,
    v: ["Musa", "Ebrima", "Ablie", "Yusupha", "Modou", "Alieu", "Omar",
        "Lamin", "Sulayman", "Bakary", "Saidy", "Assan", "Momodou",
        "Alhagie", "Sheriff", "Dawda"],
    w: ["Fatoumata", "Isatou", "Awa", "Mariama", "Binta", "Adama", "Haddy",
        "Jainaba", "Ndey", "Sainabou", "Kaddy", "Aminata"],
    n: ["Barrow", "Colley", "Jallow", "Ceesay", "Sanneh", "Njie", "Touray",
        "Bojang", "Darboe", "Sonko", "Manneh", "Gomez", "Sowe", "Bah",
        "Jatta", "Camara"] };
  L.SLE = { q: 2,
    v: ["Kei", "Musa", "Alhaji", "Umaru", "Mustapha", "Alie", "Issa",
        "Yeami", "Osman", "Sheku", "Amadu", "John", "Mohamed", "Abdul",
        "Ibrahim", "Saidu"],
    w: ["Isatu", "Fatmata", "Mariama", "Kadiatu", "Aminata", "Zainab",
        "Adama", "Hawa", "Memuna", "Salamatu", "Yeanoh", "Sia"],
    n: ["Kamara", "Bangura", "Sesay", "Conteh", "Turay", "Koroma", "Jalloh",
        "Mansaray", "Fofanah", "Sankoh", "Kargbo", "Dumbuya", "Kanu",
        "Tarawally", "Bah", "Sowe"] };
  L.LBR = { q: 2,
    /* Amerikoliberianische und einheimische Namen nebeneinander — die
       Rueckkehrergeschichte des Landes steckt in den Nachnamen. */
    v: ["George", "Sekou", "Marcus", "Terrence", "William", "Anthony",
        "Mohammed", "Kpah", "Sampson", "Tonia", "Allen", "Darlington",
        "Christopher", "Emmanuel", "Prince", "Jonathan"],
    w: ["Ellen", "Musu", "Korto", "Massa", "Deddeh", "Bendu", "Hawa",
        "Kula", "Yatta", "Comfort", "Princess", "Satta"],
    n: ["Weah", "Doe", "Sherman", "Cooper", "Johnson", "Roberts", "Freeman",
        "Barclay", "Tolbert", "Dennis", "Sackor", "Wleh", "Gbatu", "Kollie",
        "Nyanti", "Zoegar"] };

  /* ---- Suedliches Afrika ----------------------------------------------- */
  /* Suedafrika: vier Namenswelten NEBENEINANDER. Frei gemischt kaeme
     „Siyabonga van Wyk" heraus — deshalb Gruppen. Die Gewichtung ergibt sich
     daraus, dass Nguni- und Sotho-Namen zusammen die grosse Mehrheit stellen:
     drei von vier Gruppen sind afrikanisch. */
  L.RSA = { q: 3, gruppen: [
    { /* Nguni: Zulu und Xhosa */
      v: ["Themba", "Sipho", "Siyabonga", "Bongokuhle", "Zakhele", "Mihlali",
          "Ayanda", "Sandile", "Lungelo", "Nkosinathi", "Mduduzi", "Njabulo"],
      w: ["Thandiwe", "Nomvula", "Zanele", "Nokuthula", "Busisiwe", "Ayanda",
          "Nonhlanhla", "Sindiswa", "Zodwa", "Nomsa"],
      n: ["Zwane", "Mbatha", "Ndlovu", "Dlamini", "Nkosi", "Khumalo",
          "Hlatshwayo", "Sithole", "Mvala", "Ngcobo", "Zungu", "Cele"] },
    { /* Sotho und Tswana */
      v: ["Teboho", "Thabo", "Lebogang", "Thapelo", "Katlego", "Tshepo",
          "Karabo", "Mothusi", "Kagiso", "Lehlohonolo", "Refiloe", "Tumelo"],
      w: ["Lerato", "Refilwe", "Palesa", "Mpho", "Naledi", "Boitumelo",
          "Masego", "Dineo", "Kgomotso", "Tebogo"],
      n: ["Tau", "Mokoena", "Mokotjo", "Mothiba", "Makgopa", "Molefe",
          "Sekhukhune", "Mahlangu", "Modiba", "Radebe", "Motaung", "Seema"] },
    { /* Afrikaans */
      v: ["Hendrik", "Pieter", "Jan", "Ruan", "Dewald", "Willem", "Marius",
          "Riaan", "Stefan", "Jaco", "Andries", "Cobus"],
      w: ["Anneke", "Elna", "Marizanne", "Ilse", "Suzaan", "Lize", "Annelie",
          "Chantelle", "Rune", "Marike"],
      n: ["Botha", "van Wyk", "du Plessis", "Coetzee", "Nel", "van der Merwe",
          "Pretorius", "Steyn", "Venter", "Fourie", "Kruger", "Swanepoel"] },
    { /* Englischsprachig und Coloured, stark am Kap */
      v: ["Percy", "Ronwen", "Ricardo", "Bradley", "Lyle", "Aubrey", "Evidence",
          "Keagan", "Devin", "Grant", "Luke", "Ashley"],
      w: ["Jane", "Kirsten", "Robyn", "Chloe", "Amber", "Jessica", "Leigh",
          "Danielle", "Shannon", "Tayla"],
      n: ["Williams", "Foster", "Peterson", "Adams", "Jacobs", "Daniels",
          "Fortune", "Booysen", "Solomons", "Arendse", "Hendricks", "Titus"] },
  ] };
  L.ZIM = { q: 3,
    /* Shona und Ndebele. Vornamen sind oft englische Woerter mit Bedeutung —
       Knowledge, Marvelous, Blessing —, das ist keine Erfindung, das ist
       simbabwische Namenspraxis. */
    v: ["Knowledge", "Marvelous", "Marshall", "Tino", "Tendayi", "Khama",
        "Blessing", "Prince", "Talent", "Admiral", "Terrence", "Divine",
        "Munashe", "Tapiwa", "Farai", "Takudzwa", "Nqobizitha", "Bruce"],
    w: ["Rutendo", "Chipo", "Tendai", "Nyasha", "Rudo", "Tsitsi", "Fadzai",
        "Vimbai", "Anesu", "Kudzai", "Nomsa", "Sibongile"],
    n: ["Musona", "Nakamba", "Munetsi", "Kadewere", "Billiat", "Chirewa",
        "Hadebe", "Mudimu", "Zemura", "Chakanyuka", "Moyo", "Ndlovu",
        "Sibanda", "Dube", "Mhlanga", "Chigumira", "Mapfumo", "Mutasa"] };
  L.ZAM = { q: 2,
    v: ["Patson", "Enock", "Lameck", "Fashion", "Kings", "Clatous",
        "Emmanuel", "Golden", "Frankie", "Rally", "Edward", "Roderick",
        "Benson", "Kelvin", "Lubambo", "Stoppila"],
    w: ["Barbra", "Racheal", "Grace", "Hellen", "Mary", "Ireen", "Margaret",
        "Esther", "Anita", "Lushomo", "Chansa", "Mapalo"],
    n: ["Daka", "Mwepu", "Banda", "Sakala", "Kangwa", "Chabala", "Mulenga",
        "Musonda", "Phiri", "Tembo", "Zulu", "Chirwa", "Bwalya", "Mwanza",
        "Sinkala", "Kalaba"] };
  L.MWI = { q: 2,
    v: ["Gabadinho", "Richard", "Frank", "Charles", "Peter", "Chimwemwe",
        "Yamikani", "Limbikani", "Chikondi", "Tawonga", "Blessings",
        "Gerald", "Micium", "Stanley", "Denis", "Robin"],
    w: ["Chisomo", "Tamandani", "Thoko", "Mercy", "Ellen", "Joyce",
        "Grace", "Memory", "Tiyamike", "Chikondi", "Mphatso", "Loveness"],
    n: ["Mhango", "Banda", "Gaba", "Phiri", "Chirwa", "Mwase", "Kaonga",
        "Nyondo", "Msowoya", "Kanyenda", "Chikoti", "Lanjesi", "Nyirenda",
        "Mkandawire"] };
  L.BOT = { q: 2,
    v: ["Mothusi", "Onkabetse", "Kabelo", "Thero", "Segolame", "Tumisang",
        "Gape", "Mogakolodi", "Lemponye", "Thatayaone", "Galabgwe",
        "Motlhabankwe", "Keitumetse", "Boitumelo", "Tebogo", "Kgosana"],
    w: ["Bontle", "Lorato", "Kefilwe", "Naledi", "Thato", "Boitumelo",
        "Masego", "Kagiso", "Tshepo", "Neo", "Refilwe", "Onalenna"],
    n: ["Bame", "Makgantai", "Sebele", "Moloi", "Ngele", "Modiri",
        "Mogorosi", "Sesinyi", "Kgetholetsile", "Tshukudu", "Motlhabane",
        "Ramatlhakwane", "Nkile", "Dipsy"] };
  L.NAM = { q: 2,
    /* Ovambo, Herero, Damara und deutschstaemmige Namen — die Kolonialzeit
       ist in den Nachnamen bis heute sichtbar. */
    v: ["Peter", "Deon", "Petrus", "Immanuel", "Riaan", "Wangu", "Absalom",
        "Dynamo", "Benson", "Ivan", "Willy", "Panduleni", "Elmo", "Prince",
        "Aprocius", "Sadney"],
    w: ["Ndapewa", "Meriam", "Anna", "Selma", "Loide", "Hilja", "Tulipohamba",
        "Rauna", "Wilka", "Frieda", "Martha", "Justina"],
    n: ["Shalulile", "Hotto", "Shipanga", "Kanalelo", "Nambahu", "Katua",
        "Stephanus", "Hindjou", "Uirab", "Muzeu", "Tjihero", "Beukes",
        "Kavendjii", "Fredericks", "Naobeb", "Amutenya"] };
  L.LES = { q: 2,
    v: ["Tsepo", "Mohlomi", "Lehlohonolo", "Nkoto", "Jane", "Basia",
        "Motebang", "Litsepe", "Sera", "Hlompho", "Thabo", "Katleho",
        "Teboho", "Realeboha", "Molise", "Tsoanelo"],
    w: ["Mamello", "Lineo", "Palesa", "Nthabiseng", "Rethabile", "Puleng",
        "Mpho", "Limpho", "Matseliso", "Nkhono", "Bokang", "Realeboha"],
    n: ["Mahlatsi", "Ramoholi", "Seturumane", "Malefane", "Lerotholi",
        "Mokhehle", "Letsie", "Motsoari", "Kotoane", "Ntoi", "Sekhoto",
        "Mothebe", "Rantso", "Phamotse"] };
  L.SWZ = { q: 2,
    v: ["Sabelo", "Sifiso", "Mcedisi", "Njabulo", "Sanele", "Thabo",
        "Mthobisi", "Bonginkosi", "Sandile", "Muzi", "Wonder", "Felix",
        "Sabelo", "Wandile", "Mlungisi", "Sicelo"],
    w: ["Nomcebo", "Lindiwe", "Thandi", "Nokuthula", "Sindi", "Zanele",
        "Phumzile", "Nonhlanhla", "Busisiwe", "Temaswati", "Nokwanda", "Sibongile"],
    n: ["Ndlangamandla", "Dlamini", "Nkambule", "Mamba", "Simelane",
        "Magagula", "Shongwe", "Gamedze", "Motsa", "Zwane", "Hlophe",
        "Mnisi", "Vilakati", "Sifundza"] };

  /* ---- Ostafrika, englischsprachig ------------------------------------- */
  L.SSD = { q: 2,
    /* Dinka und Nuer. Der Doppelname aus Vater- und Grossvatername ist dort
       die Regel, deshalb `VMN`. */
    bau: "VMN",
    v: ["Deng", "Ater", "Manyang", "Chol", "Garang", "Bol", "Akol", "Mayen",
        "Lual", "Wani", "Gatluak", "Riek", "Peter", "James", "Simon", "Daniel"],
    w: ["Nyandeng", "Achol", "Ayen", "Aluel", "Nyakuoth", "Adau", "Abuk",
        "Nyaruot", "Athieng", "Awut", "Rebecca", "Mary"],
    m: ["Deng", "Majok", "Kuol", "Bol", "Ajak", "Malual", "Garang", "Wek"],
    n: ["Machar", "Kiir", "Deng", "Malong", "Amum", "Nhial", "Akec",
        "Ayii", "Manyang", "Lueth", "Madut", "Chan"] };
  L.SEY = { q: 1,
    /* Kreolisch mit franzoesischem Erbe — trotz englischer Amtssprache. */
    v: ["Alcindo", "Colin", "Don", "Steve", "Jaime", "Roddy", "Karl",
        "Perry", "Brandon", "Rocky", "Nelson", "Kevin", "Dylan", "Marco"],
    w: ["Marie", "Jeanne", "Nathalie", "Sylvia", "Andrea", "Chantal",
        "Michelle", "Diana", "Sabrina", "Vanessa", "Sonia", "Lisa"],
    n: ["Ernesta", "Hoareau", "Payet", "Barbe", "Confait", "Rose",
        "Adrienne", "Nourrice", "Mathiot", "Lespoir", "Dugasse", "Belle"] };

  /* ======================================================================
     fr — 23 Nationen, davon 20 in Afrika. Die franzoesische Amtssprache sagt
     ueber die Namen so wenig wie die englische: ein Senegalese heisst Wolof,
     ein Malier Bambara, ein Ruander Kinyarwanda. „Theo Delaunay" war fuer
     zwanzig Laender die Vorgabe.
     ====================================================================== */

  L.FRA = { q: 3,
    v: ["Kylian", "Antoine", "Olivier", "Theo", "Aurelien", "Eduardo",
        "Marcus", "Randal", "Ibrahima", "Jules", "Dayot", "Adrien", "Lucas",
        "Mattéo", "Enzo", "Hugo", "Nathan", "Raphael", "Clement", "Baptiste"],
    w: ["Wendie", "Amandine", "Kadidiatou", "Eugenie", "Sakina", "Delphine",
        "Griedge", "Selma", "Manon", "Camille", "Chloe", "Lea"],
    n: ["Mbappe", "Griezmann", "Giroud", "Hernandez", "Tchouameni",
        "Camavinga", "Thuram", "Kolo Muani", "Konate", "Kounde", "Upamecano",
        "Rabiot", "Dubois", "Lefevre", "Moreau", "Girard", "Bonnet",
        "Fontaine", "Marchand", "Rousseau"] };
  L.BEL = { q: 3,
    /* Belgien ist zweisprachig — Flamen und Wallonen haben verschiedene
       Namen. Frei gemischt kaeme „Kevin Vermeulen" neben „Jan Lefevre". */
    gruppen: [
      { v: ["Kevin", "Romelu", "Jeremy", "Youri", "Dodi", "Loic", "Amadou",
            "Arthur", "Maxime", "Nicolas", "Julien", "Thomas"],
        w: ["Tessa", "Justine", "Elke", "Laura", "Chloe", "Marie", "Sarah",
            "Camille", "Julie", "Amber"],
        n: ["De Bruyne", "Lukaku", "Doku", "Tielemans", "Onana", "Openda",
            "Trossard", "Carrasco", "Meunier", "Dendoncker", "Faes", "Theate"] },
      { v: ["Jan", "Wout", "Toby", "Timothy", "Thibaut", "Leandro", "Bart",
            "Koen", "Stijn", "Dries", "Lars", "Senne"],
        w: ["Femke", "Lotte", "Sien", "Marie", "Ella", "Emma", "Nora", "Fien"],
        n: ["Vermeulen", "Janssens", "Peeters", "Maertens", "De Ketelaere",
            "Vanaken", "Vertonghen", "Castagne", "Verbruggen", "Debast",
            "Van Hecke", "Claes"] },
    ] };
  L.MCO = { q: 2, erbt: "FRA" };
  L.HAI = { q: 2,
    v: ["Duckens", "Frantzdy", "Carlens", "Steeven", "Ricardo", "Josue",
        "Derrick", "Jean", "Wilde", "Mikael", "Danley", "Zachary",
        "Fabrice", "Kervens", "Johnny", "Widlyn"],
    w: ["Nerilia", "Melchie", "Roselord", "Batcheba", "Sherly", "Kethna",
        "Mikerline", "Danielle", "Milan", "Rachel", "Chelsea", "Maudeline"],
    n: ["Nazon", "Herivaux", "Saintini", "Alceus", "Pierre", "Jean-Baptiste",
        "Louis", "Charles", "Joseph", "Cadet", "Belfort", "Georges",
        "Fleurimond", "Etienne", "Desir", "Michel"] };

  /* ---- Westafrika, frankophon ------------------------------------------ */
  L.CIV = { q: 3,
    v: ["Sebastien", "Franck", "Wilfried", "Serge", "Ibrahim", "Nicolas",
        "Seko", "Jean-Philippe", "Evan", "Odilon", "Yahia", "Simon",
        "Christian", "Karim", "Amad", "Oumar"],
    w: ["Nadege", "Ines", "Rita", "Aminata", "Fatou", "Mariam", "Sarah",
        "Christelle", "Josee", "Adjoua", "Akissi", "Affoue"],
    n: ["Haller", "Kessie", "Zaha", "Aurier", "Sangare", "Fofana", "Bailly",
        "Pepe", "Diallo", "Kouame", "Konan", "Boly", "Traore", "Cisse",
        "Gradel", "Doumbia", "Yao", "Kouassi", "Coulibaly", "Toure"] };
  L.MLI = { q: 3,
    v: ["Amadou", "Yves", "Moussa", "Hamari", "Adama", "Diadie", "Cheick",
        "Boubakar", "Kamory", "Lassine", "Sikou", "Nene", "Mohamed",
        "Ibrahim", "Sekou", "Modibo"],
    w: ["Aminata", "Fatoumata", "Assa", "Kadiatou", "Djeneba", "Bintou",
        "Oumou", "Sitan", "Awa", "Nana", "Mariam", "Salimata"],
    n: ["Haidara", "Bissouma", "Doumbia", "Traore", "Diarra", "Coulibaly",
        "Keita", "Kone", "Sissoko", "Samassekou", "Djenepo", "Dembele",
        "Fofana", "Sacko", "Camara", "Diallo"] };
  L.BFA = { q: 3,
    v: ["Bertrand", "Issa", "Edmond", "Dango", "Blati", "Adama", "Cyrille",
        "Lassina", "Zakaria", "Gustavo", "Steeve", "Mohamed", "Ismahila",
        "Abdoul", "Hassane", "Yacouba"],
    w: ["Charlotte", "Salamata", "Kadidia", "Rasmata", "Mariam", "Aissata",
        "Fatimata", "Habibou", "Zenabou", "Alizeta", "Balkissa", "Awa"],
    n: ["Traore", "Tapsoba", "Ouattara", "Sanogo", "Kabore", "Zongo",
        "Bance", "Nakoulma", "Konate", "Sawadogo", "Compaore", "Ouedraogo",
        "Guira", "Dabo", "Sanou", "Zoungrana"] };
  L.GUI = { q: 2,
    v: ["Naby", "Serhou", "Ilaix", "Mohamed", "Amadou", "Ibrahima",
        "Aguibou", "Morlaye", "Sekou", "Mamadou", "Alseny", "Facinet",
        "Ousmane", "Fode", "Momo", "Sory"],
    w: ["Mariama", "Fatoumata", "Aissatou", "Hadja", "Kadiatou", "Djenabou",
        "Saran", "Nene", "Aminata", "Bountouraby", "Mabinty", "Sayon"],
    n: ["Keita", "Guirassy", "Moriba", "Bayo", "Diakhaby", "Camara",
        "Sylla", "Conte", "Bangoura", "Sow", "Barry", "Toure", "Soumah",
        "Cisse", "Kourouma", "Balde"] };
  L.BEN = { q: 2,
    v: ["Steve", "Jodel", "Cebio", "Olivier", "Sessi", "Jordan", "Yohan",
        "David", "Marcellin", "Rodrigue", "Desire", "Junior", "Tidjani",
        "Imourane", "Saturnin", "Koffi"],
    w: ["Chimene", "Nadege", "Rachidatou", "Colombe", "Sylvie", "Ines",
        "Prudence", "Aurelie", "Gracia", "Sonia", "Reine", "Elvire"],
    n: ["Mounie", "Dokou", "Soukou", "Adenon", "Verdon", "Sessegnon",
        "Poote", "Hountondji", "Yekini", "Ahoueya", "Tosse", "Aiyegun",
        "Kiki", "Gbaguidi", "Assogba", "Djigla"] };
  L.TOG = { q: 2,
    v: ["Emmanuel", "Kodjo", "Kossi", "Ihlas", "Djene", "Mathieu",
        "Thomas", "Roger", "Serge", "Peniel", "Samuel", "Yao",
        "Komlan", "Sadat", "Floyd", "Malik"],
    w: ["Akouavi", "Afi", "Sika", "Adjo", "Yawa", "Essi", "Amivi",
        "Delali", "Elom", "Kekeli", "Sena", "Mawusi"],
    n: ["Adebayor", "Bebou", "Dossevi", "Djene", "Akakpo", "Agassa",
        "Ayite", "Gakpe", "Amewou", "Lawson", "Aholou", "Kadjo",
        "Mensah", "Salifou", "Sanni", "Tchagnirou"] };
  L.NIG = { q: 2,
    v: ["Boubacar", "Amadou", "Souleymane", "Ibrahim", "Moussa", "Idrissa",
        "Youssouf", "Abdoul", "Hassane", "Salif", "Zakari", "Ali",
        "Mahamane", "Issoufou", "Oumarou", "Chaibou"],
    w: ["Aichatou", "Hadiza", "Zeinabou", "Rakia", "Ramatou", "Balkissa",
        "Fati", "Habsatou", "Mariama", "Saouda", "Zalika", "Amina"],
    n: ["Amadou", "Maazou", "Boubacar", "Idrissa", "Sacko", "Moussa",
        "Garba", "Abdoulaye", "Adamou", "Djibo", "Harouna", "Salifou",
        "Yahaya", "Illiassou", "Seyni", "Zakari"] };

  /* ---- Zentralafrika ---------------------------------------------------- */
  L.CMR = { q: 3,
    v: ["Andre", "Vincent", "Karl", "Bryan", "Jean-Charles", "Christian",
        "Olivier", "Georges", "Nouhou", "Collins", "Frank", "Enzo",
        "Martin", "Samuel", "Clinton", "Ambroise"],
    w: ["Gabrielle", "Ajara", "Genevieve", "Christine", "Raissa", "Michele",
        "Estelle", "Nchout", "Aboudi", "Marlyse", "Charlene", "Ngo"],
    n: ["Onana", "Aboubakar", "Toko Ekambi", "Choupo-Moting", "Anguissa",
        "Ngamaleu", "Castelletto", "Fai", "Mbeumo", "Etoo", "Nkoulou",
        "Zambo", "Ngadeu", "Bassogog", "Tolo", "Ondoua", "Mbia", "Song"] };
  L.GAB = { q: 2,
    v: ["Pierre-Emerick", "Denis", "Bruno", "Mario", "Guelor", "Andre",
        "Aaron", "Anthony", "Johann", "Ulrich", "Yannis", "Axel",
        "Lloyd", "Shavy", "Jeremy", "Didier"],
    w: ["Nadine", "Sylvia", "Chantal", "Prisca", "Bertille", "Nadege",
        "Josiane", "Eliane", "Carine", "Ghislaine", "Aurelie", "Reine"],
    n: ["Aubameyang", "Bouanga", "Ecuele Manga", "Kanga", "Poko", "Lemina",
        "Ndong", "Obiang", "Allevinah", "Boupendza", "Mounie", "Mbanangoye",
        "Ovono", "Madinda", "Nzengue", "Engonga"] };
  L.CGO = { q: 2,
    v: ["Prince", "Thievy", "Fernand", "Christoffer", "Beranger", "Bissiki",
        "Silvere", "Merveil", "Dylan", "Yhoan", "Junior", "Gaius",
        "Bradley", "Kevin", "Antoine", "Durel"],
    w: ["Divine", "Grace", "Merveille", "Nadia", "Cynthia", "Prisca",
        "Laurianne", "Ruth", "Yolande", "Beatrice", "Sagesse", "Bénie"],
    n: ["Oniangue", "Bifouma", "Mabiala", "Ndinga", "Bakouboula",
        "Mabidi", "Mouyokolo", "Ibara", "Bissiki", "Ndzila", "Massouema",
        "Ngoma", "Bantsimba", "Loufilou"] };
  L.COD = { q: 3,
    v: ["Chancel", "Cedric", "Yoane", "Gael", "Dieumerci", "Meschack",
        "Silas", "Arthur", "Fiston", "Ngonda", "Theo", "Samuel",
        "Glody", "Joris", "Merveille", "Grady"],
    w: ["Merveille", "Divine", "Grace", "Sarah", "Nathalie", "Ruth",
        "Esperance", "Josee", "Naomi", "Beatrice", "Christelle", "Gloire"],
    n: ["Mbemba", "Bakambu", "Wissa", "Masuaku", "Kayembe", "Mukau",
        "Katompa", "Elia", "Kalulu", "Bongonda", "Tshibola", "Ilunga",
        "Kabangu", "Mbala", "Ngoy", "Lukebakio", "Nzuzi", "Mputu"] };
  L.CTA = { q: 1,
    v: ["Geoffrey", "Louis", "Yakhouba", "Cedric", "Habib", "Eddy",
        "Bevic", "Jordan", "Anicet", "Fabrice", "Herve", "Junior",
        "Wilfried", "Serge", "Guy", "Rodrigue"],
    w: ["Nadia", "Chancelvie", "Grace", "Yvette", "Clarisse", "Sandrine",
        "Prisca", "Josiane", "Ines", "Marlene", "Rachelle", "Gisele"],
    n: ["Kondogbia", "Mafouta", "Yakhouba", "Namnganda", "Ngakoutou",
        "Doumbia", "Zoua", "Ngoulou", "Boui", "Mandaba", "Yandia",
        "Ndomete", "Kossi", "Bangoura"] };
  L.CHA = { q: 1,
    v: ["Ezechiel", "Casimir", "Marius", "Karl", "Rodrigue", "Yannick",
        "Naguib", "Hillaire", "Mahamat", "Abdelkerim", "Adam", "Brahim",
        "Djimet", "Souleymane", "Nadji", "Ali"],
    w: ["Achta", "Fatime", "Halime", "Zara", "Amina", "Hadje", "Mariam",
        "Khadidja", "Fanne", "Ache", "Roukaya", "Djamila"],
    n: ["Ndouassel", "Mahamat", "Abdelkerim", "Djalabi", "Yaya",
        "Ninga", "Djimrangar", "Kedigui", "Betel", "Nadjimbaye",
        "Ngarhoulem", "Tchoumbe", "Allamine", "Hissein"] };

  /* ---- Ostafrika, frankophon ------------------------------------------- */
  L.RWA = { q: 2,
    v: ["Jacques", "Djihad", "Kevin", "Emmanuel", "Innocent", "Herve",
        "Yannick", "Olivier", "Muhadjiri", "Gilbert", "Fitina", "Bosco",
        "Thierry", "Claude", "Eric", "Aime"],
    w: ["Mukamana", "Immaculee", "Josiane", "Clarisse", "Divine", "Ange",
        "Solange", "Providence", "Chantal", "Alice", "Grace", "Uwase"],
    n: ["Tuyisenge", "Bizimana", "Hakizimana", "Niyonzima", "Mugiraneza",
        "Nshuti", "Rutanga", "Ndayishimiye", "Nsengiyumva", "Habimana",
        "Uwimana", "Mutsinzi", "Kagere", "Manzi", "Rusheshangoga"] };
  L.BDI = { q: 1,
    v: ["Saido", "Cedric", "Gael", "Fiston", "Blaise", "Shassiri",
        "Amissi", "Laudit", "Selemani", "Frederic", "Elvis", "Karim",
        "Pierre", "Jonathan", "Bienvenu", "Ismail"],
    w: ["Nadine", "Belyse", "Divine", "Chantal", "Ange", "Sandrine",
        "Josiane", "Clarisse", "Emerence", "Alice", "Nella", "Grace"],
    n: ["Berahino", "Amissi", "Nsabiyumva", "Nahimana", "Ndikumana",
        "Nzohabonayo", "Bigirimana", "Hakizimana", "Niyongabo",
        "Manirakiza", "Ndayisenga", "Bukuru", "Irankunda", "Nduwarugira"] };
  L.DJI = { q: 1,
    v: ["Warsama", "Abdoulrazak", "Mohamed", "Ali", "Youssouf", "Farhan",
        "Abdi", "Hassan", "Omar", "Idriss", "Said", "Guedi",
        "Ismael", "Houssein", "Bilal", "Kadar"],
    w: ["Fatouma", "Halima", "Zahra", "Amina", "Hodan", "Sagal",
        "Deka", "Ifrah", "Nima", "Rahma", "Asma", "Kadra"],
    n: ["Mohamed", "Abdillahi", "Hassan", "Ali", "Ismail", "Waberi",
        "Farah", "Guelleh", "Robleh", "Djama", "Aden", "Osman",
        "Elmi", "Hared"] };
  L.COM = { q: 1,
    v: ["Youssouf", "Faiz", "Nadjim", "Mohamed", "El Fardou", "Ben",
        "Ali", "Chaker", "Rafidine", "Kassim", "Abdallah", "Ibroihim",
        "Said", "Andjilani", "Fouad", "Salim"],
    w: ["Zainaba", "Fatima", "Nadjima", "Halima", "Anfia", "Moinaecha",
        "Roukia", "Amina", "Salima", "Hadidja", "Nasra", "Chamsia"],
    n: ["Mchangama", "Abdallah", "Selemani", "Bakari", "Youssouf",
        "M'Changama", "Nabouhane", "Mmadi", "Ahamada", "Soilihi",
        "Djoudi", "Ali", "Hamada", "Msa"] };
  L.MAD = { q: 2,
    v: ["Faneva", "Njiva", "Rayan", "Loic", "Anicet", "Marco", "Ibrahim",
        "Warren", "Melvin", "Tokinantenaina", "Rasoanaivo", "Lalaina",
        "Herizo", "Andry", "Tsiory", "Mamy"],
    w: ["Voahangy", "Hanta", "Nirina", "Lalaina", "Bakoly", "Rasoa",
        "Fara", "Miora", "Tiana", "Onja", "Vololona", "Soa"],
    n: ["Andriatsima", "Raveloson", "Rakotondrabe", "Randriamamy",
        "Rakotoharimalala", "Andrianarimanana", "Razafindranaivo",
        "Rasoloarison", "Ramanantsoa", "Rabemananjara", "Andrianina",
        "Rakotonirina", "Randrianasolo", "Ratsimbazafy"] };
  L.MRI = { q: 1,
    /* Mauritius: indostaemmig, kreolisch, franzoesisch und chinesisch. */
    gruppen: [
      { v: ["Ashley", "Jonathan", "Kevin", "Bryan", "Adrien", "Fabrice",
            "Jerome", "Yohan", "Christopher", "Dylan"],
        w: ["Marie", "Nathalie", "Sandrine", "Emilie", "Laura", "Celine"],
        n: ["Nazira", "Perle", "Labonne", "Dorasami", "Fanchette",
            "Marianne", "Lamvohee", "Speville"] },
      { v: ["Ashvin", "Nitish", "Rajesh", "Vikash", "Sanjay", "Deepak",
            "Anish", "Kavish", "Yashwin", "Hemant"],
        w: ["Priya", "Anjali", "Devi", "Sunita", "Reshma", "Kamla"],
        n: ["Ramdhun", "Beeharry", "Gopaul", "Seeruttun", "Jugnauth",
            "Ramgoolam", "Boodhoo", "Mungur"] },
    ] };

  /* ======================================================================
     es — 22 Nationen. Der doppelte Nachname (Vater, dann Mutter) ist im
     ganzen Raum die Regel: Garcia Fernandez, nicht Garcia. `bau: "VNN"`
     zieht dafuer zweimal aus derselben Liste und laesst die Doppelung weg,
     wenn zufaellig zweimal dasselbe kommt.
     ====================================================================== */
  G.spanisch_v = ["Alvaro", "Sergio", "Javier", "Carlos", "Diego", "Rodrigo",
    "Mateo", "Nicolas", "Santiago", "Emiliano", "Gonzalo", "Facundo",
    "Agustin", "Lucas", "Tomas", "Bruno", "Ivan", "Marcos", "Pablo", "Adrian"];
  G.spanisch_w = ["Lucia", "Martina", "Valentina", "Camila", "Sofia",
    "Isabella", "Daniela", "Mariana", "Paula", "Carla", "Alba", "Noa"];

  L.ESP = { q: 3, bau: "VNN",
    v: ["Alvaro", "Sergio", "Pedri", "Gavi", "Dani", "Rodri", "Unai",
        "Mikel", "Ferran", "Nico", "Aymeric", "Marco", "Fabian", "Iker",
        "Jorge", "Bryan", "Yeremy", "Ansu", "Pau", "Alejandro"],
    w: ["Aitana", "Alexia", "Jenni", "Irene", "Ona", "Mariona", "Salma",
        "Olga", "Esther", "Cata", "Laia", "Athenea"],
    n: ["Garcia", "Fernandez", "Rodriguez", "Lopez", "Martinez", "Sanchez",
        "Perez", "Gomez", "Martin", "Jimenez", "Ruiz", "Hernandez", "Diaz",
        "Moreno", "Alvarez", "Romero", "Navarro", "Torres", "Dominguez",
        "Gil"] };
  L.ARG = { q: 3, bau: "VNN",
    v: ["Lionel", "Angel", "Julian", "Enzo", "Alexis", "Rodrigo", "Nicolas",
        "Emiliano", "Nahuel", "Lautaro", "Exequiel", "Cristian", "German",
        "Thiago", "Valentin", "Franco", "Facundo", "Gonzalo", "Ezequiel", "Matias"],
    w: ["Estefania", "Yamila", "Florencia", "Aldana", "Mariana", "Sole",
        "Micaela", "Agustina", "Julieta", "Delfina", "Camila", "Brenda"],
    n: ["Messi", "Di Maria", "Alvarez", "Fernandez", "Mac Allister", "Paredes",
        "Otamendi", "Romero", "Molina", "Tagliafico", "Acuna", "Gonzalez",
        "Lo Celso", "Correa", "Palacios", "Dybala", "Martinez", "Rodriguez",
        "Sosa", "Benedetto"] };
  L.MEX = { q: 3, bau: "VNN",
    v: ["Hirving", "Raul", "Edson", "Guillermo", "Cesar", "Jesus", "Uriel",
        "Orbelin", "Luis", "Santiago", "Erick", "Israel", "Johan", "Roberto",
        "Julian", "Kevin", "Alexis", "Carlos", "Diego", "Rodolfo"],
    w: ["Charlyn", "Kenti", "Jacqueline", "Alicia", "Katty", "Diana",
        "Karla", "Rebeca", "Stephany", "Nicolette", "Maricarmen", "Lizbeth"],
    n: ["Lozano", "Jimenez", "Alvarez", "Ochoa", "Montes", "Gallardo",
        "Antuna", "Pineda", "Chavez", "Sanchez", "Vega", "Reyes",
        "Rodriguez", "Hernandez", "Ramos", "Aguirre", "Cordova", "Guzman",
        "Mier", "Araujo"] };
  L.COL = { q: 3, bau: "VNN",
    v: ["Luis", "James", "Rafael", "Juan", "Davinson", "Jhon", "Yerry",
        "Wilmar", "Duvan", "Mateus", "Richard", "Daniel", "Kevin", "Jorge",
        "Camilo", "Sebastian", "Andres", "Carlos", "Miguel", "Johan"],
    w: ["Linda", "Catalina", "Leicy", "Manuela", "Daniela", "Mayra",
        "Carolina", "Diana", "Yoreli", "Isabella", "Ana", "Natalia"],
    n: ["Diaz", "Rodriguez", "Borre", "Cuadrado", "Sanchez", "Arias", "Mina",
        "Barrios", "Zapata", "Uribe", "Lerma", "Munoz", "Cordoba", "Mosquera",
        "Quintero", "Ospina", "Valencia", "Hernandez", "Castano", "Duran"] };
  L.CHI = { q: 3, bau: "VNN",
    v: ["Alexis", "Arturo", "Ben", "Claudio", "Charles", "Eduardo", "Diego",
        "Guillermo", "Marcelino", "Victor", "Gabriel", "Dario", "Cristian",
        "Felipe", "Vicente", "Ignacio", "Matias", "Rodrigo", "Jose", "Tomas"],
    w: ["Christiane", "Yanara", "Carla", "Francisca", "Rosario", "Daniela",
        "Camila", "Javiera", "Constanza", "Fernanda", "Antonia", "Valentina"],
    n: ["Sanchez", "Vidal", "Brereton", "Bravo", "Aranguiz", "Vargas",
        "Valdes", "Maripan", "Nunez", "Davila", "Suazo", "Osorio",
        "Isla", "Medel", "Pulgar", "Meneses", "Galdames", "Echeverria",
        "Contreras", "Silva"] };
  L.URU = { q: 3, bau: "VNN",
    v: ["Luis", "Federico", "Darwin", "Rodrigo", "Facundo", "Nahitan",
        "Manuel", "Ronald", "Sebastian", "Matias", "Maximiliano", "Nicolas",
        "Agustin", "Santiago", "Brian", "Guillermo", "Diego", "Gaston",
        "Jose", "Emiliano"],
    w: ["Belen", "Ximena", "Pamela", "Stephanie", "Carolina", "Sofia",
        "Valentina", "Camila", "Micaela", "Florencia", "Lucia", "Agustina"],
    n: ["Suarez", "Valverde", "Nunez", "Bentancur", "Pellistri", "Araujo",
        "Gimenez", "Olivera", "Vecino", "Rodriguez", "Cavani", "De la Cruz",
        "Torreira", "Ugarte", "Canobbio", "Varela", "Sanchez", "Fernandez",
        "Coates", "Muslera"] };
  L.PER = { q: 2, bau: "VNN",
    v: ["Paolo", "Christian", "Andre", "Renato", "Gianluca", "Yoshimar",
        "Luis", "Edison", "Alex", "Bryan", "Marcos", "Sergio", "Piero",
        "Wilder", "Anderson", "Miguel", "Carlos", "Oliver", "Franco", "Jesus"],
    w: ["Xioczana", "Mia", "Steffani", "Cindy", "Adriana", "Milagros",
        "Sandy", "Rosa", "Claudia", "Alexandra", "Fabiola", "Nayeli"],
    n: ["Guerrero", "Cueva", "Carrillo", "Tapia", "Lapadula", "Yotun",
        "Advincula", "Flores", "Valera", "Reyna", "Lopez", "Pena",
        "Callens", "Zambrano", "Corzo", "Quispe", "Castillo", "Aquino",
        "Grimaldo", "Sonne"] };
  L.ECU = { q: 2, bau: "VNN",
    v: ["Moises", "Enner", "Pervis", "Piero", "Angelo", "Jeremy", "Kendry",
        "Gonzalo", "Felix", "Alan", "Jordy", "Hernan", "Byron", "Carlos",
        "Alexander", "Willian", "Jhegson", "Nilson", "Anthony", "Diego"],
    w: ["Kerlly", "Ambar", "Nayely", "Ligia", "Denise", "Joselyn",
        "Madelin", "Erika", "Karen", "Nicole", "Mariela", "Angie"],
    n: ["Caicedo", "Valencia", "Estupinan", "Hincapie", "Preciado",
        "Plata", "Sarmiento", "Torres", "Mena", "Franco", "Ordonez",
        "Palacios", "Arboleda", "Porozo", "Angulo", "Quinonez",
        "Reasco", "Cifuentes", "Yeboah", "Vite"] };
  L.PAR = { q: 2, bau: "VNN",
    v: ["Miguel", "Gustavo", "Angel", "Ramon", "Alejandro", "Julio",
        "Hernesto", "Braian", "Andres", "Mathias", "Junior", "Antonio",
        "Diego", "Robert", "Adam", "Damian", "Fabian", "Omar", "Ivan", "Blas"],
    w: ["Fanny", "Jessica", "Limpia", "Camila", "Rebeca", "Dahiana",
        "Gloria", "Marizza", "Lice", "Claudia", "Fatima", "Larissa"],
    n: ["Almiron", "Gomez", "Romero", "Sosa", "Cubas", "Enciso", "Alderete",
        "Balbuena", "Espinola", "Bareiro", "Gonzalez", "Villasanti",
        "Arzamendia", "Ojeda", "Morinigo", "Aquino", "Duarte", "Benitez",
        "Ferreira", "Caceres"] };
  L.BOL = { q: 2, bau: "VNN",
    v: ["Marcelo", "Carlos", "Ramiro", "Bruno", "Roberto", "Diego",
        "Boris", "Erwin", "Gabriel", "Henry", "Jaume", "Leonel", "Luis",
        "Moises", "Robson", "Ronaldo", "Jose", "Efrain", "Enzo", "Miguel"],
    w: ["Erika", "Ana", "Vania", "Daniela", "Lucia", "Fabiana", "Rocio",
        "Andrea", "Milena", "Karen", "Paola", "Yamila"],
    n: ["Martins", "Lampe", "Vaca", "Miranda", "Justiniano", "Fernandez",
        "Villamil", "Saucedo", "Cuellar", "Terceros", "Chumacero",
        "Quinteros", "Bejarano", "Medina", "Sagredo", "Arce", "Flores",
        "Chura", "Mamani", "Condori"] };
  L.VEN = { q: 2, bau: "VNN",
    v: ["Salomon", "Yeferson", "Darwin", "Jhon", "Jefferson", "Tomas",
        "Wilker", "Jose", "Yangel", "Nahuel", "Cristian", "Eduard",
        "Josef", "Ronald", "Jan", "Alejandro", "Rafael", "Anderson",
        "Kevin", "Bernaldo"],
    w: ["Deyna", "Oriana", "Gabriela", "Yerliane", "Michelle", "Yenifer",
        "Barbara", "Ysaura", "Nayluisa", "Verlin", "Mariana", "Sandra"],
    n: ["Rondon", "Soteldo", "Machis", "Chancellor", "Savarino", "Rincon",
        "Herrera", "Martinez", "Osorio", "Bello", "Gonzalez", "Ferraresi",
        "Romo", "Cadiz", "Rodriguez", "Hernandez", "Sosa", "Navarro",
        "Faria", "Casseres"] };
  L.CRC = { q: 2, bau: "VNN",
    v: ["Keylor", "Joel", "Celso", "Bryan", "Francisco", "Kendall",
        "Anthony", "Manfred", "Yeltsin", "Jewison", "Orlando", "Juan",
        "Alvaro", "Josimar", "Alonso", "Douglas", "Randall", "Carlos",
        "Ariel", "Gerson"],
    w: ["Shirley", "Raquel", "Katherine", "Priscila", "Fabiola", "Melissa",
        "Maria", "Gloriana", "Valeria", "Daniela", "Alexandra", "Rocio"],
    n: ["Navas", "Campbell", "Borges", "Oviedo", "Calvo", "Waston",
        "Tejeda", "Contreras", "Aguilera", "Duarte", "Ruiz", "Zamora",
        "Vargas", "Salas", "Mora", "Chacon", "Solis", "Villalobos",
        "Alvarado", "Bennette"] };
  L.PAN = { q: 2, bau: "VNN",
    v: ["Anibal", "Michael", "Jose", "Adalberto", "Fidel", "Cecilio",
        "Eric", "Abdiel", "Cristian", "Edgardo", "Ismael", "Alberto",
        "Freddy", "Omar", "Ivan", "Andres", "Roderick", "Carlos",
        "Everardo", "Cesar"],
    w: ["Marta", "Lineth", "Karla", "Natalia", "Yenith", "Riley",
        "Deysire", "Wendy", "Aldrith", "Nicole", "Rosario", "Emily"],
    n: ["Godoy", "Murillo", "Fajardo", "Carrasquilla", "Escobar", "Waterman",
        "Diaz", "Blackman", "Davis", "Barcenas", "Quintero", "Cordoba",
        "Andrade", "Gomez", "Rodriguez", "Martinez", "Miller", "Bonilla",
        "Arroyo", "Tanner"] };
  L.HON = { q: 2, bau: "VNN",
    v: ["Alberth", "Romell", "Anthony", "Denil", "Kervin", "Edwin",
        "Deybi", "Jorge", "Rigoberto", "Luis", "Marcelo", "Andy",
        "Alexy", "Bryan", "Carlos", "Jose", "Wisdom", "Elison", "Joseph", "Juan"],
    w: ["Wendy", "Andrea", "Kimberly", "Gabriela", "Jenny", "Sandra",
        "Alejandra", "Nicole", "Karen", "Sofia", "Daniela", "Melissa"],
    n: ["Elis", "Quioto", "Lozano", "Garcia", "Rodriguez", "Flores",
        "Palma", "Alvarez", "Benguche", "Crisanto", "Nunez", "Menjivar",
        "Arriaga", "Maldonado", "Discua", "Vega", "Beckeles", "Acosta",
        "Meza", "Bengtson"] };
  L.GUA = { q: 2, bau: "VNN",
    v: ["Carlos", "Nicholas", "Rubio", "Oscar", "Jose", "Luis", "Marco",
        "Stheven", "Rodrigo", "Aaron", "Antonio", "Jorge", "Darwin",
        "Jonathan", "Alejandro", "Kevin", "Pedro", "Gerardo", "Erick", "Elmer"],
    w: ["Ana", "Maria", "Andrea", "Gabriela", "Karen", "Lucia", "Sofia",
        "Fernanda", "Alejandra", "Diana", "Claudia", "Astrid"],
    n: ["Ruiz", "Hernandez", "Lopez", "Santis", "Morales", "Rodriguez",
        "Mendez", "Castillo", "Aguirre", "Escobar", "Villagran", "Gonzalez",
        "Contreras", "Barrios", "Ceballos", "Oliva", "Ardon", "Rosales",
        "Pinto", "Franco"] };
  L.SLV = { q: 1, bau: "VNN",
    v: G.spanisch_v, w: G.spanisch_w,
    n: ["Zelaya", "Bonilla", "Larin", "Hernandez", "Menjivar", "Cerritos",
        "Ceren", "Alas", "Rugamas", "Portillo", "Gil", "Rivas",
        "Roldan", "Corrales", "Henriquez", "Landaverde"] };
  L.NCA = { q: 1, bau: "VNN",
    v: G.spanisch_v, w: G.spanisch_w,
    n: ["Bustos", "Palacios", "Barrera", "Acosta", "Montoya", "Gaitan",
        "Cardenas", "Rojas", "Lopez", "Chavarria", "Espinoza", "Zeledon",
        "Membreno", "Bonilla"] };
  L.DOM = { q: 1, bau: "VNN",
    v: G.spanisch_v, w: G.spanisch_w,
    n: ["Peralta", "Frias", "Perez", "Bautista", "Rosario", "Cuevas",
        "de la Cruz", "Guzman", "Ferreira", "Martinez", "Santos", "Encarnacion",
        "Nunez", "Reyes"] };
  L.CUB = { q: 2, bau: "VNN",
    v: ["Yordan", "Onel", "Maykel", "Luis", "Aricheell", "Yasmani",
        "Roberney", "Marcel", "Osvaldo", "Andy", "Karel", "Yasniel",
        "Dairon", "Reysander", "Yunior", "Alberto"],
    w: G.spanisch_w,
    n: ["Hernandez", "Perez", "Rodriguez", "Gonzalez", "Sanchez", "Torres",
        "Reyes", "Diaz", "Alvarez", "Ramirez", "Fernandez", "Castillo",
        "Herrera", "Duarte"] };
  L.PUR = { q: 1, bau: "VNN",
    v: ["Leandro", "Wilfredo", "Jeremy", "Steven", "Sidney", "Ricardo",
        "Christopher", "Jesus", "Roberto", "Gerald", "Nicolas", "Andres",
        "Jonathan", "Jose", "Ismael", "Emmanuel"],
    w: G.spanisch_w,
    n: ["Rivera", "Rodriguez", "Torres", "Santiago", "Ortiz", "Colon",
        "Rosario", "Vazquez", "Diaz", "Cruz", "Ramos", "Marrero",
        "Quinones", "Berrios"] };
  L.EQG = { q: 1, bau: "VNN",
    /* Aequatorialguinea: spanische Nachnamen ueber Fang-Namen gelegt. */
    v: ["Emilio", "Iban", "Pablo", "Jose", "Basilio", "Saul", "Federico",
        "Josete", "Carlos", "Luis", "Salomon", "Ivan", "Diosdado",
        "Esteban", "Ricardo", "Mariano"],
    w: G.spanisch_w,
    n: ["Nsue", "Salvador", "Ganet", "Obiang", "Buyla", "Ndong", "Envo",
        "Akapo", "Bikoro", "Mba", "Esono", "Nchama", "Owono", "Edjogo"] };
  L.AND = { q: 1, bau: "VNN",
    v: ["Marc", "Ricard", "Cristian", "Jordi", "Marcio", "Ludovic",
        "Aleix", "Guillaume", "Alex", "Berto", "Ivan", "Joan",
        "Albert", "Sergi", "Pol", "Marti"],
    w: ["Nuria", "Laia", "Ariadna", "Anna", "Berta", "Clara", "Marta",
        "Ona", "Judit", "Gemma", "Roser", "Nadia"],
    n: ["Vales", "Fernandez", "Rebes", "Alaez", "San Nicolas", "Cervos",
        "Rubio", "Lopez", "Vieira", "Rosas", "Clemente", "Sanchez",
        "Garcia", "Pujol"] };

  /* ======================================================================
     ea — 20 Nationen Ost- und Suedosteuropas. Der Raum ist zu grob: Polnisch,
     Ungarisch, Rumaenisch, Albanisch und Georgisch sind nicht einmal
     verwandt. Ungarisch setzt den Familiennamen VORAN.
     ====================================================================== */
  /* Polnisch beugt die ADJEKTIVISCHE Endung: Kaminski -> Kaminska. Meine
     erste Fassung gab Polen die russische Regel (-ov/-ev/-in), die auf
     -ski gar nicht greift — polnische Frauen trugen die maennliche Form. */
  L.POL = { q: 3, nw: "ski",
    v: ["Robert", "Piotr", "Wojciech", "Jakub", "Karol", "Nicola", "Sebastian",
        "Bartosz", "Przemyslaw", "Kamil", "Michal", "Krzysztof", "Mateusz",
        "Pawel", "Damian", "Jan", "Grzegorz", "Tomasz", "Lukasz", "Adam"],
    w: ["Ewa", "Magdalena", "Agnieszka", "Katarzyna", "Anna", "Julia",
        "Zofia", "Maja", "Lena", "Alicja", "Natalia", "Karolina"],
    n: ["Lewandowski", "Zielinski", "Szczesny", "Kiwior", "Swiderski",
        "Zalewski", "Bednarek", "Frankowski", "Milik", "Grosicki",
        "Kowalski", "Wojcik", "Kaminski", "Nowak", "Wisniewski",
        "Dabrowski", "Lis", "Mazur", "Krawczyk", "Piatek"] };
  L.CZE = { q: 3, nw: "ova",
    v: ["Patrik", "Tomas", "Vladimir", "Jakub", "Adam", "Ladislav", "Antonin",
        "Lukas", "Vaclav", "Petr", "Jan", "David", "Martin", "Ondrej",
        "Filip", "Matej", "Michal", "Josef", "Radek", "Pavel"],
    w: ["Tereza", "Katerina", "Petra", "Lucie", "Barbora", "Eliska",
        "Anna", "Adela", "Klara", "Marketa", "Veronika", "Nikola"],
    n: ["Schick", "Soucek", "Coufal", "Barak", "Kuchta", "Krejci", "Provod",
        "Hlozek", "Chory", "Novak", "Svoboda", "Dvorak", "Cerny", "Prochazka",
        "Kucera", "Vesely", "Horak", "Nemec", "Marek", "Pospisil"] };
  L.SVK = { q: 3, nw: "ova",
    v: ["Marek", "Milan", "Juraj", "Ondrej", "David", "Stanislav", "Lukas",
        "Tomas", "Norbert", "Vladimir", "Martin", "Peter", "Jan", "Michal",
        "Patrik", "Adam", "Matus", "Filip", "Samuel", "Denis"],
    w: ["Zuzana", "Katarina", "Martina", "Lucia", "Nikola", "Simona",
        "Ema", "Sofia", "Viktoria", "Michaela", "Kristina", "Barbora"],
    n: ["Hamsik", "Skriniar", "Kucka", "Duda", "Hancko", "Lobotka", "Duris",
        "Weiss", "Bozenik", "Rusnak", "Horvath", "Kovac", "Varga", "Toth",
        "Balaz", "Molnar", "Novotny", "Sedlak", "Kral", "Zeman"] };
  L.HUN = { q: 3, bau: "NV",
    /* Ungarisch: Familienname zuerst — Szoboszlai Dominik, nicht umgekehrt. */
    v: ["Dominik", "Roland", "Willi", "Adam", "Peter", "Balazs", "Attila",
        "Zsolt", "Milos", "Barnabas", "Callum", "Marton", "Andras",
        "Laszlo", "Gergo", "Bendeguz", "Krisztofer", "Daniel", "Bence", "Tamas"],
    w: ["Zsofia", "Anna", "Hanna", "Luca", "Emma", "Lili", "Boglarka",
        "Reka", "Dorina", "Eszter", "Petra", "Kata"],
    n: ["Szoboszlai", "Sallai", "Orban", "Gulacsi", "Szalai", "Nagy",
        "Kovacs", "Toth", "Szabo", "Horvath", "Varga", "Kiss", "Molnar",
        "Nemeth", "Farkas", "Balogh", "Papp", "Lukacs", "Meszaros", "Simon"] };
  L.ROU = { q: 3,
    v: ["Nicolae", "Ianis", "Denis", "Radu", "Razvan", "Andrei", "Valentin",
        "Vlad", "Alexandru", "Florinel", "Marius", "Ionut", "Cristian",
        "Darius", "Bogdan", "Gabriel", "Mihai", "Stefan", "George", "Adrian"],
    w: ["Ioana", "Andreea", "Maria", "Elena", "Cristina", "Alexandra",
        "Gabriela", "Diana", "Bianca", "Larisa", "Roxana", "Teodora"],
    n: ["Stanciu", "Hagi", "Dragusin", "Marin", "Puscas", "Mitrita",
        "Popescu", "Ionescu", "Radu", "Dumitru", "Constantin", "Georgescu",
        "Stan", "Nistor", "Munteanu", "Toma", "Barbu", "Cristea",
        "Sorescu", "Lazar"] };
  L.BUL = { q: 3, nw: "a",
    v: ["Kiril", "Georgi", "Ilia", "Kristiyan", "Todor", "Andrian",
        "Aleksandar", "Dimitar", "Petar", "Nikolay", "Ivan", "Martin",
        "Stefan", "Valentin", "Radoslav", "Bozhidar", "Filip", "Emil",
        "Zdravko", "Preslav"],
    w: ["Mariya", "Elena", "Gergana", "Yoana", "Viktoriya", "Desislava",
        "Tsvetelina", "Nadezhda", "Kristina", "Radost", "Silviya", "Petya"],
    n: ["Despodov", "Popov", "Ivanov", "Georgiev", "Dimitrov", "Stoyanov",
        "Petrov", "Kolev", "Hristov", "Todorov", "Angelov", "Marinov",
        "Iliev", "Nedelev", "Chochev", "Antov", "Gruev", "Nikolov",
        "Bozhikov", "Vitanov"] };
  L.RUS = { q: 3, nw: "a",
    v: ["Aleksandr", "Dmitri", "Fyodor", "Anton", "Matvei", "Aleksei",
        "Daler", "Maksim", "Ivan", "Sergei", "Andrei", "Nikolai",
        "Roman", "Artem", "Yuri", "Vladislav", "Igor", "Denis", "Pavel", "Ilya"],
    w: ["Anastasia", "Ekaterina", "Maria", "Daria", "Olga", "Yulia",
        "Svetlana", "Irina", "Natalia", "Elena", "Ksenia", "Polina"],
    n: ["Golovin", "Miranchuk", "Chalov", "Zakharyan", "Safonov", "Kuzyaev",
        "Ivanov", "Smirnov", "Kuznetsov", "Popov", "Vasiliev", "Petrov",
        "Sokolov", "Mikhailov", "Fedorov", "Morozov", "Volkov", "Alekseev",
        "Lebedev", "Semenov"] };
  L.UKR = { q: 3, nw: "a",
    v: ["Andriy", "Mykhailo", "Oleksandr", "Ruslan", "Vitaliy", "Taras",
        "Georgiy", "Illia", "Volodymyr", "Serhiy", "Roman", "Bohdan",
        "Artem", "Yevhen", "Denys", "Maksym", "Danylo", "Ihor", "Viktor", "Yuriy"],
    w: ["Olha", "Kateryna", "Iryna", "Anastasiia", "Yuliia", "Sofiia",
        "Mariia", "Daryna", "Viktoriia", "Solomiia", "Oksana", "Vira"],
    n: ["Yarmolenko", "Mudryk", "Zinchenko", "Malinovskyi", "Dovbyk",
        "Tsygankov", "Shevchenko", "Bondarenko", "Kovalenko", "Kravchenko",
        "Boiko", "Melnyk", "Tkachenko", "Oliynyk", "Marchenko", "Rudko",
        "Sydorchuk", "Stepanenko", "Kharatin", "Zabarnyi"] };
  L.BLR = { q: 2, nw: "a",
    v: ["Maksim", "Vitali", "Igor", "Nikita", "Pavel", "Aleksandr",
        "Denis", "Yuri", "Roman", "Ivan", "Gleb", "Artem",
        "Dmitri", "Sergei", "Anton", "Vladislav"],
    w: ["Anastasiya", "Volha", "Kaciaryna", "Alena", "Maryia", "Darya",
        "Yuliya", "Iryna", "Sviatlana", "Tatsiana", "Palina", "Hanna"],
    n: ["Skavysh", "Lisakovich", "Gordeichuk", "Bakhar", "Yablonski",
        "Volodko", "Naumov", "Klimovich", "Sachyuka", "Selyava",
        "Ivanov", "Kavalyou", "Karpovich", "Shvetsov"] };
  L.SRB = { q: 3,
    v: ["Aleksandar", "Dusan", "Sergej", "Filip", "Nemanja", "Strahinja",
        "Andrija", "Luka", "Predrag", "Marko", "Stefan", "Nikola",
        "Milos", "Vladimir", "Uros", "Lazar", "Ivan", "Petar", "Dragan", "Bojan"],
    w: ["Jovana", "Milica", "Ana", "Marija", "Teodora", "Sara", "Andjela",
        "Katarina", "Tijana", "Nevena", "Dunja", "Iva"],
    n: ["Mitrovic", "Vlahovic", "Milinkovic-Savic", "Kostic", "Tadic",
        "Pavlovic", "Zivkovic", "Jovic", "Gudelj", "Lukic", "Jovanovic",
        "Nikolic", "Petrovic", "Markovic", "Ilic", "Stojanovic",
        "Djordjevic", "Stankovic", "Popovic", "Radovanovic"] };
  L.CRO = { q: 3,
    v: ["Luka", "Ivan", "Mateo", "Josip", "Marcelo", "Andrej", "Ante",
        "Domagoj", "Borna", "Josko", "Mario", "Nikola", "Marko", "Lovro",
        "Dominik", "Petar", "Filip", "Toma", "Bruno", "Duje"],
    w: ["Ana", "Petra", "Ivana", "Marija", "Lucija", "Dora", "Mia",
        "Klara", "Ema", "Nika", "Lana", "Tea"],
    n: ["Modric", "Perisic", "Kovacic", "Brozovic", "Gvardiol", "Kramaric",
        "Petkovic", "Livakovic", "Sosa", "Juranovic", "Horvat", "Novak",
        "Maric", "Babic", "Knezevic", "Vukovic", "Matic", "Blazevic",
        "Pasalic", "Sucic"] };
  L.BIH = { q: 3,
    v: ["Edin", "Miralem", "Sead", "Amar", "Rade", "Ermedin", "Haris",
        "Ivan", "Dennis", "Adnan", "Emir", "Nihad", "Anel", "Armin",
        "Benjamin", "Sanjin", "Mirza", "Tarik", "Damir", "Almir"],
    w: ["Amina", "Lejla", "Selma", "Ajla", "Emina", "Merima", "Dzenana",
        "Sara", "Naida", "Adna", "Ilma", "Hana"],
    n: ["Dzeko", "Pjanic", "Kolasinac", "Dedic", "Krunic", "Demirovic",
        "Hadziahmetovic", "Tahirovic", "Sunjic", "Hajradinovic",
        "Begovic", "Salihovic", "Ibisevic", "Zukanovic", "Cimirot",
        "Muharemovic", "Hodzic", "Music", "Mujakic", "Sisic"] };
  L.SVN = { q: 3,
    v: ["Jan", "Benjamin", "Josip", "Timi", "Adam", "Petar", "Erik",
        "Zan", "Miha", "David", "Nejc", "Andraz", "Vanja", "Domen",
        "Sandi", "Blaz", "Luka", "Matic", "Ziga", "Rok"],
    w: ["Nika", "Eva", "Zala", "Ana", "Lara", "Sara", "Maja", "Neza",
        "Ema", "Tinkara", "Julija", "Klara"],
    n: ["Oblak", "Sesko", "Ilicic", "Iliv", "Bijol", "Mlakar", "Elsnik",
        "Verbic", "Karnicnik", "Stojanovic", "Novak", "Horvat", "Kranjc",
        "Zajc", "Vidmar", "Kovacic", "Potocnik", "Bezjak", "Crnigoj", "Drkusic"] };
  L.MKD = { q: 2,
    v: ["Goran", "Eljif", "Enis", "Ezgjan", "Stefan", "Bojan", "Darko",
        "Aleksandar", "Milan", "Visar", "Jani", "Vlatko", "Ivan",
        "Marko", "Nikola", "Filip"],
    w: ["Marija", "Ana", "Elena", "Kristina", "Bojana", "Sara", "Ivana",
        "Angela", "Dragana", "Natasa", "Vesna", "Simona"],
    n: ["Pandev", "Elmas", "Bardhi", "Alioski", "Ristovski", "Trajkovski",
        "Velkovski", "Nikolov", "Stojanovski", "Petrov", "Ilievski",
        "Georgievski", "Dimitrievski", "Spirovski", "Musliu", "Kostadinov"] };
  L.ALB = { q: 3,
    v: ["Armando", "Berat", "Kristjan", "Nedim", "Elseid", "Myrto",
        "Sokol", "Klaus", "Jasir", "Arber", "Qazim", "Marash",
        "Ardian", "Endri", "Rey", "Ledian"],
    w: ["Aurora", "Klea", "Megi", "Sara", "Ana", "Erisa", "Xhesika",
        "Fjolla", "Denisa", "Enxhi", "Kejsi", "Ledia"],
    n: ["Broja", "Djimsiti", "Asllani", "Bajrami", "Hysaj", "Uzuni",
        "Manaj", "Ramadani", "Balliu", "Kumbulla", "Berisha", "Hoxha",
        "Shehu", "Krasniqi", "Gjoka", "Prifti", "Zeneli", "Dermaku",
        "Cikalleshi", "Laci"] };
  L.KOS = { q: 2, erbt: "ALB",
    n: ["Muriqi", "Rashica", "Celina", "Kryeziu", "Zeneli", "Halimi",
        "Aliti", "Hadergjonaj", "Vojvoda", "Berisha", "Krasniqi", "Gashi",
        "Morina", "Shala"] };
  L.MNE = { q: 2, erbt: "SRB",
    n: ["Jovetic", "Savic", "Vesovic", "Vukcevic", "Mugosa", "Marusic",
        "Haksabanovic", "Krstovic", "Radunovic", "Perisic", "Simic",
        "Damjanovic", "Sekulic", "Boskovic"] };
  L.MDA = { q: 2, erbt: "ROU",
    n: ["Ionita", "Nicolaescu", "Cojocaru", "Reabciuk", "Postolachi",
        "Damascan", "Rata", "Cebotaru", "Bordian", "Craciun",
        "Platica", "Caimacov", "Sirbu", "Baboglo"] };
  L.ARM = { q: 3,
    v: ["Henrikh", "Sargis", "Tigran", "Eduard", "Kamo", "Varazdat",
        "Nair", "Hovhannes", "Arman", "Artak", "Gevorg", "Vahan",
        "Levon", "Davit", "Narek", "Ashot"],
    w: ["Anahit", "Lusine", "Gayane", "Armine", "Nare", "Mariam",
        "Ani", "Siranush", "Karine", "Astghik", "Hasmik", "Lilit"],
    n: ["Mkhitaryan", "Adamyan", "Barseghyan", "Spertsyan", "Hovhannisyan",
        "Grigoryan", "Sargsyan", "Harutyunyan", "Petrosyan", "Khachatryan",
        "Melkonyan", "Avetisyan", "Manasyan", "Ghazaryan", "Karapetyan",
        "Voskanyan"] };
  L.GEO = { q: 3,
    v: ["Khvicha", "Giorgi", "Zuriko", "Otar", "Saba", "Luka", "Guram",
        "Levan", "Nika", "Budu", "Lasha", "Irakli", "Davit", "Vakhtang",
        "Zurab", "Beka"],
    w: ["Nino", "Ana", "Mariam", "Tamar", "Salome", "Elene", "Natia",
        "Ketevan", "Lika", "Sopho", "Nia", "Tekla"],
    n: ["Kvaratskhelia", "Mikautadze", "Chakvetadze", "Kiteishvili",
        "Lochoshvili", "Kashia", "Mamardashvili", "Tsitaishvili",
        "Beridze", "Gvilia", "Dvali", "Kvekveskiri", "Zivzivadze",
        "Gogichaishvili", "Altunashvili", "Shengelia"] };

  /* ======================================================================
     ar — 19 Nationen. Der Maghreb schreibt franzoesisch transkribiert
     (Benzema, Mahrez), der Maschrik englisch (Elneny, Hegazi) — das ist
     dieselbe Sprache in zwei Schreibweisen und gehoert getrennt.
     ====================================================================== */
  G.arab_w = ["Fatima", "Aisha", "Maryam", "Zainab", "Nour", "Layla",
    "Amira", "Hala", "Rania", "Salma", "Yasmin", "Dalal"];

  L.EGY = { q: 3,
    v: ["Mohamed", "Mahmoud", "Omar", "Mostafa", "Ahmed", "Trezeguet",
        "Ramadan", "Emam", "Akram", "Hamdi", "Karim", "Zizo", "Marwan",
        "Amr", "Hossam", "Islam", "Sherif", "Tarek", "Ayman", "Nabil"],
    w: G.arab_w,
    n: ["Salah", "Elneny", "Hegazi", "Trezeguet", "Marmoush", "Mohsen",
        "Sobhi", "Fathi", "Gabaski", "Ashour", "Abdelmonem", "Hamdy",
        "Shikabala", "El Said", "Kahraba", "Ibrahim", "Hassan", "Said",
        "Abdallah", "Rabia"] };
  L.MAR = { q: 3,
    /* Franzoesische Transkription: Hakimi, Ziyech, En-Nesyri. */
    v: ["Achraf", "Hakim", "Youssef", "Sofyan", "Azzedine", "Noussair",
        "Romain", "Yassine", "Selim", "Bilal", "Abde", "Ayoub", "Amine",
        "Ismael", "Nayef", "Zakaria", "Mehdi", "Anass", "Walid", "Karim"],
    w: G.arab_w,
    n: ["Hakimi", "Ziyech", "En-Nesyri", "Amrabat", "Ounahi", "Mazraoui",
        "Bounou", "Saiss", "Boufal", "Aguerd", "Benoun", "Chair",
        "Harit", "El Khannouss", "Sabiri", "Bennasser", "Louza",
        "Attiat-Allah", "Dari", "Cheddira"] };
  L.ALG = { q: 3,
    v: ["Riyad", "Islam", "Sofiane", "Youcef", "Ramy", "Aissa", "Adam",
        "Ahmed", "Baghdad", "Amir", "Rais", "Mohamed", "Yacine", "Farid",
        "Hicham", "Nabil", "Djamel", "Karim", "Zinedine", "Anis"],
    w: G.arab_w,
    n: ["Mahrez", "Slimani", "Feghouli", "Atal", "Bensebaini", "Bennacer",
        "Ounas", "Belaili", "Bounedjah", "Mandi", "Zerrouki", "Amoura",
        "Boudaoui", "Chaibi", "Guitoun", "Benlamri", "Tougai", "Gouiri",
        "Aouar", "Hadjam"] };
  L.TUN = { q: 3,
    v: ["Wahbi", "Youssef", "Ellyes", "Aissa", "Hannibal", "Mohamed",
        "Ali", "Seifeddine", "Anis", "Montassar", "Elias", "Bechir",
        "Nader", "Wajdi", "Ferjani", "Dylan", "Yassine", "Oussama",
        "Hamza", "Ghailene"],
    w: G.arab_w,
    n: ["Khazri", "Msakni", "Skhiri", "Laidouni", "Mejbri", "Drager",
        "Talbi", "Bronn", "Abdi", "Jaziri", "Sassi", "Ben Romdhane",
        "Maaloul", "Meriah", "Chaouat", "Kechrida", "Haddadi", "Rafia",
        "Achouri", "Ben Slimane"] };
  L.LBY = { q: 2,
    v: ["Muaid", "Ahmed", "Sanad", "Hamdou", "Mohamed", "Anis", "Ali",
        "Faisal", "Omar", "Salem", "Motasem", "Abdulla", "Hamza",
        "Zakaria", "Mahmoud", "Khaled"],
    w: G.arab_w,
    n: ["Ellafi", "Benali", "Al Tarhouni", "Al Mosrati", "Zubya",
        "Al Ghanoudi", "Al Maghasi", "Suleiman", "Al Tuwaty",
        "Bengrina", "Al Sharif", "Al Hamali", "Mabrouk", "Ashour"] };
  L.MTN = { q: 1,
    v: ["Aboubakar", "Ibrahima", "Mohamed", "Bessam", "Sidi", "Hemeya",
        "Cheikh", "El Hacen", "Moctar", "Yali", "Abdallahi", "Dellahi",
        "Souleymane", "Beibou", "Khalil", "Ahmed"],
    w: G.arab_w,
    n: ["Kamara", "Diallo", "Ould Deye", "El Id", "Yaly", "Abeid",
        "Bessam", "Ba", "Sy", "Sarr", "Mohamed", "Salem", "Vall", "Niang"] };
  L.SUD = { q: 2,
    v: ["Mohamed", "Abdelrahman", "Yasir", "Salaheldin", "Mustafa",
        "Abu Aqla", "Walieldin", "Sharaf", "Ammar", "Ahmed", "Osman",
        "Bakhit", "Elsheikh", "Mazin", "Ramadan", "Nasr"],
    w: G.arab_w,
    n: ["Abdelrahman", "Eissa", "Mozamil", "Amir", "Tia", "Bakhit",
        "Osman", "Elsheikh", "Karshoum", "Nasr", "Ahmed", "Idris",
        "Adam", "Hassan"] };

  /* ---- Maschrik und Golf ------------------------------------------------ */
  L.KSA = { q: 3, bau: "VpN", m: ["Al"],
    v: ["Salem", "Salman", "Firas", "Mohammed", "Saleh", "Sultan",
        "Abdulellah", "Yasser", "Nawaf", "Hassan", "Ali", "Fahad",
        "Abdullah", "Khalid", "Faisal", "Turki", "Saud", "Majed"],
    w: G.arab_w,
    n: ["Dawsari", "Faraj", "Buraikan", "Shehri", "Owais", "Ghannam",
        "Amri", "Malki", "Bulayhi", "Tambakti", "Najei", "Hamdan",
        "Khaibari", "Sulaiheem", "Yami", "Radhi"] };
  L.QAT = { q: 3, bau: "VpN", m: ["Al"],
    v: ["Akram", "Almoez", "Hassan", "Abdelkarim", "Karim", "Homam",
        "Ismaeel", "Mohammed", "Meshaal", "Musab", "Ahmed", "Tarek",
        "Bassam", "Yusuf", "Jassem", "Khalid"],
    w: G.arab_w,
    n: ["Afif", "Ali", "Haydos", "Hassan", "Boudiaf", "Rawi", "Khoukhi",
        "Mohammed", "Barsham", "Ahrak", "Waad", "Miftah", "Salman", "Aziz"] };
  L.UAE = { q: 2, bau: "VpN", m: ["Al"],
    v: ["Ali", "Fabio", "Caio", "Yahya", "Khalifa", "Harib", "Tahnoon",
        "Majid", "Abdullah", "Sultan", "Khalid", "Saeed", "Bandar",
        "Mohammed", "Omar", "Zayed"],
    w: G.arab_w,
    n: ["Mabkhout", "Ghareeb", "Abdulrahman", "Hammadi", "Attas",
        "Suwaidi", "Mazrouei", "Balooshi", "Hashmi", "Ketbi", "Nuaimi",
        "Zaabi", "Dhanhani", "Shamsi"] };
  L.KUW = { q: 2, bau: "VpN", m: ["Al"],
    v: ["Bader", "Yousef", "Faisal", "Sultan", "Hamad", "Khaled",
        "Fahad", "Abdullah", "Mohammad", "Ahmad", "Reda", "Eid",
        "Salman", "Mubarak", "Nawaf", "Talal"],
    w: G.arab_w,
    n: ["Mutawa", "Nashmi", "Zankawi", "Ajmi", "Enezi", "Rashidi",
        "Dhefiri", "Sabah", "Khaldi", "Fadhel", "Otaibi", "Harbi",
        "Dhaher", "Mutairi"] };
  L.BHR = { q: 2, bau: "VpN", m: ["Al"],
    v: ["Sayed", "Ali", "Mohamed", "Komail", "Abdulla", "Jasim",
        "Hashim", "Waleed", "Ahmed", "Kamil", "Mahdi", "Sami",
        "Ismaeel", "Yusuf", "Husain", "Ebrahim"],
    w: G.arab_w,
    n: ["Hardan", "Madan", "Marhoon", "Shaikh", "Aaish", "Romaihi",
        "Hasan", "Ahmed", "Baqer", "Latif", "Khalasi", "Dhaen",
        "Helal", "Sayed"] };
  L.OMA = { q: 2, bau: "VpN", m: ["Al"],
    v: ["Ali", "Abdulaziz", "Jameel", "Muhsen", "Salaah", "Arshad",
        "Khalid", "Issam", "Ahmed", "Harib", "Zahir", "Mohsin",
        "Amjad", "Rabia", "Sultan", "Nasser"],
    w: G.arab_w,
    n: ["Busaidi", "Yahyaei", "Ghassani", "Mushaifri", "Saadi", "Alawi",
        "Rushaidi", "Kaabi", "Hosni", "Mukhaini", "Rawahi", "Habsi",
        "Balushi", "Harthi"] };
  L.IRQ = { q: 3,
    v: ["Aymen", "Ibrahim", "Mohanad", "Osama", "Amjad", "Ali", "Hussein",
        "Zidane", "Rebin", "Alaa", "Mustafa", "Sherko", "Bashar",
        "Ahmed", "Saad", "Hasan"],
    w: G.arab_w,
    n: ["Hussein", "Bayesh", "Ali", "Rashid", "Attwan", "Faez", "Iqbal",
        "Sulaka", "Jasim", "Abdulridha", "Tahseen", "Karrar",
        "Kadhim", "Mhawi", "Nashat", "Sabhan"] };
  L.SYR = { q: 2,
    v: ["Omar", "Mahmoud", "Aias", "Ibrahim", "Alaa", "Kamel", "Fahd",
        "Khaled", "Ammar", "Firas", "Sanharib", "Mardik", "Ezequiel",
        "Youssef", "Hamid", "Zaher"],
    w: G.arab_w,
    n: ["Khribin", "Al Mawas", "Al Salih", "Alma", "Aldali", "Mardikian",
        "Kharbin", "Ajan", "Midani", "Krouma", "Jenyat", "Omari",
        "Hamwi", "Aldayaa"] };
  L.LBN = { q: 2,
    v: ["Hassan", "Bassel", "Mohamad", "Soony", "Rabih", "Walid",
        "Hilal", "Karim", "Maher", "Nader", "Georges", "Elie",
        "Joan", "Ali", "Kassem", "Charbel"],
    w: G.arab_w,
    n: ["Maatouk", "Jradi", "Haidar", "Saad", "Ataya", "Bou Diab",
        "Zein", "Chahoud", "Melki", "Matar", "Khalil", "Antar",
        "Dhaini", "Hallani"] };
  L.JOR = { q: 2,
    v: ["Musa", "Yazan", "Mahmoud", "Nizar", "Ehsan", "Ali", "Rajaei",
        "Yazeed", "Mousa", "Anas", "Noor", "Baha", "Feras", "Saleh",
        "Hamza", "Abdallah"],
    w: G.arab_w,
    n: ["Al Tamari", "Al Naimat", "Al Mardi", "Haddad", "Rashid",
        "Bani Attiah", "Abu Zrayq", "Alsaify", "Odeh", "Nasib",
        "Khattab", "Salim", "Fadel", "Marei"] };
  L.PLE = { q: 2,
    v: ["Oday", "Tamer", "Mahmoud", "Layth", "Musab", "Wessam",
        "Islam", "Mohammed", "Yaser", "Zaid", "Ataa", "Camilo",
        "Shehab", "Hamed", "Khaled", "Amid"],
    w: G.arab_w,
    n: ["Dabbagh", "Seyam", "Wadi", "Kharoub", "Battat", "Termanini",
        "Rashid", "Salhi", "Qunbar", "Yameen", "Zreiq", "Abu Warda",
        "Mahajna", "Jondi"] };
  L.YEM = { q: 1,
    v: ["Ahmed", "Ala", "Nasser", "Mohammed", "Ayman", "Abdulwasea",
        "Saleh", "Waheeb", "Haitham", "Fahd", "Ali", "Yasser",
        "Osama", "Akram", "Hamza", "Marwan"],
    w: G.arab_w,
    n: ["Al Sarori", "Mahdi", "Al Hifdi", "Al Worafi", "Nasser",
        "Al Matari", "Al Khaibri", "Saeed", "Al Buhaisi", "Hassan",
        "Al Sasi", "Ghaleb", "Zayed", "Al Anbari"] };

  /* ======================================================================
     sk — 9 Nationen. Der Raum war falsch geschnitten: Finnisch und Estnisch
     gehoeren zur finno-ugrischen Familie, Lettisch und Litauisch zur
     baltischen. Mit den nordgermanischen Sprachen sind sie nicht verwandt —
     „Mikkel Halvorsen" war fuer einen Finnen so falsch wie fuer einen Esten.
     ====================================================================== */
  L.SWE = { q: 3,
    v: ["Alexander", "Emil", "Viktor", "Dejan", "Anthony", "Jesper",
        "Robin", "Mattias", "Ludwig", "Gustaf", "Hugo", "Oscar",
        "Elias", "Isak", "Anton", "Filip", "Sebastian", "Erik", "Lars", "Nils"],
    w: ["Fridolina", "Kosovare", "Magdalena", "Stina", "Hanna", "Sofia",
        "Elin", "Amanda", "Julia", "Ebba", "Wilma", "Alva"],
    n: ["Isak", "Forsberg", "Gyokeres", "Kulusevski", "Elanga", "Lindelof",
        "Olsen", "Bergvall", "Andersson", "Johansson", "Karlsson",
        "Nilsson", "Eriksson", "Larsson", "Olsson", "Persson", "Svensson",
        "Gustafsson", "Pettersson", "Jonsson"] };
  L.NOR = { q: 3,
    v: ["Erling", "Martin", "Alexander", "Sander", "Fredrik", "Kristian",
        "Morten", "Patrick", "Jorgen", "Leo", "Antonio", "Oscar",
        "Emil", "Hakon", "Magnus", "Ola", "Bjorn", "Jonas", "Sondre", "Mats"],
    w: ["Ada", "Caroline", "Guro", "Ingrid", "Maren", "Frida", "Emilie",
        "Thea", "Nora", "Sara", "Julie", "Mathilde"],
    n: ["Haaland", "Odegaard", "Sorloth", "Berge", "Aursnes", "Nusa",
        "Ostigard", "Ryerson", "Hansen", "Johansen", "Olsen", "Larsen",
        "Andersen", "Pedersen", "Nilsen", "Kristiansen", "Jensen",
        "Karlsen", "Berg", "Halvorsen"] };
  L.DEN = { q: 3,
    v: ["Christian", "Rasmus", "Pierre-Emile", "Andreas", "Joakim",
        "Jonas", "Mikkel", "Victor", "Kasper", "Simon", "Anders",
        "Frederik", "Lasse", "Magnus", "Nicolai", "Oliver", "Emil",
        "Mathias", "Jesper", "Soren"],
    w: ["Pernille", "Signe", "Nadia", "Katrine", "Sofie", "Emma",
        "Freja", "Ida", "Josefine", "Clara", "Laura", "Alma"],
    n: ["Eriksen", "Hojlund", "Hojbjerg", "Christensen", "Maehle",
        "Dolberg", "Skov", "Schmeichel", "Jensen", "Nielsen", "Hansen",
        "Pedersen", "Andersen", "Christiansen", "Larsen", "Sorensen",
        "Rasmussen", "Jorgensen", "Petersen", "Madsen"] };
  L.ISL = { q: 3, bau: "VpN", anhang: true, m: ["son"], mw: ["dottir"],
    /* Island kennt keine Familiennamen: der Nachname ist der Vatername plus
       -son oder -dottir. Gudmundur Sigurdsson heisst so, WEIL sein Vater
       Sigurdur hiess. Deshalb steht in `n` der VATERNAME, die Endung kommt
       aus der Partikel — und die ist geschlechtsabhaengig. */
    v: ["Gylfi", "Alfred", "Arnor", "Hakon", "Jon", "Birkir", "Runar",
        "Andri", "Sverrir", "Willum", "Orri", "Isak", "Mikael", "Kolbeinn",
        "Ragnar", "Aron", "Bjarni", "Gudmundur", "Stefan", "Thorir"],
    w: ["Sara", "Glodis", "Dagny", "Karolina", "Berglind", "Hallbera",
        "Amanda", "Sveindis", "Elin", "Gunnhildur", "Agla", "Katrin"],
    n: ["Sigurds", "Gunnars", "Magnus", "Jons", "Olafs", "Bjarna",
        "Arna", "Hall", "Thors", "Einars", "Gudmunds", "Stefans",
        "Kristins", "Ingvars", "Palma", "Fridriks"] };
  L.FRO = { q: 1, erbt: "DEN",
    n: ["Olsen", "Joensen", "Hansen", "Poulsen", "Jacobsen", "Danielsen",
        "Petersen", "Davidsen", "Bartalsstovu", "Vatnhamar", "Klettskard",
        "Nattestad", "Faero", "Sorensen"] };
  L.FIN = { q: 3,
    /* Finnisch: eigene Sprachfamilie, eigene Namen. Kein einziger davon
       sieht skandinavisch aus, und das ist der Punkt. */
    v: ["Teemu", "Joel", "Robin", "Glen", "Fredrik", "Rasmus", "Leo",
        "Daniel", "Oliver", "Lucas", "Benjamin", "Topi", "Jere",
        "Onni", "Eetu", "Aleksi", "Mikko", "Juha", "Ville", "Antti"],
    w: ["Linda", "Emma", "Adelina", "Natalia", "Olga", "Nora", "Aino",
        "Ilona", "Sanni", "Venla", "Elli", "Iida"],
    n: ["Pukki", "Kamara", "Lod", "Uronen", "Hradecky", "Jensen",
        "Virtanen", "Korhonen", "Makinen", "Nieminen", "Makela",
        "Hamalainen", "Laine", "Heikkinen", "Koskinen", "Jarvinen",
        "Lehtonen", "Salminen", "Mattila", "Rantanen"] };
  L.EST = { q: 3,
    v: ["Ragnar", "Konstantin", "Karol", "Mattias", "Rauno", "Henri",
        "Vlasi", "Marten", "Sander", "Markus", "Robi", "Erik",
        "Kristjan", "Joonas", "Rasmus", "Martin"],
    w: ["Kadi", "Maria", "Liis", "Anett", "Kelly", "Getter", "Katrin",
        "Piret", "Kaia", "Triin", "Eva", "Laura"],
    n: ["Klavan", "Vassiljev", "Mets", "Kait", "Sappinen", "Sinyavskiy",
        "Tamm", "Saar", "Sepp", "Magi", "Kask", "Kukk", "Rebane",
        "Ilves", "Parn", "Koppel"] };
  L.LVA = { q: 2, nw: "lv",
    v: ["Janis", "Roberts", "Vladislavs", "Andrejs", "Kristers", "Raivis",
        "Antonijs", "Marcis", "Eduards", "Alvis", "Davis", "Kaspars",
        "Girts", "Toms", "Rihards", "Arturs"],
    w: ["Anna", "Elizabete", "Alise", "Marta", "Laura", "Liva",
        "Elina", "Katrina", "Sofija", "Evelina", "Agnese", "Ilze"],
    n: ["Ikaunieks", "Uldrikis", "Gutkovskis", "Ciganiks", "Jaunzems",
        "Berzins", "Kalnins", "Ozols", "Krumins", "Balodis", "Liepins",
        "Vitols", "Zarins", "Skuja", "Priede", "Lacis"] };
  L.LTU = { q: 2,
    v: ["Fedor", "Vykintas", "Edvinas", "Justas", "Gvidas", "Arvydas",
        "Nauris", "Paulius", "Rokas", "Tomas", "Mantas", "Deividas",
        "Karolis", "Domantas", "Ignas", "Lukas"],
    w: ["Ugne", "Gabija", "Emilija", "Austeja", "Kamile", "Ieva",
        "Migle", "Auguste", "Liepa", "Egle", "Rugile", "Smilte"],
    n: ["Cernych", "Slivka", "Girdvainis", "Novikovas", "Utkus",
        "Kazlauskas", "Petrauskas", "Jankauskas", "Stankevicius",
        "Vasiliauskas", "Butkus", "Urbonas", "Navickas", "Paulauskas",
        "Rimkus", "Zukauskas"] };

  /* ======================================================================
     pt — 7 Nationen. Portugal, Brasilien und die afrikanischen PALOP-Staaten
     teilen sich die Sprache, nicht die Namen: in Brasilien traegt man den
     Rufnamen, in Angola stehen Bantu- und portugiesische Namen nebeneinander.
     ====================================================================== */
  L.POR = { q: 3, bau: "VNN",
    v: ["Cristiano", "Bruno", "Bernardo", "Ruben", "Joao", "Rafael",
        "Diogo", "Goncalo", "Vitinha", "Nuno", "Pedro", "Nelson",
        "Antonio", "Tiago", "Ricardo", "Andre", "Miguel", "Francisco",
        "Duarte", "Afonso"],
    w: ["Kika", "Jessica", "Diana", "Carole", "Andreia", "Tatiana",
        "Ines", "Beatriz", "Matilde", "Leonor", "Carolina", "Mariana"],
    n: ["Silva", "Santos", "Ferreira", "Pereira", "Oliveira", "Costa",
        "Rodrigues", "Martins", "Sousa", "Fernandes", "Goncalves",
        "Gomes", "Lopes", "Marques", "Almeida", "Ribeiro", "Pinto",
        "Carvalho", "Teixeira", "Moreira"] };
  L.BRA = { q: 3,
    /* Brasilien: der Rufname ist der Name. Neymar, Vinicius, Rodrygo —
       daher `bau: "V"` mit vollstaendigen Rufnamen, und nur manchmal ein
       Nachname dahinter. */
    v: ["Neymar", "Vinicius", "Rodrygo", "Casemiro", "Alisson", "Ederson",
        "Marquinhos", "Raphinha", "Bruno", "Lucas", "Gabriel", "Endrick",
        "Savinho", "Militao", "Danilo", "Fabinho", "Richarlison",
        "Antony", "Andreas", "Wesley"],
    w: ["Marta", "Debinha", "Formiga", "Tamires", "Rafaelle", "Bia",
        "Kerolin", "Adriana", "Ary", "Duda", "Gabi", "Luana"],
    n: ["Silva", "Santos", "Oliveira", "Souza", "Lima", "Pereira",
        "Costa", "Rodrigues", "Almeida", "Nascimento", "Carvalho",
        "Gomes", "Martins", "Araujo", "Ribeiro", "Barbosa", "Rocha",
        "Dias", "Moreira", "Cardoso"] };
  L.ANG = { q: 2,
    gruppen: [
      { v: ["Gelson", "Fredy", "Mabululu", "Zito", "Show", "Milson",
            "Beto", "Bastos", "Jonathan", "Clinton", "Nurio", "Chico"],
        w: ["Ana", "Maria", "Joana", "Luisa", "Teresa", "Cristina"],
        n: ["Dala", "Ribeiro", "Luvumbo", "Gaspar", "Fernandes",
            "Manuel", "Domingos", "Antonio", "Carlos", "Jose"] },
      { v: ["Kialonda", "Nkanu", "Zini", "Mbala", "Kamona", "Tchamba",
            "Bunga", "Lunguinha", "Massunguna", "Kabuscorp", "Nzuzi", "Mbulu"],
        w: ["Nzinga", "Kianda", "Mbombo", "Lueji", "Ndala", "Kambundi"],
        n: ["Kialonda", "Nkanu", "Cabungula", "Mabululu", "Muanza",
            "Bunga", "Kiala", "Nzita", "Kanga", "Muteba"] },
    ] };
  L.MOZ = { q: 2,
    v: ["Reinildo", "Geny", "Witi", "Stanley", "Clesio", "Domingues",
        "Zainadine", "Mexer", "Bruno", "Edmilson", "Telinho", "Elias",
        "Isac", "Melque", "Alfeu", "Nenele"],
    w: ["Ana", "Celma", "Nelia", "Hortencia", "Ivone", "Sandra",
        "Elsa", "Maria", "Lucia", "Teresa", "Amelia", "Rosa"],
    n: ["Mandava", "Catamo", "Junior", "Ratifo", "Nhaca", "Chirindza",
        "Macuacua", "Muianga", "Sitoe", "Cuna", "Machava", "Langa",
        "Manjate", "Mabjaia", "Tembe", "Bene"] };
  L.CPV = { q: 2,
    v: ["Ryan", "Jamiro", "Garry", "Bebe", "Kenny", "Logan", "Steven",
        "Roberto", "Josimar", "Dylan", "Willy", "Nuno", "Patrick",
        "Marco", "Djaniny", "Stopira"],
    w: ["Elida", "Sandra", "Neusa", "Ivanilde", "Cristina", "Vania",
        "Jamila", "Ana", "Marisa", "Telma", "Elsa", "Djamila"],
    n: ["Mendes", "Monteiro", "Rodrigues", "Tavares", "Lopes", "Fortes",
        "Semedo", "Correia", "Fernandes", "Cabral", "Furtado", "Duarte",
        "Andrade", "Delgado", "Livramento", "Barbosa"] };
  L.GNB = { q: 1,
    v: ["Mama", "Franculino", "Jorginho", "Zinho", "Mimo", "Piqueti",
        "Frederico", "Nanu", "Opa", "Braima", "Sori", "Bura",
        "Toni", "Fali", "Alfa", "Djibril"],
    w: G.arab_w,
    n: ["Balde", "Embalo", "Djalo", "Cassama", "Mendy", "Seidi",
        "Camara", "Cande", "Indjai", "Sanha", "Turay", "Gomes",
        "Na Bangna", "Correia"] };
  L.STP = { q: 1,
    v: ["Harramiz", "Nelson", "Luis", "Buly", "Zinho", "Ramiro",
        "Wilson", "Edmilson", "Sandro", "Gedson", "Manuel", "Joao",
        "Bruno", "Marcio", "Nadir", "Tiago"],
    w: ["Maria", "Ana", "Celia", "Nilza", "Ivone", "Alda", "Deolinda",
        "Silvia", "Elsa", "Julia", "Rosa", "Carla"],
    n: ["Ambrosio", "Bandeira", "Costa", "Neto", "Pontes", "Trindade",
        "Espirito Santo", "Boa Morte", "Vera Cruz", "Aguiar",
        "do Rosario", "Menezes", "Carvalho", "Lima"] };

  /* ======================================================================
     af — 6 Nationen am Horn und in Ostafrika. Aethiopien und Eritrea kennen
     KEINE Familiennamen: der zweite Name ist der Vorname des Vaters. Deshalb
     stehen dort dieselben Namen in `v` und `n`.
     ====================================================================== */
  L.ETH = { q: 3,
    v: ["Abel", "Getaneh", "Shimelis", "Amanuel", "Ramkel", "Yared",
        "Dawa", "Mesud", "Fasil", "Surafel", "Bereket", "Tafese",
        "Kenean", "Aschalew", "Mignot", "Girma", "Tesfaye", "Haile",
        "Solomon", "Berhanu"],
    w: ["Almaz", "Tirunesh", "Genzebe", "Meseret", "Hirut", "Selam",
        "Bethlehem", "Rahel", "Meron", "Feven", "Hanna", "Eden"],
    n: ["Yohannes", "Kebede", "Girma", "Tesfaye", "Haile", "Solomon",
        "Berhanu", "Assefa", "Bekele", "Gebremariam", "Wolde",
        "Tadesse", "Mekonnen", "Alemu", "Desta", "Abebe"] };
  L.ERI = { q: 2, erbt: "ETH",
    v: ["Tesfay", "Henok", "Daniel", "Yonas", "Filmon", "Merhawi",
        "Natnael", "Amanuel", "Robel", "Meron", "Simon", "Efrem",
        "Aron", "Dawit", "Samson", "Biniam"],
    n: ["Ghebremariam", "Tesfazghi", "Berhane", "Habtemariam",
        "Weldu", "Okbay", "Ghebrehiwet", "Zeray", "Tekle",
        "Andemariam", "Kidane", "Debesay"] };
  L.KEN = { q: 3,
    v: ["Michael", "Victor", "Masoud", "Erick", "Johanna", "Ayub",
        "Richard", "Kenneth", "Duke", "Eric", "Brian", "Timothy",
        "Daniel", "Joseph", "Collins", "Abud"],
    w: ["Wanjiru", "Njeri", "Akinyi", "Wairimu", "Nyokabi", "Chebet",
        "Jepkosgei", "Auma", "Adhiambo", "Wangari", "Mueni", "Kalondu"],
    n: ["Olunga", "Wanyama", "Juma", "Omurwa", "Ochieng", "Otieno",
        "Mwangi", "Kamau", "Njoroge", "Kimani", "Wafula", "Kipruto",
        "Cheruiyot", "Odhiambo", "Onyango", "Were", "Mutua", "Kiptoo"] };
  L.TAN = { q: 2,
    v: ["Mbwana", "Simon", "Aishi", "Himid", "Feisal", "Novatus",
        "Ibrahim", "Salum", "Yassin", "Kelvin", "Iddi", "Shomari",
        "Juma", "Hassan", "Baraka", "Deus"],
    w: ["Neema", "Amina", "Zawadi", "Rehema", "Halima", "Subira",
        "Tumaini", "Furaha", "Sikitu", "Mwajuma", "Asha", "Salma"],
    n: ["Samatta", "Msuva", "Manula", "Mkumbwa", "Salum", "Miraji",
        "Kessy", "Mwinyi", "Mgunda", "Mapinduzi", "Mwakalebela",
        "Mbwana", "Chama", "Sanga", "Mrisho", "Kapombe"] };
  L.UGA = { q: 2,
    v: ["Denis", "Emmanuel", "Farouk", "Khalid", "Milton", "Allan",
        "Bevis", "Ibrahim", "Halid", "Bobosi", "Steven", "Fahad",
        "Moses", "Richard", "Isaac", "Joseph"],
    w: ["Nakato", "Babirye", "Nabukenya", "Namukasa", "Aisha", "Grace",
        "Sarah", "Fatuma", "Juliet", "Ritah", "Prossy", "Doreen"],
    n: ["Onyango", "Okwi", "Miya", "Aucho", "Kaddu", "Mugabi",
        "Byaruhanga", "Ssekiganda", "Lwanga", "Mutyaba", "Wadada",
        "Kizito", "Semakula", "Nsereko", "Katongole", "Waiswa"] };
  L.SOM = { q: 2, bau: "VMN",
    /* Somalia: drei Namen — eigener, Vater, Grossvater. */
    v: ["Abdisalam", "Mohamed", "Hassan", "Ahmed", "Yusuf", "Omar",
        "Abdullahi", "Ali", "Ibrahim", "Said", "Farah", "Hussein",
        "Abdi", "Bashir", "Guled", "Warsame"],
    w: ["Hodan", "Sagal", "Ifrah", "Deka", "Amina", "Fadumo",
        "Khadija", "Ubah", "Halima", "Ayaan", "Nimco", "Sahra"],
    m: ["Mohamed", "Ahmed", "Ali", "Hassan", "Abdi", "Omar", "Yusuf", "Farah"],
    n: ["Hassan", "Mohamud", "Warsame", "Jama", "Adan", "Ibrahim",
        "Hersi", "Aden", "Nur", "Elmi", "Dahir", "Osman"] };

  /* ======================================================================
     Die letzten Raeume: de, nl, it, gr, tr
     ====================================================================== */
  L.GER = { q: 3,
    v: ["Jamal", "Florian", "Kai", "Joshua", "Leroy", "Niclas", "Antonio",
        "Robert", "Maximilian", "Marc-Andre", "Pascal", "Deniz",
        "Waldemar", "Jonathan", "Felix", "Lukas", "Tim", "Jonas",
        "Elias", "Noah"],
    w: ["Alexandra", "Lena", "Giulia", "Klara", "Sydney", "Lea",
        "Laura", "Sara", "Marina", "Jule", "Sophia", "Merle"],
    n: ["Musiala", "Wirtz", "Havertz", "Kimmich", "Sane", "Fullkrug",
        "Rudiger", "Andrich", "Mittelstadt", "Ter Stegen", "Gross",
        "Muller", "Schmidt", "Schneider", "Fischer", "Weber", "Meyer",
        "Wagner", "Becker", "Hoffmann"] };
  L.AUT = { q: 3, erbt: "GER",
    v: ["David", "Marko", "Konrad", "Christoph", "Marcel", "Nicolas",
        "Patrick", "Michael", "Stefan", "Alexander", "Maximilian",
        "Philipp", "Andreas", "Lukas", "Sebastian", "Florian"],
    n: ["Alaba", "Arnautovic", "Laimer", "Baumgartner", "Sabitzer",
        "Gregoritsch", "Posch", "Wober", "Danso", "Seiwald", "Gruber",
        "Huber", "Bauer", "Wagner", "Pichler", "Steiner", "Moser",
        "Mayer", "Hofer", "Leitner"] };
  L.SUI = { q: 3,
    /* Die Schweiz ist viersprachig — deutsch, franzoesisch, italienisch. */
    gruppen: [
      { v: ["Yann", "Manuel", "Fabian", "Silvan", "Remo", "Michel",
            "Nico", "Simon", "Dan", "Andi", "Lukas", "Cedric"],
        w: ["Lia", "Ana", "Ramona", "Coumba", "Alisha", "Noelle"],
        n: ["Sommer", "Akanji", "Widmer", "Schar", "Freuler", "Elvedi",
            "Zuber", "Frei", "Muller", "Keller", "Meier", "Baumann"] },
      { v: ["Xherdan", "Granit", "Ardon", "Djibril", "Renato", "Breel",
            "Noah", "Ruben", "Zeki", "Edimilson", "Steven", "Filip"],
        w: ["Alayah", "Rahel", "Meriame", "Iman", "Riola", "Seraina"],
        n: ["Shaqiri", "Xhaka", "Jashari", "Sow", "Steffen", "Embolo",
            "Okafor", "Vargas", "Amdouni", "Rieder", "Fernandes", "Ndoye"] },
    ] };
  L.LIE = { q: 1, erbt: "SUI",
    n: ["Buchel", "Hasler", "Frick", "Wieser", "Salanovic", "Goppel",
        "Kaufmann", "Buchel", "Malin", "Sele", "Marxer", "Ospelt"] };
  L.LUX = { q: 2,
    v: ["Gerson", "Danel", "Leandro", "Sebastien", "Vincent", "Maxime",
        "Olivier", "Mathias", "Christopher", "Yvandro", "Dirk",
        "Aiman", "Marvin", "Florian", "Enes", "Tim"],
    w: ["Anne", "Laura", "Charlotte", "Julie", "Lena", "Mara",
        "Emma", "Sophie", "Lisa", "Marie", "Noemie", "Chiara"],
    n: ["Rodrigues", "Sinani", "Barreiro", "Thill", "Martins", "Chanot",
        "Jans", "Carlson", "Mahmutovic", "Korac", "Muratovic",
        "Schmit", "Weber", "Wagner", "Reuter", "Hoffmann"] };
  /* Die Partikel gehoert zum EINZELNEN Namen, nicht zufaellig davor: es heisst
     „de Jong" und „van Dijk", nie „van Jong". Mein erster Entwurf wuerfelte
     die Partikel getrennt aus und lieferte genau das. Jetzt stehen sie in der
     Namensliste, wo sie hingehoeren. */
  L.NED = { q: 3,
    v: ["Virgil", "Frenkie", "Memphis", "Cody", "Xavi", "Denzel",
        "Nathan", "Tijjani", "Jeremie", "Jurrien", "Wout", "Steven",
        "Daley", "Matthijs", "Lutsharel", "Quilindschy", "Joey",
        "Bart", "Sem", "Thijs"],
    w: ["Vivianne", "Lieke", "Danielle", "Jill", "Sherida", "Jackie",
        "Esmee", "Sanne", "Anouk", "Femke", "Noa", "Britt"],
    n: ["van Dijk", "de Jong", "Depay", "Gakpo", "Simons", "Dumfries",
        "Ake", "Reijnders", "Frimpong", "Timber", "Weghorst", "Bergwijn",
        "Blind", "de Ligt", "Geertruida", "Hartman", "Veerman", "Malen",
        "van der Berg", "de Vries", "Bakker", "Visser", "van den Boom",
        "de Boer"] };
  L.SUR = { q: 2, erbt: "NED",
    n: ["Klinsmann", "Kwakman", "Tjon", "Bhoendie", "Ramsundersingh",
        "Emanuelson", "Vlijter", "Kensmil", "Abdoel", "Sabajo",
        "Kandhai", "Wijnaldum", "Blinker", "Landveld"] };
  L.ARU = { q: 1, erbt: "NED",
    n: ["Croes", "Tromp", "Kelly", "Werleman", "Ruiz", "Geerman",
        "Lampe", "Wever", "Arends", "Maduro"] };
  L.CUW = { q: 2, erbt: "NED",
    n: ["Bacuna", "Martina", "Antonia", "Janga", "Kanor", "Leandro",
        "Isenia", "Statia", "Zimmerman", "Hooi", "Cijntje", "Sluis"] };
  L.ITA = { q: 3,
    v: ["Federico", "Nicolo", "Giacomo", "Gianluigi", "Alessandro",
        "Sandro", "Davide", "Mateo", "Giovanni", "Riccardo", "Matteo",
        "Lorenzo", "Andrea", "Marco", "Luca", "Francesco", "Simone",
        "Alessio", "Manuel", "Stefano"],
    w: ["Cristiana", "Barbara", "Valentina", "Sara", "Arianna", "Elena",
        "Martina", "Giulia", "Chiara", "Alice", "Sofia", "Aurora"],
    n: ["Chiesa", "Barella", "Raspadori", "Donnarumma", "Bastoni",
        "Tonali", "Frattesi", "Retegui", "Scamacca", "Calafiori",
        "Rossi", "Russo", "Ferrari", "Esposito", "Bianchi", "Romano",
        "Colombo", "Ricci", "Marino", "Greco"] };
  L.SMR = { q: 1, erbt: "ITA",
    n: ["Golinucci", "Nanni", "Berardi", "Cevoli", "Rossi", "Zafferani",
        "Battistini", "Gasperoni", "Cesarini", "Fabbri", "Ceccoli", "Zonzini"] };
  L.MLT = { q: 2,
    v: ["Teddy", "Jodi", "Matthew", "Paul", "Ferdinando", "Steve",
        "Kurt", "Joseph", "Luke", "Zach", "Juan", "Andrei",
        "Myles", "Alexander", "Jake", "Karl"],
    w: ["Maria", "Elena", "Claire", "Rachel", "Nicole", "Sarah",
        "Martina", "Julia", "Emma", "Kayleigh", "Rebecca", "Amy"],
    n: ["Teuma", "Jones", "Guillaumier", "Camenzuli", "Apap", "Borg",
        "Mbong", "Muscat", "Vella", "Farrugia", "Grech", "Zammit",
        "Micallef", "Attard", "Cassar", "Spiteri"] };
  L.GRE = { q: 3,
    v: ["Giorgos", "Kostas", "Dimitris", "Anastasios", "Petros",
        "Christos", "Vangelis", "Fotis", "Odysseas", "Manolis",
        "Panagiotis", "Nikolaos", "Ioannis", "Andreas", "Stefanos",
        "Alexandros", "Vasilis", "Thanasis", "Michalis", "Sotiris"],
    w: ["Eleni", "Maria", "Katerina", "Sofia", "Anna", "Georgia",
        "Dimitra", "Ioanna", "Christina", "Vasiliki", "Despina", "Zoi"],
    n: ["Masouras", "Tsimikas", "Giakoumakis", "Bakasetas", "Mantalos",
        "Pavlidis", "Vlachodimos", "Retsos", "Hatzidiakos", "Kourbelis",
        "Papadopoulos", "Georgiou", "Nikolaou", "Ioannou", "Konstantinou",
        "Dimitriou", "Vasileiou", "Christou", "Antoniou", "Stavrou"] };
  L.CYP = { q: 2, erbt: "GRE",
    n: ["Loizou", "Charalambous", "Christofi", "Artymatas", "Kastanos",
        "Pittas", "Ioannou", "Panagiotou", "Michael", "Andreou",
        "Kyriakou", "Sotiriou", "Laifis", "Papoulis"] };
  L.TUR = { q: 3,
    v: ["Arda", "Kenan", "Hakan", "Ferdi", "Kerem", "Baris", "Cengiz",
        "Merih", "Zeki", "Salih", "Yusuf", "Mert", "Orkun", "Irfan",
        "Emre", "Burak", "Ozan", "Caglar", "Umut", "Semih"],
    w: ["Zeynep", "Elif", "Ayse", "Fatma", "Merve", "Selin", "Ece",
        "Defne", "Azra", "Nisa", "Ela", "Yagmur"],
    n: ["Guler", "Yildiz", "Calhanoglu", "Kadioglu", "Akturkoglu",
        "Alper", "Under", "Demiral", "Celik", "Ozcan", "Kokcu",
        "Yilmaz", "Kaya", "Demir", "Sahin", "Aydin", "Ozturk",
        "Arslan", "Dogan", "Kilic"] };

  /* ==== Verweise aufloesen: `erbt` kann auf G oder auf ein Land zeigen ==== */
  const fertig = {};
  const hol = (schluessel, tiefe) => {
    if (tiefe > 6) return {};
    if (fertig[schluessel]) return fertig[schluessel];
    const roh = L[schluessel] || G[schluessel];
    if (!roh) return {};
    const basis = roh.erbt ? hol(roh.erbt, tiefe + 1) : {};
    const e = { ...basis, ...roh };
    delete e.erbt;
    fertig[schluessel] = e;
    return e;
  };
  Object.keys(L).forEach((k) => hol(k, 0));
  return fertig;
}
