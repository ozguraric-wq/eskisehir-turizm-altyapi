# Eskişehir Keşif Asistanı — demo v5

8 Eylül 2026. Katalog sürümü: `2026-09-08.4`.

Bu sürüm 14 ilçede 47 kaynaklı ziyaret noktası, 43 keşif teması, 20 yemek bölgesi, 5 ulaşım biçimi ve 5 dil içerir. Tema bir tur paketi değildir; ziyaretçinin koşullarına göre alt kümeleri ve farklı sıralamaları denenir. Planlanan Birlik projeleri, kazı izni veya üretici randevusu gerektiren ziyaretler otomatik rotaya alınmaz.

## Emsal incelemesi ve tasarım kararı

| Resmî ürün kaynağı | İncelenen yaklaşım | Demodaki karşılığı |
| --- | --- | --- |
| [Wanderlog — travel maps](https://wanderlog.com/travel-maps) | Gezi, yemek, günlük plan ve harita bağlantısını birlikte yönetme | Gün sekmeleri, saatli yemek molası, alternatifleri karşılaştırma, durak çıkarma, kaydetme ve paylaşma |
| [Komoot — route planner](https://www.komoot.com/help/routeplanner) | Başlangıç ve bitiş, durak sırası ve yol üzerindeki ihtiyaç noktaları | Her gün başlangıca dönüş, durak sıralarının denenmesi, yemek ve mola payı |
| [Komoot — web planner](https://support.komoot.com/hc/en-us/articles/10194270667034-Plan-routes-on-the-website) | Hareket türünün rota seçimini değiştirmesi | Yürüyüş, toplu ulaşım, otomobil, bisiklet, motosiklet için farklı süre ve erişim kısıtları |

Ekran yerleşimi özgün olarak yeniden tasarlandı; ürünlerin marka ve görsel varlıkları kopyalanmadı. Komoot benzeri gerçek yol ağı, eğim ve zemin verisine dayanan navigasyon bu demoda yoktur.

## Veri ve doğrulama

- [İl Kültür ve Turizm Müdürlüğü](https://eskisehir.ktb.gov.tr/) ilçe, miras ve müze kayıtları; her ziyaret noktasında kendi kaynak bağlantısı bulunur.
- [Frig vadilerindeki resmî yürüyüş rotaları](https://eskisehir.ktb.gov.tr/TR-158729/frig-vadilerinde-yuruyus-rotalari.html) bölgesel ilişkiyi destekler. Kaynaktaki uzun yürüyüş parkurları kent bisikleti veya motosiklet güzergâhı olarak sunulmaz.
- [İl Müdürlüğü yemek kültürü](https://eskisehir.ktb.gov.tr/TR-156622/eskisehir39de-yemek-kulturu.html) ve [GoTürkiye mutfak rehberi](https://goturkiye.com/eskisehir/taste), yerel yemek önerilerinin kaynağıdır. Lokanta sıralaması, fiyat, rezervasyon veya alerjen garantisi verilmez.
- [Belediyenin kent bisiklet güzergâhı açıklaması](https://www.eskisehir.bel.tr/icerik-detay.php?cat_icerik=1&icerik_id=11755&menu_id=24), [Velespit Parkı](https://www.eskisehir.bel.tr/icerik-detay.php?cat_icerik=1&icerik_id=11442&menu_id=24) ve [Sazova](https://www.eskisehir.bel.tr/sayfalar.php?sayfalar_id=57), mevcut kent noktalarını destekler. Tüm bağlantılar ayrılmış bisiklet yolu değildir.
- [UNESCO seri miras kaydı](https://whc.unesco.org/en/list/1694/), Sivrihisar Ulu Camii’nin miras statüsünü destekler.
- Cam, Balmumu, Kent Belleği ve Devrim müzelerinin kaynakta görülen normal pazartesi kapanışı uygulanır. Tarih seçilmezse haftanın günü varsayılmaz. Resmî tatil istisnaları ve geçici kapanışlar canlı alınmaz; kullanıcı güncel kaynağa yönlendirilir.

`Place.source` kültürel içerik kaynağıdır. `window`, `minutes`, `walking`, aile / az yürüyüş sınıflandırmaları ve mesafe modeli editoryal planlama varsayımlarıdır; kurum onayı, erişilebilirlik sertifikası veya saha ölçümü anlamına gelmez. Kaynakta saat bulunan müzelerde en erken 10:00, en geç 17:00 gibi koruyucu aralıklar kullanılır. Diğer duraklardaki 09:00–17:00 aralığı ziyaret planlama penceresidir, resmî açık saat iddiası değildir.

Yemek bölgeleri birer hizmet bölgesidir. Aynı bölgedeki lokanta araması kullanıcıya bırakılır. Yazılıkaya ve diğer yemek işletmesi doğrulanmamış alanlarda araç **hazır öğün getirilmesini açıkça ister**. Yalnız yemek kültürü sayfasında bir ürün bulunması, her ilçede o ürünün satıldığı iddiasına dönüştürülmez. Ücretli müze filtresi biletle ilgilidir; ulaşım ve yemek için ücretsiz gezi iddiası yapılmaz.

## Motorun çalışması

1. **Girdi doğrulama:** 1–4 gün, 08:00–13:00 başlangıç (toplu taşımada en erken 06:00), en az üç saatlik pencere, en geç 19:00 dönüş. Yalnız tanımlı kimlikler, modlar, tarihler ve temalar kabul edilir. Paylaşılmış ve kaydedilmiş tercihler de aynı doğrulamadan geçer.
2. **Sert filtreler:** Seçili ilçeler gerçek bir kısıttır: yalnız bu ilçelerden ziyaret seçilir ve her seçili ilçe tam planda temsil edilmelidir. Frigya seçimi en az bir gerçek Frigya durağı gerektirir. Uyumsuz ulaşım veya yetersiz süre, merkez rotasına sessiz dönüş yapmaz. Ziyaret dışı / çıkarılmış duraklar, bilinen kapalı gün, bilet, az yürüyüş ve iç mekân tercihleri. Bisiklet ve yürüyüşte ilçe keşfi seçilince her alternatif için yerel bir başlangıç değerlendirilir. Sabit başlangıç seçimi korunur ve sessizce merkeze çevrilmez. Bisiklet/yürüyüş keşfinde ilçeye erişim ayrıca gösterilir. Toplu taşıma seçili başlangıçtan resmî tarifelerle hesaplanır.
3. **Yolculuk modeli:** 28 alt bölgeden oluşan seyrek bir bağlantı grafiği ve yuvarlatılmış mesafe varsayımları. Floyd–Warshall ile bu editoryal grafikte en kısa bağlantı hesaplanır. Yakın duraklar için seçili kısa bağlantılar; kalan aynı bölge bağlantılarında koruyucu varsayımlar kullanılır. Bu bir gerçek karayolu grafiği değildir; Haversine mesafesiyle dağların içinden kestirme yapılmaz. Tablodaki kilometreler kamu kurumunun ölçümü değildir.
4. **Ulaşım zamanı:** Kısa bağlantıda yürüyüş; bisiklette kentte 14, kırsalda 11 km/sa, kent içi araçta 25 km/sa, kırsal otomobilde 55 km/sa ve motosiklette 50 km/sa gibi model hızları. Toplu ulaşımda aşağıdaki tarife grafiği kullanılır. Araçta park ve uzun sürüşte dinlenme süreleri eklenir. Motosiklet için hız yarışı teşvik edilmez; karayolu erişimi kullanılır.
5. **Aday üretimi:** Her temanın ve her ilçenin uygulanabilir alt kümeleri oluşturulur. Her ilçe için en iyi beş günlük aday global havuz sınırından önce korunur. Sakin/aile planında en fazla üç, diğer planlarda en fazla dört ziyaret değerlendirilir. Alt kümelerin bütün sıralamaları denenir. Tema havuzu dışındaki rastgele yer adları üretilmez.
6. **Zamanlama:** Ziyaret, transfer, park, bekleme, öğle yemeği ve dönüş birlikte programa girer. Öğle molası 12:00–14:00 (toplu taşımada seferlere uyum için 11:30–14:00) penceresinde, yerel yemek bölgesinde veya taşınan öğün olarak yerleşir. 19:00 dönüşlü uzun günlerde gerekli akşam molası da süreye sığmalıdır. Yemek transferinin mesafesi ve süresi toplamdan düşülmez.
7. **Uygunluk:** Dönüş zamanını, günlük yürüyüş sınırını, bisiklet mesafe sınırını veya toplam günün ulaşım payını aşan aday tamamen reddedilir. Uygun plan yoksa açık boş durum gösterilir. Eksik gün tam gezi gibi sunulmaz.
8. **Sıralama:** İlgiyle eşleşen durak oranı, ilgi kapsamı ve kaynaklı ana çekim noktaları önceliklidir. Durak sayısı/süre katkısı üstten sınırlıdır; kısa ulaşım kent merkezini otomatik kazanan yapmaz. Alternatifler arasında hem durak hem ilçe örtüşmesi cezalandırılır. Bu bir optimizasyon puanıdır, yapay bir “%97 yapay zekâ eşleşmesi” değildir ve ziyaretçiye yüzde olarak gösterilmez.
9. **Çok günlük birleşim:** İlçe kombinasyonu başına iki adayı koruyan, en çok 96 adaylık beam search ile günler birleştirilir. Aynı mekân iki gün kullanılmaz. Alternatifler Jaccard benzerliğiyle süzülür; neredeyse aynı rotalar tekrar edilmez. Global matematiksel optimum garantisi yoktur.
10. **Düzenleme ve paylaşım:** Bir durak çıkarılınca tüm program yeniden hesaplanır. Cihaz kaydı ve URL yalnız sürümlü tercihleri/rota kimliğini taşır. Uzak sunucuya kullanıcı profili veya metin istemi gönderilmez. İndirilen metin planı ağsız okunabilir; uygulamanın tamamı çevrimdışı çalışıyor iddiası yoktur.

## Yapay zekâ ve mobil sürüm

Mevcut serbest metin alanı beş dilde belirli tercih ifadelerini tanıyan bir **demo ayrıştırıcıdır**; LLM değildir. Bilmediği metinden mekân veya rota uydurmaz. `lib/routing/engine.ts` React, DOM, tarayıcı depolaması ve ağ katmanından bağımsızdır. Bu nedenle React Native veya bir API üzerinden aynı model kullanılabilir.

Üretim aşamasında önerilen sözleşme:

- LLM yalnız yapılandırılmış `Preferences` ve açıklama taslağı üretir. Mekân kimlikleri izinli katalogdan gelmelidir; nihai zamanlama ve kurallar deterministik motorda doğrulanır.
- Yol matrisi, lisanslı / yetkili gerçek ulaşım sağlayıcısından; bisiklet ve motosiklet için uygun yol özellikleriyle alınır. Trafik ve hava verisi zaman damgalı olur. Sağlayıcı yoksa uygulama açıkça tahmin moduna geçer.
- İl Müdürlüğü, müzeler, belediye ve işletme kayıtlarında kaynak, son doğrulama, geçerlilik, kapanış istisnası ve sorumlu editör bulunur. Açık saat ve kapasite verisi onaylı entegrasyonla gelir; mevcut demo resmî API bağlantısı kurduğunu iddia etmez.
- Mobil uygulamada konum izni isteğe bağlıdır. Rota ilerlemesi, yeniden planlama ve dil katmanı bu sözleşmeyi paylaşır. Anahtarlar istemciye gömülmez; gerçek LLM çağrısı sunucuda sınırlandırılır.
- Yerel ekonomik etki; izinli/anonim ilçe yayılımı, ziyaret süresi, yerel hizmet durağı ve konaklama niyeti gibi ölçümlerle değerlendirilir. Demo bu ölçümleri toplamaz veya gerçekleşmiş gelir iddiası üretmez.

## Doğrulama

`node --test tests/route-engine.test.mjs` gerçek TypeScript motorunu sınar: 60 mod/gün/tempo birleşimi, zaman çakışması, gidiş-dönüş, öğün, kapalı gün, az yürüyüş, bilet, iç mekân, çıkarılan durak, boş sonuç, parametre doğrulama, deterministik paylaşım ve beş dilde ayrıştırma. 43 temadan en az 40 farklı uygulanabilir plan üretimi ayrıca doğrulanır.

Görsel tarayıcı testi bu güncellemede yapılmadı. Sayfa üretimi, mevcut kurumsal içerik ve giriş akışı testleri ile GitHub Pages derlemesi ayrıca doğrulanır. GitHub Pages girişinin mevcut koruma modeli bu değişiklik kapsamında değiştirilmemiştir.


## Resmî konaklama ve lokanta envanteri

[TGA / Kültür ve Turizm Bakanlığı belgeli tesisler](https://tga.gov.tr/kultur-ve-turizm-bakanligi-belgeli-konaklama-tesisleri) sayfasının kullandığı kamuya açık `https://cms-backend.tga.gov.tr/api/ktb-accommodation/` servisi 8 Eylül 2026 tarihinde `il=Eskişehir` filtresiyle iki sayfanın tamamı okunarak alındı (151 kayıt). İşletme veya basit konaklama belgeli, tanımı uygun otel/pansiyon/motel/özel konaklama ve lokanta/gastronomi kayıtları seçildi; yatırım belgeleri ve konaklama niteliği belirsiz özel/günübirlik tesisler dışlandı. İlçe ve belge numarasıyla tekrarlar elendi.

Sonuç: **110 konaklama ve 31 lokanta/gastronomi kaydı**. Veri `lib/routing/hospitality.ts` dosyasında tarihli bir anlık görüntüdür. Canlı müsaitlik, rezervasyon veya sürekli senkronizasyon değildir. Kaynak adres, koordinat ve telefon sağlamadığı için bu alanlar uydurulmadı. Tesis, rotada ziyaret edilen ilçe filtresiyle gösterilir; kesin yol durağı olarak takvime zorla eklenmez. Kayıt bulunmayan ilçede “otel yok” denmez; yalnız kaynak eşleşmesinin bulunmadığı açıklanır.

[BEBKA Eskişehir Turizm Rehberi (2018)](https://www.kalkinmakutuphanesi.gov.tr/dokuman/eskisehir-turizm-rehberi/1432), ilçe zanaatları ve kültürel bağlantılar için kullanıldı. Eski rehberdeki işletme bilgileri güncel açık işletme iddiasına dönüştürülmedi. Altı eksik ilçe Alpu, Beylikova, Günyüzü, Mahmudiye, Mihalgazi ve Sarıcakaya; İl Müdürlüğünün kendi ilçe sayfalarıyla eklendi. Kümbet, Pessinus ve Sorkun gibi kaynaklı duraklarla diğer ilçeler derinleştirildi.

## Navigasyon, takvim ve PDF

- [Google Maps URL sözleşmesi](https://developers.google.com/maps/documentation/urls/get-started) kullanılır. Telefon tarayıcılarında en çok üç ara durak olduğundan günlük plan devamlı bölümlere ayrılır; ziyaret, yemek ve başlangıca dönüş kaybolmaz. Toplu ulaşımda ara durak desteği olmadığından her bağlantı ayrıdır. Yemekler bölge aramasıdır; paket öğün durağı lokanta gibi aranmaz. Kesin işletme seçimi haritada tamamlanır. Motosiklette otomobil yol tarifi açıldığı açıklanır.
- Android `geo:` bağlantısı sistemin kayıtlı harita uygulamasına bırakılır; iOS Apple Maps, diğer cihazlar Google Maps araması açar. Kullanıcının varsayılan uygulamasını web sayfası değiştirmez. [Android harita intent belgeleri](https://developer.android.com/guide/components/google-maps-intents).
- Takvim çıktısı [RFC 5545](https://www.rfc-editor.org/rfc/rfc5545) uyumlu `.ics` dosyasıdır. Başlangıç tarihi gerekir ve tarih değişince rota kapanış günleriyle yeniden hesaplanır. Her ziyaret ve yemek ayrı başlangıç/bitişli etkinliktir. Türkiye UTC+03:00 saatleri açık UTC değerlerine çevrilir; UTF-8 satırlar 75 oktette katlanır ve metin kaçışlanır. UID gezi/tarih/durak için kararlıdır. Etkinlikler taslak (`TENTATIVE`) ve takvimi meşgul etmeyen (`TRANSPARENT`) kayıt olarak içe aktarılır. Takvim hesabına sunucudan erişilmez; dosyanın içe aktarılması kullanıcı tarafından onaylanır. Bazı Android takvimleri `.ics` dosyasını doğrudan açmayabilir; bu durumda takvim hizmetinin içe aktarma ekranı gerekir.
- PDF düğmesi menüsüz, bağımsız A4 yazdırma belgesi oluşturur. Her gün ayrı başlar; logo, saat tablosu, açıklamalar, yemek, başlangıca dönüş, kaynak bağlantıları ve ilçe konaklama örnekleri içerir. Aynı belge beş dilde ve Arapça sağdan sola düzenlenir. Kullanıcı sistem yazdırma ekranında PDF olarak kaydeder. Site arayüzündeki mobil açık/kapalı durak durumları değiştirilmez.
- Ek regresyonlar: 14 ilçe seçimi, Frigya zorunluluğu, Han–Seyitgazi çok günlük gezi, mobil harita bölüm devamlılığı, takvim saat dönüşümü/satır katlama, yatırım belgesi filtresi ve PDF belgesinde tüm günlerin bulunması.


## İlçe başlangıçları ve ulaşım ayrımı — 8 Eylül 2026 güncellemesi

Önceki sürümdeki hata üç katmandaydı: bisiklet/toplu ulaşım için kırsal başlangıç merkeze sıfırlanıyor, kırsal duraklar uygunluk filtresinden çıkartılıyor ve tüm kırsal bağlantılar sonsuz süre alıyordu. Artık bu kurallar ayrıdır:

- `startMode=district`: Bisiklet ve yürüyüşte varsayılan keşif biçimi. Her yerel başlangıç için bağımsız gün planlanır. Her `DayPlan.origin` gerçek başlangıcı taşır; alternatifler ve çok günlük programlar bu değerleri korur. Otomobil ve motosiklet kendi sabit başlangıcıyla hesaplanmaya devam eder.
- `startMode=fixed`: Seçili noktadan tüm gidiş/dönüş hesaplanır. Kullanıcı Yazılıkaya’yı seçtiğinde başlangıç şehir merkeziyle değiştirilmez. Kentten uzak bir yürüyüş/bisiklet bağlantısı sırf alternatif üretmek için uydurulmaz.
- İlçe keşfinde başlangıca ulaşım **günlük saat, kilometre ve takvim etkinliklerine dâhil değildir**. Arayüz ve PDF bunu belirtir. Kullanıcı o günün başlangıcına nasıl ve ne zaman ulaşacağını ayrıca planlar. Ulaşım bağlantısı otomobil veya toplu ulaşım yön tarifini açar; bisiklet transferi, kiralama veya servis rezervasyonu oluşturulmaz.
- Toplu ulaşım, aşağıdaki yeni tarife motorunu kullanır; ilçeye gidiş ve dönüş artık günün saatlerine, mesafesine ve çıktılarına dâhildir. Kullanıcının seçmediği uzak bir başlangıç atanmaz.
- Bisiklette her ilçenin yerel durakları değerlendirilir. Bölgeler arası kırsal geçiş tanımlı yerel yol koridorlarıyla genişletilir: Frigya, Han, Sivrihisar–Pessinus, Mihalıççık–Sorkun, Günyüzü–Kayakent ve Sakarya Vadisi. Bu bağlantılar mevcut yol tahmin grafiğinden editoryal olarak seçilmiştir; yalnız Sakarya Vadisi koridoru kaynakta açıkça bisiklet güzergâhı olarak tanımlıdır. Diğer koridorlar resmî/sertifikalı bisiklet parkuru diye sunulmaz; harita üzerinde güncel bisiklet erişiminin teyidi gerekir. [İl Müdürlüğünün bisiklet rehberi](https://eskisehir.ktb.gov.tr/tr-158735/bisiklet.html) Sarıcakaya–Mihalgazi–Sakarılıca yol koridorunu destekler; uzun Bozdağ tırmanışı turistlere otomatik eklenmez. Kilometreler editoryal tahmindir, ayrılmış/sertifikalı bisiklet yolu veya GPX iddiası yoktur.
- [27 Nisan 2026 Yazılıkaya etkinliği](https://www.eskisehir.bel.tr/icerik-detay.php?cat_icerik=1&icerik_id=12683&menu_id=24), şehirden bisiklet taşıma ve yerinde başlayan kısa Frigya gezisi yaklaşımını destekler. O tarihteki servis bu demoda sürekli sunulan hizmet olarak gösterilmez.
- Günlük bisiklet sınırı 25, 50 veya 80 km seçilebilir. Çocuklu gezide üst sınır 18 km’dir. Sınır bütün gidiş, yemek ve dönüş bağlantılarına uygulanır; parkurun zorluk derecesi anlamına gelmez. Yol ve zemin kontrolü gerekir.
- Harita, `.ics`, metin ve PDF çıktıları her günün yerel başlangıcını kullanır. Şehir merkezinden yapılmamış bir transfer bu belgelere eklenmez.

Masaüstü menüsü 1024 piksel ve üzerindeki görünümde normal tek satır menüdür. Mobil hamburger 1023 piksel ve altında kalır. Mobil menü açıkken pencere masaüstü boyutuna geçerse menü kapanır ve sayfa kaydırma kilidi kalkar. Beş dil korunur.


## Resmî toplu taşıma tarifeleri — 8 Eylül 2026

`transit-data.ts` 18 belediye otobüs hattının iki yönlü 276 tarife kaydını içerir: 12 ilçe ana hattı (87–98), Kayakent 90 Kırmızı, Yunus Emre 101, kent hatları 17/18/51 ve OtobEs26. Sayı, gün türü/koşulu ayrı kayıtları kapsar; 276 farklı günlük araç veya tüm kent ağı iddiası değildir. [EBB otobüs sorgusu](https://www.eskisehir.bel.tr/otobus-saatleri) kaynaktır. Katalogdaki 14 ilçenin tamamında turistik durak bulunması, hepsine her gün aynı gün gidiş-dönüş otobüs bağlantısı bulunduğu anlamına gelmez.

- Kaynak kontrolü 2026-09-08’dir. Belediyenin yayımladığı tarife güncelleme tarihi ayrı saklanır; 2023, 2024 veya 2025 tarihli yayın bugüne ait yeni tarife gibi etiketlenmez. Otobüs terminal saatleri kurum verisidir. Güzergâh sırası kaynakla eşleştirilir; ara durak geçişi, sürüş süresi, yürüme bağlantısı ve kilometreler editoryal tahmindir. Resmî durak koordinatı veya canlı varış verisi yoktur.
- [ESTRAM sıklık tabloları](https://www.estram.com.tr/sefer-sklik.php?cat_icerik=5) ve [hat şeması](https://www.estram.com.tr/sayfalar.php?sayfalar_id=19), 1 (Otogar–SSK), 3 (OGÜ–SSK), 4 (Otogar–OGÜ) hatlarını destekler. İlk/son servis ve 8–22 dakikalık zaman aralıkları uygulanır. 26 Haziran 2026 başlangıçlı tablo ve 24 Temmuz cumartesi/pazar düzenlemesi dikkate alınır. Tramvay için bir tam sefer aralığı bekleme ayrılır; dakika kesin hareket saati diye sunulmaz. Görsel kaynaklar sırasıyla `small_871-5-2026-07-23-1784809185.jpg`, `small_870-5-2026-07-23-1784809225.jpg`, `small_869-5-2026-07-23-1784809269.jpg` (ESTRAM `/img_icerik/2026/`).
- Tarih zorunludur. Hafta içi/cumartesi/pazar tarifesi tarihten seçilir. Resmî/dinî tatil takvimi otomatik indirilmez; kullanıcı tatil tarifesi kutusunu işaretler. Tatil hizmeti doğrulanmayan hatlar o gün hesaplanmaz. Özel günler ve anlık iptaller kurumdan kontrol edilir. Kontrol tarihinden 30 günden uzak tarihler taslak uyarısı alır.
- Mihalgazi 94 hattının yeşil 10:00/14:00 seferi yalnız cuma/cumartesi çalışır. Okul dönemi koşullu turuncu seferler, gece görevleri ve Han hattındaki iki farklı köy güzergâhına bağlı renkli kayıtlar otomatik hesap dışında tutulur; resmî sayfaları görülebilir. Sadece DAKİKA sütunu sunan normal kent otobüslerinde hafta sonu otomatik varsayılmaz. OtobEs26 sadece yayımlanmış hafta sonu kayıtlarıyla kullanılır. Ücret/bilet rezervasyonu yapılmaz.
- `findTransitLeg` zaman bağımlı bağlantı arar; en çok üç araca binilir. Otobüste 10, tramvayda 5 dakika biniş payı ve SSK tramvay–otobüs geçişinde 20 dakika yürüyüş tahmini vardır. Aynı bölgedeki ziyaretler yürüyüşle bağlanır. Bir ilçenin merkezine gelen hat, Yazılıkaya/Gürleyik/Pessinus gibi ayrı bir alana giden sefer olarak yorumlanmaz.
- `DayPlan.start` gerçek günlük çıkışı taşır. Kullanıcı erken pencere açtıysa 07:00, 08:00, 09:00 çıkışları da sınanarak gereksiz bekleme azaltılır; en erken tercihin önüne geçilmez. Dönüş, yemek, az yürüme ve günün zaman sınırları zorunludur. Örneğin 97 Seyitgazi’de 17:20 şehir çıkışı / 08:00 ilçe dönüşü, gündüz şehirden gezi için uygun sayılmaz.
- Toplu taşıma kartı hat/yön, biniş/iniş, terminal kalkışı, tahmini ara geçiş/varış, bekleme ve yürüyüşü gösterir. Google Maps’e yürüme/araç etapları ayrı aktarılır. PDF’de ulaşım satırları, `.ics` içinde dönüş dâhil her araç etabı ve 10 dakika önce hatırlatma bulunur. Etkinlikler taslaktır; canlı sefer takibi veya takvim hesabına yazma yapılmaz. Anlık bilgi için [ESTRAM Mobil](https://www.estram.com.tr/sayfalar.php?sayfalar_id=23) bağlantısı verilir.

Tarife güncelleme: `python scripts/refresh-transit.py`. Komut yalnız yayımlanmış 18 sayfayı okur; iki yön/kolon/zaman yapısını doğrular ve bütün yanıtlar başarılıysa tek dosyayı değiştirir. Renkli yeni koşullar varsayılan olarak kullanılmaz. `git diff`, güzergâh/koşul incelemesi ve `node --test tests/route-engine.test.mjs` sonrası yayımlanmalıdır. Tramvay görsellerindeki değişiklikler ayrıca incelenir. Bu sürüm canlı API veya otomatik günlük eşitleme iddiası taşımaz.
