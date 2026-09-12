// =======================================================
// VIRASYA - AI Cultural Guide & Lightweight RAG Service
// =======================================================

const https = require('https');
const { findStateData, searchCulturalKnowledge, getLocalData } = require('../models/CulturalData');

const SUPPORTED_STATES = ['Maharashtra', 'Uttarakhand', 'Jharkhand', 'Rajasthan', 'Punjab'];

const STATE_KEYWORDS = {
  maharashtra: ['maharashtra', 'mumbai', 'pune', 'maratha', 'kolhapur', 'ajanta', 'ellora', 'warli', 'paithani', 'lavani', 'ganesh chaturthi'],
  uttarakhand: ['uttarakhand', 'kedarnath', 'badrinath', 'kumaon', 'garhwal', 'himalaya', 'himalayan', 'aipan', 'ringal', 'almora', 'nanda devi', 'choliya'],
  jharkhand: ['jharkhand', 'ranchi', 'dumka', 'deoghar', 'dokra', 'sohrai', 'chhau', 'sarhul', 'santhal', 'birsa munda', 'baidyanath'],
  rajasthan: ['rajasthan', 'jaipur', 'jodhpur', 'udaipur', 'jaisalmer', 'rajput', 'blue pottery', 'bandhani', 'ghoomar', 'kalbelia', 'pushkar', 'dal baati'],
  punjab: ['punjab', 'amritsar', 'golden temple', 'phulkari', 'bhangra', 'giddha', 'baisakhi', 'lohri', 'sikh', 'makki di roti', 'sarson da saag']
};

// -------------------------------------------------------
// 1. State Identification & Pronoun Context Resolution
// -------------------------------------------------------
function identifyState(message, currentStateContext = null, sessionHistory = []) {
  const text = (message || '').toLowerCase();

  // Check explicit state mentions or city/craft keywords
  for (const [stateKey, keywords] of Object.entries(STATE_KEYWORDS)) {
    if (keywords.some(kw => text.includes(kw))) {
      const properName = SUPPORTED_STATES.find(s => s.toLowerCase() === stateKey);
      return properName || stateKey;
    }
  }

  // Deictic pronoun resolution ("here", "this state", "in this region")
  if (/\b(here|this state|this place|this region|locally)\b/i.test(text)) {
    if (currentStateContext && currentStateContext !== 'All') {
      return currentStateContext;
    }
  }

  // Anaphoric pronoun resolution ("there", "that state")
  if (/\b(there|that state|that place)\b/i.test(text)) {
    if (sessionHistory && sessionHistory.length > 0) {
      for (let i = sessionHistory.length - 1; i >= 0; i--) {
        if (sessionHistory[i].state) return sessionHistory[i].state;
      }
    }
    if (currentStateContext && currentStateContext !== 'All') {
      return currentStateContext;
    }
  }

  return currentStateContext && currentStateContext !== 'All' ? currentStateContext : null;
}

// -------------------------------------------------------
// 2. Topic Detection
// -------------------------------------------------------
function identifyTopic(message) {
  const text = (message || '').toLowerCase();

  if (/\b(craft|crafts|art|arts|handicraft|handicrafts|painting|paintings|pottery|textile|saree|weaving|dokra|warli|aipan|phulkari|wood)\b/i.test(text)) {
    return 'Arts & Crafts';
  }
  if (/\b(heritage|temple|temples|monument|monuments|fort|forts|caves|palace|jyotirlinga|shrine)\b/i.test(text)) {
    return 'Heritage';
  }
  if (/\b(festival|festivals|celebration|yatra|mela|diwali|ganesh|baisakhi|sarhul|gangaur|teej|lohri)\b/i.test(text)) {
    return 'Festivals';
  }
  if (/\b(dance|folk dance|lavani|ghoomar|chhau|bhangra|giddha|choliya|music|song|songs|raga)\b/i.test(text)) {
    return 'Dance & Music';
  }
  if (/\b(food|cuisine|dish|dishes|eat|sweet|sweets|delicacy|roti|dal|curry|baati|modak|dhuska)\b/i.test(text)) {
    return 'Cuisine';
  }
  if (/\b(clothing|dress|attire|saree|dupatta|wear|turban|pagari|ornament|jewelry|nath)\b/i.test(text)) {
    return 'Clothing & Attire';
  }
  if (/\b(history|dynasty|king|kingdom|empire|ancient|ruler|shivaji|maratha|maharana|pratap)\b/i.test(text)) {
    return 'History';
  }
  if (/\b(buy|shop|market|marketplace|price|cost|artisan|artisans|store|purchase)\b/i.test(text)) {
    return 'Marketplace';
  }
  if (/\b(tradition|traditions|ritual|rituals|customs)\b/i.test(text)) {
    return 'Traditions';
  }

  return 'Culture';
}

// -------------------------------------------------------
// 3. Smart Action Cards Builder
// -------------------------------------------------------
function generateActionCards(state, topic, queryText, searchResults) {
  const actions = [];
  const queryLower = (queryText || '').toLowerCase();

  // Craft & Marketplace deep linking
  if (searchResults.matchedCrafts && searchResults.matchedCrafts.length > 0) {
    const craft = searchResults.matchedCrafts[0];
    actions.push({
      label: `🎨 Explore ${craft.name}`,
      action: 'explore_craft',
      target: `#crafts`,
      type: 'internal'
    });

    let categoryParam = 'Handicrafts';
    if (/saree|shawl|textile|dupatta|embroidery/i.test(craft.name)) categoryParam = 'Sarees & Textiles';
    else if (/pottery|vase/i.test(craft.name)) categoryParam = 'Pottery';
    else if (/art|painting|canvas/i.test(craft.name)) categoryParam = 'Paintings';
    else if (/wood|carving/i.test(craft.name)) categoryParam = 'Wood Craft';
    else if (/metal|dokra|figurine/i.test(craft.name)) categoryParam = 'Metal Craft';

    actions.push({
      label: `🛍 View ${craft.name.split(' ')[0]} Products`,
      action: 'marketplace',
      target: `marketplace.html?state=${encodeURIComponent(craft.state)}&category=${encodeURIComponent(categoryParam)}&search=${encodeURIComponent(craft.name.split(' ')[0])}`,
      type: 'link'
    });
  } else if (state && (topic === 'Arts & Crafts' || topic === 'Marketplace' || queryLower.includes('craft') || queryLower.includes('buy'))) {
    actions.push({
      label: `🛍 View ${state} Crafts`,
      action: 'marketplace',
      target: `marketplace.html?state=${encodeURIComponent(state)}`,
      type: 'link'
    });
  }

  // State Exploration Linking
  if (state) {
    if (state.toLowerCase() === 'uttarakhand') {
      actions.push({
        label: `🗺 Explore Uttarakhand Page`,
        action: 'state_page',
        target: `uttarakhand.html`,
        type: 'link'
      });
    } else {
      actions.push({
        label: `🗺 Explore ${state}`,
        action: 'explore_state',
        target: `index.html#map`,
        type: 'link'
      });
    }
  }

  // Topic Exploration Links
  if (topic === 'Heritage' && !actions.some(a => a.label.includes('Heritage'))) {
    actions.push({
      label: `🏛 Explore Heritage Sites`,
      action: 'section',
      target: `index.html#heritage`,
      type: 'link'
    });
  } else if (topic === 'Festivals' && !actions.some(a => a.label.includes('Festivals'))) {
    actions.push({
      label: `🎉 Explore Festivals`,
      action: 'section',
      target: `index.html#festivals`,
      type: 'link'
    });
  }

  return actions.slice(0, 3); // Max 3 clean action buttons
}

// -------------------------------------------------------
// 4. External AI Calling via Gemini API (if AI_API_KEY configured)
// -------------------------------------------------------
async function callGeminiAI(systemPrompt, userPrompt, apiKey) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [
            { text: `${systemPrompt}\n\nUser Question: "${userPrompt}"` }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 600
      }
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      port: 443,
      path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 8000
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.candidates && parsed.candidates[0] && parsed.candidates[0].content) {
            const text = parsed.candidates[0].content.parts[0].text;
            return resolve(text.trim());
          }
          if (parsed.error) {
            return reject(new Error(parsed.error.message || 'Gemini API Error'));
          }
          reject(new Error('Invalid Gemini API response structure'));
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('AI API request timed out'));
    });

    req.write(postData);
    req.end();
  });
}

// -------------------------------------------------------
// 5. Conversational Intent Recognizer (Greetings, FAQs, Pleasantries)
// -------------------------------------------------------
function detectConversationalIntent(message, clientState) {
  const text = (message || '').trim().toLowerCase();
  const stripped = text.replace(/^[!?,.\s]+|[!?,.\s]+$/g, '');

  // 1. Pure Greeting: hi, hello, hey, namaste, etc.
  if (/^(hi|hii|hiii|hello|helo|hey|heyy|namaste|namaskar|pranam|vanakkam|salaam|yo|sup|good\s*(morning|afternoon|evening|day))$/i.test(stripped) ||
      /^(hi|hello|hey|namaste)\s+(there|virasya|ai|guide|bot|friend)$/i.test(stripped)) {
    return {
      reply: "Namaste! 🙏 Welcome to **VIRASYA**. I am your AI Cultural Guide.\n\nI can help you explore India's living cultural traditions, ancient monuments, mastercrafts, folk dances, and vibrant festivals across **Maharashtra**, **Uttarakhand**, **Jharkhand**, **Rajasthan**, and **Punjab**.\n\nHow may I assist your cultural journey today?",
      state: clientState || null,
      topic: "Greeting",
      actions: [
        { label: "🪷 Discover Culture", action: "section", target: "index.html#heritage", type: "link" },
        { label: "🎨 Explore Crafts", action: "section", target: "index.html#crafts", type: "link" },
        { label: "🗺 Explore States Map", action: "section", target: "index.html#map", type: "link" }
      ]
    };
  }

  // 2. Well-being / Pleasantries: How are you?
  if (/^(how\s*are\s*(you|u)|how\s*r\s*u|how\s*do\s*you\s*do|how\s*is\s*it\s*going|how's\s*it\s*going|whats\s*up|what's\s*up)$/i.test(stripped) ||
      (/\bhow\s*are\s*(you|u)\b/i.test(text) && !/\b(craft|state|art|temple|food|dance|maharashtra|uttarakhand|jharkhand|rajasthan|punjab)\b/i.test(text))) {
    return {
      reply: "Namaste! 🙏 I am doing wonderfully, delighted to share the timeless heritage, arts, and traditions of India with you!\n\nHow are you doing today? What cultural wonder or regional craft would you like to discover?",
      state: clientState || null,
      topic: "Well-being",
      actions: [
        { label: "🏛 Explore Heritage", action: "section", target: "index.html#heritage", type: "link" },
        { label: "🛍 Artisan Marketplace", action: "marketplace", target: "marketplace.html", type: "link" },
        { label: "🖌 Mandala Simulator", action: "simulator", target: "simulator.html", type: "link" }
      ]
    };
  }

  // 3. Identity / Platform Queries: Who are you? What is Virasya? What can you do?
  if (/^(who\s*are\s*you|what\s*are\s*you|what\s*is\s*virasya|what\s*can\s*you\s*do|tell\s*me\s*about\s*yourself|introduce\s*yourself|about\s*virasya|what\s*is\s*this\s*(website|app|platform)?)$/i.test(stripped) ||
      /\b(who\s*are\s*you|what\s*can\s*you\s*do|what\s*is\s*virasya)\b/i.test(text)) {
    return {
      reply: "I am the **VIRASYA AI Cultural Guide**! 🪷\n\n**VIRASYA** (विरास्य) is a digital portal dedicated to celebrating, preserving, and exploring India's living cultural legacy, indigenous arts, and artisanal treasures.\n\n**Here is what you can do on VIRASYA:**\n• **🏛 Explore State Heritage:** Learn about the history, monuments, dance, and cuisine of Indian states.\n• **🎨 Discover Mastercrafts:** Dive into GI-tagged crafts like Warli, Aipan, Dokra metal art, Blue Pottery, and Phulkari.\n• **🛍 Artisan Marketplace:** Discover and support genuine handmade products directly from traditional artisans.\n• **🖌 Mandala Art Studio:** Create sacred geometric patterns and radial symmetric art in our digital simulator.\n\nWhere would you like to begin?",
      state: clientState || null,
      topic: "About",
      actions: [
        { label: "🗺 Discover States", action: "map", target: "index.html#map", type: "link" },
        { label: "🛍 Visit Marketplace", action: "marketplace", target: "marketplace.html", type: "link" },
        { label: "🖌 Open Art Studio", action: "simulator", target: "simulator.html", type: "link" }
      ]
    };
  }

  // 4. "What" Queries (e.g. "what", "what?")
  if (/^what\??$/i.test(stripped)) {
    return {
      reply: "You can ask me questions about India's culture and heritage, such as:\n\n• *'What is Warli painting?'*\n• *'What are the famous monuments in Uttarakhand?'*\n• *'What is Dokra metal casting?'*\n• *'What traditional sweets are famous in Maharashtra?'*\n• *'What is the history of the Maratha Empire?'*\n\nTry asking any question above or click a suggestion below!",
      state: clientState || null,
      topic: "Help",
      actions: [
        { label: "🎨 Explore Crafts", action: "crafts", target: "index.html#crafts", type: "link" },
        { label: "🏛 Explore Heritage", action: "heritage", target: "index.html#heritage", type: "link" },
        { label: "🎉 Explore Festivals", action: "festivals", target: "index.html#festivals", type: "link" }
      ]
    };
  }

  // 5. "How" / "How to use" / "How does this work"
  if (/^(how|how\?|how\s*does\s*(this|it|virasya)\s*work|how\s*to\s*use|how\s*to\s*navigate|how\s*to\s*buy|help|help\s*me)$/i.test(stripped)) {
    return {
      reply: "**How to experience VIRASYA:**\n\n1. **🗺 Discover States:** Click on any highlighted state on the interactive map on the homepage to explore its regional heritage, art, and traditions.\n2. **🎨 Explore Mastercrafts:** Browse authentic crafts, origin history, and traditional materials.\n3. **🛍 Shop Authentic Crafts:** Visit the **Market Place** to support master artisans across India.\n4. **🖌 Create Art:** Open the **Simulator** to draw symmetrical mandalas and sacred motifs on digital canvas.\n5. **🪷 Ask Me Anytime:** Type any cultural query in this chat window!\n\nWhat would you like to explore first?",
      state: clientState || null,
      topic: "Help",
      actions: [
        { label: "🗺 Interactive Map", action: "map", target: "index.html#map", type: "link" },
        { label: "🛍 Market Place", action: "marketplace", target: "marketplace.html", type: "link" },
        { label: "🖌 Mandala Simulator", action: "simulator", target: "simulator.html", type: "link" }
      ]
    };
  }

  // 6. Gratitude / Appreciation: Thank you, Thanks, etc.
  if (/^(thank\s*you|thanks|thanku|thx|dhanyavad|shukriya|awesome|amazing|great|superb|nice|wonderful|cool|good\s*job|well\s*done)$/i.test(stripped)) {
    return {
      reply: "You are most welcome! 🙏 It is an absolute joy sharing India's rich cultural legacy with you. Let me know if you would like to explore another craft, monument, festival, or state!",
      state: clientState || null,
      topic: "Gratitude",
      actions: [
        { label: "🎨 Explore More Crafts", action: "crafts", target: "index.html#crafts", type: "link" },
        { label: "🏛 Discover Heritage", action: "heritage", target: "index.html#heritage", type: "link" }
      ]
    };
  }

  // 7. Farewell: Bye, Goodbye, etc.
  if (/^(bye|goodbye|see\s*you|cya|alvida|good\s*night|shubh\s*ratri)$/i.test(stripped)) {
    return {
      reply: "Shubh Yatra & Farewell! 🙏 May the timeless arts, sacred traditions, and vibrant culture of India continue to inspire you. Feel free to return anytime to discover more heritage treasures.",
      state: clientState || null,
      topic: "Farewell",
      actions: [
        { label: "🪷 Return to Home", action: "home", target: "index.html#home", type: "link" }
      ]
    };
  }

  return null;
}

// -------------------------------------------------------
// 6. High-Precision Deterministic Cultural Synthesis Engine
// -------------------------------------------------------
function synthesizeCulturalResponse(userMessage, state, topic, searchResults) {
  const queryLower = (userMessage || '').toLowerCase();

  // 1. Specific Arts & Crafts Match
  if (searchResults.matchedCrafts.length > 0) {
    const craft = searchResults.matchedCrafts[0];
    return `**${craft.name}** is a revered traditional art form hailing from **${craft.state}** (${craft.region || 'India'}).\n\n${craft.description}\n\n• **Traditional Materials:** ${craft.materials || 'Indigenous natural elements'}\n• **Cultural Significance:** Preserved by generational artisan communities, it reflects the deep spiritual and daily relationship between humans and nature.`;
  }

  // 2. Specific Heritage Site Match
  if (searchResults.matchedHeritage.length > 0) {
    const site = searchResults.matchedHeritage[0];
    return `**${site.name}** is one of the most sacred and historically significant architectural marvels of **${site.state}** (${site.location}).\n\n${site.description}\n\nThis monument stands as a timeless testament to India's master craftsmanship and profound spiritual legacy.`;
  }

  // 3. Specific Festival Match
  if (searchResults.matchedFestivals.length > 0) {
    const festival = searchResults.matchedFestivals[0];
    return `**${festival.name}** is a monumental celebration in **${festival.state}**.\n\n${festival.description}\n\n• **Significance:** ${festival.significance}`;
  }

  // 4. Specific Culture / Food / Dance / Clothing Match
  if (searchResults.matchedCulture.length > 0) {
    const items = searchResults.matchedCulture;
    const cat = items[0].category.toUpperCase();
    const listFormatted = items.map(i => `• **${i.detail}**`).join('\n');
    return `In **${items[0].state}**, the **${cat}** tradition is exceptionally vibrant:\n\n${listFormatted}\n\nThese heritage practices have been lovingly passed down through centuries of cultural lineage.`;
  }

  // 5. State Overview / General State Query
  if (searchResults.generalInfo) {
    const s = searchResults.generalInfo;
    const craftNames = (s.artsAndCrafts || []).map(c => c.name).join(', ');
    const heritageNames = (s.heritage || []).map(h => h.name).join(', ');
    const festivalNames = (s.festivals || []).map(f => f.name).join(', ');
    const dances = (s.culture?.dance || []).join(', ');
    const foods = (s.culture?.food || []).join(', ');

    if (topic === 'Arts & Crafts' || queryLower.includes('craft') || queryLower.includes('handicraft')) {
      return `**${s.state}** is internationally celebrated for its indigenous mastercrafts:\n\n` +
        (s.artsAndCrafts || []).map(c => `• **${c.name}:** ${c.description}`).join('\n\n');
    }

    if (topic === 'Dance & Music' || queryLower.includes('dance')) {
      return `The traditional folk dances and performing arts of **${s.state}** include:\n\n` +
        (s.culture?.dance || []).map(d => `• **${d}**`).join('\n') +
        `\n\nAccompanied by traditional melodies and sacred percussion beats.`;
    }

    if (topic === 'Cuisine' || queryLower.includes('food')) {
      return `The culinary heritage of **${s.state}** features time-honored delicacies:\n\n` +
        (s.culture?.food || []).map(f => `• **${f}**`).join('\n');
    }

    return `**${s.state}** possesses a profound cultural and historical legacy in India:\n\n` +
      `• **Traditional Arts & Crafts:** ${craftNames || 'Regional folk crafts'}\n` +
      `• **Sacred Heritage & Monuments:** ${heritageNames || 'Historical temples and forts'}\n` +
      `• **Festivals:** ${festivalNames || 'Seasonal celebrations'}\n` +
      `• **Folk Dances:** ${dances || 'Regional dance traditions'}\n` +
      `• **Iconic Cuisine:** ${foods || 'Traditional delicacies'}\n\n` +
      `Would you like to explore a specific handicraft, heritage monument, or festival of ${s.state}?`;
  }

  // 6. Generic Knowledge Fallback
  return `I don't have enough verified information about that topic in the VIRASYA knowledge base yet. You can ask me about the culture, history, heritage sites, festivals, or traditional handicrafts of **Maharashtra**, **Uttarakhand**, **Jharkhand**, **Rajasthan**, or **Punjab**!`;
}

// -------------------------------------------------------
// 7. Main Process Chat Query (RAG Entrypoint)
// -------------------------------------------------------
async function processChatQuery({ message, state: clientState, history = [] }) {
  if (!message || !message.trim()) {
    return {
      reply: "Namaste! 🙏 Please ask me a question about India's culture, heritage, arts, crafts, or festivals.",
      state: clientState || null,
      topic: "General",
      actions: []
    };
  }

  // Step 0: Check Conversational Intent (Greetings, Small Talk, FAQs)
  const conversationalMatch = detectConversationalIntent(message, clientState);
  if (conversationalMatch) {
    return conversationalMatch;
  }

  // Step 1: Detect State (with pronoun resolution)
  const identifiedState = identifyState(message, clientState, history);

  // Step 2: Detect Topic
  const identifiedTopic = identifyTopic(message);

  // Step 3: Search Verified VIRASYA Knowledge Base
  const searchResults = await searchCulturalKnowledge(message, identifiedState);

  // Step 4: Generate Smart Action Cards
  const actionCards = generateActionCards(identifiedState, identifiedTopic, message, searchResults);

  // Step 5: AI Response Generation
  const apiKey = process.env.AI_API_KEY || process.env.GEMINI_API_KEY;
  let replyText = null;

  if (apiKey && apiKey.trim() && apiKey !== 'your_gemini_api_key_here' && apiKey !== 'your_api_key_here') {
    try {
      const systemPrompt = `You are "VIRASYA AI GUIDE", a warm, wise, and scholarly cultural guide for the VIRASYA Indian Heritage Platform.
Your goal is to provide accurate, engaging, and culturally respectful answers regarding India's history, heritage monuments, festivals, folk traditions, arts, crafts, and artisans.

RULES:
1. Greet courteously when appropriate (e.g. "Namaste! 🙏").
2. Prioritize and stick strictly to the following verified VIRASYA database facts:
--- VERIFIED VIRASYA KNOWLEDGE BASE CONTEXT ---
${JSON.stringify(searchResults, null, 2)}
-----------------------------------------------
3. If the user asks about a state or topic not found in verified data, state respectfully: "I don't have enough verified information about that topic in the VIRASYA knowledge base yet."
4. Format response cleanly using Markdown bullet points and bold headers. Keep it concise, engaging, and readable for web users (100-250 words max).
5. Current State Context: ${identifiedState || 'All India'}. Current Topic: ${identifiedTopic}.`;

      replyText = await callGeminiAI(systemPrompt, message, apiKey.trim());
    } catch (err) {
      console.warn('Gemini API call failed, falling back to local deterministic RAG:', err.message);
    }
  }

  // Fallback to high-precision RAG synthesis if AI key not present or call failed
  if (!replyText) {
    replyText = synthesizeCulturalResponse(message, identifiedState, identifiedTopic, searchResults);
  }

  return {
    reply: replyText,
    state: identifiedState,
    topic: identifiedTopic,
    actions: actionCards
  };
}

module.exports = {
  processChatQuery,
  identifyState,
  identifyTopic,
  SUPPORTED_STATES
};
