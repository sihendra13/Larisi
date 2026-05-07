var personaDB = {
  Kuliner: {name:'Culinary / Cafe',    target:'Foodies & Urban Professionals', tags:['Usia 22–35','Urban','Foodie'],      age:'20–40', gender:'Mixed', conf:88, stitch:'{greeting} — Cita rasa terbaik di {loc}! Cuma {dist}km dari sini. {cta}'},
  FashionWanita: {name:'Fashion Wanita',  target:'Modern Women & Style Enthusiasts',  tags:['Usia 18–35','Trendy','Stylish'],  age:'18–35', gender:'Perempuan', conf:85, stitch:'{greeting} — Koleksi terbaru hadir di {loc}! {dist}km dari kamu. {cta}'},
  FashionPria:   {name:'Fashion Pria',    target:'Style-Conscious Men',               tags:['Usia 18–40','Stylish','Urban'],   age:'18–40', gender:'Laki-laki', conf:83, stitch:'{greeting} — Outfit keren untuk pria ada di {loc}! {dist}km dari kamu. {cta}'},
  FashionMuslim:     {name:'Fashion Muslim',          target:'Muslimah & Hijab Enthusiasts',      tags:['Usia 18–40','Muslimah','Hijab'],      age:'18–40', gender:'Perempuan', conf:87, stitch:'{greeting} — Koleksi busana muslimah terlengkap di {loc}! {dist}km dari kamu. {cta}'},
  FashionMuslimPria: {name:'Busana Muslim Pria',      target:'Muslim Men & Modest Fashion',       tags:['Usia 18–45','Pria Muslim','Koko'],    age:'18–45', gender:'Laki-laki', conf:84, stitch:'{greeting} — Koleksi koko & gamis pria terbaik di {loc}! {dist}km dari kamu. {cta}'},
  Kafe:              {name:'Kafe / Coffee Shop',       target:'Young Urban Coffee Lovers',         tags:['Usia 18–35','Ngopi','Urban'],         age:'18–35', gender:'Mixed',    conf:89, stitch:'{greeting} — Ngopi santai di {loc}? Cuma {dist}km dari kamu! {cta}'},
  Properti:{name:'Real Estate',        target:'Young Families & Investors',    tags:['Usia 28–45','Investor','Keluarga'], age:'28–50', gender:'Mixed', conf:82, stitch:'{greeting} — Hunian impian di {loc}, investasi masa depan keluarga. {cta}'},
  Beauty:  {name:'Beauty / Self-care', target:'Skincare & Makeup Lovers',      tags:['Usia 18–32','Beauty','Skincare'],   age:'17–35', gender:'Perempuan', conf:90, stitch:'{greeting} — Rahasia glowing warga {loc}! Hanya {dist}km. {cta}'},
  Bayi:    {name:'Parenting',          target:'New Parents & Young Families',  tags:['Usia 25–40','Orang tua','Keluarga'],age:'25–40', gender:'Mixed', conf:86, stitch:'{greeting} — Produk bayi terpercaya di {loc}, {dist}km dari kamu. {cta}'},
  Gadget:  {name:'Tech / Electronics', target:'Tech Enthusiasts & Professionals', tags:['Usia 18–40','Tech','Digital'],    age:'18–40', gender:'Mixed',      conf:84, stitch:'{greeting} — Setup impian tersedia di {loc}! Gas upgrade sekarang. {cta}'},
  Wisata:  {name:'Tourism',            target:'Solo Travelers & Vacationers',  tags:['Usia 22–40','Traveler','Petualang'],conf:87, stitch:'{greeting} — Destinasi terbaik {dist}km dari {loc} menunggu kamu. {cta}'},
  Pet:     {name:'Pet Supplies',       target:'Cat & Dog Owners',              tags:['Usia 20–38','Pet lover','Keluarga'],conf:83, stitch:'{greeting} — Anabul bahagia, semua tersedia di {loc}. {dist}km. {cta}'},
  Seni:     {name:'Creative / Arts',    target:'Artists & Art Lovers',          tags:['Usia 20–40','Kreator','Seni'],      conf:80,  stitch:'{greeting} — Karya lokal otentik dari seniman {loc}. {dist}km. {cta}'},
  Otomotif:   {name:'Otomotif',           target:'Car & Motorcycle Enthusiasts',  tags:['Usia 20–45','Otomotif','Kendaraan'],  age:'20–45', gender:'Mixed',    conf:83, stitch:'{greeting} — Motor & mobil impian ada di {loc}! {dist}km dari kamu. {cta}'},
  Pendidikan: {name:'Pendidikan',         target:'Students, Parents & Learners',  tags:['Usia 15–45','Pelajar','Orang tua'],   age:'15–45', gender:'Mixed',    conf:81, stitch:'{greeting} — Belajar lebih mudah bareng kami di {loc}! {dist}km dari kamu. {cta}'},
  Kerajinan:  {name:'Kerajinan / Craft',  target:'Craft Lovers & Handmade Fans',  tags:['Usia 20–45','Kreator','Handmade'],    age:'20–45', gender:'Mixed',    conf:82, stitch:'{greeting} — Kerajinan tangan otentik dari {loc}! {dist}km dari kamu. {cta}'},
  General:    {name:'General Content',    target:'Broad Local Awareness',         tags:['Semua usia','Lokal','Umum'],           conf:62,  stitch:'{greeting} — Ada yang baru di {loc}, {dist}km dari kamu! {cta}'}
};

var personaKeys = ['Kuliner','Kafe','FashionWanita','FashionPria','FashionMuslim','FashionMuslimPria','Properti','Beauty','Bayi','Gadget','Wisata','Pet','Seni','Otomotif','Pendidikan','Kerajinan'];

/* ── Filename-based persona detection ── */
var filenamePersonaMap = [
  {keys:['craft','kerajinan','handmade','anyaman','batik tulis','tenun','ukir','rajut','bordir','souvenir'], p:{name:'Kerajinan / Craft', target:'Craft Lovers & Handmade Fans', age:'Usia 20–45', gender:'Mixed'}},
  {keys:['batik','kain batik','batik tulis'],                   p:{name:'Heritage & Cultural Fashion',target:'Batik Enthusiasts & Professionals',         age:'Usia 20–45', gender:'Mixed'}},
  {keys:['gamis','hijab','muslimah','syari','kerudung','abaya','jilbab'], p:{name:'Fashion Muslim',       target:'Muslimah & Hijab Enthusiasts',  age:'Usia 18–40', gender:'Perempuan'}},
  {keys:['koko','baju koko','sarung','gamis pria','muslim pria'],        p:{name:'Busana Muslim Pria',   target:'Muslim Men & Modest Fashion',   age:'Usia 18–45', gender:'Laki-laki'}},
  {keys:['kopi','cafe','coffee','latte','espresso','cappuccino','ngopi','barista'], p:{name:'Kafe / Coffee Shop', target:'Young Urban Coffee Lovers', age:'Usia 18–35', gender:'Mixed'}},
  {keys:['baju','dress','fashion','style','pakaian'],           p:{name:'Fashion Wanita',             target:'Modern Women & Style Enthusiasts',            age:'Usia 18–35', gender:'Perempuan'}},
  {keys:['buku','novel','bacaan','kursus','les','belajar','pendidikan','sekolah','kampus','tutor'], p:{name:'Pendidikan', target:'Students, Parents & Learners', age:'Usia 15–45', gender:'Mixed'}},
  {keys:['vespa','motor','mobil','otomotif','auto','kendaraan','sparepart','bengkel','modif'], p:{name:'Otomotif', target:'Car & Motorcycle Enthusiasts', age:'Usia 20–45', gender:'Mixed'}},
  {keys:['makanan','burger','cafe','food','kuliner'],           p:{name:'Culinary/Cafe',              target:'Foodies & Urban Professionals',              age:'Usia 22–40', gender:'Mixed'}},
  {keys:['properti','rumah','griya'],                           p:{name:'Real Estate',                target:'Young Families & Investors',                 age:'Usia 28–50', gender:'Mixed'}},
  {keys:['skincare','kosmetik','beauty'],                       p:{name:'Beauty/Self-care',           target:'Skincare & Makeup Lovers',                   age:'Usia 17–35', gender:'Perempuan'}},
  {keys:['anak','bayi','baby'],                                 p:{name:'Parenting',                  target:'New Parents & Young Families',               age:'Usia 25–40', gender:'Mixed'}},
  {keys:['gadget','hp','laptop','elektronik','tech'],           p:{name:'Tech/Electronics',           target:'Tech Enthusiasts & Professionals',            age:'Usia 18–40', gender:'Mixed'}},
  {keys:['wisata','travel','hotel','tourism'],                  p:{name:'Tourism',                    target:'Solo Travelers & Vacationers',               age:'Usia 22–40', gender:'Mixed'}},
  {keys:['kucing','anjing','pet'],                              p:{name:'Pet Supplies',               target:'Cat & Dog Owners',                           age:'Usia 20–40', gender:'Mixed'}},
  {keys:['home','dekor','interior'],                            p:{name:'Interior Design',            target:'Minimalist Living',                          age:'Usia 25–45', gender:'Mixed'}},
  {keys:['luxury','branded','tas'],                             p:{name:'High-end Goods',             target:'Luxury Lifestyle',                           age:'Usia 25–50', gender:'Mixed'}},
  {keys:['cincin','jewelry','wedding'],                         p:{name:'Wedding/Jewelry',            target:'Engaged Couples',                            age:'Usia 22–35', gender:'Mixed'}},
  {keys:['sepatu','olahraga','sports'],                         p:{name:'Sports Apparel',             target:'Runners & Athletes',                         age:'Usia 18–40', gender:'Mixed'}},
  {keys:['bank','saham','investasi'],                           p:{name:'Banking/Finance',            target:'Financial Literacy & Investors',             age:'Usia 22–45', gender:'Mixed'}},
  {keys:['konser','musik','event'],                             p:{name:'Music/Events',               target:'Concert Goers',                              age:'Usia 18–35', gender:'Mixed'}},
  {keys:['lukisan','seni','art'],                               p:{name:'Creative/Arts',              target:'Artists & Art Lovers',                       age:'Usia 20–40', gender:'Mixed'}},
  {keys:['hijau','eco','sustainable'],                          p:{name:'Sustainability',             target:'Go Green Advocates',                         age:'Usia 20–40', gender:'Mixed'}},
];

function detectPersona(filename) {
  var lower = filename.toLowerCase();
  for (var i = 0; i < filenamePersonaMap.length; i++) {
    var entry = filenamePersonaMap[i];
    for (var j = 0; j < entry.keys.length; j++) {
      if (lower.indexOf(entry.keys[j]) !== -1) return entry.p;
    }
  }
  return {name:'General Content', target:'Optimized for Broad Local Awareness', age:'Usia 18–55', gender:'Mixed'};
}
