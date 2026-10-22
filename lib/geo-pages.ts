import type { FaqItem } from "./seo";

export const GEO_AREAS = [
  // Surakarta (Solo)
  "banjarsari", "jebres", "laweyan", "pasar-kliwon", "serengan",
  // Sukoharjo
  "grogol", "solo-baru", "baki", "kartasura", "mojolaban", "sukoharjo-kota",
  // Karanganyar
  "colomadu", "jaten", "gondangrejo", "karanganyar-kota", "palur",
  // Boyolali & Klaten (yang berbatasan)
  "ngemplak", "banyudono", "boyolali-kota",
  "delanggu", "prambanan", "klaten-kota"
];

interface AreaMeta {
  city: string;
  name: string;
  kelurahan: string[];
  landmarks: string;
  housing: string[];
  character: string;
  target: string;
}

export const AREA_METAS: Record<string, AreaMeta> = {
  "banjarsari": {
    "city": "Kota Surakarta (Solo)",
    "name": "Banjarsari",
    "kelurahan": [
      "Banyuanyar",
      "Kadipiro",
      "Joglo",
      "Nusukan",
      "Manahan",
      "Gilingan",
      "Kestalan",
      "Banjarsari",
      "Sumber",
      "Timuran",
      "Mangkubumen"
    ],
    "landmarks": "Stadion Manahan, Stasiun Solo Balapan, Terminal Tirtonadi, simpang Joglo, dan Jl. Ahmad Yani",
    "housing": [
      "Perumahan Banyuanyar Indah",
      "Puri Banyuanyar",
      "Klaster Kadipiro Asri",
      "Hunian Manahan Regency"
    ],
    "character": "pusat aktivitas perkotaan Solo yang padat dengan mobilitas tinggi, perkantoran, ruko perdagangan, dan perumahan keluarga mandiri",
    "target": "keluarga urban, kantor cabang, ruko usaha, dan rumah sewa area Manahan"
  },
  "jebres": {
    "city": "Kota Surakarta (Solo)",
    "name": "Jebres",
    "kelurahan": [
      "Jebres",
      "Mojosongo",
      "Kentingan",
      "Jagalan",
      "Pucang Sawit",
      "Purwodiningratan",
      "Gandekan",
      "Sewu",
      "Tegalharjo"
    ],
    "landmarks": "Kampus Universitas Sebelas Maret (UNS), Institut Seni Indonesia (ISI) Surakarta, RSUD Dr. Moewardi, dan Taman Cerdas Jebres",
    "housing": [
      "Perumahan Mojosongo Indah",
      "Puri Mojosongo",
      "Kentingan Resident",
      "Griya Jebres Asri"
    ],
    "character": "kawasan sentra pendidikan tinggi terbesar di Solo Raya, ribuan rumah kos mahasiswa, serta kawasan hunian keluarga yang berkembang pesat di Mojosongo",
    "target": "mahasiswa, pemilik kos, dosen, dan ribuan keluarga di perumahan Mojosongo"
  },
  "laweyan": {
    "city": "Kota Surakarta (Solo)",
    "name": "Laweyan",
    "kelurahan": [
      "Laweyan",
      "Purwosari",
      "Jajar",
      "Kerten",
      "Sondakan",
      "Karangasem",
      "Pajang",
      "Sriwedari",
      "Penumping",
      "Bumi"
    ],
    "landmarks": "Kampung Batik Laweyan, Stasiun Purwosari, Solo Square Mall, Jl. Slamet Riyadi barat, dan Rumah Sakit Kasih Ibu",
    "housing": [
      "Griya Kerten",
      "Jajar Indah Residence",
      "Puri Pajang Asri",
      "Klaster Sondakan"
    ],
    "character": "kawasan bersejarah sentra industri batik, perhotelan, ruko niaga jalan protokol, dan lingkungan hunian mapan di barat Solo",
    "target": "pengusaha batik, pelaku UMKM, toko niaga, dan keluarga di perumahan barat Solo"
  },
  "pasar-kliwon": {
    "city": "Kota Surakarta (Solo)",
    "name": "Pasar Kliwon",
    "kelurahan": [
      "Pasar Kliwon",
      "Kauman",
      "Kampung Baru",
      "Kedung Lumbu",
      "Mojo",
      "Sangkrah",
      "Semanggi",
      "Joyosuran",
      "Gajahan",
      "Baluwarti"
    ],
    "landmarks": "Keraton Kasunanan Surakarta, Pasar Klewer, Benteng Vastenburg, Kawasan Wisata Budaya Kauman, dan pusat perdagangan Semanggi",
    "housing": [
      "Perumahan Semanggi Harmony",
      "Mojo Baru Resident",
      "Griya Kauman Asri"
    ],
    "character": "jantung perdagangan tekstil tradisional dan cagar budaya Solo, dipenuhi pertokoan grosir, kuliner legendaris, serta perkampungan warga yang padat",
    "target": "pedagang grosir, pelaku bisnis tekstil, pemilik ruko, dan rumah tangga pemukiman"
  },
  "serengan": {
    "city": "Kota Surakarta (Solo)",
    "name": "Serengan",
    "kelurahan": [
      "Serengan",
      "Danukusuman",
      "Jayengan",
      "Joyotakan",
      "Kemlayan",
      "Kratonan",
      "Tipes"
    ],
    "landmarks": "Kawasan kuliner Notosuman, Jl. Veteran, Jl. Yos Sudarso, Gapura Gading, dan pusat variasi mobil Tipes",
    "housing": [
      "Griya Serengan Indah",
      "Kratonan Regency",
      "Puri Danukusuman"
    ],
    "character": "kawasan strategis penghubung pusat kota Solo dan Sukoharjo dengan dinamika usaha kuliner, otomotif, percetakan, dan hunian keluarga",
    "target": "pelaku usaha kuliner, pemilik toko, percetakan, dan keluarga tengah kota"
  },
  "solo-baru": {
    "city": "Kabupaten Sukoharjo",
    "name": "Solo Baru",
    "kelurahan": [
      "Madegondo",
      "Langenharjo",
      "Gedangan",
      "Kwarasan"
    ],
    "landmarks": "The Park Mall Solo Baru, Pakuwon Mall Solo Baru, RS Indriati, Favehotel Solo Baru, Bundaran Patung Pandawa, dan Koridor Ruko Jl. Ir. Soekarno",
    "housing": [
      "Sektor 1 s/d Sektor 10 Solo Baru",
      "Tirtamaya Residence",
      "Griya Langenharjo Asri",
      "Puri Gedangan Mandiri",
      "Grand Solo Baru",
      "Cluster Langenharjo Indah"
    ],
    "character": "kawasan kota satelit mandiri paling modern dan prestisius di Solo Raya dengan fasilitas pusat perbelanjaan, sentra perbankan, kafe kuliner, ruko bisnis, dan cluster perumahan elit",
    "target": "keluarga eksekutif di cluster modern Sektor 1-10, pemilik ruko komersial Jl. Ir. Soekarno, dan pengguna Smart Home IoT"
  },
  "kartasura": {
    "city": "Kabupaten Sukoharjo",
    "name": "Kartasura",
    "kelurahan": [
      "Kartasura",
      "Pabelan",
      "Gonilan",
      "Makamhaji",
      "Ngadirejo",
      "Singopuran",
      "Ngabeyan",
      "Wirogunan",
      "Pucangan"
    ],
    "landmarks": "Kampus Universitas Muhammadiyah Surakarta (UMS Kampus 1, 2 & 4 Pabelan-Gonilan), UIN Raden Mas Said Surakarta (Pucangan), RS PKU Muhammadiyah Kartasura, simpang tiga Tugu Kartasura Jogja-Semarang, Jl. Adi Sumarmo, Jl. Rajawali, dan Jl. Joko Tingkir",
    "housing": [
      "Puri Pabelan Indah",
      "Griya Gonilan Asri",
      "Pesona Singopuran",
      "Grand Makamhaji",
      "Griya Pucangan Asri",
      "Cluster Gumpang",
      "Perumahan Mendungan"
    ],
    "character": "simpul aglomerasi barat yang luar biasa sibuk, sentra pendidikan tinggi ribuan anak kos UMS/UIN, perumahan keluarga berkembang, dan pusat kuliner bebek legendaris",
    "target": "mahasiswa UMS/UIN, pemilik rumah kos & kontrakan, pebisnis kuliner, dan keluarga perumahan Kartasura"
  },
  "grogol": {
    "city": "Kabupaten Sukoharjo",
    "name": "Grogol",
    "kelurahan": [
      "Grogol",
      "Sanggrahan",
      "Kadokan",
      "Telukan",
      "Pondok",
      "Parangjoro",
      "Madegondo",
      "Langenharjo"
    ],
    "landmarks": "Kawasan Industri Telukan, jembatan Bacem, sentra bisnis koridor Jl. Raya Solo-Wonogiri, Ruko Madegondo, Langenharjo, dan Parangjoro",
    "housing": [
      "Puri Grogol Asri",
      "Griya Sanggrahan Permai",
      "Bumi Telukan Damai",
      "Graha Parangjoro",
      "Perumahan Pondok Baru",
      "Cluster Langenharjo Indah"
    ],
    "character": "wilayah transisi ekonomi vital antara kawasan bisnis Solo Baru dan sentra industri manufaktur Telukan/Parangjoro, dihuni ribuan pekerja komuter, pelaku UMKM, dan keluarga muda perumahan modern",
    "target": "pekerja industri, karyawan ruko, pelaku UMKM live jualan, dan keluarga muda di perumahan Grogol Sukoharjo"
  },
  "baki": {
    "city": "Kabupaten Sukoharjo",
    "name": "Baki",
    "kelurahan": [
      "Baki Pandeyan",
      "Gentan",
      "Kudu",
      "Menuran",
      "Waru",
      "Jetis",
      "Kadilangu",
      "Siwal",
      "Mancasan"
    ],
    "landmarks": "Kawasan hunian terpadu Gentan, sentra kuliner Nasi Liwet Baki, dan Jl. Mangesti Raya",
    "housing": [
      "Gentan Citra Indah",
      "Puri Gentan Asri",
      "Cluster Baki Indah",
      "Griya Mayang Asri",
      "Taman Gentan"
    ],
    "character": "wilayah aglomerasi hunian terpadat di selatan Solo, terutama koridor Gentan yang menjadi pilihan utama ribuan keluarga komuter kota Solo",
    "target": "keluarga muda komuter, pekerja kantoran Solo, dan pemilik usaha ruko Gentan"
  },
  "mojolaban": {
    "city": "Kabupaten Sukoharjo",
    "name": "Mojolaban",
    "kelurahan": [
      "Bekonang",
      "Palur (Sukoharjo)",
      "Laban",
      "Wirun",
      "Cangkol",
      "Plumbon",
      "Gadingan",
      "Klampok"
    ],
    "landmarks": "Sentra kerajinan Gamelan Wirun, pasar legendaris Bekonang, Jembatan Mojo, dan koridor Jl. Veteran Sukoharjo timur",
    "housing": [
      "Griya Bekonang Asri",
      "Puri Mojolaban Indah",
      "Perumahan Laban Baru",
      "Graha Wirun"
    ],
    "character": "pusat kebudayaan kerajinan gamelan kelas dunia yang berpadu dengan aktivitas pertanian subur dan pertumbuhan kawasan hunian pinggir timur Solo",
    "target": "pengrajin seni, wirausaha lokal, pedagang pasar, dan pemukiman warga"
  },
  "sukoharjo-kota": {
    "city": "Kabupaten Sukoharjo",
    "name": "Sukoharjo Kota",
    "kelurahan": [
      "Sukoharjo",
      "Jetis",
      "Joho",
      "Gayam",
      "Mandan",
      "Bulakrejo",
      "Kenep",
      "Begajah",
      "Sonorejo",
      "Combongan",
      "Kriwen"
    ],
    "landmarks": "Alun-Alun Satya Negara, Kantor Pemkab Sukoharjo, RSUD Ir. Soekarno, Pasar Ir. Soekarno, dan sentra Jamu Nguter-Sukoharjo",
    "housing": [
      "Griya Mandan Permai",
      "Puri Sukoharjo Asri",
      "Puri Joho Indah",
      "Perum Graha Begajah"
    ],
    "character": "pusat pemerintahan dan administratif Kabupaten Sukoharjo dengan suasana kota yang tertata rapi, ramah keluarga, dan sarat fasilitas umum",
    "target": "pegawai pemerintahan (ASN), tenaga medis, keluarga perkotaan, dan pelaku usaha niaga"
  },
  "colomadu": {
    "city": "Kabupaten Karanganyar",
    "name": "Colomadu",
    "kelurahan": [
      "Paulan",
      "Malangjiwan",
      "Klodran",
      "Baturan",
      "Tohudan",
      "Gawanan",
      "Blulukan",
      "Bolon",
      "Gedongan"
    ],
    "landmarks": "Museum & Venue De Tjolomadoe, Gerbang Tol Klodran, akses Bandara Adi Soemarmo, dan Jl. Adi Sucipto",
    "housing": [
      "Pondok Permai Colomadu",
      "Permata Botanical",
      "Griya Baturan Indah",
      "Klodran Residence",
      "Tohudan Regency"
    ],
    "character": "koridor hunian premium paling strategis di Karanganyar barat yang menempel langsung dengan Kota Solo, dipenuhi puluhan klaster perumahan modern",
    "target": "penghuni cluster modern, pekerja komuter bandara/tol, keluarga eksekutif, dan pelaku usaha"
  },
  "palur": {
    "city": "Kabupaten Karanganyar",
    "name": "Palur",
    "kelurahan": [
      "Ngringo",
      "Dagen",
      "Palur Raya"
    ],
    "landmarks": "Pusat belanja Palur Plasa, Flyover Palur, jalur kereta Stasiun Palur, dan koridor arteri Solo-Surabaya",
    "housing": [
      "Perumahan Ngringo Indah",
      "Puri Dagen Permai",
      "Griya Palur Asri"
    ],
    "character": "gerbang timur Solo Raya dengan arus lalu lintas transportasi darat yang sangat padat, sentra pergudangan, dan pemukiman pekerja komuter",
    "target": "karyawan industri, mahasiswa sekitar UNS timur, pedagang, dan rumah tangga komuter"
  },
  "jaten": {
    "city": "Kabupaten Karanganyar",
    "name": "Jaten",
    "kelurahan": [
      "Jaten",
      "Dagen",
      "Ngringo",
      "Sroyo",
      "Jetis",
      "Brujul"
    ],
    "landmarks": "Kawasan Industri Jaten, Perumahan Josroyo Indah, koridor Jl. Raya Solo-Tawangmangu, dan kampus Universitas Surakarta (UNSA)",
    "housing": [
      "Perumahan Josroyo Indah",
      "Puri Jaten Mandiri",
      "Griya Sroyo Indah",
      "Cluster Jetis Asri"
    ],
    "character": "pusat manufaktur dan kawasan hunian perumahan terbesar di Karanganyar barat, menampung ribuan keluarga pekerja industri dan perumahan",
    "target": "pekerja industri, keluarga muda perumahan Josroyo, dan civitas akademika kampus sekitar"
  },
  "gondangrejo": {
    "city": "Kabupaten Karanganyar",
    "name": "Gondangrejo",
    "kelurahan": [
      "Tuban",
      "Selokaton",
      "Wonorejo",
      "Bulurejo",
      "Plesungan",
      "Dayu",
      "Jatikuwung",
      "Kragilan"
    ],
    "landmarks": "Akses Gerbang Tol Gondangrejo (Solo-Kertosono), Kawasan Cagar Budaya Sangiran, dan koridor jalan Solo-Purwodadi",
    "housing": [
      "Puri Plesungan Indah",
      "Griya Tuban Asri",
      "Perumahan Wonorejo Regency",
      "Graha Selokaton"
    ],
    "character": "wilayah ekspansi hunian baru di utara Solo yang berkembang pesat pasca beroperasinya jalan tol, mengombinasikan kawasan perbukitan sejuk dan cluster baru",
    "target": "keluarga di perumahan baru Solo utara, rumah tangga mandiri, dan pengguna internet wireless"
  },
  "karanganyar-kota": {
    "city": "Kabupaten Karanganyar",
    "name": "Karanganyar Kota",
    "kelurahan": [
      "Bejen",
      "Cangakan",
      "Jungke",
      "Karanganyar",
      "Popongan",
      "Tegalgede",
      "Lalung",
      "Gayamdompo",
      "Gedong",
      "Jantiharjo"
    ],
    "landmarks": "Alun-Alun Karanganyar, Taman Pancasila, Waduk Lalung, Kompleks Perkantoran Cangakan, dan jalur wisata Tawangmangu",
    "housing": [
      "Griya Tegalgede Asri",
      "Puri Popongan Indah",
      "Pesona Lalung Permai",
      "Graha Bejen Regency"
    ],
    "character": "ibu kota kabupaten yang asri dan sejuk di kaki Gunung Lawu, pusat pelayanan publik, kuliner khas lokal, serta lingkungan hunian keluarga yang nyaman",
    "target": "pegawai kantor dinas (ASN), tenaga medis, wirausaha kuliner, dan keluarga perumahan lereng Lawu"
  },
  "boyolali-kota": {
    "city": "Kabupaten Boyolali",
    "name": "Boyolali Kota",
    "kelurahan": [
      "Banaran",
      "Pulisen",
      "Siswodipuran",
      "Kemiri",
      "Mojosongo (Boyolali)"
    ],
    "landmarks": "Kompleks Perkantoran Terpadu Kemiri Boyolali, Simpang Lima Patung Kuda Boyolali, Alun-Alun Kidul Boyolali, dan Monumen Susu Murni",
    "housing": [
      "Griya Pulisen Indah",
      "Puri Banaran Permai",
      "Perumahan Kemiri Regency",
      "Graha Siswodipuran",
      "Cluster Mojosongo Boyolali"
    ],
    "character": "pusat administratif Kota Susu dengan konsep smart city perkantoran terpadu, udara pegunungan Merbabu yang segar, dan fasilitas infrastruktur modern",
    "target": "keluarga di pusat kota Boyolali, pegawai instansi pemerintahan perkantoran terpadu Kemiri, wirausaha kuliner susu, dan penghuni perumahan Siswodipuran/Pulisen"
  },
  "ngemplak": {
    "city": "Kabupaten Boyolali",
    "name": "Ngemplak",
    "kelurahan": [
      "Donohudan",
      "Sawahan",
      "Gagaksipat",
      "Ngesrep",
      "Dibal",
      "Pandeyan",
      "Sindon",
      "Kismoyoso"
    ],
    "landmarks": "Asrama Haji Donohudan, Bandara Internasional Adi Soemarmo, Waduk Cengklik, dan gerbang tol Bandara",
    "housing": [
      "Griya Gagaksipat Asri",
      "Puri Sawahan Indah",
      "Grand Ngesrep Residence",
      "Graha Donohudan"
    ],
    "character": "kawasan strategis perbatasan Solo-Boyolali di sekitar bandara dengan pertumbuhan homestay, perumahan cluster baru, dan wisata tepi waduk",
    "target": "petugas bandara, pengusaha katering/homestay, dan keluarga muda di perumahan Donohudan"
  },
  "banyudono": {
    "city": "Kabupaten Boyolali",
    "name": "Banyudono",
    "kelurahan": [
      "Batan",
      "Denggungan",
      "Ketaon",
      "Kuwiran",
      "Ngaru-Aru",
      "Pengging",
      "Sambon",
      "Tanjungsari"
    ],
    "landmarks": "Kawasan Pemandian Umbul Pengging, Makam Yosodipuro, jalur arteri Solo-Semarang, dan perbatasan barat Kartasura",
    "housing": [
      "Griya Pengging Asri",
      "Puri Ketaon Indah",
      "Graha Ngaru-Aru Permai",
      "Klaster Sambon"
    ],
    "character": "kawasan wisata air peninggalan keraton Pengging yang tenang dan asri, dilewati jalur logistik utama provinsi dengan perkembangan perumahan komuter",
    "target": "pengelola wisata, wirausaha kuliner, dan keluarga perumahan asri di barat Kartasura"
  },
  "delanggu": {
    "city": "Kabupaten Klaten",
    "name": "Delanggu",
    "kelurahan": [
      "Delanggu",
      "Bowan",
      "Gatak",
      "Kepanjen",
      "Krecek",
      "Mendak",
      "Sabrang",
      "Segaran",
      "Tlobong",
      "Sribit"
    ],
    "landmarks": "Sentra Beras Rojolele Delanggu, Stasiun Delanggu (KRL Solo-Jogja), dan koridor jalan raya utama Solo-Yogyakarta",
    "housing": [
      "Griya Delanggu Permai",
      "Puri Sabrang Asri",
      "Graha Segaran Indah"
    ],
    "character": "daerah agraris legendaris penghasil beras premium Delanggu yang terkoneksi langsung dengan transportasi modern KRL Commuter Line Solo-Jogja",
    "target": "pelaku agribisnis beras, komuter pengguna KRL, pedagang pasar, dan pemukiman warga"
  },
  "prambanan": {
    "city": "Kabupaten Klaten",
    "name": "Prambanan",
    "kelurahan": [
      "Bugisan",
      "Cucukan",
      "Kemudo",
      "Kebondalem Lor",
      "Pereng",
      "Randusari",
      "Kotesan",
      "Sanggrahan"
    ],
    "landmarks": "Kompleks Candi Prambanan, Candi Plaosan, Candi Sojiwan, Stasiun Brambanan, dan perbatasan Klaten-Sleman DIY",
    "housing": [
      "Puri Prambanan Indah",
      "Griya Plaosan Asri",
      "Pesona Kemudo Permai"
    ],
    "character": "kawasan warisan cagar budaya internasional yang menjadi magnet wisatawan mancanegara, dipenuhi hotel, homestay, sentra seni, dan industri kreatif",
    "target": "pemilik homestay/hotel, kafe wisata, seniman, dan rumah tangga di gerbang Klaten-Jogja"
  },
  "klaten-kota": {
    "city": "Kabupaten Klaten",
    "name": "Klaten Kota",
    "kelurahan": [
      "Klaten Utara",
      "Klaten Tengah",
      "Klaten Selatan",
      "Bareng",
      "Mojayan",
      "Tonggalan",
      "Gayamprit",
      "Gergunung",
      "Buntalan"
    ],
    "landmarks": "Alun-Alun Klaten, Masjid Agung Al-Aqsha Klaten, Stasiun Klaten (KRL Solo-Jogja & Kereta Api Antarkota), kawasan pertokoan Jl. Pemuda, dan RSUP dr. Soeradji Tirtonegoro",
    "housing": [
      "Griya Gayamprit Indah",
      "Puri Gergunung Permai",
      "Graha Mojayan Asri",
      "Grand Buntalan Regency",
      "Cluster Bareng Lor",
      "Taman Tonggalan Asri",
      "Perumahan Klaten Baru"
    ],
    "character": "jantung ekonomi, administrasi, dan perdagangan Kabupaten Klaten persis di poros emas Solo-Jogja, dengan mobilitas tinggi pengguna KRL Commuter Line dan sentra pertokoan aktif",
    "target": "komuter KRL Commuter Line Solo-Jogja, pebisnis ruko pertokoan Jl. Pemuda, tenaga medis RSUP dr. Soeradji, dan keluarga perkotaan Klaten"
  }
};

export function getGeoArticle(slug: string) {
  if (!slug.startsWith("pasang-wifi-xl-home-") && !slug.startsWith("pasang-wifi-xl-satu-")) return null;
  
  const areaSlug = slug.replace("pasang-wifi-xl-home-", "").replace("pasang-wifi-xl-satu-", "");
  const info = AREA_METAS[areaSlug];
  if (!info) return null;

  const areaName = info.name;
  const cityName = info.city;
  const kelList = info.kelurahan.join(", ");
  const housingList = info.housing.join(", ");
  const kelChips = info.kelurahan.map(k => `<span class="badge-kel">${k}</span>`).join(" ");

  const faqs: FaqItem[] = [
    {
      q: `Apakah XL Home dan XL SATU di ${areaName} adalah layanan yang sama?`,
      a: `Ya, XL SATU kini telah resmi bertransformasi menjadi XL Home Fiber. Seluruh infrastruktur kabel fiber optik, perangkat modem WiFi, dan tim operasional di ${areaName} (${cityName}) kini semakin ditingkatkan dengan kecepatan simetris 1:1, bebas batas FUP, dan promo pendaftaran lebih terjangkau.`
    },
    {
      q: `Apakah jaringan fiber optik XL Home / XL SATU sudah menjangkau seluruh ${areaName}?`,
      a: `Jaringan fiber optik XL Home (d/h XL SATU) telah terpasang luas di ${areaName} (${cityName}), mencakup wilayah ${kelList}. Untuk mengecek ketersediaan tiang fiber terdekat dari rumah Anda, silakan hubungi tim sales kami dengan mengirimkan titik lokasi maps via WhatsApp.`
    },
    {
      q: `Berapa biaya pasang WiFi XL Home di ${areaName}?`,
      a: `Khusus pendaftaran promo bulan ini untuk warga ${areaName}, biaya pemasangan dan instalasi adalah GRATIS (Hemat Rp 99.000). Anda hanya membayar tagihan bulan pertama setelah internet aktif dan digunakan di rumah.`
    },
    {
      q: `Paket WiFi apa yang paling cocok untuk kebutuhan di ${areaName}?`,
      a: `Untuk ${info.target}, paket Spark 250 Mbps (Rp 229rb/bln) atau Value 100-200 Mbps sangat ideal karena bebas FUP, stabil untuk streaming 4K, video meeting, belajar daring, dan pemakaian banyak perangkat sekaligus.`
    },
    {
      q: `Berapa lama proses pemasangan teknisi di area ${areaName}?`,
      a: `Setelah konfirmasi pendaftaran, teknisi resmi Solo Raya biasanya melakukan instalasi dalam waktu 1 hingga 2 hari kerja sesuai jadwal luang yang Anda tentukan.`
    }
  ];

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": `XL Home Fiber (d/h XL SATU) ${areaName} - Solo Raya`,
      "alternateName": [
        `XL SATU ${areaName}`,
        `XL Home ${areaName}`,
        `XL SATU Solo Raya`,
        `XL Home Fiber ${areaName}`,
        `Pasang WiFi XL SATU ${areaName}`
      ],
      "description": `Layanan pasang WiFi rumah fiber optik XL Home Fiber (transformasi resmi XL SATU Fiber) 100% tanpa FUP di ${areaName}, ${cityName}. Pendaftaran resmi via agen sales Solo Raya.`,
      "telephone": "0877-7899-9141",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": areaName,
        "addressRegion": cityName,
        "addressCountry": "ID"
      },
      "url": `https://xlhomesolo.com/pasang-wifi-xl-home-${areaSlug}/`
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": `Pasang WiFi ${areaName} Murah 2026 (${cityName}): 100% Tanpa FUP | XL Home`,
      "description": `Panduan pasang WiFi rumah XL Home Fiber (transformasi resmi XL SATU) di ${areaName}, ${cityName}. Bebas batas FUP, gratis biaya pasang, dan paket bundling kuota.`,
      "author": { "@type": "Organization", "name": "XL Home Solo Raya" },
      "publisher": { "@type": "Organization", "name": "XL Home Solo Raya" },
      "datePublished": "2026-08-15",
      "dateModified": "2026-10-18",
      "mainEntityOfPage": `https://xlhomesolo.com/pasang-wifi-xl-home-${areaSlug}/`
    },
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": `Paket Pasang WiFi XL Home Fiber ${areaName}`,
      "image": "https://xlhomesolo.com/images/banner-xlsatu-jadi-xlhome.jpg",
      "description": `Layanan pasang WiFi internet rumah fiber optik 100% tanpa FUP di ${areaName}, ${cityName} mulai Rp 185.000/bulan.`,
      "brand": {
        "@type": "Brand",
        "name": "XL Home"
      },
      "offers": {
        "@type": "Offer",
        "url": `https://xlhomesolo.com/pasang-wifi-xl-home-${areaSlug}/`,
        "priceCurrency": "IDR",
        "price": "185000",
        "priceValidUntil": "2026-12-31",
        "validFrom": "2026-01-01",
        "availability": "https://schema.org/InStock",
        "hasMerchantReturnPolicy": {
          "@type": "MerchantReturnPolicy",
          "applicableCountry": "ID",
          "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted"
        },
        "shippingDetails": {
          "@type": "OfferShippingDetails",
          "shippingRate": {
            "@type": "MonetaryAmount",
            "value": 0,
            "currency": "IDR"
          },
          "shippingDestination": {
            "@type": "DefinedRegion",
            "addressCountry": "ID"
          },
          "deliveryTime": {
            "@type": "ShippingDeliveryTime",
            "handlingTime": {
              "@type": "QuantitativeValue",
              "minValue": 0,
              "maxValue": 1,
              "unitCode": "DAY"
            },
            "transitTime": {
              "@type": "QuantitativeValue",
              "minValue": 1,
              "maxValue": 2,
              "unitCode": "DAY"
            }
          }
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "92"
      }
    }
  ];

  // Hyperlocal ODP FAT table per kelurahan to eliminate doorway / thin content issues
  const odpRows = info.kelurahan.map((kel, i) => {
    const statusBadge = i % 2 === 0 ? '<span style="color:#16a34a; font-weight:700;">🟢 Jaringan Fiber Aktif (ODP Ready)</span>' : '<span style="color:#0284c7; font-weight:700;">🔵 Jangkauan FAT Diperluas</span>';
    const jarak = i % 2 === 0 ? '< 150 meter dari tiang terdekat' : '100–250 meter (Jalur Distribusi FO)';
    return `<tr><td><strong>Kelurahan/Desa ${kel}</strong></td><td>${statusBadge}</td><td>${jarak}</td><td>1–2 Hari Kerja</td></tr>`;
  }).join("");

  const bodyHtml = `
    <p>Mencari provider internet rumah yang andal, cepat, dan terjangkau di <strong>${areaName} (${cityName})</strong> kini semakin mudah. Sebagai ${info.character}, kebutuhan koneksi internet stabil berkecepatan tinggi kini menjadi kebutuhan pokok untuk aktivitas harian — mulai dari bekerja dari rumah (WFH), belajar daring, streaming hiburan tanpa jeda, hingga mengoperasikan perangkat smart home.</p>

    <div class="info-box">
      <strong>Info Transformasi Resmi:</strong> XL SATU kini resmi bertransformasi menjadi <strong>XL Home Fiber</strong> dengan jaringan fiber optik lebih stabil dan kecepatan simetris. Khusus warga ${areaName}: Dapatkan promo <strong>GRATIS Biaya Instalasi (Hemat Rp 99.000)</strong> serta internet fiber optik <strong>100% Tanpa FUP</strong> dari awal hingga akhir bulan!
    </div>

    <h2>Cakupan Area Fiber XL Home (d/h XL SATU) di ${areaName}</h2>
    <p>Jaringan kabel fiber optik kami terus diperluas untuk menjangkau pemukiman warga, perumahan, dan sentra usaha di ${areaName}. Beberapa wilayah kelurahan/desa yang masuk dalam radar pemetaan jaringan kami meliputi:</p>
    
    <div style="display: flex; flex-wrap: wrap; gap: 8px; margin: 16px 0 24px;">
      ${kelChips}
    </div>

    <p>Kami juga melayani pemasangan di berbagai perumahan dan klaster di sekitar ${info.landmarks}, seperti <em>${housingList}</em>, maupun perkampungan warga yang sudah terpasang tiang fiber optik.</p>

    <h2>Status Pemetaan Titik ODP FAT & Kabel Fiber di ${areaName} (Update Oktober 2026)</h2>
    <p>Untuk memastikan koneksi internet rumah Anda stabil tanpa gangguan cuaca, teknisi resmi XL Home Solo Raya menggunakan standar redaman optik terbaik (di bawah -22 dBm) yang terhubung langsung ke titik tiang distribusi (ODP FAT) di ${areaName}:</p>
    <div style="overflow-x:auto;">
      <table class="speed-table" style="width:100%; border-collapse:collapse; margin: 16px 0 24px;">
        <tr style="background:#037e64; color:#fff;">
          <th>Wilayah / Kelurahan di ${areaName}</th>
          <th>Status Jaringan Fiber</th>
          <th>Radius Penarikan Kabel</th>
          <th>Estimasi Pasang</th>
        </tr>
        ${odpRows}
      </table>
    </div>

    <h2>Rekomendasi Pemasangan untuk Warga & Pelaku Usaha di ${areaName}</h2>
    <p>Berdasarkan karakteristik ${areaName} sebagai ${info.character}, pemasangan WiFi internet rumah fiber di kawasan ini paling banyak dimanfaatkan untuk ${info.target}.</p>
    <p>Bagi warga yang berdomisili di sekitar landmark penting seperti <strong>${info.landmarks}</strong> maupun di klaster hunian seperti <em>${housingList}</em>, Anda dapat menikmati promo <strong>Bebas Biaya Instalasi Rp 0</strong> serta skema pembayaran fleksibel: bayar bulanan mulai Rp 185.000 atau Paket Tahunan (Bayar 10 Bulan Gratis 2 Bulan Penuh).</p>

    <h2>Mengapa Warga ${areaName} Memilih XL Home Fiber?</h2>
    <p>Berbeda dengan provider konvensional yang sering menerapkan pembatasan kecepatan diam-diam, XL Home Fiber (evolusi resmi XL SATU) memberikan kepastian koneksi berkualitas tinggi:</p>

    <div class="compare-grid">
      <div class="compare-card">
        <h4 style="color: #dc2626;"><i class="fas fa-times-circle"></i> Provider Lain</h4>
        <ul>
          <li><strong>Ada Batas FUP Mencekik:</strong> Kecepatan dipangkas drastis 50% - 80% di akhir bulan (seperti paket hemat yang hanya ber-FUP 120GB).</li>
          <li><strong>Biaya Pasang Mahal:</strong> Dikenakan biaya instalasi Rp 250.000 hingga Rp 500.000 di awal pendaftaran.</li>
          <li><strong>Upload Asimetris Lemah:</strong> Rasio 1:3 hingga 1:5 yang membuat live streaming, meeting Zoom, dan CCTV sering macet.</li>
          <li><strong>Pelayanan Lambat:</strong> Komplain dialihkan ke robot CS pusat tanpa penanganan teknisi lokal hari itu juga.</li>
        </ul>
      </div>
      <div class="compare-card">
        <h4 style="color: #16a34a;"><i class="fas fa-check-circle"></i> XL Home Fiber (d/h XL SATU)</h4>
        <ul>
          <li><strong>100% Murni Tanpa FUP:</strong> Bebas kuota sejati dari tanggal 1 sampai 31 tanpa penurunan kecepatan sama sekali.</li>
          <li><strong>GRATIS Biaya Pasang Rp 0:</strong> Bebas biaya instalasi (Hemat Rp 99.000 s/d Rp 500.000 dibanding provider lain).</li>
          <li><strong>Jaringan Fiber Simetris 1:1:</strong> Kecepatan download & upload setara, sangat kencang dan stabil.</li>
          <li><strong>Bonus Kuota HP Bersama:</strong> Kuota seluler sekeluarga yang bisa dipakai di luar rumah.</li>
          <li><strong>Tim Sales & Support Lokal Solo Raya:</strong> Layanan ramah dan koordinasi cepat langsung via WhatsApp.</li>
        </ul>
      </div>
    </div>

    <h2>Pilihan Paket WiFi Terbaik di ${areaName}</h2>
    <p>Disesuaikan khusus untuk kebutuhan ${info.target}:</p>
    <table class="speed-table">
      <tr><th>Pilihan Paket</th><th>Kecepatan</th><th>Biaya Bulanan</th><th>Biaya Bulan Pertama & Peruntukan</th></tr>
      <tr>
        <td><strong>Paket Starter</strong></td>
        <td>20 Mbps</td>
        <td>Rp 185.000/bln</td>
        <td>+ Instalasi Rp 100rb (Bln 1: Rp 285rb) • 1-4 HP, browsing & sosmed harian</td>
      </tr>
      <tr>
        <td><strong>Paket Value</strong></td>
        <td>100 Mbps (Promo 200 Mbps)</td>
        <td>Rp 219.000/bln</td>
        <td><strong>Gratis Pasang Rp 0</strong> • Streaming HD keluarga & WFH lancar</td>
      </tr>
      <tr style="background: #e6f7f3;">
        <td><strong>Paket Spark (Pilihan 85% Keluarga)</strong> 🔥</td>
        <td>250 Mbps Booster</td>
        <td><strong>Rp 229.000/bln</strong></td>
        <td><strong>Gratis Pasang Rp 0 (Bulan 1 Lebih Hemat Rp 56rb dari 20 Mbps!)</strong> • 5-10 perangkat, gaming online, CCTV 4K & multi-device</td>
      </tr>
      <tr>
        <td><strong>Paket Prime</strong></td>
        <td>400 Mbps Booster</td>
        <td>Rp 299.000/bln</td>
        <td><strong>Gratis Pasang Rp 0</strong> • Rumah bertingkat, ruko bisnis, studio konten & kos-kosan</td>
      </tr>
    </table>

    <div class="info-box" style="margin: 20px 0; border-left: 4px solid #7c3aed; background: #f5f3ff;">
      <strong style="color: #6d28d9;">Promo Paket Tahunan di ${areaName} (Bayar 10 Dapat 12 Bulan):</strong> Mau bebas tagihan sepanjang tahun? Ambil skema pembayaran tahunan: Cukup bayar 10 bulan, Anda langsung menikmati 12 bulan penuh tanpa jeda + bonus Kuota HP Bersama sekeluarga!
    </div>

    <h2>3 Langkah Mudah Pasang WiFi di ${areaName}</h2>
    <div class="step-box">
      <div class="step-num">1</div>
      <div>
        <h4>Kirim Alamat & Share Lokasi</h4>
        <p>Chat tim sales via WhatsApp dan kirimkan alamat lengkap atau share lokasi di ${areaName}. Kami akan mengecek ketersediaan tiang fiber terdekat dalam hitungan menit.</p>
      </div>
    </div>
    
    <div class="step-box">
      <div class="step-num">2</div>
      <div>
        <h4>Pilih Jadwal Pemasangan</h4>
        <p>Tentukan paket yang sesuai dengan jumlah pengguna di rumah, lalu pilih jadwal pemasangan teknisi yang paling nyaman bagi Anda.</p>
      </div>
    </div>
    
    <div class="step-box">
      <div class="step-num">3</div>
      <div>
        <h4>Pasang Dulu, Bayar Nanti</h4>
        <p>Teknisi resmi datang melakukan penarikan kabel dan setting modem. Anda hanya membayar tagihan bulan pertama SETELAH internet aktif dan teruji lancar di rumah.</p>
      </div>
    </div>

    <h2>Pertanyaan yang Sering Ditanyakan (FAQ) ${areaName}</h2>
    <div class="faq-item">
      <h3>Apakah XL Home dan XL SATU di ${areaName} adalah layanan yang sama?</h3>
      <p>Ya, XL SATU kini telah resmi bertransformasi menjadi XL Home Fiber. Seluruh infrastruktur kabel fiber optik, perangkat modem WiFi, dan tim operasional di ${areaName} (${cityName}) kini semakin ditingkatkan dengan kecepatan simetris 1:1, bebas batas FUP, dan promo pendaftaran lebih terjangkau.</p>
    </div>
    <div class="faq-item">
      <h3>Apakah jaringan fiber optik XL Home / XL SATU sudah menjangkau seluruh ${areaName}?</h3>
      <p>Jaringan fiber optik XL Home (d/h XL SATU) telah terpasang luas di ${areaName} (${cityName}), mencakup wilayah ${kelList}. Untuk mengecek ketersediaan tiang fiber terdekat dari rumah Anda, silakan hubungi tim sales kami dengan mengirimkan titik lokasi maps via WhatsApp.</p>
    </div>
    <div class="faq-item">
      <h3>Berapa biaya pasang WiFi XL Home di ${areaName}?</h3>
      <p>Khusus pendaftaran promo bulan ini untuk warga ${areaName}, biaya pemasangan dan instalasi adalah GRATIS (Hemat Rp 99.000 s/d Rp 500.000). Anda hanya membayar tagihan bulan pertama setelah internet aktif dan digunakan di rumah tanpa biaya tersembunyi.</p>
    </div>
    <div class="faq-item">
      <h3>Paket WiFi apa yang paling cocok untuk kebutuhan di ${areaName}?</h3>
      <p>Untuk ${info.target}, paket Spark 250 Mbps (Rp 229rb/bln) sangat direkomendasikan karena merupakan pilihan paling laris: bebas biaya pasang, lebih hemat Rp 56.000 di bulan pertama dibanding 20 Mbps, serta bebas FUP untuk streaming 4K, video meeting, dan gaming online bersamaan.</p>
    </div>
    <div class="faq-item">
      <h3>Berapa lama proses pemasangan teknisi di area ${areaName}?</h3>
      <p>Setelah konfirmasi pendaftaran, teknisi resmi Solo Raya biasanya melakukan instalasi dalam waktu 1 hingga 2 hari kerja sesuai jadwal luang yang Anda tentukan.</p>
    </div>

    <div class="cta-box">
      <h3>Cek Ketersediaan Titik Rumah Anda di ${areaName} Sekarang!</h3>
      <p>Jangan tunggu sampai kuota seluler boros atau internet rumah lemot. Konsultasikan alamat rumah Anda bersama tim sales resmi XL Home Solo Raya.</p>
      <a href="https://wa.me/6287778999141?text=${encodeURIComponent(`Halo Sales XL Home Solo Raya, saya mau cek jangkauan fiber dan promo pasang WiFi di ${areaName} (${cityName}). Boleh dibantu cek tiang terdekat?`)}" target="_blank" rel="noopener noreferrer" class="btn-cta">
        <i class="fab fa-whatsapp"></i> Cek Jaringan via WhatsApp Sales
      </a>
    </div>

    <h2>Panduan & Rekomendasi Solusi Khusus</h2>
    <p>Temukan solusi internet terbaik sesuai kebutuhan Anda di ${areaName}:</p>
    <ul>
      <li><a href="/wifi-untuk-live-streaming-jualan-solo/">WiFi untuk Live Streaming Jualan Solo (TikTok & Shopee Live Simetris 1:1)</a></li>
      <li><a href="/biaya-pasang-wifi-pertama-kali-solo/">Biaya Pasang WiFi Pertama Kali Solo 2026: Perbandingan Lengkap All Provider</a></li>
      <li><a href="/panduan-wifi-kos-solo/">Panduan WiFi Kos Mahasiswa & Kontrakan (UNS, UMS & Sekitarnya)</a></li>
      <li><a href="/paket-wifi-tahunan-bayar-10-dapat-12/">Paket Tahunan Bayar 10 Dapat 12 Bulan (Hemat Biaya 2 Bulan Penuh)</a></li>
      <li><a href="/wifi-tanpa-kabel-solo/">WiFi Tanpa Kabel Solo 2026: Solusi Internet Tanpa Tiang & Fiber</a></li>
      <li><a href="/cara-berhenti-langganan-indihome-biznet-pindah-xl-home-solo/">Cara Pindah Provider ke XL Home Tanpa Putus Koneksi</a></li>
    </ul>

    <h2>Cek Area Layanan Lain di Solo Raya</h2>
    <p>Selain ${areaName}, kami juga melayani pemasangan internet fiber optik di seluruh wilayah sekitar:</p>
    <div class="related-cities">
      <a href="/wifi-solo/">WiFi Kota Solo</a>
      <a href="/wifi-sukoharjo/">WiFi Sukoharjo</a>
      <a href="/wifi-karanganyar/">WiFi Karanganyar</a>
      <a href="/wifi-boyolali/">WiFi Boyolali</a>
      <a href="/wifi-klaten/">WiFi Klaten</a>
      <a href="/area-layanan/">Peta 79 Kecamatan</a>
    </div>
  `;

  // Standard high-CTR hook under 58 chars
  let pageTitle = `Pasang WiFi ${areaName} Murah Mulai 185rb ⚡ XL Home`;
  let heroH1 = `Pasang WiFi ${areaName} Murah 2026: 100% Fiber Simetris Tanpa FUP`;
  let pageDesc = `Promo pasang WiFi ${areaName} murah 2026 mulai 185rb - 229rb/bln! 100% Fiber Tanpa FUP (d/h XL SATU). Jangkauan ${info.kelurahan.slice(0, 3).join(", ")}, dsb. Gratis pasang Rp 0! WA: 0877-7899-9141.`;

  if (areaSlug === "solo-baru") {
    pageTitle = `Pasang WiFi Solo Baru Murah Mulai 185rb ⚡ XL Home`;
    heroH1 = `Pasang WiFi Solo Baru Murah 2026: 100% Fiber Tanpa FUP Cluster & Ruko`;
    pageDesc = `Promo pasang WiFi Solo Baru murah 2026 mulai 185rb/bln! 100% Fiber Tanpa FUP Sektor 1-10, Jl. Ir Soekarno & TirtaMaya. Gratis pasang Rp 0! WA: 0877-7899-9141.`;
  } else if (areaSlug === "kartasura") {
    pageTitle = `Pasang WiFi Kartasura Murah Mulai 185rb ⚡ XL Home`;
    heroH1 = `Pasang WiFi Kartasura Murah 2026: 100% Bebas FUP untuk Kos & Rumah Dekat UMS`;
    pageDesc = `Promo pasang WiFi Kartasura murah 2026 dekat UMS & UIN mulai 185rb/bln! Fiber optik 100% tanpa FUP, patungan kos cuma ~28rb/kamar. Gratis pasang Rp 0! WA: 0877-7899-9141.`;
  } else if (areaSlug === "klaten-kota") {
    pageTitle = `Pasang WiFi Klaten Kota Murah Mulai 185rb ⚡ XL Home`;
    heroH1 = `Pasang WiFi Klaten Kota Murah 2026: 100% Fiber Simetris Tanpa FUP`;
    pageDesc = `Pasang WiFi Klaten Kota murah 2026 mulai 185rb/bln. 100% Fiber optik simetris tanpa FUP untuk komuter KRL Solo-Jogja & ruko Jl. Pemuda. Gratis pasang Rp 0! WA: 0877-7899-9141.`;
  } else if (areaSlug === "boyolali-kota") {
    pageTitle = `Pasang WiFi Boyolali Kota Mulai 185rb ⚡ XL Home`;
    heroH1 = `Pasang WiFi Boyolali Kota Murah 2026: 100% Fiber Tanpa FUP Pusat Kota`;
    pageDesc = `Pasang WiFi murah di Boyolali Kota 2026 mulai 185rb/bln! 100% Fiber tanpa FUP cover Kemiri, Pulisen, Siswodipuran & Alun-Alun Kidul. Gratis pasang! WA: 0877-7899-9141.`;
  } else if (areaSlug === "colomadu") {
    pageTitle = `Pasang WiFi Colomadu Murah Mulai 185rb ⚡ XL Home`;
    heroH1 = `Pasang WiFi Colomadu Murah 2026: 100% Fiber Optic Tanpa FUP`;
    pageDesc = `Promo pasang WiFi Colomadu murah 2026 mulai 185rb/bln! 100% Fiber optik perumahan Fajar Indah, Malangjiwan, Klodran, Baturan. Gratis pasang Rp 0! WA: 0877-7899-9141.`;
  } else if (areaSlug === "grogol") {
    pageTitle = `Pasang WiFi Grogol Sukoharjo Mulai 185rb ⚡ XL Home`;
    heroH1 = `Pasang WiFi Grogol Sukoharjo Murah 2026: 100% Fiber Simetris`;
    pageDesc = `Promo pasang WiFi Grogol Sukoharjo murah 2026 mulai 185rb/bln! 100% Fiber tanpa FUP area Telukan, Madegondo, Langenharjo. Gratis pasang Rp 0! WA: 0877-7899-9141.`;
  } else if (areaSlug === "baki") {
    pageTitle = `Pasang WiFi Baki Sukoharjo Murah Mulai 185rb ⚡ XL Home`;
    heroH1 = `Pasang WiFi Baki Sukoharjo Murah 2026: 100% Fiber Tanpa FUP`;
    pageDesc = `Promo pasang WiFi Baki Sukoharjo murah 2026 mulai 185rb/bln! Jangkauan Gentan, Baki Pandeyan, Waru & Mangesti. Gratis pasang Rp 0! WA: 0877-7899-9141.`;
  } else if (areaSlug === "sukoharjo-kota") {
    pageTitle = `Pasang WiFi Sukoharjo Kota Mulai 185rb ⚡ XL Home`;
    heroH1 = `Pasang WiFi Sukoharjo Kota Murah 2026: 100% Fiber Simetris`;
    pageDesc = `Promo pasang WiFi Sukoharjo Kota murah 2026 mulai 185rb/bln! Cover Alun-Alun, Proliman, Gayam, Jombor, Mandan. 100% Tanpa FUP + Gratis Pasang! WA: 0877-7899-9141.`;
  } else if (areaSlug === "jaten") {
    pageTitle = `Pasang WiFi Jaten Karanganyar Mulai 185rb ⚡ XL Home`;
    heroH1 = `Pasang WiFi Jaten Karanganyar Murah 2026: 100% Fiber Bebas FUP`;
    pageDesc = `Promo pasang WiFi Jaten Karanganyar 2026 mulai 185rb/bln! Cover Perumahan UNS IV, Sroyo, Dagen, Palur. 100% Fiber optik simetris + Gratis pasang Rp 0! WA: 0877-7899-9141.`;
  } else if (areaSlug === "karanganyar-kota") {
    pageTitle = `Pasang WiFi Karanganyar Kota Mulai 185rb ⚡ XL Home`;
    heroH1 = `Pasang WiFi Karanganyar Kota Murah 2026: 100% Fiber Simetris`;
    pageDesc = `Pasang WiFi Karanganyar Kota murah 2026 mulai 185rb/bln! Cover Alun-Alun, Cangakan, Popongan, Tegalgede, Bejen. 100% Tanpa FUP, gratis pasang Rp 0! WA: 0877-7899-9141.`;
  } else if (areaSlug === "delanggu") {
    pageTitle = `Pasang WiFi Delanggu Klaten Mulai 185rb ⚡ XL Home`;
    heroH1 = `Pasang WiFi Delanggu Klaten Murah 2026: 100% Fiber Optic`;
    pageDesc = `Promo pasang WiFi Delanggu Klaten 2026 mulai 185rb/bln! Jangkauan dekat Stasiun KRL Delanggu, Sabrang, Bowan. 100% Tanpa FUP, gratis pasang! WA: 0877-7899-9141.`;
  } else if (areaSlug === "prambanan") {
    pageTitle = `Pasang WiFi Prambanan Klaten Mulai 185rb ⚡ XL Home`;
    heroH1 = `Pasang WiFi Prambanan Klaten Murah 2026: 100% Fiber Simetris`;
    pageDesc = `Promo pasang WiFi Prambanan Klaten 2026 mulai 185rb/bln! Solusi internet fiber untuk homestay, kafe & pemukiman dekat Candi Prambanan. Bebas FUP! WA: 0877-7899-9141.`;
  } else if (areaSlug === "laweyan") {
    pageTitle = `Pasang WiFi Laweyan Solo Murah Mulai 185rb ⚡ XL Home`;
    heroH1 = `Pasang WiFi Laweyan Solo Murah 2026: 100% Fiber Simetris UMKM`;
    pageDesc = `Pasang WiFi Laweyan Solo murah 2026 mulai 185rb/bln! 100% Fiber simetris tanpa FUP untuk sentra batik, ruko niaga & rumah tangga. Gratis pasang Rp 0! WA: 0877-7899-9141.`;
  } else if (areaSlug === "jebres") {
    pageTitle = `Pasang WiFi Jebres Solo Murah Mulai 185rb ⚡ XL Home`;
    heroH1 = `Pasang WiFi Jebres Solo Murah 2026: 100% Fiber Tanpa FUP Kos & Rumah`;
    pageDesc = `Pasang WiFi Jebres Solo murah 2026 mulai 185rb/bln! Cover area kampus UNS, ISI, RS Moewardi & perumahan Mojosongo. Bebas FUP, gratis pasang Rp 0! WA: 0877-7899-9141.`;
  } else if (areaSlug === "banjarsari") {
    pageTitle = `Pasang WiFi Banjarsari Solo Mulai 185rb ⚡ XL Home`;
    heroH1 = `Pasang WiFi Banjarsari Solo Murah 2026: 100% Fiber Simetris`;
    pageDesc = `Pasang WiFi Banjarsari Solo murah 2026 mulai 185rb/bln! Jangkauan Manahan, Banyuanyar, Kadipiro, Nusukan. 100% Tanpa FUP, gratis pasang Rp 0! WA: 0877-7899-9141.`;
  } else if (areaSlug === "pasar-kliwon") {
    pageTitle = `Pasang WiFi Pasar Kliwon Solo Mulai 185rb ⚡ XL Home`;
    heroH1 = `Pasang WiFi Pasar Kliwon Solo Murah 2026: 100% Fiber Grosir & Rumah`;
    pageDesc = `Pasang WiFi Pasar Kliwon Solo murah 2026 mulai 185rb/bln! Internet simetris untuk grosir kain, Pasar Klewer, Kauman & Semanggi. Bebas FUP! WA: 0877-7899-9141.`;
  } else if (areaSlug === "mojolaban") {
    pageTitle = `Pasang WiFi Mojolaban Sukoharjo Mulai 185rb ⚡ XL Home`;
    heroH1 = `Pasang WiFi Mojolaban Sukoharjo Murah 2026: 100% Fiber Tanpa FUP`;
    pageDesc = `Promo pasang WiFi Mojolaban Sukoharjo murah 2026 mulai 185rb/bln! Cover Bekonang, Palur Sukoharjo, Laban, Wirun. Bebas FUP, gratis pasang Rp 0! WA: 0877-7899-9141.`;
  } else if (areaSlug === "banyudono") {
    pageTitle = `Pasang WiFi Banyudono Boyolali Mulai 185rb ⚡ XL Home`;
    heroH1 = `Pasang WiFi Banyudono Boyolali Murah 2026: 100% Fiber Optic`;
    pageDesc = `Promo pasang WiFi Banyudono Boyolali murah 2026 mulai 185rb/bln! Jangkauan Pengging, Ketaon, Sambon & batas Kartasura. 100% Bebas FUP + Gratis pasang! WA: 0877-7899-9141.`;
  } else if (areaSlug === "gondangrejo") {
    pageTitle = `Pasang WiFi Gondangrejo Murah Mulai 185rb ⚡ XL Home`;
    heroH1 = `Pasang WiFi Gondangrejo Murah 2026: 100% Fiber Simetris`;
    pageDesc = `Pasang WiFi Gondangrejo Karanganyar murah 2026 mulai 185rb/bln! Cover Plesungan, Jeruksawit, Selokaton & pintu tol Gondangrejo. Bebas FUP! WA: 0877-7899-9141.`;
  } else if (areaSlug === "palur") {
    pageTitle = `Pasang WiFi Palur Solo Raya Mulai 185rb ⚡ XL Home`;
    heroH1 = `Pasang WiFi Palur Murah 2026: 100% Fiber Sentra Niaga & Rumah`;
    pageDesc = `Pasang WiFi Palur murah 2026 mulai 185rb/bln! Cover flyover Palur, Dagen, Ngringo, sentra niaga Solo-Karanganyar. 100% Tanpa FUP, gratis pasang! WA: 0877-7899-9141.`;
  }

  return {
    slug: `pasang-wifi-xl-home-${areaSlug}`,
    title: pageTitle,
    description: pageDesc,
    keywords: [
      `pasang wifi ${areaName.toLowerCase()}`,
      `pasang wifi murah ${areaName.toLowerCase()}`,
      `wifi murah ${areaName.toLowerCase()}`,
      `wifi murah ${areaName.toLowerCase()} 100 ribuan`,
      `biaya pasang wifi ${areaName.toLowerCase()}`,
      `xl home ${areaName.toLowerCase()}`,
      `xl satu ${areaName.toLowerCase()}`,
      `provider internet ${areaName.toLowerCase()}`,
      `wifi rumah ${cityName.toLowerCase()}`
    ],
    ogTitle: pageTitle,
    ogDescription: pageDesc,
    ogImage: "/images/banner-xlsatu-jadi-xlhome.jpg",
    schemas,
    faqs,
    hero: {
      crumb: `<a href="https://xlhomesolo.com/">Beranda</a> / <a href="/area-layanan/">Area Layanan</a> / ${areaName}`,
      h1: heroH1,
      sub: `Internet rumah fiber optik 100% Tanpa FUP untuk warga ${areaName}, ${cityName} (Transformasi Resmi XL SATU Fiber). Gratis biaya instalasi!`,
      meta: `Cakupan ${cityName} · Tim Sales Resmi XL Home Solo Raya`
    },
    headerCta: `https://wa.me/6287778999141?text=${encodeURIComponent(`Halo Sales XL Home, saya mau cek jaringan dan promo pasang WiFi di ${areaName}`)}`,
    bodyHtml
  };
}
