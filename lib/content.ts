export type District = {
  name: string;
  role: "Çekim" | "Deneyim" | "Bağlantı ve konaklama";
  theme: string;
  description: string;
  tags: string[];
  source: string;
};

const districtSource = (slug: string) => `https://eskisehir.ktb.gov.tr/TR-149${slug}`;

export const districts: District[] = [
  { name: "Alpu", role: "Deneyim", theme: "Savat, lületaşı ve ova üretimi", description: "Savat işçiliği, lületaşı kaynakları, tarımsal üretim ve Uyuzhamam çevresini doğrulanmış randevulu deneyimlerle görünür kılan ilçe.", tags: ["savat", "lületaşı", "ova", "Uyuzhamam"], source: districtSource("980/alpu.html") },
  { name: "Beylikova", role: "Deneyim", theme: "Porsuk, süt üretimi ve kırsal hafıza", description: "Porsuk kıyısı, tarım-hayvancılık ve tarihî at yetiştiriciliği birikimini üretici buluşmalarıyla rota ekonomisine bağlayan sakin durak.", tags: ["Porsuk", "süt", "tarım", "atçılık hafızası"], source: districtSource("981/beylikova.html") },
  { name: "Çifteler", role: "Çekim", theme: "Sakaryabaşı ve su kültürü", description: "Sakarya Nehri'nin doğduğu Sakaryabaşı'nı mevcut rekreasyon, yeme-içme ve doğa deneyimleriyle tam günlük rotaya dönüştüren ana çekim noktası.", tags: ["Sakaryabaşı", "su", "doğa", "rekreasyon"], source: districtSource("982/cifteler.html") },
  { name: "Günyüzü", role: "Deneyim", theme: "Kök boyalı kilim ve Frig izleri", description: "Kilim dokuma geleneği bulunan köyleri, kırsal peyzajı ve Frig kaya kalıntılarını randevulu atölye ve rehberli keşifle birleştiren rota halkası.", tags: ["kilim", "kök boya", "Frigya", "kırsal"], source: districtSource("983/gunyuzu.html") },
  { name: "Han", role: "Çekim", theme: "Yazılıkaya, Midas Şehri ve Frig yolları", description: "Yazılıkaya/Midas Anıtı çevresindeki Frig, Roma ve Bizans katmanlarını resmî yürüyüş parkurları, alan anlatısı ve koruma odaklı ziyaret yönetimiyle ele alan merkez.", tags: ["Yazılıkaya", "Midas", "Frigya", "yürüyüş"], source: districtSource("984/han.html") },
  { name: "İnönü", role: "Çekim", theme: "Doğal inler ve tarih koridoru", description: "İlçeye adını veren doğal inler ile tarihî katmanları; erişim ve ziyaret koşulları önceden doğrulanarak anlatan batı kapısı.", tags: ["inler", "tarih", "jeoloji", "batı koridoru"], source: districtSource("985/inonu.html") },
  { name: "Mahmudiye", role: "Deneyim", theme: "Çiftlik-i Hümayun ve at kültürü", description: "1815'e uzanan Çiftlik-i Hümayun hafızasını, Anadolu Tarım İşletmesi ve at yetiştiriciliği kültürünü önceden teyitli ziyaretlerle görünür kılan ilçe.", tags: ["at kültürü", "Çiftlik-i Hümayun", "kırsal miras"], source: districtSource("986/mahmudiye.html") },
  { name: "Mihalgazi", role: "Deneyim", theme: "Sakarılıca, mikroklima ve üretici", description: "Sakarya Vadisi'nin mikroklimasını, sera ve bahçe üretimini, Sakarılıca termal kaynaklarıyla ilişkilendiren üretici odaklı deneyim hattı.", tags: ["Sakarılıca", "mikroklima", "sera", "üretici"], source: districtSource("987/mihalgazi.html") },
  { name: "Mihalıççık", role: "Çekim", theme: "Yunus Emre, Sorkun ve Gürleyik", description: "Yunus Emre'nin düşünce mirasını Sorkun çömlekçiliği ve Gürleyik doğasıyla bağlayan; inanç, zanaat ve ekoturizmi aynı koridorda buluşturan ilçe.", tags: ["Yunus Emre", "Sorkun", "çömlek", "Gürleyik"], source: districtSource("988/mihaliccik.html") },
  { name: "Odunpazarı", role: "Bağlantı ve konaklama", theme: "Tarihî kent, müzeler ve lületaşı", description: "Tarihî doku, Kurşunlu Külliyesi, müzeler, lületaşı zanaatı ve konaklama kapasitesiyle ilçelere açılan ilk gece ve kent anlatısı.", tags: ["tarihî kent", "Kurşunlu", "müzeler", "lületaşı"], source: districtSource("989/odunpazari.html") },
  { name: "Sarıcakaya", role: "Deneyim", theme: "Sakarya Vadisi, Laçin ve bahçe üretimi", description: "Mikroklima ürünlerini, seracılığı, Laçin çevresinin peyzajını ve yerel sofrayı mevsime uygun üretici rotasına dönüştüren vadi ilçesi.", tags: ["Sakarya Vadisi", "Laçin", "meyve", "sera"], source: districtSource("990/saricakaya.html") },
  { name: "Seyitgazi", role: "Çekim", theme: "Seyyid Battal Gazi ve Nakoleia", description: "Seyyid Battal Gazi Külliyesi'ni antik Nakoleia, Frig kaya mirası ve inanç yollarıyla bağlayan çok katmanlı kültür koridoru.", tags: ["Seyyid Battal Gazi", "Nakoleia", "inanç", "Frigya"], source: districtSource("991/seyitgazi.html") },
  { name: "Sivrihisar", role: "Çekim", theme: "UNESCO Ulu Cami, Pessinus ve Nasreddin Hoca", description: "UNESCO Dünya Mirası bileşeni Ulu Cami, tarihî sokaklar, Pessinus ve Nasreddin Hoca anlatısını coğrafi işaretli lezzet ve zanaatlarla tamamlayan doğu kapısı.", tags: ["UNESCO", "Ulu Cami", "Pessinus", "Nasreddin Hoca"], source: districtSource("992/sivrihisar.html") },
  { name: "Tepebaşı", role: "Bağlantı ve konaklama", theme: "Porsuk, çağdaş şehir ve Devrim", description: "Ulaşım, konaklama, Porsuk kıyısı, çağdaş kültür ve TÜRASAŞ Devrim otomobili hafızasıyla ilçe rotalarının kent içi bağlantısını kurar.", tags: ["Porsuk", "çağdaş kültür", "Devrim", "konaklama"], source: districtSource("993/tepebasi.html") },
];

export const projectCards = [
  { id: "karsilama", title: "Turist Karşılama Noktaları", kicker: "Planlanan hizmet", summary: "Doğrulanmış bilgi, yerel danışmanlık ve kişiselleştirilmiş rota sunacak fiziksel-dijital hizmet ağı." },
  { id: "akilli-rota", title: "Yapay Zekâ Destekli Rota", kicker: "Geliştirme programı", summary: "Süre, ilgi, hareket kabiliyeti ve ulaşım tercihine göre 14 ilçe içinden açıklanabilir rota üretmesi planlanan sistem." },
  { id: "kamp-karavan", title: "Kamp ve Karavan Alanları", kicker: "Planlanan altyapı", summary: "Koruma ve taşıma kapasitesi gözetilerek su, atık, güvenlik, erişim ve yönlendirme standardı oluşturacak alan ağı." },
  { id: "film-festivali", title: "Eskişehir Gençlik Film Festivali", kicker: "Planlanan kültür programı", summary: "30 yaş altı sinemacıları kısa kurmaca ve belgeselle buluşturup gösterimleri ilçelere taşıması planlanan dört günlük festival." },
  { id: "film-akademisi", title: "Film Akademisi", kicker: "Planlanan eğitim programı", summary: "Senaryo, görüntü, kurgu, ses ve uygulamalı kısa film üretiminden oluşması planlanan ücretsiz 12 aylık gençlik programı." },
  { id: "motokros", title: "Frigya Motokros ve Spor Turizmi Merkezi", kicker: "Planlanan spor programı", summary: "Korunan alanların dışında; şampiyona, eğitim, kamp ve yıl boyu sporcu hareketini hedefleyen merkez." },
];

export type InterestKey = "heritage" | "nature" | "craft" | "taste" | "faith" | "city" | "rural";
export type MobilityKey = "car" | "public" | "easy";

export type RouteStop = {
  id: string;
  name: string;
  district: string;
  description: string;
  duration: string;
  access: string;
  interests: InterestKey[];
  officialUrl?: string;
  stayHook: string;
  status: "existing";
};

export const routeStops: Record<string, RouteStop> = {
  odunpazari: { id: "odunpazari", name: "Tarihî Odunpazarı", district: "Odunpazarı", description: "Tarihî sokak, konak, müze ve kent mutfağıyla Eskişehir anlatısına giriş.", duration: "2–3 saat", access: "Müze saatlerini ayrı ayrı doğrulayın", interests: ["heritage", "city", "taste"], officialUrl: "https://eskisehir.ktb.gov.tr/TR-149989/odunpazari.html", stayHook: "Akşam Porsuk ve kent merkezi programıyla ilk geceyi güçlendirir.", status: "existing" },
  kursunlu: { id: "kursunlu", name: "Kurşunlu ve Lületaşı Atölyeleri", district: "Odunpazarı", description: "Külliye çevresi, geleneksel el sanatları ve Eskişehir lületaşının yaşayan üretim hikâyesi.", duration: "1,5–2 saat", access: "Atölye çalışmaları için önceden teyit önerilir", interests: ["craft", "heritage", "city"], stayHook: "Zanaat alışverişini üreticiyle doğrudan temasa dönüştürür.", status: "existing" },
  porsuk: { id: "porsuk", name: "Porsuk Kültür Koridoru", district: "Tepebaşı", description: "Nehir kıyısı, kent yaşamı, kültür mekânları ve akşam yemeğiyle merkez deneyimi.", duration: "2–3 saat", access: "Yıl boyu; etkinlik takvimini kontrol edin", interests: ["city", "taste"], stayHook: "Akşam programı günübirlik ziyareti gecelemeye bağlar.", status: "existing" },
  devrim: { id: "devrim", name: "TÜRASAŞ Devrim Otomobili", district: "Tepebaşı", description: "Türkiye'nin sanayi ve tasarım hafızasında yer etmiş Devrim otomobilinin hikâyesi.", duration: "1 saat", access: "Giriş ve ziyaret saatlerini kurumdan doğrulayın", interests: ["city", "heritage"], stayHook: "Kent kültürü rotasını bilim, sanayi ve tasarım temasıyla derinleştirir.", status: "existing" },
  battalgazi: { id: "battalgazi", name: "Seyyid Battal Gazi Külliyesi", district: "Seyitgazi", description: "İnanç, mimari ve Anadolu hafızasını birlikte taşıyan Seyitgazi'nin ana çekim noktası.", duration: "1,5–2 saat", access: "İbadet ve ziyaret düzenine saygı gösterin", interests: ["faith", "heritage"], officialUrl: "https://eskisehir.ktb.gov.tr/TR-336884/seyyid-battal-gazi-kulliyesi-ve-turbesi-seyitgazi.html", stayHook: "Yazılıkaya bağlantısıyla tek durağı tam günlük koridora dönüştürür.", status: "existing" },
  gerdekkaya: { id: "gerdekkaya", name: "Gerdekkaya ve Doğanlı Vadi", district: "Seyitgazi", description: "Frig kaya coğrafyasını kırsal peyzaj içinde okumaya imkân veren arkeolojik çevre.", duration: "1,5 saat", access: "Arazi ve hava koşullarını teyit edin; rehber önerilir", interests: ["heritage", "nature"], stayHook: "Frig rotasına manzara ve yürüyüş katmanı ekler.", status: "existing" },
  yazilikaya: { id: "yazilikaya", name: "Yazılıkaya / Midas Anıtı", district: "Han", description: "Frigya'nın kaya mimarisini ve Ana Tanrıça kültünü simgeleyen anıtsal cephe ve Midas Şehri çevresi.", duration: "2–3 saat", access: "Açık alan; hava, zemin ve resmî duyuruları kontrol edin", interests: ["heritage", "nature"], officialUrl: "https://eskisehir.ktb.gov.tr/TR-364149/yazilikaya-midas-aniti.html", stayHook: "Rehberli anlatı ve yürüyüşle Han'da geçirilen süreyi uzatır.", status: "existing" },
  frigwalk: { id: "frigwalk", name: "Yazılıkaya–Kümbet Frig Yürüyüşü", district: "Han / Seyitgazi", description: "Resmî parkur listesinde yaklaşık 14 km olarak belirtilen kültür ve doğa yürüyüşü.", duration: "4–6 saat", access: "Parkur durumu, hava ve rehberlik mutlaka doğrulanmalı", interests: ["heritage", "nature"], officialUrl: "https://eskisehir.ktb.gov.tr/TR-158729/frig-vadilerinde-yuruyus-rotalari.html", stayHook: "Yürüyüş öncesi veya sonrası konaklama için güçlü ikinci gün gerekçesi üretir.", status: "existing" },
  ulucami: { id: "ulucami", name: "Sivrihisar Ulu Cami", district: "Sivrihisar", description: "Ortaçağ Anadolu'sunun ahşap direkli camileri seri mirasının UNESCO bileşeni.", duration: "1–1,5 saat", access: "İbadet saatlerini gözetin; uygun kıyafet gerekir", interests: ["faith", "heritage"], officialUrl: "https://whc.unesco.org/en/list/1694/", stayHook: "Tarihî merkez ve yerel sofra ile yarım günü tam güne taşır.", status: "existing" },
  sivrihisar: { id: "sivrihisar", name: "Sivrihisar Tarihî Merkezi", district: "Sivrihisar", description: "Tarihî sokaklar, konaklar, saat kulesi çevresi ve zengin yerel zanaat belleği.", duration: "2 saat", access: "Yokuşlu bölümler için hareket planı yapın", interests: ["heritage", "craft", "taste"], officialUrl: "https://eskisehir.ktb.gov.tr/TR-149992/sivrihisar.html", stayHook: "Coğrafi işaretli lezzet ve zanaat alışverişini rota harcamasına bağlar.", status: "existing" },
  pessinus: { id: "pessinus", name: "Pessinus Antik Kenti", district: "Sivrihisar", description: "Ballıhisar'da Frigya ve Roma dönemlerinin dinsel ve ticari katmanlarını taşıyan arkeolojik alan.", duration: "1,5–2 saat", access: "Kazı/ziyaret koşullarını ve saatleri önceden doğrulayın", interests: ["heritage", "nature"], stayHook: "Sivrihisar'ı tek merkezden antik çevre rotasına genişletir.", status: "existing" },
  nasreddin: { id: "nasreddin", name: "Nasreddin Hoca / Hortu", district: "Sivrihisar", description: "Anadolu mizah ve sözlü kültürünün güçlü simgesine bağlanan kırsal anlatı durağı.", duration: "1 saat", access: "Mekânların açık olduğu saatleri doğrulayın", interests: ["heritage", "rural"], stayHook: "Aile ve kültür ziyaretçisine farklı bir hikâye katmanı sunar.", status: "existing" },
  sakaryabasi: { id: "sakaryabasi", name: "Sakaryabaşı", district: "Çifteler", description: "Sakarya Nehri'nin kaynak bölgesinde berrak su gözeleri ve mevcut rekreasyon deneyimi.", duration: "2–3 saat", access: "Mevsim, su etkinliği ve işletme koşullarını kontrol edin", interests: ["nature", "taste"], officialUrl: "https://eskisehir.ktb.gov.tr/TR-364152/cifteler-sakaryabasi.html", stayHook: "Vadi ve üretici duraklarıyla ikinci güne bağlanabilecek su temalı çekim noktasıdır.", status: "existing" },
  sakarilica: { id: "sakarilica", name: "Sakarılıca Termal Kaynakları", district: "Mihalgazi", description: "Sakarya Vadisi'nin doğa, termal ve mikroklima anlatısını buluşturan mevcut kaynak alanı.", duration: "2 saat", access: "Tesis ve kullanım koşullarını işletmeden doğrulayın", interests: ["nature"], officialUrl: "https://eskisehir.ktb.gov.tr/TR-149987/mihalgazi.html", stayHook: "Dinlenme temasıyla vadi rotasını yavaşlatır ve geceleme olasılığını artırır.", status: "existing" },
  saricakaya: { id: "saricakaya", name: "Sakarya Vadisi Üretici Rotası", district: "Sarıcakaya", description: "Mikroklima tarımı, sera ve mevsimlik ürünleri yerel üreticiyle buluşturan teyitli ziyaret kurgusu.", duration: "2 saat", access: "Üretici ve mevsim uygunluğu için önceden teyit gerekir", interests: ["taste", "rural", "nature"], officialUrl: "https://eskisehir.ktb.gov.tr/TR-149990/saricakaya.html", stayHook: "Yeme-içme harcamasını doğrudan kırsal üretime bağlar.", status: "existing" },
  lacin: { id: "lacin", name: "Laçin Peyzaj Durağı", district: "Sarıcakaya", description: "Vadi jeomorfolojisi ve mikroklimayı manzara üzerinden okuyan kısa doğa durağı.", duration: "1 saat", access: "Yol, hava ve güvenli seyir noktasını yerelde teyit edin", interests: ["nature", "rural"], stayHook: "Üretici rotasına görsel ve açık hava molası ekler.", status: "existing" },
  yunus: { id: "yunus", name: "Yunus Emre Külliyesi ve Türbesi", district: "Mihalıççık", description: "Yunus Emre'nin evrensel sevgi ve insanlık düşüncesini yaşatan inanç ve edebiyat durağı.", duration: "1–1,5 saat", access: "Ziyaret düzenine ve sessizliğe özen gösterin", interests: ["faith", "heritage"], officialUrl: "https://eskisehir.ktb.gov.tr/TR-364523/yunus-emre-kulliyesi-ve-turbesi.html", stayHook: "Sorkun ve Gürleyik bağlantısıyla tematik bir tam gün oluşturur.", status: "existing" },
  sorkun: { id: "sorkun", name: "Sorkun Çömlekçiliği", district: "Mihalıççık", description: "Coğrafi işaretli Sorkun çömleğinin üretim bilgisini yerinde ve üretici odaklı anlatan zanaat deneyimi.", duration: "1,5 saat", access: "Atölye ziyareti ve ürün bulunurluğu için önceden teyit gerekir", interests: ["craft", "rural"], officialUrl: "https://ci.turkpatent.gov.tr/cografi-isaretler/detay/1811", stayHook: "Satın almayı kültürel öğrenme ve üretici gelirine dönüştürür.", status: "existing" },
  gurleyik: { id: "gurleyik", name: "Gürleyik Doğa Durağı", district: "Mihalıççık", description: "Su, yeşil doku ve kırsal peyzajıyla doğa rotalarının mevsimsel tamamlayıcısı.", duration: "2 saat", access: "Mevsim, yol ve alan koşullarını yerel kaynaklardan doğrulayın", interests: ["nature", "rural"], stayHook: "Yunus Emre ve Sorkun hattına yavaş turizm katmanı ekler.", status: "existing" },
  inonu: { id: "inonu", name: "İnönü İnleri ve Tarih Çevresi", district: "İnönü", description: "Doğal kaya oluşumlarıyla tarih koridorunu bir arada okutan batı yönlü keşif.", duration: "1,5–2 saat", access: "Giriş, zemin ve güvenlik koşullarını yerelde doğrulayın", interests: ["nature", "heritage"], officialUrl: "https://eskisehir.ktb.gov.tr/TR-149985/inonu.html", stayHook: "Kent rotasını batı ilçelerine genişleten yarım günlük bağ kurar.", status: "existing" },
  alpu: { id: "alpu", name: "Alpu Savat ve Lületaşı Hafızası", district: "Alpu", description: "Savat işçiliği ve lületaşı çevresindeki üretim bilgisini usta/atölye teyidiyle anlatan kırsal zanaat durağı.", duration: "1,5 saat", access: "Usta ve atölye ziyareti randevu ile planlanmalı", interests: ["craft", "rural"], officialUrl: "https://eskisehir.ktb.gov.tr/TR-149980/alpu.html", stayHook: "Merkezdeki lületaşı anlatısını kaynak ve üretim coğrafyasına taşır.", status: "existing" },
  gunyuzu: { id: "gunyuzu", name: "Günyüzü Kilim Köyleri", district: "Günyüzü", description: "Kök boya ve dokuma belleğini taşıyan köylerde yerel üreticiyle kurulacak teyitli temas.", duration: "2 saat", access: "Köy/atölye ziyareti için randevu ve yerel rehber gerekir", interests: ["craft", "rural", "heritage"], officialUrl: "https://eskisehir.ktb.gov.tr/TR-149983/gunyuzu.html", stayHook: "Sivrihisar bağlantısında alışverişi üreticiye dağıtır.", status: "existing" },
  mahmudiye: { id: "mahmudiye", name: "Mahmudiye At Kültürü", district: "Mahmudiye", description: "Çiftlik-i Hümayun'dan bugüne uzanan at yetiştiriciliği ve kırsal üretim hafızası.", duration: "1,5 saat", access: "Tesis/çiftlik ziyareti yalnızca önceden izin ve teyitle planlanmalı", interests: ["rural", "heritage"], officialUrl: "https://eskisehir.ktb.gov.tr/TR-149986/mahmudiye.html", stayHook: "Çifteler hattına özgün kırsal kültür katmanı ekler.", status: "existing" },
  beylikova: { id: "beylikova", name: "Beylikova Porsuk ve Üretim Hafızası", district: "Beylikova", description: "Porsuk çevresi, tarım-süt üretimi ve tarihî at yetiştiriciliği belleğini birleştiren kırsal keşif.", duration: "1,5 saat", access: "Üretici ziyareti için önceden teyit gerekir", interests: ["rural", "taste", "nature"], officialUrl: "https://eskisehir.ktb.gov.tr/TR-149981/beylikova.html", stayHook: "Doğu-kırsal aksında yerel alışveriş ve sofra bağlantısı kurar.", status: "existing" },
};

export type RouteFamily = {
  id: string;
  label: string;
  strapline: string;
  interests: InterestKey[];
  suggestedDays: number;
  stopIds: string[];
  modeFit: MobilityKey[];
};

export const routeFamilies: RouteFamily[] = [
  { id: "frig-tasta", label: "Taşa Yazılan Frigya", strapline: "Kent eşiğinden Battal Gazi'ye, Yazılıkaya'dan Sivrihisar'a uzanan çok katmanlı tarih.", interests: ["heritage", "faith", "nature"], suggestedDays: 3, stopIds: ["odunpazari", "battalgazi", "gerdekkaya", "yazilikaya", "frigwalk", "ulucami", "pessinus"], modeFit: ["car"] },
  { id: "anadolu-irfani", label: "Anadolu İrfanı ve İnanç", strapline: "Seyyid Battal Gazi, Yunus Emre, Nasreddin Hoca ve UNESCO Ulu Cami çevresinde düşünce yolculuğu.", interests: ["faith", "heritage"], suggestedDays: 3, stopIds: ["odunpazari", "battalgazi", "yunus", "sorkun", "ulucami", "nasreddin"], modeFit: ["car", "easy"] },
  { id: "unesco-sivrihisar", label: "UNESCO Sivrihisar ve Doğu Kapısı", strapline: "Ahşap direkli Ulu Cami'den Pessinus'a, kilim köylerinden yerel sofraya tam günlük kültür ekonomisi.", interests: ["heritage", "craft", "taste"], suggestedDays: 2, stopIds: ["ulucami", "sivrihisar", "pessinus", "nasreddin", "gunyuzu", "odunpazari"], modeFit: ["car", "easy"] },
  { id: "sakarya-vadisi", label: "Sakarya'nın Kaynağından Vadiye", strapline: "Sakaryabaşı, mikroklima üretimi, Laçin peyzajı ve Sakarılıca ile suyun izinde yavaş rota.", interests: ["nature", "taste", "rural"], suggestedDays: 2, stopIds: ["sakaryabasi", "mahmudiye", "saricakaya", "lacin", "sakarilica", "porsuk"], modeFit: ["car", "easy"] },
  { id: "yasayan-zanaatlar", label: "Yaşayan Zanaatlar", strapline: "Lületaşından savata, Sorkun çömleğinden kök boyalı kilime üreticinin izini süren rota.", interests: ["craft", "rural", "taste"], suggestedDays: 3, stopIds: ["kursunlu", "alpu", "sorkun", "gunyuzu", "sivrihisar"], modeFit: ["car"] },
  { id: "kent-tasarim", label: "Kent Kültürü, Tasarım ve Akşam", strapline: "Tarihî şehir, lületaşı, Devrim ve Porsuk'u akşam ekonomisiyle birleştiren erişilebilir kent rotası.", interests: ["city", "craft", "taste"], suggestedDays: 2, stopIds: ["odunpazari", "kursunlu", "devrim", "porsuk", "inonu", "sivrihisar"], modeFit: ["public", "easy", "car"] },
  { id: "ova-at-uretim", label: "Ova, At ve Kırsal Üretim", strapline: "Mahmudiye'nin at mirası, Sakaryabaşı ve ova ilçelerinin üretim belleğinde randevulu keşif.", interests: ["rural", "taste", "nature"], suggestedDays: 3, stopIds: ["mahmudiye", "sakaryabasi", "beylikova", "alpu", "porsuk", "sivrihisar"], modeFit: ["car"] },
  { id: "buyuk-eskisehir", label: "Büyük Eskişehir: 4 Gün", strapline: "Kent, Frigya, inanç, UNESCO, su ve üretici ekonomisini dört dengeli güne dağıtan ana omurga.", interests: ["heritage", "nature", "craft", "taste", "faith", "city", "rural"], suggestedDays: 4, stopIds: ["odunpazari", "kursunlu", "porsuk", "battalgazi", "yazilikaya", "ulucami", "pessinus", "sakaryabasi", "saricakaya", "sakarilica"], modeFit: ["car"] },
];

export const geographicIndications = [
  ["Eskişehir Lüle Taşı", "https://ci.turkpatent.gov.tr/cografi-isaretler/detay/37890"],
  ["Eskişehir Met Helvası", "https://ci.turkpatent.gov.tr/cografi-isaretler/detay/38026"],
  ["Eskişehir Simidi", "https://ci.turkpatent.gov.tr/cografi-isaretler/detay/1482"],
  ["Eskişehir Çiğböreği", "https://ci.turkpatent.gov.tr/cografi-isaretler/detay/38024"],
  ["Sorkun Çömleği", "https://ci.turkpatent.gov.tr/cografi-isaretler/detay/1811"],
  ["Kızılinler Bal Kabağı", "https://ci.turkpatent.gov.tr/cografi-isaretler/detay/12085"],
  ["Sivrihisar Dövme Sucuğu", "https://ci.turkpatent.gov.tr/cografi-isaretler/detay/163"],
  ["Sivrihisar Muska Baklavası", "https://ci.turkpatent.gov.tr/cografi-isaretler/detay/38261"],
  ["Sivrihisar İncili Küpe", "https://ci.turkpatent.gov.tr/cografi-isaretler/detay/442"],
  ["Sivrihisar Kilimi", "https://ci.turkpatent.gov.tr/cografi-isaretler/detay/4802"],
] as const;
