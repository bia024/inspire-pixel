import { ref } from 'vue'

const apiKey = import.meta.env.VITE_HF_API_KEY
const descriptions = ref({})
const loadingDescriptions = ref({})

const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

const fallbackDescriptions = {
  nature: [
    'A serene landscape capturing the raw beauty of untouched wilderness',
    'Majestic natural scenery showcasing the harmony between earth and sky',
    "Breathtaking outdoor vista revealing nature's artistic masterpiece",
    'Tranquil natural scene evoking peace and environmental wonder',
    'Vivid depiction of natural beauty in its purest form',
    'Captivating wilderness landscape telling stories of natural evolution',
    'Harmonious blend of natural elements creating visual poetry',
    "Stunning natural composition celebrating earth's diverse beauty",
  ],
  architecture: [
    'Impressive architectural marvel showcasing human ingenuity and design',
    'Striking building facade demonstrating modern architectural excellence',
    'Elegant structure blending functionality with aesthetic brilliance',
    'Monumental architectural achievement standing as a testament to creativity',
    'Sophisticated building design reflecting cultural and artistic values',
    'Bold architectural statement combining tradition with innovation',
    'Magnificent construction highlighting engineering and artistic mastery',
    'Iconic architectural landmark representing historical significance',
  ],
  people: [
    'Captivating portrait revealing the depth of human emotion and character',
    'Intimate human moment captured with artistic sensitivity and insight',
    'Compelling character study showcasing personality and expression',
    'Authentic human connection portrayed through thoughtful composition',
    'Evocative depiction of human experience and emotional authenticity',
    'Powerful portrait conveying strength, vulnerability, and humanity',
    'Artistic representation of human spirit and individual uniqueness',
    'Meaningful human narrative told through expressive visual storytelling',
  ],
  abstract: [
    'Intriguing abstract composition exploring form, color, and texture',
    'Bold artistic expression challenging conventional visual boundaries',
    'Dynamic abstract arrangement stimulating imagination and interpretation',
    'Creative visual exploration of shapes, patterns, and artistic freedom',
    'Innovative abstract design pushing the limits of visual language',
    'Thought-provoking composition inviting personal artistic discovery',
    'Experimental visual arrangement celebrating artistic experimentation',
    'Provocative abstract work inspiring creative thought and reflection',
  ],
  city: [
    'Vibrant urban landscape capturing the energy of modern city life',
    'Dynamic cityscape showcasing architectural diversity and human activity',
    'Bustling metropolitan scene reflecting contemporary urban culture',
    'Impressive city vista highlighting progress and community spirit',
    'Lively urban environment demonstrating civic pride and development',
    'Captivating city scene blending tradition with modern innovation',
    'Engaging urban composition celebrating diversity and connectivity',
    'Striking cityscape representing the heartbeat of urban civilization',
  ],
  animals: [
    'Fascinating wildlife portrait showcasing animal grace and natural behavior',
    'Captivating creature study revealing the beauty of animal diversity',
    'Intimate animal moment captured with respect and admiration',
    "Majestic wildlife depiction celebrating nature's living treasures",
    'Compelling animal portrait highlighting instinct and personality',
    'Evocative wildlife scene demonstrating survival and adaptation',
    'Artistic animal representation honoring biodiversity and wonder',
    'Powerful creature study inspiring conservation and appreciation',
  ],
  food: [
    'Appetizing culinary creation showcasing gastronomic artistry and flavor',
    'Tempting food presentation celebrating culinary craftsmanship',
    'Delectable dish arrangement highlighting freshness and quality',
    'Artistic food composition evoking sensory pleasure and satisfaction',
    'Inviting culinary masterpiece demonstrating cooking excellence',
    'Beautiful food styling celebrating ingredients and preparation',
    'Gourmet presentation inspiring appetite and culinary curiosity',
    'Elegant food arrangement honoring the art of gastronomy',
  ],
  technology: [
    'Innovative technological marvel demonstrating human progress and ingenuity',
    'Sophisticated digital landscape showcasing technological advancement',
    'Impressive tech composition highlighting innovation and functionality',
    'Modern technological achievement representing digital transformation',
    'Cutting-edge technology display celebrating computational power',
    'Advanced tech arrangement demonstrating engineering excellence',
    'Futuristic technological scene inspiring innovation and discovery',
    'Complex technology composition honoring scientific achievement',
  ],
  travel: [
    'Exotic destination capturing the allure of adventure and exploration',
    'Scenic travel vista showcasing cultural diversity and natural beauty',
    'Inviting travel scene inspiring wanderlust and discovery',
    'Picturesque journey destination celebrating global heritage',
    'Captivating travel landscape highlighting unique geographical features',
    'Engaging travel composition evoking adventure and cultural exchange',
    'Breathtaking travel scene representing the joy of exploration',
    'Memorable travel destination showcasing world cultural diversity',
  ],
  sports: [
    'Dynamic athletic moment capturing the intensity of competitive spirit',
    'Powerful sports action showcasing human physical achievement',
    'Intense athletic performance demonstrating skill and determination',
    'Compelling sports scene highlighting teamwork and dedication',
    'Energetic athletic composition celebrating physical excellence',
    'Thrilling sports moment capturing the essence of competition',
    'Impressive athletic display honoring perseverance and victory',
    'Vibrant sports scene representing passion and human potential',
  ],
  fashion: [
    'Elegant fashion statement showcasing style and contemporary trends',
    'Sophisticated outfit composition demonstrating fashion artistry',
    'Chic fashion presentation highlighting design and personal expression',
    'Stylish fashion arrangement celebrating creativity and individuality',
    'Refined fashion display showcasing elegance and sophistication',
    'Trendsetting fashion composition inspiring style and confidence',
    'Artistic fashion presentation honoring design innovation',
    'Polished fashion scene representing contemporary aesthetic values',
  ],
  landscape: [
    'Breathtaking panoramic vista celebrating the grandeur of natural landscapes',
    'Majestic landscape composition showcasing geological diversity',
    'Spectacular scenic view highlighting natural formations and beauty',
    "Impressive landscape arrangement demonstrating nature's artistic palette",
    'Vast landscape scene evoking wonder and environmental appreciation',
    "Stunning geographical composition honoring earth's natural wonders",
    'Expansive landscape vista celebrating scale and natural majesty',
    'Beautiful landscape study showcasing seasonal and climatic diversity',
  ],
  portrait: [
    'Compelling portrait study revealing personality and human depth',
    'Intimate character portrait showcasing emotional authenticity',
    'Thoughtful portrait composition highlighting individual uniqueness',
    'Expressive facial study demonstrating photographic artistry',
    'Meaningful portrait work celebrating human diversity and character',
    'Artistic portrait arrangement exploring light, shadow, and expression',
    'Powerful portrait depiction honoring human experience and emotion',
    'Insightful portrait composition revealing inner strength and vulnerability',
  ],
  'black-and-white': [
    'Timeless monochromatic composition emphasizing form and contrast',
    'Classic black and white study highlighting texture and shadow play',
    'Sophisticated grayscale arrangement celebrating artistic simplicity',
    'Elegant monochrome composition showcasing tonal relationships',
    'Powerful black and white study demonstrating dramatic lighting',
    'Refined grayscale portrait emphasizing character and expression',
    'Artistic monochromatic scene celebrating visual purity',
    'Striking black and white composition honoring photographic tradition',
  ],
  wallpaper: [
    'Versatile background design offering aesthetic and functional appeal',
    'Sophisticated wallpaper pattern providing visual interest and harmony',
    'Elegant decorative composition suitable for modern interiors',
    'Artistic background arrangement enhancing space and atmosphere',
    'Refined wallpaper design celebrating pattern and texture',
    'Creative background composition inspiring interior design',
    'Polished wallpaper pattern offering timeless aesthetic value',
    'Innovative background design combining style with practicality',
  ],
  background: [
    'Versatile backdrop design providing clean and functional aesthetics',
    'Neutral background composition offering flexibility and simplicity',
    'Sophisticated backdrop arrangement supporting visual hierarchy',
    'Clean background design emphasizing clarity and professional appeal',
    'Subtle backdrop composition enhancing content presentation',
    'Refined background pattern providing balanced visual foundation',
    'Elegant backdrop design celebrating minimalism and functionality',
    'Thoughtful background arrangement supporting creative expression',
  ],
  macro: [
    'Intricate macro study revealing hidden details and microscopic beauty',
    'Detailed close-up composition showcasing texture and fine structure',
    'Intimate macro exploration celebrating small-scale natural wonders',
    'Precise macro photography highlighting intricate patterns and forms',
    'Fascinating close-up study demonstrating photographic precision',
    "Detailed macro composition revealing nature's intricate designs",
    'Intensive macro exploration honoring small-scale artistic elements',
    'Careful macro study showcasing depth and microscopic artistry',
  ],
  aerial: [
    'Spectacular aerial perspective showcasing geographical patterns and scale',
    "Impressive bird's-eye view highlighting landscape relationships",
    'Dramatic aerial composition demonstrating spatial relationships',
    'Vast aerial vista celebrating geographical diversity and patterns',
    'Striking overhead perspective revealing hidden landscape features',
    'Comprehensive aerial study showcasing environmental connections',
    'Majestic aerial composition honoring scale and geographical beauty',
    'Powerful aerial viewpoint demonstrating cartographic artistry',
  ],
  vintage: [
    'Nostalgic vintage composition evoking historical charm and character',
    'Timeless vintage scene celebrating retro aesthetics and style',
    'Classic vintage arrangement honoring historical photographic tradition',
    'Evocative vintage study showcasing aged beauty and character',
    'Authentic vintage composition reflecting historical authenticity',
    'Charming vintage scene celebrating timeless visual appeal',
    'Retro vintage arrangement honoring historical design principles',
    'Meaningful vintage study evoking nostalgia and historical value',
  ],
  minimalist: [
    'Clean minimalist composition celebrating simplicity and essential forms',
    'Refined minimal design emphasizing clarity and purposeful reduction',
    'Sophisticated minimalist arrangement showcasing intentional simplicity',
    'Pure minimalist study highlighting essential visual elements',
    'Elegant minimal composition demonstrating design discipline',
    'Focused minimalist work celebrating clarity and visual purity',
    'Intentional minimalist design honoring simplicity and function',
    'Refined minimal arrangement showcasing thoughtful visual economy',
  ],
  ocean: [
    'Majestic ocean vista celebrating the power and beauty of marine landscapes',
    'Dramatic coastal scene showcasing wave patterns and oceanic energy',
    'Serene ocean composition highlighting tranquility and marine majesty',
    "Powerful ocean landscape demonstrating nature's aquatic grandeur",
    'Beautiful coastal arrangement celebrating shoreline diversity',
    'Impressive ocean scene honoring marine environmental beauty',
    'Vibrant ocean composition showcasing aquatic life and movement',
    'Stunning marine vista celebrating the mystery of ocean depths',
  ],
  forest: [
    'Lush forest landscape celebrating biodiversity and natural harmony',
    'Dense woodland composition showcasing tree diversity and ecosystem health',
    'Mysterious forest scene evoking exploration and natural discovery',
    'Rich forest arrangement highlighting canopy patterns and light play',
    'Vibrant woodland study celebrating seasonal forest transformation',
    'Ancient forest composition honoring longevity and natural wisdom',
    'Peaceful forest vista showcasing tranquility and ecological balance',
    'Diverse forest landscape celebrating botanical variety and beauty',
  ],
  mountain: [
    'Majestic mountain landscape showcasing geological grandeur and scale',
    'Impressive peak composition celebrating alpine beauty and challenge',
    'Dramatic mountain vista highlighting rugged terrain and elevation',
    "Powerful mountain scene demonstrating nature's architectural majesty",
    'Stunning alpine arrangement showcasing snow-capped peaks and valleys',
    'Epic mountain landscape honoring geological history and formation',
    'Breathtaking mountain composition celebrating vertical natural drama',
    'Spectacular high-altitude scene showcasing climatic and geological diversity',
  ],
  beach: [
    'Idyllic beach scene celebrating coastal tranquility and natural beauty',
    'Peaceful shoreline composition showcasing sand, sea, and sky harmony',
    'Relaxing beach vista highlighting coastal serenity and recreation',
    'Beautiful coastal arrangement celebrating beach ecosystem diversity',
    'Serene beach landscape honoring the meeting of land and sea',
    'Inviting beach scene showcasing natural coastal recreational spaces',
    'Tranquil beach composition celebrating tidal rhythms and patterns',
    'Charming coastal vista highlighting beach environmental beauty',
  ],
  flower: [
    'Delicate floral composition celebrating botanical beauty and color diversity',
    'Elegant flower arrangement showcasing petal patterns and natural artistry',
    'Vibrant floral study highlighting pollination and plant reproduction',
    'Beautiful flower portrait celebrating seasonal blooming cycles',
    'Intricate floral composition honoring botanical diversity and form',
    'Colorful flower scene showcasing garden ecosystem harmony',
    'Graceful floral arrangement celebrating natural decorative beauty',
    'Detailed flower study highlighting texture, color, and botanical detail',
  ],
  car: [
    'Sleek automotive design showcasing engineering excellence and style',
    'Impressive vehicle composition highlighting mechanical artistry',
    'Dynamic car portrait celebrating automotive innovation and performance',
    'Sophisticated automobile study demonstrating design and functionality',
    'Powerful vehicle arrangement showcasing speed and technological achievement',
    'Elegant car composition honoring automotive heritage and progress',
    'Striking automobile scene celebrating transportation innovation',
    'Detailed car study highlighting engineering precision and aesthetic appeal',
  ],
  building: [
    'Impressive architectural structure showcasing design innovation and purpose',
    'Majestic building composition highlighting construction and urban planning',
    'Sophisticated construction study demonstrating architectural principles',
    'Modern building arrangement celebrating functional and aesthetic design',
    'Striking architectural landmark honoring civic and cultural significance',
    'Elegant building composition showcasing structural engineering excellence',
    'Impressive construction scene highlighting urban development achievement',
    'Refined architectural study celebrating building design and purpose',
  ],
  art: [
    'Creative artistic composition showcasing imaginative expression and vision',
    'Innovative art arrangement demonstrating creative freedom and exploration',
    'Inspiring artistic study celebrating human creative potential',
    'Bold art composition highlighting artistic technique and style',
    'Evocative artistic work honoring creative process and imagination',
    'Dynamic art scene showcasing artistic diversity and cultural expression',
    'Thought-provoking artistic composition inspiring creative reflection',
    'Powerful art arrangement celebrating artistic innovation and originality',
  ],
  music: [
    'Dynamic musical composition celebrating rhythm, melody, and artistic expression',
    'Vibrant music scene showcasing performance energy and emotional connection',
    'Harmonious musical arrangement highlighting instrumental beauty and skill',
    'Powerful music composition demonstrating artistic collaboration and creativity',
    'Evocative musical study celebrating sound, emotion, and human expression',
    'Intense musical performance capturing passion and artistic dedication',
    'Beautiful musical composition honoring melody, harmony, and rhythm',
    'Inspiring music scene showcasing creative expression and emotional depth',
  ],
  dance: [
    'Graceful dance composition celebrating movement, rhythm, and human expression',
    'Dynamic dance scene showcasing athleticism and artistic interpretation',
    'Elegant dance arrangement highlighting choreography and bodily expression',
    'Powerful dance study demonstrating movement, emotion, and physical artistry',
    'Vibrant dance composition celebrating cultural expression and physical poetry',
    'Intense dance performance capturing passion and artistic dedication',
    'Beautiful dance scene honoring rhythm, grace, and human creativity',
    'Evocative dance arrangement showcasing movement as artistic language',
  ],
  ski: [
    'Thrilling ski adventure on snow-covered slopes capturing speed and excitement',
    'Majestic winter sports scene showcasing alpine skiing and mountain beauty',
    'Dynamic skiing action highlighting technique and athletic prowess',
    'Serene snow landscape with skiers demonstrating winter sports elegance',
    'Adrenaline-filled ski run through pristine powder evoking adventure',
    'Stunning alpine vista with skiers celebrating winter recreation',
    'Powerful skiing composition honoring speed, skill, and mountain majesty',
    'Captivating winter sports moment inspiring outdoor adventure and thrill',
  ],
  kayak: [
    'Adventurous kayaking through calm waters showcasing exploration and nature',
    'Serene paddling scene on lagoon highlighting tranquility and adventure',
    'Dynamic kayak journey capturing rhythm of paddles and water flow',
    'Peaceful lagoon kayaking evoking harmony with nature and serenity',
    'Exciting water adventure with kayak demonstrating exploration spirit',
    'Beautiful lagoon vista with kayaker celebrating outdoor recreation',
    'Thrilling kayaking experience honoring water sports and natural beauty',
    'Captivating paddling moment inspiring adventure and environmental connection',
  ],
  sunset: [
    'Breathtaking sunset over horizon painting sky in vibrant colors',
    'Serene evening vista capturing the magic of sunset transition',
    "Majestic sunset scene showcasing nature's daily artistic display",
    'Tranquil sunset landscape evoking peace and reflection',
    'Vivid sunset composition highlighting warm tones and sky drama',
    "Captivating twilight moment celebrating day's end beauty",
    'Stunning sunset vista inspiring wonder and contemplation',
    'Beautiful evening sky painting with sunset colors and light',
  ],
  waterfall: [
    "Majestic waterfall cascading through lush greenery showcasing nature's power",
    'Serene water feature tumbling down rocks creating misty beauty',
    'Dynamic waterfall scene capturing flow and natural energy',
    "Tranquil cascade highlighting water's journey through landscape",
    'Impressive waterfall vista evoking awe and environmental wonder',
    'Beautiful falling water composition celebrating hydrological beauty',
    'Powerful waterfall display inspiring adventure and nature appreciation',
    "Captivating cascade moment honoring water's sculpting force",
  ],
  bridge: [
    'Impressive architectural bridge spanning water connecting landscapes',
    'Elegant structure showcasing engineering and aesthetic harmony',
    'Majestic bridge vista highlighting human achievement and nature',
    'Serene crossing scene evoking journey and connection',
    'Dynamic bridge composition celebrating design and functionality',
    'Beautiful architectural feature spanning natural elements',
    'Iconic bridge landmark inspiring travel and exploration',
    'Stunning bridge structure honoring connectivity and beauty',
  ],
  canoe: [
    'Peaceful canoeing on calm waters capturing serenity and adventure',
    'Serene paddling scene showcasing exploration and nature connection',
    'Dynamic canoe journey highlighting rhythm and outdoor recreation',
    'Tranquil water adventure with canoe evoking relaxation',
    'Beautiful lake vista with canoeist celebrating peaceful outing',
    'Captivating paddling moment inspiring water sports and tranquility',
    'Adventurous canoe trip honoring exploration and natural beauty',
    'Elegant canoe composition demonstrating grace on water',
  ],
}

const generateDescription = async (imageUrl, imageId, category = 'nature') => {
  if (loadingDescriptions.value[imageId]) return

  loadingDescriptions.value[imageId] = true

  try {
    const cached = localStorage.getItem(`llm_desc_${imageId}`)
    if (cached) {
      descriptions.value[imageId] = cached
      loadingDescriptions.value[imageId] = false
      return
    }

    try {
      const response = await fetch(imageUrl)
      if (!response.ok) throw new Error('Failed to fetch image')
      const blob = await response.blob()
      const base64 = await blobToBase64(blob)

      const apiResponse = await fetch(
        'https://api-inference.huggingface.co/models/nlpconnect/vit-gpt2-image-captioning',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: base64,
          }),
        }
      )

      if (apiResponse.ok) {
        const data = await apiResponse.json()
        const description =
          data[0]?.generated_text || data[0]?.caption || 'No description generated'

        localStorage.setItem(`llm_desc_${imageId}`, description)
        descriptions.value[imageId] = description
        return
      }
    } catch (apiError) {
      console.warn('Hugging Face API failed, using fallback:', apiError)
    }

    const categoryDescriptions = fallbackDescriptions[category] || fallbackDescriptions['nature']
    const randomFallback =
      categoryDescriptions[Math.floor(Math.random() * categoryDescriptions.length)]
    const description = `${randomFallback}.`

    localStorage.setItem(`llm_desc_${imageId}`, description)
    descriptions.value[imageId] = description
  } catch (error) {
    console.error('LLM generation error:', error)
    const genericDesc = 'A beautiful image that inspires creativity and artistic expression.'
    descriptions.value[imageId] = genericDesc
    localStorage.setItem(`llm_desc_${imageId}`, genericDesc)
  } finally {
    loadingDescriptions.value[imageId] = false
  }
}

const getDescription = (imageId) => {
  return descriptions.value[imageId]
}

const isLoadingDescription = (imageId) => {
  return loadingDescriptions.value[imageId] || false
}

export const useLLM = () => {
  return {
    generateDescription,
    getDescription,
    isLoadingDescription,
  }
}
