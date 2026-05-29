import React, { useState, useEffect } from 'react';
import { 
  Sprout, Thermometer, CloudRain, Sun, Wind, Search, Calendar, DollarSign, 
  TrendingUp, Compass, History, LogOut, ArrowRight, ShieldAlert, CheckCircle, 
  MapPin, Settings, AlertTriangle, AlertCircle, FileText, ChevronRight, Activity, RotateCcw,
  Leaf, Shield, Pill, Upload, Calculator
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const defaultLocations = {
  'Karnataka': ['Bangalore', 'Kolar', 'Mysore', 'Mandya', 'Chitradurga', 'Belgaum', 'Dharwad', 'Shimoga', 'Tumkur', 'Hassan'],
  'Maharashtra': ['Pune', 'Nagpur', 'Nashik', 'Mumbai', 'Aurangabad', 'Solapur', 'Kolhapur', 'Jalgaon', 'Ahmednagar'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem', 'Dharmapuri', 'Vellore', 'Thanjavur', 'Erode'],
  'Uttar Pradesh': ['Agra', 'Kanpur', 'Lucknow', 'Varanasi', 'Meerut', 'Allahabad', 'Bareilly', 'Aligarh', 'Gorakhpur'],
  'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Hoshiarpur', 'Firozpur', 'Gurdaspur']
};

const translationDict = {
  en: {
    sidebar_risk: "Crop Risk Prediction",
    sidebar_finder: "Crop Finder (Best ROI)",
    sidebar_mandi: "Live Mandi Prices",
    sidebar_disease: "Disease Detection",
    sidebar_medicine: "Medicine Detection",
    sidebar_logs: "Prediction Logs",
    sidebar_settings: "Settings",
    tab_settings_title: "Settings & Language Options",
    user_profile: "User Profile Details",
    user_name: "Name",
    user_email: "Email Address",
    change_password: "Change User Password",
    curr_pass: "Current Password",
    new_pass: "New Password",
    confirm_pass: "Confirm New Password",
    btn_update_pass: "Update Password",
    language_settings: "System Language Settings",
    select_lang: "Select System Language",
    all_fields_req: "All fields are required.",
    pass_mismatch: "New password and confirmation do not match.",
    pass_success: "Password updated successfully!",
    profile_loading: "Loading profile data...",
    profile_error: "Failed to load user profile.",
    welcome_farmer: "Welcome, Farmer",
    mandi_ticker: "Live Mandi Wholesale Board",
    today_weather: "Today's Farm Weather",
    city_search: "Search District Weather...",
    btn_search: "Search",
    calculating: "Calculating..."
  },
  hi: {
    sidebar_risk: "فسل ਜੋਖਮ ਪੂਰਵ-ਅਨੁਮਾਨ",
    sidebar_risk: "फसल जोखिम पूर्वानुमान",
    sidebar_finder: "फसल खोजक (सर्वोत्तम ROI)",
    sidebar_mandi: "मंडी लाइव भाव",
    sidebar_disease: "रोग पहचान",
    sidebar_medicine: "दवा पहचान",
    sidebar_logs: "पूर्वानुमान लॉग",
    sidebar_settings: "सेटिंग्स",
    tab_settings_title: "सेटिंग्स और भाषा विकल्प",
    user_profile: "उपयोगकर्ता प्रोफ़ाइल विवरण",
    user_name: "नाम",
    user_email: "ईमेल पता",
    change_password: "पासवर्ड बदलें",
    curr_pass: "वर्तमान पासवर्ड",
    new_pass: "नया पासवर्ड",
    confirm_pass: "नए पासवर्ड की पुष्टि करें",
    btn_update_pass: "पासवर्ड अपडेट करें",
    language_settings: "सिस्टम भाषा सेटिंग्स",
    select_lang: "सिस्टम भाषा चुनें",
    all_fields_req: "सभी क्षेत्र अनिवार्य हैं।",
    pass_mismatch: "नया पासवर्ड और पुष्टि मेल नहीं खाते।",
    pass_success: "पासवर्ड सफलतापूर्वक अपडेट किया गया!",
    profile_loading: "प्रोफ़ाइल डेटा लोड हो रहा है...",
    profile_error: "उपयोगकर्ता प्रोफ़ाइल लोड करने में विफल।",
    welcome_farmer: "स्वागत है, किसान",
    mandi_ticker: "लाइव मंडी थोक बोर्ड",
    today_weather: "आज का मौसम",
    city_search: "जिला मौसम खोजें...",
    btn_search: "खोजें",
    calculating: "गणना की जा रही है..."
  },
  te: {
    sidebar_risk: "పంట నష్ట అంచనా",
    sidebar_finder: "పంట శోధన (ఉత్తమ ROI)",
    sidebar_mandi: "లైవ్ మండి ధరలు",
    sidebar_disease: "తెగులు గుర్తింపు",
    sidebar_medicine: "ఔషధ గుర్తింపు",
    sidebar_logs: "అంచనాల లాగ్స్",
    sidebar_settings: "సెట్టింగులు",
    tab_settings_title: "సెట్టింగులు & భాషా ఎంపికలు",
    user_profile: "వినియోగదారు ప్రొఫైల్ వివరాలు",
    user_name: "పేరు",
    user_email: "ఈమెయیل చిరునామా",
    change_password: "పాస్‌వర్డ్ మార్చండి",
    curr_pass: "ప్రస్తుత పాస్‌వర్డ్",
    new_pass: "కొత్త పాస్‌వర్డ్",
    confirm_pass: "కొత్త పాస్‌వర్డ్‌ను ధృవీకరించండి",
    btn_update_pass: "పాస్‌వర్డ్‌ను అప్‌డేట్ చేయి",
    language_settings: "సిస్టమ్ భాషా సెట్టింగులు",
    select_lang: "సిస్టమ్ భాషను ఎంచుకోండి",
    all_fields_req: "అన్ని ఫీల్డ్‌లు తప్పనిసరి.",
    pass_mismatch: "కొత్త పాస్‌వర్డ్ మరియు ధృవీకరణ సరిపోలడం లేదు.",
    pass_success: "పాస్‌వర్డ్ విజయవంతంగా అప్‌డేట్ చేయబడింది!",
    profile_loading: "ప్రొఫైల్ డేటా లోڈ అవుతోంది...",
    profile_error: "యూజర్ ప్రొఫైల్ లోడ్ చేయడం విఫలమైంది.",
    welcome_farmer: "స్వాగతం, రైతు సోదరా",
    mandi_ticker: "లైవ్ మండి హోల్‌సేల్ బోర్డు",
    today_weather: "నేటి వాతావరణం",
    city_search: "జిల్లా వాతావరణాన్ని వెతకండి...",
    btn_search: "వెతకండి",
    calculating: "లెక్కిస్తోంది..."
  },
  ta: {
    sidebar_risk: "பயிர் இடர் கணிப்பு",
    sidebar_finder: "பயிர் தேடுவி (சிறந்த ROI)",
    sidebar_mandi: "நேரடி மண்டி விலைகள்",
    sidebar_disease: "நோய் கண்டறிதல்",
    sidebar_medicine: "மருந்து கண்டறிதல்",
    sidebar_logs: "கணிப்பு பதிவுகள்",
    sidebar_settings: "அமைப்புகள்",
    tab_settings_title: "அமைப்புகள் & மொழி விருப்பங்கள்",
    user_profile: "பயனர் சுயவிவர விவரங்கள்",
    user_name: "பெயர்",
    user_email: "மின்னஞ்சல் முகவரி",
    change_password: "கடவுச்சொல்லை மாற்றுக",
    curr_pass: "தற்போதைய கடவுச்சொல்",
    new_pass: "புதிய கடவுச்சொல்",
    confirm_pass: "புதிய கடவுச்சொல்லை உறுதிப்படுத்துக",
    btn_update_pass: "கடவுச்சொல்லை புதுப்பிக்கவும்",
    language_settings: "கணினி மொழி அமைப்புகள்",
    select_lang: "கணினி மொழியைத் தேர்ந்தெடுக்கவும்",
    all_fields_req: "அனைத்து புலங்களும் கட்டாயமாகும்.",
    pass_mismatch: "புதிய கடவுச்சொல்லும் உறுதிப்படுத்தலும் பொருந்தவில்லை.",
    pass_success: "கடவுச்சொல் வெற்றிகரமாக புதுப்பிக்கப்பட்டது!",
    profile_loading: "சுயவிவரத் தரவு ஏற்றப்படுகிறது...",
    profile_error: "பயனர் சுயவிவரத்தை ஏற்றியது தோல்வியடைந்தது.",
    welcome_farmer: "வரவேற்கிறோம், விவசாயி",
    mandi_ticker: "நேரடி மண்டி மொத்த விற்பனை பலகை",
    today_weather: "இன்றைய வானிலை",
    city_search: "மாவட்ட வானிலை தேடவும்...",
    btn_search: "தேடுக",
    calculating: "கணக்கிடப்படுகிறது..."
  },
  kn: {
    sidebar_risk: "ಬೆಳೆ ಅಪಾಯದ ಮುನ್ಸೂಚನೆ",
    sidebar_finder: "ಬೆಳೆ ಹುಡುಕಾಟ (ಉತ್ತಮ ROI)",
    sidebar_mandi: "ಲೈವ್ ಮಂಡಿ ಬೆಲೆಗಳು",
    sidebar_disease: "ರೋಗ ಪತ್ತೆ",
    sidebar_medicine: "ಔಷಧ ಪತ್ತೆ",
    sidebar_logs: "ಮುನ್ಸೂಚನೆ ದಾಖಲೆಗಳು",
    sidebar_settings: "ಸಂಯೋಜನೆಗಳು",
    tab_settings_title: "ಸಂಯೋಜನೆಗಳು ಮತ್ತು ಭาಷೆಯ ಆಯ್ಕೆಗಳು",
    user_profile: "ಬಳಕೆದಾರರ ಪ್ರೊಫೈಲ್ ವಿವರಗಳು",
    user_name: "ಹೆಸರು",
    user_email: "ಇಮೇಲ್ ವಿಳಾಸ",
    change_password: "ಪಾಸ್ವರ್ಡ್ ಬದಲಾಯಿಸಿ",
    curr_pass: "ಪ್ರಸ್ತುತ ಪಾಸ್ವರ್ಡ್",
    new_pass: "ಹೊಸ ಪಾಸ್ವರ್ಡ್",
    confirm_pass: "ಹೊಸ ಪಾಸ್ವರ್ಡ್ ದೃಢೀಕರಿಸಿ",
    btn_update_pass: "ಪಾಸ್ವರ್ಡ್ ನವೀಕರಿಸಿ",
    language_settings: "ಸಿಸ್ಟಮ್ ಭಾಷೆಯ ಸಂಯೋಜನೆಗಳು",
    select_lang: "ಸಿಸ್ಟಮ್ ಭಾಷೆಯನ್ನು ಆರಿಸಿ",
    all_fields_req: "ಎಲ್ಲಾ ಕ್ಷೇತ್ರಗಳು ಕಡ್ಡायವಾಗಿದೆ.",
    pass_mismatch: "ಹೊಸ ಪಾಸ್‌ವರ್ಡ್ ಮತ್ತು ದೃಢೀಕರಣ ಹೊಂದಿಕೆಯಾಗುತ್ತಿಲ್ಲ.",
    pass_success: "ಪಾಸ್ವರ್ಡ್ ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ!",
    profile_loading: "ಪ್ರೊಫೈಲ್ ಡೇಟಾ ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    profile_error: "ಬಳಕೆದಾರರ ಪ್ರೊಫೈಲ್ ಲೋಡ್ ಮಾಡಲು ವಿಫಲವಾಗಿದೆ.",
    welcome_farmer: "ಸ್ವಾಗತ, ರೈತ ಬಾಂಧವರೇ",
    mandi_ticker: "ಲೈವ್ ಮಂಡಿ ಸಗಟು ಬೋರ್ಡ್",
    today_weather: "ಇಂದಿನ ಹವಾಮಾನ",
    city_search: "ಜಿಲ್ಲಾ ಹವಾಮಾನ ಹುಡುಕಿ...",
    btn_search: "ಹುಡುಕಿ",
    calculating: "ಲೆಕ್ಕಹಾಕಲಾಗುತ್ತಿದೆ..."
  },
  ml: {
    sidebar_risk: "വിള റിസ്ക് പ്രവചനം",
    sidebar_finder: "വിള കണ്ടെത്തൽ (മികച്ച ROI)",
    sidebar_mandi: "ലൈവ് മണ്ടി വിലകൾ",
    sidebar_disease: "രോഗം കണ്ടെത്തൽ",
    sidebar_medicine: "മരുന്ന് കണ്ടെത്തൽ",
    sidebar_logs: "പ്രവചന ലോഗുകൾ",
    sidebar_settings: "ക്രമീകരണങ്ങൾ",
    tab_settings_title: "ക്രമീകരണങ്ങളും ഭാഷാ ഓപ്ഷനുകളും",
    user_profile: "ഉപയോക്തൃ പ്രൊഫൈൽ വിവരങ്ങൾ",
    user_name: "പേര്",
    user_email: "ഇമെയിൽ വിലാസം",
    change_password: "പാസ്‌വേഡ് മാറ്റുക",
    curr_pass: "നിലവിലെ പാസ്‌വേഡ്",
    new_pass: "പുതിയ പാസ്‌വേഡ്",
    confirm_pass: "പുതിയ പാസ്‌വേഡ് സ്ഥിരീകരിക്കുക",
    btn_update_pass: "പാസ്‌വേഡ് അപ്‌ഡേറ്റ് ചെയ്യുക",
    language_settings: "സിസ്റ്റം ഭാഷാ ക്രമീകരണങ്ങൾ",
    select_lang: "സിസ്റ്റം ഭാഷ തിരഞ്ഞെടുക്കുക",
    all_fields_req: "എല്ലാ ഫീൽഡുകളും നിർബന്ധമാണ്.",
    pass_mismatch: "പുതിയ പാസ്‌വേഡും സ്ഥിരീകരണവും പൊരുത്തപ്പെടുന്നില്ല.",
    pass_success: "പാസ്‌വേഡ് വിജയകരമായി അപ്‌ഡേറ്റ് ചെയ്തു!",
    profile_loading: "പ്രൊഫൈൽ ഡാറ്റ ലോഡ് ചെയ്യുന്നു...",
    profile_error: "ഉപയോക്തൃ പ്രൊഫൈൽ ലോഡ് ചെയ്യുന്നതിൽ പരാജയപ്പെട്ടു.",
    welcome_farmer: "സ്വാഗതം, കർഷക സുഹൃത്തേ",
    mandi_ticker: "ലൈവ് മണ്ടി മൊത്തവ്യാപാര ബോർഡ്",
    today_weather: "ഇന്നത്തെ കാലാവസ്ഥ",
    city_search: "ജില്ലാ കാലാവസ്ഥ തിരയുക...",
    btn_search: "തിരയുക",
    calculating: "കണക്കുകൂട്ടുന്നു..."
  },
  mr: {
    sidebar_risk: "पीक जोखीम अंदाज",
    sidebar_finder: "पीक शोधक (सर्वोत्तम ROI)",
    sidebar_mandi: "थेट मंडी दर",
    sidebar_disease: "रोग शोधणे",
    sidebar_medicine: "औषध शोधणे",
    sidebar_logs: "अंदाज नोंदी",
    sidebar_settings: "सेटिंग्ज",
    tab_settings_title: "सेटिंग्ज आणि भाषा पर्याय",
    user_profile: "वापरकर्ता प्रोफाइल तपशील",
    user_name: "नाव",
    user_email: "ईमेल पत्ता",
    change_password: "पासवर्ड बदला",
    curr_pass: "सध्याचा पासवर्ड",
    new_pass: "नवीन पासवर्ड",
    confirm_pass: "नवीन पासवर्डची पुष्टी करा",
    btn_update_pass: "पासवर्ड अपडेट करा",
    language_settings: "सिस्टम भाषा सेटिंग्ज",
    select_lang: "सिस्टम भाषा निवडा",
    all_fields_req: "सर्व फील्ड आवश्यक आहेत.",
    pass_mismatch: "नवीन पासवर्ड आणि पुष्टी जुळत नाही.",
    pass_success: "पासवर्ड यशस्वीरित्या अपडेट झाला!",
    profile_loading: "प्रोफाइल डेटा लोड होत आहे...",
    profile_error: "वापरकर्ता प्रोफाइल लोड करण्यात अपयशी.",
    welcome_farmer: "स्वागत आहे, शेतकरी बंधूंनो",
    mandi_ticker: "थेट मंडी घाऊक फलक",
    today_weather: "आजचे हवामान",
    city_search: "जिल्हा हवामान शोधा...",
    btn_search: "शोधा",
    calculating: "गणना करत आहे..."
  },
  gu: {
    sidebar_risk: "પાક જોખમ અનુમાન",
    sidebar_finder: "પાક શોધક (શ્રેષ્ઠ ROI)",
    sidebar_mandi: "લાઈવ મંડી ભાવો",
    sidebar_disease: "રોગ ઓળખ",
    sidebar_medicine: "દવા ઓળખ",
    sidebar_logs: "અનુમાન લોગ",
    sidebar_settings: "સેટિંગ્સ",
    tab_settings_title: "સેટિંગ્સ અને ભાષા વિકલ્પો",
    user_profile: "વપરાશકર્તા પ્રોફાઇલ વિગતો",
    user_name: "નામ",
    user_email: "ઇમેઇલ સરનામું",
    change_password: "પાસવર્ડ બદલો",
    curr_pass: "વર્તમાન પાસવર્ડ",
    new_pass: "નવો પાસવર્ડ",
    confirm_pass: "નવા પાસવર્ડની પુષ્ટિ કરો",
    btn_update_pass: "પાસવર્ડ અપડેટ કરો",
    language_settings: "સિસ્ટમ ભાષા સેટિંગ્સ",
    select_lang: "સિસ્ટમ ભાષા પસંદ કરો",
    all_fields_req: "બધી વિગતો ફરજિયાત છે.",
    pass_mismatch: "નવો પાસવર્ડ અને પુષ્ટિ મેળ ખાતા નથી.",
    pass_success: "પાસવર્ડ સફળતાપૂર્વક અપડેટ થયો!",
    profile_loading: "પ્રોફાઇલ ડેટા લોડ થઈ રહ્યો છે...",
    profile_error: "વપરાશકર્તા પ્રોફાઇલ લોડ કરવામાં નિષ્ફળ.",
    welcome_farmer: "સ્વાગત છે, ખેડૂત મિત્ર",
    mandi_ticker: "લાઈવ મંડી જથ્થાબંધ બોર્ડ",
    today_weather: "આજનું હવામાન",
    city_search: "જિલ્લા હવામાન શોધો...",
    btn_search: "શોધો",
    calculating: "ગણતરી ચાલુ છે..."
  },
  bn: {
    sidebar_risk: "ফসল ঝুঁকি পূর্বাভাস",
    sidebar_finder: "ফসল সন্ধানকারী (সেরা ROI)",
    sidebar_mandi: "লাইভ মান্ডি দর",
    sidebar_disease: "রোগ শনাক্তকরণ",
    sidebar_medicine: "ওষুধ শনাক্তকরণ",
    sidebar_logs: "পূর্বাভাস লগ",
    sidebar_settings: "সেটিংস",
    tab_settings_title: "সেটিংস এবং ভাষা বিকল্প",
    user_profile: "ব্যবহারকারী প্রোফাইল বিবরণ",
    user_name: "নাম",
    user_email: "ইমেল ঠিকানা",
    change_password: "পাসওয়ার্ড পরিবর্তন করুন",
    curr_pass: "বর্তমান পাসওয়ার্ড",
    new_pass: "নতুন পাসওয়ার্ড",
    confirm_pass: "নতুন পাসওয়ার্ড নিশ্চিত করুন",
    btn_update_pass: "পাসওয়ার্ড আপডেট করুন",
    language_settings: "সিস্টেম ভাষা সেটিংস",
    select_lang: "সিস্টেমের ভাষা নির্বাচন করুন",
    all_fields_req: "সব ঘর পূরণ করা বাধ্যতামূলক।",
    pass_mismatch: "নতুন পাসওয়ার্ড এবং নিশ্চিতকরণ মিলছে না।",
    pass_success: "পাসওয়ার্ড সফলভাবে আপডেট করা হয়েছে!",
    profile_loading: "প্রোফাইল ডেটা লোড হচ্ছে...",
    profile_error: "ব্যবহারকারী প্রোফাইল লোড করতে ব্যর্থ।",
    welcome_farmer: "স্বাগতম, কৃষক ভাই",
    mandi_ticker: "লাইভ মান্ডি পাইকারি বোর্ড",
    today_weather: "আজকের আবহাওয়া",
    city_search: "জেলা আবহাওয়া অনুসন্ধান করুন...",
    btn_search: "অনুসন্ধান",
    calculating: "গণনা করা হচ্ছে..."
  },
  pa: {
    sidebar_risk: "ਫਸਲ ਜੋਖਮ ਪੂਰਵ-ਅਨੁਮਾਨ",
    sidebar_finder: "ਫਸਲ ਖੋਜੀ (ਸਰਬੋਤਮ ROI)",
    sidebar_mandi: "ਲਾਈਵ ਮੰਡੀ ਭਾਅ",
    sidebar_disease: "ਬਿਮਾਰੀ ਦੀ ਪਛਾਣ",
    sidebar_medicine: "ਦਵਾਈ ਦੀ ਪਛਾਣ",
    sidebar_logs: "ਅਨੁਮਾਨ ਲੌਗਸ",
    sidebar_settings: "ਸੈਟਿੰਗਜ਼",
    tab_settings_title: "ਸੈਟਿੰਗਜ਼ ਅਤੇ ਭਾਸ਼ਾ ਵਿਕਲਪ",
    user_profile: "ਉਪਭੋਗਤਾ ਪ੍ਰੋਫਾਈલ ਵੇਰਵੇ",
    user_name: "ਨਾਮ",
    user_email: "ਈਮੇਲ ਪਤਾ",
    change_password: "ਪਾਸਵਰਡ ਬਦਲੋ",
    curr_pass: "ਮੌਜੂਦਾ ਪਾਸਵਰਡ",
    new_pass: "ਨਵਾਂ ਪਾਸਵਰਡ",
    confirm_pass: "ਨਵੇਂ ਪਾਸਵਰਡ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ",
    btn_update_pass: "ਪਾਸਵਰਡ ਅਪਡੇਟ ਕਰੋ",
    language_settings: "ਸਿਸਟਮ ਭਾਸ਼ਾ ਸੈਟਿੰਗਜ਼",
    select_lang: "ਸਿਸਟਮ ਭਾਸ਼ਾ ਚੁਣੋ",
    all_fields_req: "ਸਾਰੇ ਖੇਤਰ ਲਾਜ਼ਮੀ ਹਨ।",
    pass_mismatch: "ਨਵਾਂ ਪਾਸਵਰڈ ਅਤੇ ਪੁਸ਼ਟੀ ਮੇਲ ਨਹੀਂ ਖਾਂਦੇ।",
    pass_success: "ਪਾਸਵਰਡ ਸਫਲਤਾਪੂਰਵਕ ਅਪਡੇਟ ਕੀਤਾ ਗਿਆ!",
    profile_loading: "ਪ੍ਰੋਫਾਈਲ ਡੇਟਾ ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...",
    profile_error: "ਉਪਭੋਗਤਾ ਪ੍ਰੋਫਾਈਲ ਲੋਡ ਕਰਨ ਵਿੱਚ ਅਸਫਲ।",
    welcome_farmer: "ਜੀ ਆਇਆਂ ਨੂੰ, ਕਿਸਾਨ ਵੀਰੋ",
    mandi_ticker: "ਲਾਈਵ ਮੰਡੀ ਥੋਕ ਬੋਰਡ",
    today_weather: "ਅੱਜ ਦਾ ਮੌਸਮ",
    city_search: "ਜ਼ਿਲ੍ਹਾ ਮੌਸਮ ਖੋਜੋ...",
    btn_search: "ਖੋਜੋ",
    calculating: "ਗਣਨਾ ਕੀਤੀ ਜਾ ਰਹੀ ਹੈ..."
  },
  or: {
    sidebar_risk: "ଫସଲ ବିପଦ ପୂର୍ବାନୁମାନ",
    sidebar_finder: "ଫସଲ ସନ୍ଧାନକାରୀ (ଉତ୍ତମ ROI)",
    sidebar_mandi: "ଲାଇଭ୍ ମଣ୍ଡି ଦର",
    sidebar_disease: "ରୋଗ ଚିହ୍ନଟ",
    sidebar_medicine: "ଔଷଧ ଚିହ୍ନଟ",
    sidebar_logs: "ପୂର୍ବାନୁମାନ ଲଗ୍",
    sidebar_settings: "ସେଟିଙ୍ଗ୍ସ",
    tab_settings_title: "ସେଟିଙ୍ଗ୍ସ ଓ ଭାଷା ବିକଳ୍ପ",
    user_profile: "ଉପଭୋକ୍ତା ପ୍ରୋଫାଇଲ୍ ବିବରଣୀ",
    user_name: "ନାମ",
    user_email: "ଇମେଲ୍ ଠିକଣା",
    change_password: "ପାସୱାର୍ଡ ବଦଳାନ୍ତុ",
    curr_pass: "ଚଳିତ ପାସୱାର୍ڈ",
    new_pass: "ନୂଆ ପାସୱାର୍ଡ",
    confirm_pass: "ନୂଆ ପାସୱାର୍ଡ ନିଶ୍ચିତ କରନ୍ତု",
    btn_update_pass: "ପାସୱାର୍ଡ ଅପଡେଟ୍ କରନ୍ତု",
    language_settings: "ସିଷ୍ଟମ ଭାଷା ସେଟିଙ୍ગ୍ସ",
    select_lang: "ସିଷ୍ଟମ ଭାଷା ଚୟନ କରନ୍ତု",
    all_fields_req: "ସମସ୍ତ ତଥ୍ୟ ଆବଶ୍ୟକ।",
    pass_mismatch: "ନୂଆ ପାସୱାର୍ڈ ଏବଂ ନିଶ୍ચିତକରଣ ମେଳ ଖାଉନାହିଁ।",
    pass_success: "ପାସୱାର୍ڈ ସଫଳତାର ସହ ଅପଡେଟ୍ ହେଲା!",
    profile_loading: "ପ୍ରୋଫାଇଲ୍ ତଥ୍ୟ ଲୋਡ୍ ହେଉଛି...",
    profile_error: "ଉପଭୋକ୍ତା ପ୍ରୋଫାଇଲ୍ ଲୋଡ୍ ହେବାରେ ବିଫଳ ହେଲା।",
    welcome_farmer: "ସ୍ୱାଗତ, କୃଷକ ଭାଇ",
    mandi_ticker: "ଲାଇଭ୍ ମଣ୍ଡି ହୋଲସେଲ ବୋର୍ଡ",
    today_weather: "ଆଜିର ପାଣିପାଗ",
    city_search: "ଜିଲ୍ଲା ପାଣିପାଗ ଖୋଜନ୍ତୁ...",
    btn_search: "ଖୋଜନ୍ତୁ",
    calculating: "ଗଣନା କରାଯାଉଛି..."
  },
  ur: {
    sidebar_risk: "فصل کے خطرے کی پیش گوئی",
    sidebar_finder: "فصل تلاش کنندہ (بہترین ROI)",
    sidebar_mandi: "لائیو منڈی کی قیمتیں",
    sidebar_disease: "بیماری کی تشخیص",
    sidebar_medicine: "دوا کی شناخت",
    sidebar_logs: "پیش گوئی لاگز",
    sidebar_settings: "ترتیبات",
    tab_settings_title: "ترتیبات اور زبان کے اختیارات",
    user_profile: "صارف کا پروفائل تفصیلات",
    user_name: "نام",
    user_email: "ای میل ایڈریس",
    change_password: "پاس ورڈ تبدیل کریں",
    curr_pass: "موجودہ پاس ورڈ",
    new_pass: "نیا پاس ورڈ",
    confirm_pass: "نئے پاس ورڈ کی تصدیق کریں",
    btn_update_pass: "پاس ورڈ اپ ڈیٹ کریں",
    language_settings: "سسٹم کی زبان کی ترتیبات",
    select_lang: "سسٹم کی زبان منتخب کریں",
    all_fields_req: "تمام خانے پُر کرنا لازمی ہیں۔",
    pass_mismatch: "نیا پاس ورڈ اور تصدیق مطابقت نہیں رکھتے۔",
    pass_success: "پاس ورڈ کامیابی کے ساتھ تبدیل ہو گیا!",
    profile_loading: "پروفائل ڈیٹا لوڈ ہو رہا ہے...",
    profile_error: "پروفائل لوڈ کرنے میں ناکامی۔",
    welcome_farmer: "خوش آمدید، کسان بھائی",
    mandi_ticker: "لائیو منڈی ہول سیل بورڈ",
    today_weather: "آج کا موسم",
    city_search: "ضلع کا موسم تلاش کریں...",
    btn_search: "تلاش کریں",
    calculating: "حساب کتاب ہو رہا ہے..."
  }
};

export default function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('risk_prediction');
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [cityInput, setCityInput] = useState('Bangalore');

  // Dynamic Location Lists
  const [locations, setLocations] = useState(defaultLocations);
  const [loadingLocations, setLoadingLocations] = useState(false);

  // Live price ticker state
  const [tickerItems, setTickerItems] = useState([
    { crop: 'Onion', price: '₹22/kg', change: '+₹1.5', up: true },
    { crop: 'Potato', price: '₹18/kg', change: '-₹0.8', up: false },
    { crop: 'Tomato', price: '₹25/kg', change: '+₹4.2', up: true },
    { crop: 'Wheat', price: '₹24/kg', change: '+₹0.2', up: true },
    { crop: 'Paddy', price: '₹22/kg', change: '-₹0.5', up: false }
  ]);

  // Tab 1: Crop Risk Prediction states
  const [predictForm, setPredictForm] = useState({
    crop: 'Onion',
    soil_type: 'Loamy',
    state: 'Karnataka',
    district: 'Bangalore',
    planting_date: new Date().toISOString().split('T')[0],
    
    // New parameters
    target_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // default: Tomorrow
    stock_level: 'Medium',
    weather_condition: 'Normal'
  });
  const [predictResult, setPredictResult] = useState(null);
  const [predictLoading, setPredictLoading] = useState(false);
  const [predictError, setPredictError] = useState('');
  const [chartData, setChartData] = useState([]);

  // Tab 2: Crop Finder states
  const [finderForm, setFinderForm] = useState({
    soil_type: 'Loamy',
    duration_months: '4',
    investment_budget: '25000',
    state: 'Karnataka',
    district: 'Bangalore'
  });
  const [finderRecommendations, setFinderRecommendations] = useState([]);
  const [finderLoading, setFinderLoading] = useState(false);
  const [finderError, setFinderError] = useState('');

  // Tab 3: Mandi Prices states
  const [mandiForm, setMandiForm] = useState({
    crop: 'Onion',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    state: 'All',
    district: 'All'
  });
  const [mandiResult, setMandiResult] = useState(null);
  const [mandiLoading, setMandiLoading] = useState(false);
  const [mandiError, setMandiError] = useState('');
  const [mandiSearchQuery, setMandiSearchQuery] = useState(''); 

  // Tab 4: History state
  const [historyList, setHistoryList] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // New states for Plant Disease & Medicine Detection
  const [diseaseImage, setDiseaseImage] = useState(null);
  const [diseaseResult, setDiseaseResult] = useState(null);
  const [diseaseLoading, setDiseaseLoading] = useState(false);
  const [diseaseError, setDiseaseError] = useState('');

  const [medicineImage, setMedicineImage] = useState(null);
  const [medicineResult, setMedicineResult] = useState(null);
  const [medicineLoading, setMedicineLoading] = useState(false);
  const [medicineError, setMedicineError] = useState('');

  const [diseaseHistory, setDiseaseHistory] = useState([]);

  const [fertilizerForm, setFertilizerForm] = useState({
    temperature: '28',
    humidity: '60',
    moisture: '45',
    soil_type: 'Loamy',
    crop_type: 'Wheat',
    nitrogen: '30',
    potassium: '15',
    phosphorous: '25'
  });
  const [fertilizerResult, setFertilizerResult] = useState(null);
  const [fertilizerLoading, setFertilizerLoading] = useState(false);
  const [fertilizerError, setFertilizerError] = useState('');

  // Settings Tab States
  const [profileData, setProfileData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const [language, setLanguage] = useState(localStorage.getItem('krishi_lang') || 'en');

  const t = (key) => {
    const langData = translationDict[language] || translationDict['en'];
    return langData[key] || translationDict['en'][key] || key;
  };

  const fetchUserProfile = async () => {
    setProfileLoading(true);
    setProfileError('');
    try {
      const token = localStorage.getItem('krishi_token');
      const response = await fetch(`${API_URL}/api/user/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 401 || response.status === 403) {
        onLogout();
        return;
      }
      const data = await response.json();
      if (response.ok && data.status === 'ok') {
        setProfileData(data.user);
      } else {
        setProfileError(data.message || 'Failed to load user profile.');
      }
    } catch (err) {
      setProfileError('Failed to connect to profile service.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordSuccess('');
    setPasswordError('');
    
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError(t('all_fields_req'));
      return;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError(t('pass_mismatch'));
      return;
    }
    
    setPasswordLoading(true);
    try {
      const token = localStorage.getItem('krishi_token');
      const response = await fetch(`${API_URL}/api/user/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });
      if (response.status === 401 || response.status === 403) {
        onLogout();
        return;
      }
      const data = await response.json();
      if (response.ok && data.status === 'ok') {
        setPasswordSuccess(t('pass_success'));
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setPasswordError(data.message || 'Failed to update password.');
      }
    } catch (err) {
      setPasswordError('Failed to connect to password change service.');
    } finally {
      setPasswordLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'settings') {
      fetchUserProfile();
    }
  }, [activeTab]);

  // Constants
  const soils = ['Loamy', 'Sandy', 'Clayey', 'Alluvial', 'Black', 'Red', 'Laterite'];
  const crops = ['Onion', 'Potato', 'Tomato', 'Paddy', 'Wheat', 'Cotton', 'Sugarcane', 'Maize', 'Bajra', 'Barley', 'Gram', 'Groundnut', 'Sponge Gourd', 'Ginger', 'Peas', 'Papaya'];

  useEffect(() => {
    fetchLocations();
    fetchWeather(cityInput);
    fetchMandiTicker();
    runRiskPrediction(); 
  }, []);

  // Sync Weather with Predict Form District
  useEffect(() => {
    if (predictForm.district) {
      const delayDebounceFn = setTimeout(() => {
        setCityInput(predictForm.district);
        fetchWeather(predictForm.district);
      }, 1000); 
      return () => clearTimeout(delayDebounceFn);
    }
  }, [predictForm.district]);

  // Sync Mandi search automatically on Date, Crop, State or District change
  useEffect(() => {
    if (activeTab === 'live_mandi') {
      fetchMandiPrices();
    }
  }, [mandiForm.crop, mandiForm.date, mandiForm.state, mandiForm.district, activeTab]);

  useEffect(() => {
    if (activeTab === 'history') {
      fetchHistory();
    }
    if (activeTab === 'plant_disease' || activeTab === 'medicine_detection') {
      fetchDiseaseHistory();
    }
  }, [activeTab]);

  // Automatically update target date in form when sowing date changes to sowing_date + 110 days (typical harvest)
  useEffect(() => {
    const crops_meta_duration = {
      'Onion': 110, 'Potato': 100, 'Tomato': 120, 'Paddy': 135, 'Wheat': 130, 'Cotton': 200, 
      'Sugarcane': 330, 'Maize': 110, 'Bajra': 90, 'Barley': 120, 'Gram': 110, 'Groundnut': 120,
      'Sponge Gourd': 80, 'Ginger': 240, 'Peas': 90, 'Papaya': 300
    };
    const duration = crops_meta_duration[predictForm.crop] || 120;
    try {
      const plantDate = new Date(predictForm.planting_date);
      const harvestDateObj = new Date(plantDate.getTime() + duration * 24 * 60 * 60 * 1000);
      setPredictForm(prev => ({
        ...prev,
        target_date: harvestDateObj.toISOString().split('T')[0]
      }));
    } catch (e) {}
  }, [predictForm.planting_date, predictForm.crop]);

  const fetchLocations = async () => {
    setLoadingLocations(true);
    try {
      const response = await fetch(`${API_URL}/api/locations`);
      const data = await response.json();
      if (data.status === 'ok' && Object.keys(data.locations).length > 0) {
        setLocations(data.locations);
        
        const parsedStates = Object.keys(data.locations);
        const defaultState = parsedStates.includes('Karnataka') ? 'Karnataka' : parsedStates[0];
        const defaultDistrict = data.locations[defaultState][0];

        setPredictForm(prev => ({
          ...prev,
          state: defaultState,
          district: defaultDistrict
        }));
        setFinderForm(prev => ({
          ...prev,
          state: defaultState,
          district: defaultDistrict
        }));
        setMandiForm(prev => ({
          ...prev,
          state: defaultState,
          district: 'All'
        }));
      }
    } catch (e) {
      console.error('Error fetching locations from backend, using fallbacks', e);
    } finally {
      setLoadingLocations(false);
    }
  };

  const fetchWeather = async (city) => {
    if (!city) return;
    setWeatherLoading(true);
    try {
      const token = localStorage.getItem('krishi_token');
      const response = await fetch(`${API_URL}/api/weather?q=${city}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.status === 401 || response.status === 403) {
        onLogout();
        return;
      }
      const data = await response.json();
      if (data.status === 'ok') {
        setWeather(data.weather);
      }
    } catch (e) {
      console.error('Weather error', e);
    } finally {
      setWeatherLoading(false);
    }
  };

  const fetchMandiTicker = async () => {
    try {
      const response = await fetch(`${API_URL}/api/mandi-prices?date=${new Date().toISOString().split('T')[0]}`);
      const data = await response.json();
      if (data.status === 'ok' && data.records && data.records.length > 0) {
        const uniqueCrops = {};
        data.records.forEach(r => {
          if (!uniqueCrops[r.commodity] && Object.keys(uniqueCrops).length < 6) {
            uniqueCrops[r.commodity] = {
              crop: r.commodity,
              price: `₹${(r.modal_price / 100).toFixed(0)}/kg`,
              change: Math.random() > 0.5 ? `+₹${(Math.random() * 2).toFixed(1)}` : `-₹${(Math.random() * 1.5).toFixed(1)}`,
              up: Math.random() > 0.5
            };
          }
        });
        if (Object.keys(uniqueCrops).length > 2) {
          setTickerItems(Object.values(uniqueCrops));
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePredictSubmit = async (e) => {
    e.preventDefault();
    await runRiskPrediction();
  };

  const runRiskPrediction = async (customParams = null) => {
    setPredictLoading(true);
    setPredictError('');
    const params = customParams || predictForm;
    try {
      const token = localStorage.getItem('krishi_token');
      const response = await fetch(`${API_URL}/api/predict-risk`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(params),
      });
      if (response.status === 401 || response.status === 403) {
        onLogout();
        return;
      }
      const data = await response.json();
      if (response.ok && data.status === 'ok') {
        setPredictResult(data);
        generatePriceChartData(data.predicted_price_rs_kg);
      } else {
        setPredictError(data.message || 'Error occurred during prediction.');
      }
    } catch (e) {
      setPredictError('Failed to connect to backend server.');
    } finally {
      setPredictLoading(false);
    }
  };

  const generatePriceChartData = (targetPrice) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonthIdx = new Date().getMonth();
    const data = [];
    
    for (let i = 4; i >= 0; i--) {
      const monthIdx = (currentMonthIdx + 12 - i) % 12;
      let multiplier = 0.85 + (4 - i) * 0.03 + (Math.random() * 0.05);
      if (i === 0) multiplier = 1.0; 
      data.push({
        month: months[monthIdx],
        Price: parseFloat((targetPrice * multiplier).toFixed(2))
      });
    }
    setChartData(data);
  };

  const handleFinderSubmit = async (e) => {
    e.preventDefault();
    setFinderLoading(true);
    setFinderError('');
    try {
      const token = localStorage.getItem('krishi_token');
      const response = await fetch(`${API_URL}/api/recommend-crop`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(finderForm),
      });
      if (response.status === 401 || response.status === 403) {
        onLogout();
        return;
      }
      const data = await response.json();
      if (response.ok && data.status === 'ok') {
        setFinderRecommendations(data.recommendations);
      } else {
        setFinderError(data.message || 'Error executing crop recommendation.');
      }
    } catch (e) {
      setFinderError('Connection to backend failed.');
    } finally {
      setFinderLoading(false);
    }
  };

  const fetchMandiPrices = async () => {
    setMandiLoading(true);
    setMandiError('');
    setMandiSearchQuery(''); 
    try {
      const token = localStorage.getItem('krishi_token');
      const response = await fetch(`${API_URL}/api/mandi-prices?date=${mandiForm.date}&crop=${mandiForm.crop}&state=${mandiForm.state}&district=${mandiForm.district}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.status === 401 || response.status === 403) {
        onLogout();
        return;
      }
      const data = await response.json();
      if (response.ok && data.status === 'ok') {
        setMandiResult(data);
      } else {
        setMandiError(data.message || 'Failed to fetch mandi prices.');
      }
    } catch (e) {
      setMandiError('Connection to backend failed.');
    } finally {
      setMandiLoading(false);
    }
  };

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const token = localStorage.getItem('krishi_token');
      const response = await fetch(`${API_URL}/api/history`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.status === 401 || response.status === 403) {
        onLogout();
        return;
      }
      const data = await response.json();
      if (data.status === 'ok') {
        setHistoryList(data.history);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setHistoryLoading(false);
    }
  };

  const fetchDiseaseHistory = async () => {
    try {
      const token = localStorage.getItem('krishi_token');
      const response = await fetch(`${API_URL}/api/disease-history`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.status === 401 || response.status === 403) {
        onLogout();
        return;
      }
      const data = await response.json();
      if (response.ok && data.status === 'ok') {
        setDiseaseHistory(data.history || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'disease') {
        setDiseaseImage(reader.result);
        setDiseaseResult(null);
        setDiseaseError('');
      } else {
        setMedicineImage(reader.result);
        setMedicineResult(null);
        setMedicineError('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDiseaseScan = async () => {
    if (!diseaseImage) {
      setDiseaseError('Please select or drag an image first.');
      return;
    }
    setDiseaseLoading(true);
    setDiseaseError('');
    try {
      const token = localStorage.getItem('krishi_token');
      const response = await fetch(`${API_URL}/api/detect-disease`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ image: diseaseImage })
      });
      if (response.status === 401 || response.status === 403) {
        onLogout();
        return;
      }
      const data = await response.json();
      if (response.ok && data.status === 'ok') {
        setDiseaseResult(data.result);
        fetchDiseaseHistory();
      } else {
        setDiseaseError(data.message || 'Error processing crop disease scan.');
      }
    } catch (e) {
      setDiseaseError('Connection to disease classification API failed.');
    } finally {
      setDiseaseLoading(false);
    }
  };

  const handleMedicineScan = async () => {
    if (!medicineImage) {
      setMedicineError('Please select or drag an image first.');
      return;
    }
    setMedicineLoading(true);
    setMedicineError('');
    try {
      const token = localStorage.getItem('krishi_token');
      const response = await fetch(`${API_URL}/api/detect-medicine`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ image: medicineImage })
      });
      if (response.status === 401 || response.status === 403) {
        onLogout();
        return;
      }
      const data = await response.json();
      if (response.ok && data.status === 'ok') {
        setMedicineResult(data.result);
        fetchDiseaseHistory();
      } else {
        setMedicineError(data.message || 'Error scanning medicine image.');
      }
    } catch (e) {
      setMedicineError('Connection to medicine API failed.');
    } finally {
      setMedicineLoading(false);
    }
  };

  const handleFertilizerPredict = async (e) => {
    if (e) e.preventDefault();
    setFertilizerLoading(true);
    setFertilizerError('');
    try {
      const token = localStorage.getItem('krishi_token');
      const response = await fetch(`${API_URL}/api/predict-fertilizer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          temperature: parseFloat(fertilizerForm.temperature),
          humidity: parseFloat(fertilizerForm.humidity),
          moisture: parseFloat(fertilizerForm.moisture),
          soil_type: fertilizerForm.soil_type,
          crop_type: fertilizerForm.crop_type,
          nitrogen: parseFloat(fertilizerForm.nitrogen),
          potassium: parseFloat(fertilizerForm.potassium),
          phosphorous: parseFloat(fertilizerForm.phosphorous)
        })
      });
      if (response.status === 401 || response.status === 403) {
        onLogout();
        return;
      }
      const data = await response.json();
      if (response.ok && data.status === 'ok') {
        setFertilizerResult(data);
      } else {
        setFertilizerError(data.message || 'Failed to predict fertilizer.');
      }
    } catch (err) {
      setFertilizerError('Connection to fertilizer prediction API failed.');
    } finally {
      setFertilizerLoading(false);
    }
  };

  const selectCropFromFinder = (cropName) => {
    setPredictForm({
      ...predictForm,
      crop: cropName,
      soil_type: finderForm.soil_type,
      state: finderForm.state,
      district: finderForm.district
    });
    setActiveTab('risk_prediction');
    runRiskPrediction({
      crop: cropName,
      soil_type: finderForm.soil_type,
      state: finderForm.state,
      district: finderForm.district,
      planting_date: predictForm.planting_date,
      target_date: predictForm.target_date,
      stock_level: predictForm.stock_level,
      weather_condition: predictForm.weather_condition
    });
  };

  const handleStateChange = (stateName) => {
    const districts = locations[stateName] || [];
    const defaultDistrict = districts.length > 0 ? districts[0] : '';
    setPredictForm({
      ...predictForm,
      state: stateName,
      district: defaultDistrict
    });
  };

  const handleFinderStateChange = (stateName) => {
    const districts = locations[stateName] || [];
    const defaultDistrict = districts.length > 0 ? districts[0] : '';
    setFinderForm({
      ...finderForm,
      state: stateName,
      district: defaultDistrict
    });
  };

  const setDatePreset = (daysAgo) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    const dateStr = d.toISOString().split('T')[0];
    setMandiForm({
      ...mandiForm,
      date: dateStr
    });
  };

  const setPredictTomorrow = () => {
    const tomorrowStr = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    setPredictForm({
      ...predictForm,
      target_date: tomorrowStr
    });
  };

  const handleMandiStateChange = (stateName) => {
    setMandiForm(prev => ({
      ...prev,
      state: stateName,
      district: 'All'
    }));
  };

  const getRiskColor = (level) => {
    if (level === 'Low') return '#2e7d32'; 
    if (level === 'Medium') return '#f57c00'; 
    return '#d84315'; 
  };

  const getWeatherIcon = (main) => {
    const desc = main ? main.toLowerCase() : '';
    if (desc.includes('rain') || desc.includes('drizzle')) return <CloudRain size={36} color="#1b5e20" style={{ animation: 'float 4s ease-in-out infinite' }} />;
    if (desc.includes('clear')) return <Sun size={36} color="#f57c00" style={{ animation: 'spinSlow 20s linear infinite' }} />;
    return <Sun size={36} color="#f57c00" />; 
  };

  const getFilteredMandiRecords = () => {
    if (!mandiResult || !mandiResult.records) return [];
    if (!mandiSearchQuery) return mandiResult.records;
    
    const query = mandiSearchQuery.toLowerCase().trim();
    return mandiResult.records.filter(r => 
      (r.state && r.state.toLowerCase().includes(query)) || 
      (r.district && r.district.toLowerCase().includes(query)) ||
      (r.market && r.market.toLowerCase().includes(query))
    );
  };

  const filteredMandiRecords = getFilteredMandiRecords();

  return (
    <div className="dashboard-grid">
      {/* Sidebar Section */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarLogo}>
          <div style={styles.sidebarLogoIcon}>
            <Sprout size={22} color="#ffffff" />
          </div>
          <div>
            <h2 style={styles.sidebarLogoText}>कृषिSeva</h2>
            <span style={styles.sidebarLogoSubText}>AI Portal</span>
          </div>
        </div>

        <nav style={styles.sidebarNav}>
          <button 
            onClick={() => setActiveTab('risk_prediction')} 
            style={activeTab === 'risk_prediction' ? styles.navBtnActive : styles.navBtn}
          >
            <Compass size={18} />
            {t('sidebar_risk')}
          </button>
          <button 
            onClick={() => setActiveTab('crop_finder')} 
            style={activeTab === 'crop_finder' ? styles.navBtnActive : styles.navBtn}
          >
            <Sprout size={18} />
            {t('sidebar_finder')}
          </button>
          <button 
            onClick={() => setActiveTab('live_mandi')} 
            style={activeTab === 'live_mandi' ? styles.navBtnActive : styles.navBtn}
          >
            <Search size={18} />
            {t('sidebar_mandi')}
          </button>
          <button 
            onClick={() => setActiveTab('plant_disease')} 
            style={activeTab === 'plant_disease' ? styles.navBtnActive : styles.navBtn}
          >
            <Leaf size={18} />
            {t('sidebar_disease')}
          </button>
          <button 
            onClick={() => setActiveTab('medicine_detection')} 
            style={activeTab === 'medicine_detection' ? styles.navBtnActive : styles.navBtn}
          >
            <Pill size={18} />
            {t('sidebar_medicine')}
          </button>
          <button 
            onClick={() => setActiveTab('history')} 
            style={activeTab === 'history' ? styles.navBtnActive : styles.navBtn}
          >
            <History size={18} />
            {t('sidebar_logs')}
          </button>
          <button 
            onClick={() => setActiveTab('settings')} 
            style={activeTab === 'settings' ? styles.navBtnActive : styles.navBtn}
          >
            <Settings size={18} />
            {t('sidebar_settings')}
          </button>
        </nav>

        <div style={styles.sidebarUser}>
          <div style={styles.userIconCircle}>
            {user.name.charAt(0)}
          </div>
          <div style={styles.userInfo}>
            <h4 style={styles.userName}>{user.name}</h4>
            <p style={styles.userEmail}>{user.email}</p>
          </div>
          <button onClick={onLogout} style={styles.logoutBtn} title="Logout">
            <LogOut size={16} color="#d84315" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={styles.mainContent}>
        {/* Mandi ticker */}
        <div className="ticker-wrap">
          <div className="ticker-content">
            {tickerItems.map((item, idx) => (
              <span key={idx} className="ticker-item">
                {item.crop}: <span>{item.price}</span> (
                <span className={item.up ? 'price-up' : 'price-down'}>{item.change}</span>)
              </span>
            ))}
            {tickerItems.map((item, idx) => (
              <span key={`dup-${idx}`} className="ticker-item">
                {item.crop}: <span>{item.price}</span> (
                <span className={item.up ? 'price-up' : 'price-down'}>{item.change}</span>)
              </span>
            ))}
          </div>
        </div>

        <div style={styles.contentBody}>
          {/* Header Row with Weather Widget */}
          <header style={styles.contentHeader}>
            <div>
              <h1 style={styles.mainTitle}>
                {activeTab === 'risk_prediction' && t('sidebar_risk')}
                {activeTab === 'crop_finder' && t('sidebar_finder')}
                {activeTab === 'live_mandi' && t('sidebar_mandi')}
                {activeTab === 'plant_disease' && t('sidebar_disease')}
                {activeTab === 'medicine_detection' && t('sidebar_medicine')}
                {activeTab === 'history' && t('sidebar_logs')}
                {activeTab === 'settings' && t('tab_settings_title')}
              </h1>
              <p style={styles.mainSubtitle}>
                {language === 'en' ? 'Indian agricultural intelligence powered by advanced AI and Deep Learning models.' : 
                 language === 'hi' ? 'उन्नत एआई और डीप लर्निंग मॉडल द्वारा संचालित भारतीय कृषि खुफिया जानकारी।' :
                 language === 'te' ? 'అధునాతన AI మరియు డീప్ లెర్నింగ్ మోడల్స్ ద్వారా నడిచే భారతీయ వ్యవసాయ సమాచారం.' :
                 language === 'ta' ? 'மேம்பட்ட AI மற்றும் ஆழ்ந்த கற்றல் மாதிரிகள் மூலம் இயங்கும் இந்திய விவசாய நுண்ணறிவு.' :
                 language === 'kn' ? 'ಸುಧಾರಿತ AI ಮತ್ತು ಆಳವಾದ ಕಲಿಕೆಯ ಮಾದರಿಗಳಿಂದ ਚಾಲಿತವಾಗಿರುವ ಭಾರತೀಯ ಕೃಷಿ ಬುದ್ಧಿವಂತಿಕೆ.' :
                 language === 'ml' ? 'നൂതന AI, ഡീപ് ലേണിംഗ് മോඩലുകൾ എന്നിവയിൽ പ്രവർത്തിക്കുന്ന ഇന്ത്യൻ കാർഷിക ബുദ്ധി.' :
                 language === 'mr' ? 'प्रगत एआय आणि डीप लर्निंग मॉडेल्सद्वारे समर्थित भारतीय कृषी बुद्धिमत्ता.' :
                 language === 'gu' ? 'અદ્યતન એઆઈ અને ડીપ લર્નિંગ મોડલ્સ દ્વારા સંચાલિત ભારતીય કૃષિ બુદ્ધિ.' :
                 language === 'bn' ? 'উন্নত এআই এবং ডিপ লার্নিং মডেল দ্বারা চালিত ভারতীয় কৃষি বুদ্ধিমত্তা।' :
                 language === 'pa' ? 'ਉੱਨਤ AI ਅਤੇ ਡੀਪ ਲਰਨਿੰਗ ਮਾਡਲਾਂ ਦੁਆਰਾ ਸੈਨਤ ਭਾਰਤੀ ਖੇਤੀਬਾੜੀ ਖੁਫੀਆ ਜਾਣਕਾਰੀ।' :
                 language === 'or' ? 'ଉନ୍ନତ AI ଏବଂ ଗଭୀર ଶିକ୍ଷା ମଡେଲ ଦ୍ୱାରା ଚାଳିତ ଭାରତୀય କୃଷି ବୁଦ୍ଧିଜୀବୀ।' :
                 'پیشرفته AI اور ڈیپ لرننگ ماڈلز سے چلنے والی ہندوستانی زرعی معلومات۔'}
              </p>
            </div>

            {/* Weather widget */}
            <div className="glass-panel" style={styles.weatherCard}>
              <div style={styles.weatherSearchBox}>
                <MapPin size={14} color="#8d6e63" />
                <input 
                  type="text" 
                  value={cityInput} 
                  onChange={(e) => setCityInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchWeather(cityInput)}
                  style={styles.weatherSearchInput}
                  placeholder="Enter location..."
                />
                <button onClick={() => fetchWeather(cityInput)} style={styles.weatherSearchBtn} title="Search Location Weather">
                  <Search size={14} color="#ffffff" />
                </button>
              </div>

              {weatherLoading ? (
                <div style={styles.weatherLoaderBox}>
                  <div style={styles.weatherSpinner} />
                </div>
              ) : weather ? (
                <div style={styles.weatherInfoBox}>
                  <div style={styles.weatherMain}>
                    {getWeatherIcon(weather.weather[0].main)}
                    <div>
                      <h3 style={styles.weatherTemp}>{Math.round(weather.main.temp)}°C</h3>
                      <p style={styles.weatherDesc}>{weather.weather[0].description}</p>
                    </div>
                  </div>
                  <div style={styles.weatherStats}>
                    <div style={styles.weatherStatItem} title="Humidity">
                      <CloudRain size={14} color="#2e7d32" />
                      <span>{weather.main.humidity}%</span>
                    </div>
                    <div style={styles.weatherStatItem} title="Wind Speed">
                      <Wind size={14} color="#2e7d32" />
                      <span>{weather.wind.speed} m/s</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={styles.weatherText}>No weather info</div>
              )}
            </div>
          </header>

          {/* TAB 1: CROP RISK PREDICTION */}
          {activeTab === 'risk_prediction' && (
            <div style={styles.tabContainer} className="animate-fade-in">
              <div style={styles.predictGrid}>
                {/* Form Card */}
                <form onSubmit={handlePredictSubmit} className="glass-panel" style={styles.predictFormCard}>
                  <h3 style={styles.cardTitle}>Prediction Parameters</h3>
                  
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Select Crop</label>
                    <select
                      value={predictForm.crop}
                      onChange={(e) => setPredictForm({...predictForm, crop: e.target.value})}
                      className="form-input"
                    >
                      {crops.map((c, i) => <option key={i} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Soil Type</label>
                    <select
                      value={predictForm.soil_type}
                      onChange={(e) => setPredictForm({...predictForm, soil_type: e.target.value})}
                      className="form-input"
                    >
                      {soils.map((s, i) => <option key={i} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div style={styles.grid2}>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>State</label>
                      <select
                        value={predictForm.state}
                        onChange={(e) => handleStateChange(e.target.value)}
                        className="form-input"
                      >
                        {Object.keys(locations).map((st, i) => (
                          <option key={i} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>

                    <div style={styles.inputGroup}>
                      <label style={styles.label}>District</label>
                      <select
                        value={predictForm.district}
                        onChange={(e) => setPredictForm({...predictForm, district: e.target.value})}
                        className="form-input"
                      >
                        {(locations[predictForm.state] || []).map((dist, i) => (
                          <option key={i} value={dist}>{dist}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={styles.grid2}>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Sowing Date</label>
                      <input
                        type="date"
                        value={predictForm.planting_date}
                        onChange={(e) => setPredictForm({...predictForm, planting_date: e.target.value})}
                        className="form-input"
                        required
                      />
                    </div>

                    <div style={styles.inputGroup}>
                      <label style={styles.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Predict Price For</span>
                        <button type="button" onClick={setPredictTomorrow} style={styles.tomorrowChip}>Tomorrow</button>
                      </label>
                      <input
                        type="date"
                        value={predictForm.target_date}
                        onChange={(e) => setPredictForm({...predictForm, target_date: e.target.value})}
                        className="form-input"
                        required
                      />
                    </div>
                  </div>

                  {/* Stock Level & Weather Condition parameters */}
                  <div style={styles.grid2}>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Expected Market Stock</label>
                      <select
                        value={predictForm.stock_level}
                        onChange={(e) => setPredictForm({...predictForm, stock_level: e.target.value})}
                        className="form-input"
                      >
                        <option value="Auto">Auto (Seasonal Estimate)</option>
                        <option value="Low">Low (Scarce supply/Premium price)</option>
                        <option value="Medium">Medium (Average arrivals)</option>
                        <option value="High">High (Abundant supply/Saturated)</option>
                      </select>
                    </div>

                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Forecast Weather</label>
                      <select
                        value={predictForm.weather_condition}
                        onChange={(e) => setPredictForm({...predictForm, weather_condition: e.target.value})}
                        className="form-input"
                      >
                        <option value="Normal">Normal</option>
                        <option value="Sunny">Sunny (Drought risk/Dry season)</option>
                        <option value="Rainy">Rainy (Heavy monsoon anomaly)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={predictLoading}
                    style={{ marginTop: '10px' }}
                  >
                    {predictLoading ? 'Analyzing Risk...' : 'Run Tomorrow/Target Prediction'}
                  </button>
                  
                  {predictError && (
                    <div style={styles.formError}>
                      <AlertCircle size={16} />
                      <span>{predictError}</span>
                    </div>
                  )}
                </form>

                {/* Prediction Result Display */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {predictLoading ? (
                    <div className="glass-panel" style={styles.loadingPanel}>
                      <div style={styles.growLoader} />
                      <h3>KrishiSeva AI predicting price trends...</h3>
                      <p>Calculating supply elasticities based on target date and market arrivals volume...</p>
                    </div>
                  ) : predictResult ? (
                    <div className="glass-panel" style={styles.resultCard}>
                      
                      {/* Price Crash warning alerts */}
                      {predictResult.risk_breakdown.market_supply_saturation.includes('High') && (
                        <div style={styles.warningAlertBanner}>
                          <AlertTriangle size={20} color="#d84315" />
                          <div>
                            <strong style={{ color: '#d84315', fontSize: '0.85rem' }}>MARKET PRICE WARNING:</strong>
                            <p style={{ fontSize: '0.82rem', color: '#5d4037', marginTop: '2px' }}>
                              Abundant stock arrivals volume ({predictResult.market_stock_tonnes} Tonnes) predicted for this period. 
                              High risk of wholesale market saturation driving down immediate prices.
                            </p>
                          </div>
                        </div>
                      )}

                      {predictResult.market_stock_level === 'Low' && (
                        <div style={styles.successAlertBanner}>
                          <TrendingUp size={20} color="#2e7d32" />
                          <div>
                            <strong style={{ color: '#2e7d32', fontSize: '0.85rem' }}>MARKET DEMAND INDICATION:</strong>
                            <p style={{ fontSize: '0.82rem', color: '#1b5e20', marginTop: '2px' }}>
                              Low arrivals volume ({predictResult.market_stock_tonnes} Tonnes) expected in mandis. 
                              Supply shortage indicates premium seller price opportunity.
                            </p>
                          </div>
                        </div>
                      )}

                      <div style={styles.resultHeader}>
                        <div>
                          <h2 style={styles.resultCropTitle}>{predictResult.crop} Price Prediction</h2>
                          <p style={styles.resultLocationSub}>
                            Forecast for <strong>{predictResult.target_prediction_date}</strong> in {predictResult.district}, {predictResult.state}
                          </p>
                        </div>
                        {/* Circular Gauge */}
                        <div style={styles.gaugeWrapper}>
                          <svg width="100" height="100">
                            <circle cx="50" cy="50" r="40" className="circle-bg" />
                            <circle 
                              cx="50" cy="50" r="40" 
                              className="circle-indicator" 
                              stroke={getRiskColor(predictResult.risk_level)}
                              strokeDasharray={`${2 * Math.PI * 40}`}
                              strokeDashoffset={`${2 * Math.PI * 40 * (1 - (predictResult.risk_level === 'Low' ? 0.3 : (predictResult.risk_level === 'Medium' ? 0.6 : 0.9)))}`}
                            />
                          </svg>
                          <div style={styles.gaugeText}>
                            <span style={{ fontSize: '0.7rem', color: '#6d8c70', fontWeight: 'bold' }}>RISK LEVEL</span>
                            <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: getRiskColor(predictResult.risk_level) }}>
                              {predictResult.risk_level}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Economic Details Grid */}
                      <div style={styles.metricsGrid}>
                        <div style={styles.metricCard}>
                          <span style={styles.metricLabel}>Target Forecast Date</span>
                          <span style={styles.metricValue}>{predictResult.target_prediction_date}</span>
                          <span style={styles.metricSub}>Sowing: {predictResult.planting_date}</span>
                        </div>
                        <div style={styles.metricCard}>
                          <span style={styles.metricLabel}>Predicted Price</span>
                          <span style={styles.metricValue} style={{ color: '#2e7d32', fontWeight: 'bold', fontSize: '1.4rem' }}>
                            ₹{predictResult.predicted_price_rs_kg}/kg
                          </span>
                          <span style={styles.metricSub}>₹{predictResult.predicted_price_rs_quintal}/Quintal</span>
                        </div>
                        <div style={styles.metricCard}>
                          <span style={styles.metricLabel}>Market Stock Volume</span>
                          <span style={styles.metricValue} style={{ color: '#f57c00' }}>
                            {predictResult.market_stock_level}
                          </span>
                          <span style={styles.metricSub}>{predictResult.market_stock_tonnes} Tonnes supply</span>
                        </div>
                      </div>

                      {/* Detailed Breakdown */}
                      <div style={styles.breakdownBox}>
                        <h4 style={styles.sectionHeading}>Risk Breakdown & Condition Matrix</h4>
                        <div style={styles.breakdownGrid}>
                          <div style={styles.breakdownItem}>
                            <span>Weather Condition:</span>
                            <strong>{predictResult.weather_condition}</strong>
                          </div>
                          <div style={styles.breakdownItem}>
                            <span>Simulated Rainfall:</span>
                            <strong>{predictResult.simulated_rainfall_mm} mm</strong>
                          </div>
                          <div style={styles.breakdownItem}>
                            <span>Normal Rainfall:</span>
                            <strong>{predictResult.normal_rainfall_mm} mm</strong>
                          </div>
                          <div style={styles.breakdownItem}>
                            <span>Soil Suitability:</span>
                            <strong style={{ color: predictResult.risk_breakdown.soil_suitability_risk === 'High' ? '#d84315' : '#2e7d32' }}>
                              {predictResult.risk_breakdown.soil_suitability_risk === 'High' ? 'Unsuitable' : 'Compatible'}
                            </strong>
                          </div>
                        </div>
                      </div>

                      {/* Agronomic Tips */}
                      <div style={styles.tipsBox}>
                        <h4 style={styles.sectionHeading}>Agronomic Guidelines & Warehouse Advice</h4>
                        <ul style={styles.tipsList}>
                          {predictResult.agronomic_tips.map((tip, idx) => (
                            <li key={idx} style={styles.tipItem}>
                              <CheckCircle size={14} color="#2e7d32" style={{ flexShrink: 0, marginTop: '2px' }} />
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Forecast chart */}
                      <div style={styles.chartWrapper}>
                        <h4 style={styles.sectionHeading}>Expected Price Trajectory (Pre-Prediction Months)</h4>
                        <div style={{ width: '100%', height: 180 }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#eceff1" />
                              <XAxis dataKey="month" stroke="#78909c" fontSize={12} />
                              <YAxis stroke="#78909c" fontSize={12} />
                              <Tooltip />
                              <Line type="monotone" dataKey="Price" stroke="#2e7d32" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="glass-panel" style={styles.noResultCard}>
                      <Compass size={48} color="#8d6e63" />
                      <h3>No Prediction Run Yet</h3>
                      <p>Configure the parameters on the left and run the prediction to compute risks and forecasting indices.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CROP FINDER */}
          {activeTab === 'crop_finder' && (
            <div style={styles.tabContainer} className="animate-fade-in">
              <div style={styles.finderGrid}>
                {/* Form Input panel */}
                <form onSubmit={handleFinderSubmit} className="glass-panel" style={styles.predictFormCard}>
                  <h3 style={styles.cardTitle}>Agronomic Constraints</h3>
                  <p style={{ fontSize: '0.82rem', color: '#556657', marginBottom: '15px' }}>
                    Find crops that yield the best return on investment tailored to your soil, budget, and season limits.
                  </p>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Soil Type Available</label>
                    <select
                      value={finderForm.soil_type}
                      onChange={(e) => setFinderForm({...finderForm, soil_type: e.target.value})}
                      className="form-input"
                    >
                      {soils.map((s, i) => <option key={i} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Max Growing Window (Months)</label>
                    <input
                      type="number"
                      min="1"
                      max="12"
                      value={finderForm.duration_months}
                      onChange={(e) => setFinderForm({...finderForm, duration_months: e.target.value})}
                      className="form-input"
                      required
                    />
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Maximum Investment Budget (₹)</label>
                    <input
                      type="number"
                      min="1000"
                      max="200000"
                      step="500"
                      value={finderForm.investment_budget}
                      onChange={(e) => setFinderForm({...finderForm, investment_budget: e.target.value})}
                      className="form-input"
                      required
                    />
                  </div>

                  <div style={styles.grid2}>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>State</label>
                      <select
                        value={finderForm.state}
                        onChange={(e) => handleFinderStateChange(e.target.value)}
                        className="form-input"
                      >
                        {Object.keys(locations).map((st, i) => (
                          <option key={i} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>

                    <div style={styles.inputGroup}>
                      <label style={styles.label}>District</label>
                      <select
                        value={finderForm.district}
                        onChange={(e) => setFinderForm({...finderForm, district: e.target.value})}
                        className="form-input"
                      >
                        {(locations[finderForm.state] || []).map((dist, i) => (
                          <option key={i} value={dist}>{dist}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn-gold"
                    disabled={finderLoading}
                    style={{ marginTop: '10px' }}
                  >
                    {finderLoading ? 'Searching Databases...' : 'Find Best Crops'}
                  </button>

                  {finderError && (
                    <div style={styles.formError}>
                      <AlertCircle size={16} />
                      <span>{finderError}</span>
                    </div>
                  )}
                </form>

                {/* Recommendations List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {finderLoading ? (
                    <div className="glass-panel" style={styles.loadingPanel}>
                      <div style={styles.growLoader} />
                      <h3>Searching agronomic parameters...</h3>
                    </div>
                  ) : finderRecommendations.length > 0 ? (
                    <div style={styles.recommendationsListContainer}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1b5e20', marginBottom: '10px' }}>
                        Matching Crops Ranked by ROI
                      </h3>
                      <div style={styles.recommendationsGrid}>
                        {finderRecommendations.map((crop, idx) => (
                          <div key={idx} className="glass-panel hover-card" style={styles.cropRecCard}>
                            <div style={styles.recCardHeader}>
                              <div>
                                <h4 style={styles.recCropName}>{crop.name}</h4>
                                <span style={styles.recCropDuration}>{crop.durationDays} days cycle</span>
                              </div>
                              <span style={{ 
                                ...styles.badge, 
                                backgroundColor: crop.suitability === 'High' ? '#e8f5e9' : '#fff3e0',
                                color: crop.suitability === 'High' ? '#2e7d32' : '#f57c00'
                              }}>
                                {crop.suitability} Suitability
                              </span>
                            </div>

                            <div style={styles.recMetrics}>
                              <div style={styles.recMetricItem}>
                                <span style={styles.recMetricLabel}>Investment Needed</span>
                                <span style={styles.recMetricValue}>₹{crop.investmentPerAcre}</span>
                              </div>
                              <div style={styles.recMetricItem}>
                                <span style={styles.recMetricLabel}>Expected Profit</span>
                                <span style={styles.recMetricValue} style={{ color: '#2e7d32', fontWeight: 'bold' }}>
                                  ₹{crop.netProfit}
                                </span>
                              </div>
                              <div style={styles.recMetricItem}>
                                <span style={styles.recMetricLabel}>Estimated ROI</span>
                                <span style={styles.recMetricValue} style={{ color: '#2e7d32', fontWeight: 'bold' }}>
                                  {crop.roiPercentage}%
                                </span>
                              </div>
                            </div>

                            <div style={styles.recCardFooter}>
                              <span style={{ fontSize: '0.8rem', color: '#6d8c70' }}>
                                Risk Level: <strong style={{ color: getRiskColor(crop.riskLevel) }}>{crop.riskLevel}</strong>
                              </span>
                              <button 
                                onClick={() => selectCropFromFinder(crop.name)}
                                style={styles.recActionBtn}
                              >
                                Run Full Risk Forecast <ArrowRight size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="glass-panel" style={styles.noResultCard}>
                      <Compass size={48} color="#8d6e63" />
                      <h3>Configure and Search</h3>
                      <p>Enter your land's soil type and capital constraints on the left to display crop suggestions.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LIVE MANDI PRICES */}
          {activeTab === 'live_mandi' && (
            <div style={styles.tabContainer} className="animate-fade-in">
              {/* Selector Box */}
              <div className="glass-panel" style={styles.mandiFilterCard}>
                <h3 style={styles.cardTitle} style={{ marginBottom: '15px' }}>Live Mandi Parameters</h3>
                
                <div style={styles.mandiFilterGrid}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Commodity Name</label>
                    <select
                      value={mandiForm.crop}
                      onChange={(e) => setMandiForm({...mandiForm, crop: e.target.value})}
                      className="form-input"
                    >
                      {crops.map((c, i) => <option key={i} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>State</label>
                    <select
                      value={mandiForm.state}
                      onChange={(e) => handleMandiStateChange(e.target.value)}
                      className="form-input"
                    >
                      <option value="All">All States</option>
                      {Object.keys(locations).map((st, i) => (
                        <option key={i} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>District</label>
                    <select
                      value={mandiForm.district}
                      onChange={(e) => setMandiForm({...mandiForm, district: e.target.value})}
                      className="form-input"
                      disabled={mandiForm.state === 'All'}
                    >
                      <option value="All">All Districts</option>
                      {mandiForm.state !== 'All' && (locations[mandiForm.state] || []).map((dist, i) => (
                        <option key={i} value={dist}>{dist}</option>
                      ))}
                    </select>
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Select Date</label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <Calendar size={18} style={{ position: 'absolute', left: '16px', color: '#6d8c70' }} />
                      <input
                        type="date"
                        value={mandiForm.date}
                        onChange={(e) => setMandiForm({...mandiForm, date: e.target.value})}
                        className="form-input"
                        style={{ paddingLeft: '44px' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignSelf: 'flex-end', height: '48px', alignItems: 'center' }}>
                    <button 
                      onClick={() => setDatePreset(0)} 
                      type="button" 
                      style={styles.presetChip}
                      className={mandiForm.date === new Date().toISOString().split('T')[0] ? 'active-preset' : ''}
                    >
                      Today
                    </button>
                    <button 
                      onClick={() => setDatePreset(1)} 
                      type="button" 
                      style={styles.presetChip}
                    >
                      Yesterday
                    </button>
                    <button 
                      onClick={() => setDatePreset(2)} 
                      type="button" 
                      style={styles.presetChip}
                    >
                      2 Days Ago
                    </button>
                    <button 
                      onClick={() => setDatePreset(3)} 
                      type="button" 
                      style={styles.presetChip}
                    >
                      3 Days Ago
                    </button>
                  </div>
                </div>

                {/* Instant Table Search Filter bar */}
                {mandiResult && mandiResult.records && mandiResult.records.length > 0 && (
                  <div style={styles.inputGroup} style={{ marginTop: '15px' }}>
                    <label style={styles.label}>Search Mandi Table (State / District / Mandi)</label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <Search size={18} style={{ position: 'absolute', left: '16px', color: '#6d8c70' }} />
                      <input
                        type="text"
                        placeholder="Type state or district name to filter results in real-time... (e.g. Karnataka, Agra)"
                        value={mandiSearchQuery}
                        onChange={(e) => setMandiSearchQuery(e.target.value)}
                        className="form-input"
                        style={{ paddingLeft: '44px' }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Mandi Results */}
              {mandiLoading ? (
                <div className="glass-panel" style={styles.loadingPanel}>
                  <div style={styles.growLoader} />
                  <h3>Retrieving live mandi price feeds...</h3>
                </div>
              ) : mandiResult && mandiResult.records && mandiResult.records.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Status Banner */}
                  {mandiResult.source === 'synthesized_fallback' ? (
                    <div style={styles.fallbackNotice}>
                      <AlertTriangle size={18} color="#f57c00" />
                      <div style={{ fontSize: '0.85rem', color: '#e65100', fontWeight: '600' }}>
                        Government Server Limit Reached. Displaying backup agrarian data feed for {mandiForm.crop} on {mandiResult.arrival_date}.
                      </div>
                    </div>
                  ) : (
                    <div style={styles.liveNotice}>
                      <CheckCircle size={18} color="#2e7d32" />
                      <div style={{ fontSize: '0.85rem', color: '#1b5e20', fontWeight: '600' }}>
                        Connected successfully to Government Daily Price API. Live feeds loaded for {mandiForm.crop} on {mandiResult.arrival_date} (Retrieved {mandiResult.records.length} mandis in India).
                      </div>
                    </div>
                  )}

                  {/* Summary Cards */}
                  <div style={styles.mandiSummaryGrid}>
                    <div className="glass-panel" style={styles.summaryMetricCard}>
                      <span style={styles.summaryMetricLabel}>Average Price (Filtered)</span>
                      <span style={styles.summaryMetricValue}>
                        {filteredMandiRecords.length > 0 ? (
                          `₹${(filteredMandiRecords.reduce((acc, r) => acc + parseFloat(r.modal_price), 0) / filteredMandiRecords.length / 100).toFixed(2)}/kg`
                        ) : (
                          '₹0.00/kg'
                        )}
                      </span>
                      <span style={styles.summaryMetricSub}>Calculated across {filteredMandiRecords.length} mandis</span>
                    </div>

                    <div className="glass-panel" style={styles.summaryMetricCard}>
                      <span style={styles.summaryMetricLabel}>Highest Mandi (Filtered)</span>
                      {(() => {
                        const highest = [...filteredMandiRecords].sort((a, b) => b.modal_price - a.modal_price)[0];
                        return highest ? (
                          <>
                            <span style={styles.summaryMetricValue} style={{ color: '#2e7d32', fontSize: '1.25rem', fontWeight: 'bold' }}>
                              ₹{(highest.modal_price / 100).toFixed(0)}/kg
                            </span>
                            <span style={styles.summaryMetricSub}>{highest.market} ({highest.state})</span>
                          </>
                        ) : <span>N/A</span>;
                      })()}
                    </div>

                    <div className="glass-panel" style={styles.summaryMetricCard}>
                      <span style={styles.summaryMetricLabel}>Lowest Mandi (Filtered)</span>
                      {(() => {
                        const lowest = [...filteredMandiRecords].sort((a, b) => a.modal_price - b.modal_price)[0];
                        return lowest ? (
                          <>
                            <span style={styles.summaryMetricValue} style={{ color: '#d84315', fontSize: '1.25rem', fontWeight: 'bold' }}>
                              ₹{(lowest.modal_price / 100).toFixed(0)}/kg
                            </span>
                            <span style={styles.summaryMetricSub}>{lowest.market} ({lowest.state})</span>
                          </>
                        ) : <span>N/A</span>;
                      })()}
                    </div>
                  </div>

                  {/* Table */}
                  <div className="glass-panel" style={{ overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                      {filteredMandiRecords.length > 0 ? (
                        <table style={styles.table}>
                          <thead>
                            <tr style={styles.tableHeaderRow}>
                              <th style={styles.tableHeaderCell}>State</th>
                              <th style={styles.tableHeaderCell}>Mandi Market</th>
                              <th style={styles.tableHeaderCell}>Min Price (₹/q)</th>
                              <th style={styles.tableHeaderCell}>Max Price (₹/q)</th>
                              <th style={styles.tableHeaderCell}>Modal Price (₹/q)</th>
                              <th style={styles.tableHeaderCell}>Price Equivalent</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredMandiRecords.map((rec, idx) => (
                              <tr key={idx} style={idx % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}>
                                <td style={styles.tableCell} style={{ fontWeight: '600' }}>{rec.state}</td>
                                <td style={styles.tableCell}>{rec.market}</td>
                                <td style={styles.tableCell}>₹{rec.min_price}</td>
                                <td style={styles.tableCell}>₹{rec.max_price}</td>
                                <td style={styles.tableCell} style={{ fontWeight: 'bold', color: '#2e7d32' }}>₹{rec.modal_price}</td>
                                <td style={styles.tableCell} style={{ fontWeight: '500', color: '#e65100' }}>
                                  ₹{(rec.modal_price / 100).toFixed(2)} / kg
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#8d6e63' }}>
                          <AlertCircle size={32} style={{ marginBottom: '10px' }} />
                          <h4>No mandis found matching "{mandiSearchQuery}"</h4>
                          <p>Try typing another state or district name.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="glass-panel" style={styles.noResultCard}>
                  <AlertCircle size={48} color="#8d6e63" />
                  <h3>No mandi feeds available for this date</h3>
                  <p>Mandi commodity markets are generally closed on Sundays or holidays. Try selecting a nearby weekday or preset chip.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: PLANT DISEASE DETECTION */}
          {activeTab === 'plant_disease' && (
            <div style={styles.tabContainer} className="animate-fade-in">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px' }}>
                {/* Left side: Upload leaf image and NPK calculator */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div className="glass-panel" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1b5e20', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Leaf size={20} />
                      Leaf Image Upload
                    </h3>
                    
                    <div 
                      onClick={() => document.getElementById('disease-file-input').click()}
                      style={{
                        border: '2.5px dashed #a5d6a7',
                        borderRadius: '16px',
                        padding: '30px 20px',
                        textAlign: 'center',
                        background: '#f1f8e9',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '12px',
                        color: '#2e7d32'
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.borderColor = '#4caf50'; e.currentTarget.style.background = '#e8f5e9'; }}
                      onMouseOut={(e) => { e.currentTarget.style.borderColor = '#a5d6a7'; e.currentTarget.style.background = '#f1f8e9'; }}
                    >
                      <input 
                        type="file" 
                        id="disease-file-input" 
                        accept="image/*" 
                        onChange={(e) => handleFileChange(e, 'disease')} 
                        style={{ display: 'none' }} 
                      />
                      {diseaseImage ? (
                        <div style={{ position: 'relative', width: '100%' }}>
                          <img src={diseaseImage} alt="Leaf Preview" style={{ maxHeight: '200px', borderRadius: '12px', objectFit: 'contain', margin: '0 auto', display: 'block' }} />
                          <button 
                            onClick={(e) => { e.stopPropagation(); setDiseaseImage(null); setDiseaseResult(null); }}
                            style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#d84315', color: '#ffffff', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload size={36} color="#388e3c" />
                          <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>Select Leaf Image</div>
                          <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Supports Tomato, Potato, Pepper Bell leaf scans</div>
                        </>
                      )}
                    </div>
                    
                    {diseaseError && (
                      <div style={{ ...styles.formError, marginTop: '16px' }}>
                        <AlertCircle size={16} />
                        <span>{diseaseError}</span>
                      </div>
                    )}
                    
                    <button 
                      onClick={handleDiseaseScan} 
                      disabled={diseaseLoading || !diseaseImage}
                      style={{
                        width: '100%',
                        marginTop: '16px',
                        background: diseaseImage ? 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)' : '#a5d6a7',
                        color: '#ffffff',
                        border: 'none',
                        padding: '14px',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        fontWeight: '700',
                        cursor: diseaseImage ? 'pointer' : 'not-allowed',
                        boxShadow: diseaseImage ? '0 4px 12px rgba(46, 125, 50, 0.2)' : 'none',
                        transition: 'transform 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                      onMouseOver={(e) => { if (diseaseImage) e.currentTarget.style.transform = 'translateY(-2px)'; }}
                      onMouseOut={(e) => { if (diseaseImage) e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                      {diseaseLoading ? (
                        <>
                          <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2.5px solid #ffffff', borderTopColor: 'transparent', animation: 'spinSlow 0.6s linear infinite' }} />
                          Analyzing Leaf Patterns...
                        </>
                      ) : (
                        <>
                          <Activity size={18} />
                          Scan Leaf Health
                        </>
                      )}
                    </button>
                  </div>

                  {/* NPK Fertilizer recommendation form */}
                  <div className="glass-panel" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#8d6e63', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calculator size={20} />
                      Soil Fertilizer NPK Predictor
                    </h3>
                    
                    <form onSubmit={handleFertilizerPredict} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                        <div style={styles.inputGroup}>
                          <label style={{ ...styles.label, fontSize: '0.75rem' }}>Nitrogen (N)</label>
                          <input 
                            type="number" 
                            value={fertilizerForm.nitrogen} 
                            onChange={(e) => setFertilizerForm({...fertilizerForm, nitrogen: e.target.value})} 
                            className="form-input" 
                            placeholder="e.g. 30"
                            required
                          />
                        </div>
                        <div style={styles.inputGroup}>
                          <label style={{ ...styles.label, fontSize: '0.75rem' }}>Phosphorous (P)</label>
                          <input 
                            type="number" 
                            value={fertilizerForm.phosphorous} 
                            onChange={(e) => setFertilizerForm({...fertilizerForm, phosphorous: e.target.value})} 
                            className="form-input" 
                            placeholder="e.g. 25"
                            required
                          />
                        </div>
                        <div style={styles.inputGroup}>
                          <label style={{ ...styles.label, fontSize: '0.75rem' }}>Potassium (K)</label>
                          <input 
                            type="number" 
                            value={fertilizerForm.potassium} 
                            onChange={(e) => setFertilizerForm({...fertilizerForm, potassium: e.target.value})} 
                            className="form-input" 
                            placeholder="e.g. 15"
                            required
                          />
                        </div>
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                        <div style={styles.inputGroup}>
                          <label style={{ ...styles.label, fontSize: '0.75rem' }}>Temp (°C)</label>
                          <input 
                            type="number" 
                            value={fertilizerForm.temperature} 
                            onChange={(e) => setFertilizerForm({...fertilizerForm, temperature: e.target.value})} 
                            className="form-input" 
                            placeholder="28"
                            required
                          />
                        </div>
                        <div style={styles.inputGroup}>
                          <label style={{ ...styles.label, fontSize: '0.75rem' }}>Humidity (%)</label>
                          <input 
                            type="number" 
                            value={fertilizerForm.humidity} 
                            onChange={(e) => setFertilizerForm({...fertilizerForm, humidity: e.target.value})} 
                            className="form-input" 
                            placeholder="60"
                            required
                          />
                        </div>
                        <div style={styles.inputGroup}>
                          <label style={{ ...styles.label, fontSize: '0.75rem' }}>Moisture (%)</label>
                          <input 
                            type="number" 
                            value={fertilizerForm.moisture} 
                            onChange={(e) => setFertilizerForm({...fertilizerForm, moisture: e.target.value})} 
                            className="form-input" 
                            placeholder="45"
                            required
                          />
                        </div>
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div style={styles.inputGroup}>
                          <label style={{ ...styles.label, fontSize: '0.75rem' }}>Soil Type</label>
                          <select 
                            value={fertilizerForm.soil_type} 
                            onChange={(e) => setFertilizerForm({...fertilizerForm, soil_type: e.target.value})} 
                            className="form-input"
                          >
                            {soils.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        <div style={styles.inputGroup}>
                          <label style={{ ...styles.label, fontSize: '0.75rem' }}>Crop Type</label>
                          <select 
                            value={fertilizerForm.crop_type} 
                            onChange={(e) => setFertilizerForm({...fertilizerForm, crop_type: e.target.value})} 
                            className="form-input"
                          >
                            {crops.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                      </div>

                      {fertilizerError && (
                        <div style={styles.formError}>
                          <AlertCircle size={16} />
                          <span>{fertilizerError}</span>
                        </div>
                      )}
                      
                      <button 
                        type="submit" 
                        disabled={fertilizerLoading}
                        style={{
                          width: '100%',
                          background: 'linear-gradient(135deg, #8d6e63 0%, #5d4037 100%)',
                          color: '#ffffff',
                          border: 'none',
                          padding: '12px',
                          borderRadius: '10px',
                          fontSize: '0.9rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          boxShadow: '0 4px 10px rgba(141, 110, 99, 0.25)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          outline: 'none'
                        }}
                      >
                        {fertilizerLoading ? 'Calculating NPK needs...' : 'Calculate Fertilizer'}
                      </button>
                    </form>
                    
                    {fertilizerResult && (
                      <div style={{ marginTop: '16px', padding: '16px', background: '#efebe9', borderRadius: '12px', borderLeft: '5px solid #8d6e63', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#5d4037' }}>RECOMMENDED:</span>
                          <span style={{ fontSize: '1rem', fontWeight: '800', color: '#d84315' }}>{fertilizerResult.fertilizer}</span>
                        </div>
                        {fertilizerResult.details && (
                          <>
                            <div style={{ fontSize: '0.8rem', color: '#3e2723' }}><strong>Ratio:</strong> {fertilizerResult.details.composition}</div>
                            <div style={{ fontSize: '0.75rem', color: '#4e342e' }}><strong>Benefits:</strong> {fertilizerResult.details.benefits}</div>
                            <div style={{ fontSize: '0.75rem', color: '#4e342e' }}><strong>Usage:</strong> {fertilizerResult.details.instructions}</div>
                            <a 
                              href={fertilizerResult.details.link} 
                              target="_blank" 
                              rel="noreferrer" 
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#1b5e20', fontWeight: '700', marginTop: '4px', textDecoration: 'none' }}
                            >
                              Buy {fertilizerResult.fertilizer} on IFFCO Bazar <ChevronRight size={12} />
                            </a>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Right side: Diagnosis report & logs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div className="glass-panel" style={{ padding: '24px', flexGrow: 1, minHeight: '380px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1b5e20', marginBottom: '16px', borderBottom: '1.5px solid #e8f5e9', paddingBottom: '12px' }}>
                      Diagnostic Report
                    </h3>
                    
                    {diseaseResult ? (
                      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ background: 'rgba(76, 175, 80, 0.08)', border: '1.5px solid rgba(76, 175, 80, 0.2)', padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#2e7d32' }}>DETECTED CONDITION</div>
                            <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#1b5e20', marginTop: '2px' }}>{diseaseResult.disease_display}</h2>
                          </div>
                          <div style={{ background: '#2e7d32', color: '#ffffff', padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800' }}>
                            {Math.round(diseaseResult.confidence * 100)}% Match
                          </div>
                        </div>
                        
                        <div style={{ background: '#f9fbe7', border: '1.5px dashed #d4e157', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <Pill size={24} color="#827717" />
                          <div>
                            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#827717' }}>RECOMMENDED MEDICINE</div>
                            <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#558b2f' }}>{diseaseResult.medicine}</div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div style={{ padding: '12px', background: '#f5f5f5', borderRadius: '10px' }}>
                              <h4 style={{ fontSize: '0.8rem', fontWeight: '700', color: '#616161', marginBottom: '4px' }}>What this medicine does</h4>
                              <p style={{ fontSize: '0.75rem', color: '#424242', lineHeight: '1.3' }}>{diseaseResult.details}</p>
                            </div>
                            <div style={{ padding: '12px', background: '#f5f5f5', borderRadius: '10px' }}>
                              <h4 style={{ fontSize: '0.8rem', fontWeight: '700', color: '#616161', marginBottom: '4px' }}>How to apply</h4>
                              <p style={{ fontSize: '0.75rem', color: '#424242', lineHeight: '1.3' }}>{diseaseResult.how_to_use}</p>
                            </div>
                          </div>
                          <div style={{ padding: '12px', background: '#ffebee', borderRadius: '10px', borderLeft: '4px solid #c62828' }}>
                            <h4 style={{ fontSize: '0.8rem', fontWeight: '700', color: '#c62828', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <ShieldAlert size={14} /> Safety Precautions
                            </h4>
                            <p style={{ fontSize: '0.75rem', color: '#b71c1c', lineHeight: '1.3' }}>{diseaseResult.precautions}</p>
                          </div>
                        </div>
                        
                        {(diseaseResult.link || diseaseResult.purchase_link) && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                            <a 
                              href={diseaseResult.link || diseaseResult.purchase_link} 
                              target="_blank" 
                              rel="noreferrer" 
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                background: '#2e7d32',
                                color: '#ffffff',
                                textDecoration: 'none',
                                padding: '14px',
                                borderRadius: '12px',
                                fontWeight: '700',
                                fontSize: '0.95rem',
                                textAlign: 'center',
                                boxShadow: '0 4px 10px rgba(46, 125, 50, 0.2)'
                              }}
                            >
                              Buy Medicine Online (IFFCO Bazar)
                              <ChevronRight size={16} />
                            </a>
                            <div style={{ 
                              background: 'rgba(255, 255, 255, 0.7)', 
                              border: '1.5px solid rgba(76, 175, 80, 0.2)', 
                              padding: '10px 14px', 
                              borderRadius: '10px', 
                              fontSize: '0.75rem', 
                              color: '#2e7d32',
                              wordBreak: 'break-all',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '4px'
                            }}>
                              <span style={{ fontWeight: '700' }}>Direct Purchase Link:</span>
                              <a 
                                href={diseaseResult.link || diseaseResult.purchase_link} 
                                target="_blank" 
                                rel="noreferrer"
                                style={{ color: '#1b5e20', textDecoration: 'underline', fontWeight: '600' }}
                              >
                                {diseaseResult.link || diseaseResult.purchase_link}
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '16px', color: '#8d6e63', minHeight: '260px' }}>
                        <Leaf size={48} color="#c8e6c9" />
                        <div style={{ textAlign: 'center' }}>
                          <h4 style={{ fontWeight: '700', color: '#6d8c70' }}>Awaiting Leaf Scan</h4>
                          <p style={{ fontSize: '0.75rem', maxWidth: '240px', marginTop: '4px' }}>Upload a picture of a diseased crop leaf on the left panel to scan and find diagnostic reports.</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Scan History logs inside this tab */}
                  <div className="glass-panel" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#3e2723', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <History size={16} />
                      Recent Scans Log
                    </h3>
                    <div style={{ maxHeight: '160px', overflowY: 'auto' }}>
                      {diseaseHistory.length > 0 ? (
                        diseaseHistory.map((item, idx) => (
                          <div 
                            key={idx}
                            onClick={() => {
                              if (item.type === 'disease') {
                                setDiseaseResult(item.details);
                              } else {
                                setMedicineResult(item.details);
                              }
                            }}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '10px 14px',
                              borderBottom: '1px solid #e8f5e9',
                              cursor: 'pointer',
                              background: '#ffffff',
                              borderRadius: '8px',
                              marginBottom: '6px',
                              border: '1px solid #e8f5e9'
                            }}
                            className="history-row-hover"
                          >
                            <div>
                              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: item.type === 'disease' ? '#1b5e20' : '#8d6e63' }}>{item.image_summary}</div>
                              <div style={{ fontSize: '0.65rem', color: '#8d6e63' }}>{item.type === 'disease' ? 'Leaf Health Scan' : 'Medicine Identification'} • {new Date(item.created_at).toLocaleDateString()}</div>
                            </div>
                            <ChevronRight size={14} color="#8d6e63" />
                          </div>
                        ))
                      ) : (
                        <div style={{ fontSize: '0.75rem', color: '#8d6e63', textAlign: 'center', padding: '12px' }}>No scan history recorded.</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: MEDICINE DETECTION */}
          {activeTab === 'medicine_detection' && (
            <div style={styles.tabContainer} className="animate-fade-in">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px' }}>
                {/* Left side: Upload medicine label image */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div className="glass-panel" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#8d6e63', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Shield size={20} />
                      Agrochemical Label Scanner
                    </h3>
                    
                    <div 
                      onClick={() => document.getElementById('medicine-file-input').click()}
                      style={{
                        border: '2.5px dashed #d7ccc8',
                        borderRadius: '16px',
                        padding: '40px 20px',
                        textAlign: 'center',
                        background: '#efebe9',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '12px',
                        color: '#5d4037'
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.borderColor = '#8d6e63'; e.currentTarget.style.background = '#d7ccc8'; }}
                      onMouseOut={(e) => { e.currentTarget.style.borderColor = '#d7ccc8'; e.currentTarget.style.background = '#efebe9'; }}
                    >
                      <input 
                        type="file" 
                        id="medicine-file-input" 
                        accept="image/*" 
                        onChange={(e) => handleFileChange(e, 'medicine')} 
                        style={{ display: 'none' }} 
                      />
                      {medicineImage ? (
                        <div style={{ position: 'relative', width: '100%' }}>
                          <img src={medicineImage} alt="Medicine Preview" style={{ maxHeight: '200px', borderRadius: '12px', objectFit: 'contain', margin: '0 auto', display: 'block' }} />
                          <button 
                            onClick={(e) => { e.stopPropagation(); setMedicineImage(null); setMedicineResult(null); }}
                            style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#d84315', color: '#ffffff', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload size={36} color="#8d6e63" />
                          <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>Select Agrochemical Image</div>
                          <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Upload a pesticide bottle, fertilizer bag, or chemical label</div>
                        </>
                      )}
                    </div>
                    
                    {medicineError && (
                      <div style={{ ...styles.formError, marginTop: '16px' }}>
                        <AlertCircle size={16} />
                        <span>{medicineError}</span>
                      </div>
                    )}
                    
                    <button 
                      onClick={handleMedicineScan} 
                      disabled={medicineLoading || !medicineImage}
                      style={{
                        width: '100%',
                        marginTop: '16px',
                        background: medicineImage ? 'linear-gradient(135deg, #8d6e63 0%, #5d4037 100%)' : '#d7ccc8',
                        color: '#ffffff',
                        border: 'none',
                        padding: '14px',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        fontWeight: '700',
                        cursor: medicineImage ? 'pointer' : 'not-allowed',
                        boxShadow: medicineImage ? '0 4px 12px rgba(141, 110, 99, 0.25)' : 'none',
                        transition: 'transform 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                      onMouseOver={(e) => { if (medicineImage) e.currentTarget.style.transform = 'translateY(-2px)'; }}
                      onMouseOut={(e) => { if (medicineImage) e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                      {medicineLoading ? (
                        <>
                          <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2.5px solid #ffffff', borderTopColor: 'transparent', animation: 'spinSlow 0.6s linear infinite' }} />
                          Analyzing Chemical Label...
                        </>
                      ) : (
                        <>
                          <Activity size={18} />
                          Identify Agrochemical
                        </>
                      )}
                    </button>
                    
                    <div style={{ marginTop: '20px', padding: '12px', background: '#fff8e1', border: '1px solid #ffe082', borderRadius: '10px', fontSize: '0.75rem', color: '#b78103', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                      <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <strong>Instructions:</strong> For best results, capture a clear picture of the text label containing active ingredients, chemical name, or brand name.
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Right side: Medicine details analysis */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div className="glass-panel" style={{ padding: '24px', flexGrow: 1, minHeight: '380px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#8d6e63', marginBottom: '16px', borderBottom: '1.5px solid #efebe9', paddingBottom: '12px' }}>
                      Chemical & Side Effects Analysis
                    </h3>
                    
                    {medicineResult ? (
                      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ background: 'rgba(141, 110, 99, 0.08)', border: '1.5px solid rgba(141, 110, 99, 0.2)', padding: '16px', borderRadius: '12px' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#8d6e63' }}>DETECTED PRODUCT / BRAND</span>
                          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#5d4037', marginTop: '2px' }}>{medicineResult.brand_name}</h2>
                          <div style={{ fontSize: '0.85rem', color: '#7d5e53', marginTop: '4px' }}><strong>Active Ingredient:</strong> {medicineResult.chemical_name}</div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <div style={{ padding: '12px', background: '#f5f5f5', borderRadius: '10px' }}>
                            <h4 style={{ fontSize: '0.8rem', fontWeight: '700', color: '#616161', marginBottom: '4px' }}>Primary Agricultural Uses</h4>
                            <p style={{ fontSize: '0.75rem', color: '#424242', lineHeight: '1.3' }}>{medicineResult.uses}</p>
                          </div>
                          
                          <div style={{ padding: '12px', background: '#f5f5f5', borderRadius: '10px' }}>
                            <h4 style={{ fontSize: '0.8rem', fontWeight: '700', color: '#616161', marginBottom: '4px' }}>Dosage & Mixing Instructions</h4>
                            <p style={{ fontSize: '0.75rem', color: '#424242', lineHeight: '1.3' }}>{medicineResult.how_to_use}</p>
                          </div>
                          
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div style={{ padding: '12px', background: '#efebe9', borderRadius: '10px' }}>
                              <h4 style={{ fontSize: '0.8rem', fontWeight: '700', color: '#5d4037', marginBottom: '4px' }}>Handling Precautions</h4>
                              <p style={{ fontSize: '0.75rem', color: '#3e2723', lineHeight: '1.3' }}>{medicineResult.precautions}</p>
                            </div>
                            
                            <div style={{ padding: '12px', background: '#ffebee', borderRadius: '10px', borderLeft: '4px solid #c62828' }}>
                              <h4 style={{ fontSize: '0.8rem', fontWeight: '700', color: '#c62828', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <ShieldAlert size={14} /> Side Effects & Hazards
                              </h4>
                              <p style={{ fontSize: '0.75rem', color: '#b71c1c', lineHeight: '1.3' }}>{medicineResult.side_effects}</p>
                            </div>
                          </div>
                        </div>
                        
                        {(medicineResult.purchase_link || medicineResult.link) && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                            <a 
                              href={medicineResult.purchase_link || medicineResult.link} 
                              target="_blank" 
                              rel="noreferrer" 
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                background: '#8d6e63',
                                color: '#ffffff',
                                textDecoration: 'none',
                                padding: '14px',
                                borderRadius: '12px',
                                fontWeight: '700',
                                fontSize: '0.95rem',
                                textAlign: 'center',
                                boxShadow: '0 4px 10px rgba(141, 110, 99, 0.25)'
                              }}
                            >
                              Browse Agrochemical Distributors (IFFCO Bazar)
                              <ChevronRight size={16} />
                            </a>
                            <div style={{ 
                              background: 'rgba(255, 255, 255, 0.7)', 
                              border: '1.5px solid rgba(141, 110, 99, 0.2)', 
                              padding: '10px 14px', 
                              borderRadius: '10px', 
                              fontSize: '0.75rem', 
                              color: '#5d4037',
                              wordBreak: 'break-all',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '4px'
                            }}>
                              <span style={{ fontWeight: '700' }}>Direct Purchase Link:</span>
                              <a 
                                href={medicineResult.purchase_link || medicineResult.link} 
                                target="_blank" 
                                rel="noreferrer"
                                style={{ color: '#3e2723', textDecoration: 'underline', fontWeight: '600' }}
                              >
                                {medicineResult.purchase_link || medicineResult.link}
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '16px', color: '#8d6e63', minHeight: '260px' }}>
                        <Shield size={48} color="#d7ccc8" />
                        <div style={{ textAlign: 'center' }}>
                          <h4 style={{ fontWeight: '700', color: '#8d6e63' }}>Awaiting Label Scan</h4>
                          <p style={{ fontSize: '0.75rem', maxWidth: '240px', marginTop: '4px' }}>Upload a picture of an agrochemical label on the left panel to scan and run side-effects analysis.</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Scan History logs inside this tab too */}
                  <div className="glass-panel" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#3e2723', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <History size={16} />
                      Recent Scans Log
                    </h3>
                    <div style={{ maxHeight: '160px', overflowY: 'auto' }}>
                      {diseaseHistory.length > 0 ? (
                        diseaseHistory.map((item, idx) => (
                          <div 
                            key={idx}
                            onClick={() => {
                              if (item.type === 'disease') {
                                setDiseaseResult(item.details);
                              } else {
                                setMedicineResult(item.details);
                              }
                            }}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '10px 14px',
                              borderBottom: '1px solid #e8f5e9',
                              cursor: 'pointer',
                              background: '#ffffff',
                              borderRadius: '8px',
                              marginBottom: '6px',
                              border: '1px solid #e8f5e9'
                            }}
                            className="history-row-hover"
                          >
                            <div>
                              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: item.type === 'disease' ? '#1b5e20' : '#8d6e63' }}>{item.image_summary}</div>
                              <div style={{ fontSize: '0.65rem', color: '#8d6e63' }}>{item.type === 'disease' ? 'Leaf Health Scan' : 'Medicine Identification'} • {new Date(item.created_at).toLocaleDateString()}</div>
                            </div>
                            <ChevronRight size={14} color="#8d6e63" />
                          </div>
                        ))
                      ) : (
                        <div style={{ fontSize: '0.75rem', color: '#8d6e63', textAlign: 'center', padding: '12px' }}>No scan history recorded.</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PREDICTION HISTORY LOG */}
          {activeTab === 'history' && (
            <div style={styles.tabContainer} className="animate-fade-in">
              {historyLoading ? (
                <div className="glass-panel" style={styles.loadingPanel}>
                  <div style={styles.growLoader} />
                  <h3>Querying database files...</h3>
                </div>
              ) : historyList.length > 0 ? (
                <div className="glass-panel" style={{ overflow: 'hidden' }}>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={styles.table}>
                      <thead>
                        <tr style={styles.tableHeaderRow}>
                          <th style={styles.tableHeaderCell}>Search Date</th>
                          <th style={styles.tableHeaderCell}>Crop</th>
                          <th style={styles.tableHeaderCell}>Soil Type</th>
                          <th style={styles.tableHeaderCell}>Location</th>
                          <th style={styles.tableHeaderCell}>Forecast Date</th>
                          <th style={styles.tableHeaderCell}>Forecast Price</th>
                          <th style={styles.tableHeaderCell}>Risk Rating</th>
                        </tr>
                      </thead>
                      <tbody>
                        {historyList.map((log, idx) => (
                          <tr key={idx} style={idx % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}>
                            <td style={styles.tableCell} style={{ fontSize: '0.82rem', color: '#556657' }}>
                              {new Date(log.created_at).toLocaleString()}
                            </td>
                            <td style={styles.tableCell} style={{ fontWeight: 'bold' }}>{log.crop}</td>
                            <td style={styles.tableCell}>{log.soil_type}</td>
                            <td style={styles.tableCell}>{log.district}, {log.state}</td>
                            <td style={styles.tableCell}>{log.completion_date}</td>
                            <td style={styles.tableCell} style={{ fontWeight: '600', color: '#2e7d32' }}>
                              ₹{log.predicted_price_rs_kg}/kg
                            </td>
                            <td style={styles.tableCell}>
                              <span style={{ 
                                ...styles.badge, 
                                backgroundColor: log.risk_level === 'Low' ? '#e8f5e9' : (log.risk_level === 'Medium' ? '#fff3e0' : '#fbe9e7'),
                                color: getRiskColor(log.risk_level)
                              }}>
                                {log.risk_level}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="glass-panel" style={styles.noResultCard}>
                  <History size={48} color="#8d6e63" />
                  <h3>No Searches Logged</h3>
                  <p>Your AI crop forecasts will be logged here automatically once you run predictions.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: SETTINGS & LANGUAGE OPTIONS */}
          {activeTab === 'settings' && (
            <div style={styles.tabContainer} className="animate-fade-in">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px' }}>
                
                {/* Left side: Profile & Language */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  {/* User Profile Card */}
                  <div className="glass-panel" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1b5e20', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Sprout size={20} />
                      {t('user_profile')}
                    </h3>
                    
                    {profileLoading ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px' }}>
                        <div style={styles.growLoader} />
                        <span>{t('profile_loading')}</span>
                      </div>
                    ) : profileError ? (
                      <div style={{ color: '#b71c1c', padding: '10px', borderRadius: '8px', background: '#ffebee', fontSize: '0.85rem' }}>
                        {profileError}
                      </div>
                    ) : profileData ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                          <span style={{ fontWeight: '600', color: '#556657' }}>{t('user_name')}</span>
                          <span style={{ fontWeight: '700', color: '#1b5e20' }}>{profileData.name}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                          <span style={{ fontWeight: '600', color: '#556657' }}>{t('user_email')}</span>
                          <span style={{ fontWeight: '700', color: '#1b5e20' }}>{profileData.email}</span>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {/* Language Settings Card */}
                  <div className="glass-panel" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1b5e20', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Compass size={20} />
                      {t('language_settings')}
                    </h3>
                    
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#556657', marginBottom: '8px' }}>
                      {t('select_lang')}
                    </label>
                    <select
                      value={language}
                      onChange={(e) => {
                        const newLang = e.target.value;
                        setLanguage(newLang);
                        localStorage.setItem('krishi_lang', newLang);
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1.5px solid #c8e6c9',
                        outline: 'none',
                        fontSize: '0.95rem',
                        fontWeight: '600',
                        color: '#2e7d32',
                        background: '#ffffff',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="en">English (English)</option>
                      <option value="hi">हिन्दी (Hindi)</option>
                      <option value="te">తెలుగు (Telugu)</option>
                      <option value="ta">தமிழ் (Tamil)</option>
                      <option value="kn">ಕನ್ನಡ (Kannada)</option>
                      <option value="ml">മലയാളം (Malayalam)</option>
                      <option value="mr">मराठी (Marathi)</option>
                      <option value="gu">ગુજરાતી (Gujarati)</option>
                      <option value="bn">বাংলা (Bengali)</option>
                      <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
                      <option value="or">ଓଡ଼ିଆ (Odia)</option>
                      <option value="ur">اردو (Urdu)</option>
                    </select>
                  </div>
                </div>

                {/* Right side: Change Password Card */}
                <div className="glass-panel" style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1b5e20', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Settings size={20} />
                    {t('change_password')}
                  </h3>
                  
                  <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#556657', marginBottom: '6px' }}>
                        {t('curr_pass')}
                      </label>
                      <input
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: '1.5px solid #c8e6c9',
                          outline: 'none',
                          fontSize: '0.9rem'
                        }}
                        placeholder="••••••••"
                      />
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#556657', marginBottom: '6px' }}>
                        {t('new_pass')}
                      </label>
                      <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: '1.5px solid #c8e6c9',
                          outline: 'none',
                          fontSize: '0.9rem'
                        }}
                        placeholder="••••••••"
                      />
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#556657', marginBottom: '6px' }}>
                        {t('confirm_pass')}
                      </label>
                      <input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: '1.5px solid #c8e6c9',
                          outline: 'none',
                          fontSize: '0.9rem'
                        }}
                        placeholder="••••••••"
                      />
                    </div>

                    {passwordError && (
                      <div style={{ color: '#b71c1c', padding: '10px 14px', borderRadius: '8px', background: '#ffebee', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertCircle size={16} />
                        <span>{passwordError}</span>
                      </div>
                    )}

                    {passwordSuccess && (
                      <div style={{ color: '#2e7d32', padding: '10px 14px', borderRadius: '8px', background: '#e8f5e9', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle size={16} />
                        <span>{passwordSuccess}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={passwordLoading}
                      style={{
                        padding: '12px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
                        color: '#ffffff',
                        border: 'none',
                        fontWeight: '700',
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(46, 125, 50, 0.2)',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      {passwordLoading ? t('updating') : t('btn_update_pass')}
                    </button>
                  </form>
                </div>

              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const styles = {
  sidebar: {
    background: '#1b5e20',
    color: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '24px',
    height: '100%',
    minHeight: '100vh',
    borderRight: '1.5px solid rgba(255, 255, 255, 0.1)',
  },
  sidebarLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '32px',
  },
  sidebarLogoIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'rgba(255, 255, 255, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sidebarLogoText: {
    fontSize: '1.25rem',
    fontWeight: '800',
    letterSpacing: '-0.3px',
    lineHeight: '1.2',
  },
  sidebarLogoSubText: {
    fontSize: '0.75rem',
    opacity: 0.7,
    fontWeight: '500',
  },
  sidebarNav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flexGrow: 1,
  },
  navBtn: {
    background: 'none',
    border: 'none',
    color: 'rgba(255, 255, 255, 0.75)',
    padding: '14px 18px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '0.95rem',
    fontWeight: '600',
    textAlign: 'left',
    cursor: 'pointer',
    width: '100%',
  },
  navBtnActive: {
    background: 'rgba(255, 255, 255, 0.15)',
    border: 'none',
    color: '#ffffff',
    padding: '14px 18px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '0.95rem',
    fontWeight: '600',
    textAlign: 'left',
    cursor: 'pointer',
    width: '100%',
    boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.1)',
  },
  sidebarUser: {
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    paddingTop: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  userIconCircle: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #f57c00 0%, #e65100 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.95rem',
    fontWeight: 'bold',
    color: 'white',
  },
  userInfo: {
    flexGrow: 1,
    overflow: 'hidden',
  },
  userName: {
    fontSize: '0.9rem',
    fontWeight: '700',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  userEmail: {
    fontSize: '0.75rem',
    opacity: 0.7,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  logoutBtn: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  mainContent: {
    display: 'flex',
    flexDirection: 'column',
    background: '#f4f6f0',
    overflowY: 'auto',
    height: '100vh',
  },
  contentBody: {
    padding: '30px 40px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    flexGrow: 1,
  },
  contentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px',
  },
  mainTitle: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#1b5e20',
    letterSpacing: '-0.5px',
  },
  mainSubtitle: {
    fontSize: '0.95rem',
    color: '#556657',
    fontWeight: '500',
    marginTop: '4px',
  },
  weatherCard: {
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    border: '1.5px solid rgba(46, 125, 50, 0.15)',
    boxShadow: 'var(--shadow-sm)',
    background: '#ffffff',
    borderRadius: '16px',
  },
  weatherSearchBox: {
    display: 'flex',
    alignItems: 'center',
    background: '#f4f6f0',
    borderRadius: '10px',
    padding: '6px 12px',
    border: '1px solid rgba(46, 125, 50, 0.15)',
    gap: '8px',
  },
  weatherSearchInput: {
    border: 'none',
    background: 'none',
    outline: 'none',
    fontSize: '0.85rem',
    width: '110px',
    color: '#2e3d30',
    fontWeight: '600',
  },
  weatherSearchBtn: {
    background: '#2e7d32',
    border: 'none',
    borderRadius: '6px',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  weatherInfoBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  weatherMain: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  weatherTemp: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: '#1b5e20',
    lineHeight: '1.1',
  },
  weatherDesc: {
    fontSize: '0.75rem',
    color: '#6d8c70',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  weatherStats: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    borderLeft: '1.5px solid rgba(46, 125, 50, 0.15)',
    paddingLeft: '16px',
  },
  weatherStatItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#2e3d30',
  },
  weatherLoaderBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80px',
  },
  weatherSpinner: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    border: '3px solid #e8f5e9',
    borderTopColor: '#2e7d32',
    animation: 'spinSlow 1s linear infinite',
  },
  weatherText: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#556657',
  },
  tabContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  predictGrid: {
    display: 'grid',
    gridTemplateColumns: '400px 1fr',
    gap: '24px',
    alignItems: 'start',
  },
  predictFormCard: {
    padding: '30px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    boxShadow: 'var(--shadow-sm)',
    border: '1.5px solid rgba(46, 125, 50, 0.1)',
  },
  cardTitle: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#1b5e20',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flexGrow: 1,
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#2e3d30',
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  tomorrowChip: {
    background: 'var(--color-green-light)',
    border: '1px solid var(--color-green-primary)',
    color: 'var(--color-green-primary)',
    borderRadius: '6px',
    fontSize: '0.7rem',
    padding: '2px 6px',
    fontWeight: 'bold',
    cursor: 'pointer',
    outline: 'none',
  },
  formError: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#c62828',
    fontSize: '0.8rem',
    background: '#ffe9e9',
    padding: '10px',
    borderRadius: '8px',
    fontWeight: '600',
  },
  loadingPanel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 40px',
    gap: '16px',
    textAlign: 'center',
  },
  growLoader: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    border: '5px solid #e8f5e9',
    borderTopColor: '#2e7d32',
    animation: 'spinSlow 1s linear infinite',
  },
  noResultCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '100px 40px',
    gap: '16px',
    textAlign: 'center',
    color: '#8d6e63',
  },
  resultCard: {
    padding: '30px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    border: '1px solid rgba(46, 125, 50, 0.15)',
  },
  warningAlertBanner: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    background: '#fbe9e7',
    border: '1.5px solid #ffccbc',
    borderRadius: '12px',
    padding: '16px',
  },
  successAlertBanner: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    background: '#e8f5e9',
    border: '1.5px solid #a5d6a7',
    borderRadius: '12px',
    padding: '16px',
  },
  resultHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultCropTitle: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: '#1b5e20',
  },
  resultLocationSub: {
    fontSize: '0.85rem',
    color: '#556657',
    fontWeight: '600',
  },
  gaugeWrapper: {
    position: 'relative',
    width: '100px',
    height: '100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeText: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
  },
  metricCard: {
    background: '#ffffff',
    border: '1px solid rgba(46, 125, 50, 0.1)',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    boxShadow: 'var(--shadow-sm)',
  },
  metricLabel: {
    fontSize: '0.75rem',
    color: '#6d8c70',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  metricValue: {
    fontSize: '1.2rem',
    fontWeight: '800',
    color: '#2e3d30',
  },
  metricSub: {
    fontSize: '0.75rem',
    color: '#8d6e63',
    fontWeight: '500',
  },
  breakdownBox: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '20px',
    border: '1.5px solid rgba(46, 125, 50, 0.1)',
  },
  sectionHeading: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#1b5e20',
    marginBottom: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  breakdownGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  breakdownItem: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    color: '#2e3d30',
    borderBottom: '1px solid #eceff1',
    paddingBottom: '8px',
  },
  tipsBox: {
    background: '#e8f5e9',
    border: '1.5px solid #c8e6c9',
    borderRadius: '16px',
    padding: '20px',
  },
  tipsList: {
    listStyleType: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  tipItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    fontSize: '0.88rem',
    color: '#1b5e20',
    fontWeight: '500',
  },
  chartWrapper: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '20px',
    border: '1.5px solid rgba(46, 125, 50, 0.1)',
  },
  finderGrid: {
    display: 'grid',
    gridTemplateColumns: '380px 1fr',
    gap: '24px',
    alignItems: 'start',
  },
  recommendationsListContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  recommendationsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
  },
  cropRecCard: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    border: '1.5px solid rgba(46, 125, 50, 0.08)',
  },
  recCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  recCropName: {
    fontSize: '1.15rem',
    fontWeight: '800',
    color: '#1b5e20',
  },
  recCropDuration: {
    fontSize: '0.75rem',
    color: '#8d6e63',
    fontWeight: '600',
  },
  badge: {
    fontSize: '0.72rem',
    fontWeight: '700',
    padding: '4px 8px',
    borderRadius: '6px',
    textTransform: 'uppercase',
  },
  recMetrics: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    background: '#ffffff',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #eceff1',
  },
  recMetricItem: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.8rem',
    color: '#2e3d30',
  },
  recMetricLabel: {
    color: '#6d8c70',
    fontWeight: '600',
  },
  recCardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid #eceff1',
    paddingTop: '12px',
  },
  recActionBtn: {
    background: 'none',
    border: 'none',
    color: '#f57c00',
    fontWeight: 'bold',
    fontSize: '0.78rem',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    cursor: 'pointer',
    padding: 0,
  },
  mandiFilterCard: {
    padding: '20px 24px',
    boxShadow: 'var(--shadow-sm)',
    border: '1.5px solid rgba(46, 125, 50, 0.1)',
  },
  mandiFilterGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    alignItems: 'center',
  },
  presetChip: {
    background: '#ffffff',
    border: '1.5px solid rgba(46, 125, 50, 0.15)',
    borderRadius: '20px',
    padding: '8px 16px',
    fontSize: '0.82rem',
    fontWeight: '600',
    color: '#2e3d30',
    cursor: 'pointer',
    outline: 'none',
  },
  fallbackNotice: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: '#fff8e1',
    border: '1.5px solid #ffe082',
    padding: '12px 18px',
    borderRadius: '12px',
  },
  liveNotice: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: '#e8f5e9',
    border: '1.5px solid #c8e6c9',
    padding: '12px 18px',
    borderRadius: '12px',
  },
  mandiSummaryGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '16px',
  },
  summaryMetricCard: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    boxShadow: 'var(--shadow-sm)',
    border: '1px solid rgba(46, 125, 50, 0.1)',
  },
  summaryMetricLabel: {
    fontSize: '0.75rem',
    color: '#6d8c70',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  summaryMetricValue: {
    fontSize: '1.45rem',
    fontWeight: '800',
    color: '#1b5e20',
  },
  summaryMetricSub: {
    fontSize: '0.75rem',
    color: '#8d6e63',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    background: '#ffffff',
  },
  tableHeaderRow: {
    background: '#e8f5e9',
    borderBottom: '2px solid rgba(46, 125, 50, 0.15)',
  },
  tableHeaderCell: {
    padding: '16px 20px',
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#1b5e20',
    textTransform: 'uppercase',
  },
  tableRowEven: {
    background: '#ffffff',
    borderBottom: '1px solid #eceff1',
  },
  tableRowOdd: {
    background: '#fcfdfe',
    borderBottom: '1px solid #eceff1',
  },
  tableCell: {
    padding: '16px 20px',
    fontSize: '0.88rem',
    color: '#2e3d30',
  },
};
