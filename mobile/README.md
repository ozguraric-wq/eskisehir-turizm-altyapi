# Eskişehir Cebimde — mobil uygulama

Web sitesiyle aynı kaynak kodunu ve aynı kurumsal içeriği kullanan Android/iOS uygulaması. Ana sayfa, birlik, projeler, 14 ilçe, Lezzet & Miras ve beş dil korunur. Bu paket mağazaya yayımlanmış bir uygulama değildir; Android çıktısı inceleme için imzalanan test APK’sıdır.

## Bu sürümde çalışanlar

- Cihaza paketlenmiş sayfalar ve turizm kataloğu; internet olmadan içerik okuma ve yerel rota hesaplama. Harita, dış kaynaklar, uzaktaki video ve yapay zekâ internet ister.
- Beş sekmeli uygulama menüsü; küçük ekranda açılır durak ayrıntıları.
- 14 ilçeyi kapsayan, otomobil/motosiklet/bisiklet/yürüyüş/toplu taşıma seçenekli rota motoru. Ulaşım tablosu canlı araç verisi değil, tarihli kaynak kaydıdır.
- En fazla 8 “mutlaka görülecek” durak. Her biri sonuçta bulunmak zorundadır; süre veya diğer kısıtlar bunu engelliyorsa uydurma alternatif verilmez.
- Sabah 06.00–akşam 19.00 aralığında gezi planlama; bitiş saatini aşmayan programlar ve yerel yemek molaları.
- Bu cihazda 40 geziye kadar saklama, gezilen durakları işaretleme ve geri alma, sıradaki durağa veya dönüş noktasına navigasyon. Bulut eşitleme/ziyaretçi hesabı bu sürümde yoktur.
- Android/iOS paylaşım menüsüyle rota bağlantısı, ICS takvim dosyası ve metin paylaşımı. Yerel yazdırma arayüzünden sade A4/PDF çıktısı.
- GitHub Pages sürümünü ana ekrana ekleme; uygulama görünümü `?app=1` ile de açılır. Normal masaüstü menüsü korunur.

## Gerçek yapay zekâ — mevcut durum

**Entegrasyon uygulanmıştır; canlı servis henüz etkinleştirilmemiştir.** Bu çalışma sırasında projede kullanılabilir OpenAI API anahtarı veya native uygulamaya açık API sunucusu bulunmuyordu. Anahtar tanımlanmadan ya da istek başarısızken örnek yanıtlar gösterilmez. Uygulama “Asistan bağlantısı hazırlanıyor” der; elle rota hesaplama çalışmaya devam eder.

Model, OpenAI Responses API üzerinden son konuşmayı ve gezi tercihlerini yorumlar. Sonuç katı JSON şemasıyla doğrulanır. Mekân kimlikleri sadece yayımlanan katalogdan seçilebilir. API; saat, ulaşım, yemek, ziyaret sınırları ve zorunlu durakları rota motoruna doğrulatır. Konuşma tek başına bir yerin açık, erişilebilir veya rotanın uygulanabilir olduğunu kanıtlamaz.

Gönderilenler: kullanıcının mesajı, son 8 konuşma mesajı, gezi tercihleri ve resmî kaynaklardan derlenmiş turizm kataloğu. Canlı konum gönderilmez. Sağlayıcı isteğinde `store:false` kullanılır; uygulama konuşmaları D1’e yazmaz. D1 yalnızca süreli kullanım sayaçlarını tutar. Bu ayar sağlayıcının tüm günlük tutma politikalarının kapatıldığı anlamına gelmez.

Festival, akademi, motokros ve henüz açılmayan altyapı projeleri ziyaret noktası olarak seçilemez. Canlı trafik, hava, işletme stoku, açılış saati veya rezervasyon verisi yoksa asistan bunları varmış gibi sunamaz. Kaynak bağlantıları modelin yazdığı URL’lerden değil, doğrulanmış katalog kayıtlarından gelir.

## Yapay zekâyı açma

1. Birliğin/Ratel Dijital’in sunucu hesabında HTTP API’yi barındırın. GitHub Pages statik yayındır; API anahtarı ve model çağrısı burada çalıştırılmaz. `mobile/assistant-worker.ts`, Cloudflare Workers için bağımsız giriş noktasıdır. `worker/index.ts` içinde aynı API Sites sunucusunda da bulunur. Owner-only Sites erişimi, bağımsız Android/iOS isteklerine açık API sayılmaz; mobil istemcinin ulaşabildiği bir HTTPS API adresi gerekir.
2. D1 `DB` bağını ve `drizzle/0000_busy_skin.sql` tablosunu oluşturun. Sayaçlar atomik `UPSERT ... RETURNING` kullanır; bellek içi sayaçlarla bütçe koruması yapılmaz. Aynı günlük genel sınır tüm demo oturumlarına uygulanır. Başarısız model çağrıları da sınırı tüketir. Eski sayaçların düzenli temizliği için sunucuda bakım görevi eklenmelidir.
3. Sunucu sırları: `OPENAI_API_KEY`, `SITE_AUTH_USERNAME`, `SITE_AUTH_PASSWORD`, en az 32 karakterli rastgele `SITE_AUTH_SESSION_SECRET`. Bunları APK’ya, GitHub dosyalarına veya `NEXT_PUBLIC_*` değişkenlerine koymayın. Kullanıcı adı/şifre önceki demo ile aynı seçilebilir; API’de gerçek sunucu doğrulaması yapılır. Statik demo girişindeki özetler, sunucu API’si için kimlik doğrulama olarak kabul edilmez.
4. İsteğe bağlı sunucu değerleri: `OPENAI_MODEL=gpt-4.1-mini`, `AI_DAILY_LIMIT=200`, `AI_ALLOWED_ORIGINS`. Sağlayıcı hesabında da harcama sınırı belirleyin. CORS tek başına kimlik doğrulama değildir; API ayrıca imzalı, 2 saat geçerli oturum ister. İstemci API anahtarını hiçbir zaman almaz.
5. GitHub deposunda **Settings → Secrets and variables → Actions → Variables** altında `ETAHB_AI_BASE_URL` değerine API’nin HTTPS kök adresini yazın. Bu bir sır değildir. Android iş akışını tekrar çalıştırın. Web için de aynı adres `public/mobile-config.json` içindeki `apiBaseUrl` değerine yazılabilir. Boş adres varsayılandır; sahte bağlantı eklenmemiştir.
6. Gerçek hesapla bir isteği tamamlayın; model cevabının kaynaklarını ve oluşturulan rotayı kontrol edin. Bu doğrulama yapılmadan “canlı yapay zekâ çalışıyor” şeklinde duyurmayın.

`mobile/wrangler.example.jsonc` kurulum örneğidir. Örnek D1 kimliği gerçek bir kaynak değildir ve değiştirilmeden yayımlanamaz. Bağımsız sunucuda kullanılan sırlar `wrangler secret put` veya sunucunun gizli değişken arayüzüyle eklenmelidir. Gerçek anahtarı sohbete veya kaynak dosyaya yapıştırmayın.

## Derleme

```sh
npm ci
npm run build:mobile
npx cap sync android
cd mobile/android
./gradlew assembleDebug
```

Android: Java 21, Android SDK 35, Capacitor 7. Çıktı: `mobile/android/app/build/outputs/apk/debug/app-debug.apk`.
GitHub Actions **Build Android app** iş akışı aynı adımları otomatik uygular ve APK’yı 30 günlük arşiv olarak saklar.

iOS: `npm run build:mobile`, `npx cap sync ios`, ardından Mac üzerinde `npx cap open ios`. Xcode/Apple geliştirici hesabı ve imza gerekir. Bu Linux çalışma ortamında iOS derlemesi ve fiziksel cihaz testi yapılmadı; iOS kaynak projesi hazırlandı. Mağaza başvurusu ve dağıtım imzası ayrıca tamamlanmalıdır.

## Kontroller

- Mevcut rota kontrolleri: 30 senaryo; 14 ilçe, Frigya, ulaşım, yemek, kaynaklar ve dışa aktarma.
- Mobil/API kontrolleri: zorunlu durak, mümkün olmayan istek, geç saat sınırı, API’nin yapılandırılmamış durumu, oturum süresi ve imza, kaynak dışı mekân reddi, gerçek sağlayıcı adaptörünün istek biçimi, genel günlük kullanım sınırı ve kayıt silme/geri alma.
- API adaptörü testleri sağlayıcı taklidiyle yürütülür; bunlar canlı OpenAI hesabı testi değildir.
- Android/iOS çok sayfalı statik dışa aktarma yönlendirmesi, siteyi sadece tek HTML dosyası sanan varsayılan davranış yerine her sayfanın kendi HTML dosyasını açar.

## Teknik kaynaklar

- [Capacitor: mevcut web projesini mobil uygulamaya ekleme](https://capacitorjs.com/docs/v7/getting-started)
- [Capacitor: paylaşım](https://capacitorjs.com/docs/v7/apis/share)
- [OpenAI: yapılandırılmış model çıktıları](https://developers.openai.com/api/docs/guides/structured-outputs)
- [OpenAI: GPT-4.1 mini](https://developers.openai.com/api/docs/models/gpt-4.1-mini)

Turizm kaynağı açıklamaları mevcut `docs/LEZZET-VE-MIRAS.md` ve `lib/routing` kataloğunda korunur.

## 1.1 · QR keşif ve yeni mobil arayüz

Modern ana ekran, ayrı Birlik menüsü, 47 nokta/43 tema için sabit QR kimlikleri, kamera/fotoğraf/kısa kod ile okuma, kişisel gezi QR paylaşımı, A5 kart çıktısı ve cihazda sesli okuma eklendi. Ayrıntılı işleyiş, araştırma ve saha uygulaması sınırları: `docs/QR-REHBER-SISTEMI.md`.
