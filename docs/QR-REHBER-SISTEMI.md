# QR keşif sistemi · Eskişehir Cebimde 1.1

Uygulamanın yeni ana ekranı keşif, kişisel rota ve QR okumayı öne çıkarır. Alt menü: Keşfet, Rota, QR keşif, Gezilerim, Birlik. Kurumsal web içeriği Birlik bölümünden erişilebilir; normal web görünümü korunur. Beş dil ve Arapça sağdan sola düzen desteklenir.

## Araştırmadan alınan kararlar

- **Bloomberg Connects:** Kurumların hazırladığı kısa ve ayrıntılı anlatımları bir arada sunması, metne erişimi ses ve görüntünün yanında tutması örnek alındı. Bizde kısa anlatım hemen görünür; ziyaret notları, miras statüsü ve kaynaklar isteğe bağlı açılır. Sesli okuma cihazın motoruyla yapılır ve stüdyo kaydı olarak sunulmaz. [Resmî ürün açıklaması](https://www.bloombergconnects.org/), [sık sorulan sorular](https://www.bloombergconnects.org/faq/).
- **SmartGuide:** QR’dan web rehberine erişim ve kurulu uygulamada devam edebilme yaklaşımı örnek alındı. Bizde dış kamera HTTPS sayfasını açar; kurulu uygulamaya geçiş için açık bir düğme vardır. Uygulamanın içindeki tarayıcı aynı kodu doğrudan yerel kataloğa çözer. [Resmî ürün açıklaması](https://www.smartguide.app/).
- Bu örneklerin ücret, ortaklık, ziyaretçi sayısı veya saha kurulumuna ilişkin iddiaları Eskişehir adına kullanılmadı. Mevcut demo giriş koruması devam eder.

## Kodlar ve akış

`lib/qr/registry.ts` 47 mevcut nokta için E-0001…E-0047; 43 tema için R-0001…R-0043 içerir. Tüm 14 ilçe temsil edilir. Kodlar sabittir: yeni kayıtlar sona eklenir, kaldırılan kimlikler yeniden kullanılmaz. Sıralama veya içerik değişikliği eski bir tabelayı farklı bir esere yönlendirmemelidir.

- **E kodu:** Eser/bölge özeti → miras veya ilçe anlatısı → isteğe bağlı ayrıntı, ziyaret notu, yerel ürün, kaynak → bu durağı zorunlu tutarak rota oluşturma veya yol tarifi.
- **R kodu:** Temanın durakları → kişiselleştirme → belirtilen tüm durakların süre/ulaşım kısıtları içinde bulunmasının kontrolü. Uzun bir koridor için uygun başlangıç ve çok günlük plan kullanılır.
- **Kişisel gezi QR’ı:** Tercihler, katalog sürümü ve plan kimliği sıkıştırılmadan kompakt JSON/base64url içinde taşınır. Tarama sonrası tarihler ve duraklar incelenir; ziyaret otomatik başlamaz, mevcut geziler silinmez. Katalogla üretilemeyen plan için açık bir uyarı ve tercihleri yeniden açma seçeneği vardır.
- Kamera, yerel fotoğraf dosyası ve elle girilen kısa kod desteklenir. Kamera yalnızca kullanıcının tarama isteğiyle açılır; kapanınca ve uygulama arka plana geçince durdurulur. Fener yalnızca cihaz desteklediğinde görünür.
- Tarama geçmişi en fazla 12 kod olarak cihazda tutulur ve temizlenebilir. Kamera görüntüleri, QR içeriği ve konum bir analiz sunucusuna gönderilmez.

## İçerik ve erişim

Bilgilendirme mevcut İl Kültür ve Turizm Müdürlüğü, UNESCO ve tescil kaynaklarıyla ilişkilendirilmiş turizm kataloğuna dayanır. Bir UNESCO geçici liste kaydı, Dünya Mirası olarak gösterilmez. İlçe anlatıları mevcut ilçe envanterinden uyarlanmıştır. Müzelerin tek tek koleksiyon eserleri için envanter numarası, eser adı, görsel kullanım hakkı ve kurumca onaylanmış metin ayrıca alınmalıdır; uydurma eser kayıtları eklenmemiştir.

Uygulama paketinde rehber metinleri ve kod eşlemesi çevrim dışı çalışır. Dış harita, kaynak sayfası ve bağlantı paylaşımı internet gerektirebilir. Android sesli okuma kurulu çevrim dışı dil sesini kullanır; ses eksikse kullanıcı bilgilendirilir. Web sesli okuma tarayıcının desteğine bağlıdır.

Dış bağlantı yalnızca bu deponun HTTPS QR yolu veya `etahb://qr` uygulama şeması için çözümlenir. Keyfî internet adresleri açılmaz. Bilinmeyen kimlik, tekrarlanan parametre, fazla uzun içerik, geçersiz tercih veya desteklenmeyen sürüm reddedilir. Bu doğrulama fiziksel etiketin değiştirilmesini tespit eden bir imza sistemi değildir. Resmî logolu tabela ve görünür kısa kod, saha bakım süreciyle birlikte kullanılmalıdır.

## Tabela ve kurum kullanımı

Her rehberin “QR ile paylaş” alanı, okunabilir kod görseli ve kısa kodu birlikte sunar. Aynı alandan A5 kart yazdırılabilir veya cihazın yazdırma arayüzünde PDF olarak kaydedilebilir. Kodun içine logo bindirilmez; beyaz boşluk korunur. Kısa kod kameraya alternatif olarak kart üzerinde görünür.

Dijital kodların hazır olması, fiziksel tabelaların yerleştirildiği anlamına gelmez. Alan işletmecisinin içerik kontrolü, yerleştirme izni, baskı malzemesi, farklı telefonlarda saha okuma denemesi ve hasarlı etiket kontrolü kurumun uygulama aşamasındadır. QR hedef alan adının üretim için kalıcı seçilmesi gerekir; mevcut kartlar bu projenin GitHub Pages adresini kullanır. Kod eşlemesi güncellenebilir, basılmış adresin alan adı değişmez.

Yeni eser ekleme: doğrulanmış nokta/tema → kalıcı kod → beş dilde metin ve kaynak → uygulama derlemesi → karta baskı. Yönetim paneli, toplu uzaktan içerik senkronizasyonu ve kişisel ziyaretçi analitiği bu sürümde yoktur.

## Doğrulama ve sınırlar

90 katalog QR’ının gerçek PNG çıktıları uygulamadaki okuma motoruyla çözümlendi. Kişisel plan aktarımı, kötü biçimlendirilmiş girişler, kaynak dışı URL/kimlikler, yerel geçmiş ve 43 temanın zorunlu durakları otomatik olarak kontrol edildi. Bunlar fiziksel tabela, kamera odağı veya gerçek telefonda kullanılabilirlik testi yerine geçmez.

Android kamera izni, yerel sesli okuma ve uygulama bağlantısı eklendi. iOS kaynak karşılıkları hazırdır; Xcode derlemesi ve cihaz testi bu Linux ortamında yapılmadı. Canlı yapay zekâ için önceki API/sunucu kurulum gereksinimi değişmedi; QR rehberi yapay zekâ varmış gibi sunulmaz.

Teknik kaynaklar: [jsQR](https://github.com/cozmo/jsQR), [node-qrcode](https://github.com/soldair/node-qrcode). QR kodları standart üretici kütüphanesiyle oluşturulur; temsili karelerden çizilmez. İlk değerlendirilen ZXing tarayıcısında bir gerçek katalog kodu çözümlemesi başarısız olduğundan, aynı kodlar jsQR ile doğrulanarak okuma motoru değiştirildi.
