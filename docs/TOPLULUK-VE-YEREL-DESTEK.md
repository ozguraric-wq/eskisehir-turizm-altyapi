# Açık demo · Eskişehir Cebimde 1.3

9 Eylül 2026 güncellemesi:

- Ziyaretçilerden profil, kullanıcı adı, parola, e-posta veya sosyal hesap istenmez. Anonim bir demo oturumu otomatik açılır. Ratel kurumsal karşılama ekranı ve yönetici yetkilendirmesi korunur.
- 14 ilçeyi kapsayan 20 örnek rota, 10 öne çıkan yer, 60 kurgusal bot yorumu, örnek beğeni/puanlar ve 8 kaynaklı gerçek fotoğraf eklenmiştir. Topluluk başlığının altında, kartlarda ve kaynak alanında demo niteliği açıkça yazılıdır. Fotoğraflar botların seyahat kanıtı değildir; lisansları `TOPLULUK-FOTOGRAF-KAYNAKLARI.md` dosyasında ve uygulamada yer alır.
- Örnekler gerçek rota motoruyla uyarlanabilir. Yürüyüş ve bisiklet örnekleri belirtilen yerel başlangıç noktasındadır; şehre/ilçeye geliş ayrıca planlanır. Örnek programlar canlı çalışma saati veya rezervasyon garantisi değildir.
- Her ziyaretçi beğeni, puan, yorum, fotoğraf/video içeren rota paylaşımı ve rehber/ev talebini kayıt olmadan dener. Yeni paylaşım ve yorumlar kendi oturumuna ve yetkili inceleme ekibine görünür; başka ziyaretçinin akışına otomatik yayımlanmaz. Metin ve medya kontrolleri korunur.
- Örnek beğenilere yalnızca o ziyaretçinin denemesi eklenir. Bot verileri, gerçek topluluk sıralaması ve ziyaret istatistiğinden tamamen ayrıdır. Demo örneklerini başkası düzenleyemez/silemez; yönetim yetkisi sunucuda doğrulanır.
- Gezi çantası: durak ve şehir rehberinden istenen yerleri saklama, sekiz maddelik hazırlık listesi, kendi deneme paylaşımlarını/taleplerini görme ve tek işlemle demo verilerini silme. D1 kalıcı kayıtları kullanılır; kişisel oturumlar ayrı tutulur. Silme, paylaşılan örnekleri ve cihazdaki çevrimdışı gezi dosyalarını etkilemez.
- Rota araması Türkçe harf ve büyük/küçük harfleri normalize eder; ilçe, ulaşım ve beğeni sıralamasıyla birlikte çalışır. Akış 12 kartlık sayfalarla yüklenir. Fotoğraflar yerel olarak paketlenir; kaynak ve lisans bağlantıları mevcuttur.
- Teknik anonim oturum erişimi 7 gün geçerlidir. Tarayıcıda sekme oturumu, Android/iOS uygulamasında mevcut güvenli kasa korunur. Profil olmadan cihazlar arası kurtarma yoktur. Yeni oturum başlatmak eski hesabı değiştirmez.
- `SOCIAL_DEMO_MODE=false` sunucu ayarı, korunmuş gerçek üyelik akışını geri açar. Varsayılan `true` değeridir. Sabit örnek veri, şema oluşturma komutlarıyla değil idempotent uygulama içe aktarımıyla yüklenir. Yeni şema: `social_demo_seeds`, `social_kit`.
- Rehber/ev talepleri hâlâ demo: hizmet sağlayıcıya iletilmez, ödeme veya gerçek rezervasyon oluşturmaz. Yapay zekâ ve sosyal giriş sağlayıcıları, gerekli kurum bağlantıları/anahtarları kurulmadığı sürece etkinmiş gibi gösterilmez.

Doğrulama: gerçek API işlemleri üzerinde profil gerektirmeyen erişim; 20/10/60 sayıları; tüm 14 ilçe ve uyarlanabilir rota durakları; filtreler; içerik filtresi; oturumlar arası gizlilik; medya ve silme; gerçek istatistiklere demo sızıntısı; mevcut rota ve mobil sözleşmeleri.

---

# Eskişehir Cebimde · topluluk ve yerel destek

9 Eylül 2026 · Mobil 1.2

## Deneyim

Beş ana sekme: Keşfet, Rota, QR, Topluluk, Profilim. Birlik anlatımı ana sayfa ve profilden; Gezilerim profilden ve ana sayfadaki devam kartından erişilir. Kurumsal web içeriği korunur. Yerel destek ve şehir rehberi ana sayfanın iki kısa bağlantısındadır. Rota sonuçlarında ilgili ilçelerin destek seçenekleri açılır panelde gösterilir.

Misafir; resmî içerikleri okuyabilir, QR kullanabilir, rota oluşturabilir ve onaylanmış paylaşımları görebilir. Profil; rota paylaşımı, fotoğraf/video, yorum, beğeni, 1–5 puan ve özel talep kayıtları için gerekir. Gezilerim'in önceki cihaz içi planları korunur. Ziyaret bildirimi gönüllüdür, konum takibi değildir.

## Gerçek kayıtlar ve demo hizmetler

Profil, üyelik, paylaşımlar, yorumlar, puanlar ve talepler D1'de tutulur. Medya, özel R2 alanındadır; onaysız dosya yalnızca sahibi ve içerik yöneticisince okunabilir. Kullanıcıların etkileşim sayıları uydurulmaz. Başlangıçta topluluk akışının boş olması beklenir.

42 sanal rehber: 14 ilçenin her birinde 3 kayıt; ilçe, dil ve ilgi eşleşmesi. 40 sanal ev: ilk 12 ilçede üçer, son iki ilçede ikişer kayıt. Gerçek kişi fotoğrafı, unvan, ruhsat, müsaitlik, telefon veya fiyat üretilmez. Bu kayıtlar rezervasyon değildir. Bağımsız rehber talepleri ve örnek ev talepleri profile özel kaydedilir; gerçek rehber/ev sahibine iletilmez. İptal profilden yapılır.

## Resmî bilgi bankası

İl Kültür ve Turizm Müdürlüğü'nün gezilecek yerler, müzeler, kültür envanteri ve korunan alanlar dizinleri tarandı: 164 kaynak sayfası, 149 ayrı yer/eser tanıtım kaydı. 28 kayıt için kaynak okunarak kısa açıklama yazıldı. Bunlar mevcut 47 ayrıntılı, beş dilde rota durağıyla kaynak/ad eşleşmesi üzerinden birleştirildi. Diğer kayıtlarda resmî başlık, bölge, kategori, tarih ve kaynak bağlantısı gösterilir; ek ayrıntı uydurulmaz. Tam müze koleksiyonlarının veya şehirdeki her eserin eksiksiz sayısallaştırıldığı iddia edilmez.

Yeni bilgi kaydı otomatik olarak rota durağı olmaz. Kesin konum, erişim ve bağlantı süresi doğrulanmadan planlayıcıya eklenmez. 14 ilçe ve Dağlık Frigya ayrı süzülebilir; arama Türkçe işaretleri ve konu eş anlamlarını destekler.

Kamp doğrulaması: İl Müdürlüğü ana sayfasında Bakanlık belgeli kamp/karavan konaklama tesisi olmadığı duyurusu vardır. Bu, belediye veya başka mevzuatla izinli bütün alanların yokluğunu kanıtlamaz. Musaözü için Bakanlığın doğa kaydındaki altyapı atfı saklanır; güncel geceleme izni doğrulanmış değildir. 15 Haziran–15 Ekim 2026 orman giriş kısıtlaması ayrıca gösterilir. Bir park/mesire alanını ruhsatlı kamp veya serbest geceleme alanı saymayın. Yeni kamp kaydında izin, işletmeci, tarihli açık durum ve resmî kaynak kontrol edilmelidir.

151 satırlık TGA konaklama kayıt taramasından önceki sürümde derlenen işletme/basit belge kayıtları korunur; yatırım belgeleri dışarıdadır. Harita araması rezervasyon, müsaitlik veya fiyat teyidi değildir.

## İçerik onayı

Tüm kamu metni istemcide ve sunucuda doğrulanır. Sunucu asıl yetkilidir. Unicode normalizasyonu, bilinen uygunsuz ifadeler, bağlantılar, iletişim bilgileri ve HTML denemeleri kontrol edilir. Bu filtre kusursuz dil anlayışı iddia etmez; geçen içerikler de insan onayı bekler.

Profil adı/biyografi, rota adı/açıklaması, medya açıklaması, yorum ve fotoğraf/video kamuya açılmadan incelenir. Yönetim ekranı `/yonetim/`: profil, rota, yorum ve bildirim kuyrukları. Fotoğraf/video için bütün dosyaları inceleme beyanı gerekir. Bir değişiklik veya ek dosya gönderimi, rotayı yeniden incelemeye alır. İncelenen sürüm değişmişse onay reddedilir. Yükleme ile sürüm artışı aynı D1 işlemi içindedir.

Puan ve beğeni kullanıcı/rota başına tek kayıttır. Kendi rotasına oy verilemez. Bildirimler yöneticinin kuyruğuna gider; topluluğa otomatik açılmaz. Öne çıkanlar yalnızca onaylı ve beğenilmiş rotalardan hesaplanır. En az üç gönüllü bildirim olmadan ziyaret sayısı gösterilmez. Sayılar gerçek ziyaretçi ölçümü olarak sunulmaz.

## Üyelik ve entegrasyonlar

Kullanıcı adı/şifre üyeliği sunucuda çalışır. Şifre açık metin saklanmaz; PBKDF2-SHA256, rastgele tuz ve zaman sınırlı oturum özeti kullanılır. Android oturumu Keystore ile şifrelenir, iOS Keychain kullanır. Webde sekme oturumu yenilemeye dayanır; sosyal içerik tarayıcıda yetkili veri tabanı olarak tutulmaz. Hesap silme profili, bağlı kayıtları ve dosyaları kaldırır. Şifre kurtarma/e-posta doğrulaması bu sürümde yoktur.

Google ve Facebook için gerçek yetkilendirme akışları hazırlanmıştır. Kuruma ait istemci bilgileri bulunmadığından düğmeler kapalıdır; sahte giriş yaptırılmaz. Google: sunucuda kod değişimi, PKCE, imzalı kimlik belirteci, issuer/audience/nonce. Facebook: uygulamaya bağlı kod değişimi ve appsecret_proof. E-posta eşitliğiyle hesaplar otomatik birleştirilmez. Uygulamaya dönüş, kısa ömürlü ve tek kullanımlık bir kodla, istemcinin doğrulayıcısına bağlıdır.

Gerekli sunucu değerleri:
- `SOCIAL_SESSION_SECRET`: en az 32 karakterlik rastgele gizli değer.
- `SOCIAL_PUBLIC_ORIGIN`: kamu API kökeni.
- `SOCIAL_WEB_ORIGIN`: GitHub uygulamasının tam kök yolu.
- `SOCIAL_ADMIN_IDS` / `SOCIAL_ADMIN_EMAILS`: açık yönetici izin listesi. Sites kimliği yalnızca Sites giriş noktasında güvenilirdir; bağımsız Worker istemcinin kimlik başlıklarını kabul etmez.
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`.
- `FACEBOOK_CLIENT_ID`, `FACEBOOK_CLIENT_SECRET`, `FACEBOOK_GRAPH_VERSION`.
- `OPENAI_API_KEY`: gerçek AI bağlantısı için; anahtar olmadan uygulama AI varmış gibi davranmaz.

Google/Facebook dönüş adresi: `SOCIAL_PUBLIC_ORIGIN/api/community/oauth/callback`. Google'da web OAuth istemcisi, Facebook'ta uygulama oturum açma ürünü gerekir. Kurumsal uygulama doğrulamaları ve gerçek sağlayıcı oturum denemeleri hizmet sahibinin hesabıyla tamamlanır. Gizli değerler APK'ya, GitHub'a veya istemciye yazılmaz.

## Yapay zekâ

Önceki rota asistanı korunur; dil modeli tercih önerir, ayrı rota motoru zaman/ulaşım/ilçe koşullarını doğrular. Şehir rehberine kaynak seçimi yapan yeni soru-cevap bağlantısı eklendi: sunucudaki resmî envanterden ilgili kayıtlar, kaynak kimlikleri ve belirsizliklerle Responses API'ye iletilir; dönen kaynaklar izinli listede doğrulanır. Sorular saklanmaz; OpenAI `store:false` kullanılır. Kamu paylaşımları yanıt üretiminde kaynak kabul edilmez. Güncel fiyat, hava, yol durumu, rezervasyon veya kamp izni uydurulamaz.

Anahtar olmadığı için AI kapalıdır. Anahtar eklendiğinde soru-cevap ve isteğe bağlı otomatik metin moderasyonu açılır; insan yayın onayı sürer. Soru ekranı üçüncü taraf işlemeyi açıklar. Kullanıcı ve genel günlük çağrı sınırları vardır.

## Doğrulama ve yayın

Yeni sunucu akışları gerçek SQLite üzerinde üretilmiş D1 migration SQL'iyle sınanır. Testler: özel içerik yetkisi, şifre özeti, filtre, medya imzası, yayın onayı, eski sürüm onayının reddi, tek oy, yorum kuyruğu, demo talebi, envanter kapsamı ve hesap/dosya silme. Rota, QR, otobüs, PDF ve takvim regresyonları korunur. Bu, fiziksel telefon veya gerçek Google/Facebook hesabı testi değildir.

Android test paketi 1.2 / kod 3. Önceki geçici test imza anahtarı saklanmadığından yeni test APK eski kurulumun üzerine yüklenmeyebilir; eski uygulamayı kaldırmak gerekirse cihazdaki Gezilerim kayıtlarını önce paylaşın. Kurumun kalıcı imzalama anahtarı ve mağaza hesaplarıyla üretim dağıtımı ayrıca hazırlanmalıdır. iOS kaynakları güncellenmiştir; Apple imzası ve gerçek cihaz testi gereklidir.

## Kaynaklar

- https://eskisehir.ktb.gov.tr/TR-336883/gezilecek-yerler.html
- https://eskisehir.ktb.gov.tr/TR-436407/kultur-envanteri.html
- https://eskisehir.ktb.gov.tr/TR-70880/korunan-alanlar.html
- https://eskisehir.ktb.gov.tr/
- https://ekotaban.tarimorman.gov.tr/alan/376
- https://tga.gov.tr/kultur-ve-turizm-bakanligi-belgeli-konaklama-tesisleri
- https://developers.google.com/identity/openid-connect/openid-connect
- https://developers.facebook.com/documentation/facebook-login/guides/advanced/manual-flow
