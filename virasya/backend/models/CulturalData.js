// =======================================================
// VIRASYA - Cultural Data Model & MongoDB Repository
// =======================================================

const fs = require('fs');
const path = require('path');

let mongoose = null;
try {
  mongoose = require('mongoose');
} catch (e) {
  // Mongoose is optional, fallback data provider will be used
}

const LOCAL_DATA_PATH = path.join(__dirname, '..', 'data', 'cultural_database.json');
let cachedLocalData = null;

function getLocalData() {
  if (!cachedLocalData) {
    try {
      const raw = fs.readFileSync(LOCAL_DATA_PATH, 'utf-8');
      cachedLocalData = JSON.parse(raw);
    } catch (err) {
      console.error('Error loading local cultural database:', err);
      cachedLocalData = [];
    }
  }
  return cachedLocalData;
}

// -------------------------------------------------------
// Mongoose Schema Definition (Scalable for all Indian States)
// -------------------------------------------------------
let CulturalModel = null;

if (mongoose && mongoose.Schema) {
  const HeritageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String }
  });

  const FestivalSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    significance: { type: String }
  });

  const HistorySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    period: { type: String }
  });

  const ArtsAndCraftsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    materials: { type: String },
    region: { type: String }
  });

  const CulturalDataSchema = new mongoose.Schema({
    state: { type: String, required: true, unique: true, index: true },
    culture: {
      traditions: [{ type: String }],
      clothing: [{ type: String }],
      food: [{ type: String }],
      dance: [{ type: String }],
      music: [{ type: String }]
    },
    heritage: [HeritageSchema],
    festivals: [FestivalSchema],
    history: [HistorySchema],
    artsAndCrafts: [ArtsAndCraftsSchema]
  }, {
    timestamps: true
  });

  try {
    CulturalModel = mongoose.model('CulturalData', CulturalDataSchema);
  } catch (e) {
    CulturalModel = mongoose.models.CulturalData;
  }
}

// -------------------------------------------------------
// Data Access Methods (MongoDB + High Performance Fallback)
// -------------------------------------------------------
async function findStateData(stateName) {
  if (!stateName) return null;
  const normalized = stateName.trim().toLowerCase();

  // Try MongoDB if connected
  if (mongoose && mongoose.connection && mongoose.connection.readyState === 1 && CulturalModel) {
    try {
      const doc = await CulturalModel.findOne({
        state: new RegExp(`^${normalized}$`, 'i')
      }).lean();
      if (doc) return doc;
    } catch (err) {
      console.warn('MongoDB query error, falling back to local dataset:', err.message);
    }
  }

  // Fallback to local verified dataset
  const localList = getLocalData();
  return localList.find(s => s.state.toLowerCase() === normalized) || null;
}

async function searchCulturalKnowledge(queryText, stateName = null) {
  const queryLower = (queryText || '').toLowerCase();
  const targetState = stateName ? await findStateData(stateName) : null;
  const allStates = getLocalData();

  const results = {
    state: targetState ? targetState.state : null,
    matchedCrafts: [],
    matchedHeritage: [],
    matchedFestivals: [],
    matchedCulture: [],
    matchedHistory: [],
    generalInfo: targetState || null
  };

  const statesToSearch = targetState ? [targetState] : allStates;

  const STOPWORDS = new Set([
    'what', 'which', 'where', 'when', 'who', 'whom', 'whose', 'why', 'how',
    'tell', 'show', 'give', 'know', 'about', 'some', 'many', 'more', 'much',
    'this', 'that', 'these', 'those', 'there', 'here', 'with', 'from', 'into',
    'have', 'been', 'were', 'will', 'would', 'could', 'should', 'capital', 'state',
    'place', 'area', 'region', 'city', 'town', 'village', 'india', 'indian', 'culture', 'heritage'
  ]);

  const queryTokens = queryLower.split(/[^a-z0-9]+/).filter(w => w.length >= 3 && !STOPWORDS.has(w));

  function matchesQuery(term) {
    if (!term) return false;
    const termLower = term.toLowerCase().trim();
    if (termLower.length < 3) return false;
    if (queryTokens.length > 0 && queryLower.includes(termLower)) return true;
    const termTokens = termLower.split(/[^a-z0-9]+/).filter(w => w.length >= 4 && !STOPWORDS.has(w));
    return termTokens.some(tw => queryTokens.includes(tw));
  }

  for (const s of statesToSearch) {
    // 1. Search Arts & Crafts
    if (s.artsAndCrafts) {
      s.artsAndCrafts.forEach(c => {
        if (matchesQuery(c.name) || (queryLower.length > 5 && c.description.toLowerCase().includes(queryLower))) {
          results.matchedCrafts.push({ state: s.state, ...c });
        }
      });
    }

    // 2. Search Heritage Sites
    if (s.heritage) {
      s.heritage.forEach(h => {
        if (matchesQuery(h.name) || (queryLower.length > 5 && h.description.toLowerCase().includes(queryLower))) {
          results.matchedHeritage.push({ state: s.state, ...h });
        }
      });
    }

    // 3. Search Festivals
    if (s.festivals) {
      s.festivals.forEach(f => {
        if (matchesQuery(f.name) || (queryLower.length > 5 && f.description.toLowerCase().includes(queryLower))) {
          results.matchedFestivals.push({ state: s.state, ...f });
        }
      });
    }

    // 4. Search Culture & Traditions
    if (s.culture) {
      ['traditions', 'food', 'dance', 'clothing', 'music'].forEach(cat => {
        (s.culture[cat] || []).forEach(item => {
          if (queryLower.includes(cat) || matchesQuery(item)) {
            results.matchedCulture.push({ state: s.state, category: cat, detail: item });
          }
        });
      });
    }

    // 5. Search History
    if (s.history) {
      s.history.forEach(h => {
        if (queryLower.includes('history') || matchesQuery(h.title)) {
          results.matchedHistory.push({ state: s.state, ...h });
        }
      });
    }
  }

  return results;
}

module.exports = {
  CulturalModel,
  findStateData,
  searchCulturalKnowledge,
  getLocalData
};
