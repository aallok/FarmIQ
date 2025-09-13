// app.js - FarmIQ i18n + profile + helpers
(function(window){
  const LS_LANG = 'farmi_lang';
  const PROFILE_PREFIX = 'farmi_';

  const DICT = {
    en: {
      heroTitle: 'Ask in your language — text, voice, or photo',
      heroSub: 'Local, contextual, fast.',
      farmerTitle: 'Farmer Details',
      farmerSub: 'Fill farmer profile to get personalized advice',
      openChat: 'Open Chat',
      uploadPhoto: 'Upload Photo',
      previewLaunch: 'Launch Demo',
      previewTip: "If you can't read, play the language (works in Chrome) or ask someone to tap it.",
      welcomeMsg: 'Welcome! Ask your question.',
      sendButton: 'Send',
      backButton: 'Back',
      profileSave: 'Save'
    },
    hi: {
      heroTitle: 'अपनी भाषा में पूछें — टेक्स्ट, वॉइस, या फोटो',
      heroSub: 'स्थानीय, संदर्भ-आधारित, तेज़।',
      farmerTitle: 'किसान विवरण',
      farmerSub: 'व्यक्तिगत सलाह के लिए किसान प्रोफ़ाइल भरें',
      openChat: 'चैट खोलें',
      uploadPhoto: 'फोटो अपलोड करें',
      previewLaunch: 'डेमो शुरू करें',
      previewTip: 'अगर आप पढ़ नहीं पाते, भाषा चलाएँ (Chrome में काम करता है) या किसी से पूछें कि टैप करे।',
      welcomeMsg: 'स्वागत है! अपना सवाल पूछें।',
      sendButton: 'भेजें',
      backButton: 'वापस',
      profileSave: 'सहेजें'
    },
    ml: {
      heroTitle: 'നിങ്ങളുടെ ഭാഷയിൽ ചോദിക്കുക — ടെക്സ്റ്റ്, വോയിസ്, അല്ലെങ്കിൽ ഫോട്ടോ',
      heroSub: 'പ്രാദേശികം, സാന്ദർഭികം, ദ്രുതം.',
      farmerTitle: 'കർഷക വിവരങ്ങൾ',
      farmerSub: 'വ്യക്തിഗത ഉപദേശം ലഭിക്കാനായി പ്രൊഫൈൽ പൂരിപ്പിക്കുക',
      openChat: 'ചാറ്റ് തുറക്കുക',
      uploadPhoto: 'ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക',
      previewLaunch: 'ഡെമോ ആരംഭിക്കുക',
      previewTip: 'നിങ്ങൾക്ക് വായിക്കാൻ കഴിയില്ലെങ്കിൽ ഭാഷ ഓടിക്കുക (Chrome-ൽ പ്രവർത്തിക്കും) അല്ലെങ്കിൽ ആരെയെങ്കിലും ടാപ്പ് ചെയ്യാൻ ആവശ്യപ്പെടുക.',
      welcomeMsg: 'സ്വാഗതം! നിങ്ങളുടെ ചോദ്യം ചോദിക്കുക.',
      sendButton: 'അയയ്‌ക്കുക',
      backButton: 'മടങ്ങുക',
      profileSave: 'സേവ് ചെയ്യുക'
    }
    // add other languages (kn/ta/te/bn/mr/gu/or/pa) here if needed
  };

  function getLang(){ return localStorage.getItem(LS_LANG) || 'en'; }
  function setLang(code){
    if(!DICT[code]) console.warn('Language not supported:', code);
    localStorage.setItem(LS_LANG, code);
    applyTranslations();
  }

  function applyTranslations(){
    const lang = getLang();
    const dict = DICT[lang] || DICT.en;

    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      if(key && dict[key] !== undefined) el.textContent = dict[key];
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{
      const key = el.getAttribute('data-i18n-placeholder');
      if(key && dict[key] !== undefined) el.setAttribute('placeholder', dict[key]);
    });

    document.documentElement.lang = (lang==='hi'?'hi':(lang==='ml'?'ml':'en'));

    // update small dynamic controls if any
    const previewBtn = document.querySelector('[data-i18n="previewLaunch"]');
    if(previewBtn) previewBtn.textContent = dict.previewLaunch || previewBtn.textContent;
  }

  function saveProfile(obj){
    Object.keys(obj||{}).forEach(k=> localStorage.setItem(PROFILE_PREFIX + k, obj[k]));
  }

  function loadProfile(){
    const keys = ['name','village','state','crop','season','history'];
    const out = {};
    keys.forEach(k => out[k] = localStorage.getItem(PROFILE_PREFIX + k) || '');
    return out;
  }

  window.FarmIQ = { getLang, setLang, applyTranslations, saveProfile, loadProfile };

  window.addEventListener('DOMContentLoaded', ()=>{
    applyTranslations();

    const langSwitch = document.getElementById('langSwitch');
    if(langSwitch){
      langSwitch.value = getLang();
      langSwitch.addEventListener('change', e => setLang(e.target.value));
    }

    const profile = loadProfile();
    if(document.getElementById('fname')) document.getElementById('fname').value = profile.name || '';
    if(document.getElementById('village')) document.getElementById('village').value = profile.village || '';
    if(document.getElementById('state')) document.getElementById('state').value = profile.state || '';
    if(document.getElementById('crop')) document.getElementById('crop').value = profile.crop || '';
    if(document.getElementById('season')) document.getElementById('season').value = profile.season || '';
  });
})(window);
