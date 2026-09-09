import type { Locale } from "@/lib/routing/types";

const copy = {
  tr: {
    title: "Eskişehir Cebimde", subtitle: "Rotalar, QR keşif ve etkinlikler ana ekranında.",
    add: "Telefona ekle", install: "Yükle", installing: "Kurulum açılıyor…", later: "Daha sonra", close: "Kapat",
    heading: "Eskişehir Cebimde’yi telefonuna ekle", description: "Ana ekranındaki simgeden uygulama görünümünde aç.",
    iosSteps: ["Safari’de Paylaş menüsünü aç. Gerekirse önce Diğer (…) düğmesine dokun.", "Ana Ekrana Ekle’yi seç. Görünmüyorsa Eylemleri Düzenle bölümünden ekle.", "Web Uygulaması Olarak Aç seçeneği görünüyorsa açık bırak ve Ekle’ye dokun."],
    androidSteps: ["Tarayıcının menüsünü aç (⋮).", "Uygulamayı yükle veya Ana ekrana ekle seçeneğini seç.", "Telefonundaki kurulum ekranında Yükle veya Ekle’ye dokun."],
    openSafari: "Bu bağlantıyı Safari’de açarak aşağıdaki adımları uygula.",
    openBrowser: "Bağlantıyı Chrome veya Samsung Internet’te açarak aşağıdaki adımları uygula.",
    copy: "Bağlantıyı kopyala", copied: "Kopyalandı", copyFallback: "Bağlantıya basılı tutup kopyalayabilirsin.", link: "Uygulama bağlantısı",
    done: "Anladım", error: "Kurulum ekranı açılamadı. Tarayıcı menüsünden ekleyebilirsin.",
  },
  en: {
    title: "Eskişehir Cebimde", subtitle: "Routes, QR discoveries and events on your home screen.",
    add: "Add to phone", install: "Install", installing: "Opening install…", later: "Later", close: "Close",
    heading: "Add Eskişehir Cebimde to your phone", description: "Open the app view from its home screen icon.",
    iosSteps: ["Open Share in Safari. You may need to tap More (…) first.", "Choose Add to Home Screen. If it is missing, enable it under Edit Actions.", "Keep Open as Web App on if shown, then tap Add."],
    androidSteps: ["Open your browser menu (⋮).", "Choose Install app or Add to Home screen.", "Confirm with Install or Add on your phone."],
    openSafari: "Open this link in Safari, then follow these steps.", openBrowser: "Open this link in Chrome or Samsung Internet, then follow these steps.",
    copy: "Copy link", copied: "Copied", copyFallback: "Touch and hold the link to copy it.", link: "App link", done: "Got it", error: "The install dialog could not open. You can use your browser menu instead.",
  },
  de: {
    title: "Eskişehir Cebimde", subtitle: "Routen, QR-Entdeckungen und Veranstaltungen auf dem Home-Bildschirm.",
    add: "Zum Telefon hinzufügen", install: "Installieren", installing: "Installation wird geöffnet…", later: "Später", close: "Schließen",
    heading: "Eskişehir Cebimde zum Telefon hinzufügen", description: "Öffne die App-Ansicht über das Symbol auf dem Home-Bildschirm.",
    iosSteps: ["Öffne in Safari das Teilen-Menü, gegebenenfalls zuerst über Mehr (…).", "Wähle Zum Home-Bildschirm. Fehlt die Option, aktiviere sie unter Aktionen bearbeiten.", "Lass Als Web-App öffnen aktiviert, falls angezeigt, und tippe auf Hinzufügen."],
    androidSteps: ["Öffne das Browsermenü (⋮).", "Wähle App installieren oder Zum Startbildschirm hinzufügen.", "Bestätige auf deinem Telefon mit Installieren oder Hinzufügen."],
    openSafari: "Öffne diesen Link in Safari und folge diesen Schritten.", openBrowser: "Öffne diesen Link in Chrome oder Samsung Internet und folge diesen Schritten.",
    copy: "Link kopieren", copied: "Kopiert", copyFallback: "Halte den Link gedrückt, um ihn zu kopieren.", link: "App-Link", done: "Verstanden", error: "Das Installationsfenster konnte nicht geöffnet werden. Nutze das Browsermenü.",
  },
  fr: {
    title: "Eskişehir Cebimde", subtitle: "Itinéraires, découvertes QR et événements sur votre écran d’accueil.",
    add: "Ajouter au téléphone", install: "Installer", installing: "Ouverture de l’installation…", later: "Plus tard", close: "Fermer",
    heading: "Ajoutez Eskişehir Cebimde à votre téléphone", description: "Ouvrez la vue application depuis son icône sur l’écran d’accueil.",
    iosSteps: ["Ouvrez le menu Partager de Safari, si nécessaire via Plus (…).", "Choisissez Sur l’écran d’accueil. Si l’option manque, activez-la dans Modifier les actions.", "Laissez Ouvrir comme app web activé si proposé, puis touchez Ajouter."],
    androidSteps: ["Ouvrez le menu du navigateur (⋮).", "Choisissez Installer l’application ou Ajouter à l’écran d’accueil.", "Confirmez avec Installer ou Ajouter sur votre téléphone."],
    openSafari: "Ouvrez ce lien dans Safari, puis suivez ces étapes.", openBrowser: "Ouvrez ce lien dans Chrome ou Samsung Internet, puis suivez ces étapes.",
    copy: "Copier le lien", copied: "Copié", copyFallback: "Appuyez longuement sur le lien pour le copier.", link: "Lien de l’application", done: "Compris", error: "La fenêtre d’installation ne s’est pas ouverte. Utilisez le menu du navigateur.",
  },
  ar: {
    title: "Eskişehir Cebimde", subtitle: "المسارات واكتشافات QR والفعاليات على شاشتك الرئيسية.",
    add: "أضف إلى الهاتف", install: "تثبيت", installing: "جارٍ فتح التثبيت…", later: "لاحقًا", close: "إغلاق",
    heading: "أضف Eskişehir Cebimde إلى هاتفك", description: "افتح واجهة التطبيق من أيقونته على الشاشة الرئيسية.",
    iosSteps: ["افتح قائمة المشاركة في Safari. قد تحتاج إلى الضغط على المزيد (…) أولًا.", "اختر إضافة إلى الشاشة الرئيسية. إذا لم تظهر، أضفها من تعديل الإجراءات.", "اترك فتح كتطبيق ويب مفعّلًا إن ظهر، ثم اضغط إضافة."],
    androidSteps: ["افتح قائمة المتصفح (⋮).", "اختر تثبيت التطبيق أو إضافة إلى الشاشة الرئيسية.", "أكّد بالضغط على تثبيت أو إضافة على الهاتف."],
    openSafari: "افتح هذا الرابط في Safari ثم اتبع الخطوات التالية.", openBrowser: "افتح هذا الرابط في Chrome أو Samsung Internet ثم اتبع الخطوات التالية.",
    copy: "نسخ الرابط", copied: "تم النسخ", copyFallback: "اضغط مطولًا على الرابط لنسخه.", link: "رابط التطبيق", done: "فهمت", error: "تعذّر فتح نافذة التثبيت. يمكنك استخدام قائمة المتصفح.",
  },
};

export function installCopy(locale: Locale) { return copy[locale] ?? copy.tr; }
