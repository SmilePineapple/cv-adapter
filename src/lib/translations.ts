/**
 * UI Translations for CV Adapter
 * Supports multiple languages for key UI elements
 */

export type SupportedLanguage = 'en' | 'fr' | 'es' | 'ar' | 'de' | 'pt' | 'hi'

export interface Translations {
  // Navigation
  dashboard: string
  upload: string
  generate: string
  history: string
  settings: string
  logout: string
  
  // Actions
  uploadCV: string
  generateCV: string
  createCoverLetter: string
  download: string
  delete: string
  edit: string
  view: string
  save: string
  cancel: string
  
  // Status
  loading: string
  success: string
  error: string
  processing: string
  
  // Usage
  freeGeneration: string
  proGenerations: string
  upgradeNow: string
  usageRemaining: string
  
  // CV Generation
  jobTitle: string
  jobDescription: string
  rewriteStyle: string
  tone: string
  customSections: string
  
  // Messages
  uploadSuccess: string
  generationSuccess: string
  limitReached: string
  errorOccurred: string
}

export const translations: Record<SupportedLanguage, Translations> = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    upload: 'Upload',
    generate: 'Generate',
    history: 'History',
    settings: 'Settings',
    logout: 'Logout',
    
    // Actions
    uploadCV: 'Upload CV',
    generateCV: 'Generate CV',
    createCoverLetter: 'Create Cover Letter',
    download: 'Download',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    save: 'Save',
    cancel: 'Cancel',
    
    // Status
    loading: 'Loading...',
    success: 'Success!',
    error: 'Error',
    processing: 'Processing...',
    
    // Usage
    freeGeneration: 'Free Generation',
    proGenerations: 'Pro Generations',
    upgradeNow: 'Upgrade Now',
    usageRemaining: 'remaining',
    
    // CV Generation
    jobTitle: 'Job Title',
    jobDescription: 'Job Description',
    rewriteStyle: 'Rewrite Style',
    tone: 'Tone',
    customSections: 'Custom Sections',
    
    // Messages
    uploadSuccess: 'CV uploaded successfully!',
    generationSuccess: 'CV generated successfully!',
    limitReached: 'Generation limit reached. Upgrade to Pro!',
    errorOccurred: 'An error occurred. Please try again.',
  },
  
  fr: {
    // Navigation
    dashboard: 'Tableau de bord',
    upload: 'Télécharger',
    generate: 'Générer',
    history: 'Historique',
    settings: 'Paramètres',
    logout: 'Déconnexion',
    
    // Actions
    uploadCV: 'Télécharger CV',
    generateCV: 'Générer CV',
    createCoverLetter: 'Créer une lettre de motivation',
    download: 'Télécharger',
    delete: 'Supprimer',
    edit: 'Modifier',
    view: 'Voir',
    save: 'Enregistrer',
    cancel: 'Annuler',
    
    // Status
    loading: 'Chargement...',
    success: 'Succès!',
    error: 'Erreur',
    processing: 'Traitement...',
    
    // Usage
    freeGeneration: 'Génération gratuite',
    proGenerations: 'Générations Pro',
    upgradeNow: 'Passer à Pro',
    usageRemaining: 'restant',
    
    // CV Generation
    jobTitle: 'Titre du poste',
    jobDescription: 'Description du poste',
    rewriteStyle: 'Style de réécriture',
    tone: 'Ton',
    customSections: 'Sections personnalisées',
    
    // Messages
    uploadSuccess: 'CV téléchargé avec succès!',
    generationSuccess: 'CV généré avec succès!',
    limitReached: 'Limite de génération atteinte. Passez à Pro!',
    errorOccurred: 'Une erreur s\'est produite. Veuillez réessayer.',
  },
  
  es: {
    // Navigation
    dashboard: 'Panel',
    upload: 'Subir',
    generate: 'Generar',
    history: 'Historial',
    settings: 'Configuración',
    logout: 'Cerrar sesión',
    
    // Actions
    uploadCV: 'Subir CV',
    generateCV: 'Generar CV',
    createCoverLetter: 'Crear carta de presentación',
    download: 'Descargar',
    delete: 'Eliminar',
    edit: 'Editar',
    view: 'Ver',
    save: 'Guardar',
    cancel: 'Cancelar',
    
    // Status
    loading: 'Cargando...',
    success: '¡Éxito!',
    error: 'Error',
    processing: 'Procesando...',
    
    // Usage
    freeGeneration: 'Generación gratuita',
    proGenerations: 'Generaciones Pro',
    upgradeNow: 'Actualizar ahora',
    usageRemaining: 'restante',
    
    // CV Generation
    jobTitle: 'Título del trabajo',
    jobDescription: 'Descripción del trabajo',
    rewriteStyle: 'Estilo de reescritura',
    tone: 'Tono',
    customSections: 'Secciones personalizadas',
    
    // Messages
    uploadSuccess: '¡CV subido con éxito!',
    generationSuccess: '¡CV generado con éxito!',
    limitReached: 'Límite de generación alcanzado. ¡Actualiza a Pro!',
    errorOccurred: 'Ocurrió un error. Por favor, inténtalo de nuevo.',
  },
  
  ar: {
    // Navigation
    dashboard: 'لوحة التحكم',
    upload: 'رفع',
    generate: 'توليد',
    history: 'السجل',
    settings: 'الإعدادات',
    logout: 'تسجيل الخروج',
    
    // Actions
    uploadCV: 'رفع السيرة الذاتية',
    generateCV: 'توليد السيرة الذاتية',
    createCoverLetter: 'إنشاء خطاب تغطية',
    download: 'تحميل',
    delete: 'حذف',
    edit: 'تعديل',
    view: 'عرض',
    save: 'حفظ',
    cancel: 'إلغاء',
    
    // Status
    loading: 'جاري التحميل...',
    success: 'نجح!',
    error: 'خطأ',
    processing: 'جاري المعالجة...',
    
    // Usage
    freeGeneration: 'توليد مجاني',
    proGenerations: 'توليدات احترافية',
    upgradeNow: 'الترقية الآن',
    usageRemaining: 'متبقي',
    
    // CV Generation
    jobTitle: 'المسمى الوظيفي',
    jobDescription: 'وصف الوظيفة',
    rewriteStyle: 'أسلوب إعادة الكتابة',
    tone: 'النبرة',
    customSections: 'أقسام مخصصة',
    
    // Messages
    uploadSuccess: 'تم رفع السيرة الذاتية بنجاح!',
    generationSuccess: 'تم توليد السيرة الذاتية بنجاح!',
    limitReached: 'تم الوصول إلى حد التوليد. قم بالترقية إلى Pro!',
    errorOccurred: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
  },
  
  de: {
    // Navigation
    dashboard: 'Dashboard',
    upload: 'Hochladen',
    generate: 'Generieren',
    history: 'Verlauf',
    settings: 'Einstellungen',
    logout: 'Abmelden',
    
    // Actions
    uploadCV: 'Lebenslauf hochladen',
    generateCV: 'Lebenslauf generieren',
    createCoverLetter: 'Anschreiben erstellen',
    download: 'Herunterladen',
    delete: 'Löschen',
    edit: 'Bearbeiten',
    view: 'Ansehen',
    save: 'Speichern',
    cancel: 'Abbrechen',
    
    // Status
    loading: 'Laden...',
    success: 'Erfolg!',
    error: 'Fehler',
    processing: 'Verarbeitung...',
    
    // Usage
    freeGeneration: 'Kostenlose Generierung',
    proGenerations: 'Pro-Generierungen',
    upgradeNow: 'Jetzt upgraden',
    usageRemaining: 'verbleibend',
    
    // CV Generation
    jobTitle: 'Berufsbezeichnung',
    jobDescription: 'Stellenbeschreibung',
    rewriteStyle: 'Umschreibungsstil',
    tone: 'Ton',
    customSections: 'Benutzerdefinierte Abschnitte',
    
    // Messages
    uploadSuccess: 'Lebenslauf erfolgreich hochgeladen!',
    generationSuccess: 'Lebenslauf erfolgreich generiert!',
    limitReached: 'Generierungslimit erreicht. Auf Pro upgraden!',
    errorOccurred: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
  },
  
  pt: {
    // Navigation
    dashboard: 'Painel',
    upload: 'Carregar',
    generate: 'Gerar',
    history: 'Histórico',
    settings: 'Configurações',
    logout: 'Sair',
    
    // Actions
    uploadCV: 'Carregar CV',
    generateCV: 'Gerar CV',
    createCoverLetter: 'Criar carta de apresentação',
    download: 'Baixar',
    delete: 'Excluir',
    edit: 'Editar',
    view: 'Ver',
    save: 'Salvar',
    cancel: 'Cancelar',
    
    // Status
    loading: 'Carregando...',
    success: 'Sucesso!',
    error: 'Erro',
    processing: 'Processando...',
    
    // Usage
    freeGeneration: 'Geração gratuita',
    proGenerations: 'Gerações Pro',
    upgradeNow: 'Atualizar agora',
    usageRemaining: 'restante',
    
    // CV Generation
    jobTitle: 'Título do cargo',
    jobDescription: 'Descrição do cargo',
    rewriteStyle: 'Estilo de reescrita',
    tone: 'Tom',
    customSections: 'Seções personalizadas',
    
    // Messages
    uploadSuccess: 'CV carregado com sucesso!',
    generationSuccess: 'CV gerado com sucesso!',
    limitReached: 'Limite de geração atingido. Atualize para Pro!',
    errorOccurred: 'Ocorreu um erro. Por favor, tente novamente.',
  },
  
  hi: {
    // Navigation
    dashboard: 'डैशबोर्ड',
    upload: 'अपलोड',
    generate: 'जनरेट',
    history: 'इतिहास',
    settings: 'सेटिंग्स',
    logout: 'लॉग आउट',
    
    // Actions
    uploadCV: 'CV अपलोड करें',
    generateCV: 'CV जनरेट करें',
    createCoverLetter: 'कवर लेटर बनाएं',
    download: 'डाउनलोड',
    delete: 'हटाएं',
    edit: 'संपादित करें',
    view: 'देखें',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    
    // Status
    loading: 'लोड हो रहा है...',
    success: 'सफलता!',
    error: 'त्रुटि',
    processing: 'प्रोसेस हो रहा है...',
    
    // Usage
    freeGeneration: 'मुफ्त जनरेशन',
    proGenerations: 'प्रो जनरेशन',
    upgradeNow: 'अभी अपग्रेड करें',
    usageRemaining: 'शेष',
    
    // CV Generation
    jobTitle: 'नौकरी का शीर्षक',
    jobDescription: 'नौकरी का विवरण',
    rewriteStyle: 'पुनर्लेखन शैली',
    tone: 'टोन',
    customSections: 'कस्टम अनुभाग',
    
    // Messages
    uploadSuccess: 'CV सफलतापूर्वक अपलोड किया गया!',
    generationSuccess: 'CV सफलतापूर्वक जनरेट किया गया!',
    limitReached: 'जनरेशन सीमा पहुंच गई। Pro में अपग्रेड करें!',
    errorOccurred: 'एक त्रुटि हुई। कृपया पुनः प्रयास करें।',
  },
}

/**
 * Get translations for a specific language
 */
export function getTranslations(language: SupportedLanguage): Translations {
  return translations[language] || translations.en
}

/**
 * Translate a key for a specific language
 */
export function t(key: keyof Translations, language: SupportedLanguage = 'en'): string {
  const trans = getTranslations(language)
  return trans[key] || key
}
