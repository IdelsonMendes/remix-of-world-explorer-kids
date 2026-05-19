import type { CountrySlug } from "@/context/PassportContext";

export type ChildStory = {
  title: string;
  emoji: string;
  paragraphs: string[];
  moral?: string;
};

export type LocalGame = {
  name: string;
  emoji: string;
  description: string;
  rules: string[];
  // Mini interação gamificada simples: tocar/clicar o alvo X vezes
  interaction: {
    prompt: string;
    target: string; // emoji do alvo
    goal: number;
  };
};

export type CountryExtras = {
  childStory: ChildStory;
  localGame: LocalGame;
};

export const COUNTRY_EXTRAS: Record<CountrySlug, CountryExtras> = {
  brasil: {
    childStory: {
      title: "O Saci-Pererê",
      emoji: "🌪️",
      paragraphs: [
        "No meio da floresta brasileira mora o Saci, um menino travesso de uma perna só e gorrinho vermelho mágico.",
        "Ele adora pregar peças: esconde objetos, embola o rabo dos cavalos e assobia bem alto entre as árvores.",
        "Diz a lenda que, se você pegar o gorrinho dele, o Saci precisa realizar um pedido para você devolver!",
      ],
      moral: "Respeite a natureza e cuide das florestas — é lá que moram nossas lendas.",
    },
    localGame: {
      name: "Amarelinha",
      emoji: "🪨",
      description: "Brincadeira de pular casinhas desenhadas no chão até chegar no céu!",
      rules: [
        "Desenhe casinhas numeradas de 1 a 10 no chão (terra ou céu no topo).",
        "Jogue uma pedrinha na casa 1 e pule por cima dela.",
        "Pule de um pé só nas casas sozinhas e dois pés nas duplas.",
        "Volte pegando a pedrinha — depois jogue na 2, e assim por diante!",
      ],
      interaction: { prompt: "Pule de casinha em casinha!", target: "🪨", goal: 10 },
    },
  },
  eua: {
    childStory: {
      title: "Paul Bunyan, o Lenhador Gigante",
      emoji: "🪓",
      paragraphs: [
        "Era uma vez um lenhador tão grande que suas botas pareciam casas e sua machadinha tinha o tamanho de uma árvore.",
        "Ele tinha um boi azul gigante chamado Babe, seu melhor amigo, que o ajudava a abrir estradas.",
        "Dizem que os Grandes Lagos surgiram das pegadas que Paul e Babe deixaram pelo caminho!",
      ],
      moral: "Com amizade e trabalho em equipe, qualquer aventura é possível.",
    },
    localGame: {
      name: "Baseball",
      emoji: "⚾",
      description: "O esporte favorito das tardes americanas — bater na bola e correr pelas bases!",
      rules: [
        "Um jogador lança a bola (pitcher) e o outro tenta rebater com um taco.",
        "Se rebater, corre para a primeira base.",
        "Dê a volta nas 4 bases para marcar um ponto (home run)!",
      ],
      interaction: { prompt: "Rebata as bolas!", target: "⚾", goal: 9 },
    },
  },
  china: {
    childStory: {
      title: "O Panda e o Bambu Mágico",
      emoji: "🐼",
      paragraphs: [
        "Um pequeno panda subiu na montanha mais alta da China em busca do bambu mais doce do mundo.",
        "Ele encontrou um sábio dragão que lhe disse: 'A doçura está em cada folhinha, se você comer com calma'.",
        "O panda aprendeu a saborear cada pedacinho — e desde então sorri o tempo todo!",
      ],
      moral: "As coisas boas ficam ainda melhores quando você tem paciência.",
    },
    localGame: {
      name: "Diabolô (Kongzhu)",
      emoji: "🎯",
      description: "Brincadeira chinesa antiga de equilibrar um carretel girando sobre um barbante.",
      rules: [
        "Segure dois bastões com um barbante esticado entre eles.",
        "Equilibre o diabolô sobre o barbante.",
        "Faça o carretel girar movendo as mãos para cima e para baixo!",
      ],
      interaction: { prompt: "Gire o diabolô!", target: "🎯", goal: 12 },
    },
  },
  russia: {
    childStory: {
      title: "A Matrioska e Suas Irmãzinhas",
      emoji: "🪆",
      paragraphs: [
        "Vivia em uma casinha de madeira uma boneca chamada Matrioska, que guardava dentro de si suas irmãs menorzinhas.",
        "Cada irmã era ainda mais pequenina, e a menor de todas cabia na palma da mão.",
        "Quando a neve caía, as irmãs se aninhavam uma dentro da outra para se aquecer.",
      ],
      moral: "Família é abraço que nos aquece em qualquer inverno.",
    },
    localGame: {
      name: "Gorodki",
      emoji: "🪵",
      description: "Brincadeira russa antiga de derrubar pinos de madeira com um bastão.",
      rules: [
        "Monte figuras com 5 pinos de madeira no chão.",
        "Fique a alguns passos de distância.",
        "Arremesse o bastão e derrube todos os pinos!",
      ],
      interaction: { prompt: "Derrube os pinos!", target: "🪵", goal: 8 },
    },
  },
  japao: {
    childStory: {
      title: "Momotaro, o Menino do Pêssego",
      emoji: "🍑",
      paragraphs: [
        "Uma velhinha encontrou no rio um pêssego gigante. Quando o abriu, de dentro saiu um menininho: Momotaro!",
        "Quando cresceu, Momotaro saiu numa aventura para enfrentar os ogros que assustavam a vila.",
        "No caminho fez amizade com um cachorro, um macaco e um faisão, que o ajudaram a vencer com coragem.",
      ],
      moral: "Amigos verdadeiros tornam até as missões mais difíceis possíveis.",
    },
    localGame: {
      name: "Kendama",
      emoji: "🪀",
      description: "Brinquedo japonês com uma bolinha amarrada que você tenta encaixar nas pontinhas.",
      rules: [
        "Segure o cabo de madeira com a bolinha pendurada.",
        "Balance e jogue a bolinha para cima.",
        "Tente encaixar a bolinha no copinho ou na ponta!",
      ],
      interaction: { prompt: "Encaixe a bolinha!", target: "🪀", goal: 10 },
    },
  },
  africadosul: {
    childStory: {
      title: "A Tartaruga e o Tambor",
      emoji: "🐢",
      paragraphs: [
        "Uma tartaruga sábia da savana africana tinha um tambor mágico que chamava chuva quando estava seco.",
        "Os animais cantavam e dançavam em volta dela, e a chuva caía suavinha.",
        "Mas só funcionava se todos cantassem juntos — sozinho, o tambor ficava em silêncio.",
      ],
      moral: "Quando trabalhamos juntos, coisas mágicas acontecem.",
    },
    localGame: {
      name: "Diketo",
      emoji: "🪨",
      description: "Brincadeira sul-africana com pedrinhas — parecida com 'cinco marias'.",
      rules: [
        "Coloque várias pedrinhas no chão.",
        "Jogue uma pedrinha para cima.",
        "Antes dela cair, pegue outra do chão e segure as duas!",
      ],
      interaction: { prompt: "Pegue as pedrinhas!", target: "🪨", goal: 10 },
    },
  },
  franca: {
    childStory: {
      title: "O Pequeno Príncipe",
      emoji: "👑",
      paragraphs: [
        "Em um pequeno planeta morava um príncipe que cuidava de uma rosa única no universo.",
        "Ele viajou por muitas estrelas e encontrou uma raposa, que lhe ensinou: 'só se vê bem com o coração'.",
        "O Pequeno Príncipe voltou para casa sabendo que o tempo dedicado à sua rosa é o que a tornava especial.",
      ],
      moral: "O essencial é invisível aos olhos.",
    },
    localGame: {
      name: "Escargot (Caracol)",
      emoji: "🐌",
      description: "Versão francesa da amarelinha, em formato de caracol espiralado!",
      rules: [
        "Desenhe um caracol grande no chão com casinhas numeradas em espiral.",
        "Pule de um pé só até o centro e volte.",
        "Cada vez que conseguir, escolha uma casa para escrever seu nome — ninguém mais pode pisar nela!",
      ],
      interaction: { prompt: "Pule até o centro!", target: "🐌", goal: 10 },
    },
  },
  italia: {
    childStory: {
      title: "Pinóquio, o Boneco de Madeira",
      emoji: "🪵",
      paragraphs: [
        "Geppetto era um marceneiro que esculpiu um bonequinho de madeira e o chamou de Pinóquio.",
        "Uma fada o transformou em um boneco vivo, mas avisou: cada mentirinha faria seu nariz crescer!",
        "Depois de muitas aventuras, Pinóquio aprendeu a ser honesto e virou um menino de verdade.",
      ],
      moral: "Dizer a verdade é o caminho mais bonito.",
    },
    localGame: {
      name: "Campana (Amarelinha Italiana)",
      emoji: "🔔",
      description: "Versão italiana da amarelinha — chamada de 'sininho'.",
      rules: [
        "Desenhe as casas com uma 'campana' (sino) no topo.",
        "Jogue uma pedrinha e pule por cima da casa.",
        "Quando chegar ao sino, dê um pulo para virar e voltar!",
      ],
      interaction: { prompt: "Toque o sininho!", target: "🔔", goal: 10 },
    },
  },
  australia: {
    childStory: {
      title: "Como o Canguru Ganhou o Marsúpio",
      emoji: "🦘",
      paragraphs: [
        "Há muito tempo, uma mamãe canguru ajudou uma velhinha wombat perdida na savana.",
        "Como agradecimento, os Espíritos da Terra lhe deram uma bolsa mágica na barriga.",
        "Desde então, todos os cangurus carregam seus filhotinhos seguros e quentinhos no marsúpio!",
      ],
      moral: "Quando ajudamos os outros, o universo sempre devolve carinho.",
    },
    localGame: {
      name: "Bumerangue",
      emoji: "🪃",
      description: "Brinquedo aborígene que volta para a mão de quem joga!",
      rules: [
        "Segure o bumerangue na vertical.",
        "Jogue para o alto e para o lado.",
        "Espere ele girar... e voltar para você!",
      ],
      interaction: { prompt: "Lance o bumerangue!", target: "🪃", goal: 8 },
    },
  },
  mexico: {
    childStory: {
      title: "A Lenda dos Vulcões",
      emoji: "🌋",
      paragraphs: [
        "Conta a lenda asteca que Iztaccíhuatl era uma princesa apaixonada pelo guerreiro Popocatépetl.",
        "Quando ela adormeceu para sempre, ele ficou ao seu lado segurando uma tocha eterna.",
        "Os deuses os transformaram em dois grandes vulcões, que até hoje vigiam o México lado a lado.",
      ],
      moral: "O amor verdadeiro é eterno — mesmo nas montanhas!",
    },
    localGame: {
      name: "Piñata",
      emoji: "🪅",
      description: "Brincadeira mexicana de festa — bater na piñata para derrubar os doces!",
      rules: [
        "Pendure a piñata em um lugar alto.",
        "Vende os olhos da criança e gire ela três vezes.",
        "Bata com um bastão até a piñata estourar e os doces caírem!",
      ],
      interaction: { prompt: "Bata na piñata!", target: "🪅", goal: 8 },
    },
  },
  argentina: {
    childStory: {
      title: "O Hornero e Sua Casinha de Barro",
      emoji: "🏠",
      paragraphs: [
        "O Hornero é um passarinho argentino que constrói sua casa de barro como um forninho redondo.",
        "Trabalha do amanhecer ao pôr do sol, juntando palhas e gravetinhos com muito carinho.",
        "Quando termina, abre a portinha e canta forte para a família inteira ouvir.",
      ],
      moral: "Com dedicação, até a casa mais simples vira um lar perfeito.",
    },
    localGame: {
      name: "Bolinha de Gude (Bolitas)",
      emoji: "🔮",
      description: "Brincadeira clássica argentina de acertar bolinhas em um círculo no chão.",
      rules: [
        "Desenhe um círculo no chão e coloque bolinhas dentro.",
        "Use o polegar para atirar sua bolinha contra as outras.",
        "Cada bolinha que sair do círculo é sua!",
      ],
      interaction: { prompt: "Acerte as bolinhas!", target: "🔮", goal: 10 },
    },
  },
  canada: {
    childStory: {
      title: "O Castor e a Folha de Bordo",
      emoji: "🍁",
      paragraphs: [
        "Um castorzinho canadense tentava represar o rio para passar o inverno bem aquecido.",
        "Ele se cansou e descansou debaixo de uma árvore de bordo, e uma folhinha vermelha caiu na sua cabeça.",
        "A folha lhe deu coragem — e ele terminou a represa, virando o orgulho da floresta!",
      ],
      moral: "Persistência leva você muito mais longe do que pressa.",
    },
    localGame: {
      name: "Hóquei no Gelo",
      emoji: "🏒",
      description: "O esporte nacional do Canadá — patinar e marcar gols com um disco!",
      rules: [
        "Use patins de gelo e um taco de hóquei.",
        "Empurre o disco (puck) com o taco.",
        "Marque gol no gol do time adversário!",
      ],
      interaction: { prompt: "Faça gols!", target: "🏒", goal: 9 },
    },
  },
  reinounido: {
    childStory: {
      title: "O Ursinho Paddington",
      emoji: "🧸",
      paragraphs: [
        "Um ursinho do Peru chegou à estação de trem de Paddington, em Londres, com uma mala e uma plaquinha: 'Por favor, cuide deste urso'.",
        "Uma família simpática o adotou, e o ursinho descobriu sua paixão por sanduíches de marmelada.",
        "Paddington faz amizades por toda Londres, sempre com educação e um chapéu vermelho na cabeça.",
      ],
      moral: "Gentileza e boas maneiras abrem qualquer porta.",
    },
    localGame: {
      name: "Conkers",
      emoji: "🌰",
      description: "Brincadeira tradicional inglesa com castanhas penduradas em barbantes.",
      rules: [
        "Fure uma castanha e passe um barbante por ela.",
        "Cada criança segura sua castanha pendurada.",
        "Bata sua castanha na do adversário — quem quebrar a do outro, ganha!",
      ],
      interaction: { prompt: "Bata as castanhas!", target: "🌰", goal: 10 },
    },
  },
  alemanha: {
    childStory: {
      title: "Chapeuzinho Vermelho",
      emoji: "🔴",
      paragraphs: [
        "Chapeuzinho Vermelho atravessava a Floresta Negra para levar doces para sua vovó doente.",
        "No caminho, encontrou o Lobo Mau, que correu na frente para chegar antes na casa da vovó.",
        "Por sorte, um caçador valente apareceu na hora certa e salvou as duas!",
      ],
      moral: "Cuidado com estranhos no caminho — e sempre conte tudo para alguém de confiança.",
    },
    localGame: {
      name: "Hüpfspiel (Amarelinha Alemã)",
      emoji: "🧱",
      description: "Versão alemã da amarelinha, com casas quadradas em fila.",
      rules: [
        "Desenhe casas numeradas em fila no chão.",
        "Pule de uma casa para a outra sem pisar nas linhas.",
        "Quem pisar na linha começa de novo!",
      ],
      interaction: { prompt: "Pule sem pisar na linha!", target: "🧱", goal: 10 },
    },
  },
  espanha: {
    childStory: {
      title: "Dom Quixote e o Moinho",
      emoji: "🌬️",
      paragraphs: [
        "Dom Quixote era um senhor que amava ler histórias de cavaleiros valentes.",
        "Um dia, olhando para uns moinhos de vento, achou que eram gigantes terríveis e foi atacá-los!",
        "Seu amigo Sancho Pança tentou avisar, mas Dom Quixote aprendeu na queda que imaginação demais às vezes engana.",
      ],
      moral: "Sonhar é maravilhoso, mas amigos verdadeiros nos ajudam a enxergar a realidade.",
    },
    localGame: {
      name: "Rayuela (Amarelinha Espanhola)",
      emoji: "✏️",
      description: "A amarelinha espanhola, com céu e inferno desenhados no chão.",
      rules: [
        "Desenhe casas numeradas com 'cielo' (céu) no topo.",
        "Jogue a pedrinha e pule por cima das casas.",
        "Não pode pisar na casa onde a pedra está!",
      ],
      interaction: { prompt: "Vá até o céu!", target: "✏️", goal: 10 },
    },
  },
  egito: {
    childStory: {
      title: "O Gato de Bastet",
      emoji: "🐈",
      paragraphs: [
        "No antigo Egito vivia um gatinho protegido pela deusa Bastet, guardiã dos lares e das crianças.",
        "Ele caminhava pelos templos com olhos brilhantes, espantando ratos e trazendo sorte às famílias.",
        "Por isso, os gatos eram tão queridos que eram pintados nas paredes das pirâmides!",
      ],
      moral: "Cuide dos animais — eles cuidam de nós de muitas formas.",
    },
    localGame: {
      name: "Seega",
      emoji: "🟫",
      description: "Jogo de tabuleiro egípcio antigo, parecido com damas.",
      rules: [
        "Use um tabuleiro com 25 casas (5x5).",
        "Cada jogador coloca suas pedras alternadamente.",
        "Capture as pedras do oponente cercando-as!",
      ],
      interaction: { prompt: "Capture as pedras!", target: "🟫", goal: 8 },
    },
  },
  india: {
    childStory: {
      title: "O Elefantinho Curioso",
      emoji: "🐘",
      paragraphs: [
        "Um elefantinho indiano vivia perguntando 'por quê?' o tempo todo, deixando todos os animais cansados.",
        "Um dia foi até o rio e perguntou ao crocodilo: 'O que você come no jantar?'",
        "O crocodilo puxou seu narizinho — e foi assim que os elefantes ganharam tromba comprida!",
      ],
      moral: "Curiosidade é boa, mas tenha cuidado com o que pergunta — pode mudar você para sempre!",
    },
    localGame: {
      name: "Kabaddi",
      emoji: "🤸",
      description: "Esporte indiano de tag em equipe, com muito fôlego e estratégia.",
      rules: [
        "Forme duas equipes em lados opostos.",
        "Um jogador (raider) corre até o outro lado dizendo 'kabaddi, kabaddi' sem respirar.",
        "Toque o máximo de adversários e volte antes de respirar de novo!",
      ],
      interaction: { prompt: "Toque os adversários!", target: "🤸", goal: 9 },
    },
  },
  coreiadosul: {
    childStory: {
      title: "O Tigre e o Espelho",
      emoji: "🐯",
      paragraphs: [
        "Um tigre coreano achou um espelho brilhante no meio da floresta.",
        "Olhou e ficou bravo: 'Quem é esse tigre me encarando?' E rugiu para o espelho.",
        "Foi só quando sorriu que o tigre do espelho sorriu também — e ele entendeu que o reflexo era ele mesmo!",
      ],
      moral: "O mundo te devolve o que você oferece — sorria primeiro.",
    },
    localGame: {
      name: "Jegichagi",
      emoji: "🪶",
      description: "Brincadeira coreana de chutar uma peteca de papel com o pé.",
      rules: [
        "Faça uma peteca com papel e moedinhas.",
        "Chute a peteca para o alto com a parte interna do pé.",
        "Conte quantas vezes consegue chutar sem deixar cair!",
      ],
      interaction: { prompt: "Chute a peteca!", target: "🪶", goal: 12 },
    },
  },
  grecia: {
    childStory: {
      title: "Ícaro e Suas Asas de Cera",
      emoji: "🪶",
      paragraphs: [
        "O pai de Ícaro construiu asas de penas e cera para os dois fugirem voando de uma ilha.",
        "Ele avisou: 'Não voe muito perto do sol, senão a cera vai derreter!'",
        "Mas Ícaro ficou tão encantado com o céu que voou alto demais — e aprendeu que ouvir conselhos é importante.",
      ],
      moral: "Sonhe alto, mas escute quem te ama.",
    },
    localGame: {
      name: "Agalmata (Estátua)",
      emoji: "🗿",
      description: "Brincadeira grega: virar estátua quando o líder mandar.",
      rules: [
        "Um líder fica de costas e fala 'agalmata!'.",
        "Quando virar, todos precisam estar parados como estátuas.",
        "Quem se mexer está fora da rodada!",
      ],
      interaction: { prompt: "Fique parado como estátua!", target: "🗿", goal: 8 },
    },
  },
  portugal: {
    childStory: {
      title: "A Lenda do Galo de Barcelos",
      emoji: "🐓",
      paragraphs: [
        "Um peregrino foi acusado injustamente de um crime que não cometeu na cidade de Barcelos.",
        "Para provar sua inocência, disse: 'Se eu estiver dizendo a verdade, aquele galo assado vai cantar!'",
        "E o galo cantou bem alto — desde então é símbolo de sorte e justiça em Portugal!",
      ],
      moral: "A verdade sempre encontra um jeito de aparecer.",
    },
    localGame: {
      name: "Jogo do Lencinho",
      emoji: "🧣",
      description: "Brincadeira clássica portuguesa em roda com um lencinho.",
      rules: [
        "Todos sentam em roda. Uma criança anda por fora com um lencinho.",
        "Sem ninguém ver, ela deixa o lencinho atrás de alguém.",
        "Quem perceber pega o lencinho e corre atrás dela!",
      ],
      interaction: { prompt: "Pegue o lencinho!", target: "🧣", goal: 9 },
    },
  },
};
