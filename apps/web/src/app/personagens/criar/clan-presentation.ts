import type {
  CreationDisciplineId,
  CreationOriginId,
} from "@assistente-vampiro/contracts";

export interface EditorialSourceRef {
  readonly pages: readonly number[];
  readonly sourceId: "SRC-0001" | "SRC-0003" | "SRC-0004";
}

export interface ClanPresentation {
  readonly archetypes: readonly {
    readonly description: string;
    readonly label: string;
  }[];
  readonly deepDiveParagraphs: readonly string[];
  readonly id: CreationOriginId;
  readonly namePtBr: string;
  readonly sourceRefs: readonly EditorialSourceRef[];
  readonly summaryParagraphs: readonly string[];
}

export interface DisciplinePresentation {
  readonly descriptionPtBr: string;
  readonly id: CreationDisciplineId;
  readonly namePtBr: string;
  readonly sourceRefs: readonly EditorialSourceRef[];
}

const ref = (
  sourceId: EditorialSourceRef["sourceId"],
  ...pages: number[]
): EditorialSourceRef => ({ pages, sourceId });
const archetype = (label: string, description: string) => ({ description, label });

export const DISCIPLINE_PRESENTATIONS: Readonly<
  Record<CreationDisciplineId, DisciplinePresentation>
> = {
  "discipline:animalism": {
    id: "discipline:animalism",
    namePtBr: "Animalismo",
    descriptionPtBr:
      "Estende a presença da Besta aos animais e à fera interior, permitindo comunicação, influência e domínio sobrenatural.",
    sourceRefs: [ref("SRC-0001", 244, 245)],
  },
  "discipline:auspex": {
    id: "discipline:auspex",
    namePtBr: "Auspícios",
    descriptionPtBr:
      "Aguça sentidos e percepção para revelar emoções, presenças e verdades que escapam à atenção comum.",
    sourceRefs: [ref("SRC-0001", 249, 250)],
  },
  "discipline:blood-sorcery": {
    id: "discipline:blood-sorcery",
    namePtBr: "Feitiçaria de Sangue",
    descriptionPtBr:
      "Transforma a vitae em instrumento ritual e oculto, exigindo estudo, preparo e conhecimento proibido.",
    sourceRefs: [ref("SRC-0001", 272, 273)],
  },
  "discipline:celerity": {
    id: "discipline:celerity",
    namePtBr: "Celeridade",
    descriptionPtBr:
      "Concede rapidez e reflexos sobrenaturais, tornando o vampiro preciso e difícil de acompanhar.",
    sourceRefs: [ref("SRC-0001", 251, 252)],
  },
  "discipline:dominate": {
    id: "discipline:dominate",
    namePtBr: "Dominação",
    descriptionPtBr:
      "Impõe comandos e altera a vontade por contato direto, convertendo autoridade em coerção sobrenatural.",
    sourceRefs: [ref("SRC-0001", 255, 256)],
  },
  "discipline:fortitude": {
    id: "discipline:fortitude",
    namePtBr: "Fortitude",
    descriptionPtBr:
      "Reforça corpo e espírito com resistência monstruosa diante de dano, pressão e adversidade.",
    sourceRefs: [ref("SRC-0001", 258, 259)],
  },
  "discipline:obfuscate": {
    id: "discipline:obfuscate",
    namePtBr: "Ofuscação",
    descriptionPtBr:
      "Desvia a atenção e apaga a presença da percepção alheia, favorecendo segredo, fuga e aproximação invisível.",
    sourceRefs: [ref("SRC-0001", 261, 262)],
  },
  "discipline:oblivion": {
    id: "discipline:oblivion",
    namePtBr: "Oblívio",
    descriptionPtBr:
      "Canaliza a escuridão do além por sombras ou pelos mortos, sempre perto de forças que cobram um preço.",
    sourceRefs: [ref("SRC-0004", 63, 64)],
  },
  "discipline:potence": {
    id: "discipline:potence",
    namePtBr: "Potência",
    descriptionPtBr:
      "Manifesta força física sobrenatural para impacto, domínio corporal e feitos além do limite humano.",
    sourceRefs: [ref("SRC-0001", 265, 266)],
  },
  "discipline:presence": {
    id: "discipline:presence",
    namePtBr: "Presença",
    descriptionPtBr:
      "Amplifica magnetismo e emoção, atraindo, inspirando ou aterrorizando sem apagar totalmente a vontade.",
    sourceRefs: [ref("SRC-0001", 267, 268)],
  },
  "discipline:protean": {
    id: "discipline:protean",
    namePtBr: "Proteanismo",
    descriptionPtBr:
      "Permite que o vampiro adapte e transforme a própria forma, aproximando corpo, predador e ambiente.",
    sourceRefs: [ref("SRC-0001", 269, 270)],
  },
  "discipline:thin-blood-alchemy": {
    id: "discipline:thin-blood-alchemy",
    namePtBr: "Alquimia Sangue-Ralo",
    descriptionPtBr:
      "Destila vitae, ressonâncias e ingredientes em fórmulas instáveis, uma arte própria dos Sangues-Ralos.",
    sourceRefs: [ref("SRC-0001", 282, 283)],
  },
};

const presentations: readonly ClanPresentation[] = [
  {
    id: "clan:banu-haqim",
    namePtBr: "Banu Haqim",
    sourceRefs: [ref("SRC-0004", 18, 19, 20, 21)],
    summaryParagraphs: [
      "Os Banu Haqim procuram ordem em uma sociedade governada pela Fome. Cada um sustenta um código — jurídico, religioso, comunitário ou estritamente pessoal — e mede suas escolhas por ele. Por isso, podem surgir como investigadores, mediadores, filósofos, cientistas ou executores; o clã não se resume a assassinos silenciosos.",
      "Seu conflito está na distância entre justiça e certeza. A capacidade de reconhecer uma transgressão pode proteger um domínio, mas a sede por vitae vampírica e a convicção de estar certo transformam o juiz em predador. É uma boa escolha para personagens disciplinados que precisam decidir quem os autorizou a julgar.",
    ],
    deepDiveParagraphs: [
      "A linhagem reúne tradições de juízes, feiticeiros do Sangue e agentes treinados para remover ameaças. O ponto comum não é obediência a uma seita: é a crença de que os Amaldiçoados precisam de estrutura para não se perderem em seus impulsos. Um Banu Haqim pode criticar Camarilla, Ashirra ou Anarquistas quando considera que essas instituições traíram a própria lei.",
      "O Abraço costuma buscar pessoas capazes de perceber a necessidade de ordem e construir algo duradouro. Poetas, acadêmicos e organizadores cabem ao lado de policiais ou combatentes. Em jogo, pergunte qual é o código do personagem, quem ele protege e qual contradição se recusa a admitir. A melhor história aparece quando aplicar a regra é mais fácil do que reconhecer sua injustiça.",
      "Também determine quem ensinou esse código e qual julgamento do passado ainda pesa sobre ele. A resposta diferencia dever herdado de convicção escolhida e abre espaço para que justiça, lealdade e Fome entrem em conflito sem reduzir o personagem a um executor.",
    ],
    archetypes: [
      archetype(
        "Árbitro implacável",
        "Aplica um código com rigor e precisa reconhecer quando a lei deixou de servir à justiça.",
      ),
      archetype(
        "Arquiteto esotérico",
        "Combina estudo oculto e planejamento para erguer uma ordem que sobreviva ao seu criador.",
      ),
      archetype(
        "Anfitrião persuasivo",
        "Faz perguntas, oferece hospitalidade e conduz o culpado a revelar a própria medida.",
      ),
    ],
  },
  {
    id: "clan:brujah",
    namePtBr: "Brujah",
    sourceRefs: [ref("SRC-0001", 65, 66, 67, 68, 69)],
    summaryParagraphs: [
      "Os Brujah carregam paixão por ideias capazes de mudar o mundo. Entre eles há organizadores, professores, filósofos, ativistas e combatentes, unidos menos por uma doutrina única do que pela recusa em aceitar opressão como inevitável. A revolta pode nascer numa assembleia, biblioteca, ocupação ou esquina — não apenas numa briga.",
      "Essa intensidade inspira pessoas e derruba estruturas, mas também aproxima o personagem da Fúria. Um Brujah interessante sabe o que deseja construir depois da ruptura. É uma escolha para quem quer confrontar poder, defender uma causa e descobrir se a urgência da mudança ainda permite escutar os outros. Sua revolta ganha força quando possui memória, aliados e um futuro concreto.",
    ],
    deepDiveParagraphs: [
      "A memória do clã inclui pensadores e guerreiros que sonharam com sociedades melhores, além de incontáveis revoltas que terminaram em novas formas de domínio. Seus membros procuram mortais que questionam normas, reconhecem abuso e agem em favor de quem foi posto à margem. Alguns têm discursos brilhantes; outros compreendem a política pela experiência do corpo e da rua.",
      "Em jogo, a causa precisa ser concreta: quem recebe a proteção do personagem e qual autoridade ele considera ilegítima? A tensão vem quando um aliado exige disciplina, quando a violência prejudica o movimento ou quando a própria coterie reproduz a hierarquia combatida. O estereótipo do rebelde sem reflexão perde justamente a herança intelectual e comunitária que dá força ao clã.",
      "Defina ainda uma derrota política que mudou sua estratégia e uma pessoa capaz de fazê-lo reconsiderar. Assim, o conflito não depende apenas de explosões de raiva: ele acompanha o trabalho difícil de transformar convicção em mudança sem substituir uma tirania por outra.",
    ],
    archetypes: [
      archetype(
        "Voz do povo",
        "Organiza uma comunidade e converte indignação dispersa em ação coletiva.",
      ),
      archetype(
        "Filósofo insurgente",
        "Desafia instituições com ideias perigosas e precisa provar que elas sobrevivem ao mundo real.",
      ),
      archetype(
        "Veterano rebelde",
        "Já viu revoluções falharem, mas ainda encontra uma causa pela qual vale arriscar a não-vida.",
      ),
    ],
  },
  {
    id: "clan:gangrel",
    namePtBr: "Gangrel",
    sourceRefs: [ref("SRC-0001", 71, 72, 73, 74, 75)],
    summaryParagraphs: [
      "Os Gangrel confiam na experiência, no território e na capacidade de sobreviver sem a proteção de títulos. Podem ser caçadores urbanos, exploradores, líderes de gangue, guardiões de fronteiras ou viajantes; proximidade com a Besta não significa viver obrigatoriamente longe das cidades.",
      "Eles valorizam autonomia e provas reais mais do que reputação. Essa independência produz personagens adaptáveis, capazes de proteger um lugar ou atravessar o desconhecido, mas cada Frenesi deixa sinais de quanto a fera se aproxima da superfície. É uma escolha para quem quer negociar liberdade, pertencimento e instinto. A sobrevivência importa, mas aquilo que merece ser preservado importa ainda mais.",
    ],
    deepDiveParagraphs: [
      "Muitos Gangrel chegam ao clã após testes de resistência, abandono ou longas noites em que precisam aprender sozinhos. A iniciação pode parecer cruel, porém revela a pergunta central da linhagem: o que resta quando conforto, hierarquia e testemunhas desaparecem? A resposta pode ser solidariedade territorial, pragmatismo feroz ou rejeição a qualquer vínculo que pareça jaula.",
      "Em jogo, defina qual espaço, grupo ou rota o personagem conhece melhor que qualquer outro. Depois escolha o limite de sua independência: quem ele não abandonaria, mesmo quando fugir seria mais seguro? A Besta pode ser linguagem, ferramenta e ameaça. Evite reduzir o clã a uma estética animal; sua força narrativa está em confrontar o que civilização e monstruosidade significam quando ambas falham.",
      "Pense também em quem lhe ensinou a sobreviver e qual costume desse mentor ele rejeitou. Um Gangrel se torna mais específico quando seu território tem nomes, necessidades e conflitos, e quando a liberdade deixa de ser apenas ausência de compromisso.",
    ],
    archetypes: [
      archetype(
        "Sobrevivente urbano",
        "Conhece passagens, ritmos e predadores da cidade como um ecossistema vivo.",
      ),
      archetype(
        "Protetor territorial",
        "Defende um lugar e as pessoas nele, ainda que rejeite qualquer título sobre ambos.",
      ),
      archetype(
        "Explorador errante",
        "Avança para onde os mapas acabam e traz de volta verdades que cortes preferem ignorar.",
      ),
    ],
  },
  {
    id: "clan:hecata",
    namePtBr: "Hecata",
    sourceRefs: [ref("SRC-0004", 24, 25, 26, 27)],
    summaryParagraphs: [
      "A Hecata reúne famílias e linhagens diferentes sob obrigações ligadas à morte. Seus membros tratam cadáveres, espíritos, heranças e segredos como parte de uma economia que atravessa gerações. Podem ser médiuns, investigadores, banqueiros, criminosos ou guardiões de ritos funerários.",
      "Pertencer à Hecata significa lidar com dever ancestral e culpa tanto quanto com necromancia. A família oferece recursos e proteção, mas cobra lealdade e silêncio. É uma escolha para personagens que querem investigar o que permanece depois da morte e decidir se tradição é amparo, dívida ou prisão. Mesmo entre parentes, confiança costuma ser negociada, lembrada por gerações e raramente desaparece.",
    ],
    deepDiveParagraphs: [
      "O clã moderno não é uma família homogênea: é um acordo desconfortável entre legados que antes competiam. Alguns foram criados dentro de círculos familiares; outros foram escolhidos por talento, contatos ou uma afinidade incomum com os mortos. Humor mórbido e pragmatismo ajudam a suportar uma existência em que parentes podem continuar presentes muito depois do funeral.",
      "Em jogo, estabeleça quem cobra a dívida do personagem e qual morto se recusa a permanecer em silêncio. A Hecata funciona melhor quando o sobrenatural encontra consequências íntimas: uma herança disputada, um espírito usado como fonte, um negócio que depende de sofrimento antigo. O domínio sobre a morte não elimina o luto; ele transforma o luto em relação, poder e responsabilidade.",
      "Escolha um rito familiar que ainda oferece conforto e outro que o personagem considera imperdoável. Essa diferença dá forma à sua posição dentro da Hecata e mostra se ele deseja reformar a família, fugir dela ou assumir o lugar de quem o feriu.",
    ],
    archetypes: [
      archetype(
        "Herdeiro funerário",
        "Recebeu negócios, ritos e dívidas de uma família que nunca deixa seus mortos partir.",
      ),
      archetype(
        "Especialista forense",
        "Lê corpos e cenas como arquivos, encontrando respostas que ainda cobram justiça.",
      ),
      archetype(
        "Médium pragmático",
        "Negocia com espíritos sem romantizar as vontades perigosas de quem já morreu.",
      ),
    ],
  },
  {
    id: "clan:lasombra",
    namePtBr: "Lasombra",
    sourceRefs: [ref("SRC-0004", 30, 31, 32, 33)],
    summaryParagraphs: [
      "Os Lasombra procuram excelência sob pressão e respeitam quem continua avançando quando apoio e certeza desaparecem. Operam por instituições, redes de influência e autoridade indireta, mas também podem atuar como líderes, infiltradores, confessores ou agentes de campo. Ambição é matéria-prima; crueldade não precisa ser destino.",
      "O clã testa candidatos e aliados para descobrir o que sobrevive à perda. Isso cria personagens estratégicos, resistentes e dispostos a assumir o controle, enquanto sua relação com o Oblívio afasta sua imagem do mundo humano. É uma escolha para explorar vitória, responsabilidade e o preço de tratar pessoas como instrumentos. Para eles, liderança sem resultado é apenas uma promessa vazia.",
    ],
    deepDiveParagraphs: [
      "Lasombra podem vir da política, religião, crime, forças armadas ou de vidas atravessadas por tragédia. O clã não deseja apenas pessoas bem-sucedidas; deseja quem demonstra capacidade de reconstruir poder depois de ser quebrado. Alguns governam abertamente, mas muitos preferem colocar a pessoa certa no centro e controlar as condições ao redor dela.",
      "Em jogo, descreva qual fracasso ensinou o personagem a nunca depender de misericórdia. Depois determine quem ele ainda não consegue reduzir a recurso. A tensão surge quando vencer exige destruir a instituição que queria herdar ou quando um subordinado demonstra mais grandeza que o mentor. O Lasombra mais interessante não é invencível: é alguém que acredita que toda derrota revela um defeito a ser arrancado.",
      "Defina o tipo de vitória que ele respeita e aquela que considera indigna, mesmo se eficaz. Quando essas duas medidas entram em choque, a ambição deixa de ser um rótulo e se torna uma ética perigosa, capaz de exigir sacrifícios que ninguém autorizou.",
    ],
    archetypes: [
      archetype(
        "Estrategista de bastidores",
        "Constrói as condições de uma vitória que outros acreditarão ter conquistado.",
      ),
      archetype(
        "Mentor exigente",
        "Forja talento por provações e precisa encarar o dano causado por seu método.",
      ),
      archetype(
        "Sobrevivente ambicioso",
        "Transformou uma perda devastadora em impulso, mas ainda teme voltar a ser impotente.",
      ),
    ],
  },
  {
    id: "clan:malkavian",
    namePtBr: "Malkavian",
    sourceRefs: [ref("SRC-0001", 77, 78, 79, 80, 81)],
    summaryParagraphs: [
      "Os Malkavian percebem padrões, emoções e fissuras que escapam aos outros. O clã busca pessoas sensíveis a perguntas difíceis: analistas, médiuns, investigadores, artistas ou observadores cuja experiência do mundo já desafia consensos. Sua visão pode revelar uma verdade decisiva, mas nunca deve ser tratada como piada.",
      "O Sangue também intensifica uma perturbação particular, tornando percepção e sofrimento inseparáveis. É uma escolha para histórias de interpretação, confiança e realidade subjetiva. A condição do personagem precisa ser construída com respeito, como parte de uma pessoa completa, e não como licença para comportamento aleatório. Relações, desejos e competência continuam existindo além dessa experiência.",
    ],
    deepDiveParagraphs: [
      "A famosa rede de presságios do clã não transforma todo Malkavian em profeta infalível. Ela oferece fragmentos, associações e ecos cuja interpretação depende de contexto. Alguns usam empatia para aconselhar; outros investigam obsessivamente ou constroem sistemas para organizar o que sentem. O que une a linhagem é a proximidade com verdades que a sociedade considera inconvenientes ou impossíveis.",
      "Em jogo, combine com o grupo como a perturbação se manifesta, quais limites não serão usados como espetáculo e que recursos o personagem possui para lidar com ela. Pergunte também qual padrão ele enxerga corretamente e qual conexão teme ter inventado. O horror nasce da incerteza e da vulnerabilidade, não da caricatura de saúde mental.",
      "Dê ao personagem práticas, pessoas e lugares que oferecem estabilidade, além de situações que a ameaçam. Isso permite representar dificuldade sem retirar agência e faz com que uma revelação Malkavian seja valiosa pelo contexto, não por comportamento imprevisível usado como atalho.",
    ],
    archetypes: [
      archetype(
        "Analista obsessivo",
        "Organiza sinais dispersos e teme que o único padrão verdadeiro seja aquele que ninguém acredita.",
      ),
      archetype(
        "Médium empático",
        "Escuta presenças e pessoas com igual atenção, carregando histórias que não consegue ignorar.",
      ),
      archetype(
        "Profeta inconveniente",
        "Diz o que a corte não quer ouvir e precisa separar advertência, medo e desejo.",
      ),
    ],
  },
  {
    id: "clan:ministry",
    namePtBr: "Ministry",
    sourceRefs: [ref("SRC-0004", 36, 37, 38, 39)],
    summaryParagraphs: [
      "O Ministry questiona proibições tratadas como verdades naturais. Seus membros podem ser sacerdotes, contrabandistas, donos de clubes, curadores de dependências ou conselheiros que oferecem exatamente aquilo que alguém acredita precisar. Para eles, testar uma regra pode revelar se ela protege, controla ou apenas produz culpa.",
      "Essa promessa de libertação é ambígua. Um Ministro pode ajudar alguém a romper um dogma destrutivo ou fabricar dependência para conquistar poder. O clã inclui tradições Setitas, mas não se reduz a uma única fé nem a vilões sem princípios. É uma escolha para explorar desejo, consentimento, crença e responsabilidade. Toda oferta revela também o que o Ministro deseja receber.",
    ],
    deepDiveParagraphs: [
      "O clã funciona ao mesmo tempo como linhagem e conjunto de cultos. A maior tradição histórica reverencia Set, porém cada templo pode reinterpretar o que significa desafiar deuses, leis e costumes. Alguns Ministros acreditam proteger pessoas de uma escuridão maior ao expor suas ilusões; outros transformam essa linguagem em justificativa para exploração. A pergunta sagrada não é simplesmente ‘como corromper?’, mas ‘quem decidiu que isto era pecado e a quem essa decisão serve?’.",
      "O Abraço costuma favorecer pessoas dispostas a enfrentar autoridade religiosa ou social e capazes de usar tentação como instrumento. Em jogo, defina qual liberdade o personagem oferece de verdade, qual necessidade ele sabe manipular e qual limite jamais deveria cruzar. O horror aparece quando cuidado e controle usam as mesmas palavras, ou quando uma transgressão legítima abre espaço para uma nova dependência.",
      "Determine ainda qual autoridade ele derrubou e que nova regra criou no lugar. Essa resposta impede que transgressão seja apenas pose: mostra se sua fé suporta consequências, se protege vulneráveis e se a libertação prometida continua válida quando alguém escolhe partir.",
    ],
    archetypes: [
      archetype(
        "Curador da fé",
        "Oferece significado e alívio, mas precisa distinguir cuidado espiritual de influência predatória.",
      ),
      archetype(
        "Orador do divino",
        "Transforma dúvida em rito e conduz pessoas a testar as autoridades que moldaram suas culpas.",
      ),
      archetype(
        "Fraudador veterano",
        "Conhece o preço de toda necessidade e talvez tenha começado a acreditar na própria promessa de libertação.",
      ),
    ],
  },
  {
    id: "clan:nosferatu",
    namePtBr: "Nosferatu",
    sourceRefs: [ref("SRC-0001", 83, 84, 85, 86, 87)],
    summaryParagraphs: [
      "Os Nosferatu transformam invisibilidade social, infraestrutura esquecida e informação em poder. Vivem nas camadas que uma cidade tenta esconder e constroem redes de observadores, fontes e favores. Podem ser investigadores, guardiões, engenheiros ou corretores de segredos — não apenas espiões isolados.",
      "O Abraço altera sua aparência de forma incontornável, mas isso não determina caráter ou valor. Muitos reconhecem e protegem pessoas que também foram descartadas; outros usam o que sabem para controlar. É uma escolha para explorar exposição, comunidade e o peso ético de conhecer aquilo que ninguém consentiu em revelar. Ser visto e ser conhecido deixam de significar a mesma coisa.",
    ],
    deepDiveParagraphs: [
      "A força do clã raramente depende de um único Nosferatu. Ela nasce de túneis, sistemas, animais, câmeras e relações de confiança que transformam fragmentos em inteligência. A informação pode comprar segurança num domínio hostil, mas cada segredo coletado cria uma decisão: compartilhar, vender, guardar ou destruir. Sua aparência torna a Máscara mais difícil e exige soluções inventivas.",
      "Em jogo, estabeleça qual comunidade ou sistema o personagem mantém funcionando e quem lhe oferece abrigo sem exigir que desapareça. Depois escolha um segredo que seria fácil explorar e difícil respeitar. Evite confundir deformidade com maldade; o horror do clã está na violência do olhar alheio e na tentação de responder a ela com vigilância total.",
      "Acrescente uma fonte que confia nele por razões pessoais e outra que apenas teme suas informações. A diferença ajuda a medir quando a rede é comunidade e quando virou mecanismo de controle, além de criar consequências claras para cada revelação.",
    ],
    archetypes: [
      archetype(
        "Corretor de segredos",
        "Conecta informações e pessoas, sabendo que toda revelação muda o equilíbrio de um domínio.",
      ),
      archetype(
        "Guardião subterrâneo",
        "Mantém um refúgio e sua comunidade longe dos olhos que os transformariam em alvo.",
      ),
      archetype(
        "Detetive de domínio",
        "Encontra pistas nos lugares descartados e cobra respostas dos que dependem de seu silêncio.",
      ),
    ],
  },
  {
    id: "clan:ravnos",
    namePtBr: "Ravnos",
    sourceRefs: [ref("SRC-0003", 7, 8, 9), ref("SRC-0004", 42, 43, 44, 45)],
    summaryParagraphs: [
      "Os Ravnos sobreviveram à quase destruição do clã por movimento, engenho e redes discretas. Preferem astúcia, encanto e percepção à força direta, atuando como mensageiros, negociadores, artistas, espiões ou prestadores de serviços entre territórios que não confiam uns nos outros.",
      "Seu Sangue torna permanência prolongada perigosa, mas viajar não define origem étnica nem obriga uma caricatura de trapaceiro. Cada Ravnos decide o que leva consigo e que comunidade ajuda a reconstruir. É uma escolha para histórias sobre identidade móvel, risco calculado e a dificuldade de criar vínculos quando ficar também machuca. Movimento não apaga responsabilidade nem transforma toda relação em passagem.",
    ],
    deepDiveParagraphs: [
      "Após uma catástrofe que eliminou grande parte da linhagem, os sobreviventes reinventam sinais, histórias e formas de cooperação. Alguns cruzam cidades; outros mudam de refúgio dentro do mesmo território. Seus serviços prosperam nas fronteiras: entregar algo impossível, negociar entre inimigos ou criar uma ilusão capaz de alterar a noite. A mobilidade pode ser liberdade, necessidade ou luto.",
      "Em jogo, defina qual promessa faz o personagem voltar, mesmo sabendo que não poderá permanecer. Escolha também um risco que ele considera digno e outro que apenas finge controlar. Trate comunidades viajantes e marginalizadas com respeito, sem usá-las como adereço. A identidade Ravnos nasce das escolhas diante da instabilidade, não de estereótipos associados a povos reais.",
      "Decida que história sobre o clã ele preserva e como a transmite sem entregar quem ainda está vulnerável. Isso liga mobilidade à memória coletiva e dá peso a cada rota, favor e reencontro, mesmo quando o refúgio precisa mudar outra vez.",
    ],
    archetypes: [
      archetype(
        "Mensageiro da meia-noite",
        "Cruza fronteiras hostis levando algo que nenhuma rede oficial conseguiria transportar.",
      ),
      archetype(
        "Negociador itinerante",
        "Conecta rivais por acordos temporários e nunca esquece quem tentou alterar os termos.",
      ),
      archetype(
        "Artista do risco",
        "Usa espetáculo e ilusão para mudar percepções, aceitando que a plateia também pode ser predadora.",
      ),
    ],
  },
  {
    id: "clan:salubri",
    namePtBr: "Salubri",
    sourceRefs: [ref("SRC-0003", 13, 14, 15), ref("SRC-0004", 48, 49, 50, 51)],
    summaryParagraphs: [
      "Os raros Salubri procuram cura, verdade ou redenção numa existência fundada na predação. Muitos foram escolhidos quando estavam feridos, morrendo ou diante de uma segunda chance; alguns confortam vítimas, enquanto outros caçam monstros que ninguém mais consegue deter. Compaixão não significa passividade.",
      "A história do clã foi marcada por perseguição e propaganda, e sua vitae desperta cobiça perigosa. Cada aliança exige decidir quanto revelar e em quem confiar. É uma escolha para personagens que enfrentam sofrimento sem acreditar que toda ferida pode ser apagada — inclusive a própria. Oferecer ajuda nunca elimina o direito de alguém recusá-la livremente e sem culpa.",
    ],
    deepDiveParagraphs: [
      "Os Salubri carregam tradições fragmentadas e versões conflitantes sobre sua queda. O terceiro olho e a reputação de santidade podem atrair esperança, suspeita ou caçadores. Alguns buscam Golconda; outros compreendem redenção como trabalho cotidiano ou voltam suas capacidades contra vampiros dominados pela Besta. A linhagem não possui uma resposta única para o que significa ser bom depois do Abraço.",
      "Em jogo, escolha qual dor o personagem consegue aliviar e qual sofrimento o deixa impotente. Decida também quem lhe ensinou a desconfiar de promessas de pureza. Evite transformá-lo em curador automático do grupo: sua empatia cria escolhas e custos. O conflito mais forte aparece quando ajudar alguém ameaça pessoas que dependem de seu segredo.",
      "Defina uma pessoa que o considera salvador e outra que conhece seus fracassos. Entre essas visões, o Salubri pode construir uma ética que reconheça limites, reparação e firmeza, em vez de usar a reputação de bondade como prova de inocência.",
    ],
    archetypes: [
      archetype(
        "Curador perseguido",
        "Alivia sofrimento enquanto cada demonstração de poder pode revelar sua existência aos caçadores.",
      ),
      archetype(
        "Vigia de monstros",
        "Usa compaixão para reconhecer quem ainda pode voltar e firmeza para deter quem não pode.",
      ),
      archetype(
        "Buscador da verdade",
        "Investiga a história apagada do clã sem confundir redenção com inocência.",
      ),
    ],
  },
  {
    id: "clan:toreador",
    namePtBr: "Toreador",
    sourceRefs: [ref("SRC-0001", 89, 90, 91, 92, 93)],
    summaryParagraphs: [
      "Os Toreador procuram intensidade estética e emocional onde outros veem rotina. Arte é um caminho, não o único: performance, moda, arquitetura, política social, festas e relações humanas também podem se tornar sua obra. O clã escolhe criadores, pioneiros e pessoas cuja presença muda o ambiente.",
      "Sua sensibilidade sustenta a ideia de que um vampiro ainda pode criar algo além de sofrimento, mas admiração pode virar posse e beleza pode interromper toda prudência. É uma escolha para personagens movidos por fascínio, desejo e legado — inclusive aqueles que temem não passar de imitadores eternos. A obra e o público sempre transformam um ao outro.",
    ],
    deepDiveParagraphs: [
      "A linhagem reúne artistas rigorosos, curadores, socialites, atores, escritores e pessoas Abraçadas por um impulso de beleza ou inocência que talvez não sobreviva à eternidade. Em cortes, Toreador influenciam gosto e reputação; fora delas, podem documentar comunidades, criar vanguardas ou preservar uma obra que ninguém mais entende. Sensibilidade não equivale a gentileza.",
      "Em jogo, defina o que faz o personagem perder a noção do tempo e quem consegue criticar sua obra com honestidade. Pergunte se ele cria para comunicar, controlar, recordar ou ser amado. A tensão aparece quando a busca pelo sublime transforma pessoas em matéria, ou quando uma criação imperfeita é mais humana do que tudo que produziu depois do Abraço.",
      "Escolha também uma forma de beleza que ele ainda não compreende e uma obra antiga que agora considera vazia. Essas mudanças mostram que gosto não é apenas decoração: é memória, relação social e uma medida instável do que ainda o comove.",
    ],
    archetypes: [
      archetype(
        "Artista obsessivo",
        "Persegue uma obra capaz de justificar a eternidade e teme que cada versão seja apenas tecnicamente perfeita.",
      ),
      archetype(
        "Curador decadente",
        "Decide o que merece atenção e pode transformar gosto em uma forma precisa de poder.",
      ),
      archetype(
        "Socialite predatório",
        "Lê ambientes e desejos com beleza calculada, mas ainda procura uma relação que não seja performance.",
      ),
    ],
  },
  {
    id: "clan:tremere",
    namePtBr: "Tremere",
    sourceRefs: [ref("SRC-0001", 95, 96, 97, 98, 99)],
    summaryParagraphs: [
      "Os Tremere converteram estudo oculto em poder organizado. Depois da queda de sua antiga hierarquia, casas e lealdades rivais disputam conhecimento, segurança e liberdade. O clã busca mentes brilhantes, praticantes do oculto, pesquisadores e pessoas capazes de trabalhar dentro — ou contra — sistemas exigentes.",
      "Todo avanço pode alterar a posição do personagem e de seus aliados. Mestres oferecem acesso enquanto cobram obediência; independência abre possibilidades e também isolamento. É uma escolha para histórias de aprendizado, ambição e confiança, em que saber algo nunca é o mesmo que compreender seu custo. Toda biblioteca tem guardiões, lacunas e condições de acesso.",
    ],
    deepDiveParagraphs: [
      "A Pirâmide já definiu como muitos Tremere aprendiam, obedeciam e vigiavam uns aos outros. Sua fragmentação não removeu essas práticas: deixou cada casa decidir quais preservar. Alguns desejam reconstruir autoridade; outros formam redes de pesquisa, círculos pagãos ou alianças pragmáticas. Feitiçaria de Sangue exige método, mas o método pode nascer de tradições muito diferentes.",
      "Em jogo, determine quem controla o acesso do personagem a conhecimento e qual descoberta ele jamais entregaria a essa pessoa. Escolha também um colega cuja competência ameaça sua posição. O Tremere mais interessante não acumula apenas fórmulas; ele decide que tipo de comunidade intelectual criará depois de escapar — ou herdar — uma estrutura abusiva.",
      "Registre um método que ele segue com rigor e uma intuição que não consegue justificar. O atrito entre ambos humaniza a pesquisa e mostra como rivalidade, confiança e responsabilidade importam tanto quanto o resultado correto de um ritual, sobretudo quando falha.",
    ],
    archetypes: [
      archetype(
        "Erudito eterno",
        "Trata a não-vida como pesquisa sem fim e precisa lembrar que pessoas não são apenas fontes.",
      ),
      archetype(
        "Dissidente da Pirâmide",
        "Carrega técnicas aprendidas num sistema que combate, mas ainda reproduz seus hábitos de controle.",
      ),
      archetype(
        "Consultor oculto",
        "Resolve problemas sobrenaturais para clientes que raramente compreendem o preço do serviço.",
      ),
    ],
  },
  {
    id: "clan:tzimisce",
    namePtBr: "Tzimisce",
    sourceRefs: [ref("SRC-0003", 17, 18, 19), ref("SRC-0004", 54, 55, 56, 57)],
    summaryParagraphs: [
      "Os Tzimisce entendem existência por posse e transformação. Seu domínio pode ser uma propriedade, uma organização, uma família, um bairro ou o próprio corpo. Hospitalidade e tirania nascem da mesma certeza: dentro do que consideram seu, tudo deve ocupar um lugar definido.",
      "O clã pode assumir formas modernas — empresários, líderes de gangue, militares, médicos ou guardiões comunitários — sem abandonar a questão central do controle. É uma escolha para explorar cuidado possessivo, identidade moldável e o momento em que proteger algo passa a significar aprisioná-lo. Transformar também significa aceitar que nenhuma forma, relação ou identidade precisa ser definitiva para sempre.",
    ],
    deepDiveParagraphs: [
      "A linhagem não está presa a castelos antigos. Um aplicativo, uma rede criminosa ou um conjunto habitacional podem ser domínios tão reais quanto uma propriedade ancestral. A transformação corporal amplia essa lógica: o corpo torna-se território, linguagem e obra. Alguns Tzimisce buscam transcendência; outros impõem sua visão às pessoas que chamam de hóspedes, servos ou família.",
      "Em jogo, nomeie aquilo que o personagem acredita possuir e o que faria para recuperá-lo. Depois defina uma pessoa que se recusa a caber nessa relação. O horror deve respeitar limites do grupo, especialmente quando envolve corpo e autonomia. A força narrativa vem do conflito entre hospitalidade genuína e a convicção de que gratidão concede propriedade.",
      "Decida como ele demonstra hospitalidade e qual regra um hóspede jamais pode quebrar. Quando essa regra é desafiada, fica claro se o domínio existe para sustentar vidas, expressar identidade ou apenas confirmar que sua vontade prevalece sobre todos, custe o que custar.",
    ],
    archetypes: [
      archetype(
        "Senhor territorial",
        "Mantém um domínio funcional e confunde responsabilidade por todos com autoridade sobre todos.",
      ),
      archetype(
        "Escultor de carne",
        "Usa transformação como arte e filosofia, diante da pergunta inevitável sobre consentimento.",
      ),
      archetype(
        "Guardião possessivo",
        "Protege sua comunidade de ameaças externas enquanto aperta lentamente os limites de quem vive nela.",
      ),
    ],
  },
  {
    id: "clan:ventrue",
    namePtBr: "Ventrue",
    sourceRefs: [ref("SRC-0001", 100, 101, 102, 103, 104)],
    summaryParagraphs: [
      "Os Ventrue são preparados para administrar poder, preservar legados e responder pelas estruturas que comandam. Procuram capacidade de liderança em executivos e políticos, mas também em organizadores comunitários, especialistas e pessoas cujo talento singular pode sustentar uma instituição.",
      "O clã ensina que autoridade precisa parecer inevitável e competente. Essa confiança pode proteger um domínio em crise ou converter pessoas em recursos de uma ordem supostamente superior. É uma escolha para personagens que querem liderar de verdade e descobrir se responsabilidade ainda existe quando ninguém consegue obrigá-los a prestar contas. Legitimidade precisa ser renovada, ainda que o clã prefira chamá-la de herança.",
    ],
    deepDiveParagraphs: [
      "Linhagem, apresentação e ritos de Abraço têm peso porque cada novo Ventrue representa quem o escolheu. Mentores podem investir anos na formação de um sucessor e exigir resultados compatíveis com o nome. No mundo contemporâneo, muitos evitam exposição pública direta e governam por conselhos, fundações, empresas, associações ou intermediários mortais.",
      "Em jogo, defina a instituição que o personagem acredita ser indispensável e quem paga pela estabilidade que ela oferece. Escolha um subordinado que poderia liderar melhor e um dever que ele não pode delegar. Evite limitar o clã à riqueza corporativa: o núcleo é a crença em autoridade, legado e comando, seja numa cidade inteira ou numa pequena comunidade.",
      "Determine ainda qual tradição ele preserva por convicção e qual mantém apenas para não parecer fraco. Essa diferença revela onde a liderança pode evoluir e onde o medo de perder posição transforma prudência em autoritarismo diante de todos, sem exceção.",
    ],
    archetypes: [
      archetype(
        "Herdeiro institucional",
        "Recebe uma estrutura poderosa e precisa decidir se preserva o legado ou corrige seu fundamento injusto.",
      ),
      archetype(
        "Patrono comunitário",
        "Mobiliza recursos e proteção, esperando em troca uma obediência que chama de confiança.",
      ),
      archetype(
        "Líder em formação",
        "Foi escolhido por uma competência rara e agora aprende que governar também significa assumir culpa.",
      ),
    ],
  },
  {
    id: "origin:caitiff",
    namePtBr: "Caitiff",
    sourceRefs: [ref("SRC-0001", 107, 108, 109), ref("SRC-0004", 66, 67, 126, 127)],
    summaryParagraphs: [
      "Caitiff são vampiros sem uma linhagem de clã reconhecível. Alguns foram abandonados, outros nunca manifestaram a herança esperada e alguns foram criados deliberadamente fora das convenções. A ausência de clã permite caminhos incomuns, mas a sociedade dos Membros frequentemente responde com suspeita, exploração ou violência.",
      "Eles sobrevivem por adaptação, utilidade e redes construídas entre rejeitados. Escolher Caitiff não significa escolher um vampiro sem identidade: significa construir essa identidade sem a proteção de uma genealogia aceita e decidir quanto da própria condição será escondido.",
    ],
    deepDiveParagraphs: [
      "Caitiff podem aprender combinações variadas de Disciplinas, embora toda progressão custe mais experiência que uma Disciplina de clã. Na criação, escolhem duas Disciplinas e distribuem dois pontos em uma e um na outra; essa decisão ocorrerá na etapa de Disciplinas. Também começam sob suspeita social e não compram Status na criação.",
      "Agora, esta etapa registra apenas a origem e o tipo autoritativo do personagem. A escolha de Disciplinas será feita depois, sem criar uma ficha paralela. O personagem não recebe Perdição nem Compulsão de clã; eventuais Qualidades e Defeitos específicos pertencem à etapa apropriada.",
    ],
    archetypes: [
      archetype(
        "Sobrevivente sem linhagem",
        "Construiu método e vínculos próprios depois de ser deixado sem explicações.",
      ),
      archetype(
        "Autodidata do Sangue",
        "Aprende capacidades por observação e risco, pagando mais caro por não ter tradição reconhecida.",
      ),
      archetype(
        "Pária diplomático",
        "Torna-se necessário a várias facções sem jamais confundir utilidade com aceitação.",
      ),
    ],
  },
  {
    id: "origin:thin-blood",
    namePtBr: "Sangue-Ralo",
    sourceRefs: [
      ref("SRC-0001", 111, 112, 113, 114, 115, 182, 183, 184),
      ref("SRC-0004", 66, 67, 126),
    ],
    summaryParagraphs: [
      "Sangues-Ralos existem no limite da condição vampírica e são temidos como presságios por muitos Membros. Seu Sangue mantém Potência zero, aproxima-os de aspectos da vida mortal e permite relações particulares com ressonâncias e Alquimia Sangue-Ralo. Essas diferenças não os tornam automaticamente seguros ou aceitos.",
      "Muitos permanecem próximos do cotidiano humano, formam redes locais ou descobrem funções que vampiros mais antigos desprezam. Escolher esta origem é explorar uma existência precária, inventiva e cercada por instituições que querem usá-la, expulsá-la ou negá-la.",
    ],
    deepDiveParagraphs: [
      "Sangues-Ralos não têm Disciplinas intrínsecas de clã. Ao beber sangue com determinada Ressonância, podem manifestar temporariamente um ponto e um poder associado; uma Ressonância intensa pode ampliar esse efeito. A Alquimia Sangue-Ralo é um caminho próprio de fórmulas e será tratada na etapa adequada.",
      "Agora, a escolha registra a origem, Potência do Sangue zero e a ausência de Perdição e Compulsão de clã. Mais adiante, o personagem deverá receber de uma a três Qualidades Sangue-Ralo e o mesmo número de Defeitos Sangue-Ralo. Ele não escolhe Tipo de Predador na criação e não recebe por ele pontos de Disciplina. Geração e Humanidade continuam fora desta tela.",
    ],
    archetypes: [
      archetype(
        "Sobrevivente crepuscular",
        "Equilibra hábitos humanos e necessidades vampíricas enquanto nenhum dos dois mundos o aceita por inteiro.",
      ),
      archetype(
        "Alquimista autodidata",
        "Transforma limitações do Sangue em fórmulas que anciões não conseguem reproduzir.",
      ),
      archetype(
        "Conector das margens",
        "Cria redes entre Sangues-Ralos e conhece o que acontece na cidade antes das cortes.",
      ),
    ],
  },
];

export const CLAN_PRESENTATIONS = Object.fromEntries(
  presentations.map((presentation) => [presentation.id, presentation]),
) as Readonly<Record<CreationOriginId, ClanPresentation>>;

export function getClanPresentation(id: CreationOriginId): ClanPresentation {
  return CLAN_PRESENTATIONS[id];
}
