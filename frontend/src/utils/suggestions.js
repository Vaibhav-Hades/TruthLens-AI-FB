// Multilingual suggestions for ChatbotWidget
export const SUGGESTIONS = {
  'en-US': [
    '🔍 Verify a claim',
    '📰 Check news authenticity',
    '📊 Show my analytics',
    '💡 What is misinformation?',
  ],
  'hi-IN': [
    '🔍 किसी दावे को सत्यापित करें',
    '📰 समाचार की सत्यता की जांच करें',
    '📊 मेरी विश्लेषण दिखाएँ',
    '💡 गलत सूचना क्या है?',
  ],
  'te-IN': [
    '🔍 ఒక దావను ధృవీకరించండి',
    '📰 వార్తల ఖచ్చితత్వం తనిఖీ చేయండి',
    '📊 నా విశ్లేషణ చూపించండి',
    '💡 తప్పుడు సమాచారం అంటే?',
  ],
  'ta-IN': [
    '🔍 ஒரு கூற்றை சரிபார்க்கவும்',
    '📰 செய்திகளின் உண்மைத்தன்மை சரிபார்க்கவும்',
    '📊 என் பகுப்பாய்வு காட்டவும்',
    '💡 தவறான தகவல் என்றால் என்ன?',
  ],
  'ta-IN': [
    '🔍 ஒரு கூற்றை சரிபார்க்கவும்',
    '📰 செய்திகளின் உண்மைத்தன்மை சரிபார்க்கவும்',
    '📊 என் பகுப்பாய்வு காட்டவும்',
    '💡 தவறான தகவல் என்றால் என்ன?',
  ],
  'bn-IN': [
    '🔍 একটি দাবি যাচাই করুন',
    '📰 সংবাদ সত্যতা পরীক্ষা করুন',
    '📊 আমার বিশ্লেষণ দেখান',
    '💡 মিথ্যা তথ্য কি?',
  ],
  'es-ES': [
    '🔍 Verificar una afirmación',
    '📰 Verificar autenticidad de noticias',
    '📊 Mostrar mis analíticas',
    '💡 ¿Qué es la desinformación?',
  ],
  'fr-FR': [
    '🔍 Vérifier une affirmation',
    '📰 Vérifier l\'authenticité des nouvelles',
    '📊 Afficher mes analyses',
    '💡 Qu\'est-ce que la désinformation?',
  ],
  'zh-CN': [
    '🔍 验证声明',
    '📰 检查新闻真实性',
    '📊 显示我的分析',
    '💡 什么是错误信息?',
  ],
  'ar-SA': [
    '🔍 تحقق من الادعاء',
    '📰 تحقق من أصالة الأخبار',
    '📊 أظهر تحليلاتي',
    '💡 ما هي المعلومات المضللة?',
  ],
};

export const getSuggestions = (langCode) => {
  return SUGGESTIONS[langCode] || SUGGESTIONS['en-US'];
};
