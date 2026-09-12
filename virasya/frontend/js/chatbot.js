// =======================================================
// VIRASYA AI GUIDE — Frontend Cultural Chatbot Controller
// Resilient Multi-Tier Engine (Local RAG + Live Server + Node API)
// =======================================================

(function () {
  'use strict';

  // Supported States & Fast Keyword Mappings
  const SUPPORTED_STATES = ['Maharashtra', 'Uttarakhand', 'Jharkhand', 'Rajasthan', 'Punjab'];

  const STATE_KEYWORDS = {
    maharashtra: ['maharashtra', 'mumbai', 'pune', 'maratha', 'kolhapur', 'ajanta', 'ellora', 'warli', 'paithani', 'lavani', 'ganesh chaturthi'],
    uttarakhand: ['uttarakhand', 'kedarnath', 'badrinath', 'kumaon', 'garhwal', 'himalaya', 'himalayan', 'aipan', 'ringal', 'almora', 'nanda devi', 'choliya'],
    jharkhand: ['jharkhand', 'ranchi', 'dumka', 'deoghar', 'dokra', 'sohrai', 'chhau', 'sarhul', 'santhal', 'birsa munda', 'baidyanath'],
    rajasthan: ['rajasthan', 'jaipur', 'jodhpur', 'udaipur', 'jaisalmer', 'rajput', 'blue pottery', 'bandhani', 'ghoomar', 'kalbelia', 'pushkar', 'dal baati'],
    punjab: ['punjab', 'amritsar', 'golden temple', 'phulkari', 'bhangra', 'giddha', 'baisakhi', 'lohri', 'sikh', 'makki di roti', 'sarson da saag']
  };

  // Embedded Cultural Fallback Knowledge (Guarantees zero downtime)
  const CLIENT_KNOWLEDGE = {
    maharashtra: {
      state: "Maharashtra",
      crafts: [
        { name: "Warli Tribal Art", desc: "Prehistoric indigenous tribal painting using white rice paste on ochre mud walls depicting sacred geometric dances and daily farming life.", mat: "Rice paste, red mud, bamboo twigs", cat: "Paintings" },
        { name: "Paithani Silk Sarees", desc: "Royal handloom silk sarees from Paithan featuring pure gold/silver zari peacock motifs.", mat: "Mulberry silk, pure metallic zari", cat: "Sarees & Textiles" },
        { name: "Kolhapuri Chappals", desc: "Handcrafted vegetable-tanned leather footwear with intricate cord braiding.", mat: "Vegetable-tanned leather", cat: "Handicrafts" }
      ],
      heritage: [
        { name: "Ajanta & Ellora Caves", desc: "UNESCO World Heritage rock-cut cave temples featuring ancient Buddhist murals and the monolithic Kailasa Temple.", loc: "Chhatrapati Sambhajinagar" },
        { name: "Raigad Fort", desc: "The sovereign capital fortress of the Maratha Empire under Chhatrapati Shivaji Maharaj.", loc: "Raigad" }
      ],
      festivals: ["Ganesh Chaturthi (10-day grand festival of Lord Ganesha)", "Gudhi Padwa (Marathi New Year)", "Palkhi Festival"],
      dances: ["Lavani", "Koli Dance", "Lezim", "Dhangari Gaja"],
      cuisine: ["Puran Poli", "Misal Pav", "Vada Pav", "Modak", "Pithla Bhakri"]
    },
    uttarakhand: {
      state: "Uttarakhand",
      crafts: [
        { name: "Aipan Ritual Art", desc: "Sacred ritual floor and wall art practiced by Kumaoni women using natural red clay (Geru) and white rice paste (Biswar) to invoke divine blessings.", mat: "Geru (red ochre clay), Biswar (ground rice paste)", cat: "Paintings" },
        { name: "Ringal Bamboo Weaving", desc: "Eco-friendly weaving of hill bamboo into durable baskets, mats, and utility artifacts.", mat: "Arundinaria falcata (Ringal dwarf bamboo)", cat: "Handicrafts" },
        { name: "Kumaoni Wood Carving", desc: "Intricate floral and mythological carvings adorning traditional Himalayan wooden doorframes (Kholi) and windows.", mat: "Tun and Deodar seasoned timber", cat: "Wood Craft" }
      ],
      heritage: [
        { name: "Kedarnath & Badrinath (Char Dham)", desc: "Sacred Himalayan pilgrimage shrines dating to the 8th-century Adi Shankaracharya in Garhwal.", loc: "Rudraprayag & Chamoli" },
        { name: "Jageshwar Dham", desc: "Cluster of 124 ancient 7th-12th century stone temples nestled in deodar forests.", loc: "Almora" }
      ],
      festivals: ["Nanda Devi Raj Jat (Himalayan pilgrimage yatra)", "Kumaoni Holi", "Phool Dei (Spring flower festival)", "Harela"],
      dances: ["Choliya (Heroic sword dance)", "Jhora", "Chhapeli", "Pandav Nritya"],
      cuisine: ["Kafuli (Spinach & fenugreek gravy)", "Chainsoo", "Bhatt ki Churkani", "Bal Mithai", "Singori"]
    },
    jharkhand: {
      state: "Jharkhand",
      crafts: [
        { name: "Dokra Lost-Wax Metal Casting", desc: "4,000-year-old non-ferrous bell metal casting technique depicting tribal deities, elephants, and village musicians.", mat: "Brass, bell metal, beeswax, clay core", cat: "Metal Craft" },
        { name: "Sohrai & Khovar Murals", desc: "Indigenous ritual wall murals painted with natural earth pigments celebrating cattle, fertility, and harvest.", mat: "Natural red, yellow, white, and black earth clays", cat: "Paintings" }
      ],
      heritage: [
        { name: "Baidyanath Jyotirlinga Temple", desc: "Ancient sacred Jyotirlinga and Shakti Peeth pilgrimage sanctuary in Deoghar.", loc: "Deoghar" },
        { name: "Terracotta Temples of Maluti", desc: "72 surviving 17th-century terracotta temples depicting scenes from the Ramayana and Mahabharata.", loc: "Dumka" }
      ],
      festivals: ["Sarhul (Worship of the blooming Sal tree)", "Karam Festival", "Sohrai Harvest Festival"],
      dances: ["Chhau Dance (Martial masked dance)", "Jhumair", "Paika (Warrior sword dance)", "Domkach"],
      cuisine: ["Dhuska with Ghugni", "Litti Chokha", "Pithe", "Rugra (Wild earthy mushrooms)", "Thekua"]
    },
    rajasthan: {
      state: "Rajasthan",
      crafts: [
        { name: "Jaipur Blue Pottery", desc: "Glazed turquoise pottery made with quartz stone, glass, and Multani Mitti without traditional clay.", mat: "Quartz stone powder, Fuller's earth, natural cobalt glaze", cat: "Pottery" },
        { name: "Bandhani & Leheriya Tie-Dye", desc: "Vibrant resist-dyed textiles creating intricate dots and wave patterns.", mat: "Natural silk, cotton, natural dyes", cat: "Sarees & Textiles" },
        { name: "Rajasthani Miniature Paintings", desc: "Detailed royal miniature court art created with single-hair squirrel brushes and stone pigments.", mat: "Handmade Wasli paper, natural mineral pigments", cat: "Paintings" }
      ],
      heritage: [
        { name: "Amer Fort & Palace", desc: "UNESCO World Heritage hillside fortress known for its artistic Hindu elements and Sheesh Mahal mirror palace.", loc: "Jaipur" },
        { name: "Mehrangarh Fort", desc: "Colossal 15th-century cliff-top fortress towering 400 feet above the Blue City.", loc: "Jodhpur" }
      ],
      festivals: ["Pushkar Camel Fair", "Desert Festival Jaisalmer", "Teej & Gangaur", "Marwar Festival"],
      dances: ["Ghoomar", "Kalbelia (Snake charmer dance)", "Bhavai (Pot balancing)", "Chari Dance"],
      cuisine: ["Dal Baati Churma", "Gatte ki Sabzi", "Ker Sangri", "Laal Maas", "Ghevar"]
    },
    punjab: {
      state: "Punjab",
      crafts: [
        { name: "Phulkari Embroidery", desc: "Celebratory floral embroidery using untwisted silk floss (Pat) on coarse handspun cotton (Khaddar).", mat: "Silk floss (Pat), Khaddar cotton", cat: "Sarees & Textiles" },
        { name: "Punjabi Jutti", desc: "Hand-stitched leather footwear embellished with golden Zari, silk threads, and pearls.", mat: "Pure leather, brass zari, silk embroidery", cat: "Handicrafts" }
      ],
      heritage: [
        { name: "Sri Harmandir Sahib (Golden Temple)", desc: "Spiritual epicenter of Sikhism covered in gilded gold foil surrounding the Amrit Sarovar sacred pool.", loc: "Amritsar" },
        { name: "Qila Mubarak", desc: "Historical fort standing since 90-110 CE where Razia Sultan was held.", loc: "Bathinda" }
      ],
      festivals: ["Baisakhi (Harvest and Khalsa founding celebration)", "Lohri (Winter bonfire festival)", "Hola Mohalla"],
      dances: ["Bhangra", "Giddha", "Sammi", "Jhumar"],
      cuisine: ["Makki di Roti & Sarson da Saag", "Amritsari Kulcha", "Dal Makhani", "Pinni", "Lassi"]
    }
  };

  // 1. Detect Current State from Page Context
  function detectCurrentPageState() {
    if (window.VIRASYA_CURRENT_STATE) {
      return window.VIRASYA_CURRENT_STATE;
    }
    const path = window.location.pathname.toLowerCase();
    if (path.includes('uttarakhand')) return 'Uttarakhand';
    if (path.includes('maharashtra')) return 'Maharashtra';
    if (path.includes('jharkhand')) return 'Jharkhand';
    if (path.includes('rajasthan')) return 'Rajasthan';
    if (path.includes('punjab')) return 'Punjab';

    const stateSelect = document.getElementById('stateSelect');
    if (stateSelect && stateSelect.value && stateSelect.value !== 'All') {
      return stateSelect.value;
    }
    return null;
  }

  let currentStateContext = detectCurrentPageState();
  let conversationHistory = [];
  let isAwaitingResponse = false;

  // 2. State & Topic Detection
  function identifyState(message, currentCtx) {
    const text = (message || '').toLowerCase();
    for (const [stateKey, keywords] of Object.entries(STATE_KEYWORDS)) {
      if (keywords.some(kw => text.includes(kw))) {
        const proper = SUPPORTED_STATES.find(s => s.toLowerCase() === stateKey);
        return proper || stateKey;
      }
    }
    if (/\b(here|this state|this place|this region|locally)\b/i.test(text)) {
      if (currentCtx && currentCtx !== 'All') return currentCtx;
    }
    return currentCtx && currentCtx !== 'All' ? currentCtx : null;
  }

  function identifyTopic(message) {
    const text = (message || '').toLowerCase();
    if (/\b(craft|crafts|art|arts|handicraft|handicrafts|painting|paintings|pottery|textile|saree|weaving|dokra|warli|aipan|phulkari|wood)\b/i.test(text)) return 'Arts & Crafts';
    if (/\b(heritage|temple|temples|monument|monuments|fort|forts|caves|palace|jyotirlinga|shrine)\b/i.test(text)) return 'Heritage';
    if (/\b(festival|festivals|celebration|yatra|mela|diwali|ganesh|baisakhi|sarhul|gangaur|teej|lohri)\b/i.test(text)) return 'Festivals';
    if (/\b(dance|folk dance|lavani|ghoomar|chhau|bhangra|giddha|choliya|music|song)\b/i.test(text)) return 'Dance & Music';
    if (/\b(food|cuisine|dish|dishes|eat|sweet|sweets|delicacy|roti|dal|curry|baati|modak|dhuska)\b/i.test(text)) return 'Cuisine';
    if (/\b(clothing|dress|attire|saree|dupatta|wear|turban|pagari|ornament|jewelry)\b/i.test(text)) return 'Clothing & Attire';
    if (/\b(buy|shop|market|marketplace|price|cost|artisan|store|purchase)\b/i.test(text)) return 'Marketplace';
    return 'Culture';
  }

  // 3. Conversational Intent Recognizer (Greetings, FAQs, Pleasantries)
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
          { label: "🪷 Discover Culture", target: "index.html#heritage", type: "link" },
          { label: "🎨 Explore Crafts", target: "index.html#crafts", type: "link" },
          { label: "🗺 Explore States Map", target: "index.html#map", type: "link" }
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
          { label: "🏛 Explore Heritage", target: "index.html#heritage", type: "link" },
          { label: "🛍 Artisan Marketplace", target: "marketplace.html", type: "link" },
          { label: "🖌 Mandala Simulator", target: "simulator.html", type: "link" }
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
          { label: "🗺 Discover States", target: "index.html#map", type: "link" },
          { label: "🛍 Visit Marketplace", target: "marketplace.html", type: "link" },
          { label: "🖌 Open Art Studio", target: "simulator.html", type: "link" }
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
          { label: "🎨 Explore Crafts", target: "index.html#crafts", type: "link" },
          { label: "🏛 Explore Heritage", target: "index.html#heritage", type: "link" },
          { label: "🎉 Explore Festivals", target: "index.html#festivals", type: "link" }
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
          { label: "🗺 Interactive Map", target: "index.html#map", type: "link" },
          { label: "🛍 Market Place", target: "marketplace.html", type: "link" },
          { label: "🖌 Mandala Simulator", target: "simulator.html", type: "link" }
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
          { label: "🎨 Explore More Crafts", target: "index.html#crafts", type: "link" },
          { label: "🏛 Discover Heritage", target: "index.html#heritage", type: "link" }
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
          { label: "🪷 Return to Home", target: "index.html#home", type: "link" }
        ]
      };
    }

    return null;
  }

  // 4. Client-side Fallback Response Generator
  function generateLocalCulturalResponse(userMsg, state, topic) {
    const conversational = detectConversationalIntent(userMsg, state);
    if (conversational) return conversational;

    const query = (userMsg || '').toLowerCase();
    const targetState = state ? state.toLowerCase() : null;
    const stateObj = targetState && CLIENT_KNOWLEDGE[targetState] ? CLIENT_KNOWLEDGE[targetState] : null;

    const actions = [];

    // Search for specific craft
    for (const [stKey, data] of Object.entries(CLIENT_KNOWLEDGE)) {
      for (const craft of data.crafts) {
        if (query.includes(craft.name.toLowerCase()) || craft.name.toLowerCase().split(' ').some(w => w.length > 3 && query.includes(w))) {
          actions.push({ label: `🎨 Explore ${craft.name}`, target: `#crafts`, type: `internal` });
          actions.push({ label: `🛍 View in Marketplace`, target: `marketplace.html?state=${encodeURIComponent(data.state)}&category=${encodeURIComponent(craft.cat)}&search=${encodeURIComponent(craft.name.split(' ')[0])}`, type: `link` });
          if (data.state.toLowerCase() === 'uttarakhand') actions.push({ label: `🗺 Explore Uttarakhand`, target: `uttarakhand.html`, type: `link` });
          else actions.push({ label: `🗺 Explore ${data.state}`, target: `index.html#map`, type: `link` });

          return {
            reply: `**${craft.name}** is a revered mastercraft from **${data.state}**.\n\n${craft.desc}\n\n• **Traditional Materials:** ${craft.mat}\n• **Cultural Value:** Lovingly preserved by generational artisan families and vital to India's living cultural heritage.`,
            state: data.state,
            topic: 'Arts & Crafts',
            actions
          };
        }
      }
    }

    // Search for specific heritage site
    for (const [stKey, data] of Object.entries(CLIENT_KNOWLEDGE)) {
      for (const site of data.heritage) {
        if (query.includes(site.name.toLowerCase()) || site.name.toLowerCase().split(' ').some(w => w.length > 4 && query.includes(w))) {
          actions.push({ label: `🏛 Explore Heritage Sites`, target: `index.html#heritage`, type: `link` });
          actions.push({ label: `🗺 Discover ${data.state}`, target: `index.html#map`, type: `link` });

          return {
            reply: `**${site.name}** is one of the most sacred and historic landmarks of **${data.state}** (${site.loc}).\n\n${site.desc}\n\nThis monument stands as a timeless testament to India's master craftsmanship and profound spiritual legacy.`,
            state: data.state,
            topic: 'Heritage',
            actions
          };
        }
      }
    }

    // State Overview or Category Query
    if (stateObj) {
      if (dataStateMatches(dataStateMatches)) { }
      if (topic === 'Arts & Crafts' || query.includes('craft') || query.includes('art')) {
        actions.push({ label: `🛍 View ${stateObj.state} Crafts`, target: `marketplace.html?state=${encodeURIComponent(stateObj.state)}`, type: 'link' });
        actions.push({ label: `🗺 Explore ${stateObj.state}`, target: stateObj.state === 'Uttarakhand' ? 'uttarakhand.html' : 'index.html#map', type: 'link' });
        const list = stateObj.crafts.map(c => `• **${c.name}:** ${c.desc}`).join('\n\n');
        return {
          reply: `**${stateObj.state}** is internationally renowned for its traditional handicrafts:\n\n${list}`,
          state: stateObj.state,
          topic: 'Arts & Crafts',
          actions
        };
      }

      if (topic === 'Heritage' || query.includes('heritage') || query.includes('temple') || query.includes('fort')) {
        actions.push({ label: `🏛 View Heritage Sites`, target: `index.html#heritage`, type: 'link' });
        const list = stateObj.heritage.map(h => `• **${h.name} (${h.loc}):** ${h.desc}`).join('\n\n');
        return {
          reply: `Here are iconic heritage monuments and sacred sanctuaries in **${stateObj.state}**:\n\n${list}`,
          state: stateObj.state,
          topic: 'Heritage',
          actions
        };
      }

      if (topic === 'Festivals' || query.includes('festival')) {
        actions.push({ label: `🎉 Explore Festivals`, target: `index.html#festivals`, type: 'link' });
        const list = stateObj.festivals.map(f => `• **${f}**`).join('\n');
        return {
          reply: `Major cultural and religious festivals celebrated in **${stateObj.state}**:\n\n${list}`,
          state: stateObj.state,
          topic: 'Festivals',
          actions
        };
      }

      if (topic === 'Dance & Music' || query.includes('dance')) {
        const list = stateObj.dances.map(d => `• **${d}**`).join('\n');
        return {
          reply: `Folk dance and performing arts of **${stateObj.state}**:\n\n${list}`,
          state: stateObj.state,
          topic: 'Dance & Music',
          actions: [{ label: `🗺 Discover ${stateObj.state}`, target: `index.html#map`, type: 'link' }]
        };
      }

      if (topic === 'Cuisine' || query.includes('food')) {
        const list = stateObj.cuisine.map(c => `• **${c}**`).join('\n');
        return {
          reply: `Traditional culinary delicacies of **${stateObj.state}**:\n\n${list}`,
          state: stateObj.state,
          topic: 'Cuisine',
          actions: [{ label: `🗺 Discover ${stateObj.state}`, target: `index.html#map`, type: 'link' }]
        };
      }

      // General State
      actions.push({ label: `🛍 Explore Marketplace`, target: `marketplace.html?state=${encodeURIComponent(stateObj.state)}`, type: 'link' });
      actions.push({ label: `🗺 Discover State`, target: stateObj.state === 'Uttarakhand' ? 'uttarakhand.html' : 'index.html#map', type: 'link' });
      return {
        reply: `**${stateObj.state}** boasts a vibrant cultural heritage in India:\n\n• **Iconic Crafts:** ${stateObj.crafts.map(c => c.name).join(', ')}\n• **Sacred Heritage:** ${stateObj.heritage.map(h => h.name).join(', ')}\n• **Festivals:** ${stateObj.festivals.join(', ')}\n• **Folk Dances:** ${stateObj.dances.join(', ')}\n• **Cuisine:** ${stateObj.cuisine.join(', ')}\n\nWhat specific craft, monument, or tradition would you like to explore?`,
        state: stateObj.state,
        topic: 'Culture',
        actions
      };
    }

    // General India response
    actions.push({ label: `🏛 Explore Heritage`, target: `index.html#heritage`, type: 'link' });
    actions.push({ label: `🛍 Visit Marketplace`, target: `marketplace.html`, type: 'link' });
    actions.push({ label: `🗺 Discover States`, target: `index.html#map`, type: 'link' });

    return {
      reply: `**India's Cultural Heritage** is a rich tapestry woven from millennia of sacred traditions, artisanal excellence, and diverse folk expressions.\n\n• **Traditional Arts:** Warli, Aipan, Dokra metal craft, Blue Pottery, and Phulkari embroidery.\n• **Sacred Monuments:** Himalayan shrines, Ajanta-Ellora caves, and desert hill fortresses.\n• **Living Traditions:** Seasonal harvest melas, classical and folk dances, and sacred temple rituals.\n\nAsk me about **Maharashtra**, **Uttarakhand**, **Jharkhand**, **Rajasthan**, or **Punjab**!`,
      state: null,
      topic: 'General',
      actions
    };
  }

  function dataStateMatches() { return false; }

  // 4. Mount Chatbot UI Component
  function mountChatbotUI() {
    if (document.getElementById('virasyaChatFloat')) return;

    // Floating Lotus Button
    const floatBtn = document.createElement('button');
    floatBtn.id = 'virasyaChatFloat';
    floatBtn.className = 'virasya-chat-float';
    floatBtn.setAttribute('aria-label', 'Open VIRASYA AI Guide');
    floatBtn.setAttribute('title', 'Chat with VIRASYA AI Cultural Guide');
    floatBtn.innerHTML = `
      <div class="chat-badge-pulse"></div>
      <span>🪷</span>
    `;
    document.body.appendChild(floatBtn);

    // Chat Panel Modal
    const chatPanel = document.createElement('div');
    chatPanel.id = 'virasyaChatPanel';
    chatPanel.className = 'virasya-chat-panel';
    chatPanel.innerHTML = `
      <div class="vir-chat-header">
        <div class="vir-header-title">
          <div class="vir-header-icon">🪷</div>
          <div class="vir-header-text">
            <h3>VIRASYA AI GUIDE</h3>
            <span>Your guide to India's culture & heritage</span>
          </div>
        </div>
        <div class="vir-header-actions">
          <button class="vir-icon-btn" id="virResetBtn" title="New Chat">🔄</button>
          <button class="vir-icon-btn" id="virMinimizeBtn" title="Minimize">─</button>
          <button class="vir-icon-btn" id="virCloseBtn" title="Close">✕</button>
        </div>
      </div>

      <div class="vir-state-banner" id="virStateBanner">
        <div>Context: <span id="virActiveStateLabel">${currentStateContext || 'All India'}</span></div>
        <div style="font-size: 9px; opacity: 0.8; color: #8C3E07;">Cultural AI Online</div>
      </div>

      <div class="vir-chat-body" id="virChatBody">
        <div class="vir-msg bot">
          <div class="vir-bubble">
            <p><strong>Namaste! 🙏</strong><br>I am your <strong>VIRASYA AI Cultural Guide</strong>.</p>
            <p>Ask me anything about India's culture, heritage, history, festivals, traditional arts, crafts, and regional artisans.</p>
          </div>
          <div class="vir-suggestions-wrap">
            <button class="vir-chip" data-query="Tell me about the culture of India">🪷 Discover Culture</button>
            <button class="vir-chip" data-query="What are famous Indian heritage sites?">🏛 Explore Heritage</button>
            <button class="vir-chip" data-query="Which major festivals are celebrated in India?">🎉 Explore Festivals</button>
            <button class="vir-chip" data-query="Tell me about traditional arts and crafts">🎨 Arts & Crafts</button>
            <button class="vir-chip" data-query="What crafts are famous in Uttarakhand?">🏔 Uttarakhand Crafts</button>
            <button class="vir-chip" data-query="Tell me about Warli painting">🖼 Warli Painting</button>
          </div>
        </div>
      </div>

      <form class="vir-chat-footer" id="virChatForm">
        <input type="text" id="virChatInput" class="vir-input-box" placeholder="Ask about India's culture, crafts, heritage..." autocomplete="off">
        <button type="submit" class="vir-send-btn" title="Send Question" aria-label="Send">
          ➤
        </button>
      </form>
    `;
    document.body.appendChild(chatPanel);

    // Attach Event Listeners
    floatBtn.addEventListener('click', toggleChatPanel);
    document.getElementById('virResetBtn').addEventListener('click', resetChat);
    document.getElementById('virMinimizeBtn').addEventListener('click', toggleMinimize);
    document.getElementById('virCloseBtn').addEventListener('click', closeChat);

    const form = document.getElementById('virChatForm');
    if (form) form.addEventListener('submit', handleSubmit);

    const input = document.getElementById('virChatInput');
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSubmit();
        }
      });
    }

    // Attach suggestion chips listener
    document.getElementById('virChatBody').addEventListener('click', (e) => {
      const chip = e.target.closest('.vir-chip');
      if (chip && chip.dataset.query) {
        sendChip(chip.dataset.query);
      }
    });
  }

  // 5. Chat Controller Methods
  function toggleChatPanel() {
    const panel = document.getElementById('virasyaChatPanel');
    if (!panel) return;
    panel.classList.toggle('active');
    panel.classList.remove('minimized');
    if (panel.classList.contains('active')) {
      const input = document.getElementById('virChatInput');
      if (input) setTimeout(() => input.focus(), 300);
      scrollToBottom();
    }
  }

  function closeChat() {
    const panel = document.getElementById('virasyaChatPanel');
    if (panel) panel.classList.remove('active');
  }

  function toggleMinimize() {
    const panel = document.getElementById('virasyaChatPanel');
    if (panel) panel.classList.toggle('minimized');
  }

  function scrollToBottom() {
    const body = document.getElementById('virChatBody');
    if (body) {
      body.scrollTop = body.scrollHeight;
    }
  }

  function renderMarkdown(text) {
    if (!text) return '';
    let parsed = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Bold headers
    parsed = parsed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    parsed = parsed.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Bullet points
    const lines = parsed.split('\n');
    let inList = false;
    let result = [];

    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('• ') || trimmed.startsWith('- ')) {
        if (!inList) {
          result.push('<ul style="margin: 6px 0; padding-left: 18px;">');
          inList = true;
        }
        result.push(`<li style="margin-bottom: 4px;">${trimmed.substring(2)}</li>`);
      } else {
        if (inList) {
          result.push('</ul>');
          inList = false;
        }
        if (trimmed) {
          result.push(`<p>${trimmed}</p>`);
        }
      }
    });

    if (inList) result.push('</ul>');
    return result.join('');
  }

  function appendUserMessage(text) {
    const body = document.getElementById('virChatBody');
    if (!body) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = 'vir-msg user';
    msgDiv.innerHTML = `
      <div class="vir-bubble">
        ${text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}
      </div>
    `;
    body.appendChild(msgDiv);
    scrollToBottom();
  }

  function appendBotMessage(replyText, actions = []) {
    const body = document.getElementById('virChatBody');
    if (!body) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = 'vir-msg bot';

    let actionsHtml = '';
    if (actions && actions.length > 0) {
      actionsHtml = `<div class="vir-action-cards">`;
      actions.forEach(act => {
        actionsHtml += `
          <a href="${act.target}" class="vir-action-btn" onclick="window.virasyaChat.handleActionClick('${act.target}')">
            <span>${act.label}</span>
          </a>
        `;
      });
      actionsHtml += `</div>`;
    }

    msgDiv.innerHTML = `
      <div class="vir-bubble">
        ${renderMarkdown(replyText)}
        ${actionsHtml}
      </div>
    `;

    body.appendChild(msgDiv);
    scrollToBottom();
  }

  function showTypingIndicator() {
    const body = document.getElementById('virChatBody');
    if (!body) return;

    const typingDiv = document.createElement('div');
    typingDiv.id = 'virTypingIndicator';
    typingDiv.className = 'vir-typing';
    typingDiv.innerHTML = `
      <span>VIRASYA AI is exploring India's heritage</span>
      <div class="vir-dots">
        <span></span><span></span><span></span>
      </div>
    `;
    body.appendChild(typingDiv);
    scrollToBottom();
  }

  function hideTypingIndicator() {
    const typing = document.getElementById('virTypingIndicator');
    if (typing) typing.remove();
  }

  // 6. Resilient Message Sender with Smart Fallback
  async function sendMessage(text) {
    const cleanText = (text || '').trim();
    if (!cleanText || isAwaitingResponse) return;

    appendUserMessage(cleanText);
    isAwaitingResponse = true;
    showTypingIndicator();

    currentStateContext = detectCurrentPageState() || currentStateContext;

    // Detect state & topic
    const detectedState = identifyState(cleanText, currentStateContext);
    const detectedTopic = identifyTopic(cleanText);

    let serverSuccess = false;

    // Try endpoints in priority order
    const endpointsToTry = [];
    if (window.location.origin && window.location.origin.startsWith('http')) {
      endpointsToTry.push('/api/chat');
    }
    endpointsToTry.push('http://localhost:5000/api/chat');

    for (const endpoint of endpointsToTry) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: cleanText,
            state: detectedState || null,
            history: conversationHistory.slice(-6)
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          if (data && data.reply) {
            hideTypingIndicator();
            isAwaitingResponse = false;
            serverSuccess = true;

            if (data.state) {
              currentStateContext = data.state;
              const label = document.getElementById('virActiveStateLabel');
              if (label) label.innerText = data.state;
            }

            conversationHistory.push({ role: 'user', text: cleanText });
            conversationHistory.push({ role: 'bot', text: data.reply, state: data.state || null });

            appendBotMessage(data.reply, data.actions || []);
            break;
          }
        }
      } catch (e) {
        // Continue to next endpoint or local engine
      }
    }

    // High-speed Instant Cultural Synthesis Fallback if network was unavailable
    if (!serverSuccess) {
      hideTypingIndicator();
      isAwaitingResponse = false;

      const localResult = generateLocalCulturalResponse(cleanText, detectedState, detectedTopic);

      if (localResult.state) {
        currentStateContext = localResult.state;
        const label = document.getElementById('virActiveStateLabel');
        if (label) label.innerText = localResult.state;
      }

      conversationHistory.push({ role: 'user', text: cleanText });
      conversationHistory.push({ role: 'bot', text: localResult.reply, state: localResult.state || null });

      appendBotMessage(localResult.reply, localResult.actions || []);
    }
  }

  function handleSubmit(e) {
    if (e) e.preventDefault();
    const input = document.getElementById('virChatInput');
    if (!input) return;
    const val = input.value;
    input.value = '';
    sendMessage(val);
  }

  function sendChip(promptText) {
    sendMessage(promptText);
  }

  function resetChat() {
    conversationHistory = [];
    currentStateContext = detectCurrentPageState();
    const label = document.getElementById('virActiveStateLabel');
    if (label) label.innerText = currentStateContext || 'All India';

    const body = document.getElementById('virChatBody');
    if (body) {
      body.innerHTML = `
        <div class="vir-msg bot">
          <div class="vir-bubble">
            <p><strong>Namaste! 🙏</strong><br>New conversation started. How may I assist your cultural journey across India today?</p>
          </div>
          <div class="vir-suggestions-wrap">
            <button class="vir-chip" data-query="Tell me about the culture of India">🪷 Discover Culture</button>
            <button class="vir-chip" data-query="What are famous Indian heritage sites?">🏛 Explore Heritage</button>
            <button class="vir-chip" data-query="What crafts are famous in Rajasthan?">🎨 Rajasthan Crafts</button>
            <button class="vir-chip" data-query="Tell me about Dokra metal art">🔔 Dokra Art</button>
          </div>
        </div>
      `;
    }
  }

  function handleActionClick(target) {
    if (target.startsWith('#')) {
      closeChat();
      const el = document.querySelector(target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Expose global controller immediately
  window.virasyaChat = {
    toggle: toggleChatPanel,
    closeChat,
    toggleMinimize,
    handleSubmit,
    sendChip,
    resetChat,
    handleActionClick,
    setStateContext: function (stateName) {
      currentStateContext = stateName;
      const label = document.getElementById('virActiveStateLabel');
      if (label) label.innerText = stateName;
    }
  };

  // Mount UI immediately on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountChatbotUI);
  } else {
    mountChatbotUI();
  }
})();
