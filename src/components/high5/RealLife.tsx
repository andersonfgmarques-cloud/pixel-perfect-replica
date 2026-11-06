import { useMemo, useState } from "react";
import { ArrowLeft, Volume2, Play, Pause, ChevronUp, ChevronDown, CheckCircle2, RotateCcw, Clapperboard, Captions } from "lucide-react";
import { LANG_NAMES, type Lang } from "@/lib/words";
import { useSpeak } from "@/lib/store";
import { useTranslation } from "@/lib/translation";

type Line = { speaker: string; en: string; ipa: string; translations: Partial<Record<Lang, string>> };
type Scene = {
  id: string; category: string; title: string; level: string; duration: string;
  emoji: string; setting: string; gradient: string; video?: string; lines: Line[];
  question: string; options: string[]; answer: number; explanation: string;
};

const SCENES: Scene[] = [
  {
    id: "coffee-shop", category: "Daily life", title: "Ordering a coffee", level: "A1", duration: "35 sec",
    emoji: "☕", setting: "A cosy coffee shop", gradient: "from-amber-950 via-orange-900 to-stone-950",
    lines: [
      { speaker: "BARISTA", en: "Good morning! What can I get you?", ipa: "/ɡʊd ˈmɔːnɪŋ | wɒt kən aɪ ɡet juː/", translations: { "pt-BR": "Bom dia! O que vai querer?", es: "¡Buenos días! ¿Qué le pongo?", fr: "Bonjour ! Que puis-je vous servir ?", it: "Buongiorno! Cosa posso servirle?" } },
      { speaker: "YOU", en: "A coffee with milk, please.", ipa: "/ə ˈkɒfi wɪð mɪlk pliːz/", translations: { "pt-BR": "Um café com leite, por favor.", es: "Un café con leche, por favor.", fr: "Un café au lait, s'il vous plaît.", it: "Un caffè con latte, per favore." } },
      { speaker: "BARISTA", en: "Sure. Anything else?", ipa: "/ʃɔː | ˈeniθɪŋ els/", translations: { "pt-BR": "Claro. Mais alguma coisa?", es: "Claro. ¿Algo más?", fr: "Bien sûr. Autre chose ?", it: "Certo. Altro?" } },
      { speaker: "YOU", en: "That's all, thanks.", ipa: "/ðæts ɔːl | θæŋks/", translations: { "pt-BR": "Só isso, obrigado.", es: "Eso es todo, gracias.", fr: "Ce sera tout, merci.", it: "Tutto qui, grazie." } }
    ],
    question: "What does the customer order?", options: ["A tea", "Coffee with milk", "A sandwich"], answer: 1,
    explanation: "“Coffee with milk” significa “café com leite”.",
  },
  {
    id: "directions", category: "Travel", title: "Asking for directions", level: "A1", duration: "40 sec",
    emoji: "🗺️", setting: "On a city street", gradient: "from-sky-950 via-blue-900 to-slate-950",
    lines: [
      { speaker: "YOU", en: "Excuse me, where is the train station?", ipa: "/ɪkˈskjuːz miː | weər ɪz ðə treɪn ˈsteɪʃən/", translations: { "pt-BR": "Com licença, onde fica a estação de trem?", es: "Disculpe, ¿dónde está la estación de tren?", fr: "Excusez-moi, où est la gare ?", it: "Mi scusi, dov'è la stazione?" } },
      { speaker: "LOCAL", en: "Go straight and turn left.", ipa: "/ɡəʊ streɪt ən tɜːn left/", translations: { "pt-BR": "Siga em frente e vire à esquerda.", es: "Siga recto y gire a la izquierda.", fr: "Allez tout droit et tournez à gauche.", it: "Vada dritto e giri a sinistra." } },
      { speaker: "YOU", en: "Is it far from here?", ipa: "/ɪz ɪt fɑː frəm hɪə/", translations: { "pt-BR": "É longe daqui?", es: "¿Está lejos de aquí?", fr: "Est-ce loin d'ici ?", it: "È lontano da qui?" } },
      { speaker: "LOCAL", en: "No, about five minutes on foot.", ipa: "/nəʊ | əˈbaʊt faɪv ˈmɪnɪts ɒn fʊt/", translations: { "pt-BR": "Não, cerca de cinco minutos a pé.", es: "No, unos cinco minutos a pie.", fr: "Non, environ cinq minutes à pied.", it: "No, circa cinque minuti a piedi." } }
    ],
    question: "How long does it take to get there?", options: ["Five minutes on foot", "Twenty minutes by bus", "One hour"], answer: 0,
    explanation: "“On foot” significa “a pé”."
  },
  {
    id: "work", category: "Work", title: "Meeting a colleague", level: "A2", duration: "30 sec",
    emoji: "💼", setting: "At the office", gradient: "from-indigo-950 via-violet-900 to-slate-950",
    lines: [
      { speaker: "COLLEAGUE", en: "Hi! Are you new here?", ipa: "/haɪ | ɑː juː njuː hɪə/", translations: { "pt-BR": "Oi! Você é novo por aqui?", es: "¡Hola! ¿Eres nuevo aquí?", fr: "Salut ! Tu es nouveau ici ?", it: "Ciao! Sei nuovo qui?" } },
      { speaker: "YOU", en: "Yes, it's my first day.", ipa: "/jes | ɪts maɪ fɜːst deɪ/", translations: { "pt-BR": "Sim, é meu primeiro dia.", es: "Sí, es mi primer día.", fr: "Oui, c'est mon premier jour.", it: "Sì, è il mio primo giorno." } },
      { speaker: "COLLEAGUE", en: "Welcome to the team!", ipa: "/ˈwelkəm tə ðə tiːm/", translations: { "pt-BR": "Bem-vindo à equipe!", es: "¡Bienvenido al equipo!", fr: "Bienvenue dans l'équipe !", it: "Benvenuto nel team!" } }
    ],
    question: "Is it the person's first day?", options: ["No, the second day", "Yes, the first day", "We don't know"], answer: 1,
    explanation: "“It's my first day” significa “É meu primeiro dia”."
  }
];

const extra = (
  id: string, category: string, title: string, level: string, emoji: string, setting: string, gradient: string,
  lines: [string, string, string, string][], question: string, options: string[], answer: number, explanation: string
): Scene => ({
  id, category, title, level, duration: "35 sec", emoji, setting, gradient,
  lines: lines.map(([speaker, en, ipa, pt]) => ({ speaker, en, ipa, translations: { "pt-BR": pt } })),
  question, options, answer, explanation
});

const EXTRA_SCENES: Scene[] = [
  extra("daily-wake-up","Daily life","Getting ready in the morning","A1","⏰","At home","from-orange-950 via-rose-900 to-stone-950",[
    ["MUM","It's time to get up!","/ɪts taɪm tə ɡet ʌp/","Está na hora de levantar!"],
    ["YOU","Just five more minutes, please.","/dʒʌst faɪv mɔː ˈmɪnɪts pliːz/","Só mais cinco minutos, por favor."],
    ["MUM","You'll be late for work.","/juːl bi leɪt fə wɜːk/","Você vai se atrasar para o trabalho."]
  ],"Why should the person get up?",["They will be late for work","It is lunchtime","The bus is here"],0,"“You'll be late” significa “Você vai se atrasar”."),
  extra("daily-breakfast","Daily life","Having breakfast","A1","🍳","In the kitchen","from-yellow-950 via-amber-900 to-stone-950",[
    ["YOU","Would you like some toast?","/wʊd juː laɪk səm təʊst/","Você gostaria de uma torrada?"],
    ["PARTNER","Yes, please. And a cup of tea.","/jes pliːz | ən ə kʌp əv tiː/","Sim, por favor. E uma xícara de chá."],
    ["YOU","Here you are.","/hɪə juː ɑː/","Aqui está."]
  ],"What does the other person want to drink?",["Coffee","Tea","Water"],1,"“A cup of tea” significa “uma xícara de chá”."),
  extra("daily-bus","Daily life","Taking the bus","A1","🚌","At the bus stop","from-cyan-950 via-teal-900 to-slate-950",[
    ["YOU","Does this bus go to the town centre?","/dʌz ðɪs bʌs ɡəʊ tə ðə taʊn ˈsentə/","Este ônibus vai para o centro da cidade?"],
    ["DRIVER","Yes, it does. Get on here.","/jes ɪt dʌz | ɡet ɒn hɪə/","Sim. Pode entrar aqui."],
    ["YOU","How much is a ticket?","/haʊ mʌtʃ ɪz ə ˈtɪkɪt/","Quanto custa uma passagem?"]
  ],"Where does the bus go?",["The airport","The town centre","The railway museum"],1,"“Town centre” é “centro da cidade”."),
  extra("daily-weather","Daily life","Talking about the weather","A1","🌦️","Outside the house","from-sky-950 via-blue-800 to-indigo-950",[
    ["A","It's quite cold today, isn't it?","/ɪts kwaɪt kəʊld təˈdeɪ | ˈɪzənt ɪt/","Está bem frio hoje, não está?"],
    ["B","Yes. I think it's going to rain.","/jes | aɪ θɪŋk ɪts ˈɡəʊɪŋ tə reɪn/","Sim. Acho que vai chover."],
    ["A","I'd better take an umbrella.","/aɪd ˈbetə teɪk ən ʌmˈbrelə/","É melhor eu levar um guarda-chuva."]
  ],"What will the person take?",["A coat","An umbrella","A suitcase"],1,"“Umbrella” significa “guarda-chuva”."),
  extra("travel-hotel","Travel","Checking into a hotel","A2","🏨","At the hotel reception","from-blue-950 via-indigo-900 to-slate-950",[
    ["RECEPTIONIST","Good evening. Do you have a reservation?","/ɡʊd ˈiːvnɪŋ | də juː hæv ə ˌrezəˈveɪʃən/","Boa noite. Você tem uma reserva?"],
    ["GUEST","Yes, it's under the name Silva.","/jes | ɪts ˈʌndə ðə neɪm ˈsɪlvə/","Sim, está no nome de Silva."],
    ["RECEPTIONIST","May I see your passport, please?","/meɪ aɪ siː jɔː ˈpɑːspɔːt pliːz/","Posso ver seu passaporte, por favor?"]
  ],"What is the reservation under?",["The name Silva","The name Smith","No name"],0,"“Under the name” significa “em nome de”."),
  extra("travel-airport","Travel","At the airport check-in","A2","✈️","Airport check-in desk","from-sky-950 via-cyan-900 to-slate-950",[
    ["AGENT","May I see your passport and ticket?","/meɪ aɪ siː jɔː ˈpɑːspɔːt ən ˈtɪkɪt/","Posso ver seu passaporte e sua passagem?"],
    ["PASSENGER","Of course. Here they are.","/əv kɔːs | hɪə ðeɪ ɑː/","Claro. Aqui estão."],
    ["AGENT","Are you checking in any bags?","/ɑː juː ˈtʃekɪŋ ɪn ˈeni bæɡz/","Vai despachar alguma bagagem?"]
  ],"What does the agent ask about?",["A hotel","Checked luggage","A taxi"],1,"“Checking in bags” é “despachar bagagem”."),
  extra("travel-taxi","Travel","Taking a taxi","A1","🚕","Outside the station","from-yellow-950 via-orange-900 to-stone-950",[
    ["DRIVER","Where would you like to go?","/weə wʊd juː laɪk tə ɡəʊ/","Para onde você gostaria de ir?"],
    ["YOU","To the city centre, please.","/tə ðə ˈsɪti ˈsentə pliːz/","Para o centro da cidade, por favor."],
    ["DRIVER","Certainly. It'll take about ten minutes.","/ˈsɜːtənli | ɪtl teɪk əˈbaʊt ten ˈmɪnɪts/","Certamente. Vai levar cerca de dez minutos."]
  ],"How long will the journey take?",["Ten minutes","Thirty minutes","An hour"],0,"“It'll take” significa “vai levar”."),
  extra("travel-train","Travel","Buying a train ticket","A2","🚆","At the ticket office","from-emerald-950 via-teal-900 to-slate-950",[
    ["CLERK","Single or return?","/ˈsɪŋɡəl ɔː rɪˈtɜːn/","Só ida ou ida e volta?"],
    ["YOU","A return ticket to London, please.","/ə rɪˈtɜːn ˈtɪkɪt tə ˈlʌndən pliːz/","Uma passagem de ida e volta para Londres, por favor."],
    ["CLERK","The next train leaves at half past ten.","/ðə nekst treɪn liːvz ət hɑːf pɑːst ten/","O próximo trem sai às dez e meia."]
  ],"When does the next train leave?",["At ten o'clock","At half past ten","At eleven"],1,"“Half past ten” significa “dez e meia”."),
  extra("travel-lost","Travel","Asking for help when lost","A2","📍","In an unfamiliar neighbourhood","from-violet-950 via-fuchsia-900 to-slate-950",[
    ["YOU","I'm afraid I'm lost. Can you help me?","/aɪm əˈfreɪd aɪm lɒst | kən juː help miː/","Acho que estou perdido. Você pode me ajudar?"],
    ["LOCAL","Of course. Where are you trying to go?","/əv kɔːs | weə ɑː juː ˈtraɪɪŋ tə ɡəʊ/","Claro. Para onde você está tentando ir?"],
    ["YOU","I'm looking for the museum.","/aɪm ˈlʊkɪŋ fə ðə mjuˈziːəm/","Estou procurando o museu."]
  ],"What place is the person looking for?",["The museum","The hotel","The station"],0,"“I'm looking for” significa “Estou procurando”."),
  extra("work-late","Work","Explaining that you're late","A2","⌚","At the office","from-slate-950 via-blue-900 to-indigo-950",[
    ["YOU","Sorry I'm late. The traffic was terrible.","/ˈsɒri aɪm leɪt | ðə ˈtræfɪk wəz ˈterəbəl/","Desculpe pelo atraso. O trânsito estava terrível."],
    ["MANAGER","That's all right. Are you okay?","/ðæts ɔːl raɪt | ɑː juː əʊˈkeɪ/","Tudo bem. Está tudo certo?"],
    ["YOU","Yes, thank you. It won't happen again.","/jes θæŋk juː | ɪt wəʊnt ˈhæpən əˈɡen/","Sim, obrigado. Não vai acontecer novamente."]
  ],"Why is the person late?",["The traffic","The weather","The train ticket"],0,"“The traffic was terrible” significa “O trânsito estava terrível”."),
  extra("work-meeting","Work","Joining a meeting","A2","🗣️","In a meeting room","from-indigo-950 via-sky-900 to-slate-950",[
    ["MANAGER","Shall we get started?","/ʃæl wiː ɡet ˈstɑːtɪd/","Podemos começar?"],
    ["YOU","Yes. I've got the report ready.","/jes | aɪv ɡɒt ðə rɪˈpɔːt ˈredi/","Sim. Estou com o relatório pronto."],
    ["MANAGER","Great. Could you share it with everyone?","/ɡreɪt | kʊd juː ʃeər ɪt wɪð ˈevriwʌn/","Ótimo. Você poderia compartilhá-lo com todos?"]
  ],"What is ready?",["The report","The lunch","The presentation room"],0,"“I've got the report ready” significa “Estou com o relatório pronto”."),
  extra("work-help","Work","Asking a colleague for help","A2","🤝","At a desk","from-teal-950 via-emerald-900 to-slate-950",[
    ["YOU","Could you give me a hand with this task?","/kʊd juː ɡɪv miː ə hænd wɪð ðɪs tɑːsk/","Você poderia me dar uma ajuda com esta tarefa?"],
    ["COLLEAGUE","Of course. What do you need?","/əv kɔːs | wɒt də juː niːd/","Claro. Do que você precisa?"],
    ["YOU","I don't understand this part.","/aɪ dəʊnt ˌʌndəˈstænd ðɪs pɑːt/","Não entendo esta parte."]
  ],"What does the person need?",["Help with a task","A day off","A new computer"],0,"“Give me a hand” é uma expressão informal para “me ajudar”."),
  extra("work-break","Work","Talking about a break","A1","☕","In the staff room","from-amber-950 via-orange-900 to-stone-950",[
    ["COLLEAGUE","Would you like to take a break?","/wʊd juː laɪk tə teɪk ə breɪk/","Você gostaria de fazer uma pausa?"],
    ["YOU","Yes, that sounds good.","/jes | ðæt saʊndz ɡʊd/","Sim, parece uma boa ideia."],
    ["COLLEAGUE","Let's get a cup of tea.","/lets ɡet ə kʌp əv tiː/","Vamos tomar uma xícara de chá."]
  ],"What do they decide to do?",["Keep working","Take a break","Go home"],1,"“Take a break” significa “fazer uma pausa”."),
  extra("shopping-size","Shopping","Finding the right size","A2","👕","In a clothes shop","from-fuchsia-950 via-rose-900 to-slate-950",[
    ["CUSTOMER","Do you have this in a medium?","/də juː hæv ðɪs ɪn ə ˈmiːdiəm/","Você tem isto no tamanho médio?"],
    ["ASSISTANT","Let me check for you.","/let miː tʃek fə juː/","Deixe-me verificar para você."],
    ["ASSISTANT","Yes, here's a medium.","/jes | hɪəz ə ˈmiːdiəm/","Sim, aqui está um tamanho médio."]
  ],"Which size does the customer want?",["Small","Medium","Large"],1,"“In a medium” significa “no tamanho médio”."),
  extra("shopping-price","Shopping","Asking about the price","A1","🏷️","In a shop","from-lime-950 via-green-900 to-stone-950",[
    ["YOU","Excuse me, how much is this?","/ɪkˈskjuːz miː | haʊ mʌtʃ ɪz ðɪs/","Com licença, quanto custa isto?"],
    ["ASSISTANT","It's twenty pounds.","/ɪts ˈtwenti paʊndz/","Custa vinte libras."],
    ["YOU","All right. I'll take it.","/ɔːl raɪt | aɪl teɪk ɪt/","Tudo bem. Vou levar."]
  ],"How much does it cost?",["Ten pounds","Twenty pounds","Thirty pounds"],1,"“I'll take it” significa “Vou levar”."),
  extra("shopping-supermarket","Shopping","At the supermarket","A1","🛒","In the supermarket","from-green-950 via-emerald-900 to-teal-950",[
    ["YOU","Where can I find the milk?","/weə kən aɪ faɪnd ðə mɪlk/","Onde posso encontrar o leite?"],
    ["STAFF","It's in aisle three, next to the cheese.","/ɪts ɪn aɪl θriː | nekst tə ðə tʃiːz/","Fica no corredor três, ao lado do queijo."],
    ["YOU","Thank you very much.","/θæŋk juː ˈveri mʌtʃ/","Muito obrigado."]
  ],"Where is the milk?",["Aisle one","Aisle two","Aisle three"],2,"“Aisle” significa “corredor” de supermercado."),
  extra("shopping-card","Shopping","Paying by card","A1","💳","At the till","from-cyan-950 via-blue-900 to-indigo-950",[
    ["CASHIER","How would you like to pay?","/haʊ wʊd juː laɪk tə peɪ/","Como gostaria de pagar?"],
    ["YOU","By card, please.","/baɪ kɑːd pliːz/","Com cartão, por favor."],
    ["CASHIER","Please enter your PIN.","/pliːz ˈentə jɔː pɪn/","Por favor, digite sua senha."]
  ],"How will the customer pay?",["In cash","By card","By cheque"],1,"“By card” significa “com cartão”."),
  extra("shopping-return","Shopping","Returning an item","B1","🧾","At customer service","from-purple-950 via-violet-900 to-slate-950",[
    ["CUSTOMER","I'd like to return this shirt.","/aɪd laɪk tə rɪˈtɜːn ðɪs ʃɜːt/","Gostaria de devolver esta camisa."],
    ["STAFF","Is there anything wrong with it?","/ɪz ðeər ˈeniθɪŋ rɒŋ wɪð ɪt/","Há algum defeito nela?"],
    ["CUSTOMER","No, it's just the wrong size.","/nəʊ | ɪts dʒʌst ðə rɒŋ saɪz/","Não, é apenas o tamanho errado."]
  ],"Why is the customer returning the shirt?",["It is damaged","It is the wrong size","It is too expensive"],1,"“Wrong size” significa “tamanho errado”."),
  extra("social-introductions","Social Life","Introducing yourself","A1","👋","At a social event","from-pink-950 via-rose-900 to-slate-950",[
    ["A","Hello, I'm Alex. What's your name?","/həˈləʊ | aɪm ˈæleks | wɒts jɔː neɪm/","Olá, sou Alex. Qual é o seu nome?"],
    ["B","I'm Daniel. Nice to meet you.","/aɪm ˈdænjəl | naɪs tə miːt juː/","Sou Daniel. Prazer em conhecer você."],
    ["A","Nice to meet you too.","/naɪs tə miːt juː tuː/","O prazer é meu."]
  ],"What is the other person's name?",["Alex","Daniel","Sam"],1,"“Nice to meet you” significa “Prazer em conhecer você”."),
  extra("social-weekend","Social Life","Making weekend plans","A2","🎉","Talking with a friend","from-violet-950 via-purple-900 to-fuchsia-950",[
    ["A","Are you free this Saturday?","/ɑː juː friː ðɪs ˈsætədeɪ/","Você está livre neste sábado?"],
    ["B","Yes, I don't have any plans.","/jes | aɪ dəʊnt hæv ˈeni plænz/","Sim, não tenho nenhum compromisso."],
    ["A","Would you like to go to the cinema?","/wʊd juː laɪk tə ɡəʊ tə ðə ˈsɪnəmə/","Você gostaria de ir ao cinema?"]
  ],"What are they planning to do?",["Go to the cinema","Go shopping","Have lunch"],0,"“Are you free?” significa “Você está livre?”."),
  extra("social-invitation","Social Life","Accepting an invitation","A2","🎂","On the phone","from-rose-950 via-pink-900 to-slate-950",[
    ["FRIEND","Would you like to come to my birthday party?","/wʊd juː laɪk tə kʌm tə maɪ ˈbɜːθdeɪ ˈpɑːti/","Você gostaria de vir à minha festa de aniversário?"],
    ["YOU","I'd love to. What time does it start?","/aɪd lʌv tə | wɒt taɪm dʌz ɪt stɑːt/","Adoraria. A que horas começa?"],
    ["FRIEND","At seven in the evening.","/ət ˈsevən ɪn ði ˈiːvnɪŋ/","Às sete da noite."]
  ],"What time does the party start?",["At five","At six","At seven"],2,"“I'd love to” é uma forma natural de aceitar um convite."),
  extra("social-thanks","Social Life","Thanking someone","A1","🙏","After receiving a gift","from-amber-950 via-yellow-900 to-stone-950",[
    ["YOU","Thank you so much for the present!","/θæŋk juː səʊ mʌtʃ fə ðə ˈprezənt/","Muito obrigado pelo presente!"],
    ["FRIEND","You're very welcome. I'm glad you like it.","/jɔː ˈveri ˈwelkəm | aɪm ɡlæd juː laɪk ɪt/","Por nada. Fico feliz que você tenha gostado."],
    ["YOU","It's exactly what I wanted.","/ɪts ɪɡˈzæktli wɒt aɪ ˈwɒntɪd/","É exatamente o que eu queria."]
  ],"What did the person receive?",["A present","A letter","A meal"],0,"“You're welcome” é uma resposta comum a “thank you”."),
  extra("social-apology","Social Life","Apologising to a friend","A2","💬","In a park","from-sky-950 via-indigo-900 to-slate-950",[
    ["YOU","I'm sorry I forgot to call you.","/aɪm ˈsɒri aɪ fəˈɡɒt tə kɔːl juː/","Desculpe por ter esquecido de ligar para você."],
    ["FRIEND","That's okay. I was busy too.","/ðæts əʊˈkeɪ | aɪ wəz ˈbɪzi tuː/","Tudo bem. Eu também estava ocupado."],
    ["YOU","Thanks for understanding.","/θæŋks fə ˌʌndəˈstændɪŋ/","Obrigado por compreender."]
  ],"What did the person forget to do?",["Send a message","Make a call","Buy a gift"],1,"“I forgot to call” significa “Esqueci de ligar”."),
  extra("emergency-doctor","Emergencies","Asking for a doctor","A2","🩺","At a reception desk","from-red-950 via-rose-900 to-slate-950",[
    ["YOU","I need to see a doctor, please.","/aɪ niːd tə siː ə ˈdɒktə pliːz/","Preciso consultar um médico, por favor."],
    ["RECEPTIONIST","What's the matter?","/wɒts ðə ˈmætə/","O que aconteceu?"],
    ["YOU","I have a bad headache.","/aɪ hæv ə bæd ˈhedeɪk/","Estou com uma forte dor de cabeça."]
  ],"What is the problem?",["A headache","A broken phone","A lost bag"],0,"“Headache” significa “dor de cabeça”."),
  extra("emergency-police","Emergencies","Reporting a lost wallet","A2","👮","At a police station","from-slate-950 via-gray-800 to-blue-950",[
    ["YOU","I've lost my wallet.","/aɪv lɒst maɪ ˈwɒlɪt/","Perdi minha carteira."],
    ["OFFICER","Where did you last see it?","/weə dɪd juː lɑːst siː ɪt/","Onde você a viu pela última vez?"],
    ["YOU","I think it was on the bus.","/aɪ θɪŋk ɪt wəz ɒn ðə bʌs/","Acho que foi no ônibus."]
  ],"Where does the person think they lost the wallet?",["At home","On the bus","At work"],1,"“Wallet” significa “carteira” (de dinheiro)."),
  extra("emergency-pharmacy","Emergencies","At the pharmacy","A2","💊","At a pharmacy counter","from-emerald-950 via-green-900 to-slate-950",[
    ["YOU","Do you have anything for a sore throat?","/də juː hæv ˈeniθɪŋ fə ə sɔː θrəʊt/","Você tem algo para dor de garganta?"],
    ["PHARMACIST","Yes. I can show you some options.","/jes | aɪ kən ʃəʊ juː səm ˈɒpʃənz/","Sim. Posso mostrar algumas opções."],
    ["YOU","Thank you. I'll ask the pharmacist for advice.","/θæŋk juː | aɪl ɑːsk ðə ˈfɑːməsɪst fə ədˈvaɪs/","Obrigado. Vou pedir orientação ao farmacêutico."]
  ],"Where are they speaking?",["At a pharmacy","At a bank","At a station"],0,"“Sore throat” significa “dor de garganta”."),
  extra("emergency-no-understand","Emergencies","Asking someone to speak slowly","A1","🗣️","In a busy street","from-orange-950 via-red-900 to-stone-950",[
    ["YOU","Sorry, I don't understand.","/ˈsɒri | aɪ dəʊnt ˌʌndəˈstænd/","Desculpe, não entendo."],
    ["LOCAL","Would you like me to repeat that?","/wʊd juː laɪk miː tə rɪˈpiːt ðæt/","Você gostaria que eu repetisse?"],
    ["YOU","Yes, please. Could you speak more slowly?","/jes pliːz | kʊd juː spiːk mɔː ˈsləʊli/","Sim, por favor. Poderia falar mais devagar?"]
  ],"What does the person ask for?",["A louder voice","Slower speech","A written letter"],1,"“Speak more slowly” significa “falar mais devagar”."),
  extra("emergency-help","Emergencies","Calling for help","A1","🆘","In a public place","from-red-950 via-orange-900 to-stone-950",[
    ["YOU","Please help me! It's an emergency.","/pliːz help miː | ɪts ən ɪˈmɜːdʒənsi/","Por favor, me ajude! É uma emergência."],
    ["PASSER-BY","What's happened?","/wɒts ˈhæpənd/","O que aconteceu?"],
    ["YOU","Someone has fallen. Please call an ambulance.","/ˈsʌmwʌn hæz ˈfɔːlən | pliːz kɔːl ən ˈæmbjʊləns/","Alguém caiu. Por favor, chame uma ambulância."]
  ],"What does the person ask someone to call?",["A taxi","An ambulance","A restaurant"],1,"“Call an ambulance” significa “chamar uma ambulância”.")
];

SCENES.push(...EXTRA_SCENES);


export default function TranslatedOption({ text, lang }: { text: string; lang: Lang }) {\n  const translated = useTranslation(text, lang);\n  return <>{translated}</>;\n}\n\nfunction RealLife({ lang, accent, back }: { lang: Lang; accent: "en-GB" | "en-US"; back: () => void }) {
  const speak = useSpeak(accent);
  const [index, setIndex] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(true);
  const [quiz, setQuiz] = useState(false);
  const [choice, setChoice] = useState<number | null>(null);
  const [completed, setCompleted] = useState<string[]>([]);
  const scene = SCENES[index];
  const line = scene.lines[lineIndex];
  const translatedQuestion = useTranslation(scene.question, lang);
  const translatedExplanation = useTranslation(scene.explanation, lang);\n  const correctLabel = useTranslation("Correct! Great job.", lang);\n  const incorrectLabel = useTranslation("Not quite. Try to remember the dialogue.", lang);
  const translation = line.translations[lang] || "";
  const translatedLine = useTranslation(line.en, lang, translation);
  const progress = useMemo(() => Math.round(((lineIndex + 1) / scene.lines.length) * 100), [lineIndex, scene.lines.length]);
  const moveScene = (direction: number) => {
    setIndex((current) => (current + direction + SCENES.length) % SCENES.length);
    setLineIndex(0); setQuiz(false); setChoice(null);
  };
  const finish = () => {
    setCompleted((old) => old.includes(scene.id) ? old : [...old, scene.id]);
    setQuiz(false); setChoice(null);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="flex items-center justify-between px-5 pb-3 pt-6">
        <button onClick={back} aria-label="Back" className="rounded-full bg-muted p-2"><ArrowLeft className="h-5 w-5" /></button>
        <div className="text-center"><p className="text-xs font-bold uppercase tracking-widest text-primary">HIGH5</p><h1 className="text-lg font-extrabold">Real Life</h1></div>
        <span className="text-xs text-muted-foreground">{index + 1}/{SCENES.length}</span>
      </div>

      <div className="relative mx-3 overflow-hidden rounded-[2rem] shadow-soft">
        <div className={`relative flex min-h-[66vh] flex-col justify-between bg-gradient-to-br ${scene.gradient} p-5 text-white`}>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
          <div className="relative flex items-center justify-between">
            <span className="rounded-full bg-black/30 px-3 py-1 text-xs font-bold">{scene.category} · {scene.level}</span>
            <span className="flex items-center gap-1 rounded-full bg-black/30 px-3 py-1 text-xs"><Clapperboard className="h-3 w-3" /> {scene.duration}</span>
          </div>

          <div className="relative py-8 text-center">
            <div className="mb-4 text-8xl drop-shadow-lg">{scene.emoji}</div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">{scene.setting}</p>
            <h2 className="mt-2 text-3xl font-extrabold">{scene.title}</h2>
            <p className="mt-3 text-xs text-white/55">Short scene · Everyday English</p>
          </div>

          <div className="relative space-y-3">
            {!quiz ? <>
              <div className="rounded-2xl bg-black/55 p-4 backdrop-blur">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-extrabold tracking-widest text-amber-200">{line.speaker}</span>
                  <button onClick={() => speak(line.en)} className="rounded-full bg-white/15 p-2" aria-label="Listen to this line"><Volume2 className="h-5 w-5" /></button>
                </div>
                <p className="text-xl font-bold leading-snug">{line.en}</p>
                <p className="mt-2 text-sm text-white/75">{line.ipa}</p>
                {showTranslation && <p className="mt-2 border-t border-white/15 pt-2 text-sm font-medium text-amber-100">{translatedLine}</p>}
              </div>
              <div className="flex items-center justify-between">
                <button onClick={() => setShowTranslation((v) => !v)} className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs font-semibold"><Captions className="h-4 w-4" /> {showTranslation ? "Hide translation" : "Show translation"}</button>
                <span className="text-xs text-white/70">{lineIndex + 1} / {scene.lines.length}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/20"><div className="h-full bg-amber-300 transition-all" style={{ width: progress + "%" }} /></div>
              <div className="flex gap-2">
                <button disabled={lineIndex === 0} onClick={() => setLineIndex((v) => v - 1)} className="flex-1 rounded-xl bg-white/10 py-3 text-sm font-bold disabled:opacity-30">Previous</button>
                <button onClick={() => lineIndex + 1 < scene.lines.length ? setLineIndex((v) => v + 1) : setQuiz(true)} className="flex-1 rounded-xl bg-amber-300 py-3 text-sm font-extrabold text-slate-950">{lineIndex + 1 === scene.lines.length ? "Take the quiz" : "Next line"}</button>
              </div>
              <button onClick={() => speak(line.en, 0.65)} className="w-full rounded-xl border border-white/20 py-2 text-xs font-semibold"><RotateCcw className="mr-1 inline h-3 w-3" /> Repeat slowly</button>
            </> : <div className="rounded-2xl bg-black/60 p-4 backdrop-blur">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-200">Quick check</p>
              <p className="mt-2 text-lg font-extrabold">{translatedQuestion}</p>
              <div className="mt-4 space-y-2">{scene.options.map((option, i) => <button key={option} onClick={() => setChoice(i)} className={`w-full rounded-xl border p-3 text-left text-sm font-semibold ${choice === i ? "border-amber-300 bg-amber-300/20" : "border-white/20 bg-white/5"}`}><TranslatedOption text={option} lang={lang} /></button>)}</div>
              {choice !== null && <div className="mt-3 rounded-xl bg-white/10 p-3 text-sm"><p className="font-bold">{choice === scene.answer ? correctLabel : incorrectLabel}</p><p className="mt-1 text-white/75">{translatedExplanation}</p></div>}
              <button disabled={choice === null} onClick={finish} className="mt-4 w-full rounded-xl bg-amber-300 py-3 font-extrabold text-slate-950 disabled:opacity-40">Finish scene</button>
            </div>}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-5 pt-4">
        <div><p className="text-sm font-bold">{scene.title}</p><p className="text-xs text-muted-foreground">{LANG_NAMES[lang]} · {completed.length} completed</p></div>
        <div className="flex gap-2">
          <button onClick={() => moveScene(-1)} aria-label="Previous scene" className="rounded-full bg-card p-3"><ChevronUp className="h-5 w-5" /></button>
          <button onClick={() => moveScene(1)} aria-label="Next scene" className="rounded-full bg-card p-3"><ChevronDown className="h-5 w-5" /></button>
          {completed.includes(scene.id) && <CheckCircle2 className="h-6 w-6 text-success" />}
        </div>
      </div>
      <p className="px-5 pt-2 text-xs text-muted-foreground">Pronunciation is shown in IPA. Audio uses the voice available on your device; availability varies by browser.</p>
    </div>
  );
}
