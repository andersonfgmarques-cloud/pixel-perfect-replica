import type { Lang } from "./words";

export type FrequencyTranslation = {
  meaning: string;
  example: string;
};

export type FrequencyTranslationEntry = Partial<Record<Lang | "it", FrequencyTranslation>>;

/**
 * Curated translations for the frequency dictionary.
 * Add entries only after checking the meaning, grammatical role and example context.
 * Keys are the Rank values from english-top-5000.csv.
 */
export const FREQUENCY_TRANSLATIONS: Record<number, FrequencyTranslationEntry> = {
  1: {
    "pt-BR": {
      meaning: "você; te; vocês — pronome usado para se dirigir à pessoa com quem se fala",
      example: "Posso ajudar você?",
    },
    es: {
      meaning: "tú; usted; ustedes — pronombre para dirigirse a la persona o personas con quienes se habla",
      example: "¿Puedo ayudarte?",
    },
    fr: {
      meaning: "tu; vous — pronom utilisé pour s’adresser à une ou plusieurs personnes",
      example: "Puis-je vous aider ?",
    },
    ru: {
      meaning: "ты; вы — местоимение для обращения к собеседнику или собеседникам",
      example: "Я могу вам помочь?",
    },
    ar: {
      meaning: "أنتَ؛ أنتِ؛ أنتم — ضمير لمخاطبة الشخص أو الأشخاص",
      example: "هل يمكنني مساعدتك؟",
    },
    hi: {
      meaning: "तुम; आप — जिससे बात की जा रही हो, उसके लिए सर्वनाम",
      example: "क्या मैं आपकी मदद कर सकता हूँ?",
    },
    tr: {
      meaning: "sen; siz — konuşulan kişiye veya kişilere hitap etmek için kullanılan zamir",
      example: "Size yardımcı olabilir miyim?",
    },
    id: {
      meaning: "kamu; Anda; kalian — kata ganti untuk orang yang diajak bicara",
      example: "Ada yang bisa saya bantu?",
    },
    vi: {
      meaning: "bạn; các bạn — đại từ dùng để gọi người đang giao tiếp với mình",
      example: "Tôi có thể giúp bạn không?",
    },
    it: { meaning: "tu; Lei; voi — pronome usato per rivolgersi alla persona o alle persone con cui si parla", example: "Posso aiutarti?" },
  },
  2: {
    "pt-BR": { meaning: "eu — pronome que identifica quem fala ou escreve como sujeito da frase", example: "Eu levei minha irmã e a mim mesma de carro até a escola." },
    es: { meaning: "yo — pronombre que identifica a quien habla o escribe como sujeto de la oración", example: "Llevé a mi hermana y a mí mismo a la escuela en coche." },
    fr: { meaning: "je — pronom qui désigne la personne qui parle ou écrit en tant que sujet", example: "J’ai conduit ma sœur et moi-même à l’école." },
    ru: { meaning: "я — местоимение, обозначающее говорящего или пишущего в роли подлежащего", example: "Я отвёз сестру и себя в школу." },
    ar: { meaning: "أنا — ضمير يدل على المتكلم عندما يكون فاعل الجملة", example: "أوصلت أختي ونفسي إلى المدرسة بالسيارة." },
    hi: { meaning: "मैं — बोलने या लिखने वाले व्यक्ति के लिए कर्ता रूप में प्रयुक्त सर्वनाम", example: "मैं अपनी बहन और खुद को गाड़ी से स्कूल ले गया।" },
    tr: { meaning: "ben — konuşan veya yazan kişiyi cümlenin öznesi olarak belirten zamir", example: "Kız kardeşimi ve kendimi arabayla okula götürdüm." },
    id: { meaning: "saya; aku — kata ganti orang yang berbicara atau menulis sebagai subjek kalimat", example: "Saya mengantar saudara perempuan saya dan diri saya sendiri ke sekolah dengan mobil." },
    vi: { meaning: "tôi; mình — đại từ chỉ người đang nói hoặc viết khi làm chủ ngữ", example: "Tôi lái xe đưa chị/em gái và bản thân mình đến trường." }
    it: { meaning: "io — pronome che indica chi parla o scrive quando svolge la funzione di soggetto", example: "Ho accompagnato mia sorella e me stesso a scuola in macchina." },
  },
  3: {
    "pt-BR": { meaning: "ser; estar — verbo auxiliar usado com o particípio passado para formar a voz passiva", example: "Ele se foi." },
    es: { meaning: "ser; estar — verbo auxiliar que se usa con participios para formar la voz pasiva", example: "Él se ha ido." },
    fr: { meaning: "être — auxiliaire utilisé avec le participe passé pour former la voix passive", example: "Il est parti." },
    ru: { meaning: "быть — вспомогательный глагол, используемый с причастием прошедшего времени для образования пассивного залога", example: "Его уже нет." },
    ar: { meaning: "يكون — فعل مساعد يُستخدم مع اسم المفعول لتكوين المبني للمجهول", example: "لقد رحل." },
    hi: { meaning: "होना — कर्मवाच्य बनाने के लिए past participle के साथ प्रयुक्त सहायक क्रिया", example: "वह जा चुका है।" },
    tr: { meaning: "olmak — edilgen çatıyı oluşturmak için fiillerin geçmiş zaman ortacıyla kullanılan yardımcı fiil", example: "O gitmiş." },
    id: { meaning: "adalah; menjadi — kata kerja bantu yang digunakan bersama past participle untuk membentuk kalimat pasif", example: "Dia sudah pergi." },
    vi: { meaning: "là; thì; được — trợ động từ dùng với quá khứ phân từ để tạo câu bị động", example: "Anh ấy đã đi rồi." }
    it: { meaning: "essere — verbo ausiliare usato con il participio passato per formare la forma passiva", example: "Se n'è andato." },
  },
  4: {
    "pt-BR": { meaning: "o; a; os; as — artigo definido usado quando o referente é específico ou já é conhecido", example: "Que vença o melhor!" },
    es: { meaning: "el; la; los; las — artículo definido que indica que el referente es específico o conocido", example: "¡Que gane el mejor!" },
    fr: { meaning: "le; la; les — article défini qui indique que le nom désigne quelque chose de précis ou déjà identifié", example: "Que le meilleur gagne !" },
    ru: { meaning: "определённый артикль — указывает на конкретный или уже известный предмет; в русском отдельного артикля нет", example: "Пусть победит лучший!" },
    ar: { meaning: "الـ — أداة التعريف التي تدل على أن الاسم محدد أو معروف", example: "ليفز الأفضل!" },
    hi: { meaning: "निश्चित लेख — किसी विशेष या पहले से ज्ञात संज्ञा को दर्शाता है; हिंदी में इसका सीधा अलग रूप नहीं है", example: "बेहतर व्यक्ति की जीत हो!" },
    tr: { meaning: "belirli tanımlık — ismin belirli veya bilinen bir varlığı ifade ettiğini gösterir; Türkçede ayrı bir artikel yoktur", example: "En iyi olan kazansın!" },
    id: { meaning: "kata sandang tertentu — menandai nomina yang sudah jelas atau dapat dikenali; bahasa Indonesia tidak memiliki artikel tertentu yang setara", example: "Semoga yang terbaik menang!" },
    vi: { meaning: "mạo từ xác định — cho biết danh từ chỉ đối tượng cụ thể hoặc đã được nhắc đến; tiếng Việt không có mạo từ tương đương trực tiếp", example: "Mong người giỏi nhất sẽ thắng!" }
    it: { meaning: "il; lo; la; i; gli; le — articolo determinativo che indica qualcosa di specifico o già noto", example: "Che vinca il migliore!" },
  },
  5: {
    "pt-BR": { meaning: "para; a — preposição que indica direção ou destino", example: "Quero ir embora." },
    es: { meaning: "a; hacia — preposición que indica dirección o destino", example: "Quiero irme." },
    fr: { meaning: "vers; à — préposition qui indique une direction ou une destination", example: "Je veux partir." },
    ru: { meaning: "к; в; на — предлог, обозначающий направление или цель движения", example: "Я хочу уйти." },
    ar: { meaning: "إلى — حرف جر يدل على الاتجاه أو الوجهة", example: "أريد أن أغادر." },
    hi: { meaning: "की ओर; को — दिशा या गंतव्य बताने वाला संबंधसूचक शब्द", example: "मैं जाना चाहता हूँ।" },
    tr: { meaning: "-e/-a; -e doğru — yön veya varış noktası bildiren edat", example: "Gitmek istiyorum." },
    id: { meaning: "ke; menuju — kata depan yang menunjukkan arah atau tujuan", example: "Saya ingin pergi." },
    vi: { meaning: "đến; về phía — giới từ chỉ hướng đi hoặc đích đến", example: "Tôi muốn rời đi." }
    it: { meaning: "a; verso — preposizione che indica direzione o destinazione", example: "Voglio andare via." },
  },
  6: {
    "pt-BR": { meaning: "um; uma — artigo indefinido que apresenta um exemplo não especificado", example: "Eles são farinha do mesmo saco." },
    es: { meaning: "un; una — artículo indefinido que presenta un ejemplo no especificado", example: "Son tal para cual." },
    fr: { meaning: "un; une — article indéfini qui désigne un exemple parmi d’autres", example: "Ils sont faits l’un pour l’autre." },
    ru: { meaning: "неопределённый артикль — указывает на один неопределённый предмет; в русском отдельного артикля нет", example: "Они одного поля ягоды." },
    ar: { meaning: "أداة تنكير — تدل على شيء غير محدد؛ وغالبًا لا تُترجم بكلمة مستقلة", example: "إنهما متشابهان تمامًا." },
    hi: { meaning: "अनिश्चित लेख — किसी अनिर्दिष्ट वस्तु या उदाहरण को दर्शाता है; हिंदी में इसका अलग सीधा रूप नहीं है", example: "वे दोनों एक ही तरह के हैं।" },
    tr: { meaning: "belirsiz tanımlık — belirli olmayan bir örneği ifade eder; Türkçede çoğunlukla “bir” ile karşılanır", example: "Onlar birbirinin aynısı." },
    id: { meaning: "artikel tak tentu — memperkenalkan sesuatu yang belum ditentukan; sering setara dengan “sebuah” atau “seorang”", example: "Mereka sangat mirip." },
    vi: { meaning: "mạo từ không xác định — giới thiệu một đối tượng chưa xác định; tiếng Việt thường dùng “một” tùy ngữ cảnh", example: "Họ giống nhau như đúc." }
    it: { meaning: "un; uno; una — articolo indeterminativo che introduce un elemento non specificato", example: "Sono due della stessa pasta." },
  },
  7: {
    "pt-BR": { meaning: "ele; ela; isso — pronome neutro da terceira pessoa para objetos, ideias ou seres não humanos", example: "São 10h45." },
    es: { meaning: "ello; eso; lo — pronombre neutro de tercera persona para objetos, ideas o seres no humanos", example: "Son las 10:45." },
    fr: { meaning: "il; elle; cela — pronom de troisième personne employé pour une chose, une idée ou un être non humain", example: "Il est 10 h 45." },
    ru: { meaning: "оно — местоимение среднего рода для предметов, понятий и существ, не относящихся к человеку", example: "Сейчас 10:45." },
    ar: { meaning: "هو؛ هي؛ ذلك — ضمير الغائب للمفرد، ويُستخدم بحسب جنس الاسم والسياق", example: "الساعة الآن 10:45." },
    hi: { meaning: "यह; वह — वस्तु, विचार या गैर-मानव जीव के लिए तीसरे पुरुष का सर्वनाम", example: "अभी 10:45 बजे हैं।" },
    tr: { meaning: "o — cansız varlıklar, kavramlar veya insan dışındaki canlılar için üçüncü tekil kişi zamiri", example: "Saat 10.45." },
    id: { meaning: "itu; -nya — kata ganti orang ketiga untuk benda, gagasan, atau makhluk bukan manusia", example: "Sekarang pukul 10.45." },
    vi: { meaning: "nó; điều đó — đại từ ngôi thứ ba dùng cho đồ vật, ý niệm hoặc sinh vật không phải con người", example: "Bây giờ là 10 giờ 45." }
    it: { meaning: "esso; essa; ciò — pronome di terza persona usato per oggetti, idee o esseri non umani", example: "Sono le 10:45." },
  },
  8: {
    "pt-BR": { meaning: "e — conjunção usada para ligar palavras ou grupos de palavras", example: "Dois mais dois são quatro." },
    es: { meaning: "y — conjunción que une palabras o grupos de palabras", example: "Dos y dos son cuatro." },
    fr: { meaning: "et — conjonction qui relie des mots ou des groupes de mots", example: "Deux et deux font quatre." },
    ru: { meaning: "и — союз, соединяющий слова или группы слов", example: "Два и два — четыре." },
    ar: { meaning: "و — حرف عطف يربط بين الكلمات أو العبارات", example: "اثنان واثنان يساويان أربعة." },
    hi: { meaning: "और — शब्दों या वाक्यांशों को जोड़ने वाला समुच्चयबोधक", example: "दो और दो चार होते हैं।" },
    tr: { meaning: "ve — sözcükleri veya sözcük gruplarını birbirine bağlayan bağlaç", example: "İki artı iki dört eder." },
    id: { meaning: "dan — kata penghubung untuk menggabungkan kata atau frasa", example: "Dua ditambah dua sama dengan empat." },
    vi: { meaning: "và — liên từ dùng để nối các từ hoặc cụm từ", example: "Hai cộng hai bằng bốn." }
    it: { meaning: "e — congiunzione che collega parole o gruppi di parole", example: "Due più due fa quattro." },
  },
  9: {
    "pt-BR": { meaning: "que — conjunção que introduz uma oração que funciona como complemento de um verbo", example: "Insisto que você venha." },
    es: { meaning: "que — conjunción que introduce una oración subordinada que complementa un verbo", example: "Insisto en que vengas." },
    fr: { meaning: "que — conjonction qui introduit une proposition complément d’un verbe", example: "J’insiste pour que tu viennes." },
    ru: { meaning: "что — союз, вводящий придаточное изъяснительное после глагола речи, мысли или восприятия", example: "Я настаиваю, чтобы ты пришёл." },
    ar: { meaning: "أن — أداة ربط تُدخل جملة تابعة تكمل معنى الفعل", example: "أصرّ على أن تأتي." },
    hi: { meaning: "कि — समुच्चयबोधक जो क्रिया के पूरक उपवाक्य को प्रस्तुत करता है", example: "मैं ज़ोर देता हूँ कि तुम आओ।" },
    tr: { meaning: "ki — bir fiilin nesnesi olan yan cümleyi başlatan bağlaç", example: "Gelmen konusunda ısrar ediyorum." },
    id: { meaning: "bahwa — kata penghubung yang memperkenalkan klausa pelengkap setelah kata kerja", example: "Saya bersikeras agar kamu datang." },
    vi: { meaning: "rằng — từ nối mở đầu mệnh đề bổ sung ý cho động từ", example: "Tôi khăng khăng rằng bạn phải đến." }
    it: { meaning: "che — congiunzione che introduce una proposizione subordinata completiva", example: "Insisto perché tu venga." },
  },
  10: {
    "pt-BR": { meaning: "desde; de — preposição que indica origem ou ponto inicial no tempo", example: "Que absurdo!" },
    es: { meaning: "desde; de — preposición que indica origen o un punto de partida en el tiempo", example: "¡Qué disparate!" },
    fr: { meaning: "depuis; de — préposition qui indique une origine ou un point de départ dans le temps", example: "Quelle absurdité !" },
    ru: { meaning: "с; из — предлог, обозначающий происхождение или начальный момент времени", example: "Какая чепуха!" },
    ar: { meaning: "منذ؛ من — حرف جر يدل على المصدر أو نقطة البداية الزمنية", example: "يا له من هراء!" },
    hi: { meaning: "से — स्रोत या समय की शुरुआत बताने वाला संबंधसूचक शब्द", example: "कितनी बकवास है!" },
    tr: { meaning: "-den/-dan; -den beri — kaynak veya başlangıç zamanını belirten edat", example: "Ne saçmalık!" },
    id: { meaning: "dari; sejak — kata depan yang menunjukkan asal atau titik awal waktu", example: "Omong kosong sekali!" },
    vi: { meaning: "từ — giới từ chỉ nguồn gốc hoặc thời điểm bắt đầu", example: "Thật là vô lý!" }
    it: { meaning: "da; da quando — preposizione che indica origine o punto iniziale nel tempo", example: "Che assurdità!" },
  },
};
