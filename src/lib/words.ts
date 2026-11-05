export type Level = "Beginner" | "Intermediate" | "Advanced";
export const LANGS = ["es", "fr", "ru", "ar", "hi", "tr", "id", "vi"] as const;
export type Lang = (typeof LANGS)[number];
export const LANG_NAMES: Record<Lang, string> = {
  es: "Español", fr: "Français", ru: "Русский", ar: "العربية",
  hi: "हिन्दी", tr: "Türkçe", id: "Bahasa Indonesia", vi: "Tiếng Việt",
};

export const CATEGORIES = [
  { id: "daily", name: "Daily Life", icon: "☀️" },
  { id: "food", name: "Food", icon: "🍎" },
  { id: "travel", name: "Travel", icon: "✈️" },
  { id: "business", name: "Business", icon: "💼" },
  { id: "education", name: "Education", icon: "🎓" },
  { id: "people", name: "People", icon: "👪" },
  { id: "nature", name: "Nature", icon: "🌳" },
  { id: "tech", name: "Technology", icon: "💻" },
  { id: "emotions", name: "Emotions", icon: "😊" },
  { id: "health", name: "Health", icon: "🩺" },
  { id: "work", name: "Work", icon: "🛠️" },
  { id: "home", name: "Home", icon: "🏠" },
  { id: "shopping", name: "Shopping", icon: "🛍️" },
  { id: "transport", name: "Transportation", icon: "🚌" },
  { id: "time", name: "Time", icon: "⏰" },
] as const;

export type Word = {
  id: string; word: string; image: string; category: string; level: Level;
  pos: string; example: string; tr: Record<Lang, string>;
};

// word|emoji|level(B/I/A)|pos|example|es|fr|ru|ar|hi|tr|id|vi
const RAW: Record<string, string[]> = {
  daily: [
    "wake up|⏰|B|verb|I wake up at seven every day.|despertarse|se réveiller|просыпаться|يستيقظ|जागना|uyanmak|bangun|thức dậy",
    "shower|🚿|B|noun|I take a shower in the morning.|ducha|douche|душ|دش|स्नान|duş|mandi|vòi sen",
    "breakfast|🥞|B|noun|Breakfast is ready.|desayuno|petit-déjeuner|завтрак|فطور|नाश्ता|kahvaltı|sarapan|bữa sáng",
    "toothbrush|🪥|B|noun|My toothbrush is blue.|cepillo de dientes|brosse à dents|зубная щётка|فرشاة أسنان|टूथब्रश|diş fırçası|sikat gigi|bàn chải",
    "routine|🔁|I|noun|Exercise is part of my routine.|rutina|routine|распорядок|روتين|दिनचर्या|rutin|rutinitas|thói quen",
    "chore|🧹|A|noun|Washing dishes is my least favorite chore.|tarea doméstica|corvée|домашнее дело|عمل منزلي|घरेलू काम|ev işi|pekerjaan rumah|việc vặt",
  ],
  food: [
    "apple|🍎|B|noun|She eats an apple a day.|manzana|pomme|яблоко|تفاحة|सेब|elma|apel|táo",
    "bread|🍞|B|noun|We buy fresh bread.|pan|pain|хлеб|خبز|रोटी|ekmek|roti|bánh mì",
    "cheese|🧀|B|noun|I love cheese on pizza.|queso|fromage|сыр|جبن|पनीर|peynir|keju|phô mai",
    "carrot|🥕|B|noun|Rabbits like carrots.|zanahoria|carotte|морковь|جزر|गाजर|havuç|wortel|cà rốt",
    "delicious|😋|I|adjective|This soup is delicious.|delicioso|délicieux|вкусный|لذيذ|स्वादिष्ट|lezzetli|lezat|ngon",
    "ingredient|🧂|A|noun|Salt is a key ingredient.|ingrediente|ingrédient|ингредиент|مكون|सामग्री|malzeme|bahan|nguyên liệu",
  ],
  travel: [
    "passport|🛂|B|noun|Don't forget your passport.|pasaporte|passeport|паспорт|جواز سفر|पासपोर्ट|pasaport|paspor|hộ chiếu",
    "suitcase|🧳|B|noun|My suitcase is heavy.|maleta|valise|чемодан|حقيبة سفر|सूटकेस|bavul|koper|va li",
    "beach|🏖️|B|noun|We walked on the beach.|playa|plage|пляж|شاطئ|समुद्र तट|plaj|pantai|bãi biển",
    "map|🗺️|B|noun|Let's look at the map.|mapa|carte|карта|خريطة|नक्शा|harita|peta|bản đồ",
    "journey|🧭|I|noun|The journey took six hours.|viaje|voyage|путешествие|رحلة|यात्रा|yolculuk|perjalanan|hành trình",
    "destination|📍|A|noun|Paris is a popular destination.|destino|destination|пункт назначения|وجهة|गंतव्य|varış yeri|tujuan|điểm đến",
  ],
  business: [
    "money|💵|B|noun|I need more money.|dinero|argent|деньги|مال|पैसा|para|uang|tiền",
    "meeting|🤝|B|noun|The meeting starts at ten.|reunión|réunion|встреча|اجتماع|बैठक|toplantı|rapat|cuộc họp",
    "contract|📝|I|noun|Please sign the contract.|contrato|contrat|контракт|عقد|अनुबंध|sözleşme|kontrak|hợp đồng",
    "profit|📈|I|noun|The company made a big profit.|ganancia|bénéfice|прибыль|ربح|लाभ|kâr|laba|lợi nhuận",
    "negotiate|💬|A|verb|We need to negotiate the price.|negociar|négocier|вести переговоры|يتفاوض|मोलभाव करना|pazarlık etmek|bernegosiasi|đàm phán",
    "investment|🏦|A|noun|Gold is a safe investment.|inversión|investissement|инвестиция|استثمار|निवेश|yatırım|investasi|đầu tư",
  ],
  education: [
    "book|📕|B|noun|I am reading a book.|libro|livre|книга|كتاب|किताब|kitap|buku|sách",
    "teacher|👩‍🏫|B|noun|Our teacher is kind.|profesor|professeur|учитель|معلم|शिक्षक|öğretmen|guru|giáo viên",
    "pencil|✏️|B|noun|Can I borrow a pencil?|lápiz|crayon|карандаш|قلم رصاص|पेंसिल|kurşun kalem|pensil|bút chì",
    "school|🏫|B|noun|The school is near my house.|escuela|école|школа|مدرسة|स्कूल|okul|sekolah|trường học",
    "exam|🧾|I|noun|I passed the exam!|examen|examen|экзамен|امتحان|परीक्षा|sınav|ujian|kỳ thi",
    "knowledge|🧠|A|noun|Knowledge is power.|conocimiento|connaissance|знание|معرفة|ज्ञान|bilgi|pengetahuan|kiến thức",
  ],
  people: [
    "baby|👶|B|noun|The baby is sleeping.|bebé|bébé|младенец|طفل رضيع|बच्चा|bebek|bayi|em bé",
    "family|👨‍👩‍👧|B|noun|I love my family.|familia|famille|семья|عائلة|परिवार|aile|keluarga|gia đình",
    "friend|🧑‍🤝‍🧑|B|noun|She is my best friend.|amigo|ami|друг|صديق|दोस्त|arkadaş|teman|bạn",
    "grandmother|👵|B|noun|My grandmother bakes cookies.|abuela|grand-mère|бабушка|جدة|दादी|büyükanne|nenek|bà",
    "neighbor|🏘️|I|noun|Our neighbor has a dog.|vecino|voisin|сосед|جار|पड़ोसी|komşu|tetangga|hàng xóm",
    "stranger|🕵️|A|noun|Don't talk to strangers.|desconocido|inconnu|незнакомец|غريب|अजनबी|yabancı|orang asing|người lạ",
  ],
  nature: [
    "tree|🌳|B|noun|The tree is very tall.|árbol|arbre|дерево|شجرة|पेड़|ağaç|pohon|cây",
    "flower|🌸|B|noun|This flower smells nice.|flor|fleur|цветок|زهرة|फूल|çiçek|bunga|hoa",
    "sun|☀️|B|noun|The sun is shining.|sol|soleil|солнце|شمس|सूरज|güneş|matahari|mặt trời",
    "mountain|⛰️|B|noun|We climbed the mountain.|montaña|montagne|гора|جبل|पहाड़|dağ|gunung|núi",
    "river|🏞️|I|noun|The river flows to the sea.|río|rivière|река|نهر|नदी|nehir|sungai|sông",
    "volcano|🌋|A|noun|The volcano erupted last year.|volcán|volcan|вулкан|بركان|ज्वालामुखी|yanardağ|gunung berapi|núi lửa",
  ],
  tech: [
    "phone|📱|B|noun|My phone is ringing.|teléfono|téléphone|телефон|هاتف|फ़ोन|telefon|telepon|điện thoại",
    "computer|💻|B|noun|I work on a computer.|computadora|ordinateur|компьютер|حاسوب|कंप्यूटर|bilgisayar|komputer|máy tính",
    "battery|🔋|B|noun|The battery is low.|batería|batterie|батарея|بطارية|बैटरी|pil|baterai|pin",
    "keyboard|⌨️|I|noun|The keyboard is broken.|teclado|clavier|клавиатура|لوحة مفاتيح|कीबोर्ड|klavye|papan ketik|bàn phím",
    "download|⬇️|I|verb|Download the app now.|descargar|télécharger|скачать|يحمّل|डाउनलोड करना|indirmek|mengunduh|tải xuống",
    "satellite|🛰️|A|noun|The satellite orbits the Earth.|satélite|satellite|спутник|قمر صناعي|उपग्रह|uydu|satelit|vệ tinh",
  ],
  emotions: [
    "happy|😄|B|adjective|I am happy today.|feliz|heureux|счастливый|سعيد|खुश|mutlu|senang|vui",
    "sad|😢|B|adjective|Why are you sad?|triste|triste|грустный|حزين|उदास|üzgün|sedih|buồn",
    "angry|😠|B|adjective|He was angry about the noise.|enojado|en colère|злой|غاضب|गुस्सा|kızgın|marah|tức giận",
    "scared|😨|B|adjective|The child is scared of the dark.|asustado|effrayé|испуганный|خائف|डरा हुआ|korkmuş|takut|sợ hãi",
    "proud|🏅|I|adjective|I'm proud of you.|orgulloso|fier|гордый|فخور|गर्वित|gururlu|bangga|tự hào",
    "anxious|😰|A|adjective|She feels anxious before tests.|ansioso|anxieux|тревожный|قلق|चिंतित|endişeli|cemas|lo lắng",
  ],
  health: [
    "doctor|🧑‍⚕️|B|noun|I need to see a doctor.|médico|médecin|врач|طبيب|डॉक्टर|doktor|dokter|bác sĩ",
    "medicine|💊|B|noun|Take this medicine twice a day.|medicina|médicament|лекарство|دواء|दवा|ilaç|obat|thuốc",
    "headache|🤕|I|noun|I have a terrible headache.|dolor de cabeza|mal de tête|головная боль|صداع|सिरदर्द|baş ağrısı|sakit kepala|đau đầu",
    "hospital|🏥|B|noun|She works at the hospital.|hospital|hôpital|больница|مستشفى|अस्पताल|hastane|rumah sakit|bệnh viện",
    "fever|🤒|I|noun|The baby has a fever.|fiebre|fièvre|жар|حمى|बुखार|ateş|demam|sốt",
    "recovery|💪|A|noun|He made a quick recovery.|recuperación|guérison|выздоровление|تعافٍ|स्वास्थ्य लाभ|iyileşme|pemulihan|hồi phục",
  ],
  work: [
    "office|🏢|B|noun|I go to the office by bus.|oficina|bureau|офис|مكتب|कार्यालय|ofis|kantor|văn phòng",
    "boss|👔|B|noun|My boss is on vacation.|jefe|patron|начальник|مدير|बॉस|patron|bos|sếp",
    "hammer|🔨|B|noun|Hand me the hammer.|martillo|marteau|молоток|مطرقة|हथौड़ा|çekiç|palu|búa",
    "salary|💰|I|noun|She got a higher salary.|salario|salaire|зарплата|راتب|वेतन|maaş|gaji|lương",
    "deadline|⏳|I|noun|The deadline is Friday.|fecha límite|date limite|срок|موعد نهائي|समय सीमा|son tarih|tenggat|hạn chót",
    "colleague|👥|A|noun|My colleague helped me.|colega|collègue|коллега|زميل|सहकर्मी|meslektaş|rekan kerja|đồng nghiệp",
  ],
  home: [
    "bed|🛏️|B|noun|I go to bed at ten.|cama|lit|кровать|سرير|बिस्तर|yatak|tempat tidur|giường",
    "door|🚪|B|noun|Please close the door.|puerta|porte|дверь|باب|दरवाज़ा|kapı|pintu|cửa",
    "chair|🪑|B|noun|Sit on the chair.|silla|chaise|стул|كرسي|कुर्सी|sandalye|kursi|ghế",
    "kitchen|🍳|B|noun|Mom is in the kitchen.|cocina|cuisine|кухня|مطبخ|रसोई|mutfak|dapur|nhà bếp",
    "window|🪟|I|noun|Open the window, please.|ventana|fenêtre|окно|نافذة|खिड़की|pencere|jendela|cửa sổ",
    "furniture|🛋️|A|noun|We bought new furniture.|muebles|meubles|мебель|أثاث|फ़र्नीचर|mobilya|perabot|đồ nội thất",
  ],
  shopping: [
    "shop|🏪|B|noun|The shop opens at nine.|tienda|magasin|магазин|متجر|दुकान|dükkan|toko|cửa hàng",
    "price|🏷️|B|noun|What is the price?|precio|prix|цена|سعر|कीमत|fiyat|harga|giá",
    "cheap|🪙|B|adjective|These shoes are cheap.|barato|bon marché|дешёвый|رخيص|सस्ता|ucuz|murah|rẻ",
    "basket|🧺|B|noun|Put the fruit in the basket.|cesta|panier|корзина|سلة|टोकरी|sepet|keranjang|giỏ",
    "receipt|🧾|I|noun|Keep the receipt.|recibo|reçu|чек|إيصال|रसीद|fiş|struk|hóa đơn",
    "discount|💸|A|noun|There is a 20% discount.|descuento|réduction|скидка|خصم|छूट|indirim|diskon|giảm giá",
  ],
  transport: [
    "car|🚗|B|noun|My car is red.|coche|voiture|машина|سيارة|कार|araba|mobil|xe hơi",
    "bus|🚌|B|noun|The bus is late.|autobús|bus|автобус|حافلة|बस|otobüs|bus|xe buýt",
    "bicycle|🚲|B|noun|I ride my bicycle to work.|bicicleta|vélo|велосипед|دراجة|साइकिल|bisiklet|sepeda|xe đạp",
    "train|🚆|B|noun|The train leaves at noon.|tren|train|поезд|قطار|ट्रेन|tren|kereta|tàu hỏa",
    "airport|🛫|I|noun|We arrived at the airport early.|aeropuerto|aéroport|аэропорт|مطار|हवाई अड्डा|havalimanı|bandara|sân bay",
    "traffic|🚦|A|noun|Traffic is heavy today.|tráfico|circulation|пробки|زحام مروري|यातायात|trafik|lalu lintas|giao thông",
  ],
  time: [
    "clock|🕰️|B|noun|The clock is on the wall.|reloj|horloge|часы|ساعة|घड़ी|saat|jam|đồng hồ",
    "morning|🌅|B|noun|Good morning!|mañana|matin|утро|صباح|सुबह|sabah|pagi|buổi sáng",
    "night|🌙|B|noun|The stars come out at night.|noche|nuit|ночь|ليل|रात|gece|malam|đêm",
    "calendar|📅|B|noun|Check the calendar.|calendario|calendrier|календарь|تقويم|कैलेंडर|takvim|kalender|lịch",
    "weekend|🎉|I|noun|What are you doing this weekend?|fin de semana|week-end|выходные|عطلة نهاية الأسبوع|सप्ताहांत|hafta sonu|akhir pekan|cuối tuần",
    "century|🏛️|A|noun|This building is a century old.|siglo|siècle|век|قرن|सदी|yüzyıl|abad|thế kỷ",
  ],
};

const LV: Record<string, Level> = { B: "Beginner", I: "Intermediate", A: "Advanced" };

export const WORDS: Word[] = Object.entries(RAW).flatMap(([category, rows]) =>
  rows.map((row) => {
    const [word, image, lv, pos, example, ...t] = row.split("|");
    const tr = Object.fromEntries(LANGS.map((l, i) => [l, t[i]])) as Record<Lang, string>;
    return { id: word.replace(/\s+/g, "-"), word, image, category, level: LV[lv], pos, example, tr };
  }),
);

export const wordById = (id: string) => WORDS.find((w) => w.id === id);
export const LEVEL_ORDER: Level[] = ["Beginner", "Intermediate", "Advanced"];
