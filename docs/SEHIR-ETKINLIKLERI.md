# Şehir etkinlikleri · Eskişehir Cebimde 1.4

## Ziyaretçi deneyimi

`/etkinlikler` ve dört yabancı dil karşılığı eklendi. Ana ekrandaki “Şehirde ne var?” kartı ve masaüstünde Eskişehir menüsü takvimi açar. Mevcut beş mobil alt sekme korunur. Yaklaşan, bugün, yedi gün, duyuru ve geçmiş ayrımı; ilçe, tarih, tür ve metin araması birlikte çalışır. Kartlar kısa tutulur, kaynak ve katılım ayrıntıları erişilebilir yan panelde açılır. Mobilde seçim özeti küçük bir alt çubukta görünür.

Ziyaretçi profil açmadan etkinlik seçebilir. Rota tercih formunun üçüncü adımındaki isteğe bağlı etkinlik seçici mevcut gezi tarihlerini değiştirmez. Takvimden yeni program oluşturulurken önerilen gün aralığı ve dönüş saati onay düğmesinden önce gösterilir. Etkinlik eklemek bilet alma veya rezervasyon işlemi değildir.

## Kaynaklar ve doğrulama

İlk kayıtlar 9 Eylül 2026 tarihinde kurumların kendi duyurularından kontrol edildi:

- [Büyükşehir / Belkent Yeşilçam Geceleri](https://www.eskisehir.bel.tr/icerik-detay.php?cat_icerik=1&icerik_id=13262&menu_id=24): 11, 18, 25 Eylül 2026, saat 20.00, Aktif Yaşam Parkı. Film ve resmî bitiş saati açıklanmıyor.
- [Ekonominin Rotası](https://www.eskisehir.bel.tr/icerik-detay.php?cat_icerik=1&icerik_id=13265&menu_id=24): 26 Eylül 2026, 19.00, Atatürk Kültür, Sanat ve Kongre Merkezi.
- [Tepebaşı etkinlik takvimi](https://www.tepebasi.bel.tr/Etkinlikler): 14 Eylül futbol turnuvası başlangıcı ve 27 Eylül gençlik tiyatrosu öğrenci alımı duyurusu. Turnuva sahasının rota konumu doğrulanmadığı için otomatik rotaya alınmaz. Öğrenci alımı bir oyun seansı gibi sunulmaz.
- [Şehir Tiyatroları sezon duyurusu](https://tiyatro.eskisehir.bel.tr/haberdetay.php?haber=13359): Verimsizler için kesin seans verilmediğinden duyuru olarak gösterilir. [Eylül oyun takvimi](https://tiyatro.eskisehir.bel.tr/oyuntakvimi.php) kontrol edildi; bu kontrol sırasında tarihlenmiş oyun kaydı yoktu.
- [Odunpazarı etkinlik sayfası](https://www.odunpazari.bel.tr/guncel/etkinlikler), [Valilik](https://www.eskisehir.gov.tr/), [İl Kültür ve Turizm Müdürlüğü](https://eskisehir.ktb.gov.tr/TR-447105/2026-haberler-ve-duyurular.html), [Senfoni Orkestrası](https://senfoni.eskisehir.bel.tr/) ve ilçe kurumları kaynak ağına dâhildir.

Bu veriler tüm özel organizatörleri veya bütün kurum etkinliklerini kapsadığı iddiasını taşımaz. Kurumların tamamında ortak API/ICS takvimi bulunmuyor. Kurum sitesi erişilemiyorsa “etkinlik yok” denmez. Kaynak ekranı erişim durumunu ayrı gösterir. Etkinlik adları kurumun özgün dilinde, arayüz beş dilde sunulur.

Mekân eşleştirmeleri `lib/events/venues.ts` dosyasında kaynaklarıyla tutulur. Aktif Yaşam Parkı'nın Sazova konumu [Büyükşehir tanıtımından](https://www.eskisehir.bel.tr/sayfalar.php?sayfalar_id=158); kongre merkezinin açık adresi [Senfoni iletişiminden](https://senfoni.eskisehir.bel.tr/yonetim.php) doğrulandı. Bunlar bölge düzeyinde ulaşım tahminidir; canlı harita mesafesi veya kesin kapı koordinatı olarak sunulmaz.

## Güncelleme

`GET /api/events` D1'deki son kayıtları döndürür, zamanı gelen kaynak grubunun kontrolünü arka planda başlatır. Güncelle düğmesi `?refresh=1` ile sıradaki dört kaynağın kontrolünü bekler. Başarılı denemeden sonra altı saat, başarısız denemeden sonra otuz dakika yeniden deneme aralığı uygulanır. Atomik iki dakikalık işlem kilidi paralel isteklerin aynı kurumu tekrar tekrar taramasını önler. Bu mekanizma ziyaretle tetiklenir; kesintisiz bir zamanlanmış arka plan servisi değildir.

Tepebaşı'nın tarih/saat/yer alanları ve Büyükşehir'in açık tarihli duyuruları için ayrı okuyucular vardır. Diğer kaynaklarda Schema.org Event verisi ve aynı kurumdaki en fazla iki takvim bağlantısı kontrol edilir. Afiş görselleri OCR ile tahmin edilmez. Okunamayan metinler veya geçmiş haberler geleceğe ait etkinlik olarak üretilmez. Başarısız kaynak kontrolünde etkinliğin son doğrulama zamanı yenilenmez. Aynı kaynağın tekrar yayımladığı seanslar birleştirilir; farklı seanslar korunur.

Yetkili yönetici `/yonetim` içindeki etkinlik formundan kaynağı inceleyerek bir kayıt ekleyebilir, düzeltebilir, iptal veya ertelenmiş olarak işaretleyebilir. Bu yetki ortak demo şifresinden veya ziyaretçi profilinden kazanılamaz. Form `PUT /api/community/admin/events` kullanır. Resmî kaynak adresi ve veriler sunucuda doğrulanır; eşzamanlı düzenlemede mevcut veri değiştiyse işlem reddedilir. İncelenmiş kayıt aynı kimlikteki otomatik aktarımı geçersiz kılar; bir sonraki tarama iptali geri alamaz.

## Rotalama sözleşmesi

Tercihlerde yalnızca etkinlik kimlikleri ve açıklanmamış bitiş için kullanıcının ayırdığı süre taşınır. Kaynak, saat ve mekân paylaşım bağlantısından güvenilir kabul edilmez; katalogdan çözülür. Bilinmeyen kimlikler sessizce düşürülmez, uyumsuzluk olarak bildirilir.

- En fazla dört günde, gün başına iki etkinlik. Günlük plan 06.00–23.30 sınırları içindedir; gece yarısını aşan etkinlik desteklenmez.
- Etkinlik başlangıcı sabittir. Kullanıcı en az yirmi dakika önce mekâna ulaşmalıdır. Doğrulanmış mekân için son erişim payı da hesaba katılır.
- Ziyaret sırası ve etkinlik aralıkları birlikte değerlendirilir. Öğle/akşam yemeği, müze kapanışı, zorunlu duraklar, seçilen ilçeler, yürüyüş/bisiklet sınırları ve başlangıç noktasına dönüş korunur.
- Toplu taşımada mekândan çıkış süresi, araç aranmadan önce saate eklenir; yolculuk geçmiş bir sefere bindirilmez. Dönüş yoksa farklı ulaşım aracı icat edilmez.
- Tarih, saat veya mekânı eksik; iptal/ertelenmiş; başlangıcı geçmiş ya da 72 saattir doğrulanmamış etkinlik yeni rotaya eklenmez.
- Resmî bitiş yoksa kullanıcı 15–360 dakika arasında planlama süresi vermelidir. Arayüz bunu “planlanan ayrılış” olarak gösterir; resmî bitiş iddiası yapılmaz.
- Ücretsiz-only ve kapalı alan tercihlerinde bilinmeyen ücret/alan bilgisi uygun kabul edilmez. Çakışma veya ulaşım sorunu boş sonuçta açıklanır; seçilen etkinlikler kaldırılmaz.

Etkinlikler kayıtlı gezilerde, harita yönlendirmesinde, rota QR'ında, topluluk rota doğrulamasında, kurumsal PDF'de ve ICS takviminde korunur. ICS etkinlik kaydı geçici katılım olarak işaretlenir, zaman aralığını meşgul gösterir ve yirmi dakika önce hatırlatıcı içerir. Telefonun takvim içe aktarma/hatırlatıcı davranışı cihaz uygulamasına bağlıdır. Kaydedilen program kaynak anlık görüntüsüdür; yola çıkmadan yeniden kontrol bağlantısı bulunur.

Gerçek yapay zekâ hizmetinin yapılandırma durumu değiştirilmedi. Etkinlikli rota, kurallı zamanlama motoruyla çalışır. Gelecekte yapay zekâ yanıtı gelse de seçilmiş etkinlikler motorun bağımsız doğrulamasından geçer.

## Doğrulama

`tests/events.test.mjs` gerçek zamanlayıcıyı, aktarım okuyucularını ve SQLite üzerinde D1 API sözleşmesini sınar: sabit saat, iki etkinlik, çok gün, eksik/iptal/eski kayıt, belirsiz bitiş, erişilemeyen ilçe ulaşımı, tüm çıktılar, yetki ve güncelleme kilidi. Mevcut rota, mobil ve topluluk testleri de çalıştırılır. Tarayıcı veya fiziksel cihaz testi bu değişiklik kapsamında yapılmadı.
