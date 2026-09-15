# Eskişehir Gençlik Film Festivali — web demo

Son proje dosyası ve EGFF Uygulama Sunumu esas alınarak hazırlanmıştır. İlk edisyon: 24–27 Haziran 2027.

## Kullanım

- Ana sayfa: Festival, Akademi, Frigya Rotası ve proje ayrıntıları.
- Film başvurusu: Dört doğrudan bölüm, beş adımlı form, ortak yönetmen, yaş / süre / yapım tarihi kontrolü, izleme bağlantısı, metinler, belge ekleri, taslak kaydı, mükerrer film kontrolü.
- Takip: Başvuru e-postası + gizli takip kodu; işlem geçmişi ve düzeltme gönderimi.
- Katılım: Akademi, çekim mekânı, gençlik jürisi ve gönüllü başvuruları.
- Çalışma alanı: Uygunluk kontrolü, gerekçeli kararlar, beş iş günlük düzeltme süresi, jüri ataması, bağımsız puanlama, çıkar çatışması, üçüncü değerlendirme, seçki taslağı, program düzenleme ve CSV.
- Program: Gün / tür filtresi, takvim dosyası ve kapasite kontrollü demo rezervasyonu. Ücret veya kart bilgisi alınmaz.

Demo panelinde parola gerekmez. Sekretarya veya ön jüri rollerinden biri seçilir. Örnek kişilerin ve filmlerin tamamı kurgusaldır. Gerçek filmler demo izleme adreslerinde barındırılmaz.

## Örnek sunum akışı

1. Film başvurusu ekranında “Örnekle doldur” düğmesini kullan; beş adımı tamamla ve gönder.
2. Verilen takip kodunu indir. Aynı e-posta ve kodla Takip ekranında kaydı aç.
3. Çalışma alanından “Sekretarya / Yönetici” rolüne gir. Yeni başvuruyu bul; gerekçeyle düzeltme iste.
4. Takip ekranında başvurunun durumunu yeniden sorgula; ekleri düzeltip gönder.
5. Sekretarya rolünde uygunluğu onayla; `juri-1` ve `juri-2` kullanıcılarını ata.
6. Çıkış yap, jüri rolüne geç. Her kullanıcı kendi puanını verir; diğer puanları göremez. 20 puanı aşan farkta üçüncü değerlendirme gerekir.
7. Sekretaryada puanlaması tamamlanan filmi gerekçeyle seçkiye al; türetilen seçki taslaklarını hesapla.
8. Programda temsili bir rezervasyon oluştur; yönetimde kaydı ve program düzenlemelerini göster.

## Demo ve canlı kullanım

GitHub Pages sürümü **demo** modundadır. IndexedDB ile yalnız mevcut tarayıcıda kayıt tutar. Başvurular sekretaryaya veya başka cihazlara iletilmez; tarayıcı verileri silinirse kaldırılır. Film izleme bağlantıları örnektir. E-posta, ödeme, gerçek bilet, seyirci oylaması ve tören yayını bağlı değildir.

Canlı kayıt için bu pakette ayrıca Node.js + SQLite başvuru hizmeti bulunur. Başvurular ve ekler AES-256-GCM ile şifrelenir; başvurular tek tek saklanır. Takip kodları rastgele, uzun ve gizlidir. Görevli parolaları scrypt ile özetlenir; bir saatlik görevli oturumu ve rol bazlı sunucu kontrolleri vardır. Kayıtlar yeniden başlatmadan sonra korunur. Başvuru dosyaları GitHub deposuna yazılmaz.

Canlıya geçiş yalnız bir görsel düğme değildir. Resmî yönetmelik ve aydınlatma metni, gerçek görevli hesapları, HTTPS üzerinden başvuru sunucusu, kalıcı disk ve yedekleme düzeni, e-posta bildirimleri ve gerekirse bilet satış sağlayıcısı yapılandırılmalıdır. KVKK metni bu demo içinde resmî metin olarak üretilmemiştir. Canlı kişisel veri toplama açılmadan önce yetkili kurumun bu içerikleri ve saklama politikasını tamamlaması gerekir.

## Kaynaklar arası kararlar

- Son uygulama sunumu dört doğrudan bölüm içerir: Kurmaca 12, Belgesel 8, Öğrenci 8, Uzun Metraj 4. Uygulamada bunlar esas alınır.
- Gençlik Jürisi 15 ve Eskişehir’de Çekilmiş Film 6 kontenjanı türetilir. 53 kontenjan, örtüşmeler nedeniyle 53 farklı film demek değildir.
- Ana dosyadaki 2027 seçki hedefi 30 olarak kaynak tablosunda korunur; güncel doğrudan bölüm toplamı 32’dir. Ön jüri iş yükü hesabındaki 500 başvuru ise kapasite varsayımıdır; ana dosya 2027 hedefi 400’dür.
- Uluslararası davetli seçki ana dosyada yarışma dışı olarak bulunur; doğrudan başvuru türü değildir.
- 31 Mart 2027 itibarıyla 30 yaşını doldurmamış olma koşulu tüm ortak yönetmenlere uygulanır. Yaş, süre, tamamlanma tarihi ve bölüm gönderimden sonra düzenlenmez.
- Gençlik jürisi yaş hesabında demo için 24 Haziran 2027 kullanılır; bu tarihin resmî yönetmelikle teyidi gerekir.
- Beş iş günü hesabı hafta sonunu atlar. Canlıya geçmeden `OFFICIAL_HOLIDAYS` alanı onaylı resmî tatillerle doldurulmalıdır.
- Uzatma önerisi ile sabit değerlendirme takvimi arasındaki karar organizasyona bırakılmıştır; sistem kendiliğinden başvuru süresi uzatmaz.

## Geliştirme

Node.js 24 ve paket dosyasında belirtilen pnpm sürümü kullanılır. Bağımlılıklar kilit dosyasıyla korunmuştur.

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm dev
pnpm build
pnpm exec tsc --noEmit
node --test tests/workflow.test.mjs
```

`dist/` dizini tamamen statiktir; GitHub Pages altında herhangi bir alt klasöre taşınabilir. İç bağlantılar hash yönlendirmesiyle çalışır; sunucuda route rewrite gerekmez. `public/runtime-config.js` çalışma modunu belirler. Demo için `mode: 'demo'`, canlı için `mode: 'live'` ve HTTPS `apiBase` kullanılır. Canlıda sunucu ulaşılamıyorsa kayıt sessizce tarayıcıya düşmez; hata gösterilir.

## Bu depodaki yayın

Kaynak kod `festival/` klasöründedir. GitHub Pages yayını `public/film-festivali/` içindeki derlenmiş dosyalardan oluşur. Güncellemede `festival/` içinde `pnpm build` çalıştırılır; oluşan `dist/` içeriği deponun `public/film-festivali/` klasörüne kopyalanır ve birlikte commit edilir. Depodaki mevcut Pages iş akışı yayını tamamlar.

## Başvuru sunucusu

1. `server/.env.example` dosyasını `server/.env` olarak kopyala; 32 rastgele baytlık anahtarı base64 olarak üret ve `EGFF_ENCRYPTION_KEY` alanına yaz. Anahtar, parola veya `.env` dosyası asla GitHub’a eklenmez.
2. `ALLOWED_ORIGINS` içine sitenin tam origin değerini yaz; yol ekleme. Verilen değer sadece örnektir.
3. `EGFF_NEW_PASSWORD` ortam değişkenine en az 14 karakterli bir parola atayarak `node server/create-user.mjs admin admin` çalıştır. Diğer hesaplar için `node server/create-user.mjs juri-1 reviewer` kullan. Açık parola dosyaya kaydedilmez.
4. Canlı başvuruları `node --env-file=server/.env server/server.mjs` ile veya Docker Compose ile çalıştır. `data/` kalıcı disk üzerinde olmalı, konteyner kullanıcısı yazabilmeli ve ayrı güvenli yedekleri alınmalıdır. HTTPS ters vekil üzerinden sun.
5. Film başvuru dönemi varsayılan olarak 1 Aralık 2026–31 Mart 2027’dir. Diğer katılım formları `REGISTRATIONS_ENABLED=true` yapılana kadar kapalıdır.
6. Yönetim panelinden program etkinliklerini ekle ve yayımla. Canlı veritabanı demo kişiler veya temsili etkinliklerle doldurulmaz.
7. Siteye gerçek `privacyUrl` ve `rulesUrl` adreslerini ekle. Site genelindeki demo anlatımını ve kalan taslak duyuruları resmî içerikle güncelle. Bilet/ödeme ve otomatik e-posta hizmeti bu sürümde aktif değildir.

API: `GET /health`, `GET /public`, `POST /applications`, `POST /track`, `POST /correction`, `POST /staff/login`, `POST /staff/logout`, `GET /staff/state`, `POST /staff/detail`, `POST /staff/action`.

## Doğrulama

TypeScript kontrolü ve üretim derlemesi başarılıdır. İşlev testleri; yaş/süre/tarih/metin sınırları, ortak yönetmen, eksik belge, bağımsız puanlar, çıkar çatışması, 20 puan farkı, mükerrer film, yetkisiz erişim, şifreli dosya kalıcılığı, sunucu yeniden başlatma, düzeltme alanlarının değişmezliği ve etkinlik yayımlamayı kapsar.

Bu oturumda tarayıcı üzerinde görsel QA yapılmadı; mobil düzen 600 / 900 / 1200 piksel eşiklerinde kaynak düzeyinde düzenlendi. WebMCP desteği özellik algılamayla eklenmiştir; destekleyen bir tarayıcıda çalıştırma doğrulaması yapılamadı.

## Görsel kaynakları

- Ana görsel: bu festival sitesi için ImageGen ile oluşturuldu; gerçek festival fotoğrafı değildir.
- Midas Anıtı: Zeynel Cebeci, Wikimedia Commons, CC BY-SA 4.0. Kaynak: https://commons.wikimedia.org/wiki/File:Midas_Monument,_Yaz%C4%B1l%C4%B1kaya.jpg . WebP boyutlandırması ve görüntü alanına kadraj uyarlaması yapılmıştır. Türetilen fotoğraf aynı lisansla sunulur. Lisans: https://creativecommons.org/licenses/by-sa/4.0/ .
- Proje dosyası: Imeras Pro., Ağustos 2026. Kullanıcının sağladığı Word proje dosyası ve uygulama PDF’si içerik kaynağı olarak kullanılmıştır. Özgün dosyalar kamuya açık yayın ve kaynak arşivine dahil edilmemiştir.

Dijital deneyim: Ratel Dijital.
