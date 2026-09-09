import type {Locale} from '../routing/types';
const rows=`hotel|Otel|Hotel|Hotel|Hôtel|فندق
dining|Yeme içme|Dining|Gastronomie|Restauration|المطاعم
visitReports|gönüllü ziyaret bildirimi|voluntary visit reports|freiwillige Besuchsmeldungen|visites déclarées|تقارير زيارة طوعية
askGuide|Rehbere sor|Ask the guide|Reiseführer fragen|Demander au guide|اسأل الدليل
aiPending|Yapay zekâ asistanı henüz etkin değil. Kaynaklı şehir rehberini ve aramayı kullanabilirsiniz.|The AI assistant is not active yet. Browse or search the sourced city guide.|Der KI-Assistent ist noch nicht aktiv. Nutzen Sie den belegten Stadtführer und die Suche.|L’assistant IA n’est pas encore actif. Consultez le guide sourcé et la recherche.|مساعد الذكاء الاصطناعي غير نشط بعد. استخدم الدليل الموثق والبحث.
aiQuestion|Merak ettiğiniz yer veya eseri sorun|Ask about a place or monument|Frage zu einem Ort oder Denkmal|Question sur un lieu ou monument|اسأل عن مكان أو معلم
aiPrivacy|Sorunuz ve ilgili kaynak notları yanıt için OpenAI’a iletilir. Kişisel bilgi eklemeyin. Yanıtlar hatalı olabilir; kaynakları kontrol edin.|Your question and relevant source notes are sent to OpenAI. Avoid personal data. Answers may be wrong; check sources.|Frage und Quellenhinweise werden an OpenAI übermittelt. Keine persönlichen Daten eingeben. Antworten können falsch sein; Quellen prüfen.|Question et notes sont transmises à OpenAI. Évitez les données personnelles. Les réponses peuvent être erronées ; vérifiez les sources.|يُرسل سؤالك وملاحظات المصادر إلى OpenAI. تجنب البيانات الشخصية. قد تخطئ الإجابات؛ تحقق من المصادر.
shareLink|Bağlantıyı paylaş|Share link|Link teilen|Partager le lien|مشاركة الرابط
linkCopied|Bağlantı kopyalandı.|Link copied.|Link kopiert.|Lien copié.|تم نسخ الرابط.
community|Topluluk|Community|Community|Communauté|المجتمع
profile|Profilim|My profile|Mein Profil|Mon profil|ملفي
services|Yerel destek|Local support|Lokale Hilfe|Aide locale|الدعم المحلي
bank|Şehir rehberi|City guide|Stadtführer|Guide de la ville|دليل المدينة
bankHint|Kaynaklarıyla Eskişehir|Eskişehir, with sources|Eskişehir mit Quellen|Eskişehir et ses sources|إسكي شهير بالمصادر
communityHint|Birbirimizin izinden keşfedelim.|Discover through each other's routes.|Auf den Spuren anderer entdecken.|Découvrir grâce aux itinéraires de chacun.|اكتشف عبر مسارات الآخرين.
feed|Paylaşılan rotalar|Shared routes|Geteilte Routen|Itinéraires partagés|المسارات المشتركة
trending|Öne çıkan yerler|Featured places|Beliebte Orte|Lieux à découvrir|أماكن بارزة
newPost|Rotamı paylaş|Share my route|Meine Route teilen|Partager mon itinéraire|مشاركة مساري
newest|En yeni|Newest|Neueste|Plus récents|الأحدث
popular|En beğenilen|Most liked|Am beliebtesten|Les plus appréciés|الأكثر إعجاباً
allDistricts|Tüm ilçeler|All districts|Alle Bezirke|Tous les districts|جميع المقاطعات
district|İlçe|District|Bezirk|District|المقاطعة
more|Daha fazla göster|Show more|Mehr anzeigen|Afficher plus|عرض المزيد
close|Kapat|Close|Schließen|Fermer|إغلاق
loading|Yükleniyor…|Loading…|Wird geladen…|Chargement…|جارٍ التحميل…
retry|Yeniden dene|Try again|Erneut versuchen|Réessayer|حاول مجدداً
unavailable|Bağlantı kurulamadı. Bilgilerinizi koruduk; yeniden deneyebilirsiniz.|Unable to connect. Your input is preserved; please retry.|Keine Verbindung. Ihre Eingaben bleiben erhalten.|Connexion impossible. Vos saisies sont conservées.|تعذر الاتصال. تم الاحتفاظ بإدخالاتك؛ حاول مجدداً.
guest|Misafir olarak keşfet|Explore as a guest|Als Gast entdecken|Explorer en tant que visiteur|استكشف كضيف
guestNote|Rehberi okuyabilir, QR tarayabilir ve rota oluşturabilirsiniz. Paylaşım, değerlendirme ve talepler için profil oluşturun.|Read guides, scan QR codes and plan routes. A profile is needed to share, review or request support.|Reiseführer lesen, QR scannen und Routen planen. Für Beiträge, Bewertungen und Anfragen ist ein Profil erforderlich.|Consultez les guides, scannez les QR et planifiez. Un profil est requis pour publier, évaluer ou demander de l’aide.|اقرأ الأدلة وامسح الرموز وخطط للمسارات. يلزم ملف للنشر والتقييم وطلب الدعم.
join|Profil oluştur|Create profile|Profil erstellen|Créer un profil|إنشاء ملف
login|Giriş yap|Sign in|Anmelden|Se connecter|تسجيل الدخول
logout|Çıkış yap|Sign out|Abmelden|Se déconnecter|تسجيل الخروج
handle|Kullanıcı adı|Username|Benutzername|Nom d’utilisateur|اسم المستخدم
handleHint|3–30 karakter; küçük Latin harfleri, rakam veya alt çizgi.|3–30 characters: lowercase Latin letters, digits or underscores.|3–30 Zeichen: lateinische Kleinbuchstaben, Ziffern oder Unterstriche.|3–30 caractères : minuscules latines, chiffres ou tirets bas.|٣–٣٠ حرفاً: أحرف لاتينية صغيرة أو أرقام أو شرطة سفلية.
name|Görünen ad|Display name|Anzeigename|Nom affiché|الاسم الظاهر
password|Şifre|Password|Passwort|Mot de passe|كلمة المرور
passwordHint|En az 12 karakter. Şifrenizi güvenli bir yerde saklayın.|At least 12 characters. Keep your password safe.|Mindestens 12 Zeichen. Passwort sicher aufbewahren.|12 caractères minimum. Conservez votre mot de passe en sécurité.|١٢ حرفاً على الأقل. احتفظ بكلمة المرور بأمان.
bio|Hakkımda|About me|Über mich|À propos de moi|نبذة عني
save|Kaydet|Save|Speichern|Enregistrer|حفظ
edit|Düzenle|Edit|Bearbeiten|Modifier|تعديل
rulesAccept|Topluluk kurallarını ve veri bilgilendirmesini okudum, kabul ediyorum.|I have read and accept the community rules and privacy information.|Ich akzeptiere die Community-Regeln und Datenschutzhinweise.|J’ai lu et j’accepte les règles et les informations de confidentialité.|قرأت قواعد المجتمع ومعلومات الخصوصية وأوافق عليها.
rules|Topluluk ve gizlilik|Community & privacy|Community & Datenschutz|Communauté et confidentialité|المجتمع والخصوصية
providerPending|Bu giriş seçeneği kurum yetkilendirmesi tamamlanınca açılacak.|This sign-in option will open once the institution completes setup.|Diese Anmeldung wird nach der Freigabe durch die Institution verfügbar.|Cette connexion sera disponible après configuration par l’institution.|سيتاح هذا الدخول بعد إكمال المؤسسة للإعداد.
google|Google ile devam et|Continue with Google|Weiter mit Google|Continuer avec Google|المتابعة باستخدام Google
facebook|Facebook ile devam et|Continue with Facebook|Weiter mit Facebook|Continuer avec Facebook|المتابعة باستخدام Facebook
myRoutes|Gezilerim|My trips|Meine Reisen|Mes voyages|رحلاتي
myPosts|Paylaşımlarım|My posts|Meine Beiträge|Mes publications|منشوراتي
myRequests|Taleplerim|My requests|Meine Anfragen|Mes demandes|طلباتي
pending|İncelemede|In review|In Prüfung|En cours d’examen|قيد المراجعة
approved|Yayında|Published|Veröffentlicht|Publié|منشور
rejected|Düzenleme gerekiyor|Changes needed|Änderungen nötig|Modifications requises|تحتاج تعديلاً
deleted|Kaldırıldı|Removed|Entfernt|Supprimé|تم الحذف
reviewNote|Paylaşımınız içerik incelemesinden sonra görünür. Bu işlem anlık değildir.|Your post appears after content review. This is not immediate.|Ihr Beitrag erscheint nach Prüfung, nicht sofort.|Votre publication apparaîtra après examen, pas immédiatement.|سيظهر منشورك بعد مراجعة المحتوى، وليس فوراً.
emptyFeed|Henüz onaylanmış bir rota paylaşılmadı.|No approved routes have been shared yet.|Noch keine freigegebenen Routen.|Aucun itinéraire approuvé pour le moment.|لا توجد مسارات معتمدة بعد.
emptyTrend|Gerçek etkileşimler geldikçe bu alan dolacak.|This section grows with real community activity.|Dieser Bereich wächst mit echten Interaktionen.|Cet espace évoluera avec les interactions réelles.|سيُملأ هذا القسم مع تفاعل المجتمع الفعلي.
trendNote|Beğenilen rotalarda bulunan duraklar öne çıkar. Ziyaret sayısı, en az üç kişinin gönüllü bildirimine dayanır; konum takibi yapılmaz.|Stops in liked routes are featured. Visits use voluntary reports from at least three people; there is no location tracking.|Orte aus beliebten Routen. Besuche beruhen auf freiwilligen Angaben von mindestens drei Personen, ohne Standortverfolgung.|Les étapes des itinéraires appréciés sont mises en avant. Visites déclarées volontairement par au moins trois personnes, sans suivi.|تُبرز محطات المسارات المحبوبة. تستند الزيارات لإبلاغ طوعي من ثلاثة أشخاص على الأقل دون تتبع الموقع.
likes|beğeni|likes|Likes|mentions J’aime|إعجابات
ratings|değerlendirme|ratings|Bewertungen|évaluations|تقييمات
comments|Yorumlar|Comments|Kommentare|Commentaires|التعليقات
comment|Yorum yaz|Write a comment|Kommentar schreiben|Écrire un commentaire|اكتب تعليقاً
send|Gönder|Submit|Senden|Envoyer|إرسال
report|Bildir|Report|Melden|Signaler|إبلاغ
reportSent|Bildiriminiz inceleme ekibine kaydedildi.|Your report was saved for review.|Ihre Meldung wurde zur Prüfung gespeichert.|Votre signalement a été enregistré.|تم تسجيل بلاغك للمراجعة.
reportReason|Bildirim nedeni|Report reason|Meldegrund|Motif du signalement|سبب البلاغ
abuse|Uygunsuz içerik|Inappropriate content|Unangemessener Inhalt|Contenu inapproprié|محتوى غير لائق
privacy|Kişisel bilgi|Personal information|Persönliche Daten|Informations personnelles|معلومات شخصية
spam|Reklam / spam|Advertising / spam|Werbung / Spam|Publicité / spam|إعلانات / رسائل مزعجة
misinformation|Yanlış bilgi|Incorrect information|Falsche Information|Information incorrecte|معلومات غير صحيحة
other|Diğer|Other|Sonstiges|Autre|أخرى
postTitle|Rotanın adı|Route name|Name der Route|Nom de l’itinéraire|اسم المسار
postBody|Deneyimini anlat|Describe your experience|Erlebnis beschreiben|Racontez votre expérience|صف تجربتك
chooseTrip|Paylaşılacak gezi|Trip to share|Reise zum Teilen|Voyage à partager|الرحلة للمشاركة
noTrip|Önce bir rota oluşturup Gezilerim’e kaydedin.|Create a route and save it to My trips first.|Erstellen und speichern Sie zuerst eine Route.|Créez d’abord un itinéraire et enregistrez-le.|أنشئ مساراً واحفظه في رحلاتي أولاً.
media|Fotoğraf ve video|Photos & video|Fotos & Videos|Photos et vidéos|الصور والفيديو
mediaHint|En fazla 6 dosya. Fotoğraf 8 MB, video 25 MB. Yalnızca paylaşma hakkınız olan içerikleri yükleyin.|Up to 6 files. Photos 8 MB, videos 25 MB. Upload only content you have permission to share.|Bis zu 6 Dateien. Fotos 8 MB, Videos 25 MB. Nur Inhalte mit Freigabe hochladen.|6 fichiers maximum. Photos 8 Mo, vidéos 25 Mo. Publiez uniquement des contenus autorisés.|حتى ٦ ملفات. الصور ٨ ميغابايت والفيديو ٢٥ ميغابايت. ارفع ما تملك حق مشاركته فقط.
caption|Görsel / video açıklaması|Media description|Medienbeschreibung|Description du média|وصف الوسائط
mediaRights|Görselleri paylaşma hakkım var; görünen kişilerin paylaşım iznini aldım.|I have the right to share these files and permission from people shown.|Ich habe die Rechte und die Zustimmung abgebildeter Personen.|J’ai les droits et le consentement des personnes représentées.|لدي حق المشاركة وإذن الأشخاص الظاهرين.
publish|İncelemeye gönder|Submit for review|Zur Prüfung senden|Soumettre à l’examen|إرسال للمراجعة
uploadFailed|Rota kaydedildi; bazı dosyalar yüklenemedi. Eksik dosyaları bu ekrandan yeniden deneyin.|Route saved; some files failed. Retry the remaining files here.|Route gespeichert; einige Dateien fehlen. Hier erneut versuchen.|Itinéraire enregistré ; certains fichiers ont échoué. Réessayez ici.|تم حفظ المسار؛ تعذر رفع بعض الملفات. أعد المحاولة هنا.
adapt|Bu rotayı kendime uyarla|Adapt this route|Route anpassen|Adapter cet itinéraire|تخصيص هذا المسار
visit|Burayı ziyaret ettim|I visited this place|Ich war hier|J’ai visité ce lieu|زرت هذا المكان
visited|Ziyaret kaydedildi|Visit recorded|Besuch gespeichert|Visite enregistrée|تم تسجيل الزيارة
guides|Yerel rehberler|Local guides|Lokale Begleiter|Guides locaux|المرشدون المحليون
homes|Misafir evleri|Guest homes|Gastunterkünfte|Maisons d’hôtes|بيوت الضيافة
camps|Kamp & karavan|Camping & caravans|Camping & Wohnmobile|Camping et caravanes|التخييم والكرفانات
hotels|Oteller ve yeme içme|Hotels & dining|Hotels & Gastronomie|Hôtels et restauration|الفنادق والمطاعم
guideRequest|Rehber talep et|Request a guide|Begleitung anfragen|Demander un guide|طلب مرشد
homeRequest|Konaklama talebi|Request a stay|Unterkunft anfragen|Demander un séjour|طلب إقامة
independentGuide|Rota oluşturmadan rehber iste|Request a guide without a route|Begleitung ohne Route anfragen|Demander un guide sans itinéraire|اطلب مرشداً دون مسار
demo|Sanal demo|Virtual demo|Virtuelle Demo|Démo virtuelle|عرض افتراضي
demoNote|42 rehber ve 40 ev, proje modelini anlatan sanal kayıtlardır. Gerçek kişi, müsaitlik, ruhsat veya rezervasyon bilgisi değildir.|The 42 guides and 40 homes are fictional project examples, not real people, availability, permits or bookings.|42 Begleiter und 40 Unterkünfte sind fiktive Projektbeispiele, keine realen Personen, Verfügbarkeiten, Genehmigungen oder Buchungen.|Les 42 guides et 40 maisons sont fictifs : aucune personne, disponibilité, autorisation ou réservation réelle.|المرشدون الـ٤٢ والمنازل الـ٤٠ أمثلة افتراضية للمشروع، وليست أشخاصاً أو حجوزات أو تراخيص فعلية.
demoAccept|Bu talebin demo olduğunu ve gerçek rezervasyon oluşturmadığını anlıyorum.|I understand this is a demo request, not a real booking.|Dies ist eine Demo-Anfrage, keine echte Buchung.|Je comprends qu’il s’agit d’une demande de démo, pas d’une réservation.|أفهم أن هذا طلب تجريبي وليس حجزاً فعلياً.
demoSaved|Demo talebiniz kaydedildi. Bir rehbere veya ev sahibine iletilmedi.|Demo request saved. It was not sent to a guide or host.|Demo-Anfrage gespeichert. Sie wurde nicht weitergeleitet.|Demande de démo enregistrée, sans transmission à un guide ou hôte.|تم حفظ الطلب التجريبي دون إرساله لمرشد أو مضيف.
date|Tarih|Date|Datum|Date|التاريخ
time|Saat|Time|Uhrzeit|Heure|الوقت
people|Kişi sayısı|People|Personen|Personnes|عدد الأشخاص
language|Dil|Language|Sprache|Langue|اللغة
note|Özel not (yalnızca talepte)|Private request note|Private Anmerkung|Note privée de la demande|ملاحظة خاصة بالطلب
cancel|Vazgeç|Cancel|Abbrechen|Annuler|إلغاء
cancelRequest|Talebi iptal et|Cancel request|Anfrage stornieren|Annuler la demande|إلغاء الطلب
cancelled|İptal edildi|Cancelled|Storniert|Annulé|ملغى
capacity|kişilik örnek kapasite|example guest capacity|beispielhafte Gästekapazität|capacité indicative|سعة ضيوف افتراضية
rooms|oda|rooms|Zimmer|pièces|غرف
room|Oda modeli|Room model|Zimmermodell|Modèle de chambre|نموذج غرفة
home|Ev modeli|Home model|Hausmodell|Modèle de maison|نموذج منزل
match|Rotanızdaki ilçelerle eşleşen seçenekler|Options matching your route districts|Passend zu den Bezirken Ihrer Route|Options dans les districts de votre itinéraire|خيارات تطابق مقاطعات مسارك
allServices|Tüm seçenekler|All options|Alle Optionen|Toutes les options|جميع الخيارات
search|Ad, ilçe veya konu ara|Search name, district or topic|Name, Bezirk oder Thema suchen|Rechercher un nom, district ou sujet|ابحث عن اسم أو مقاطعة أو موضوع
sources|Kaynak ve güncellik|Source & freshness|Quelle & Aktualität|Source et actualité|المصدر والتحديث
source|Resmî kaynağı aç|Open official source|Offizielle Quelle öffnen|Ouvrir la source officielle|فتح المصدر الرسمي
verified|Kaynak kontrolü|Source checked|Quelle geprüft|Source consultée|فحص المصدر
notComplete|Açık resmî kaynaklardan derlenen envanterdir; şehrin tüm eserlerinin eksiksiz kaydı olduğu iddia edilmez.|Compiled from public official sources; not claimed to be an exhaustive record of every city asset.|Aus öffentlichen amtlichen Quellen; kein Anspruch auf Vollständigkeit.|Inventaire issu de sources officielles publiques, sans prétention d’exhaustivité.|جُمع من مصادر رسمية عامة ولا يُدّعى أنه سجل كامل لكل معالم المدينة.
readTurkish|Resmî kaynak Türkçedir.|The official source is in Turkish.|Die offizielle Quelle ist auf Türkisch.|La source officielle est en turc.|المصدر الرسمي باللغة التركية.
routeReady|Rotaya eklenebilir|Available for route planning|Für Routen verfügbar|Disponible pour les itinéraires|متاح لتخطيط المسار
referenceOnly|Bilgi kaydı; ziyaret koşulları doğrulanmalı|Reference entry; verify visiting conditions|Informationseintrag; Besuch prüfen|Fiche informative ; conditions à vérifier|سجل معلومات؛ تحقق من شروط الزيارة
campNotice|İl Müdürlüğü, Bakanlık belgeli kamp/karavan konaklama tesisi bulunmadığını duyuruyor. Park etmek geceleme izni değildir. Güncel izin ve erişimi ilgili kurumdan teyit edin.|The provincial directorate reports no Ministry-certified camping/caravan accommodation. Parking is not overnight permission. Verify current access and permits.|Laut Provinzdirektion gibt es keine ministeriell zertifizierte Campingunterkunft. Parken erlaubt keine Übernachtung. Zugang und Genehmigungen prüfen.|La direction provinciale n’indique aucun hébergement de camping certifié par le ministère. Stationner n’autorise pas à passer la nuit. Vérifiez l’accès.|تعلن المديرية عدم وجود إقامة تخييم معتمدة من الوزارة. الوقوف لا يعني السماح بالمبيت. تحقق من التصاريح وإمكانية الدخول.
forestNotice|15 Haziran–15 Ekim 2026: ormanlık alanlarda giriş kısıtlaması var. Alan bazında güncel istisna ve izinler teyit edilmeli.|15 June–15 October 2026: forest access restrictions apply. Verify any site-specific exceptions or permits.|15. Juni–15. Oktober 2026: Waldbetretungsbeschränkungen. Ausnahmen vor Ort prüfen.|15 juin–15 octobre 2026 : restrictions d’accès aux forêts. Vérifiez les exceptions locales.|١٥ يونيو–١٥ أكتوبر ٢٠٢٦: قيود على دخول الغابات. تحقق من الاستثناءات الخاصة بالموقع.
noCamping|Doğrulanmış geceleme seçeneği henüz yok.|No verified overnight option yet.|Noch keine bestätigte Übernachtungsoption.|Aucune possibilité de nuitée vérifiée.|لا توجد إقامة ليلية موثقة بعد.
empty|Henüz kayıt yok.|No records yet.|Noch keine Einträge.|Aucun enregistrement.|لا توجد سجلات بعد.
deleteAccount|Hesabımı sil|Delete my account|Konto löschen|Supprimer mon compte|حذف حسابي
deleteNote|Profiliniz, paylaşımlarınız, dosyalarınız ve talepleriniz kalıcı olarak silinir. Telefonda önceden saklanan Gezilerim kayıtları ayrıdır.|Your profile, posts, files and requests will be permanently deleted. Previously saved device trips are separate.|Profil, Beiträge, Dateien und Anfragen werden gelöscht. Lokal gespeicherte Reisen sind davon getrennt.|Profil, publications, fichiers et demandes seront supprimés. Les voyages enregistrés sur l’appareil restent séparés.|سيُحذف ملفك ومنشوراتك وملفاتك وطلباتك نهائياً. الرحلات المحفوظة محلياً منفصلة.
delete|Sil|Delete|Löschen|Supprimer|حذف
admin|İçerik yönetimi|Content management|Inhaltsverwaltung|Gestion du contenu|إدارة المحتوى
ratingLabel|Puanınız|Your rating|Ihre Bewertung|Votre note|تقييمك
notRated|Henüz değerlendirme yok|No ratings yet|Noch keine Bewertungen|Aucune évaluation|لا توجد تقييمات بعد
acknowledge|Anladım|Understood|Verstanden|Compris|فهمت
pendingProfile|Profilinizin kamuya açık adı ve açıklaması incelemeden sonra görünür.|Your public name and bio appear after review.|Öffentlicher Name und Biografie erscheinen nach Prüfung.|Votre nom public et votre bio apparaîtront après examen.|سيظهر اسمك العام ونبذتك بعد المراجعة.
noLikes|Henüz beğeni yok|No likes yet|Noch keine Likes|Aucune mention J’aime|لا توجد إعجابات بعد
`;
const keys=rows.trim().split('\n').map(row=>row.split('|'));
export function socialCopy(locale:Locale){const index=['tr','en','de','fr','ar'].indexOf(locale)+1;return Object.fromEntries(keys.map(row=>[row[0],row[index]])) as Record<string,string>;}
export function socialError(code:string,locale:Locale){const c=socialCopy(locale);const map:Record<string,string>={sign_in_required:c.guestNote,service_unavailable:c.unavailable,forbidden:locale==='tr'?'Bu işlem için yetkiniz yok.':c.unavailable,provider_unavailable:c.providerPending,media_unavailable:c.unavailable,media_too_large:c.mediaHint,unsupported_media:c.mediaHint,media_limit:c.mediaHint,oauth_expired:locale==='tr'?'Giriş süresi doldu. Yeniden giriş yapın.':c.login,oauth_failed:c.login,oauth_cancelled:c.login,rate_limited:locale==='tr'?'Çok sık işlem yapıldı. Biraz bekleyip yeniden deneyin.':c.retry,handle_taken:locale==='tr'?'Bu kullanıcı adı alınmış. Başka bir ad seçin.':c.handleHint,invalid_credentials:locale==='tr'?'Kullanıcı adı veya şifre hatalı.':c.login,unsafe_text:locale==='tr'?'Metni gözden geçirin. Hakaret, tehdit veya uygunsuz ifadeler paylaşılamaz.':c.rules,contact_in_public:locale==='tr'?'Kamuya açık metinden telefon, e-posta ve bağlantıları kaldırın.':c.rules,invalid_text:c.rules,invalid_date:c.date,invalid_request:locale==='tr'?'Alanları ve onay kutularını kontrol edin.':c.retry,route_changed:locale==='tr'?'Rota güncel katalogla eşleşmiyor. Rotayı yeniden oluşturup kaydedin.':c.noTrip,revision_changed:c.retry,capacity_exceeded:c.capacity,vote_not_allowed:locale==='tr'?'Kendi rotanıza puan veya beğeni veremezsiniz.':c.ratingLabel};return map[code]??c.unavailable;}
