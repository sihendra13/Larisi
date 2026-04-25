/*
 * Caption Templates — 3 alternatif per persona × per platform
 * Tone & style disesuaikan dengan kultur konten masing-masing platform
 * Variabel: {loc} = nama lokasi, {dist} = radius km
 */
var CAPTION_TEMPLATES = {
  "ig-story": {
    "Kuliner": [
      "{greeting} 👋\n\nAda tempat makan baru yang lagi ramai dibicarakan warga {loc}!\n\nSetiap menu dibuat dari bahan segar pilihan — aroma dari dapurnya aja udah bikin lapar dari parkiran. Konsisten enak setiap hari, bukan cuma pas buka doang. Cuma {dist}km dari sini.\n\n{cta}\n\n#KulinerLokal #MakanEnak #{loc}",
      "{greeting} 🍽\n\nSoal rasa, kami tidak kompromi.\n\nBahan segar dari supplier terpilih, resep yang tidak berubah sejak hari pertama buka, dan porsi yang bikin kenyang tanpa harus merogoh kocek terlalu dalam. Terbukti dari pelanggan setia yang balik lagi setiap minggu.\n\nHanya {dist}km dari {loc}.\n\n{cta}\n\n#KulinerJujur #MakanEnak #FoodLokal",
      "{greeting} ⚡\n\nHari ini stok menu spesial kami TERBATAS!\n\nKemarin habis dalam 2 jam. Hari ini stok lebih sedikit — dan antrian sudah mulai. Kami ada di {loc}, hanya {dist}km dari kamu.\n\nJangan sampai kehabisan.\n\n{cta}\n\n#PromoHariIni #KulinerLokal #TerbatasStok"
    ],
    "Kuliner/Cafe": [
      "{greeting} ☕\n\nCafe baru di {loc} yang benar-benar worth it untuk dikunjungi!\n\nKopi specialty diseduh manual, makanan yang tidak asal jadi, suasana yang bikin betah berlama-lama — cocok untuk WFH, meeting, atau sekadar me-time. Hanya {dist}km dari kamu.\n\n{cta}\n\n#CafeLokal #KopiVibes #{loc}",
      "{greeting} ✨\n\nBukan sekadar tempat minum kopi.\n\nSetiap cangkir diseduh dari biji single origin pilihan dengan grind size dan suhu air yang dikontrol ketat. Hasilnya: kopi yang balance, tidak pahit, dan aftertaste-nya bersih. Untuk kamu yang serius soal kopi.\n\nDi {loc}, hanya {dist}km.\n\n{cta}\n\n#SpecialtyCoffee #KopiSerius #CafeLokal",
      "{greeting} 🎉\n\nPromo hari ini: beli minuman apa saja, gratis slice cake pilihan!\n\nBerlaku hanya hari ini di {loc}. Stok cake terbatas, sudah 40+ transaksi dari pagi tadi. Hanya {dist}km dari kamu.\n\n{cta}\n\n#FlashDeal #CafePromo #PromoHariIni"
    ],
    "FashionPria": [
      "{greeting} 👔\n\nTampil percaya diri itu dimulai dari pilihan yang tepat.\n\nKoleksi pria terbaru di {loc} — casual, formal, dan smart casual semua ada. Bahan premium, potongan yang flattering. Bukan sekadar pakaian — ini identitas.\n\n{cta}\n\n#FashionPria #MenStyle #{loc}",
      "{greeting} 💼\n\nStyle pria yang baik tidak berteriak — tapi selalu diperhatikan.\n\nKoleksi kami di {loc} dirancang untuk pria urban yang mengerti kualitas. Pilihan warna yang timeless, bahan yang breathable, jahitan yang presisi. Hanya {dist}km.\n\n{cta}\n\n#MenFashion #StylePria #KoleksiLokal",
      "{greeting} ⚡\n\nNew arrival pria — stok terbatas!\n\nVarian terlaris kemarin sold out dalam 2 jam. Restock hari ini di {loc}, {dist}km dari kamu. Jangan sampai kehabisan lagi.\n\n{cta}\n\n#MenNewArrival #FashionAlert #StylePria"
    ],
    "Fashion": [
      "{greeting} 🌸\n\nKoleksi baru sudah hadir di {loc} — dan penampilanmu langsung naik level!\n\nDesain yang tidak ketinggalan zaman, ukuran yang inklusif, dan kualitas bahan yang bikin nyaman dipakai seharian. Bukan fast fashion — ini investasi penampilan yang sesungguhnya.\n\n{cta}\n\n#FashionLokal #OOTD #{loc}",
      "{greeting} 💜\n\nSetiap jahitan dikerjakan dengan standar yang ketat.\n\nBahan kami lolos uji kenyamanan — tidak gerah, tidak luntur setelah puluhan kali cuci. Koleksi terbaru sudah tersedia di {loc}, hanya {dist}km dari kamu. Temukan gaya terbaik versimu.\n\n{cta}\n\n#FashionBerkualitas #MadeToLast #StyleLokal",
      "{greeting} 🛍\n\nPeringatan: koleksi limited edition ini hampir habis!\n\nTiga varian sold out dalam 90 menit kemarin. Hari ini restock terakhir di {loc}, hanya {dist}km. Jangan sampai menyesal karena terlambat.\n\n{cta}\n\n#NewArrival #LimitedStock #FashionAlert"
    ],
    "FashionMuslim": [
      "{greeting} 🧕\n\nKoleksi busana muslim terbaru sudah hadir di {loc} — dan tampilanmu langsung makin anggun!\n\nDesain mengikuti tren terkini namun tetap syar'i, bahan yang adem dan nyaman dipakai seharian. Dari gamis casual hingga formal, semua lengkap. Hanya {dist}km dari kamu.\n\n{cta}\n\n#FashionMuslim #BusanaMuslim #{loc}",
      "{greeting} 💜\n\nTampil muslimah itu tidak harus kaku — bisa tetap stylish dan percaya diri!\n\nKoleksi kami di {loc} dirancang khusus untuk perempuan berhijab yang ingin tampil modern tanpa meninggalkan nilai kesopanan. Bahan berkualitas, jahitan rapi, ukuran lengkap. Hanya {dist}km.\n\n{cta}\n\n#HijabFashion #MuslimahModern #FashionLokal",
      "{greeting} ⏰\n\nKoleksi busana muslim edisi terbatas hampir habis di {loc}!\n\n3 varian sudah sold out kemarin. Hanya {dist}km dari kamu — jangan sampai menyesal karena terlambat.\n\n{cta}\n\n#BusanaMuslimLimited #FashionHijab #StokTerbatas"
    ],
    "Real Estate": [
      "{greeting} 🏡\n\nSudah lama ingin punya hunian sendiri di {loc}?\n\nRumah bukan sekadar bangunan — ini tentang keamanan keluarga, masa depan anak, dan investasi yang nilainya terus tumbuh. Kami hadir untuk bantu kamu mewujudkannya, dari konsultasi hingga serah terima kunci.\n\n{cta}\n\n#RumahImpian #PropertiLokal #InvestasiKeluarga",
      "{greeting} 📍\n\nLokasi prime di {loc} — {dist}km dari pusat kota.\n\nSertifikat HM, IMB lengkap, konstruksi menggunakan standar SNI. Akses tol, sekolah favorit, dan fasilitas publik semuanya dalam jangkauan. Ini bukan sekadar janji — ini spesifikasi yang bisa kamu verifikasi sendiri.\n\n{cta}\n\n#PropertiTerpercaya #RumahSNI #InvestasiAman",
      "{greeting} ⚠\n\nUnit tersisa tinggal 3 dengan harga pre-launch!\n\nBegitu terjual, harga naik signifikan. Jangan tunda keputusan yang bisa mengubah masa depan keluargamu. Survei gratis tersedia hari ini di {loc}.\n\n{cta}\n\n#UnitTerbatas #PropertiLokal #JanganTerlambat"
    ],
    "Beauty/Self-care": [
      "{greeting} 🌸\n\nRahasia kulit glowing warga {loc} akhirnya terbongkar!\n\nBukan filter, bukan editan — ini hasil nyata dari rangkaian perawatan yang tepat. Ribuan pelanggan sudah merasakan perubahan dalam 2 minggu pertama. Kini giliranmu. Hanya {dist}km dari sini.\n\n{cta}\n\n#BeautyLokal #GlowUpAsli #SkincareJujur",
      "{greeting} ✨\n\nTransparan soal kandungan, jujur soal hasil.\n\nFormula kami mengandung Niacinamide 10%, Tranexamic Acid, dan ekstrak herbal lokal. Telah diuji dermatologi, bebas paraben, fragrance-free — cocok untuk kulit sensitif dan berminyak. Di {loc}, hanya {dist}km.\n\n{cta}\n\n#SkincareTransparan #FormulaTeruji #BeautyLokal",
      "{greeting} 💥\n\nFlash sale skincare HARI INI SAJA!\n\nHemat hingga 40% untuk paket pilihan di {loc}. Stok promo hanya 15 set — kemarin habis dalam 4 jam. Masih mau scroll dulu?\n\n{cta}\n\n#PromoSkincare #FlashSale #GlowUpSekarang"
    ],
    "Tourism": [
      "{greeting} 🗺\n\nAda destinasi tersembunyi yang cuma {dist}km dari {loc}!\n\nBelum banyak yang tau, tapi yang sudah ke sana selalu ingin kembali. Spot yang indah, fasilitas yang memadai, dan pengalaman lokal yang autentik menunggu kamu di sana.\n\n{cta}\n\n#WisataLokal #HiddenGem #ExploreIndonesia",
      "{greeting} 🌟\n\nRating 4.8/5 dari 500+ ulasan nyata.\n\nBukan sekadar bagus di foto — pengalaman sesungguhnya bahkan lebih berkesan. Pemandu bersertifikat, fasilitas lengkap, dan momen tak terlupakan yang menanti di sekitar {loc}, hanya {dist}km.\n\n{cta}\n\n#WisataFasilitas #TravelJujur #DestinasiLokal",
      "{greeting} 🎯\n\nPromo paket wisata weekend ini — diskon 35%!\n\nBooking hari ini untuk perjalanan ke destinasi terbaik di area {loc}. Slot sangat terbatas, promo berakhir malam ini. Hanya {dist}km dari kamu.\n\n{cta}\n\n#PromoWisata #WeekendTrip #BookingSekarang"
    ],
    "Retro Automotive": [
      "{greeting} 🏍\n\nKomunitas otomotif klasik terbaik di {loc} — bukan kaleng-kaleng!\n\nMekanik berpengalaman, spare part original dari importir resmi, dan brotherhood yang solid. Tempat yang tepat untuk motor klasik kesayanganmu. Hanya {dist}km dari sini.\n\n{cta}\n\n#OtomotifKlasik #MotorKlasik #KomunitasRider",
      "{greeting} 🔧\n\nStandar bengkel kami tidak main-main.\n\nTeknisi bersertifikat, spare part original, garansi pengerjaan 30 hari. Setiap kendaraan keluar dari bengkel kami dalam kondisi prima — bukan asal jalan. Di {loc}, hanya {dist}km.\n\n{cta}\n\n#BengkelProfesional #SparePartOriginal #GaransiServis",
      "{greeting} ⚡\n\nWeekend ini: servis gratis ongkos jasa!\n\nBawa motor klasikmu ke bengkel kami di {loc} — gratis ongkos jasa untuk servis ringan. Berlaku Sabtu-Minggu, kuota terbatas 10 motor. Hanya {dist}km.\n\n{cta}\n\n#PromoServis #BengkelLokal #WeekendDeal"
    ],
    "Parenting": [
      "{greeting} 👶\n\nSemua yang terbaik untuk si kecil tersedia di {loc}!\n\nPilihan produk bayi yang sudah dikurasi ketat — aman, teruji, dan terpercaya. Karena setiap tahap tumbuh kembang anak itu berharga dan tidak boleh ada yang terlewat. Hanya {dist}km dari kamu.\n\n{cta}\n\n#ProdukBayi #ParentingLokal #SiKecilAman",
      "{greeting} 🌟\n\nKeamanan si kecil bukan untuk dikompromikan.\n\nSemua produk bayi kami telah melewati sertifikasi SNI dan uji keamanan klinis. Bebas BPA, bebas formalin, bebas pewarna berbahaya. Konsultasi gratis tersedia setiap hari di {loc}.\n\n{cta}\n\n#BabyProduct #SNISafe #ParentingJujur",
      "{greeting} 🎁\n\nPromo bundling newborn — hemat 30%, stok terbatas!\n\nPaket lengkap perlengkapan bayi baru lahir di {loc}, hanya {dist}km dari kamu. Tersisa 20 paket hari ini. Untuk para orang tua baru yang tidak ingin ketinggalan.\n\n{cta}\n\n#BundlingBayi #PromoNewborn #OrderSekarang"
    ],
    "Tech/Electronics": [
      "{greeting} 💻\n\nMasih pakai perangkat yang lemot? Waktunya upgrade!\n\nSetup impian bukan soal mahal — tapi soal tahu tempat yang tepat. Gadget terlengkap dengan garansi resmi, di {loc}, hanya {dist}km dari kamu. Tim kami siap bantu pilihkan yang paling sesuai kebutuhanmu.\n\n{cta}\n\n#GadgetLokal #SetupImpian #TechUpgrade",
      "{greeting} ⚡\n\nGaransi resmi distributor, bukan sekadar klaim.\n\nSemua unit di toko kami bergaransi minimum 1 tahun dari distributor resmi. Konsultasi spesifikasi gratis sebelum beli — supaya kamu tidak salah pilih dan tidak menyesal. Di {loc}, {dist}km dari kamu.\n\n{cta}\n\n#GadgetGaransi #TechJujur #KonsultasiGratis",
      "{greeting} 🔥\n\nFlash sale gadget — hari ini saja!\n\nDiskon besar untuk smartphone dan laptop pilihan di {loc}. Stok sangat terbatas — 50+ unit sudah terjual dari pagi tadi. Hanya {dist}km dari kamu.\n\n{cta}\n\n#FlashSaleGadget #TechDeal #GasSekarang"
    ],
    "Pet Supplies": [
      "{greeting} 🐾\n\nAnabul kesayanganmu layak mendapatkan yang terbaik!\n\nLengkap dari pakan premium, aksesoris, hingga layanan grooming profesional — semua tersedia di {loc}. Karena anabul bahagia berarti kamu juga bahagia. Hanya {dist}km dari sini.\n\n{cta}\n\n#PetLovers #AnabulBahagia #PetShopLokal",
      "{greeting} 🐱\n\nSoal kualitas produk anabul, kami tidak asal pilih.\n\nPakan berstandar nutrisi AAFCO, produk grooming yang dermatologically tested untuk hewan, dan dokter hewan tersedia setiap hari tanpa perlu appointment. Di {loc}, hanya {dist}km.\n\n{cta}\n\n#PetHealth #PakanBerkualitas #DokterHewan",
      "{greeting} 🐶\n\nPromo grooming profesional minggu ini — slot terbatas!\n\nHanya 15 slot per hari di {loc}. Sudah 10 terisi hari ini. Book segera sebelum jadwal penuh. Hanya {dist}km dari kamu.\n\n{cta}\n\n#PromoGrooming #AnabulHappy #BookSekarang"
    ],
    "Creative/Arts": [
      "{greeting} 🎨\n\nSeni lokal {loc} yang sesungguhnya — bukan sekadar hiasan!\n\nKarya dari seniman asli daerah, dibuat dengan tangan, penuh makna dan cerita. Setiap karya dilengkapi sertifikat keaslian. Kualitas museum dengan harga yang terjangkau. Hanya {dist}km.\n\n{cta}\n\n#SeniLokal #KaryaAsli #SupportSenimanLokal",
      "{greeting} 🖌\n\nKurasi ketat untuk kualitas yang tidak mengecewakan.\n\nGaleri kami di {loc} hanya menampilkan karya yang lolos seleksi ketat — dilengkapi dokumentasi proses dan sertifikat keaslian. Investasi seni yang nilainya bertumbuh. Hanya {dist}km.\n\n{cta}\n\n#SeniKurator #KaryaBersertifikat #ArtIndonesia",
      "{greeting} ✨\n\nPameran eksklusif — akhir pekan ini saja!\n\nKarya terbaru seniman lokal {loc} dengan harga perdana sebelum masuk galeri resmi. Koleksi terbatas, {dist}km dari kamu. Jangan sampai menyesal karena tidak datang.\n\n{cta}\n\n#PameranLokal #KoleksiTerbatas #ArtWeekend"
    ],
    "Heritage & Cultural Fashion": [
      "{greeting} 🧵\n\nBatik bukan sekadar kain — ini identitas bangsa!\n\nKoleksi batik tulis dari pengrajin lokal {loc}, dibuat dengan pewarna alami dan motif yang bermakna. Setiap helai kain menyimpan cerita warisan budaya yang harus terus hidup. Hanya {dist}km.\n\n{cta}\n\n#BatikLokal #WarisanBudaya #BanggaBuatanIndonesia",
      "{greeting} 🇮🇩\n\nBatik tulis butuh waktu 2 hingga 6 minggu untuk satu lembar — dan itu bukan kelemahan, itu keistimewaan.\n\nBahan kain primissima berkualitas tinggi, pewarna alami ramah lingkungan. Bukan batik printing — ini warisan yang hidup dan bisa kamu kenakan. Di {loc}, {dist}km.\n\n{cta}\n\n#BatikTulis #PewarnaAlami #WarisanHidup",
      "{greeting} ⏰\n\nKoleksi edisi terbatas — hampir habis!\n\nHanya 50 lembar diproduksi, dan 30 sudah terjual. Motif eksklusif dari pengrajin {loc} ini tidak akan dibuat ulang. Hanya {dist}km dari kamu. Pesan sekarang.\n\n{cta}\n\n#BatikLimited #EdisiTerbatas #PesanSekarang"
    ],
    "Interior Design": [
      "{greeting} 🏡\n\nRumahmu terasa kurang sesuatu? Kami punya solusinya!\n\nLayanan desain interior sat-set — konsultasi, desain, eksekusi, terima beres. Tidak perlu pusing urusan teknis atau bolak-balik toko material. Kami yang handle semuanya. Di {loc}, hanya {dist}km.\n\n{cta}\n\n#InteriorLokal #DesainRumah #SatSetTerimaJadi",
      "{greeting} 🛋\n\nLihat hasilnya dulu, baru tukang mulai kerja.\n\nKami menyediakan visualisasi 3D sebelum eksekusi — tidak ada kejutan, tidak ada miskomunikasi. Tim kami berpengalaman 8+ tahun dengan 200+ proyek selesai. Di {loc}, hanya {dist}km.\n\n{cta}\n\n#DesainerInterior #Visualisasi3D #InteriorProfesional",
      "{greeting} 🎁\n\nKonsultasi gratis senilai Rp 500.000 — minggu ini saja!\n\nHanya untuk 10 klien pertama di {loc}. Sudah 6 slot terisi. Daftar sekarang sebelum habis. Hanya {dist}km dari kamu.\n\n{cta}\n\n#KonsultasiGratis #InteriorDeal #BookSekarang"
    ],
    "Sports Apparel": [
      "{greeting} 💪\n\nGear olahraga yang tepat nyata bedanya untuk performa!\n\nBukan sekadar kelihatan sporty — produk kami menggunakan teknologi moisture-wicking, anti-odor, dan ergonomic cut yang direkomendasikan trainer dan atlet lokal. Di {loc}, hanya {dist}km.\n\n{cta}\n\n#GearSport #OlahragaLokal #PerformaOptimal",
      "{greeting} 🏃\n\nInvestasi terbaik untuk kesehatanmu dimulai dari gear yang benar.\n\nLengkap dari sepatu lari, pakaian gym, hingga aksesoris outdoor — semua dari brand terpercaya dengan garansi resmi. Konsultasi produk gratis tersedia di {loc}, hanya {dist}km.\n\n{cta}\n\n#SportsTech #GearPerforma #OlahragaSerius",
      "{greeting} ⚡\n\nFlash sale sports gear — weekend ini saja!\n\nDiskon besar untuk koleksi lari dan gym di {loc}. Stok terbatas untuk ukuran populer — sudah banyak yang diambil dari tadi pagi. Hanya {dist}km.\n\n{cta}\n\n#FlashSaleSports #GearMurah #GasSekarang"
    ],
    "General": [
      "{greeting} 👋\n\nAda yang baru dan menarik di {loc} — dan kamu yang pertama tau!\n\nKami hadir khusus untuk komunitas lokal di sini, bukan korporat besar dari jauh. Tetangga sendiri yang usaha, yang benar-benar paham kebutuhanmu. Hanya {dist}km dari sini.\n\n{cta}\n\n#UsahaLokal #UMKMLokal #BanggaBuatanIndonesia",
      "{greeting} 💪\n\nKonsisten dan terpercaya sejak hari pertama buka.\n\nKualitas yang tidak pernah kami kompromikan, pelayanan yang jujur, dan harga yang bersahabat. Sudah dipercaya warga {loc} selama ini. Tidak ada janji lebay — hanya hasil yang bisa kamu rasakan sendiri.\n\n{cta}\n\n#LokalTerpercaya #KualitasKonsisten #UMKMHebat",
      "{greeting} 🔔\n\nPenawaran khusus untuk pelanggan baru hari ini!\n\nPromo spesial di {loc}, hanya untuk {dist}km pertama. Stok sangat terbatas — sudah ratusan yang memanfaatkan sejak pagi. Jangan sampai ketinggalan.\n\n{cta}\n\n#PromoLokal #PenawaranKhusus #TerbatasHariIni"
    ]
  },
  "tiktok": {
    "Kuliner": [
      "POV: Kamu baru nemu tempat makan di {loc} yang aromanya bikin lapar sebelum masuk pintu 😭🍽\n\n{greeting}! Bahan fresh, resep original, dan harganya masuk akal. Rating dari pelanggan nyata, bukan buzzer.\n\nHanya {dist}km dari sini. {cta}",
      "Kalau masih cari-cari tempat makan yang konsisten enak di {loc}, ini jawabannya. ✅\n\n{greeting}! Bahan segar setiap hari, bumbu asli, tidak ada penyedap berlebih. Cek sendiri — {dist}km dari kamu.\n\n{cta}",
      "Menu spesial hari ini TERBATAS — kemarin habis 2 jam 😱\n\n{greeting}! Stok hari ini lebih sedikit lagi. Kami di {loc}, hanya {dist}km. Mau nunggu habis dulu?\n\n{cta}"
    ],
    "Kuliner/Cafe": [
      "POV: Nemu cafe di {loc} yang WiFi-nya kenceng, kopinya enak, dan selalu ada kursi 😍☕\n\n{greeting}! Literally jadi basecamp WFH terbaik. Hanya {dist}km dari kamu.\n\n{cta}",
      "Specialty coffee itu beda dari kopi biasa — dan ini buktinya. ✨\n\n{greeting}! Di cafe kami, setiap cangkir diseduh manual dari biji single origin. Rasa tidak bisa bohong. Di {loc}, {dist}km.\n\n{cta}",
      "Promo hari ini: beli kopi dapat cake gratis! 🎂☕\n\n{greeting}! Hanya di {loc}, berlaku sampai stok habis. Sudah 30+ transaksi dari pagi tadi.\n\n{cta}"
    ],
    "FashionPria": [
      "Outfit pria yang always on point ada di sini! 👔\n\n{greeting}! Koleksi baru landing di {loc} — dari casual santai sampai formal kece. Stok terbatas.\n\n{cta}",
      "Pria stylish tahu beda bahan bagus vs biasa 💼\n\n{greeting}! Koleksi premium kami di {loc} — breathable, awet, dan potongannya flattering. {dist}km.\n\n{cta}",
      "NEW ARRIVAL PRIA — sold out kemarin balik lagi! ⚡\n\n{greeting}! Restock terakhir di {loc}, {dist}km. Gas sebelum kehabisan lagi!\n\n{cta}"
    ],
    "Fashion": [
      "Koleksi baru di {loc} yang langsung sold out kemarin ✨\n\n{greeting}! Tag teman yang butuh fashion upgrade serius!\n\n{cta}",
      "Bahan premium, jahitan rapi, ukuran inklusif 💜\n\n{greeting}! Ini bukan fast fashion — tahan puluhan kali cuci. Di {loc}, {dist}km dari kamu.\n\n{cta}",
      "NEW ARRIVAL ALERT — koleksi limited landing di {loc} 🛍\n\n{greeting}! 3 varian sold out dalam 90 menit kemarin. Restock hari ini — terakhir!\n\n{cta}"
    ],
    "FashionMuslim": [
      "Koleksi busana muslim baru di {loc} yang langsung sold out kemarin 🧕✨\n\n{greeting}! Desain syar'i tapi tetap modern dan stylish. Tag sahabat muslimahmu!\n\n{cta}",
      "Tampil anggun seharian tanpa ribet — ini rahasianya 💜\n\n{greeting}! Bahan adem, jahitan rapi, model terkini. Koleksi muslimah di {loc}, {dist}km dari kamu.\n\n{cta}",
      "KOLEKSI MUSLIM LIMITED EDITION — hampir habis! ⏰\n\n{greeting}! 3 varian sold out kemarin di {loc}. Restock terakhir — gas sebelum kehabisan!\n\n{cta}"
    ],
    "Real Estate": [
      "POV: Akhirnya punya rumah sendiri di {loc} setelah bertahun-tahun ngontrak 🏡\n\n{greeting}! Prosesnya dibantu dari awal sampai kunci di tangan.\n\n{cta}",
      "Lokasi {loc}, {dist}km dari pusat kota. Sertifikat HM, konstruksi SNI 📍\n\n{greeting}! Ini spesifikasi yang bisa kamu verifikasi sendiri — bukan janji kosong.\n\n{cta}",
      "Unit tersisa TINGGAL 3 — harga pre-launch ⚠\n\n{greeting}! Harga naik begitu terjual. Survei gratis hari ini — jangan tunda!\n\n{cta}"
    ],
    "Beauty/Self-care": [
      "POV: 2 minggu pakai skincare dari {loc} dan semua orang bertanya rahasianya 😭✨\n\n{greeting}! Bukan filter — ini hasil nyata.\n\n{cta}",
      "Ingredient list yang jujur, hasil yang transparan 🌸\n\n{greeting}! Niacinamide 10%, bebas paraben, dermatologi tested. Di {loc}, {dist}km.\n\n{cta}",
      "Flash sale skincare HARI INI — diskon 40%! 💥\n\n{greeting}! Stok 15 set tinggal. Kemarin habis dalam 4 jam.\n\n{cta}"
    ],
    "Tourism": [
      "Hidden gem {dist}km dari {loc} yang belum banyak yang tau 🗺\n\n{greeting}! Sudah ke sana 3x, tiap kali selalu ada yang baru.\n\n{cta}",
      "Rating 4.8/5 dari 500+ ulasan nyata — bukan bot 🌟\n\n{greeting}! Pengalaman nyatanya lebih keren dari kontennya. Destinasi area {loc}.\n\n{cta}",
      "Promo paket wisata weekend — diskon 35%! ✈\n\n{greeting}! Booking hari ini untuk trip area {loc}. Slot sangat terbatas.\n\n{cta}"
    ],
    "Retro Automotive": [
      "POV: Bawa motor klasik ke bengkel spesialis di {loc} vs bengkel biasa 🏍\n\n{greeting}! Beda banget hasilnya — ini standar yang kamu deserves.\n\n{cta}",
      "Spare part original, teknisi bersertifikat, garansi 30 hari 🔧\n\n{greeting}! Bengkel klasik kami di {loc}, {dist}km. Standar yang benar.\n\n{cta}",
      "SERVIS GRATIS weekend ini — ongkos jasa ditanggung! ⚡\n\n{greeting}! Kuota hanya 10 motor. Sudah 7 terisi.\n\n{cta}"
    ],
    "Parenting": [
      "POV: Jadi orang tua baru dan nemu toko bayi terlengkap {dist}km dari rumah 👶\n\n{greeting}! Semua ada, semua aman, semua tersertifikasi.\n\n{cta}",
      "SNI certified, bebas BPA dan bahan berbahaya 🌟\n\n{greeting}! Toko bayi kami di {loc} — tidak ada kompromi soal keamanan si kecil.\n\n{cta}",
      "Bundling newborn spesial — hemat 30%! Stok terbatas 🎁\n\n{greeting}! Hanya 20 paket tersisa di {loc}.\n\n{cta}"
    ],
    "Tech/Electronics": [
      "POV: Nemu toko gadget di {loc} yang harganya wajar dan garansi resmi beneran 💻\n\n{greeting}! Worth it banget. Ini yang paling direkomendasikan.\n\n{cta}",
      "Garansi resmi distributor, konsultasi spesifikasi gratis ⚡\n\n{greeting}! Semua baru, tidak ada rekondisi. Di {loc}, {dist}km.\n\n{cta}",
      "Flash sale gadget HARI INI 🔥\n\n{greeting}! 50+ unit sudah terjual dari pagi. Stok flash sale terbatas.\n\n{cta}"
    ],
    "Pet Supplies": [
      "POV: Anabul kamu suka banget produk dari {loc} dan kamu nggak mau ganti 🐾\n\n{greeting}! Pakan premium beda kelas — terbukti.\n\n{cta}",
      "Nutrisi standar AAFCO, grooming produk dermatologically tested 🐱\n\n{greeting}! Toko pet kami di {loc}, {dist}km. Dokter hewan setiap hari.\n\n{cta}",
      "Promo grooming MINGGU INI — slot terbatas! 🐶\n\n{greeting}! Hanya 15 slot per hari. Sudah 10 terisi.\n\n{cta}"
    ],
    "Creative/Arts": [
      "POV: Nemu karya seni lokal {loc} yang kualitasnya setara galeri internasional 🎨\n\n{greeting}! Support seniman asli daerah kita yuk!\n\n{cta}",
      "Sertifikat keaslian, dokumentasi proses pembuatan 🖌\n\n{greeting}! Galeri kami di {loc} hanya tampilkan karya yang lolos kurasi.\n\n{cta}",
      "Pameran terbatas AKHIR PEKAN INI saja ✨\n\n{greeting}! Harga perdana sebelum masuk galeri resmi. {dist}km dari kamu.\n\n{cta}"
    ],
    "Heritage & Cultural Fashion": [
      "Batik tulis asli dari {loc} — bukan printing, bukan cap 🧵\n\n{greeting}! Ini warisan budaya yang masih hidup. Lihat prosesnya langsung.\n\n{cta}",
      "Pewarna alami, kain primissima, 2–6 minggu pengerjaan per lembar 🇮🇩\n\n{greeting}! Batik kami di {loc} bukan fast fashion budaya — nilai investasinya terus naik.\n\n{cta}",
      "Koleksi edisi terbatas — 30 dari 50 lembar sudah terjual! ⏰\n\n{greeting}! Motif eksklusif {loc}, tidak akan diproduksi ulang.\n\n{cta}"
    ],
    "Interior Design": [
      "POV: Rumah di {loc} yang biasa aja jadi dream home setelah disentuh tim interior kami 🏡\n\n{greeting}! Sat-set, terima beres — tidak perlu pusing teknis.\n\n{cta}",
      "Lihat hasil 3D dulu sebelum tukang mulai kerja 🛋\n\n{greeting}! Tim kami di {loc}, 8+ tahun pengalaman, 200+ proyek selesai.\n\n{cta}",
      "Konsultasi gratis MINGGU INI — nilai Rp 500rb! ✨\n\n{greeting}! Hanya 10 slot tersisa. Sudah 6 terisi.\n\n{cta}"
    ],
    "Sports Apparel": [
      "POV: Ganti gear olahraga ke yang benar-benar berkualitas dan langsung ngaruh ke performa 💪\n\n{greeting}! Toko sports kami di {loc}, {dist}km dari kamu.\n\n{cta}",
      "Moisture-wicking, anti-odor, ergonomic cut — standar gear kami 🏃\n\n{greeting}! Direkomendasikan trainer dan atlet lokal {loc}.\n\n{cta}",
      "Flash sale sports gear WEEKEND INI ⚡\n\n{greeting}! Diskon besar di {loc}. Ukuran populer cepat habis.\n\n{cta}"
    ],
    "General": [
      "POV: Nemu usaha lokal {loc} yang kualitasnya jauh di atas ekspektasi 💎\n\n{greeting}! Hanya {dist}km dari kamu.\n\n{cta}",
      "Dipercaya warga {loc} sejak hari pertama buka 💪\n\n{greeting}! Kualitas konsisten, pelayanan jujur, harga bersahabat.\n\n{cta}",
      "Promo khusus hari ini — hanya untuk kamu! 🔔\n\n{greeting}! Radius {dist}km dari kami. Stok terbatas.\n\n{cta}"
    ]
  },
  "youtube": {
    "Kuliner": [
      "Kalau kamu warga {loc} dan belum pernah coba tempat makan ini, kamu beneran rugi. {greeting}! Bahan segar setiap hari, resep yang tidak pernah kompromi, dan konsistensi rasa yang bisa kamu buktikan sendiri. Hanya {dist}km dari sini. {cta}",
      "{greeting}! Di {loc} ini, kami percaya makanan yang baik dimulai dari bahan yang baik. Tidak ada bumbu instan, tidak ada MSG berlebih. Setiap menu punya cerita dari dapur yang sama sejak hari pertama buka. Datang dan rasakan bedanya — {dist}km dari kamu. {cta}",
      "{greeting}! Menu spesial hari ini terbatas — kemarin sold out dalam 2 jam. Kami di {loc}, hanya {dist}km. Buka setiap hari dari pagi. Datang lebih awal supaya tidak kehabisan. {cta}"
    ],
    "Kuliner/Cafe": [
      "{greeting}! Cafe yang benar-benar worth it itu langka — tapi di {loc} kami menemukannya. Specialty coffee diseduh serius, makanan yang tidak asal jadi, dan suasana yang bikin betah. {dist}km dari kamu. {cta}",
      "{greeting}! Kopi adalah ritual, dan kami serius soal itu. Di {loc}, setiap cangkir dari biji single origin pilihan — grind size, suhu, waktu ekstraksi semua dikontrol. Hasilnya kopi yang balance dan aftertaste yang bersih. {dist}km. {cta}",
      "{greeting}! Promo khusus hari ini di {loc}: beli minuman apa saja, gratis cake. Berlaku hari ini saja, stok terbatas. Cek langsung — hanya {dist}km. {cta}"
    ],
    "FashionPria": [
      "{greeting}! Koleksi fashion pria terbaru hadir di {loc} — untuk pria yang paham kualitas. Pilihan smart casual, formal, dan streetwear tersedia lengkap. Bahan premium, potongan presisi. Hanya {dist}km dari kamu. {cta}",
      "{greeting}! Style itu investasi jangka panjang. Di {loc}, koleksi pria kami dipilih untuk daya tahan dan timeless look — bukan fast fashion. Konsultasi styling gratis. Hanya {dist}km. {cta}",
      "{greeting}! New arrival pria eksklusif di {loc} — stok sangat terbatas. Koleksi kemarin sold out dalam 2 jam. Restock terakhir, datang sekarang. {dist}km. {cta}"
    ],
    "Fashion": [
      "{greeting}! Koleksi terbaru hadir di {loc} — dan ini bukan fashion biasa. Setiap potongan didesain untuk kenyamanan nyata, bukan sekadar foto bagus. Bahan breathable, jahitan kuat, ukuran inklusif. Temukan gaya terbaik versimu di sini. {dist}km. {cta}",
      "{greeting}! Fashion yang baik adalah investasi, bukan pengeluaran. Di {loc}, koleksi kami tahan lama, tidak luntur, desain yang tidak cepat ketinggalan zaman. Konsultasi styling gratis tersedia. Hanya {dist}km. {cta}",
      "{greeting}! New arrival eksklusif di {loc} — stok terbatas. Tiga varian sold out kemarin dalam 90 menit. Hari ini restock terakhir. Datang sekarang. {dist}km. {cta}"
    ],
    "FashionMuslim": [
      "{greeting}! Koleksi busana muslim terbaru hadir di {loc} — untuk muslimah yang ingin tampil modern tanpa melepas nilai kesopanan. Bahan adem, jahitan presisi, model terkini. Dari gamis casual hingga formal, semua lengkap. Hanya {dist}km dari kamu. {cta}",
      "{greeting}! Tampil muslimah itu bisa tetap kekinian. Di {loc}, koleksi kami dirancang bersama desainer lokal yang memahami kebutuhan perempuan berhijab Indonesia. Syar'i, nyaman, dan stylish. Konsultasi styling gratis tersedia. Hanya {dist}km. {cta}",
      "{greeting}! Koleksi busana muslim limited edition di {loc} — stok hampir habis. Model eksklusif yang tidak akan diproduksi ulang. Datang sekarang atau hubungi kami, hanya {dist}km. {cta}"
    ],
    "Real Estate": [
      "{greeting}! Membeli rumah adalah keputusan terbesar dalam hidup — dan kami di {loc} pastikan kamu tidak menyesal. Lokasi strategis, sertifikat HM, konstruksi SNI, tim yang mendampingi sampai serah terima. Konsultasi gratis, tanpa tekanan. {dist}km. {cta}",
      "{greeting}! Properti di {loc} bukan sekadar bangunan — ini masa depan keluarga. Akses sekolah, pusat kota, fasilitas publik dalam jangkauan {dist}km. Nilai investasi terus naik. Jadwalkan kunjungan hari ini. {cta}",
      "{greeting}! Unit tersisa tinggal 3 dengan harga pre-launch. Begitu terjual, harga naik signifikan. Survei gratis bisa dijadwalkan hari ini di {loc}. Jangan tunda. {cta}"
    ],
    "Beauty/Self-care": [
      "{greeting}! Kulit sehat bisa dicapai — tapi harus pakai produk yang tepat. Di {loc}, skincare kami transparan soal formula: Niacinamide 10%, Tranexamic Acid, herbal lokal. Dermatologi tested, bebas paraben. Untuk kulit Indonesia yang sesungguhnya. {dist}km. {cta}",
      "{greeting}! Banyak yang sudah merasakan perubahan nyata setelah 2 minggu pakai skincare kami dari {loc}. Bukan filter, bukan editan — hasil yang bisa kamu dokumentasikan sendiri. Beauty expert siap konsultasi gratis. Hanya {dist}km. {cta}",
      "{greeting}! Flash sale skincare hari ini di {loc} — hemat 40% untuk paket pilihan. Stok 15 set, kemarin habis 4 jam. Datang lebih awal atau hubungi kami untuk reservasi. {cta}"
    ],
    "Tourism": [
      "{greeting}! Ada destinasi {dist}km dari {loc} yang belum banyak yang tau — dan kami ingin kamu yang pertama ke sana. Fasilitas lengkap, pemandu bersertifikat, rating 4.8/5 dari 500+ ulasan nyata. Pengalaman sesungguhnya lebih dari sekadar foto. {cta}",
      "{greeting}! Liburan tidak harus jauh dan mahal. Di {loc}, kami kurasi destinasi lokal terbaik yang sering terlewatkan. Alam, budaya, kuliner lokal dalam satu paket terencana. Booking sekarang untuk weekend ini. {cta}",
      "{greeting}! Promo paket wisata area {loc} akhir pekan ini — diskon 35% untuk booking hari ini. Slot sangat terbatas. Semua sudah disiapkan — kamu tinggal datang dan menikmati. {cta}"
    ],
    "Retro Automotive": [
      "{greeting}! Motor klasik yang terawat benar itu berbeda kelas — dan di {loc}, kami punya standarnya. Mekanik bersertifikat, spare part original importir resmi, garansi 30 hari. Bukan bengkel asal-asalan. {dist}km. {cta}",
      "{greeting}! Komunitas otomotif klasik {loc} bukan sekadar kumpul-kumpul. Kami berbagi pengetahuan, spare part, dan ribuan jam pengalaman bersama motor antik. Bergabung — {dist}km dari pusat kota. {cta}",
      "{greeting}! Servis gratis weekend ini — ongkos jasa ditanggung untuk servis ringan. Kuota 10 motor, sudah 7 terisi. Hubungi sekarang untuk amankan slot kamu di {loc}. {cta}"
    ],
    "Parenting": [
      "{greeting}! Menjadi orang tua baru itu penuh tantangan — tapi pilihan produk bayi seharusnya tidak. Di {loc}, semua produk sudah dikurasi: SNI certified, bebas BPA, bebas formalin. Konsultasi gratis setiap hari. {dist}km. {cta}",
      "{greeting}! Setiap tahap tumbuh kembang si kecil itu berharga. Toko bayi kami di {loc} lengkap dari newborn hingga toddler, semua berstandar keamanan ketat. Hanya {dist}km. {cta}",
      "{greeting}! Bundling newborn spesial — hemat 30% untuk 20 paket pertama hari ini di {loc}. Hubungi kami sekarang sebelum paket habis. {cta}"
    ],
    "Tech/Electronics": [
      "{greeting}! Beli gadget perlu hati-hati — banyak yang mahal tapi garansi tidak jelas. Di {loc}, semua unit bergaransi resmi distributor minimum 1 tahun. Konsultasi gratis sebelum beli. Hanya {dist}km. {cta}",
      "{greeting}! Setup impian dimulai dari pilihan yang tepat. Di {loc}, kami sediakan gadget untuk semua kebutuhan — kreator, gamer, profesional. Perbandingan jujur, tanpa tekanan beli. {dist}km. {cta}",
      "{greeting}! Flash sale gadget hari ini di {loc} — diskon besar untuk pilihan terbaik. Stok sangat terbatas, 50+ unit sudah terjual dari pagi. {cta}"
    ],
    "Pet Supplies": [
      "{greeting}! Anabul kamu layak mendapat yang terbaik — dan di {loc} kami tidak kompromi soal kualitas. Pakan standar AAFCO, grooming dermatologically tested, dokter hewan tersedia setiap hari tanpa appointment. {dist}km. {cta}",
      "{greeting}! Happy pet bukan soal mahal, tapi soal tepat. Toko pet supply kami di {loc} menyediakan produk yang dikurasi untuk kebutuhan nyata hewan peliharaan Indonesia. {dist}km. {cta}",
      "{greeting}! Promo grooming profesional minggu ini di {loc} — slot terbatas 15 ekor per hari. Sudah 10 terisi. Book sekarang sebelum jadwal penuh. {cta}"
    ],
    "Creative/Arts": [
      "{greeting}! Seni lokal {loc} bukan sekadar dekorasi — ini warisan yang hidup. Galeri kami mengkurasi karya dengan standar ketat: setiap karya bersertifikat keaslian, didokumentasi prosesnya. Kualitas museum, harga terjangkau. {dist}km. {cta}",
      "{greeting}! Support seniman lokal {loc} adalah investasi budaya. Di galeri kami kamu tidak hanya beli karya — kamu ikut menjaga tradisi seni daerah tetap hidup. Custom art bisa dipesan. {cta}",
      "{greeting}! Pameran terbatas akhir pekan ini di {loc} — karya eksklusif seniman lokal harga perdana. Setelah pameran, harga naik. Jangan lewatkan, {dist}km dari kamu. {cta}"
    ],
    "Heritage & Cultural Fashion": [
      "{greeting}! Batik tulis dari {loc} butuh 2 hingga 6 minggu per lembar — itu keunggulan, bukan kelemahan. Setiap motif bermakna, setiap warna dari bahan alami. Warisan yang bisa kamu kenakan. {dist}km. {cta}",
      "{greeting}! Ada perbedaan besar antara batik printing, cap, dan tulis — dan kami di {loc} menyediakan yang terakhir. Kain primissima, pewarna alami, pengrajin bersertifikat. {dist}km. {cta}",
      "{greeting}! Koleksi edisi terbatas — 50 lembar, 30 sudah terjual. Motif eksklusif dari pengrajin {loc} tidak akan diproduksi ulang. Pesan sekarang sebelum benar-benar habis. {cta}"
    ],
    "Interior Design": [
      "{greeting}! Transformasi ruang tidak harus mahal — tapi harus tepat. Tim desainer kami di {loc} berpengalaman 8+ tahun, 200+ proyek. Visualisasi 3D sebelum eksekusi — tidak ada kejutan buruk. Konsultasi gratis. {dist}km. {cta}",
      "{greeting}! Sat-set, terima beres — itu prinsip kami di {loc}. Dari konsultasi hingga koordinasi tukang dan material, semua kami handle. Kamu tinggal approval dan menikmati hasilnya. {dist}km. {cta}",
      "{greeting}! Konsultasi desain interior gratis senilai Rp 500rb — hanya untuk 10 klien pertama minggu ini di {loc}. Sudah 6 slot terisi. Hubungi sekarang. {cta}"
    ],
    "Sports Apparel": [
      "{greeting}! Gear olahraga yang tepat nyata pengaruhnya ke performa. Di {loc}, produk kami berteknologi moisture-wicking, anti-odor, ergonomic cut — direkomendasikan trainer dan atlet lokal. {dist}km. {cta}",
      "{greeting}! Olahraga adalah investasi jangka panjang — gear yang tepat membuatnya lebih efektif. Toko sports kami di {loc} lengkap dari lari, gym, hingga outdoor. Konsultasi gratis. {dist}km. {cta}",
      "{greeting}! Flash sale sports gear weekend ini — diskon besar untuk koleksi lari dan gym di {loc}. Ukuran populer cepat habis. {cta}"
    ],
    "General": [
      "{greeting}! Usaha lokal {loc} yang sudah dipercaya warga sejak hari pertama buka. Bukan korporat besar — kami tetangga sendiri yang paham kebutuhan komunitas. {dist}km. {cta}",
      "{greeting}! Kualitas konsisten dan pelayanan jujur — itu yang kami jaga setiap hari di {loc}. Tidak ada janji berlebihan. Yang ada: produk yang bisa diandalkan. {dist}km. {cta}",
      "{greeting}! Promo khusus pelanggan baru dari radius {dist}km hari ini di {loc}. Stok terbatas — sudah ratusan yang memanfaatkan. Jangan sampai ketinggalan. {cta}"
    ]
  },
  "meta": {
    "Kuliner": [
      "{greeting} Ada tempat makan baru yang lagi ramai dibicarakan di {loc}! 🍽\n\nBahan segar, resep jujur, rasa yang bikin balik lagi. Hanya {dist}km dari kamu.\n\n{cta}",
      "{greeting} Konsisten enak setiap hari — bukan cuma pas buka doang. 😋\n\nKuliner kami di {loc}, {dist}km dari kamu.\n\n{cta}",
      "{greeting} PROMO HARI INI SAJA! 🔥\n\nDiskon pelanggan baru di {loc}. Menu terbatas, kemarin sold out 2 jam.\n\n{cta}"
    ],
    "Kuliner/Cafe": [
      "{greeting} Cafe terbaru di {loc} yang benar-benar worth it! ☕\n\nSpecialty coffee, suasana cozy, WiFi kenceng. {dist}km dari kamu.\n\n{cta}",
      "{greeting} WFH dari cafe yang supportif beda produktivitasnya. 💻\n\nCafe kami di {loc} — kopi enak, kursi nyaman, koneksi stabil. {dist}km.\n\n{cta}",
      "{greeting} Promo hari ini: beli kopi gratis cake! 🎉\n\nDi {loc}, {dist}km dari kamu. Stok terbatas.\n\n{cta}"
    ],
    "FashionPria": [
      "{greeting} Koleksi pria terbaru di {loc}! 👔\n\nSmart casual, formal, streetwear — semua ada. Bahan premium, potongan flattering.\n\n{cta}",
      "{greeting} Style pria yang timeless, bukan sekadar tren. 💼\n\nKoleksi kami di {loc}, {dist}km — awet, presisi, percaya diri setiap hari.\n\n{cta}",
      "{greeting} NEW ARRIVAL PRIA — STOK TERBATAS! ⚡\n\nSold out kemarin, restock hari ini di {loc}. {dist}km dari kamu.\n\n{cta}"
    ],
    "Fashion": [
      "{greeting} Koleksi terbaru landing di {loc}! 👗\n\nBahan premium, jahitan rapi, ukuran inklusif. Investasi penampilan bukan fast fashion.\n\n{cta}",
      "{greeting} Tampil percaya diri setiap hari dimulai dari pilihan yang tepat. 💜\n\nKoleksi kami di {loc}, {dist}km — desain awet, kualitas tahan lama.\n\n{cta}",
      "{greeting} NEW ARRIVAL — STOK TERBATAS! 🛍\n\n3 varian sold out 90 menit kemarin. Restock hari ini, terakhir.\n\n{cta}"
    ],
    "FashionMuslim": [
      "{greeting} Koleksi busana muslim terbaru hadir di {loc}! 🧕\n\nSyar'i, modern, nyaman seharian. Dari gamis hingga outer — semua ada. Hanya {dist}km.\n\n{cta}",
      "{greeting} Tampil muslimah modern dan percaya diri! 💜\n\nKoleksi hijab fashion kami di {loc} — bahan premium, model terkini, harga terjangkau.\n\n{cta}",
      "{greeting} KOLEKSI LIMITED — HAMPIR HABIS! ⏰\n\n3 varian sold out kemarin di {loc}. Restock terakhir, {dist}km dari kamu.\n\n{cta}"
    ],
    "Real Estate": [
      "{greeting} Hunian impian di {loc} masih tersedia! 🏡\n\nSertifikat HM, konstruksi SNI, lokasi strategis. Survei gratis, tanpa tekanan.\n\n{cta}",
      "{greeting} Investasi terbaik adalah yang tidak akan kamu sesali. 📈\n\nProperti kami di {loc} — lokasi prime, {dist}km dari pusat kota.\n\n{cta}",
      "{greeting} UNIT TERSISA TINGGAL 3! ⚠\n\nHarga pre-launch masih berlaku. Survei gratis hari ini juga.\n\n{cta}"
    ],
    "Beauty/Self-care": [
      "{greeting} Rahasia glowing warga {loc} akhirnya terbongkar! ✨\n\nFormula transparan, dermatologi tested, bebas paraben.\n\n{cta}",
      "{greeting} Self-care yang efektif itu ada — dan ada di {loc}. 🌸\n\nNiacinamide 10%, herbal lokal, fragrance-free. {dist}km dari kamu.\n\n{cta}",
      "{greeting} FLASH SALE — HARI INI SAJA! 💥\n\nHemat 40% paket skincare di {loc}. Stok 15 set, kemarin habis 4 jam.\n\n{cta}"
    ],
    "Tourism": [
      "{greeting} Destinasi terbaik {dist}km dari {loc} sudah menunggu! 🗺\n\nRating 4.8/5, fasilitas lengkap, pengalaman nyata tak terlupakan.\n\n{cta}",
      "{greeting} Liburan berkesan tidak harus jauh dan mahal. 🌟\n\nDestinansi terbaik area {loc} — alam, budaya, kuliner dalam satu paket.\n\n{cta}",
      "{greeting} PROMO WEEKEND — DISKON 35%! 🎯\n\nBooking hari ini untuk trip area {loc}. Slot sangat terbatas.\n\n{cta}"
    ],
    "Retro Automotive": [
      "{greeting} Bengkel spesialis motor klasik di {loc}! 🏍\n\nSpare part original, mekanik bersertifikat, garansi 30 hari.\n\n{cta}",
      "{greeting} Motor klasik kamu layak perawatan terbaik. 🔧\n\nBengkel kami di {loc}, {dist}km — teknisi berpengalaman.\n\n{cta}",
      "{greeting} SERVIS GRATIS WEEKEND INI! ⚡\n\nOngkos jasa gratis servis ringan. Kuota 10 motor, sudah 7 terisi.\n\n{cta}"
    ],
    "Parenting": [
      "{greeting} Semua kebutuhan si kecil, tersertifikasi, di {loc}! 👶\n\nSNI certified, bebas BPA, konsultasi gratis. {dist}km.\n\n{cta}",
      "{greeting} Keamanan si kecil tidak bisa dikompromikan. 🌟\n\nToko bayi kami di {loc} — kurasi ketat, konsultasi gratis setiap hari.\n\n{cta}",
      "{greeting} BUNDLING NEWBORN — HEMAT 30%! 🎁\n\nHanya 20 paket di {loc}. Orang tua baru, ini yang kamu butuhkan.\n\n{cta}"
    ],
    "Tech/Electronics": [
      "{greeting} Gadget garansi resmi, harga kompetitif — di {loc}! 💻\n\nKonsultasi spesifikasi gratis sebelum beli.\n\n{cta}",
      "{greeting} Upgrade device yang beneran bergaransi. ⚡\n\nToko gadget kami di {loc}, {dist}km — garansi distributor resmi min. 1 tahun.\n\n{cta}",
      "{greeting} FLASH SALE HARI INI! 🔥\n\n50+ unit terjual dari pagi. Stok flash sale terbatas.\n\n{cta}"
    ],
    "Pet Supplies": [
      "{greeting} Anabul kamu layak yang terbaik — ada di {loc}! 🐾\n\nPakan AAFCO, grooming dermatologically tested, dokter hewan on-site.\n\n{cta}",
      "{greeting} Happy anabul sama dengan happy owner. 🐱\n\nToko pet kami di {loc}, {dist}km — produk berkualitas, konsultasi gratis.\n\n{cta}",
      "{greeting} PROMO GROOMING MINGGU INI! 🐶\n\nSlot terbatas 15 ekor/hari. Sudah 10 terisi hari ini.\n\n{cta}"
    ],
    "Creative/Arts": [
      "{greeting} Karya seni lokal {loc} — bersertifikat, berkelas, terjangkau! 🎨\n\nSetiap karya dilengkapi sertifikat keaslian.\n\n{cta}",
      "{greeting} Dekorasi rumah dengan seni yang punya makna. 🖌\n\nGaleri kami di {loc} mengkurasi karya terbaik seniman lokal.\n\n{cta}",
      "{greeting} PAMERAN TERBATAS — AKHIR PEKAN INI! ✨\n\nHarga perdana, {dist}km dari {loc}. Jangan lewatkan.\n\n{cta}"
    ],
    "Heritage & Cultural Fashion": [
      "{greeting} Batik tulis asli pengrajin {loc} — bukan printing! 🧵\n\nPewarna alami, motif bermakna.\n\n{cta}",
      "{greeting} Bangga pakai batik lokal — dan ini alasannya. 🇮🇩\n\nBatik dari {loc} dibuat tangan, pewarna alami, 2-6 minggu pengerjaan.\n\n{cta}",
      "{greeting} KOLEKSI LIMITED — 30 dari 50 sudah terjual! ⏰\n\nMotif eksklusif {loc}, tidak diproduksi ulang.\n\n{cta}"
    ],
    "Interior Design": [
      "{greeting} Wujudkan rumah impian bersama kami di {loc}! 🏡\n\nKonsultasi gratis, visualisasi 3D, sat-set terima beres.\n\n{cta}",
      "{greeting} Transformasi ruang tidak harus rumit. ✨\n\nTim kami di {loc} — 8+ tahun, 200+ proyek selesai.\n\n{cta}",
      "{greeting} KONSULTASI GRATIS — HANYA 10 SLOT! 🛋\n\nSudah 6 terisi minggu ini. Nilai Rp 500rb — gratis untuk kamu.\n\n{cta}"
    ],
    "Sports Apparel": [
      "{greeting} Gear olahraga yang beneran ngaruh ke performa — di {loc}! 💪\n\nMoisture-wicking, anti-odor, ergonomic cut.\n\n{cta}",
      "{greeting} Olahraga lebih efektif dengan gear yang tepat. 🏃\n\nToko sports kami di {loc}, {dist}km — lengkap dari lari, gym, outdoor.\n\n{cta}",
      "{greeting} FLASH SALE SPORTS — WEEKEND INI! ⚡\n\nDiskon besar di {loc}. Ukuran populer cepat habis.\n\n{cta}"
    ],
    "General": [
      "{greeting} Ada yang baru dan menarik di {loc}! 👋\n\nUsaha lokal yang dipercaya komunitas sekitar. Hanya {dist}km.\n\n{cta}",
      "{greeting} Kualitas konsisten, pelayanan jujur — itu yang kami jaga. 💪\n\nHadir di {loc} untuk melayani kamu sepenuh hati.\n\n{cta}",
      "{greeting} PROMO KHUSUS HARI INI! 🔔\n\nHanya untuk {dist}km pertama dari {loc}. Stok terbatas.\n\n{cta}"
    ]
  }
};
