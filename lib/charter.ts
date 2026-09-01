export type CharterArticle = { number: number; title: string; text: string };
export type CharterSection = { id: string; title: string; articles: CharterArticle[] };

const a = (number: number, title: string, text: string): CharterArticle => ({ number, title, text });

export const charterSections: CharterSection[] = [
  {
    id: "genel",
    title: "Birinci Bölüm · Genel Hükümler",
    articles: [
      a(1, "Ad", "Birliğin adı “Eskişehir Turizm Altyapı Hizmet Birliği”, kısa adı “ESTAB”dır. Kurumsal kullanımda 2026 kuruluş hazırlığına ilişkin tarihsel işaret korunabilir."),
      a(2, "Hukuki dayanak ve statü", "Birlik, kuruluş işlemlerinin tamamlanması hâlinde 5355 sayılı Mahallî İdare Birlikleri Kanunu ve ilgili diğer mevzuat uyarınca kamu tüzel kişiliğine sahip mahallî idare birliği olarak faaliyet gösterir. Bu taslak tek başına tüzel kişilik doğurmaz."),
      a(3, "Merkez ve hizmet alanı", "Birliğin merkezi Eskişehir'dir. Hizmet alanı, üye mahallî idarelerin yetki alanlarıyla sınırlı olmak üzere Eskişehir ilinin 14 ilçesini ve bu alanlar arasındaki turizm bağlantılarını kapsar."),
      a(4, "Süre", "Birlik süresiz olarak kurulması öngörülen bir yapıdır. Sona erme ve tasfiye, bu tüzük ile mevzuat hükümlerine göre yürütülür."),
      a(5, "Üyeler", "Kurucu ve sonradan katılan üye mahallî idareler, yetkili meclis kararları tamamlandıktan sonra Ek-1 Üye ve Temsil Cetvelinde gösterilir. Valilik stratejik öncülüğü, tek başına mahallî idare üyeliği anlamına gelmez."),
      a(6, "Tanımlar", "Bu tüzükte Birlik ESTAB'ı; Meclis birlik meclisini; Encümen birlik encümenini; Başkan birlik başkanını; Sekretarya koordinasyon ve kayıt birimini; Üye ise birliğe katılan mahallî idareyi ifade eder."),
      a(7, "Temel ilkeler", "Kamu yararı, hukuka uygunluk, koruma-kullanma dengesi, erişilebilirlik, yerindenlik, mali disiplin, veri güvenliği, katılımcılık, iklim duyarlılığı ve ölçülebilir etki bütün faaliyetlerde esastır."),
    ],
  },
  {
    id: "amac-gorev",
    title: "İkinci Bölüm · Amaç, Görev ve Hizmetler",
    articles: [
      a(8, "Temel amaç", "Eskişehir'in doğal, tarihî ve kültürel değerlerini bütüncül biçimde korumak, geliştirmek ve tanıtmak; sosyal ve teknik turizm altyapısını planlamak; ziyaret süresi, deneyim kalitesi ve yerel ekonomik katkıyı artırmaktır."),
      a(9, "Destinasyon yönetimi", "Birlik, 14 ilçeyi tek tip tesis yaklaşımıyla değil; çekim, deneyim, bağlantı ve konaklama rolleriyle ele alan il ölçekli destinasyon yönetim modeli geliştirir."),
      a(10, "Devredilen hizmetler", "Üyelerce Birliğe devredilecek hizmetler, her üyenin yetkili organ kararı ve Ek-3 Hizmet Devir Cetveliyle açıkça belirlenir. Genel ve belirsiz yetki devri yapılamaz."),
      a(11, "Envanter ve planlama", "Kültürel ve doğal varlık, rota, tesis, erişim, işletme, etkinlik ve yerel üretici envanteri oluşturulur; yatırım ve bakım öncelikleri bu doğrulanmış envantere dayandırılır."),
      a(12, "Turizm altyapısı", "Yönlendirme, ziyaretçi karşılama, dinlenme, hijyen, atık, su, güvenlik, dijital erişim, kamp-karavan ve benzeri altyapı; koruma statüsü, taşıma kapasitesi ve ihtiyaç analizi gözetilerek planlanabilir, yaptırılabilir veya işletilebilir."),
      a(13, "Erişilebilirlik", "Fiziksel mekân, ulaşım bilgisi, web, belge ve ziyaretçi içeriğinde engelliler, yaşlılar, çocuklu aileler ve farklı dil ihtiyaçları için erişilebilir tasarım standardı geliştirilir."),
      a(14, "Koruma ve miras", "Yazılıkaya/Midas Anıtı, Frig vadileri, Seyyid Battal Gazi, UNESCO Sivrihisar Ulu Cami ve diğer miras alanlarında ilgili koruma kurulları ile yetkili kurumların kararları önceliklidir."),
      a(15, "Tanıtım ve marka", "Eskişehir'in tek bir yapı veya ilçe yerine katmanlı tarihini, doğasını, yaşayan kültürünü ve çağdaş üretim kapasitesini anlatan ortak destinasyon dili oluşturulur."),
      a(16, "Dijital ziyaretçi sistemi", "Doğrulanmış mekân, saat, erişim, ulaşım ve etkinlik bilgisini çok dilli biçimde sunan web, mobil, QR, sesli anlatı ve karşılama noktası altyapısı geliştirilebilir."),
      a(17, "Yapay zekâ ve karar desteği", "Rota önerisi ve yatırım karar desteğinde kullanılan algoritmalar açıklanabilir, denetlenebilir, ayrımcılık üretmeyen ve kişisel veri minimizasyonuna dayalı olmalıdır; nihai kamu kararı yetkili organlara aittir."),
      a(18, "Yerel ekonomi ve coğrafi işaretler", "Rotalar; yerel rehber, zanaatkâr, üretici, kooperatif, küçük işletme ve coğrafi işaretli ürünlerle bağlanır. Ticari görünürlük için açık, eşit ve doğrulanabilir ölçütler uygulanır."),
      a(19, "Doğa ve iklim", "Ekoturizm, su kullanımı, atık, enerji, biyolojik çeşitlilik, ulaşım ve etkinliklerde çevresel taşıma kapasitesi ile iklim uyumu gözetilir. Eski “Eko Turizm Altyapı Birliği” yaklaşımının sürdürülebilirlik ilkesi kurumsal modele taşınır."),
      a(20, "Etkinlik ve spor turizmi", "Kültür, film, gastronomi ve spor organizasyonları tek seferlik kalabalık üretmek için değil; konaklama, yerel tedarik, eğitim ve ilçe rotalarını güçlendiren ölçülebilir programlar olarak yürütülür."),
      a(21, "Eğitim ve kapasite", "Yerel yönetim, rehber, işletme, üretici, genç ve gönüllülere yönelik turizm standardı, dijital yeterlilik, film üretimi, etkinlik yönetimi ve sürdürülebilirlik eğitimleri düzenlenebilir."),
      a(22, "İş birliği", "Kamu kurumları, üniversiteler, meslek kuruluşları, kalkınma ajansları, sivil toplum ve özel sektörle görev, kaynak, marka ve veri sorumluluğu açık protokoller yapılabilir."),
    ],
  },
  {
    id: "organlar",
    title: "Üçüncü Bölüm · Organlar, Yönetim ve Koordinasyon",
    articles: [
      a(23, "Birlik organları", "Birliğin kanuni organları Birlik Meclisi, Birlik Encümeni ve Birlik Başkanıdır. Danışma kurulları ile sekretarya bu organların yerine geçemez."),
      a(24, "Meclisin oluşumu", "Birlik Meclisi, üye mahallî idarelerin başkanları ve üye meclislerince mevzuata uygun seçilen temsilcilerden oluşur. Kesin temsil sayıları Ek-1'de gösterilir."),
      a(25, "Temsil süresi ve yedek üyelik", "Seçilmiş temsilci ve yedeklerin süreleri, yenilenmesi ve boşalma hâlleri 5355 sayılı Kanun ile ilgili seçim mevzuatına göre yürütülür."),
      a(26, "Meclisin görevleri", "Stratejik plan, yıllık çalışma programı, bütçe, kesin hesap, yatırım öncelikleri, hizmet standardı, taşınmaz ve işletme kararları, borçlanma, ortaklık, tüzük değişikliği ve mevzuatın verdiği diğer görevler Meclise aittir."),
      a(27, "Toplantı dönemi", "Meclis olağan olarak yılda iki kez toplanır; ay ve tarih ilk toplantıda belirlenir. Olağanüstü toplantılar mevzuatta öngörülen usulle yapılır."),
      a(28, "Toplantı ve karar yeter sayısı", "Toplantı ve karar yeter sayıları 5355 sayılı Kanun ile atıf yapılan mevzuata göre belirlenir. Çıkar çatışması bulunan üyeler ilgili görüşme ve oylamaya katılmaz."),
      a(29, "Gündem ve tutanak", "Gündem ve eki belgeler üyelere zamanında iletilir; kararlar numara, tarih, oy durumu ve gerekçeyle kayıt altına alınır. Kanunen gizli tutulması gerekenler dışında yayımlanır."),
      a(30, "Encümenin oluşumu", "Birlik Encümeninin başkan dâhil üye sayısı, temsil dengesi ve seçim usulü kuruluş onayında kesinleştirilerek Ek-1'de gösterilir. Taslak öneri başkan dâhil yedi üyedir."),
      a(31, "Encümenin görevleri", "Çalışma programı ve bütçe uygulamasını izlemek, ihale ve harcama süreçlerinde mevzuatın verdiği görevleri yerine getirmek, Meclise öneri sunmak ve Başkanın havale ettiği işleri karara bağlamak Encümenin görevlerindendir."),
      a(32, "Birlik Başkanı", "Birlik Başkanı, Birlik Meclisi tarafından mevzuatta belirtilen usulle seçilir; Birliği temsil eder ve kanuni organların kararlarının uygulanmasını sağlar."),
      a(33, "Başkanın görevleri", "Birliği yönetmek, bütçe ve çalışma programını uygulamak, personeli sevk etmek, hak ve menfaatleri korumak, sözleşmeleri imzalamak, Meclis ve Encümen kararlarını yürütmek Başkanın görevleridir."),
      a(34, "Valilik öncülüğü", "Eskişehir Valiliği; kuruluş sürecinde ve il ölçekli uygulamada kurumlar arası stratejik öncülük, eşgüdüm ve kamu yatırımlarının uyumu işlevini yürütür. Bu işlev, kanuni organların karar yetkisini ortadan kaldırmaz ve Valiliği kendiliğinden üye yapmaz."),
      a(35, "Sekretarya", "Koordinasyon, yönetim takibi ve sekretarya hizmetlerinin Eskişehir İl Sosyal Etüt ve Proje Müdürlüğünce yürütülmesi esastır. Hukuki mekanizma; mevzuata uygun görevlendirme, protokol veya hizmet düzenlemesiyle kuruluş aşamasında kesinleştirilir."),
      a(36, "Sekretaryanın görevleri", "Gündem ve toplantı hazırlığı, yazışma, karar ve görev takibi, proje portföyü, süre-risk izleme, paydaş koordinasyonu, raporlama, arşiv ve kurumsal hafıza sekretaryanın görevleridir."),
      a(37, "Sekretaryanın yetki sınırı", "Sekretarya tek başına karar alamaz, harcama yapamaz, ihale kararı veremez ve kanuni organların yerine geçemez. Yetki ve imza, mevzuat ile organ kararlarına dayanır."),
      a(38, "İlçe koordinasyonu", "İlçe ölçeğindeki saha koordinasyonu Kaymakamlıklar öncülüğünde, üye belediyeler ve ilgili kurumların katılımıyla kurulan çalışma grupları aracılığıyla yürütülebilir."),
      a(39, "Danışma yapıları", "Üniversite, sektör, meslek kuruluşu, sivil toplum, gençlik, erişilebilirlik, kültür ve çevre alanlarında oy hakkı bulunmayan danışma kurulları oluşturulabilir."),
      a(40, "Teşkilat ve personel", "Teşkilat şeması, kadro ve görev tanımları Meclis kararı ve yürürlükteki personel mevzuatına göre belirlenir. Uzmanlık hizmetlerinde açık görev tanımı ve performans ölçütü aranır."),
    ],
  },
  {
    id: "planlama-veri",
    title: "Dördüncü Bölüm · Planlama, Dijitalleşme ve Hesap Verebilirlik",
    articles: [
      a(41, "Stratejik çerçeve", "Birlik çalışmaları On İkinci Kalkınma Planının destinasyon yönetimi, dijitalleşme, sürdürülebilirlik, çeşitlendirme ve yerel değer zinciri hedefleri ile Vizyon Eskişehir 2036'nın bütünleşik şehir yaklaşımına göre programlanır."),
      a(42, "Proje önceliklendirme", "Projeler; koruma aciliyeti, kamu yararı, erişim açığı, ziyaret süresi etkisi, yerel gelir, hazır oluş, işletme sürdürülebilirliği, iklim etkisi ve maliyet ölçütleriyle puanlanır."),
      a(43, "Mikro altyapı ilkesi", "Mevcut kapasite kullanılmadan büyük ve tekrarlayan tesis yatırımı önerilmez. Yönlendirme, dinlenme, güvenlik, erişim ve dijital içerik gibi mikro altyapı önceliklidir."),
      a(44, "Veri yönetişimi", "Veri sahibi, güncelleme sıklığı, doğrulama sorumlusu, saklama süresi ve erişim yetkisi veri envanterinde gösterilir. Kişisel veriler 6698 sayılı Kanun ve ilgili mevzuata göre işlenir."),
      a(45, "Yapay zekâ etiği", "Algoritmik önerilerde açıklanabilirlik, insan denetimi, veri minimizasyonu, tarafsızlık, güvenlik ve itiraz edilebilirlik esastır. Korunan alan ve güvenlik kuralları öneri puanının önündedir."),
      a(46, "Performans göstergeleri", "Geceleme, ortalama kalış, ilçe akışı, rota tamamlama, sezon dağılımı, yerel işletme teması, erişilebilirlik, memnuniyet, koruma durumu ve yatırım gerçekleşmesi düzenli izlenir."),
      a(47, "Şeffaflık", "Tüzük, organ kararları, strateji ve faaliyet raporları, bütçe ve kesin hesap, performans göstergeleri ile kanunen yayımlanması gereken ihale bilgileri erişilebilir formatta kamuya sunulur."),
      a(48, "Risk ve süreklilik", "Her yatırım için hukuki, mali, çevresel, arkeolojik, işletme, güvenlik ve itibar riski değerlendirilir; bakım, yenileme ve hizmet sürekliliği planı olmadan uygulamaya geçilmez."),
    ],
  },
  {
    id: "mali",
    title: "Beşinci Bölüm · Mali Hükümler",
    articles: [
      a(49, "Gelirler", "Üye katkı payları, merkezi idare ve diğer kamu kurumlarının aktarımları, proje ve hibe gelirleri, hizmet ve işletme gelirleri, bağış ve yardımlar ile mevzuatın izin verdiği diğer gelirler Birliğin gelirleridir."),
      a(50, "Katılım payı", "Üye katkı payının hesaplama yöntemi Ek-2'de kesinleştirilir. Taslak model; nüfus yüzde 40, turizm kapasitesi/geceleme yüzde 30, devredilen hizmet ve proje yükü yüzde 20, eşit taban pay yüzde 10 ağırlıklarını öngörür; bu oranlar hukuk ve mali değerlendirme sonrası Meclisçe kesinleştirilir."),
      a(51, "Giderler", "Planlama, proje, yapım, bakım, işletme, tanıtım, eğitim, etkinlik, dijital sistem, personel, danışmanlık, denetim ve mevzuata uygun diğer hizmet giderleri bütçeden karşılanır."),
      a(52, "Bütçe ve muhasebe", "Bütçe, muhasebe, kesin hesap, taşınır-taşınmaz, harcama ve raporlama işlemleri mahallî idare birliklerine uygulanan mali mevzuata göre yürütülür."),
      a(53, "İhale ve sözleşme", "Mal, hizmet, yapım, kiralama ve işletme işlemleri ilgili ihale ve mali mevzuata göre yürütülür. Sözleşmelerde hizmet standardı, çevresel yükümlülük, veri güvenliği, bakım, yaptırım ve fesih koşulları bulunur."),
      a(54, "İşletme ve gelir paylaşımı", "Birlik tesislerinin doğrudan, üye eliyle veya mevzuata uygun üçüncü taraf aracılığıyla işletilmesi mümkündür. Yerel ekonomik katkı, hizmet kalitesi ve kamu payının korunması sözleşmede açıkça düzenlenir."),
      a(55, "Denetim ve iç kontrol", "Birlik işlemleri mevzuatta öngörülen idari, mali ve dış denetime tabidir. Görevler ayrılığı, ön mali kontrol, risk kaydı ve düzenli iç raporlama uygulanır."),
    ],
  },
  {
    id: "son",
    title: "Altıncı Bölüm · Üyelik, Değişiklik ve Son Hükümler",
    articles: [
      a(56, "Hizmetlerden yararlanma", "Birlik hizmetleri görev alanı, kapasite, koruma koşulu ve Meclisçe belirlenen şeffaf ölçütlere göre sunulur; üyeler ve yararlanıcılar arasında keyfî ayrım yapılamaz."),
      a(57, "Katılma, ayrılma ve sorumluluk", "Birliğe katılma ve ayrılma, ilgili mahallî idare meclisi kararları ve 5355 sayılı Kanunda öngörülen onay usullerine tabidir. Ayrılan üyenin doğmuş mali ve sözleşmesel sorumlulukları devam eder."),
      a(58, "Tüzük değişikliği", "Tüzük değişiklikleri, Birlik Meclisinin mevzuata uygun kararı ve gerekli onay süreçleriyle yürürlüğe girer. Üye, görev, pay, temsil ve hizmet devri ekleri değişiklikle birlikte güncellenir."),
      a(59, "Sona erme ve tasfiye", "Birliğin sona ermesi hâlinde borç, alacak, taşınır-taşınmaz, devam eden hizmet, arşiv, veri ve personel işlemleri mevzuat ve Meclisçe kabul edilen tasfiye planına göre yürütülür."),
      a(60, "Yönetmelik ve yönergeler", "Meclis; proje önceliklendirme, veri yönetişimi, yapay zekâ etiği, erişilebilirlik, işletme, etkinlik, gönüllülük, hibe ve diğer uygulama alanlarında düzenleyici belgeler kabul edebilir."),
      a(61, "Hüküm bulunmayan hâller", "Bu tüzükte hüküm bulunmayan hâllerde 5355 sayılı Kanun, ilgili belediye ve il özel idaresi mevzuatı, kamu mali yönetimi, ihale, kişisel veriler ve diğer uygulanabilir mevzuat hükümleri esas alınır."),
      a(62, "Geçiş hükmü", "Kuruluş onayından önce üyelik, temsil, katkı payı, hizmet devri, sekretarya görevlendirmesi ve ilk yıl çalışma programı Ek-1 ila Ek-4'te tamamlanır; boş bırakılan alanlar onaylı karar olmadan yürürlüğe konulamaz."),
      a(63, "Yürürlük ve yürütme", "Tüzük, mevzuatta öngörülen kuruluş ve onay işlemlerinin tamamlandığı tarihte yürürlüğe girer. Hükümler kanuni organlar tarafından yürütülür."),
    ],
  },
];

export const charterAnnexes = [
  ["Ek-1", "Kurucu/üye mahallî idareler, temsil sayıları, asil-yedek üyeler ve Encümen yapısı", "Yetkili meclis kararlarından sonra doldurulacak"],
  ["Ek-2", "Katılım payı formülü, veri yılı, ödeme takvimi ve gecikme usulü", "Hukuk ve mali hizmetler incelemesinden sonra kesinleşecek"],
  ["Ek-3", "Birliğe devredilen hizmetler, sınırlar, varlık ve personel bağlantısı", "Her üyenin açık yetkili organ kararı gerekli"],
  ["Ek-4", "İlk yıl çalışma programı, performans göstergeleri ve geçiş takvimi", "Kuruluş onayına bağlı hazırlık belgesi"],
] as const;
