import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-54854473/health", (c) => {
  return c.json({ status: "ok" });
});

// Gemini AI Chat API integration for AI Voice Assistant
app.post("/make-server-54854473/api/gemini-chat", async (c) => {
  try {
    const { messages, language, currentPage, userQuery } = await c.req.json();
    
    // Get Gemini API key from environment
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    
    if (!geminiApiKey) {
      // Fallback to local processing
      console.log("Gemini API key not found, using local processing");
      return c.json({ 
        response: await processLocalAI(userQuery, language, currentPage),
        source: "local"
      });
    }

    // Enhanced system prompts for healthcare context
    const healthcareSystemPrompt = {
      en: `You are JanArogya AI, a compassionate healthcare assistant for rural India. Your role is to:

1. Help with navigation in the JanArogya app (current page: ${currentPage})
2. Provide basic health guidance and symptom assessment
3. Assist with appointment booking, prescription management, and family health
4. Offer emergency guidance when needed
5. Support health workers and doctors with their tasks

Guidelines:
- Keep responses brief and easy to understand (max 2-3 sentences)
- Use simple language suitable for rural users with varying literacy
- Always recommend consulting a healthcare professional for serious symptoms
- Provide navigation help when users ask to go somewhere
- Be empathetic and culturally sensitive
- For emergencies, immediately guide to emergency services
- Respond in English unless user speaks in another language

Current page context: ${currentPage}`,

      hi: `आप जनआरोग्य AI हैं, भारत के ग्रामीण क्षेत्रों के लिए एक दयालु स्वास्थ्य सहायक। आपकी भूमिका है:

1. जनआरोग्य ऐप में नेविगेशन में मदद करना (वर्तमान पृष्ठ: ${currentPage})
2. बुनियादी स्वास्थ्य मार्गदर्शन और लक्षण मूल्यांकन प्रदान करना
3. अपॉइंटमेंट बुकिंग, नुस्खा प्रबंधन और पारिवारिक स्वास्थ्य में सहायता करना
4. आवश्यकता पड़ने पर आपातकालीन मार्गदर्शन प्रदान करना
5. स्वास्थ्य कार्यकर्ताओं और डॉक्टरों को उनके कार्यों में सहायता करना

दिशानिर्देश:
- उत्तर संक्षिप्त और समझने में आसान रखें (अधिकतम 2-3 वाक्य)
- गंभीर लक्षणों के लिए हमेशा स्वास्थ्य पेशेवर से सलाह लेने की सिफारिश करें
- हिंदी में जवाब दें।

वर्तमान पृष्ठ संदर्भ: ${currentPage}`,

      pa: `ਤੁਸੀਂ ਜਨਆਰੋਗਿਆ AI ਹੋ, ਭਾਰਤ ਦੇ ਪੇਂਡੂ ਇਲਾਕਿਆਂ ਲਈ ਇੱਕ ਦਿਆਲੂ ਸਿਹਤ ਸਹਾਇਕ। ਤੁਹਾਡੀ ਭੂਮਿਕਾ ਹੈ:

1. ਜਨਆਰੋਗਿਆ ਐਪ ਵਿੱਚ ਨੈਵੀਗੇਸ਼ਨ ਵਿੱਚ ਮਦਦ ਕਰਨਾ (ਮੌਜੂਦਾ ਪੰਨਾ: ${currentPage})
2. ਬੁਨਿਆਦੀ ਸਿਹਤ ਮਾਰਗਦਰਸ਼ਨ ਅਤੇ ਲੱਛਣ ਮੁਲਾਂਕਣ ਪ੍ਰਦਾਨ ਕਰਨਾ
3. ਮੁਲਾਕਾਤ ਬੁਕਿੰਗ, ਨੁਸਖਾ ਪ੍ਰਬੰਧਨ ਅਤੇ ਪਰਿਵਾਰਕ ਸਿਹਤ ਵਿੱਚ ਸਹਾਇਤਾ ਕਰਨਾ

ਦਿਸ਼ਾ-ਨਿਰਦੇਸ਼:
- ਜਵਾਬ ਸੰਖੇਪ ਅਤੇ ਸਮਝਣ ਵਿੱਚ ਆਸਾਨ ਰੱਖੋ (ਵੱਧ ਤੋਂ ਵੱਧ 2-3 ਵਾਕ)
- ਪੰਜਾਬੀ ਵਿੱਚ ਜਵਾਬ ਦਿਓ।

ਮੌਜੂਦਾ ਪੰਨਾ ਸੰਦਰਭ: ${currentPage}`,

      bn: `আপনি জনআরোগ্য AI, ভারতের গ্রামীণ এলাকার জন্য একজন দয়ালু স্বাস্থ্য সহায়ক। আপনার ভূমিকা:

1. জনআরোগ্য অ্যাপে নেভিগেশনে সাহায্য করা (বর্তমান পৃষ্ঠা: ${currentPage})
2. মৌলিক স্বাস্থ্য নির্দেশনা এবং লক্ষণ মূল্যায়ন প্রদান করা
3. অ্যাপয়েন্টমেন্ট বুকিং, প্রেসক্রিপশন ব্যবস্থাপনা এবং পারিবারিক স্বাস্থ্যে সহায্য করা

নির্দেশনা:
- উত্তর সংক্ষিপ্ত এবং বোঝা সহজ রাখুন (সর্বোচ্চ 2-3 বাক্য)
- বাংলায় উত্তর দিন।

বর্তমান পৃষ্ঠা প্রসঙ্গ: ${currentPage}`
    };

    // Prepare conversation history for Gemini
    let conversationContext = "";
    if (messages && messages.length > 0) {
      // Get last few messages for context
      const recentMessages = messages.slice(-6);
      conversationContext = recentMessages
        .filter(msg => msg.role !== 'system')
        .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n');
      
      if (conversationContext) {
        conversationContext = `Previous conversation:\n${conversationContext}\n\nCurrent question: `;
      }
    }

    // Prepare the Gemini API request
    const prompt = `${healthcareSystemPrompt[language] || healthcareSystemPrompt.en}

${conversationContext}${userQuery}

Please respond as JanArogya AI in ${language === 'hi' ? 'Hindi' : language === 'pa' ? 'Punjabi' : language === 'bn' ? 'Bengali' : 'English'}.`;

    const apiRequest = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 150,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    // Call Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequest),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`Gemini API error: ${response.status} - ${errorData}`);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract response from Gemini format
    let aiResponse = "मुझे समझने में कुछ समस्या हुई। कृपया दोबारा कोशिश करें।";
    
    if (data.candidates && data.candidates.length > 0) {
      const candidate = data.candidates[0];
      if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
        aiResponse = candidate.content.parts[0].text || aiResponse;
      }
    }

    // Store conversation in KV store for learning
    await kv.set(`conversation_${Date.now()}`, {
      language,
      currentPage,
      userQuery,
      aiResponse,
      timestamp: new Date().toISOString(),
      source: "gemini"
    });

    return c.json({ 
      response: aiResponse,
      source: "gemini"
    });

  } catch (error) {
    console.error("Gemini AI processing error:", error);
    
    // Fallback to local processing
    const { userQuery: query, language: lang, currentPage: page } = await c.req.json().catch(() => ({}));
    const fallbackResponse = await processLocalAI(query, lang, page);
    
    return c.json({ 
      response: fallbackResponse,
      source: "fallback"
    });
  }
});

// Local AI processing fallback
async function processLocalAI(userQuery: any, language: string, currentPage: string): Promise<string> {
  // If userQuery is a Promise, await it
  if (userQuery instanceof Promise) {
    userQuery = await userQuery;
  }
  
  const query = (userQuery || '').toLowerCase();
  
  // Healthcare-focused local responses with more specific guidance
  const responses = {
    en: {
      symptoms: "I can help assess your symptoms. Describe what you're feeling - fever, pain, breathing issues, etc. For serious symptoms like chest pain or difficulty breathing, please use emergency services immediately.",
      fever: "For fever, ensure rest and hydration. If temperature is above 102°F (39°C) or persists for more than 3 days, consult a doctor. Use the patient portal to book an appointment.",
      headache: "For headaches, try rest in a dark room and stay hydrated. If severe, sudden, or with vision changes, seek immediate medical attention. I can help you find nearby doctors.",
      stomachache: "For stomach pain, avoid solid foods temporarily and stay hydrated with small sips of water. If severe pain or with vomiting, seek medical care urgently.",
      navigation: "I can help you navigate JanArogya. Say 'patient portal' for bookings, 'emergency' for urgent help, 'pharmacy' for medicines, or 'doctor portal' for medical professionals.",
      emergency: "🚨 EMERGENCY MODE ACTIVATED 🚨 I'm connecting you to emergency services. Stay calm. If someone is unconscious or not breathing, call 108 immediately.",
      appointment: "I can help book appointments. Say 'book doctor' for consultation, 'health worker visit' for home care, or 'video call' for online consultation. What type of appointment do you need?",
      medicine: "For medicines, I can help you scan prescriptions, check medicine availability, or find nearby pharmacies. Do you have a prescription to scan or need to find a specific medicine?",
      familyHealth: "I can help manage your family's health records. You can add family members, track their health, set medication reminders, and book appointments for them.",
      general: "I'm JanArogya AI, your intelligent health assistant. I can help with: 🏥 symptoms assessment, 📅 appointment booking, 💊 medicine guidance, 🚨 emergency help, and 👨‍👩‍👧‍👦 family health management. What do you need?"
    },
    hi: {
      symptoms: "मैं आपके लक्षणों का आकलन कर सकता हूं। बताएं कि आप कैसा महसूस कर रहे हैं - बुखार, दर्द, सांस की समस्या आदि। सीने में दर्द या सांस लेने में तकलीफ जैसे गंभीर लक्षणों के लिए तुरंत आपातकालीन सेवा का उपयोग करें।",
      fever: "बुखार के लिए आराम और तरल पदार्थ लें। यदि तापमान 102°F (39°C) से ऊपर है या 3 दिन से अधिक बना रहता है तो डॉक्टर से मिलें। अपॉइंटमेंट के लिए पेशेंट पोर्टल का उपयोग करें।",
      headache: "सिरदर्द के लिए अंधेरे कमरे में आराम करें और पानी पिएं। यदि तेज़, अचानक या आंखों की समस्या के साथ है तो तुरंत चिकित्सा सहायता लें।",
      stomachache: "पेट दर्द के लिए ठोस भोजन बंद करें और थोड़ा-थोड़ा पानी पिएं। तेज़ दर्द या उल्टी के साथ है तो तुरंत चिकित्सा सहायता लें।",
      navigation: "मैं जनआरोग्य में नेविगेट करने में मदद कर सकता हूं। बुकिंग के लिए 'पेशेंट पोर्टल', तत्काल मदद के लिए 'आपातकाल', दवाओं के लिए 'फार्मेसी' कहें।",
      emergency: "🚨 आपातकालीन मोड सक्रिय 🚨 मैं आपको आपातकालीन सेवाओं से जोड़ रहा हूं। शांत रहें। यदि कोई बेहोश है या सांस नहीं ले रहा तो तुरंत 108 पर कॉल करें।",
      appointment: "मैं अपॉइंटमेंट बुक करने में मदद कर सकता हूं। परामर्श के लिए 'डॉक्टर बुक करें', घर पर देखभाल के लिए 'स्वास्थ्य कार्यकर्ता', या ऑनलाइन के लिए 'वीडियो कॉल' कहें।",
      medicine: "दवाओं के लिए मैं नुस्खे स्कैन करने, दवा की उपलब्धता जांचने या पास की फार्मेसी खोजने में मदद कर सकता हूं। क्या आपका कोई नुस्खा है या कोई खास दवा चाहिए?",
      familyHealth: "मैं आपके परिवार के स्वास्थ्य रिकॉर्ड प्रबंधित करने में मदद कर सकता हूं। आप सदस्य जोड़ सकते हैं, उनका स्वास्थ्य ट्रैक कर सकते हैं और उनके लिए अपॉइंटमेंट बुक कर सकते हैं।",
      general: "मैं जनआरोग्य AI हूं, आपका बुद्धिमान स्वास्थ्य सहायक। मैं मदद कर सकता हूं: 🏥 लक्षण मूल्यांकन, 📅 अपॉइंटमेंट बुकिंग, 💊 दवा मार्गदर्शन, 🚨 आपातकालीन सहायता, 👨‍👩‍👧‍👦 पारिवारिक स्वास्थ्य प्रबंधन। आपको क्या चाहिए?"
    },
    pa: {
      symptoms: "ਮੈਂ ਤੁਹਾਡੇ ਲੱਛਣਾਂ ਨੂੰ ਸਮਝਣ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ। ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ ਕਿ ਤੁਸੀਂ ਕਿਵੇਂ ਮਹਿਸੂਸ ਕਰ ਰਹੇ ਹੋ।",
      navigation: "ਮੈਂ ਐਪ ਨੈਵੀਗੇਟ ਕਰਨ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ। ਤੁਸੀਂ ਕਹਿ ਸਕਦੇ ਹੋ 'ਮਰੀਜ਼ ਪੋਰਟਲ ਜਾਓ'।",
      emergency: "ਇਹ ਐਮਰਜੈਂਸੀ ਸਿਥਤੀ ਹੈ। ਮੈਂ ਤੁਹਾਨੂੰ ਤੁਰੰਤ ਐਮਰਜੈਂਸੀ ਸੇਵਾਵਾਂ ਵੱਲ ਭੇਜ ਰਿਹਾ ਹਾਂ।",
      appointment: "ਮੈਂ ਮੁਲਾਕਾਤ ਬੁੱਕ ਕਰਨ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ।",
      medicine: "ਦਵਾਈ ਦੇ ਸਵਾਲਾਂ ਲਈ, ਮੈਂ ਡਿਜੀਟਲ ਲਾਕਰ ਵਿੱਚ ਨੁਸਖੇ ਲੱਭਣ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ।",
      general: "ਮੈਂ ਤੁਹਾਡਾ ਸਿਹਤ ਸਹਾਇਕ ਹਾਂ। ਮੈਂ ਨੈਵੀਗੇਸ਼ਨ, ਲੱਛਣ, ਮੁਲਾਕਾਤ ਅਤੇ ਦਵਾਈਆਂ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ।"
    },
    bn: {
      symptoms: "আমি আপনার লক্ষণ বুঝতে সাহায্য করতে পারি। দয়া করে বলুন আপনি কেমন অনুভব করছেন।",
      navigation: "আমি অ্যাপ নেভিগেট করতে সাহায্য করতে পারি। আপনি বলতে পারেন 'রোগী পোর্টালে যাও'।",
      emergency: "এটি জরুরি পরিস্থিতি। আমি আপনাকে তাৎক্ষণিক জরুরি সেবায় পাঠাচ্ছি।",
      appointment: "আমি অ্যাপয়েন্টমেন্ট বুক করতে সাহায্য করতে পারি।",
      medicine: "ওষুধের জিজ্ঞাসার জন্য, আমি ডিজিটাল লকারে প্রেসক্রিপশন খুঁজতে সাহায্য করতে পারি।",
      general: "আমি আপনার স্বাস্থ্য সহায়ক। আমি নেভিগেশন, লক্ষণ, অ্যাপয়েন্টমেন্ট এবং ওষুধে সাহায্য করতে পারি।"
    }
  };

  const langResponses = responses[language] || responses.en;

  // Determine response based on query content with more specific health conditions
  if (query.includes('fever') || query.includes('बुखार') || query.includes('ਬੁਖਾਰ') || query.includes('জ্বর') ||
      query.includes('temperature') || query.includes('तापमान')) {
    return langResponses.fever || langResponses.symptoms;
  } else if (query.includes('headache') || query.includes('सिरदर्द') || query.includes('ਸਿਰ ਦੁਖਦਾ') || query.includes('মাথা ব্যথা') ||
             query.includes('सिर दर्द') || query.includes('head pain')) {
    return langResponses.headache || langResponses.symptoms;
  } else if (query.includes('stomach') || query.includes('पेट') || query.includes('ਪੇਟ') || query.includes('পেট') ||
             query.includes('belly') || query.includes('दर्द') || query.includes('ache')) {
    return langResponses.stomachache || langResponses.symptoms;
  } else if (query.includes('family') || query.includes('परिवार') || query.includes('ਪਰਿਵਾਰ') || query.includes('পরিবার') ||
             query.includes('member') || query.includes('सदस्य')) {
    return langResponses.familyHealth || langResponses.general;
  } else if (query.includes('symptom') || query.includes('लक्षण') || query.includes('ਲੱਛਣ') || query.includes('লক্ষণ') ||
             query.includes('feel') || query.includes('महसूस') || query.includes('pain') || query.includes('दर्द')) {
    return langResponses.symptoms;
  } else if (query.includes('emergency') || query.includes('आपातकाल') || query.includes('ਐਮਰਜੈਂਸੀ') || query.includes('জরুরি') ||
             query.includes('urgent') || query.includes('तत्काल') || query.includes('108')) {
    return langResponses.emergency;
  } else if (query.includes('appointment') || query.includes('अपॉइंटमेंट') || query.includes('token') || query.includes('ਮੁਲਾਕਾਤ') ||
             query.includes('book') || query.includes('बुक') || query.includes('doctor') || query.includes('डॉक्टर')) {
    return langResponses.appointment;
  } else if (query.includes('medicine') || query.includes('दवा') || query.includes('ਦਵਾਈ') || query.includes('ওষুধ') ||
             query.includes('tablet') || query.includes('गोली') || query.includes('pharmacy') || query.includes('फार्मेसी')) {
    return langResponses.medicine;
  } else if (query.includes('navigate') || query.includes('नेविगेट') || query.includes('go to') || query.includes('जाओ') ||
             query.includes('portal') || query.includes('पोर्टल') || query.includes('show') || query.includes('दिखाओ')) {
    return langResponses.navigation;
  } else {
    return langResponses.general;
  }
}

// Offline data synchronization endpoint
app.post("/make-server-54854473/api/sync-offline-data", async (c) => {
  try {
    const { syncQueue, deviceId } = await c.req.json();
    
    console.log(`Processing offline sync for device: ${deviceId}, items: ${syncQueue.length}`);
    
    const syncResults = [];
    
    for (const item of syncQueue) {
      try {
        // Process different types of offline data
        switch (item.action) {
          case 'book_appointment':
            // Simulate appointment booking
            const appointmentId = `server_${item.data.id}`;
            await kv.set(`appointment_${appointmentId}`, {
              ...item.data,
              serverSyncedAt: new Date().toISOString(),
              status: 'confirmed'
            });
            
            syncResults.push({
              localId: item.data.id,
              serverId: appointmentId,
              status: 'success',
              action: item.action
            });
            break;
            
          case 'add_patient':
            // Simulate patient registration
            const patientId = `server_${item.data.id}`;
            await kv.set(`patient_${patientId}`, {
              ...item.data,
              serverSyncedAt: new Date().toISOString(),
              verified: true
            });
            
            syncResults.push({
              localId: item.data.id,
              serverId: patientId,
              status: 'success',
              action: item.action
            });
            break;
            
          case 'save_prescription':
            // Simulate prescription storage
            const prescriptionId = `server_${item.data.id}`;
            await kv.set(`prescription_${prescriptionId}`, {
              ...item.data,
              serverSyncedAt: new Date().toISOString(),
              verified: true
            });
            
            syncResults.push({
              localId: item.data.id,
              serverId: prescriptionId,
              status: 'success',
              action: item.action
            });
            break;
            
          case 'emergency_sos':
            // High priority - emergency processing
            const sosId = `server_${item.data.id}`;
            await kv.set(`emergency_${sosId}`, {
              ...item.data,
              serverSyncedAt: new Date().toISOString(),
              status: 'processed',
              priority: 'high'
            });
            
            syncResults.push({
              localId: item.data.id,
              serverId: sosId,
              status: 'success',
              action: item.action,
              emergencyProcessed: true
            });
            
            console.log(`🚨 Emergency SOS processed: ${sosId}`);
            break;
            
          case 'add_health_record':
            // Simulate health record storage
            const recordId = `server_${item.data.id}`;
            await kv.set(`health_record_${recordId}`, {
              ...item.data,
              serverSyncedAt: new Date().toISOString()
            });
            
            syncResults.push({
              localId: item.data.id,
              serverId: recordId,
              status: 'success',
              action: item.action
            });
            break;
            
          default:
            syncResults.push({
              localId: item.data.id,
              status: 'error',
              action: item.action,
              error: 'Unknown action type'
            });
        }
        
      } catch (error) {
        console.error(`Error syncing item ${item.data.id}:`, error);
        syncResults.push({
          localId: item.data.id,
          status: 'error',
          action: item.action,
          error: error.message
        });
      }
    }
    
    // Store sync log
    await kv.set(`sync_log_${deviceId}_${Date.now()}`, {
      deviceId,
      syncedAt: new Date().toISOString(),
      itemsProcessed: syncQueue.length,
      results: syncResults
    });
    
    return c.json({
      success: true,
      syncResults,
      syncedAt: new Date().toISOString(),
      message: `Successfully processed ${syncResults.filter(r => r.status === 'success').length}/${syncQueue.length} items`
    });
    
  } catch (error) {
    console.error("Offline sync error:", error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

// Get user's offline-synced data
app.get("/make-server-54854473/api/user-data/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');
    
    // Get all user data
    const appointments = await kv.getByPrefix(`appointment_server_patient_${userId}`);
    const prescriptions = await kv.getByPrefix(`prescription_server_patient_${userId}`);
    const healthRecords = await kv.getByPrefix(`health_record_server_patient_${userId}`);
    const emergencies = await kv.getByPrefix(`emergency_server_sos_${userId}`);
    
    return c.json({
      appointments: appointments || [],
      prescriptions: prescriptions || [],
      healthRecords: healthRecords || [],
      emergencies: emergencies || [],
      lastSyncedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error("Error fetching user data:", error);
    return c.json({
      error: error.message
    }, 500);
  }
});

Deno.serve(app.fetch);