export type LocaleId = "ar" | "de" | "es" | "fr" | "hi" | "pt";

export type LocaleContent = {
  htmlLang: string;
  dir: "ltr" | "rtl";
  langSwitchLabel: string; // label shown for the link back to the English site
  kicker: string;
  headline: string;
  subheadline: string;
  ctaPrimary: string;
  ctaSecondary: string;
  signIn: string;
  howItWorksTitle: string;
  steps: { title: string; body: string }[];
  toolsTitle: string;
  toolsSubtitle: string;
  tools: { title: string; body: string; free?: string }[];
  pricingTitle: string;
  pricingBody: string;
  pricingCta: string;
  pricingIncludedTitle: string;
  footerNote: string;
};

export const LOCALES: LocaleId[] = ["ar", "de", "es", "fr", "hi", "pt"];

export const LOCALE_NAMES: Record<LocaleId, string> = {
  ar: "العربية",
  de: "Deutsch",
  es: "Español",
  fr: "Français",
  hi: "हिन्दी",
  pt: "Português",
};

const TOOL_TITLES_EN = [
  "Tailor to a job",
  "Build from scratch",
  "Free ATS Checker",
  "Fix my CV",
  "Roast my CV",
  "Interview prep & simulator",
  "Skills assessment",
  "Career coach",
  "Cover letters",
];

export const localeContent: Record<LocaleId, LocaleContent> = {
  es: {
    htmlLang: "es",
    dir: "ltr",
    langSwitchLabel: "English",
    kicker: "Adaptación de CV con IA",
    headline: "CVs que consiguen que te vean.",
    subheadline:
      "Sube tu CV una vez. MyCV Buddy lo reescribe para cada oferta a la que te presentes — adaptado al puesto, legible por cualquier sistema ATS, siempre reconocible como tuyo.",
    ctaPrimary: "Adaptar mi CV",
    ctaSecondary: "Ver cómo funciona",
    signIn: "Iniciar sesión",
    howItWorksTitle: "Tres pasos. Sin adivinar.",
    steps: [
      { title: "Sube una vez", body: "Sube tu CV actual. Analizamos cada sección — experiencia, habilidades, formación — en segundos." },
      { title: "Pega la oferta", body: "Añade la descripción del puesto al que te presentas. Nuestro modelo entiende lo que realmente pide." },
      { title: "Recibe un CV adaptado", body: "Un CV reescrito y compatible con ATS, ajustado al puesto — sigue siendo el tuyo, listo para exportar." },
    ],
    toolsTitle: "Todo lo que necesitas, para una candidatura o cincuenta.",
    toolsSubtitle: "Una cuenta, un perfil, todas las herramientas para tu búsqueda de empleo.",
    tools: [
      { title: TOOL_TITLES_EN[0], body: "Pega una oferta de trabajo y obtén una versión reescrita y compatible con ATS de tu CV en segundos." },
      { title: TOOL_TITLES_EN[1], body: "¿No tienes un CV? Describe tu experiencia con tus palabras y lo estructuramos por ti." },
      { title: TOOL_TITLES_EN[2], body: "Pega tu CV y una oferta, sin necesidad de cuenta — obtén una puntuación y las palabras clave que faltan.", free: "Gratis, sin cuenta" },
      { title: TOOL_TITLES_EN[3], body: "Recibe una revisión concreta de una versión adaptada y aplica las mejoras con un clic." },
      { title: TOOL_TITLES_EN[4], body: "Una crítica brutalmente honesta (y realmente divertida), si quieres la versión sin filtros." },
      { title: TOOL_TITLES_EN[5], body: "Preguntas de entrevista probables con respuestas modelo, o una entrevista simulada en vivo." },
      { title: TOOL_TITLES_EN[6], body: "Un test rápido basado en las habilidades de tu CV, para saber qué repasar antes de presentarte." },
      { title: TOOL_TITLES_EN[7], body: "Pregunta lo que quieras sobre tu carrera — basado en tu CV real, no en consejos genéricos." },
      { title: TOOL_TITLES_EN[8], body: "Genera una carta de presentación a partir de cualquier CV adaptado, dirigida a la empresa correcta." },
    ],
    pricingTitle: "Empieza gratis. Actualiza cuando quieras.",
    pricingBody: "Crea una cuenta gratis y adapta hasta 3 CVs al mes. Actualiza a Pro por 2,99 £/mes para generaciones ilimitadas, exportación DOCX y todas las herramientas.",
    pricingCta: "Empezar gratis",
    pricingIncludedTitle: "Gratis",
    footerNote: "CVs adaptados con IA para el trabajo que realmente quieres.",
  },
  fr: {
    htmlLang: "fr",
    dir: "ltr",
    langSwitchLabel: "English",
    kicker: "Adaptation de CV par IA",
    headline: "Des CV qui se font remarquer.",
    subheadline:
      "Importez votre CV une seule fois. MyCV Buddy le réécrit pour chaque poste auquel vous postulez — adapté à l'offre, lisible par n'importe quel ATS, toujours reconnaissablement vôtre.",
    ctaPrimary: "Adapter mon CV",
    ctaSecondary: "Voir comment ça marche",
    signIn: "Se connecter",
    howItWorksTitle: "Trois étapes. Aucune supposition.",
    steps: [
      { title: "Importez une fois", body: "Déposez votre CV actuel. Nous analysons chaque section — expérience, compétences, formation — en quelques secondes." },
      { title: "Collez l'offre", body: "Ajoutez la description du poste visé. Notre modèle comprend ce qu'elle demande réellement." },
      { title: "Obtenez un CV adapté", body: "Un CV réécrit, compatible ATS, adapté à ce poste — toujours le vôtre, prêt à exporter." },
    ],
    toolsTitle: "Tout ce qu'il vous faut, pour une candidature ou cinquante.",
    toolsSubtitle: "Un compte, un profil, tous les outils pour votre recherche d'emploi.",
    tools: [
      { title: TOOL_TITLES_EN[0], body: "Collez une offre d'emploi et obtenez une version réécrite et compatible ATS de votre CV en quelques secondes." },
      { title: TOOL_TITLES_EN[1], body: "Pas de CV à importer ? Décrivez votre parcours avec vos propres mots, nous le structurons pour vous." },
      { title: TOOL_TITLES_EN[2], body: "Collez votre CV et une offre, sans compte requis — obtenez un score de correspondance et les mots-clés manquants.", free: "Gratuit, sans compte" },
      { title: TOOL_TITLES_EN[3], body: "Obtenez une revue précise d'une version adaptée, puis appliquez les améliorations en un clic." },
      { title: TOOL_TITLES_EN[4], body: "Une critique franchement honnête (et vraiment drôle), si vous voulez la version sans filtre." },
      { title: TOOL_TITLES_EN[5], body: "Questions d'entretien probables avec réponses modèles, ou un entretien simulé en direct." },
      { title: TOOL_TITLES_EN[6], body: "Un quiz rapide basé sur les compétences de votre CV, pour savoir quoi réviser avant de postuler." },
      { title: TOOL_TITLES_EN[7], body: "Posez toutes vos questions de carrière — basées sur votre CV réel, pas des conseils génériques." },
      { title: TOOL_TITLES_EN[8], body: "Générez une lettre de motivation à partir de tout CV adapté, adressée à la bonne entreprise." },
    ],
    pricingTitle: "Commencez gratuitement. Passez à Pro quand vous voulez.",
    pricingBody: "Créez un compte gratuit et adaptez jusqu'à 3 CV par mois. Passez à Pro pour 2,99 £/mois pour des générations illimitées, l'export DOCX et tous les outils.",
    pricingCta: "Commencer gratuitement",
    pricingIncludedTitle: "Gratuit",
    footerNote: "Des CV adaptés par IA pour le poste que vous voulez vraiment.",
  },
  de: {
    htmlLang: "de",
    dir: "ltr",
    langSwitchLabel: "English",
    kicker: "KI-gestützte Lebenslauf-Anpassung",
    headline: "Lebensläufe, die auffallen.",
    subheadline:
      "Laden Sie Ihren Lebenslauf einmal hoch. MyCV Buddy schreibt ihn für jede Bewerbung neu — passend zur Stelle, lesbar für jedes ATS, immer unverkennbar Sie.",
    ctaPrimary: "Lebenslauf anpassen",
    ctaSecondary: "So funktioniert's",
    signIn: "Anmelden",
    howItWorksTitle: "Drei Schritte. Kein Rätselraten.",
    steps: [
      { title: "Einmal hochladen", body: "Laden Sie Ihren aktuellen Lebenslauf hoch. Wir analysieren jeden Abschnitt — Erfahrung, Fähigkeiten, Ausbildung — in Sekunden." },
      { title: "Stellenanzeige einfügen", body: "Fügen Sie die Stellenbeschreibung hinzu, auf die Sie sich bewerben. Unser Modell versteht, was wirklich gefragt ist." },
      { title: "Angepassten Lebenslauf erhalten", body: "Ein neu geschriebener, ATS-sicherer Lebenslauf, passend zur Stelle — immer noch eindeutig Ihrer, exportbereit." },
    ],
    toolsTitle: "Alles, was Sie brauchen — für eine Bewerbung oder fünfzig.",
    toolsSubtitle: "Ein Konto, ein Profil, jedes Werkzeug für Ihre Jobsuche.",
    tools: [
      { title: TOOL_TITLES_EN[0], body: "Stellenbeschreibung einfügen und in Sekunden eine neu geschriebene, ATS-sichere Version Ihres Lebenslaufs erhalten." },
      { title: TOOL_TITLES_EN[1], body: "Kein Lebenslauf zum Hochladen? Beschreiben Sie Ihren Werdegang in eigenen Worten — wir strukturieren ihn für Sie." },
      { title: TOOL_TITLES_EN[2], body: "Lebenslauf und Stellenbeschreibung einfügen, kein Konto nötig — Übereinstimmungswert und fehlende Schlüsselwörter erhalten.", free: "Kostenlos, kein Konto" },
      { title: TOOL_TITLES_EN[3], body: "Erhalten Sie eine konkrete KI-Bewertung einer angepassten Version und übernehmen Sie die Verbesserungen mit einem Klick." },
      { title: TOOL_TITLES_EN[4], body: "Eine brutal ehrliche (und wirklich witzige) Kritik, wenn Sie die ungefilterte Version wollen." },
      { title: TOOL_TITLES_EN[5], body: "Wahrscheinliche Interviewfragen mit Musterantworten, oder ein Live-Übungsinterview." },
      { title: TOOL_TITLES_EN[6], body: "Ein kurzes Quiz basierend auf den Fähigkeiten Ihres Lebenslaufs, damit Sie wissen, was Sie vor der Bewerbung auffrischen sollten." },
      { title: TOOL_TITLES_EN[7], body: "Stellen Sie Karrierefragen — basierend auf Ihrem echten Lebenslauf, nicht auf generischen Ratschlägen." },
      { title: TOOL_TITLES_EN[8], body: "Erstellen Sie ein passendes Anschreiben aus jeder angepassten Lebenslaufversion, adressiert an das richtige Unternehmen." },
    ],
    pricingTitle: "Kostenlos starten. Jederzeit upgraden.",
    pricingBody: "Erstellen Sie ein kostenloses Konto und passen Sie bis zu 3 Lebensläufe pro Monat an. Upgraden Sie für 2,99 £/Monat auf Pro für unbegrenzte Generierungen, DOCX-Export und alle Werkzeuge.",
    pricingCta: "Kostenlos starten",
    pricingIncludedTitle: "Kostenlos",
    footerNote: "KI-angepasste Lebensläufe für den Job, den Sie wirklich wollen.",
  },
  pt: {
    htmlLang: "pt",
    dir: "ltr",
    langSwitchLabel: "English",
    kicker: "Adaptação de currículo com IA",
    headline: "Currículos que fazem você ser notado.",
    subheadline:
      "Envie seu currículo uma vez. O MyCV Buddy o reescreve para cada vaga que você se candidatar — ajustado à vaga, legível por qualquer ATS, sempre reconhecivelmente seu.",
    ctaPrimary: "Adaptar meu currículo",
    ctaSecondary: "Ver como funciona",
    signIn: "Entrar",
    howItWorksTitle: "Três passos. Sem adivinhação.",
    steps: [
      { title: "Envie uma vez", body: "Envie seu currículo atual. Analisamos cada seção — experiência, habilidades, formação — em segundos." },
      { title: "Cole a vaga", body: "Adicione a descrição da vaga que você está se candidatando. Nosso modelo entende o que ela realmente pede." },
      { title: "Receba um currículo adaptado", body: "Um currículo reescrito e compatível com ATS, ajustado à vaga — continua sendo seu, pronto para exportar." },
    ],
    toolsTitle: "Tudo o que você precisa, para uma candidatura ou cinquenta.",
    toolsSubtitle: "Uma conta, um perfil, todas as ferramentas para sua busca de emprego.",
    tools: [
      { title: TOOL_TITLES_EN[0], body: "Cole uma descrição de vaga e receba uma versão reescrita e compatível com ATS do seu currículo em segundos." },
      { title: TOOL_TITLES_EN[1], body: "Não tem um currículo? Descreva sua trajetória com suas próprias palavras e nós a estruturamos para você." },
      { title: TOOL_TITLES_EN[2], body: "Cole seu currículo e uma vaga, sem precisar de conta — receba uma pontuação e as palavras-chave que faltam.", free: "Grátis, sem conta" },
      { title: TOOL_TITLES_EN[3], body: "Receba uma avaliação específica de uma versão adaptada e aplique as melhorias com um clique." },
      { title: TOOL_TITLES_EN[4], body: "Uma crítica brutalmente honesta (e realmente engraçada), se você quiser a versão sem filtro." },
      { title: TOOL_TITLES_EN[5], body: "Perguntas de entrevista prováveis com respostas modelo, ou uma entrevista simulada ao vivo." },
      { title: TOOL_TITLES_EN[6], body: "Um teste rápido baseado nas habilidades do seu currículo, para saber o que revisar antes de se candidatar." },
      { title: TOOL_TITLES_EN[7], body: "Pergunte qualquer coisa sobre sua carreira — baseado no seu currículo real, não em conselhos genéricos." },
      { title: TOOL_TITLES_EN[8], body: "Gere uma carta de apresentação a partir de qualquer currículo adaptado, endereçada à empresa certa." },
    ],
    pricingTitle: "Comece grátis. Atualize quando quiser.",
    pricingBody: "Crie uma conta grátis e adapte até 3 currículos por mês. Atualize para o Pro por £2,99/mês para gerações ilimitadas, exportação DOCX e todas as ferramentas.",
    pricingCta: "Começar grátis",
    pricingIncludedTitle: "Grátis",
    footerNote: "Currículos adaptados por IA para o emprego que você realmente quer.",
  },
  ar: {
    htmlLang: "ar",
    dir: "rtl",
    langSwitchLabel: "English",
    kicker: "تخصيص السيرة الذاتية بالذكاء الاصطناعي",
    headline: "سير ذاتية تجعلك مرئيًا.",
    subheadline:
      "ارفع سيرتك الذاتية مرة واحدة. يقوم MyCV Buddy بإعادة كتابتها لكل وظيفة تتقدم لها — مطابقة للوظيفة، قابلة للقراءة من قبل أي نظام تتبع للمتقدمين، وتبقى أنت بلا شك.",
    ctaPrimary: "تخصيص سيرتي الذاتية",
    ctaSecondary: "شاهد كيف تعمل",
    signIn: "تسجيل الدخول",
    howItWorksTitle: "ثلاث خطوات. بلا تخمين.",
    steps: [
      { title: "ارفعها مرة واحدة", body: "أضف سيرتك الذاتية الحالية. نقوم بتحليل كل قسم — الخبرة، المهارات، التعليم — خلال ثوانٍ." },
      { title: "الصق الوظيفة", body: "أضف وصف الوظيفة التي تتقدم لها. يفهم نموذجنا ما تطلبه فعليًا." },
      { title: "احصل على سيرة ذاتية مخصصة", body: "سيرة ذاتية معاد كتابتها ومتوافقة مع أنظمة تتبع المتقدمين، مطابقة لتلك الوظيفة — تبقى سيرتك، وجاهزة للتصدير." },
    ],
    toolsTitle: "كل ما تحتاجه — لطلب واحد أو خمسين.",
    toolsSubtitle: "حساب واحد، ملف واحد، وكل أداة تلمس بحثك عن وظيفة.",
    tools: [
      { title: TOOL_TITLES_EN[0], body: "الصق وصف وظيفة واحصل على نسخة معاد كتابتها ومتوافقة مع أنظمة تتبع المتقدمين من سيرتك الذاتية خلال ثوانٍ." },
      { title: TOOL_TITLES_EN[1], body: "لا تملك سيرة ذاتية لرفعها؟ صف خلفيتك بكلماتك الخاصة وسنقوم بتنظيمها لك." },
      { title: TOOL_TITLES_EN[2], body: "الصق سيرتك الذاتية ووصف وظيفة، دون الحاجة لحساب — احصل على درجة تطابق والكلمات المفتاحية المفقودة.", free: "مجاني، بدون حساب" },
      { title: TOOL_TITLES_EN[3], body: "احصل على مراجعة محددة لنسخة مخصصة، ثم طبّق التحسينات بنقرة واحدة." },
      { title: TOOL_TITLES_EN[4], body: "نقد صريح تمامًا (ومضحك حقًا)، إذا كنت تريد النسخة غير المُنقّحة." },
      { title: TOOL_TITLES_EN[5], body: "أسئلة مقابلة محتملة مع إجابات نموذجية، أو مقابلة تجريبية مباشرة سؤالاً تلو الآخر." },
      { title: TOOL_TITLES_EN[6], body: "اختبار سريع مبني على مهارات سيرتك الذاتية، لتعرف ما يجب مراجعته قبل التقديم." },
      { title: TOOL_TITLES_EN[7], body: "اسأل أي شيء عن مسيرتك المهنية — مبني على سيرتك الذاتية الحقيقية، وليس نصائح عامة." },
      { title: TOOL_TITLES_EN[8], body: "أنشئ خطاب تقديم مطابق من أي سيرة ذاتية مخصصة، موجّه للشركة الصحيحة." },
    ],
    pricingTitle: "ابدأ مجانًا. قم بالترقية في أي وقت.",
    pricingBody: "أنشئ حسابًا مجانيًا وخصص حتى 3 سير ذاتية شهريًا. قم بالترقية إلى Pro مقابل 2.99 جنيه إسترليني شهريًا للحصول على عدد غير محدود من التخصيصات وتصدير DOCX وجميع الأدوات.",
    pricingCta: "ابدأ مجانًا",
    pricingIncludedTitle: "مجاني",
    footerNote: "سير ذاتية مخصصة بالذكاء الاصطناعي للوظيفة التي تريدها فعلاً.",
  },
  hi: {
    htmlLang: "hi",
    dir: "ltr",
    langSwitchLabel: "English",
    kicker: "एआई-संचालित रिज़्यूमे अनुकूलन",
    headline: "ऐसे रिज़्यूमे जो आपको दिखाएं।",
    subheadline:
      "अपना रिज़्यूमे एक बार अपलोड करें। MyCV Buddy इसे हर नौकरी के लिए फिर से लिखता है — भूमिका के अनुरूप, किसी भी ATS द्वारा पढ़ने योग्य, फिर भी पूरी तरह आपका।",
    ctaPrimary: "मेरा रिज़्यूमे तैयार करें",
    ctaSecondary: "देखें यह कैसे काम करता है",
    signIn: "साइन इन करें",
    howItWorksTitle: "तीन चरण। कोई अंदाज़ा नहीं।",
    steps: [
      { title: "एक बार अपलोड करें", body: "अपना मौजूदा रिज़्यूमे डालें। हम हर सेक्शन का विश्लेषण करते हैं — अनुभव, कौशल, शिक्षा — सेकंडों में।" },
      { title: "नौकरी का विवरण पेस्ट करें", body: "जिस नौकरी के लिए आप आवेदन कर रहे हैं उसका विवरण जोड़ें। हमारा मॉडल समझता है कि वह वास्तव में क्या मांग रही है।" },
      { title: "एक अनुकूलित रिज़्यूमे पाएं", body: "एक फिर से लिखा गया, ATS-सुरक्षित रिज़्यूमे उस भूमिका के अनुरूप — फिर भी स्पष्ट रूप से आपका, निर्यात के लिए तैयार।" },
    ],
    toolsTitle: "एक आवेदन के लिए या पचास के लिए — जो भी चाहिए, सब कुछ यहाँ है।",
    toolsSubtitle: "एक खाता, एक प्रोफ़ाइल, आपकी नौकरी खोज से जुड़ा हर टूल।",
    tools: [
      { title: TOOL_TITLES_EN[0], body: "नौकरी का विवरण पेस्ट करें और सेकंडों में अपने रिज़्यूमे का फिर से लिखा गया, ATS-सुरक्षित संस्करण पाएं।" },
      { title: TOOL_TITLES_EN[1], body: "अपलोड करने के लिए रिज़्यूमे नहीं है? अपनी पृष्ठभूमि अपने शब्दों में बताएं और हम इसे संरचित करेंगे।" },
      { title: TOOL_TITLES_EN[2], body: "अपना रिज़्यूमे और नौकरी का विवरण पेस्ट करें, खाते की आवश्यकता नहीं — मैच स्कोर और छूटे हुए कीवर्ड पाएं।", free: "मुफ़्त, बिना खाते के" },
      { title: TOOL_TITLES_EN[3], body: "किसी अनुकूलित संस्करण की विशिष्ट समीक्षा पाएं, फिर एक क्लिक में सुधार लागू करें।" },
      { title: TOOL_TITLES_EN[4], body: "एक बिल्कुल स्पष्ट (और वाकई मज़ेदार) समीक्षा, अगर आप बिना फ़िल्टर वाला संस्करण चाहते हैं।" },
      { title: TOOL_TITLES_EN[5], body: "मॉडल जवाबों के साथ संभावित साक्षात्कार प्रश्न, या एक-एक करके सवाल पूछने वाला लाइव मॉक इंटरव्यू।" },
      { title: TOOL_TITLES_EN[6], body: "आपके रिज़्यूमे के कौशल पर आधारित एक त्वरित क्विज़, ताकि आप जान सकें कि आवेदन से पहले क्या दोहराना है।" },
      { title: TOOL_TITLES_EN[7], body: "अपने करियर के बारे में कुछ भी पूछें — सामान्य सलाह नहीं, बल्कि आपके वास्तविक रिज़्यूमे पर आधारित।" },
      { title: TOOL_TITLES_EN[8], body: "किसी भी अनुकूलित रिज़्यूमे से मिलता-जुलता कवर लेटर बनाएं, सही कंपनी को संबोधित।" },
    ],
    pricingTitle: "मुफ़्त शुरू करें। कभी भी अपग्रेड करें।",
    pricingBody: "एक मुफ़्त खाता बनाएं और हर महीने 3 रिज़्यूमे तक अनुकूलित करें। असीमित जनरेशन, DOCX एक्सपोर्ट और सभी टूल के लिए £2.99/महीने में Pro में अपग्रेड करें।",
    pricingCta: "मुफ़्त शुरू करें",
    pricingIncludedTitle: "मुफ़्त",
    footerNote: "वह नौकरी पाने के लिए AI-अनुकूलित रिज़्यूमे जो आप वाकई चाहते हैं।",
  },
};
