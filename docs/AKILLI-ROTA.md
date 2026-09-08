# Eskişehir Keşif Asistanı — demo v2

8 Eylül 2026. Katalog sürümü: `2026-09-08.1`.

Bu sürüm 33 kaynaklı ziyaret noktası, 36 keşif teması, 10 yemek bölgesi, 5 ulaşım biçimi ve 5 dil içerir. Tema bir tur paketi değildir; ziyaretçinin koşullarına göre alt kümeleri ve farklı sıralamaları denenir. Planlanan Birlik projeleri, kazı izni veya üretici randevusu gerektiren ziyaretler otomatik rotaya alınmaz.

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

1. **Girdi doğrulama:** 1–4 gün, 08:00–13:00 başlangıç, en az üç saatlik pencere, en geç 19:00 dönüş. Yalnız tanımlı kimlikler, modlar, tarihler ve temalar kabul edilir. Paylaşılmış ve kaydedilmiş tercihler de aynı doğrulamadan geçer.
2. **Sert filtreler:** Ziyaret dışı / çıkarılmış duraklar, bilinen kapalı gün, bilet, az yürüyüş ve iç mekân tercihleri. Bisiklet ve toplu ulaşım kent içiyle sınırlıdır. İlçede yürüyüş seçilirse o ilçedeki başlangıç çevresinde kalınır.
3. **Yolculuk modeli:** 14 bölgeden oluşan seyrek bir bağlantı grafiği ve yuvarlatılmış mesafe varsayımları. Floyd–Warshall ile bu editoryal grafikte en kısa bağlantı hesaplanır. Yakın duraklar için seçili kısa bağlantılar; kalan aynı bölge bağlantılarında koruyucu varsayımlar kullanılır. Bu bir gerçek karayolu grafiği değildir; Haversine mesafesiyle dağların içinden kestirme yapılmaz. Tablodaki kilometreler kamu kurumunun ölçümü değildir.
4. **Ulaşım zamanı:** Kısa bağlantıda yürüyüş; bisiklette 14 km/sa, kent içi araçta 25 km/sa, kırsal otomobilde 55 km/sa ve motosiklette 50 km/sa gibi model hızları. Toplu ulaşımda bekleme, araçta park, uzun sürüşte dinlenme süreleri eklenir. Motosiklet için hız yarışı teşvik edilmez; karayolu erişimi kullanılır.
5. **Aday üretimi:** Her temanın uygulanabilir alt kümeleri oluşturulur. Sakin/aile planında en fazla üç, diğer planlarda en fazla dört ziyaret değerlendirilir. Alt kümelerin bütün sıralamaları denenir. Tema havuzu dışındaki rastgele yer adları üretilmez.
6. **Zamanlama:** Ziyaret, transfer, park, bekleme, öğle yemeği ve dönüş birlikte programa girer. Öğle molası 12:00–14:00 penceresinde, yerel yemek bölgesinde veya taşınan öğün olarak yerleşir. 19:00 dönüşlü uzun günlerde gerekli akşam molası da süreye sığmalıdır. Yemek transferinin mesafesi ve süresi toplamdan düşülmez.
7. **Uygunluk:** Dönüş zamanını, günlük yürüyüş sınırını, bisiklet mesafe sınırını veya toplam günün ulaşım payını aşan aday tamamen reddedilir. Uygun plan yoksa açık boş durum gösterilir. Eksik gün tam gezi gibi sunulmaz.
8. **Sıralama:** İlgi kapsamı, seçili tema, deneyim biçimi, ziyaret süresi ve yeni ilçe kazanımı ödüllendirilir; fazla ulaşım cezalandırılır. Bu bir optimizasyon puanıdır, yapay bir “%97 yapay zekâ eşleşmesi” değildir ve ziyaretçiye yüzde olarak gösterilmez.
9. **Çok günlük birleşim:** 32 adaylık beam search ile günler birleştirilir. Aynı mekân iki gün kullanılmaz. Alternatifler Jaccard benzerliğiyle süzülür; neredeyse aynı rotalar tekrar edilmez. Global matematiksel optimum garantisi yoktur.
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

`node --test tests/route-engine.test.mjs` gerçek TypeScript motorunu sınar: 60 mod/gün/tempo birleşimi, zaman çakışması, gidiş-dönüş, öğün, kapalı gün, az yürüyüş, bilet, iç mekân, çıkarılan durak, boş sonuç, parametre doğrulama, deterministik paylaşım ve beş dilde ayrıştırma. 36 temadan en az 40 farklı uygulanabilir plan üretimi ayrıca doğrulanır.

Görsel tarayıcı testi bu güncellemede yapılmadı. Sayfa üretimi, mevcut kurumsal içerik ve giriş akışı testleri ile GitHub Pages derlemesi ayrıca doğrulanır. GitHub Pages girişinin mevcut koruma modeli bu değişiklik kapsamında değiştirilmemiştir.
