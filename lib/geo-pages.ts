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
    "landmarks": "The Park Mall Solo Baru, Pakuwon Mall Solo Baru, RS Indriati, Favehotel Solo Baru, dan Menara Pandawa",
    "housing": [
      "Sektor 1 s/d Sektor 10 Solo Baru",
      "Tirtamaya Residence",
      "Griya Langenharjo",
      "Puri Gedangan Mandiri"
    ],
    "character": "kawasan kota satelit mandiri paling modern dan prestisius di Solo Raya dengan fasilitas pusat perbelanjaan, bisnis perbankan, dan cluster perumahan elit",
    "target": "penghuni cluster modern, kantor perbankan, restoran, dan keluarga eksekutif"
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
    "landmarks": "Kampus Universitas Muhammadiyah Surakarta (UMS), UIN Raden Mas Said, RS PKU Muhammadiyah Kartasura, dan simpang tiga Jogja-Semarang",
    "housing": [
      "Puri Pabelan Indah",
      "Griya Gonilan Asri",
      "Pesona Singopuran",
      "Grand Makamhaji"
    ],
    "character": "simpul aglomerasi barat yang luar biasa sibuk, menjadi titik temu jalur Solo-Jogja-Semarang dengan ribuan anak kos dan pusat kuliner bebek legendaris",
    "target": "mahasiswa, pemilik kos/kontrakan, pebisnis kuliner, dan keluarga perumahan"
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
    "landmarks": "Kawasan Industri Telukan, jembatan Bacem, koridor Jl. Raya Solo-Wonogiri, dan pusat komersial Sukoharjo utara",
    "housing": [
      "Puri Grogol Asri",
      "Griya Sanggrahan Permai",
      "Bumi Telukan Damai",
      "Graha Parangjoro"
    ],
    "character": "wilayah transisi dinamis antara kawasan bisnis perkotaan dan sentra industri manufaktur, dengan ribuan pekerja dan keluarga muda",
    "target": "karyawan pabrik, keluarga muda di perumahan baru, dan pertokoan lokal"
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
      "Graha Siswodipuran"
    ],
    "character": "pusat administratif Kota Susu dengan konsep smart city perkantoran terpadu, udara pegunungan Merbabu yang segar, dan fasilitas infrastruktur modern",
    "target": "pegawai instansi daerah, wirausaha peternakan/kuliner susu, dan keluarga perkotaan Boyolali"
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
    "landmarks": "Alun-Alun Klaten, Masjid Agung Al-Aqsha Klaten, Stasiun Klaten (KRL & Kereta Jarak Jauh), dan kawasan pertokoan Jl. Pemuda",
    "housing": [
      "Griya Gayamprit Indah",
      "Puri Gergunung Permai",
      "Graha Mojayan Asri",
      "Grand Buntalan Regency"
    ],
    "character": "jantung ekonomi dan pemerintahan Kabupaten Klaten yang sangat strategis persis di tengah-tengah koridor emas Solo-Yogyakarta",
    "target": "warga komuter KRL Solo-Jogja, pebisnis pertokoan, dokter/ASN, dan keluarga perkotaan Klaten"
  }
};

export function getGeoArticle(slug: string) {
  if (!slug.startsWith("pasang-wifi-xl-satu-")) return null;
  
  const areaSlug = slug.replace("pasang-wifi-xl-satu-", "");
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
      "url": `https://xlhomesolo.com/pasang-wifi-xl-satu-${areaSlug}/`
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": `Pasang WiFi Murah di ${areaName} (${cityName}) | XL Home (d/h XL SATU Fiber)`,
      "description": `Panduan pasang WiFi rumah XL Home Fiber (transformasi resmi XL SATU) di ${areaName}, ${cityName}. Bebas batas FUP, gratis biaya pasang, dan paket bundling kuota.`,
      "author": { "@type": "Organization", "name": "XL Home Solo Raya" },
      "publisher": { "@type": "Organization", "name": "XL Home Solo Raya" },
      "datePublished": "2026-08-15",
      "dateModified": "2026-10-12",
      "mainEntityOfPage": `https://xlhomesolo.com/pasang-wifi-xl-satu-${areaSlug}/`
    }
  ];

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

    <h2>Mengapa Warga ${areaName} Memilih XL Home Fiber?</h2>
    <p>Berbeda dengan provider konvensional yang sering menerapkan pembatasan kecepatan diam-diam, XL Home Fiber (evolusi resmi XL SATU) memberikan kepastian koneksi berkualitas tinggi:</p>

    <div class="compare-grid">
      <div class="compare-card">
        <h4 style="color: #dc2626;"><i class="fas fa-times-circle"></i> Provider Lain</h4>
        <ul>
          <li>Ada batas FUP (kecepatan anjlok drastis di akhir bulan).</li>
          <li>Dikenakan biaya pasang tambahan (Rp 100rb - 150rb).</li>
          <li>Koneksi hanya bisa dinikmati di dalam rumah.</li>
          <li>Pelayanan komplain dialihkan ke robot CS pusat.</li>
        </ul>
      </div>
      <div class="compare-card">
        <h4 style="color: #16a34a;"><i class="fas fa-check-circle"></i> XL Home Fiber (d/h XL SATU)</h4>
        <ul>
          <li><strong>100% Tanpa FUP</strong> — bebas kuota, kecepatan stabil dari tanggal 1 sampai 30.</li>
          <li><strong>Upgrade Jaringan Fiber Simetris</strong> — download & upload setara berteknologi mutakhir.</li>
          <li><strong>GRATIS Biaya Pasang</strong> untuk pendaftaran promo bulan ini.</li>
          <li><strong>Bonus Kuota HP Bersama</strong> untuk dipakai keluarga di luar rumah.</li>
          <li><strong>Tim Sales & Support Lokal Solo Raya</strong> yang siap melayani konsultasi cepat via WhatsApp.</li>
        </ul>
      </div>
    </div>

    <h2>Paket Rekomendasi untuk ${info.target}</h2>
    <table class="speed-table">
      <tr><th>Pilihan Paket</th><th>Kecepatan</th><th>Biaya Bulanan</th><th>Peruntukan Terbaik</th></tr>
      <tr><td><strong>Paket Value</strong></td><td>100 Mbps (Promo 200 Mbps)</td><td>Rp 219.000/bln</td><td>1-4 HP, browsing harian & streaming keluarga</td></tr>
      <tr style="background: #e6f7f3;"><td><strong>Paket Spark (Terlaris)</strong></td><td>250 Mbps Booster</td><td>Rp 229.000/bln</td><td>5-10 perangkat, gaming online, video call & WFH lancar</td></tr>
      <tr><td><strong>Paket Prime</strong></td><td>400 Mbps Booster</td><td>Rp 299.000/bln</td><td>Keluarga besar, rumah bertingkat, kos-kosan & kantor UMKM</td></tr>
    </table>

    <h2>3 Langkah Mudah Pasang WiFi di ${areaName}</h2>
    <div class="step-box">
      <div class="step-num">1</div>
      <div>
        <h4>Kirim Alamat & Share Lokasi</h4>
        <p>Chat tim sales via WhatsApp dan kirimkan alamat lengkap di ${areaName}. Kami akan mengecek ketersediaan tiang fiber terdekat dalam hitungan menit.</p>
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
      <p>Khusus pendaftaran promo bulan ini untuk warga ${areaName}, biaya pemasangan dan instalasi adalah GRATIS (Hemat Rp 99.000). Anda hanya membayar tagihan bulan pertama setelah internet aktif dan digunakan di rumah.</p>
    </div>
    <div class="faq-item">
      <h3>Paket WiFi apa yang paling cocok untuk kebutuhan di ${areaName}?</h3>
      <p>Untuk ${info.target}, paket Spark 250 Mbps (Rp 229rb/bln) atau Value 100-200 Mbps sangat ideal karena bebas FUP, stabil untuk streaming 4K, video meeting, belajar daring, dan pemakaian banyak perangkat sekaligus.</p>
    </div>
    <div class="faq-item">
      <h3>Berapa lama proses pemasangan teknisi di area ${areaName}?</h3>
      <p>Setelah konfirmasi pendaftaran, teknisi resmi Solo Raya biasanya melakukan instalasi dalam waktu 1 hingga 2 hari kerja sesuai jadwal luang yang Anda tentukan.</p>
    </div>

    <div class="cta-box">
      <h3>Cek Ketersediaan Titik Rumah Anda di ${areaName} Sekarang!</h3>
      <p>Jangan tunggu sampai kuota seluler boros atau internet rumah lemot. Konsultasikan alamat rumah Anda bersama tim sales resmi XL Home Solo Raya.</p>
      <a href="https://wa.me/6287778999141?text=Halo%20kak,%20saya%20mau%20cek%20jaringan%20XL%20Home%20(XL%20SATU)%20di%20${areaName}" target="_blank" rel="noopener noreferrer" class="btn-cta">
        <i class="fab fa-whatsapp"></i> Cek Jaringan via WhatsApp Sales
      </a>
    </div>

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

  return {
    slug,
    title: `Pasang WiFi Murah di ${areaName} (${cityName}) | XL Home (d/h XL SATU Fiber)`,
    description: `Layanan pasang WiFi rumah XL Home Fiber (transformasi resmi XL SATU) di ${areaName}, ${cityName}. Jangkauan ${info.kelurahan.slice(0, 4).join(", ")}, dsb. 100% Tanpa FUP, gratis biaya pasang!`,
    keywords: [
      `pasang wifi ${areaName.toLowerCase()}`,
      `wifi murah ${areaName.toLowerCase()}`,
      `xl home ${areaName.toLowerCase()}`,
      `xl satu ${areaName.toLowerCase()}`,
      `provider internet ${areaName.toLowerCase()}`,
      `wifi rumah ${cityName.toLowerCase()}`
    ],
    ogTitle: `Pasang WiFi XL Home Fiber di ${areaName} (${cityName}) (d/h XL SATU)`,
    ogDescription: `Internet fiber 100% Unlimited tanpa FUP di ${areaName}. Transformasi resmi XL SATU ke XL Home. Gratis biaya instalasi!`,
    ogImage: "/images/banner-xlsatu-jadi-xlhome.jpg",
    schemas,
    faqs,
    hero: {
      crumb: `<a href="https://xlhomesolo.com/">Beranda</a> / <a href="/area-layanan/">Area Layanan</a> / ${areaName}`,
      h1: `Pasang WiFi XL Home Fiber di ${areaName}`,
      sub: `Internet rumah fiber optik 100% Tanpa FUP untuk warga ${areaName}, ${cityName} (Transformasi Resmi XL SATU Fiber). Gratis biaya instalasi!`,
      meta: `Cakupan ${cityName} · Tim Sales Resmi XL Home Solo Raya`
    },
    headerCta: `https://wa.me/6287778999141?text=Halo%20kak,%20saya%20mau%20cek%20jaringan%20XL%20Home%20(XL%20SATU)%20di%20${areaName}`,
    bodyHtml
  };
}
