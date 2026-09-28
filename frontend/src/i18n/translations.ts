export const languages = [
  { code: "en", name: "English", direction: "ltr" },
  { code: "as", name: "অসমীয়া", direction: "ltr" },
  { code: "bn", name: "বাংলা", direction: "ltr" },
  { code: "brx", name: "बड़ो", direction: "ltr" },
  { code: "doi", name: "डोगरी", direction: "ltr" },
  { code: "gu", name: "ગુજરાતી", direction: "ltr" },
  { code: "hi", name: "हिन्दी", direction: "ltr" },
  { code: "kn", name: "ಕನ್ನಡ", direction: "ltr" },
  { code: "ks", name: "کٲشُر", direction: "rtl" },
  { code: "kok", name: "कोंकणी", direction: "ltr" },
  { code: "mai", name: "मैथिली", direction: "ltr" },
  { code: "ml", name: "മലയാളം", direction: "ltr" },
  { code: "mni", name: "মৈতৈলোন্", direction: "ltr" },
  { code: "mr", name: "मराठी", direction: "ltr" },
  { code: "ne", name: "नेपाली", direction: "ltr" },
  { code: "or", name: "ଓଡ଼ିଆ", direction: "ltr" },
  { code: "pa", name: "ਪੰਜਾਬੀ", direction: "ltr" },
  { code: "sa", name: "संस्कृतम्", direction: "ltr" },
  { code: "sat", name: "ᱥᱟᱱᱛᱟᱲᱤ", direction: "ltr" },
  { code: "sd", name: "सिन्धी", direction: "rtl" },
  { code: "ta", name: "தமிழ்", direction: "ltr" },
  { code: "te", name: "తెలుగు", direction: "ltr" },
  { code: "ur", name: "اردو", direction: "rtl" },
] as const;

export type LanguageCode = (typeof languages)[number]["code"];
export type TranslationKey = string;

const english: Record<string, string> = {
  "Dashboard": "Dashboard", "Weather": "Weather", "Soil": "Soil", "Crops": "Crops",
  "Disease": "Disease", "Advisory": "Advisory", "Regenerative": "Regenerative",
  "Profile": "Profile", "Settings": "Settings", "Home": "Home", "Today": "Today",
  "Farm signals": "Farm signals", "AI plan": "AI plan", "Stewardship": "Stewardship", "Farm": "Farm",
  "Logout": "Logout", "Login": "Login", "Demo Login": "Demo Login", "Mobile number or email": "Mobile number or email",
  "Password": "Password", "Sign in": "Sign in", "Language": "Language", "Preferences": "Preferences",
  "Notifications": "Notifications", "Save": "Save", "Edit": "Edit", "Farm profile": "Farm profile",
  "Your AI Farm Advisor": "Your AI Farm Advisor", "Weather intelligence": "Weather intelligence",
  "Soil intelligence": "Soil intelligence", "Crop intelligence": "Crop intelligence",
  "Crop health intelligence": "Crop health intelligence", "Regenerative agriculture": "Regenerative agriculture",
  "Manage how AgriNexus AI works for you": "Manage how AgriNexus AI works for you",
  "What crop makes sense for this farm, and why?": "What crop makes sense for this farm, and why?",
  "What can you safely do on your farm this week?": "What can you safely do on your farm this week?",
  "Is your soil ready for the crop, and what should you do next?": "Is your soil ready for the crop, and what should you do next?",
  "Check your crop health": "Check your crop health", "View details": "View details", "Try again": "Try again",
  "Get started": "Get started", "Explore dashboard": "Explore dashboard", "Good morning": "Good morning",
  "Farmer details": "Farmer details", "Full name": "Full name", "Location": "Location", "Farm size": "Farm size",
  "Irrigation type": "Irrigation type", "Current crop": "Current crop", "Preferred language": "Preferred language",
  "Soil pH": "Soil pH", "Units": "Units", "Advisory and weather alerts": "Advisory and weather alerts",
  "Take photo": "Take photo", "Upload photo": "Upload photo", "Analyze photo": "Analyze photo",
  "Retake": "Retake", "Upload another": "Upload another", "Capture photo": "Capture photo",
  "Today's farm plan": "Today's farm plan", "Farm outlook": "Farm outlook", "Soil profile": "Soil profile",
  "How your soil fits your crop": "How your soil fits your crop", "What to do next": "What to do next",
  "Why this crop?": "Why this crop?", "Next steps for this crop": "Next steps for this crop",
  "Alternatives worth considering": "Alternatives worth considering", "Crop planning": "Crop planning",
  "Visual screening result": "Visual screening result", "What we observed": "What we observed",
  "What to do now": "What to do now", "Prevention / monitoring": "Prevention / monitoring",
  "Screening confidence": "Screening confidence", "Sample data": "Sample data", "Sample model": "Sample model",
  "Ask advisor": "Ask advisor", "Ask your advisor": "Ask your advisor", "Full plan": "Full plan",
  "Data source": "Data source", "Last updated": "Last updated", "AI-generated": "AI-generated",
};

const common = {
  Dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", Weather: "ಹವಾಮಾನ", Soil: "ಮಣ್ಣು", Crops: "ಬೆಳೆಗಳು", Disease: "ರೋಗ", Advisory: "ಸಲಹೆ", Regenerative: "ಪುನರುತ್ಪಾದಕ ಕೃಷಿ", Profile: "ಪ್ರೊಫೈಲ್", Settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು", Home: "ಮುಖಪುಟ", Today: "ಇಂದು", Farm: "ಫಾರ್ಮ್", Logout: "ಲಾಗ್ ಔಟ್", Login: "ಲಾಗಿನ್", "Demo Login": "ಡೆಮೋ ಲಾಗಿನ್", "Mobile number or email": "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಅಥವಾ ಇಮೇಲ್", Password: "ಪಾಸ್‌ವರ್ಡ್", "Sign in": "ಸೈನ್ ಇನ್", Language: "ಭಾಷೆ", Preferences: "ಆದ್ಯತೆಗಳು", Save: "ಉಳಿಸಿ", Edit: "ತಿದ್ದುಪಡಿ", "Farm profile": "ಫಾರ್ಮ್ ಪ್ರೊಫೈಲ್", "Farm size": "ಫಾರ್ಮ್ ಗಾತ್ರ", "Current crop": "ಪ್ರಸ್ತುತ ಬೆಳೆ", "Take photo": "ಫೋಟೋ ತೆಗೆಯಿರಿ", "Upload photo": "ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ", "Analyze photo": "ಫೋಟೋ ವಿಶ್ಲೇಷಿಸಿ", "Capture photo": "ಫೋಟೋ ಸೆರೆಹಿಡಿಯಿರಿ", Retake: "ಮತ್ತೆ ತೆಗೆಯಿರಿ", "Upload another": "ಮತ್ತೊಂದು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ", "Today's farm plan": "ಇಂದಿನ ಕೃಷಿ ಯೋಜನೆ", "What to do next": "ಮುಂದೆ ಏನು ಮಾಡಬೇಕು?", "Why this crop?": "ಈ ಬೆಳೆ ಏಕೆ?", "What we observed": "ನಾವು ಗಮನಿಸಿದ್ದು", "What to do now": "ಈಗ ಏನು ಮಾಡಬೇಕು", "Prevention / monitoring": "ತಡೆಗಟ್ಟುವಿಕೆ / ಮೇಲ್ವಿಚಾರಣೆ", "Sample data": "ಮಾದರಿ ಡೇಟಾ", "Sample model": "ಮಾದರಿ ಮಾದರಿ",
};

const translations: Partial<Record<LanguageCode, Record<string, string>>> = {
  kn: {
    ...common,
    "Good morning": "ಶುಭೋದಯ",
    "Farmer sign in": "ರೈತ ಲಾಗಿನ್", "Enter your account details or start with a demo farmer session.": "ನಿಮ್ಮ ಖಾತೆ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ ಅಥವಾ ಡೆಮೋ ರೈತ ಸೆಷನ್‌ನೊಂದಿಗೆ ಪ್ರಾರಂಭಿಸಿ.",
    "Hackathon demo": "ಹ್ಯಾಕ್‌ಥಾನ್ ಡೆಮೋ", "Signing in...": "ಲಾಗಿನ್ ಮಾಡುತ್ತಿದೆ...", "Demo accounts: manjunath@example.test, lakshmi@example.test, arjun@example.test · Password: demo123": "ಡೆಮೋ ಖಾತೆಗಳು: manjunath@example.test, lakshmi@example.test, arjun@example.test · ಪಾಸ್‌ವರ್ಡ್: demo123",
    "Farm intelligence for better decisions": "ಉತ್ತಮ ನಿರ್ಧಾರಗಳಿಗೆ ಕೃಷಿ ಬುದ್ಧಿವಂತಿಕೆ", "Mock frontend session. No backend authentication is used.": "ಮಾಕ್ ಫ್ರಂಟ್‌ಎಂಡ್ ಸೆಷನ್. ಯಾವುದೇ ಬ್ಯಾಕ್‌ಎಂಡ್ ಪ್ರಮಾಣೀಕರಣವನ್ನು ಬಳಸಲಾಗುವುದಿಲ್ಲ.",
    "Weather intelligence": "ಹವಾಮಾನ ಬುದ್ಧಿವಂತಿಕೆ", "Soil intelligence": "ಮಣ್ಣಿನ ಬುದ್ಧಿವಂತಿಕೆ", "Crop intelligence": "ಬೆಳೆ ಬುದ್ಧಿವಂತಿಕೆ", "Crop health intelligence": "ಬೆಳೆ ಆರೋಗ್ಯ ಬುದ್ಧಿವಂತಿಕೆ", "Your AI Farm Advisor": "ನಿಮ್ಮ AI ಕೃಷಿ ಸಲಹೆಗಾರ", "Regenerative agriculture": "ಪುನರುತ್ಪಾದಕ ಕೃಷಿ",
    "Farm signals": "ಕೃಷಿ ಸಂಕೇತಗಳು", "AI plan": "AI ಯೋಜನೆ", "Stewardship": "ಸುಸ್ಥಿರ ಕೃಷಿ", "Choose the language for the application interface.": "ಅಪ್ಲಿಕೇಶನ್ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.",
  },
  hi: {
    Dashboard: "डैशबोर्ड", Weather: "मौसम", Soil: "मिट्टी", Crops: "फसलें", Disease: "रोग", Advisory: "सलाह", Regenerative: "पुनर्योजी कृषि", Profile: "प्रोफ़ाइल", Settings: "सेटिंग्स", Home: "होम", Today: "आज", Farm: "खेत", Logout: "लॉग आउट", Login: "लॉगिन", "Demo Login": "डेमो लॉगिन", "Mobile number or email": "मोबाइल नंबर या ईमेल", Password: "पासवर्ड", "Sign in": "साइन इन", Language: "भाषा", Preferences: "प्राथमिकताएँ", Save: "सहेजें", Edit: "संपादित करें", "Farm profile": "खेत की प्रोफ़ाइल", "Farm size": "खेत का आकार", "Current crop": "वर्तमान फसल", "Take photo": "फ़ोटो लें", "Upload photo": "फ़ोटो अपलोड करें", "Analyze photo": "फ़ोटो का विश्लेषण करें", "Capture photo": "फ़ोटो कैप्चर करें", Retake: "फिर से लें", "Upload another": "दूसरी फ़ोटो अपलोड करें", "Today's farm plan": "आज की खेती की योजना", "What to do next": "अब आगे क्या करें?", "Why this crop?": "यह फसल क्यों?", "What we observed": "हमने क्या देखा", "What to do now": "अभी क्या करें", "Prevention / monitoring": "बचाव / निगरानी", "Sample data": "नमूना डेटा", "Sample model": "नमूना मॉडल",
  },
  ta: {
    Dashboard: "டாஷ்போர்டு", Weather: "வானிலை", Soil: "மண்", Crops: "பயிர்கள்", Disease: "நோய்", Advisory: "ஆலோசனை", Regenerative: "மீளுருவாக்க வேளாண்மை", Profile: "சுயவிவரம்", Settings: "அமைப்புகள்", Home: "முகப்பு", Today: "இன்று", Farm: "பண்ணை", Logout: "வெளியேறு", Login: "உள்நுழைவு", "Demo Login": "டெமோ உள்நுழைவு", "Mobile number or email": "மொபைல் எண் அல்லது மின்னஞ்சல்", Password: "கடவுச்சொல்", "Sign in": "உள்நுழைக", Language: "மொழி", Preferences: "விருப்பங்கள்", Save: "சேமி", Edit: "திருத்து", "Farm profile": "பண்ணை விவரம்", "Farm size": "பண்ணை அளவு", "Current crop": "தற்போதைய பயிர்", "Take photo": "புகைப்படம் எடு", "Upload photo": "புகைப்படம் பதிவேற்று", "Analyze photo": "புகைப்படத்தை பகுப்பாய்வு செய்", "Capture photo": "புகைப்படம் எடு", Retake: "மீண்டும் எடு", "Upload another": "மற்றொன்றை பதிவேற்று", "Today's farm plan": "இன்றைய பண்ணைத் திட்டம்", "What to do next": "அடுத்து என்ன செய்யலாம்?", "Why this crop?": "இந்தப் பயிர் ஏன்?", "What we observed": "கவனித்தவை", "What to do now": "இப்போது செய்ய வேண்டியது", "Prevention / monitoring": "தடுப்பு / கண்காணிப்பு", "Sample data": "மாதிரி தரவு", "Sample model": "மாதிரி முறை",
  },
  te: {
    Dashboard: "డాష్‌బోర్డ్", Weather: "వాతావరణం", Soil: "నేల", Crops: "పంటలు", Disease: "వ్యాధి", Advisory: "సలహా", Regenerative: "పునరుత్పాదక వ్యవసాయం", Profile: "ప్రొఫైల్", Settings: "సెట్టింగ్‌లు", Home: "హోమ్", Today: "ఈరోజు", Farm: "వ్యవసాయ క్షేత్రం", Logout: "లాగ్ అవుట్", Login: "లాగిన్", "Demo Login": "డెమో లాగిన్", "Mobile number or email": "మొబైల్ నంబర్ లేదా ఇమెయిల్", Password: "పాస్‌వర్డ్", "Sign in": "సైన్ ఇన్", Language: "భాష", Preferences: "ప్రాధాన్యతలు", Save: "సేవ్ చేయి", Edit: "సవరించు", "Farm profile": "వ్యవసాయ ప్రొఫైల్", "Farm size": "వ్యవసాయ విస్తీర్ణం", "Current crop": "ప్రస్తుత పంట", "Take photo": "ఫోటో తీయండి", "Upload photo": "ఫోటో అప్‌లోడ్ చేయండి", "Analyze photo": "ఫోటోను విశ్లేషించండి", "Capture photo": "ఫోటో క్యాప్చర్ చేయండి", Retake: "మళ్లీ తీయండి", "Upload another": "మరొకటి అప్‌లోడ్ చేయండి", "Today's farm plan": "ఈరోజు వ్యవసాయ ప్రణాళిక", "What to do next": "తర్వాత ఏమి చేయాలి?", "Why this crop?": "ఈ పంట ఎందుకు?", "What we observed": "మేము గమనించినవి", "What to do now": "ఇప్పుడు ఏమి చేయాలి", "Prevention / monitoring": "నివారణ / పర్యవేక్షణ", "Sample data": "నమూనా డేటా", "Sample model": "నమూనా మోడల్",
  },
  ml: {
    Dashboard: "ഡാഷ്ബോർഡ്", Weather: "കാലാവസ്ഥ", Soil: "മണ്ണ്", Crops: "വിളകൾ", Disease: "രോഗം", Advisory: "ഉപദേശം", Regenerative: "പുനരുജ്ജീവന കൃഷി", Profile: "പ്രൊഫൈൽ", Settings: "ക്രമീകരണങ്ങൾ", Home: "ഹോം", Today: "ഇന്ന്", Farm: "കൃഷിയിടം", Logout: "പുറത്തുകടക്കുക", Login: "ലോഗിൻ", "Demo Login": "ഡെമോ ലോഗിൻ", "Mobile number or email": "മൊബൈൽ നമ്പർ അല്ലെങ്കിൽ ഇമെയിൽ", Password: "പാസ്‌വേഡ്", "Sign in": "സൈൻ ഇൻ", Language: "ഭാഷ", Preferences: "മുൻഗണനകൾ", Save: "സംരക്ഷിക്കുക", Edit: "തിരുത്തുക", "Farm profile": "കൃഷിയിട പ്രൊഫൈൽ", "Farm size": "കൃഷിയിട വലുപ്പം", "Current crop": "നിലവിലെ വിള", "Take photo": "ഫോട്ടോ എടുക്കുക", "Upload photo": "ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക", "Analyze photo": "ഫോട്ടോ വിശകലനം ചെയ്യുക", "Capture photo": "ഫോട്ടോ പകർത്തുക", Retake: "വീണ്ടും എടുക്കുക", "Upload another": "മറ്റൊന്ന് അപ്‌ലോഡ് ചെയ്യുക", "Today's farm plan": "ഇന്നത്തെ കൃഷി പദ്ധതി", "What to do next": "അടുത്തതായി എന്ത് ചെയ്യണം?", "Why this crop?": "എന്തുകൊണ്ട് ഈ വിള?", "What we observed": "ഞങ്ങൾ കണ്ടത്", "What to do now": "ഇപ്പോൾ ചെയ്യേണ്ടത്", "Prevention / monitoring": "പ്രതിരോധം / നിരീക്ഷണം", "Sample data": "സാമ്പിൾ ഡാറ്റ", "Sample model": "സാമ്പിൾ മോഡൽ",
  },
  mr: {
    Dashboard: "डॅशबोर्ड", Weather: "हवामान", Soil: "माती", Crops: "पिके", Disease: "रोग", Advisory: "सल्ला", Regenerative: "पुनरुत्पादक शेती", Profile: "प्रोफाइल", Settings: "सेटिंग्ज", Home: "मुख्यपृष्ठ", Today: "आज", Farm: "शेत", Logout: "बाहेर पडा", Login: "लॉगिन", "Demo Login": "डेमो लॉगिन", "Mobile number or email": "मोबाइल क्रमांक किंवा ईमेल", Password: "पासवर्ड", "Sign in": "साइन इन", Language: "भाषा", Preferences: "प्राधान्ये", Save: "जतन करा", Edit: "संपादित करा", "Farm profile": "शेत प्रोफाइल", "Farm size": "शेताचे क्षेत्र", "Current crop": "सध्याचे पीक", "Take photo": "फोटो काढा", "Upload photo": "फोटो अपलोड करा", "Analyze photo": "फोटोचे विश्लेषण करा", "Capture photo": "फोटो घ्या", Retake: "पुन्हा घ्या", "Upload another": "दुसरा फोटो अपलोड करा", "Today's farm plan": "आजची शेती योजना", "What to do next": "पुढे काय करावे?", "Why this crop?": "हे पीक का?", "What we observed": "आम्ही काय पाहिले", "What to do now": "आता काय करावे", "Prevention / monitoring": "प्रतिबंध / निरीक्षण", "Sample data": "नमुना डेटा", "Sample model": "नमुना मॉडेल",
  },
  bn: {
    Dashboard: "ড্যাশবোর্ড", Weather: "আবহাওয়া", Soil: "মাটি", Crops: "ফসল", Disease: "রোগ", Advisory: "পরামর্শ", Regenerative: "পুনর্জননশীল কৃষি", Profile: "প্রোফাইল", Settings: "সেটিংস", Home: "হোম", Today: "আজ", Farm: "খামার", Logout: "লগ আউট", Login: "লগইন", "Demo Login": "ডেমো লগইন", "Mobile number or email": "মোবাইল নম্বর বা ইমেল", Password: "পাসওয়ার্ড", "Sign in": "সাইন ইন", Language: "ভাষা", Preferences: "পছন্দ", Save: "সংরক্ষণ", Edit: "সম্পাদনা", "Farm profile": "খামারের প্রোফাইল", "Farm size": "খামারের আয়তন", "Current crop": "বর্তমান ফসল", "Take photo": "ছবি তুলুন", "Upload photo": "ছবি আপলোড করুন", "Analyze photo": "ছবি বিশ্লেষণ করুন", "Capture photo": "ছবি ক্যাপচার করুন", Retake: "আবার তুলুন", "Upload another": "আরেকটি আপলোড করুন", "Today's farm plan": "আজকের খামার পরিকল্পনা", "What to do next": "এরপর কী করবেন?", "Why this crop?": "এই ফসল কেন?", "What we observed": "আমরা যা দেখেছি", "What to do now": "এখন কী করবেন", "Prevention / monitoring": "প্রতিরোধ / পর্যবেক্ষণ", "Sample data": "নমুনা তথ্য", "Sample model": "নমুনা মডেল",
  },
  gu: {
    Dashboard: "ડેશબોર્ડ", Weather: "હવામાન", Soil: "જમીન", Crops: "પાક", Disease: "રોગ", Advisory: "સલાહ", Regenerative: "પુનર્જીવિત ખેતી", Profile: "પ્રોફાઇલ", Settings: "સેટિંગ્સ", Home: "હોમ", Today: "આજે", Farm: "ખેતર", Logout: "લૉગ આઉટ", Login: "લૉગિન", "Demo Login": "ડેમો લૉગિન", "Mobile number or email": "મોબાઇલ નંબર અથવા ઇમેઇલ", Password: "પાસવર્ડ", "Sign in": "સાઇન ઇન", Language: "ભાષા", Preferences: "પસંદગીઓ", Save: "સાચવો", Edit: "ફેરફાર કરો", "Farm profile": "ખેતર પ્રોફાઇલ", "Farm size": "ખેતરનું માપ", "Current crop": "વર્તમાન પાક", "Take photo": "ફોટો લો", "Upload photo": "ફોટો અપલોડ કરો", "Analyze photo": "ફોટાનું વિશ્લેષણ કરો", "Capture photo": "ફોટો લો", Retake: "ફરીથી લો", "Upload another": "બીજો અપલોડ કરો", "Today's farm plan": "આજની ખેતી યોજના", "What to do next": "આગળ શું કરવું?", "Why this crop?": "આ પાક શા માટે?", "What we observed": "અમે શું જોયું", "What to do now": "હવે શું કરવું", "Prevention / monitoring": "નિવારણ / દેખરેખ", "Sample data": "નમૂના ડેટા", "Sample model": "નમૂના મોડેલ",
  },
  pa: {
    Dashboard: "ਡੈਸ਼ਬੋਰਡ", Weather: "ਮੌਸਮ", Soil: "ਮਿੱਟੀ", Crops: "ਫ਼ਸਲਾਂ", Disease: "ਰੋਗ", Advisory: "ਸਲਾਹ", Regenerative: "ਪੁਨਰਜੀਵਨ ਖੇਤੀ", Profile: "ਪ੍ਰੋਫ਼ਾਈਲ", Settings: "ਸੈਟਿੰਗਾਂ", Home: "ਮੁੱਖ ਪੰਨਾ", Today: "ਅੱਜ", Farm: "ਖੇਤ", Logout: "ਲੌਗ ਆਉਟ", Login: "ਲੌਗਇਨ", "Demo Login": "ਡੈਮੋ ਲੌਗਇਨ", "Mobile number or email": "ਮੋਬਾਈਲ ਨੰਬਰ ਜਾਂ ਈਮੇਲ", Password: "ਪਾਸਵਰਡ", "Sign in": "ਸਾਈਨ ਇਨ", Language: "ਭਾਸ਼ਾ", Preferences: "ਪਸੰਦਾਂ", Save: "ਸੰਭਾਲੋ", Edit: "ਸੋਧੋ", "Farm profile": "ਖੇਤ ਦੀ ਪ੍ਰੋਫ਼ਾਈਲ", "Farm size": "ਖੇਤ ਦਾ ਆਕਾਰ", "Current crop": "ਮੌਜੂਦਾ ਫ਼ਸਲ", "Take photo": "ਫੋਟੋ ਖਿੱਚੋ", "Upload photo": "ਫੋਟੋ ਅੱਪਲੋਡ ਕਰੋ", "Analyze photo": "ਫੋਟੋ ਦੀ ਜਾਂਚ ਕਰੋ", "Capture photo": "ਫੋਟੋ ਲਵੋ", Retake: "ਦੁਬਾਰਾ ਲਵੋ", "Upload another": "ਹੋਰ ਅੱਪਲੋਡ ਕਰੋ", "Today's farm plan": "ਅੱਜ ਦੀ ਖੇਤੀ ਯੋਜਨਾ", "What to do next": "ਅੱਗੇ ਕੀ ਕਰਨਾ ਹੈ?", "Why this crop?": "ਇਹ ਫ਼ਸਲ ਕਿਉਂ?", "What we observed": "ਅਸੀਂ ਕੀ ਦੇਖਿਆ", "What to do now": "ਹੁਣ ਕੀ ਕਰਨਾ ਹੈ", "Prevention / monitoring": "ਰੋਕਥਾਮ / ਨਿਗਰਾਨੀ", "Sample data": "ਨਮੂਨਾ ਡਾਟਾ", "Sample model": "ਨਮੂਨਾ ਮਾਡਲ",
  },
  ur: {
    Dashboard: "ڈیش بورڈ", Weather: "موسم", Soil: "مٹی", Crops: "فصلیں", Disease: "بیماری", Advisory: "مشورہ", Regenerative: "تجدیدی زراعت", Profile: "پروفائل", Settings: "ترتیبات", Home: "صفحۂ اول", Today: "آج", Farm: "کھیت", Logout: "لاگ آؤٹ", Login: "لاگ اِن", "Demo Login": "ڈیمو لاگ اِن", "Mobile number or email": "موبائل نمبر یا ای میل", Password: "پاس ورڈ", "Sign in": "سائن اِن", Language: "زبان", Preferences: "ترجیحات", Save: "محفوظ کریں", Edit: "ترمیم کریں", "Farm profile": "کھیت کا پروفائل", "Farm size": "کھیت کا رقبہ", "Current crop": "موجودہ فصل", "Take photo": "تصویر لیں", "Upload photo": "تصویر اپ لوڈ کریں", "Analyze photo": "تصویر کا تجزیہ کریں", "Capture photo": "تصویر محفوظ کریں", Retake: "دوبارہ لیں", "Upload another": "دوسری تصویر اپ لوڈ کریں", "Today's farm plan": "آج کا کھیتی منصوبہ", "What to do next": "اگلا قدم کیا ہو؟", "Why this crop?": "یہ فصل کیوں؟", "What we observed": "ہم نے کیا دیکھا", "What to do now": "اب کیا کریں", "Prevention / monitoring": "بچاؤ / نگرانی", "Sample data": "نمونہ ڈیٹا", "Sample model": "نمونہ ماڈل",
  },
};

const pageTranslations: Partial<Record<LanguageCode, Record<string, string>>> = {
  hi: {
    "Weather intelligence": "मौसम जानकारी", "Soil intelligence": "मिट्टी की जानकारी", "Crop intelligence": "फसल जानकारी", "Crop health intelligence": "फसल स्वास्थ्य जानकारी", "Your AI Farm Advisor": "आपका AI कृषि सलाहकार", "Regenerative agriculture": "पुनर्योजी कृषि", "Farm signals": "खेत के संकेत", "AI plan": "AI योजना", Stewardship: "प्राकृतिक संसाधन संरक्षण", "Farmer sign in": "किसान लॉगिन", "Choose the language for the application interface.": "ऐप की भाषा चुनें।", "Good morning": "सुप्रभात",
  },
  ta: {
    "Weather intelligence": "வானிலை நுண்ணறிவு", "Soil intelligence": "மண் நுண்ணறிவு", "Crop intelligence": "பயிர் நுண்ணறிவு", "Crop health intelligence": "பயிர் ஆரோக்கிய நுண்ணறிவு", "Your AI Farm Advisor": "உங்கள் AI பண்ணை ஆலோசகர்", "Farm signals": "பண்ணைச் சிக்னல்கள்", "AI plan": "AI திட்டம்", Stewardship: "நிலப் பராமரிப்பு", "Farmer sign in": "விவசாயி உள்நுழைவு", "Choose the language for the application interface.": "செயலி மொழியைத் தேர்ந்தெடுக்கவும்.", "Good morning": "காலை வணக்கம்",
  },
  te: {
    "Weather intelligence": "వాతావరణ సమాచారం", "Soil intelligence": "నేల సమాచారం", "Crop intelligence": "పంట సమాచారం", "Crop health intelligence": "పంట ఆరోగ్య సమాచారం", "Your AI Farm Advisor": "మీ AI వ్యవసాయ సలహాదారు", "Farm signals": "వ్యవసాయ సంకేతాలు", "AI plan": "AI ప్రణాళిక", Stewardship: "భూమి సంరక్షణ", "Farmer sign in": "రైతు లాగిన్", "Choose the language for the application interface.": "అప్లికేషన్ భాషను ఎంచుకోండి.", "Good morning": "శుభోదయం",
  },
  ml: {
    "Weather intelligence": "കാലാവസ്ഥാ വിവരങ്ങൾ", "Soil intelligence": "മണ്ണിന്റെ വിവരങ്ങൾ", "Crop intelligence": "വിള ബുദ്ധിവിവരം", "Crop health intelligence": "വിള ആരോഗ്യ വിവരം", "Your AI Farm Advisor": "നിങ്ങളുടെ AI കൃഷി ഉപദേഷ്ടാവ്", "Farm signals": "കൃഷിയിട സൂചനകൾ", "AI plan": "AI പദ്ധതി", Stewardship: "കൃഷിയിട പരിപാലനം", "Farmer sign in": "കർഷക ലോഗിൻ", "Choose the language for the application interface.": "ആപ്പിന്റെ ഭാഷ തിരഞ്ഞെടുക്കുക.", "Good morning": "സുപ്രഭാതം",
  },
  mr: {
    "Weather intelligence": "हवामान माहिती", "Soil intelligence": "मातीची माहिती", "Crop intelligence": "पीक माहिती", "Crop health intelligence": "पीक आरोग्य माहिती", "Your AI Farm Advisor": "तुमचा AI शेती सल्लागार", "Farm signals": "शेती संकेत", "AI plan": "AI योजना", Stewardship: "शेती संवर्धन", "Farmer sign in": "शेतकरी लॉगिन", "Choose the language for the application interface.": "अॅपची भाषा निवडा.", "Good morning": "शुभ प्रभात",
  },
  bn: {
    "Weather intelligence": "আবহাওয়া বুদ্ধিমত্তা", "Soil intelligence": "মাটির বুদ্ধিমত্তা", "Crop intelligence": "ফসল বুদ্ধিমত্তা", "Crop health intelligence": "ফসল স্বাস্থ্য বুদ্ধিমত্তা", "Your AI Farm Advisor": "আপনার AI কৃষি পরামর্শদাতা", "Farm signals": "খামারের সংকেত", "AI plan": "AI পরিকল্পনা", Stewardship: "জমির যত্ন", "Farmer sign in": "কৃষক লগইন", "Choose the language for the application interface.": "অ্যাপের ভাষা বেছে নিন।", "Good morning": "সুপ্রভাত",
  },
  gu: {
    "Weather intelligence": "હવામાન માહિતી", "Soil intelligence": "જમીન માહિતી", "Crop intelligence": "પાક માહિતી", "Crop health intelligence": "પાક આરોગ્ય માહિતી", "Your AI Farm Advisor": "તમારા AI ખેતી સલાહકાર", "Farm signals": "ખેતરના સંકેતો", "AI plan": "AI યોજના", Stewardship: "ખેતર સંવર્ધન", "Farmer sign in": "ખેડૂત લૉગિન", "Choose the language for the application interface.": "એપ્લિકેશનની ભાષા પસંદ કરો.", "Good morning": "સુપ્રભાત",
  },
  pa: {
    "Weather intelligence": "ਮੌਸਮ ਜਾਣਕਾਰੀ", "Soil intelligence": "ਮਿੱਟੀ ਜਾਣਕਾਰੀ", "Crop intelligence": "ਫ਼ਸਲ ਜਾਣਕਾਰੀ", "Crop health intelligence": "ਫ਼ਸਲ ਸਿਹਤ ਜਾਣਕਾਰੀ", "Your AI Farm Advisor": "ਤੁਹਾਡਾ AI ਖੇਤੀ ਸਲਾਹਕਾਰ", "Farm signals": "ਖੇਤ ਦੇ ਸੰਕੇਤ", "AI plan": "AI ਯੋਜਨਾ", Stewardship: "ਖੇਤ ਸੰਭਾਲ", "Farmer sign in": "ਕਿਸਾਨ ਲੌਗਇਨ", "Choose the language for the application interface.": "ਐਪ ਦੀ ਭਾਸ਼ਾ ਚੁਣੋ।", "Good morning": "ਸਤ ਸ੍ਰੀ ਅਕਾਲ",
  },
  ur: {
    "Weather intelligence": "موسمیاتی معلومات", "Soil intelligence": "مٹی کی معلومات", "Crop intelligence": "فصل کی معلومات", "Crop health intelligence": "فصل کی صحت کی معلومات", "Your AI Farm Advisor": "آپ کا AI زرعی مشیر", "Farm signals": "کھیت کے اشارے", "AI plan": "AI منصوبہ", Stewardship: "زمین کی دیکھ بھال", "Farmer sign in": "کسان لاگ اِن", "Choose the language for the application interface.": "ایپ کی زبان منتخب کریں۔", "Good morning": "صبح بخیر",
  },
};

const verifiedUiTerms: Partial<Record<LanguageCode, Record<string, string>>> = {
  kn: { "Farm outlook": "ಕೃಷಿ ಅವಲೋಕನ", "Today's farm plan": "ಇಂದಿನ ಕೃಷಿ ಯೋಜನೆ", "Soil profile": "ಮಣ್ಣಿನ ವಿವರ", "Signal profile": "ಸಂಕೇತ ವಿವರ", "Crop decision": "ಬೆಳೆ ನಿರ್ಧಾರ", "Soil history": "ಮಣ್ಣಿನ ಇತಿಹಾಸ", "Why this crop?": "ಈ ಬೆಳೆ ಏಕೆ?", "Next steps for this crop": "ಈ ಬೆಳೆಗೆ ಮುಂದಿನ ಹಂತಗಳು", Notifications: "ಅಧಿಸೂಚನೆಗಳು", Preferences: "ಆದ್ಯತೆಗಳು", "Farm intelligence": "ಕೃಷಿ ಬುದ್ಧಿವಂತಿಕೆ", "What to do now": "ಈಗ ಏನು ಮಾಡಬೇಕು", "Sample signals": "ಮಾದರಿ ಸಂಕೇತಗಳು" },
  hi: { "Farm outlook": "खेत का हाल", "Today's farm plan": "आज की खेती योजना", "Soil profile": "मिट्टी प्रोफ़ाइल", "Signal profile": "संकेत प्रोफ़ाइल", "Crop decision": "फसल निर्णय", "Soil history": "मिट्टी का इतिहास", "Why this crop?": "यह फसल क्यों?", "Next steps for this crop": "इस फसल के अगले कदम", Notifications: "सूचनाएँ", Preferences: "प्राथमिकताएँ", "Farm intelligence": "खेत की जानकारी", "What to do now": "अभी क्या करें", "Sample signals": "नमूना संकेत" },
  ta: { "Farm outlook": "பண்ணை நிலவரம்", "Today's farm plan": "இன்றைய பண்ணைத் திட்டம்", "Soil profile": "மண் விவரம்", "Signal profile": "சிக்னல் விவரம்", "Crop decision": "பயிர் முடிவு", "Soil history": "மண் வரலாறு", "Why this crop?": "இந்தப் பயிர் ஏன்?", "Next steps for this crop": "இந்தப் பயிரின் அடுத்த படிகள்", Notifications: "அறிவிப்புகள்", Preferences: "விருப்பங்கள்", "Farm intelligence": "பண்ணை நுண்ணறிவு", "What to do now": "இப்போது செய்ய வேண்டியது", "Sample signals": "மாதிரி சிக்னல்கள்" },
  te: { "Farm outlook": "వ్యవసాయ పరిస్థితి", "Today's farm plan": "ఈరోజు వ్యవసాయ ప్రణాళిక", "Soil profile": "నేల వివరాలు", "Signal profile": "సంకేత వివరాలు", "Crop decision": "పంట నిర్ణయం", "Soil history": "నేల చరిత్ర", "Why this crop?": "ఈ పంట ఎందుకు?", "Next steps for this crop": "ఈ పంటకు తదుపరి దశలు", Notifications: "నోటిఫికేషన్లు", Preferences: "ప్రాధాన్యతలు", "Farm intelligence": "వ్యవసాయ సమాచారం", "What to do now": "ఇప్పుడు ఏమి చేయాలి", "Sample signals": "నమూనా సంకేతాలు" },
  ml: { "Farm outlook": "കൃഷിയിട സ്ഥിതി", "Today's farm plan": "ഇന്നത്തെ കൃഷി പദ്ധതി", "Soil profile": "മണ്ണിന്റെ വിവരങ്ങൾ", "Signal profile": "സിഗ്നൽ വിവരങ്ങൾ", "Crop decision": "വിള തീരുമാനം", "Soil history": "മണ്ണിന്റെ ചരിത്രം", "Why this crop?": "എന്തുകൊണ്ട് ഈ വിള?", "Next steps for this crop": "ഈ വിളയ്ക്കുള്ള അടുത്ത ഘട്ടങ്ങൾ", Notifications: "അറിയിപ്പുകൾ", Preferences: "മുൻഗണനകൾ", "Farm intelligence": "കൃഷിയിട ബുദ്ധിവിവരം", "What to do now": "ഇപ്പോൾ ചെയ്യേണ്ടത്", "Sample signals": "സാമ്പിൾ സൂചനകൾ" },
  mr: { "Farm outlook": "शेताचा आढावा", "Today's farm plan": "आजची शेती योजना", "Soil profile": "मातीची माहिती", "Signal profile": "संकेत माहिती", "Crop decision": "पीक निर्णय", "Soil history": "मातीचा इतिहास", "Why this crop?": "हे पीक का?", "Next steps for this crop": "या पिकासाठी पुढील पावले", Notifications: "सूचना", Preferences: "प्राधान्ये", "Farm intelligence": "शेती माहिती", "What to do now": "आता काय करावे", "Sample signals": "नमुना संकेत" },
  bn: { "Farm outlook": "খামারের অবস্থা", "Today's farm plan": "আজকের খামার পরিকল্পনা", "Soil profile": "মাটির বিবরণ", "Signal profile": "সংকেতের বিবরণ", "Crop decision": "ফসল নির্বাচন", "Soil history": "মাটির ইতিহাস", "Why this crop?": "এই ফসল কেন?", "Next steps for this crop": "এই ফসলের পরবর্তী পদক্ষেপ", Notifications: "বিজ্ঞপ্তি", Preferences: "পছন্দ", "Farm intelligence": "খামার বুদ্ধিমত্তা", "What to do now": "এখন কী করবেন", "Sample signals": "নমুনা সংকেত" },
  gu: { "Farm outlook": "ખેતરની સ્થિતિ", "Today's farm plan": "આજની ખેતી યોજના", "Soil profile": "જમીન વિગતો", "Signal profile": "સંકેત વિગતો", "Crop decision": "પાક નિર્ણય", "Soil history": "જમીનનો ઇતિહાસ", "Why this crop?": "આ પાક શા માટે?", "Next steps for this crop": "આ પાક માટે આગળનાં પગલાં", Notifications: "સૂચનાઓ", Preferences: "પસંદગીઓ", "Farm intelligence": "ખેતીની માહિતી", "What to do now": "હવે શું કરવું", "Sample signals": "નમૂના સંકેતો" },
  pa: { "Farm outlook": "ਖੇਤ ਦਾ ਜਾਇਜ਼ਾ", "Today's farm plan": "ਅੱਜ ਦੀ ਖੇਤੀ ਯੋਜਨਾ", "Soil profile": "ਮਿੱਟੀ ਦਾ ਵੇਰਵਾ", "Signal profile": "ਸੰਕੇਤ ਵੇਰਵਾ", "Crop decision": "ਫ਼ਸਲ ਫ਼ੈਸਲਾ", "Soil history": "ਮਿੱਟੀ ਦਾ ਇਤਿਹਾਸ", "Why this crop?": "ਇਹ ਫ਼ਸਲ ਕਿਉਂ?", "Next steps for this crop": "ਇਸ ਫ਼ਸਲ ਲਈ ਅਗਲੇ ਕਦਮ", Notifications: "ਸੂਚਨਾਵਾਂ", Preferences: "ਪਸੰਦਾਂ", "Farm intelligence": "ਖੇਤੀ ਜਾਣਕਾਰੀ", "What to do now": "ਹੁਣ ਕੀ ਕਰਨਾ ਹੈ", "Sample signals": "ਨਮੂਨਾ ਸੰਕੇਤ" },
  ur: { "Farm outlook": "کھیت کی صورتحال", "Today's farm plan": "آج کا کھیتی منصوبہ", "Soil profile": "مٹی کی تفصیل", "Signal profile": "اشاروں کی تفصیل", "Crop decision": "فصل کا فیصلہ", "Soil history": "مٹی کی تاریخ", "Why this crop?": "یہ فصل کیوں؟", "Next steps for this crop": "اس فصل کے اگلے اقدامات", Notifications: "اطلاعات", Preferences: "ترجیحات", "Farm intelligence": "زرعی معلومات", "What to do now": "اب کیا کریں", "Sample signals": "نمونہ اشارے" },
};

export function translate(language: LanguageCode, key: TranslationKey): string {
  return translations[language]?.[key] ?? pageTranslations[language]?.[key] ?? verifiedUiTerms[language]?.[key] ?? english[key] ?? key;
}

export function languageDirection(language: LanguageCode): "ltr" | "rtl" {
  return languages.find((item) => item.code === language)?.direction === "rtl" ? "rtl" : "ltr";
}