import { ServiceCategory, FAQ, News } from "@/types";

export const serviceCategories: ServiceCategory[] = [
  // =========================================================================
  // 1. Acessibilidade
  // =========================================================================
  {
    id: "acessibilidade",
    name: "Acessibilidade",
    icon: "Accessibility",
    slug: "acessibilidade",
    description: "Serviços relacionados à acessibilidade urbana e inclusão de pessoas com deficiência",
    services: [
      {
        id: "rampa-acesso",
        name: "Rampa de Acesso",
        slug: "rampa-acesso",
        categoryId: "acessibilidade",
        description: "Solicitação de rampa de acesso em calçadas",
        requiresAuth: false,
        detailedInfo: {
          oQueE: "Serviço de construção ou adequação de rampas de acesso em calçadas e vias públicas para garantir a mobilidade de pessoas com deficiência ou mobilidade reduzida. A Prefeitura de Belford Roxo avalia e executa a obra conforme normas técnicas de acessibilidade.",
          paraQueServe: "Este serviço serve para garantir a acessibilidade urbana, permitindo que pessoas com deficiência física, cadeirantes, idosos e pessoas com mobilidade reduzida possam circular pelas calçadas com segurança e autonomia.",
          quemPodeSolicitar: "Qualquer cidadão pode solicitar a construção de rampa de acesso em via pública.",
          informacoesComplementares: "A solicitação será avaliada pela equipe técnica da Secretaria de Obras. O local deve atender aos critérios técnicos de viabilidade conforme a NBR 9050.",
          informacoesNecessarias: [
            "Nome completo do solicitante",
            "Endereço completo do local solicitado",
            "Justificativa da necessidade",
            "Fotos do local (opcional)"
          ],
          tempoAtendimento: "Até 30 dias para avaliação técnica",
          legislacao: [
            "Lei Federal nº 13.146/2015 (Estatuto da Pessoa com Deficiência)",
            "NBR 9050 - Acessibilidade a edificações, mobiliário, espaços e equipamentos urbanos"
          ]
        },
        fields: [
          { id: "description", name: "description", label: "Descrição", type: "textarea", required: true, placeholder: "Descreva a necessidade da rampa de acesso" },
          { id: "address", name: "address", label: "Local da solicitação", type: "address", required: true },
          { id: "attachment", name: "attachment", label: "Fotos do local", type: "file", required: false }
        ]
      },
      {
        id: "vaga-deficiente",
        name: "Vaga para Pessoa com Deficiência",
        slug: "vaga-deficiente",
        categoryId: "acessibilidade",
        description: "Solicitação de vaga exclusiva para pessoa com deficiência",
        requiresAuth: false,
        detailedInfo: {
          oQueE: "Serviço de demarcação de vaga exclusiva para estacionamento de veículos que transportam pessoas com deficiência ou mobilidade reduzida em vias e logradouros públicos de Belford Roxo.",
          paraQueServe: "Garantir que pessoas com deficiência tenham acesso facilitado a estabelecimentos e locais públicos através de vagas de estacionamento próximas, adequadas e sinalizadas.",
          quemPodeSolicitar: "Pessoas com deficiência física ou mobilidade reduzida, ou seus representantes legais.",
          informacoesComplementares: "É necessário apresentar laudo médico comprovando a deficiência. A vaga será avaliada conforme disponibilidade e critérios técnicos de engenharia de tráfego.",
          informacoesNecessarias: [
            "Nome completo",
            "CPF",
            "Endereço residencial",
            "Local solicitado para a vaga",
            "Laudo médico comprovando a deficiência"
          ],
          tempoAtendimento: "Até 45 dias",
          legislacao: [
            "Lei Federal nº 13.146/2015",
            "Resolução CONTRAN nº 304/2008"
          ]
        },
        fields: [
          { id: "description", name: "description", label: "Justificativa", type: "textarea", required: true, placeholder: "Descreva a necessidade da vaga exclusiva" },
          { id: "cpf", name: "cpf", label: "CPF do solicitante", type: "cpf", required: true },
          { id: "address", name: "address", label: "Local solicitado", type: "address", required: true },
          { id: "attachment", name: "attachment", label: "Laudo médico", type: "file", required: true }
        ]
      },
      {
        id: "piso-tatil",
        name: "Piso Tátil em Via Pública",
        slug: "piso-tatil",
        categoryId: "acessibilidade",
        description: "Solicitação de instalação de piso tátil em calçadas e espaços públicos",
        requiresAuth: false,
        detailedInfo: {
          oQueE: "Serviço para solicitar a instalação de piso tátil direcional e de alerta em calçadas, praças e equipamentos públicos de Belford Roxo, auxiliando na locomoção de pessoas com deficiência visual.",
          paraQueServe: "Proporcionar orientação e segurança para pessoas com deficiência visual ao se deslocarem por vias e espaços públicos, promovendo sua autonomia e inclusão social.",
          quemPodeSolicitar: "Qualquer cidadão pode solicitar a instalação de piso tátil em espaços públicos.",
          informacoesComplementares: "A instalação será avaliada pela Secretaria de Obras em conjunto com a Coordenadoria de Acessibilidade. A prioridade é para locais de grande circulação e proximidade de equipamentos públicos.",
          informacoesNecessarias: [
            "Endereço completo do local",
            "Descrição do trecho que necessita de piso tátil",
            "Ponto de referência",
            "Fotos do local (opcional)"
          ],
          tempoAtendimento: "Até 45 dias para avaliação e execução",
          legislacao: [
            "Lei Federal nº 13.146/2015 (Estatuto da Pessoa com Deficiência)",
            "NBR 16537 - Sinalização tátil no piso"
          ]
        },
        fields: [
          { id: "description", name: "description", label: "Descrição da necessidade", type: "textarea", required: true, placeholder: "Descreva o trecho que necessita de piso tátil" },
          { id: "address", name: "address", label: "Endereço", type: "address", required: true },
          { id: "attachment", name: "attachment", label: "Fotos do local", type: "file", required: false }
        ]
      }
    ]
  },

  // =========================================================================
  // 2. Animais
  // =========================================================================
  {
    id: "animais",
    name: "Animais",
    icon: "Dog",
    slug: "animais",
    description: "Serviços relacionados a animais domésticos e fauna silvestre",
    services: [
      {
        id: "animais-silvestres",
        name: "Resgate de Animais Silvestres",
        slug: "animais-silvestres",
        categoryId: "animais",
        description: "Solicitação de resgate de animais silvestres",
        requiresAuth: false,
        detailedInfo: {
          oQueE: "O serviço de Resgate de Animais Silvestres é realizado pela patrulha ambiental de Belford Roxo. Ele atua no resgate de animais que pertencem à fauna brasileira e que vivem em seus habitats naturais, como florestas, mangues e restingas.",
          paraQueServe: "Este serviço serve para resgatar animais silvestres da fauna brasileira que estejam em situação de risco ou fora de seu habitat natural, garantindo sua segurança e bem-estar.",
          quemPodeSolicitar: "Qualquer cidadão pode solicitar o resgate de animais silvestres.",
          informacoesComplementares: "Nos casos de ferimento causado pelo animal, procure uma das Unidades de Saúde ou o Polo de Atendimento Antirrábico de Belford Roxo.",
          informacoesNecessarias: [
            "Nome completo",
            "Telefone",
            "Endereço completo da ocorrência com ponto de referência",
            "Descrever o tipo de animal silvestre e informar se ele está agitado, machucado ou doente"
          ],
          tempoAtendimento: "Até 24 horas",
          legislacao: [
            "Lei nº 9.605/1998",
            "Decreto nº 6.514/2008",
            "Lei Estadual nº 3900/2002"
          ]
        },
        fields: [
          { id: "description", name: "description", label: "Descrição", type: "textarea", required: true, placeholder: "Descreva o tipo de animal e a situação" },
          { id: "address", name: "address", label: "Endereço", type: "address", required: true },
          { id: "attachment", name: "attachment", label: "Fotos ou vídeos", type: "file", required: false }
        ]
      },
      {
        id: "maus-tratos",
        name: "Maus Tratos a Animais",
        slug: "maus-tratos",
        categoryId: "animais",
        description: "Denúncias de maus tratos a animais",
        requiresAuth: false,
        detailedInfo: {
          oQueE: "Serviço para denunciar casos de maus tratos, abandono, crueldade ou qualquer forma de violência contra animais domésticos ou silvestres no município de Belford Roxo.",
          paraQueServe: "Este serviço serve para proteger os animais de situações de maus tratos, abandono e crueldade, garantindo que os responsáveis sejam identificados e punidos conforme a lei.",
          quemPodeSolicitar: "Qualquer cidadão pode fazer uma denúncia de maus tratos a animais.",
          informacoesComplementares: "As denúncias podem ser feitas de forma anônima. A Guarda Municipal e órgãos de fiscalização serão acionados para verificar a situação.",
          informacoesNecessarias: [
            "Endereço completo da ocorrência com ponto de referência",
            "Descrição detalhada da situação de maus tratos",
            "Tipo de animal (cão, gato, etc.)",
            "Fotos ou vídeos como evidência (se possível)"
          ],
          tempoAtendimento: "Até 48 horas",
          legislacao: [
            "Lei Federal nº 9.605/1998 (Lei de Crimes Ambientais)",
            "Lei Federal nº 14.064/2020 (Lei Sansão)",
            "Decreto nº 24.645/1934"
          ]
        },
        fields: [
          { id: "description", name: "description", label: "Descrição da situação", type: "textarea", required: true, placeholder: "Descreva detalhadamente os maus tratos observados" },
          { id: "address", name: "address", label: "Endereço da ocorrência", type: "address", required: true },
          { id: "attachment", name: "attachment", label: "Evidências (fotos/vídeos)", type: "file", required: false }
        ]
      },
      {
        id: "vacinacao-animais",
        name: "Vacinação de Animais",
        slug: "vacinacao-animais",
        categoryId: "animais",
        description: "Informações e agendamento de vacinação antirrábica",
        requiresAuth: false,
        detailedInfo: {
          oQueE: "Serviço de vacinação antirrábica gratuita para cães e gatos, realizado pela Secretaria Municipal de Saúde de Belford Roxo nos postos de vacinação e em campanhas itinerantes.",
          paraQueServe: "A vacinação antirrábica protege seu animal de estimação contra a raiva, doença fatal que pode ser transmitida aos seres humanos. É uma medida essencial de saúde pública.",
          quemPodeSolicitar: "Qualquer cidadão residente em Belford Roxo que possua cães ou gatos.",
          informacoesComplementares: "A vacinação é gratuita e obrigatória por lei. O animal deve ter mais de 3 meses de idade e estar saudável no momento da vacinação.",
          informacoesNecessarias: [
            "Nome do tutor",
            "Endereço completo",
            "Tipo de animal (cão ou gato)",
            "Quantidade de animais"
          ],
          tempoAtendimento: "Conforme calendário de vacinação",
          legislacao: [
            "Lei Municipal de Controle de Zoonoses",
            "Lei Federal nº 6.259/1975"
          ]
        },
        fields: [
          { id: "animal_type", name: "animal_type", label: "Tipo de animal", type: "select", required: true, options: [{ value: "cachorro", label: "Cachorro" }, { value: "gato", label: "Gato" }] },
          { id: "address", name: "address", label: "Endereço", type: "address", required: true }
        ]
      }
    ]
  },

  // =========================================================================
  // 3. Assistência Social
  // =========================================================================
  {
    id: "assistencia-social",
    name: "Assistência Social",
    icon: "Heart",
    slug: "assistencia-social",
    description: "Serviços de assistência social e proteção à população vulnerável",
    services: [
      {
        id: "cadastro-unico",
        name: "Cadastro Único",
        slug: "cadastro-unico",
        categoryId: "assistencia-social",
        description: "Informações sobre o Cadastro Único para Programas Sociais",
        requiresAuth: false,
        detailedInfo: {
          oQueE: "O Cadastro Único (CadÚnico) é um registro que permite ao governo identificar todas as famílias de baixa renda do Brasil. É a porta de entrada para diversos programas sociais federais, estaduais e municipais.",
          paraQueServe: "O CadÚnico serve para que as famílias de baixa renda possam ter acesso a programas sociais como Bolsa Família, Tarifa Social de Energia Elétrica, BPC, entre outros benefícios.",
          quemPodeSolicitar: "Famílias com renda mensal de até meio salário mínimo por pessoa ou renda familiar total de até três salários mínimos.",
          informacoesComplementares: "O cadastramento deve ser feito presencialmente no CRAS mais próximo de sua residência em Belford Roxo. Leve os documentos de todos os membros da família.",
          informacoesNecessarias: [
            "CPF ou Título de Eleitor do responsável familiar",
            "Documentos de identificação de todos os membros da família",
            "Comprovante de residência",
            "Comprovante de renda (se houver)"
          ],
          tempoAtendimento: "Atendimento imediato no CRAS",
          legislacao: [
            "Decreto nº 6.135/2007",
            "Lei nº 14.601/2023"
          ]
        },
        fields: []
      },
      {
        id: "cras-atendimento",
        name: "Atendimento no CRAS",
        slug: "cras-atendimento",
        categoryId: "assistencia-social",
        description: "Informações sobre atendimento no CRAS",
        requiresAuth: false,
        detailedInfo: {
          oQueE: "O Centro de Referência de Assistência Social (CRAS) é a porta de entrada da assistência social em Belford Roxo, oferecendo serviços e programas de proteção social básica às famílias em situação de vulnerabilidade.",
          paraQueServe: "O CRAS oferece orientação, encaminhamento para serviços sociais, acompanhamento familiar, atividades socioeducativas e acesso a programas de transferência de renda.",
          quemPodeSolicitar: "Qualquer cidadão em situação de vulnerabilidade social ou que necessite de orientação sobre programas sociais.",
          informacoesComplementares: "O atendimento é gratuito e sigiloso. Procure o CRAS mais próximo de sua residência em Belford Roxo.",
          informacoesNecessarias: [
            "Documento de identificação",
            "Comprovante de residência"
          ],
          tempoAtendimento: "Atendimento por ordem de chegada ou agendamento",
          legislacao: [
            "Lei nº 8.742/1993 (LOAS)",
            "Política Nacional de Assistência Social"
          ]
        },
        fields: [
          { id: "motivo", name: "motivo", label: "Motivo do atendimento", type: "textarea", required: true, placeholder: "Descreva o motivo do atendimento" }
        ]
      },
      {
        id: "abordagem-social",
        name: "Abordagem Social",
        slug: "abordagem-social",
        categoryId: "assistencia-social",
        description: "Solicitação de abordagem social para pessoas em situação de rua",
        requiresAuth: false,
        detailedInfo: {
          oQueE: "Serviço de abordagem social realizado por equipes especializadas da Secretaria de Assistência Social de Belford Roxo para atendimento de pessoas em situação de rua, mendicância ou vulnerabilidade extrema.",
          paraQueServe: "Oferecer acolhimento, orientação e encaminhamento para serviços de proteção social a pessoas em situação de rua, garantindo seus direitos e dignidade.",
          quemPodeSolicitar: "Qualquer cidadão pode solicitar a abordagem social ao identificar pessoas em situação de vulnerabilidade nas ruas de Belford Roxo.",
          informacoesComplementares: "A equipe de abordagem social realiza atendimentos diurnos e noturnos. O serviço é articulado com o CREAS e abrigos municipais.",
          informacoesNecessarias: [
            "Local onde a pessoa se encontra (endereço ou ponto de referência)",
            "Descrição da situação observada",
            "Quantidade de pessoas no local",
            "Se há crianças ou idosos envolvidos"
          ],
          tempoAtendimento: "Até 24 horas",
          legislacao: [
            "Lei nº 8.742/1993 (LOAS)",
            "Decreto nº 7.053/2009 (Política Nacional para População em Situação de Rua)"
          ]
        },
        fields: [
          { id: "description", name: "description", label: "Descrição da situação", type: "textarea", required: true, placeholder: "Descreva a situação observada" },
          { id: "address", name: "address", label: "Local", type: "address", required: true }
        ]
      }
    ]
  },

  // =========================================================================
  // 4. Cidadania e Direitos Humanos
  // =========================================================================
  {
    id: "cidadania-direitos-humanos",
    name: "Cidadania e Direitos Humanos",
    icon: "Users",
    slug: "cidadania-direitos-humanos",
    description: "Serviços voltados à promoção da cidadania e defesa dos direitos humanos",
    services: [
      {
        id: "denuncia-violacao-direitos",
        name: "Denúncia de Violação de Direitos Humanos",
        slug: "denuncia-violacao-direitos",
        categoryId: "cidadania-direitos-humanos",
        description: "Canal para denúncias de violações de direitos humanos",
        requiresAuth: false,
        detailedInfo: {
          oQueE: "Serviço para registro de denúncias de violações de direitos humanos no município de Belford Roxo, incluindo discriminação racial, religiosa, por orientação sexual, por deficiência, ou qualquer outra forma de violação de direitos fundamentais.",
          paraQueServe: "Garantir que casos de violação de direitos humanos sejam registrados, investigados e encaminhados aos órgãos competentes para as devidas providências legais e de acolhimento.",
          quemPodeSolicitar: "Qualquer cidadão, vítima ou testemunha de violação de direitos humanos.",
          informacoesComplementares: "A denúncia pode ser feita de forma anônima. Casos graves serão encaminhados ao Ministério Público e à Defensoria Pública. O sigilo é garantido.",
          informacoesNecessarias: [
            "Descrição detalhada da violação ocorrida",
            "Local e data aproximada da ocorrência",
            "Dados da vítima (se autorizado)",
            "Dados do agressor (se conhecidos)"
          ],
          tempoAtendimento: "Até 48 horas para análise e encaminhamento",
          legislacao: [
            "Constituição Federal - Art. 5º (Direitos e Garantias Fundamentais)",
            "Lei Federal nº 7.716/1989 (Lei do Racismo)",
            "Declaração Universal dos Direitos Humanos"
          ]
        },
        fields: [
          { id: "description", name: "description", label: "Descrição da violação", type: "textarea", required: true, placeholder: "Descreva detalhadamente a violação de direitos humanos" },
          { id: "date", name: "date", label: "Data da ocorrência", type: "date", required: false },
          { id: "address", name: "address", label: "Local da ocorrência", type: "address", required: false },
          { id: "attachment", name: "attachment", label: "Documentos ou evidências", type: "file", required: false }
        ]
      },
      {
        id: "mediacao-conflitos",
        name: "Mediação de Conflitos Comunitários",
        slug: "mediacao-conflitos",
        categoryId: "cidadania-direitos-humanos",
        description: "Solicitação de mediação para conflitos comunitários e de vizinhança",
        requiresAuth: false,
        detailedInfo: {
          oQueE: "Serviço de mediação de conflitos comunitários e de vizinhança oferecido pela Secretaria de Direitos Humanos de Belford Roxo. Mediadores capacitados auxiliam na resolução pacífica de disputas entre moradores.",
          paraQueServe: "Promover a resolução pacífica de conflitos comunitários, evitando a judicialização e fortalecendo os laços de convivência entre os moradores dos bairros de Belford Roxo.",
          quemPodeSolicitar: "Qualquer cidadão envolvido em conflito comunitário ou de vizinhança que deseje resolver a questão de forma pacífica.",
          informacoesComplementares: "A mediação é gratuita e voluntária. Ambas as partes precisam concordar em participar. As sessões são realizadas nos equipamentos públicos do município.",
          informacoesNecessarias: [
            "Nome completo do solicitante",
            "Telefone para contato",
            "Descrição do conflito",
            "Endereço onde ocorre o conflito",
            "Dados da outra parte envolvida (se possível)"
          ],
          tempoAtendimento: "Até 10 dias úteis para agendamento da sessão",
          legislacao: [
            "Lei Federal nº 13.140/2015 (Lei de Mediação)",
            "Resolução nº 125/2010 do CNJ"
          ]
        },
        fields: [
          { id: "description", name: "description", label: "Descrição do conflito", type: "textarea", required: true, placeholder: "Descreva o conflito e as partes envolvidas" },
          { id: "phone", name: "phone", label: "Telefone para contato", type: "phone", required: true },
          { id: "address", name: "address", label: "Local do conflito", type: "address", required: true }
        ]
      },
      {
        id: "protecao-idoso",
        name: "Proteção à Pessoa Idosa",
        slug: "protecao-idoso",
        categoryId: "cidadania-direitos-humanos",
        description: "Denúncia de violação de direitos da pessoa idosa",
        requiresAuth: false,
        detailedInfo: {
          oQueE: "Serviço para registro de denúncias de violação de direitos de pessoas idosas em Belford Roxo, incluindo abandono, negligência, maus tratos, abuso financeiro e violência física ou psicológica.",
          paraQueServe: "Proteger as pessoas idosas de qualquer forma de violação de seus direitos, garantindo que os casos sejam investigados e que as vítimas recebam o acolhimento e proteção necessários.",
          quemPodeSolicitar: "Qualquer cidadão pode denunciar situações de violação de direitos da pessoa idosa.",
          informacoesComplementares: "A denúncia pode ser anônima. Os casos são encaminhados ao Conselho Municipal do Idoso, Ministério Público e delegacias especializadas quando necessário.",
          informacoesNecessarias: [
            "Descrição detalhada da situação",
            "Endereço da vítima ou local da ocorrência",
            "Relação entre vítima e agressor (se conhecida)",
            "Dados de contato para acompanhamento (opcional)"
          ],
          tempoAtendimento: "Até 24 horas para casos urgentes; até 72 horas para demais casos",
          legislacao: [
            "Lei Federal nº 10.741/2003 (Estatuto do Idoso)",
            "Lei Federal nº 8.842/1994 (Política Nacional do Idoso)"
          ]
        },
        fields: [
          { id: "description", name: "description", label: "Descrição da situação", type: "textarea", required: true, placeholder: "Descreva a situação de violação dos direitos do idoso" },
          { id: "address", name: "address", label: "Endereço da ocorrência", type: "address", required: true },
          { id: "attachment", name: "attachment", label: "Evidências", type: "file", required: false }
        ]
      }
    ]
  },

  // =========================================================================
  // 5. Conservação
  // =========================================================================
  {
    id: "conservacao",
    name: "Conservação",
    icon: "Wrench",
    slug: "conservacao",
    description: "Serviços de conservação e manutenção urbana",
    services: [
      {
        id: "buraco-rua",
        name: "Buraco na Rua",
        slug: "buraco-rua",
        categoryId: "conservacao",
        description: "Solicitação de reparo de buraco em vias públicas",
        requiresAuth: false,
        detailedInfo: {
          oQueE: "Serviço de tapa-buraco para reparar buracos, depressões e irregularidades no asfalto das vias públicas do município de Belford Roxo. A execução é feita pela Secretaria de Conservação.",
          paraQueServe: "Este serviço serve para manter as vias públicas em boas condições de trafegabilidade, garantindo a segurança dos motoristas, motociclistas, ciclistas e pedestres.",
          quemPodeSolicitar: "Qualquer cidadão pode solicitar o reparo de buracos em vias públicas.",
          informacoesComplementares: "O serviço é realizado pela Secretaria de Conservação. A prioridade de atendimento considera o risco à segurança e o volume de tráfego no local.",
          informacoesNecessarias: [
            "Endereço completo da via (nome da rua e número próximo)",
            "Ponto de referência",
            "Descrição do tamanho aproximado do buraco",
            "Foto do local (opcional, mas ajuda na identificação)"
          ],
          tempoAtendimento: "Até 15 dias úteis",
          legislacao: [
            "Código de Trânsito Brasileiro",
            "Lei Municipal de Conservação de Vias"
          ]
        },
        fields: [
          { id: "description", name: "description", label: "Descrição do problema", type: "textarea", required: true, placeholder: "Descreva o tamanho e localização exata do buraco" },
          { id: "address", name: "address", label: "Endereço", type: "address", required: true },
          { id: "attachment", name: "attachment", label: "Foto do buraco", type: "file", required: false }
        ]
      },
      {
        id: "calcada-danificada",
        name: "Calçada Danificada",
        slug: "calcada-danificada",
        categoryId: "conservacao",
        description: "Reparo de calçadas danificadas em vias públicas",
        requiresAuth: false,
        detailedInfo: {
          oQueE: "Serviço de reparo e manutenção de calçadas públicas que estejam danificadas, quebradas ou oferecendo risco aos pedestres em Belford Roxo.",
          paraQueServe: "Garantir a segurança e acessibilidade dos pedestres, especialmente idosos, pessoas com deficiência e crianças.",
          quemPodeSolicitar: "Qualquer cidadão pode solicitar o reparo de calçadas em vias públicas.",
          informacoesComplementares: "O serviço contempla apenas calçadas públicas. Calçadas em frente a imóveis particulares são de responsabilidade do proprietário conforme o Código de Posturas Municipal.",
          informacoesNecessarias: [
            "Endereço completo",
            "Descrição do dano",
            "Fotos do local"
          ],
          tempoAtendimento: "Até 30 dias úteis",
          legislacao: [
            "Código de Obras Municipal",
            "Lei de Acessibilidade nº 13.146/2015"
          ]
        },
        fields: [
          { id: "description", name: "description", label: "Descrição", type: "textarea", required: true, placeholder: "Descreva o dano na calçada" },
          { id: "address", name: "address", label: "Endereço", type: "address", required: true },
          { id: "attachment", name: "attachment", label: "Fotos", type: "file", required: false }
        ]
      },
      {
        id: "poda-arvore",
        name: "Poda de Árvore",
        slug: "poda-arvore",
        categoryId: "conservacao",
        description: "Solicitação de poda de árvores em via pública",
        requiresAuth: false,
        detailedInfo: {
          oQueE: "Serviço de poda de árvores localizadas em vias públicas, praças e áreas verdes do município. A poda é realizada por equipe especializada da Secretaria de Meio Ambiente de Belford Roxo.",
          paraQueServe: "Manter a arborização urbana saudável, prevenir acidentes causados por galhos que possam cair, e garantir que as árvores não interfiram na iluminação pública ou na fiação elétrica.",
          quemPodeSolicitar: "Qualquer cidadão pode solicitar a poda de árvores em áreas públicas.",
          informacoesComplementares: "Não é permitida a poda ou corte de árvores pelo cidadão sem autorização. Árvores em terrenos particulares requerem autorização específica da Secretaria de Meio Ambiente.",
          informacoesNecessarias: [
            "Endereço completo",
            "Descrição da árvore (tipo, tamanho aproximado)",
            "Motivo da solicitação (galhos sobre fiação, obstruindo via, etc.)",
            "Fotos da árvore"
          ],
          tempoAtendimento: "Até 20 dias úteis",
          legislacao: [
            "Lei Federal nº 12.651/2012 (Código Florestal)",
            "Código Municipal de Meio Ambiente"
          ]
        },
        fields: [
          { id: "description", name: "description", label: "Descrição", type: "textarea", required: true, placeholder: "Descreva a necessidade da poda" },
          { id: "address", name: "address", label: "Endereço da árvore", type: "address", required: true },
          { id: "attachment", name: "attachment", label: "Fotos", type: "file", required: false }
        ]
      }
    ]
  },

  // =========================================================================
  // 6. Cultura, Esporte e Lazer
  // =========================================================================
  {
    id: "cultura-esporte-lazer",
    name: "Cultura, Esporte e Lazer",
    icon: "Palette",
    slug: "cultura-esporte-lazer",
    description: "Serviços relacionados a cultura, esporte, lazer e atividades recreativas",
    services: [
      {
        id: "agendamento-espaco-cultural",
        name: "Agendamento de Espaços Culturais",
        slug: "agendamento-espaco-cultural",
        categoryId: "cultura-esporte-lazer",
        description: "Reserva de espaços culturais municipais para eventos e apresentações",
        requiresAuth: true,
        detailedInfo: {
          oQueE: "Serviço de agendamento e reserva de espaços culturais públicos do município de Belford Roxo, como centros culturais, teatros municipais e espaços de convivência, para a realização de eventos artísticos e culturais.",
          paraQueServe: "Permitir que artistas, coletivos culturais, ONGs e cidadãos utilizem os espaços culturais públicos para a promoção de atividades artísticas, culturais e educativas na cidade.",
          quemPodeSolicitar: "Artistas, coletivos culturais, associações, ONGs e cidadãos residentes em Belford Roxo.",
          informacoesComplementares: "A solicitação deve ser feita com pelo menos 15 dias de antecedência. O uso dos espaços é gratuito para atividades sem fins lucrativos. Eventos comerciais podem estar sujeitos a taxa de uso.",
          informacoesNecessarias: [
            "Nome do responsável pelo evento",
            "CPF ou CNPJ",
            "Descrição do evento ou atividade",
            "Data e horário pretendidos",
            "Público estimado",
            "Necessidades técnicas (som, iluminação, etc.)"
          ],
          tempoAtendimento: "Até 10 dias úteis para análise e confirmação",
          legislacao: [
            "Lei Federal nº 14.017/2020 (Lei Aldir Blanc)",
            "Política Municipal de Cultura"
          ]
        },
        fields: [
          { id: "description", name: "description", label: "Descrição do evento", type: "textarea", required: true, placeholder: "Descreva o evento ou atividade cultural" },
          { id: "date", name: "date", label: "Data pretendida", type: "date", required: true },
          { id: "email", name: "email", label: "E-mail para contato", type: "email", required: true },
          { id: "phone", name: "phone", label: "Telefone", type: "phone", required: true }
        ]
      },
      {
        id: "inscricao-programa-esportivo",
        name: "Inscrição em Programas Esportivos",
        slug: "inscricao-programa-esportivo",
        categoryId: "cultura-esporte-lazer",
        description: "Inscrição em programas e atividades esportivas gratuitas",
        requiresAuth: false,
        detailedInfo: {
          oQueE: "Serviço de inscrição em programas esportivos gratuitos oferecidos pela Secretaria de Esporte e Lazer de Belford Roxo, como escolinhas de futebol, vôlei, basquete, natação, artes marciais, ginástica e outras modalidades.",
          paraQueServe: "Promover a prática esportiva e o lazer entre os moradores de Belford Roxo, contribuindo para a saúde, a integração social e o desenvolvimento de crianças, jovens e adultos.",
          quemPodeSolicitar: "Qualquer cidadão residente em Belford Roxo. Crianças e adolescentes precisam de autorização do responsável legal.",
          informacoesComplementares: "As vagas são limitadas e distribuídas por ordem de inscrição. As atividades são realizadas em centros esportivos, quadras e praças do município.",
          informacoesNecessarias: [
            "Nome completo do participante",
            "Data de nascimento",
            "CPF",
            "Comprovante de residência",
            "Atestado médico (para algumas modalidades)",
            "Modalidade esportiva desejada"
          ],
          tempoAtendimento: "Confirmação em até 7 dias úteis",
          legislacao: [
            "Lei Federal nº 9.615/1998 (Lei Pelé)",
            "Constituição Federal - Art. 217 (Direito ao Desporto)"
          ]
        },
        fields: [
          { id: "nome_participante", name: "nome_participante", label: "Nome do participante", type: "text", required: true },
          { id: "date", name: "date", label: "Data de nascimento", type: "date", required: true },
          { id: "modalidade", name: "modalidade", label: "Modalidade esportiva", type: "select", required: true, options: [
            { value: "futebol", label: "Futebol" },
            { value: "volei", label: "Vôlei" },
            { value: "basquete", label: "Basquete" },
            { value: "natacao", label: "Natação" },
            { value: "artes-marciais", label: "Artes Marciais" },
            { value: "ginastica", label: "Ginástica" },
            { value: "atletismo", label: "Atletismo" }
          ]},
          { id: "address", name: "address", label: "Endereço de residência", type: "address", required: true }
        ]
      },
      {
        id: "eventos-culturais",
        name: "Informações sobre Eventos Culturais",
        slug: "eventos-culturais",
        categoryId: "cultura-esporte-lazer",
        description: "Informações e programação de eventos culturais do município",
        requiresAuth: false,
        detailedInfo: {
          oQueE: "Canal de informações sobre a agenda cultural de Belford Roxo, incluindo festivais, shows, exposições, feiras, oficinas e eventos promovidos ou apoiados pela Secretaria de Cultura.",
          paraQueServe: "Manter a população informada sobre a programação cultural do município, incentivando a participação em atividades artísticas e culturais gratuitas ou a preços populares.",
          quemPodeSolicitar: "Qualquer cidadão pode consultar a agenda cultural e enviar sugestões de eventos.",
          informacoesComplementares: "Artistas e produtores culturais de Belford Roxo podem enviar propostas de eventos para análise da Secretaria de Cultura. A maioria dos eventos municipais é gratuita.",
          informacoesNecessarias: [
            "Tipo de informação desejada",
            "Período de interesse",
            "Bairro ou região de preferência"
          ],
          tempoAtendimento: "Resposta imediata para consultas; até 15 dias para propostas de eventos",
          legislacao: [
            "Lei Federal nº 14.017/2020 (Lei Aldir Blanc)",
            "Plano Municipal de Cultura"
          ]
        },
        fields: [
          { id: "description", name: "description", label: "Sua dúvida ou sugestão", type: "textarea", required: true, placeholder: "Descreva o que deseja saber sobre a agenda cultural" },
          { id: "email", name: "email", label: "E-mail para resposta", type: "email", required: false }
        ]
      }
    ]
  },

  // =========================================================================
  // 7. Defesa Civil
  // =========================================================================
  {
    id: "defesa-civil",
    name: "Defesa Civil",
    icon: "ShieldAlert",
    slug: "defesa-civil",
    description: "Serviços de emergência, prevenção e defesa civil",
    services: [
      {
        id: "risco-deslizamento",
        name: "Risco de Deslizamento",
        slug: "risco-deslizamento",
        categoryId: "defesa-civil",
        description: "Denúncia de área com risco de deslizamento",
        requiresAuth: false,
        detailedInfo: {
          oQueE: "Serviço de vistoria e avaliação de áreas com risco de deslizamento de terra, desabamento ou erosão, realizado pela Defesa Civil de Belford Roxo.",
          paraQueServe: "Identificar e avaliar áreas de risco para prevenir acidentes e proteger a vida dos moradores. A equipe técnica faz a vistoria e orienta sobre medidas de segurança.",
          quemPodeSolicitar: "Qualquer cidadão pode denunciar uma área com risco de deslizamento.",
          informacoesComplementares: "Em caso de emergência com risco iminente, ligue imediatamente para a Defesa Civil de Belford Roxo. Se houver chuva forte, evite permanecer no local de risco.",
          informacoesNecessarias: [
            "Endereço completo da área de risco",
            "Descrição da situação observada",
            "Há moradores no local?",
            "Fotos da área"
          ],
          tempoAtendimento: "Até 24 horas para vistoria (casos urgentes: imediato)",
          legislacao: [
            "Lei Federal nº 12.608/2012 (Política Nacional de Proteção e Defesa Civil)",
            "Lei Municipal de Defesa Civil"
          ]
        },
        fields: [
          { id: "description", name: "description", label: "Descrição da situação de risco", type: "textarea", required: true, placeholder: "Descreva a situação de risco observada" },
          { id: "address", name: "address", label: "Local", type: "address", required: true },
          { id: "attachment", name: "attachment", label: "Fotos", type: "file", required: false }
        ]
      },
      {
        id: "alagamento",
        name: "Alagamento",
        slug: "alagamento",
        categoryId: "defesa-civil",
        description: "Relato de área alagada ou com risco de alagamento",
        requiresAuth: false,
        detailedInfo: {
          oQueE: "Serviço para relatar áreas alagadas ou pontos de alagamento recorrente no município de Belford Roxo, permitindo a atuação da Defesa Civil e das equipes de drenagem.",
          paraQueServe: "Identificar pontos críticos de alagamento para que sejam tomadas medidas preventivas e corretivas, como limpeza de bueiros e obras de drenagem.",
          quemPodeSolicitar: "Qualquer cidadão pode relatar um alagamento ou área de risco.",
          informacoesComplementares: "Em caso de alagamento durante chuvas fortes, não tente atravessar áreas alagadas. Procure abrigo em local seguro e aguarde o nível da água baixar.",
          informacoesNecessarias: [
            "Endereço exato do alagamento",
            "Nível aproximado da água",
            "Se há pessoas ou veículos em risco",
            "Fotos ou vídeos (se for seguro registrar)"
          ],
          tempoAtendimento: "Atendimento imediato em emergências",
          legislacao: [
            "Lei Federal nº 12.608/2012",
            "Plano Municipal de Contingência"
          ]
        },
        fields: [
          { id: "description", name: "description", label: "Descrição", type: "textarea", required: true, placeholder: "Descreva a situação do alagamento" },
          { id: "address", name: "address", label: "Local", type: "address", required: true },
          { id: "attachment", name: "attachment", label: "Fotos", type: "file", required: false }
        ]
      },
      {
        id: "arvore-caida",
        name: "Árvore Caída",
        slug: "arvore-caida",
        categoryId: "defesa-civil",
        description: "Solicitação de remoção de árvore caída em via pública",
        requiresAuth: false,
        detailedInfo: {
          oQueE: "Serviço emergencial para remoção de árvores caídas que obstruem vias públicas, calçadas ou que representem perigo iminente para moradores e transeuntes em Belford Roxo.",
          paraQueServe: "Desobstruir vias e eliminar riscos causados por árvores caídas após temporais, vendavais ou por degradação natural, garantindo a segurança da população.",
          quemPodeSolicitar: "Qualquer cidadão pode solicitar a remoção de árvore caída em via pública.",
          informacoesComplementares: "Se a árvore estiver sobre fiação elétrica, não toque nos fios e mantenha distância. Acione também a concessionária de energia elétrica.",
          informacoesNecessarias: [
            "Endereço exato da ocorrência",
            "Se a árvore está sobre fiação elétrica",
            "Se há obstrução total ou parcial da via",
            "Fotos do local"
          ],
          tempoAtendimento: "Até 12 horas (emergência: imediato)",
          legislacao: [
            "Lei Federal nº 12.608/2012",
            "Código Municipal de Meio Ambiente"
          ]
        },
        fields: [
          { id: "description", name: "description", label: "Descrição", type: "textarea", required: true, placeholder: "Descreva a situação da árvore caída" },
          { id: "address", name: "address", label: "Local", type: "address", required: true },
          { id: "attachment", name: "attachment", label: "Fotos", type: "file", required: false }
        ]
      }
    ]
  },

  // =========================================================================
  // 8. Educação
  // =========================================================================
  {
    id: "educacao",
    name: "Educação",
    icon: "GraduationCap",
    slug: "educacao",
    description: "Serviços relacionados à educação municipal",
    services: [
      {
        id: "matricula-escolar",
        name: "Matrícula Escolar",
        slug: "matricula-escolar",
        categoryId: "educacao",
        description: "Informações sobre matrícula na rede municipal de ensino",
        requiresAuth: false,
        detailedInfo: {
          oQueE: "Serviço de matrícula de alunos na rede municipal de ensino de Belford Roxo, que inclui Educação Infantil (creche e pré-escola) e Ensino Fundamental.",
          paraQueServe: "Garantir o acesso à educação pública gratuita para todas as crianças e jovens residentes no município de Belford Roxo.",
          quemPodeSolicitar: "Pais ou responsáveis legais de crianças e jovens em idade escolar.",
          informacoesComplementares: "O período de matrícula é divulgado anualmente pela Secretaria de Educação. Consulte a escola mais próxima de sua residência.",
          informacoesNecessarias: [
            "Certidão de nascimento do aluno",
            "CPF do aluno e do responsável",
            "Comprovante de residência",
            "Histórico escolar (para transferências)",
            "Carteira de vacinação (Educação Infantil)"
          ],
          tempoAtendimento: "Conforme período de matrícula estabelecido pela Secretaria de Educação",
          legislacao: [
            "Lei de Diretrizes e Bases da Educação (LDB nº 9.394/1996)",
            "Constituição Federal - Art. 205 a 214"
          ]
        },
        fields: []
      },
      {
        id: "transporte-escolar",
        name: "Transporte Escolar",
        slug: "transporte-escolar",
        categoryId: "educacao",
        description: "Solicitação de transporte escolar gratuito",
        requiresAuth: false,
        detailedInfo: {
          oQueE: "Serviço de transporte escolar gratuito para alunos da rede municipal que residem em áreas distantes das escolas ou que necessitam de transporte adaptado.",
          paraQueServe: "Garantir o acesso à escola para alunos que moram longe da unidade escolar ou que possuem necessidades especiais de locomoção.",
          quemPodeSolicitar: "Pais ou responsáveis de alunos matriculados na rede municipal de ensino de Belford Roxo.",
          informacoesComplementares: "O serviço está sujeito à disponibilidade de vagas e análise da distância entre a residência e a escola.",
          informacoesNecessarias: [
            "Nome completo do aluno",
            "Matrícula escolar",
            "Nome da escola",
            "Endereço de residência completo",
            "Comprovante de matrícula"
          ],
          tempoAtendimento: "Até 15 dias úteis para análise",
          legislacao: [
            "Lei nº 9.394/1996 (LDB)",
            "Programa Nacional de Transporte Escolar (PNATE)"
          ]
        },
        fields: [
          { id: "aluno_nome", name: "aluno_nome", label: "Nome do aluno", type: "text", required: true },
          { id: "escola", name: "escola", label: "Escola", type: "text", required: true },
          { id: "address", name: "address", label: "Endereço de residência", type: "address", required: true }
        ]
      },
      {
        id: "merenda-escolar",
        name: "Merenda Escolar",
        slug: "merenda-escolar",
        categoryId: "educacao",
        description: "Reclamações e sugestões sobre a merenda escolar",
        requiresAuth: false,
        detailedInfo: {
          oQueE: "Canal para registro de reclamações, sugestões e elogios sobre a qualidade da merenda escolar fornecida nas escolas da rede municipal de Belford Roxo.",
          paraQueServe: "Garantir a qualidade da alimentação escolar, permitindo que pais, responsáveis e alunos reportem problemas ou façam sugestões para melhoria da merenda.",
          quemPodeSolicitar: "Pais, responsáveis, alunos e funcionários das escolas da rede municipal.",
          informacoesComplementares: "A merenda escolar é fiscalizada pelo Conselho de Alimentação Escolar (CAE). Toda reclamação é investigada pela Secretaria de Educação.",
          informacoesNecessarias: [
            "Nome da escola",
            "Descrição detalhada do problema ou sugestão",
            "Data da ocorrência",
            "Fotos (se aplicável)"
          ],
          tempoAtendimento: "Até 10 dias úteis para resposta",
          legislacao: [
            "Lei Federal nº 11.947/2009 (PNAE)",
            "Resolução FNDE nº 6/2020"
          ]
        },
        fields: [
          { id: "escola", name: "escola", label: "Nome da escola", type: "text", required: true },
          { id: "description", name: "description", label: "Descrição", type: "textarea", required: true, placeholder: "Descreva sua reclamação ou sugestão sobre a merenda escolar" },
          { id: "attachment", name: "attachment", label: "Fotos", type: "file", required: false }
        ]
      }
    ]
  },

  // =========================================================================
  // 9. Empresas
  // =========================================================================
  {
    id: "empresas",
    name: "Empresas",
    icon: "Building2",
    slug: "empresas",
    description: "Serviços para empreendedores e empresas do município",
    services: [
      {
        id: "alvara-funcionamento",
        name: "Alvará de Funcionamento",
        slug: "alvara-funcionamento",
        categoryId: "empresas",
        description: "Solicitação e renovação de alvará de funcionamento",
        requiresAuth: true,
        detailedInfo: {
          oQueE: "Serviço para solicitação, renovação ou consulta de alvará de funcionamento para estabelecimentos comerciais, industriais e de prestação de serviços no município de Belford Roxo.",
          paraQueServe: "O alvará de funcionamento é o documento que autoriza o exercício de atividade econômica no município. Sem ele, o estabelecimento funciona de forma irregular e está sujeito a penalidades.",
          quemPodeSolicitar: "Pessoa física ou jurídica que deseje abrir ou manter estabelecimento comercial, industrial ou de serviços em Belford Roxo.",
          informacoesComplementares: "O alvará deve ser renovado anualmente. O estabelecimento deve estar em conformidade com as normas de segurança, higiene e zoneamento urbano. Consulte a Junta Comercial para registro prévio.",
          informacoesNecessarias: [
            "CNPJ da empresa",
            "Contrato social ou MEI",
            "Comprovante de endereço do estabelecimento",
            "Inscrição estadual (se aplicável)",
            "Laudo do Corpo de Bombeiros (AVCB)",
            "Licença sanitária (para atividades de alimentação e saúde)"
          ],
          tempoAtendimento: "Até 30 dias úteis",
          legislacao: [
            "Lei Complementar nº 123/2006 (Simples Nacional)",
            "Código de Posturas Municipal",
            "Lei Municipal de Uso e Ocupação do Solo"
          ]
        },
        fields: [
          { id: "cnpj", name: "cnpj", label: "CNPJ", type: "text", required: true, placeholder: "00.000.000/0000-00" },
          { id: "description", name: "description", label: "Atividade do estabelecimento", type: "textarea", required: true },
          { id: "address", name: "address", label: "Endereço do estabelecimento", type: "address", required: true },
          { id: "attachment", name: "attachment", label: "Documentos", type: "file", required: true }
        ]
      },
      {
        id: "consulta-viabilidade",
        name: "Consulta de Viabilidade de Negócio",
        slug: "consulta-viabilidade",
        categoryId: "empresas",
        description: "Consulta prévia de viabilidade para abertura de negócio",
        requiresAuth: false,
        detailedInfo: {
          oQueE: "Serviço de consulta prévia para verificar a viabilidade de abertura de um negócio em determinado endereço de Belford Roxo, considerando o zoneamento urbano, as atividades permitidas e as exigências legais.",
          paraQueServe: "Permitir que o empreendedor saiba antes de investir se a atividade pretendida é permitida no local escolhido e quais documentos e licenças serão necessários.",
          quemPodeSolicitar: "Qualquer pessoa interessada em abrir um negócio em Belford Roxo.",
          informacoesComplementares: "A consulta de viabilidade é o primeiro passo recomendado antes de iniciar o processo de abertura de empresa. Ela não garante a concessão do alvará, mas indica se o negócio é viável naquele local.",
          informacoesNecessarias: [
            "Endereço pretendido para o estabelecimento",
            "Descrição da atividade econômica pretendida",
            "CNAE (Classificação Nacional de Atividades Econômicas)",
            "Área do estabelecimento em metros quadrados"
          ],
          tempoAtendimento: "Até 15 dias úteis",
          legislacao: [
            "Lei Municipal de Uso e Ocupação do Solo",
            "Lei Complementar nº 123/2006"
          ]
        },
        fields: [
          { id: "description", name: "description", label: "Descrição da atividade pretendida", type: "textarea", required: true, placeholder: "Descreva a atividade econômica que pretende exercer" },
          { id: "address", name: "address", label: "Endereço pretendido", type: "address", required: true },
          { id: "email", name: "email", label: "E-mail para resposta", type: "email", required: true }
        ]
      },
      {
        id: "licenca-sanitaria-empresa",
        name: "Licença Sanitária para Estabelecimentos",
        slug: "licenca-sanitaria-empresa",
        categoryId: "empresas",
        description: "Solicitação de licença sanitária para empresas de alimentação e saúde",
        requiresAuth: true,
        detailedInfo: {
          oQueE: "Serviço de emissão de licença sanitária para estabelecimentos de alimentação, saúde, beleza e higiene que funcionam no município de Belford Roxo. A licença é emitida pela Vigilância Sanitária Municipal.",
          paraQueServe: "A licença sanitária atesta que o estabelecimento atende às normas de higiene e segurança sanitária exigidas para o seu ramo de atividade, protegendo a saúde da população.",
          quemPodeSolicitar: "Proprietários ou responsáveis legais de estabelecimentos que manipulam alimentos, prestam serviços de saúde, beleza ou higiene.",
          informacoesComplementares: "A licença sanitária deve ser renovada anualmente. O estabelecimento passará por vistoria da equipe de Vigilância Sanitária antes da emissão.",
          informacoesNecessarias: [
            "CNPJ da empresa",
            "Alvará de funcionamento",
            "Comprovante de endereço",
            "Relação de funcionários com carteira de saúde",
            "Manual de Boas Práticas (para serviços de alimentação)"
          ],
          tempoAtendimento: "Até 30 dias úteis para vistoria e emissão",
          legislacao: [
            "Lei Federal nº 6.437/1977",
            "RDC ANVISA nº 216/2004",
            "Código Sanitário Municipal"
          ]
        },
        fields: [
          { id: "cnpj", name: "cnpj", label: "CNPJ", type: "text", required: true, placeholder: "00.000.000/0000-00" },
          { id: "description", name: "description", label: "Atividade do estabelecimento", type: "textarea", required: true },
          { id: "address", name: "address", label: "Endereço do estabelecimento", type: "address", required: true },
          { id: "attachment", name: "attachment", label: "Documentos", type: "file", required: true }
        ]
      }
    ]
  },

  // =========================================================================
  // 10. Iluminação Pública
  // =========================================================================
  {
    id: "iluminacao",
    name: "Iluminação Pública",
    icon: "Lightbulb",
    slug: "iluminacao-publica",
    description: "Serviços de iluminação pública e manutenção",
    services: [
      {
        id: "iluminacao-publica",
        name: "Iluminação Pública",
        slug: "iluminacao-publica",
        categoryId: "iluminacao",
        description: "Solicitação de reparo ou manutenção da iluminação pública",
        requiresAuth: false,
        detailedInfo: {
          oQueE: "Serviço de manutenção da iluminação pública municipal, incluindo troca de lâmpadas queimadas, reparo de postes danificados e instalação de novos pontos de luz.",
          paraQueServe: "Garantir a iluminação adequada das vias públicas, praças e logradouros de Belford Roxo, proporcionando segurança à população durante a noite.",
          quemPodeSolicitar: "Qualquer cidadão pode solicitar manutenção da iluminação pública.",
          informacoesComplementares: "Se possível, informe o número do poste (geralmente está na placa de identificação). A concessionária de energia será acionada quando necessário.",
          informacoesNecessarias: [
            "Endereço completo (rua e número próximo)",
            "Número do poste (se visível)",
            "Descrição do problema (lâmpada queimada, poste danificado, etc.)",
            "Ponto de referência"
          ],
          tempoAtendimento: "Até 7 dias úteis",
          legislacao: [
            "Resolução ANEEL nº 414/2010",
            "Lei Municipal de Iluminação Pública"
          ]
        },
        fields: [
          { id: "description", name: "description", label: "Descrição", type: "textarea", required: true, placeholder: "Informe o número do poste, se visível" },
          { id: "address", name: "address", label: "Endereço", type: "address", required: true },
          { id: "attachment", name: "attachment", label: "Foto do poste", type: "file", required: false }
        ]
      },
      {
        id: "nova-iluminacao",
        name: "Solicitação de Nova Iluminação",
        slug: "nova-iluminacao",
        categoryId: "iluminacao",
        description: "Solicitação de instalação de novo ponto de iluminação",
        requiresAuth: false,
        detailedInfo: {
          oQueE: "Serviço para solicitar a instalação de novos pontos de iluminação pública em áreas que não possuem iluminação adequada em Belford Roxo.",
          paraQueServe: "Ampliar a rede de iluminação pública para melhorar a segurança e qualidade de vida em áreas com pouca ou nenhuma iluminação.",
          quemPodeSolicitar: "Qualquer cidadão pode solicitar a instalação de nova iluminação pública.",
          informacoesComplementares: "A solicitação será avaliada pela equipe técnica, que verificará a viabilidade e necessidade da instalação no local indicado.",
          informacoesNecessarias: [
            "Endereço completo",
            "Justificativa da necessidade",
            "Fotos do local mostrando a falta de iluminação"
          ],
          tempoAtendimento: "Até 60 dias para avaliação e instalação",
          legislacao: [
            "Resolução ANEEL nº 414/2010",
            "Lei Municipal de Iluminação Pública"
          ]
        },
        fields: [
          { id: "description", name: "description", label: "Justificativa", type: "textarea", required: true, placeholder: "Descreva por que o local necessita de iluminação" },
          { id: "address", name: "address", label: "Local", type: "address", required: true },
          { id: "attachment", name: "attachment", label: "Fotos do local", type: "file", required: false }
        ]
      }
    ]
  },

  // =========================================================================
  // 11. IPTU, Dívida Ativa e Nota Fiscal
  // =========================================================================
  {
    id: "iptu-divida-nf",
    name: "IPTU, Dívida Ativa e Nota Fiscal",
    icon: "Receipt",
    slug: "iptu-divida-ativa-nota-fiscal",
    description: "Serviços tributários, IPTU, dívida ativa e nota fiscal eletrônica",
    services: [
      {
        id: "segunda-via-iptu",
        name: "Segunda Via de IPTU",
        slug: "segunda-via-iptu",
        categoryId: "iptu-divida-nf",
        description: "Emissão de segunda via do boleto de IPTU",
        requiresAuth: false,
        detailedInfo: {
          oQueE: "Serviço para emissão de segunda via do carnê ou boleto de IPTU (Imposto Predial e Territorial Urbano) de imóveis localizados no município de Belford Roxo. Permite o pagamento de parcelas em atraso ou a substituição de boletos perdidos.",
          paraQueServe: "Permitir que o contribuinte obtenha uma nova via do boleto de IPTU para efetuar o pagamento em dia ou regularizar parcelas em atraso.",
          quemPodeSolicitar: "Proprietários de imóveis, possuidores ou responsáveis tributários de imóveis em Belford Roxo.",
          informacoesComplementares: "O pagamento em cota única pode ter desconto conforme legislação vigente. O não pagamento do IPTU pode resultar em inscrição em dívida ativa e protesto.",
          informacoesNecessarias: [
            "Inscrição imobiliária do imóvel",
            "CPF ou CNPJ do proprietário",
            "Endereço do imóvel"
          ],
          tempoAtendimento: "Emissão imediata (online ou presencial)",
          legislacao: [
            "Código Tributário Municipal de Belford Roxo",
            "Constituição Federal - Art. 156, inciso I"
          ]
        },
        fields: [
          { id: "inscricao", name: "inscricao", label: "Inscrição imobiliária", type: "text", required: true, placeholder: "Informe a inscrição imobiliária" },
          { id: "cpf", name: "cpf", label: "CPF do proprietário", type: "cpf", required: true },
          { id: "address", name: "address", label: "Endereço do imóvel", type: "address", required: true }
        ]
      },
      {
        id: "consulta-divida-ativa",
        name: "Consulta de Dívida Ativa",
        slug: "consulta-divida-ativa",
        categoryId: "iptu-divida-nf",
        description: "Consulta e negociação de débitos inscritos em dívida ativa",
        requiresAuth: true,
        detailedInfo: {
          oQueE: "Serviço de consulta de débitos inscritos em dívida ativa do município de Belford Roxo, incluindo IPTU, taxas municipais e multas não pagas. Permite também a negociação e parcelamento dos débitos.",
          paraQueServe: "Permitir que o contribuinte consulte seus débitos com o município e negocie formas de pagamento, evitando protestos, execuções fiscais e restrições em cadastros de crédito.",
          quemPodeSolicitar: "Qualquer contribuinte que possua débitos inscritos em dívida ativa no município de Belford Roxo.",
          informacoesComplementares: "A Prefeitura pode realizar programas de renegociação de dívidas (REFIS) periodicamente, oferecendo descontos em juros e multas. Fique atento aos prazos.",
          informacoesNecessarias: [
            "CPF ou CNPJ do contribuinte",
            "Inscrição imobiliária (para débitos de IPTU)",
            "Número da inscrição em dívida ativa (se disponível)"
          ],
          tempoAtendimento: "Consulta imediata; negociação em até 5 dias úteis",
          legislacao: [
            "Código Tributário Municipal de Belford Roxo",
            "Lei Federal nº 6.830/1980 (Lei de Execuções Fiscais)"
          ]
        },
        fields: [
          { id: "cpf", name: "cpf", label: "CPF ou CNPJ", type: "cpf", required: true },
          { id: "description", name: "description", label: "Informações adicionais", type: "textarea", required: false, placeholder: "Informe a inscrição imobiliária ou outros dados relevantes" }
        ]
      },
      {
        id: "nota-fiscal-eletronica",
        name: "Nota Fiscal de Serviços Eletrônica",
        slug: "nota-fiscal-eletronica",
        categoryId: "iptu-divida-nf",
        description: "Emissão e consulta de NFS-e (Nota Fiscal de Serviços Eletrônica)",
        requiresAuth: true,
        detailedInfo: {
          oQueE: "Serviço de emissão, consulta e cancelamento de Nota Fiscal de Serviços Eletrônica (NFS-e) no município de Belford Roxo. O sistema permite que prestadores de serviços emitam notas fiscais de forma digital.",
          paraQueServe: "Facilitar a emissão de notas fiscais de serviços por prestadores cadastrados, garantindo o cumprimento das obrigações fiscais e a arrecadação do ISS (Imposto Sobre Serviços).",
          quemPodeSolicitar: "Prestadores de serviços (pessoa jurídica ou autônomos) cadastrados no município de Belford Roxo.",
          informacoesComplementares: "Para emitir NFS-e é necessário realizar cadastro prévio no sistema e obter credenciais de acesso junto à Secretaria de Fazenda. O sistema está disponível 24 horas.",
          informacoesNecessarias: [
            "CNPJ ou CPF do prestador",
            "Inscrição municipal",
            "Dados do tomador do serviço",
            "Descrição do serviço prestado",
            "Valor do serviço"
          ],
          tempoAtendimento: "Emissão imediata após cadastro",
          legislacao: [
            "Lei Complementar nº 116/2003 (ISS)",
            "Código Tributário Municipal de Belford Roxo"
          ]
        },
        fields: [
          { id: "cpf", name: "cpf", label: "CNPJ ou CPF do prestador", type: "cpf", required: true },
          { id: "description", name: "description", label: "Descrição da solicitação", type: "textarea", required: true, placeholder: "Descreva o que deseja (emissão, consulta, cancelamento, etc.)" },
          { id: "email", name: "email", label: "E-mail", type: "email", required: true }
        ]
      }
    ]
  },

  // =========================================================================
  // 12. LGBTQIA+
  // =========================================================================
  {
    id: "lgbtqia",
    name: "LGBTQIA+",
    icon: "Rainbow",
    slug: "lgbtqia",
    description: "Serviços de apoio, acolhimento e defesa dos direitos da população LGBTQIA+",
    services: [
      {
        id: "denuncia-lgbtfobia",
        name: "Denúncia de LGBTfobia",
        slug: "denuncia-lgbtfobia",
        categoryId: "lgbtqia",
        description: "Canal para denúncias de discriminação e violência contra pessoas LGBTQIA+",
        requiresAuth: false,
        detailedInfo: {
          oQueE: "Serviço para registro de denúncias de discriminação, preconceito, violência física ou psicológica motivadas por orientação sexual ou identidade de gênero no município de Belford Roxo.",
          paraQueServe: "Garantir o registro e encaminhamento de denúncias de LGBTfobia aos órgãos competentes, promovendo a proteção e os direitos da população LGBTQIA+ do município.",
          quemPodeSolicitar: "Qualquer cidadão, vítima ou testemunha de atos de discriminação ou violência contra pessoas LGBTQIA+.",
          informacoesComplementares: "A denúncia pode ser feita de forma anônima. Os casos são encaminhados à Delegacia de Polícia, ao Ministério Público e aos centros de acolhimento. Em caso de emergência, ligue 190 (Polícia Militar).",
          informacoesNecessarias: [
            "Descrição detalhada do ocorrido",
            "Local e data da ocorrência",
            "Dados do agressor (se conhecidos)",
            "Evidências (fotos, vídeos, mensagens)"
          ],
          tempoAtendimento: "Até 24 horas para análise e encaminhamento",
          legislacao: [
            "ADO 26 do STF (Criminalização da LGBTfobia)",
            "Lei Federal nº 7.716/1989 (Aplicada por analogia a crimes de LGBTfobia)",
            "Constituição Federal - Art. 5º"
          ]
        },
        fields: [
          { id: "description", name: "description", label: "Descrição da denúncia", type: "textarea", required: true, placeholder: "Descreva detalhadamente o ocorrido" },
          { id: "date", name: "date", label: "Data da ocorrência", type: "date", required: false },
          { id: "address", name: "address", label: "Local da ocorrência", type: "address", required: false },
          { id: "attachment", name: "attachment", label: "Evidências", type: "file", required: false }
        ]
      },
      {
        id: "atendimento-lgbtqia",
        name: "Atendimento Especializado LGBTQIA+",
        slug: "atendimento-lgbtqia",
        categoryId: "lgbtqia",
        description: "Acolhimento e orientação para a população LGBTQIA+",
        requiresAuth: false,
        detailedInfo: {
          oQueE: "Serviço de acolhimento, orientação jurídica, psicológica e social para a população LGBTQIA+ de Belford Roxo. O atendimento é realizado por profissionais capacitados em centros de referência e equipamentos públicos.",
          paraQueServe: "Oferecer suporte integral à população LGBTQIA+, incluindo orientação sobre direitos, encaminhamento para serviços de saúde, apoio psicológico e assistência jurídica em casos de discriminação.",
          quemPodeSolicitar: "Qualquer pessoa LGBTQIA+ residente em Belford Roxo que necessite de acolhimento, orientação ou encaminhamento.",
          informacoesComplementares: "O atendimento é gratuito, sigiloso e humanizado. Também são oferecidas oficinas, grupos de apoio e atividades socioeducativas.",
          informacoesNecessarias: [
            "Nome social (se houver)",
            "Telefone para contato",
            "Tipo de atendimento desejado (psicológico, jurídico, social)",
            "Breve descrição da situação"
          ],
          tempoAtendimento: "Agendamento em até 5 dias úteis",
          legislacao: [
            "Decreto nº 8.727/2016 (Uso do nome social)",
            "Constituição Federal - Art. 5º (Princípio da Igualdade)"
          ]
        },
        fields: [
          { id: "nome_social", name: "nome_social", label: "Nome social", type: "text", required: false, placeholder: "Informe seu nome social (opcional)" },
          { id: "tipo_atendimento", name: "tipo_atendimento", label: "Tipo de atendimento", type: "select", required: true, options: [
            { value: "psicologico", label: "Psicológico" },
            { value: "juridico", label: "Jurídico" },
            { value: "social", label: "Social" },
            { value: "saude", label: "Saúde" }
          ]},
          { id: "description", name: "description", label: "Descrição da situação", type: "textarea", required: true, placeholder: "Descreva brevemente sua necessidade" },
          { id: "phone", name: "phone", label: "Telefone", type: "phone", required: true }
        ]
      },
      {
        id: "retificacao-nome-social",
        name: "Retificação de Nome Social",
        slug: "retificacao-nome-social",
        categoryId: "lgbtqia",
        description: "Orientação para retificação de nome e gênero em documentos",
        requiresAuth: false,
        detailedInfo: {
          oQueE: "Serviço de orientação e encaminhamento para pessoas transgênero e travestis que desejam realizar a retificação de nome e gênero em documentos oficiais, conforme decisão do STF.",
          paraQueServe: "Auxiliar pessoas transgênero e travestis no processo de retificação de nome e gênero em registros civis e documentos, garantindo o respeito à identidade de gênero e dignidade.",
          quemPodeSolicitar: "Qualquer pessoa transgênero ou travesti maior de 18 anos que deseje alterar seu prenome e gênero em documentos oficiais.",
          informacoesComplementares: "A retificação pode ser feita diretamente em cartório de registro civil, sem necessidade de decisão judicial, cirurgia ou laudos médicos, conforme Provimento nº 73/2018 do CNJ.",
          informacoesNecessarias: [
            "Nome civil completo",
            "Nome social pretendido",
            "CPF",
            "Documento de identidade",
            "Certidão de nascimento"
          ],
          tempoAtendimento: "Orientação imediata; prazo do cartório varia",
          legislacao: [
            "Provimento nº 73/2018 do CNJ",
            "ADI 4275 do STF",
            "Decreto nº 8.727/2016"
          ]
        },
        fields: [
          { id: "nome_civil", name: "nome_civil", label: "Nome civil atual", type: "text", required: true },
          { id: "nome_social", name: "nome_social", label: "Nome social pretendido", type: "text", required: true },
          { id: "cpf", name: "cpf", label: "CPF", type: "cpf", required: true },
          { id: "description", name: "description", label: "Informações adicionais", type: "textarea", required: false }
        ]
      }
    ]
  },

  // =========================================================================
  // 13. Limpeza Urbana
  // =========================================================================
  {
    id: "limpeza-urbana",
    name: "Limpeza Urbana",
    icon: "Trash2",
    slug: "limpeza-urbana",
    description: "Serviços de limpeza urbana e coleta de resíduos",
    services: [
      {
        id: "coleta-lixo",
        name: "Coleta de Lixo",
        slug: "coleta-lixo",
        categoryId: "limpeza-urbana",
        description: "Problemas com coleta de lixo domiciliar",
        requiresAuth: false,
        detailedInfo: {
          oQueE: "Serviço para relatar problemas com a coleta de lixo domiciliar em Belford Roxo, como atraso na coleta, lixo não recolhido ou irregularidades no serviço.",
          paraQueServe: "Garantir que a coleta de lixo seja realizada de forma regular e eficiente em todo o município.",
          quemPodeSolicitar: "Qualquer cidadão que tenha problemas com a coleta de lixo em sua rua.",
          informacoesComplementares: "A coleta de lixo domiciliar ocorre em dias específicos para cada bairro. Consulte o calendário de coleta no site da prefeitura.",
          informacoesNecessarias: [
            "Endereço completo",
            "Há quantos dias o lixo não é coletado",
            "Descrição do problema"
          ],
          tempoAtendimento: "Até 48 horas",
          legislacao: [
            "Lei Federal nº 12.305/2010 (Política Nacional de Resíduos Sólidos)",
            "Lei Municipal de Limpeza Urbana"
          ]
        },
        fields: [
          { id: "description", name: "description", label: "Descrição do problema", type: "textarea", required: true, placeholder: "Descreva o problema com a coleta de lixo" },
          { id: "address", name: "address", label: "Endereço", type: "address", required: true }
        ]
      },
      {
        id: "descarte-irregular",
        name: "Descarte Irregular de Lixo",
        slug: "descarte-irregular",
        categoryId: "limpeza-urbana",
        description: "Denúncia de descarte irregular de lixo",
        requiresAuth: false,
        detailedInfo: {
          oQueE: "Serviço para denunciar locais onde há descarte irregular de lixo, entulho ou resíduos em terrenos baldios, calçadas ou vias públicas de Belford Roxo.",
          paraQueServe: "Combater o descarte irregular de lixo que causa problemas ambientais, de saúde pública e estéticos para a cidade.",
          quemPodeSolicitar: "Qualquer cidadão pode denunciar descarte irregular de lixo.",
          informacoesComplementares: "O descarte irregular de lixo é passível de multa conforme o Código de Posturas Municipal. A denúncia pode ser feita de forma anônima.",
          informacoesNecessarias: [
            "Endereço ou localização do descarte irregular",
            "Tipo de material descartado",
            "Fotos do local (se possível)"
          ],
          tempoAtendimento: "Até 72 horas para verificação",
          legislacao: [
            "Lei Federal nº 12.305/2010",
            "Código de Posturas Municipal"
          ]
        },
        fields: [
          { id: "description", name: "description", label: "Descrição", type: "textarea", required: true, placeholder: "Descreva o tipo de material e a quantidade" },
          { id: "address", name: "address", label: "Local", type: "address", required: true },
          { id: "attachment", name: "attachment", label: "Fotos", type: "file", required: false }
        ]
      },
      {
        id: "limpeza-terreno",
        name: "Limpeza de Terreno",
        slug: "limpeza-terreno",
        categoryId: "limpeza-urbana",
        description: "Solicitação de limpeza de terreno baldio",
        requiresAuth: false,
        detailedInfo: {
          oQueE: "Serviço para solicitar a notificação e posterior limpeza de terrenos baldios que estejam com mato alto, acumulando lixo ou criando condições para proliferação de pragas em Belford Roxo.",
          paraQueServe: "Manter os terrenos baldios limpos e roçados, evitando a proliferação de animais peçonhentos, mosquitos e outros problemas de saúde pública.",
          quemPodeSolicitar: "Qualquer cidadão pode solicitar a fiscalização e limpeza de terrenos baldios.",
          informacoesComplementares: "O proprietário do terreno será notificado para realizar a limpeza. Em caso de descumprimento, a prefeitura pode realizar a limpeza e cobrar os custos do proprietário.",
          informacoesNecessarias: [
            "Endereço do terreno",
            "Descrição da situação",
            "Fotos do local"
          ],
          tempoAtendimento: "Até 15 dias para notificação do proprietário",
          legislacao: [
            "Código de Posturas Municipal",
            "Lei de Limpeza de Terrenos"
          ]
        },
        fields: [
          { id: "description", name: "description", label: "Descrição", type: "textarea", required: true, placeholder: "Descreva a situação do terreno" },
          { id: "address", name: "address", label: "Endereço do terreno", type: "address", required: true },
          { id: "attachment", name: "attachment", label: "Fotos", type: "file", required: false }
        ]
      }
    ]
  },

  // =========================================================================
  // 14. Mulher
  // =========================================================================
  {
    id: "mulher",
    name: "Mulher",
    icon: "UserCircle",
    slug: "mulher",
    description: "Serviços de proteção, acolhimento e empoderamento da mulher",
    services: [
      {
        id: "violencia-domestica",
        name: "Denúncia de Violência Doméstica",
        slug: "violencia-domestica",
        categoryId: "mulher",
        description: "Canal para denúncias de violência doméstica e familiar contra a mulher",
        requiresAuth: false,
        detailedInfo: {
          oQueE: "Serviço para registro de denúncias de violência doméstica e familiar contra a mulher no município de Belford Roxo, incluindo violência física, psicológica, sexual, patrimonial e moral.",
          paraQueServe: "Garantir que mulheres vítimas de violência doméstica recebam acolhimento, orientação e encaminhamento para medidas protetivas e serviços de apoio psicossocial e jurídico.",
          quemPodeSolicitar: "A própria vítima, familiares, vizinhos ou qualquer cidadão que tenha conhecimento de situação de violência doméstica.",
          informacoesComplementares: "Em caso de emergência, ligue 190 (Polícia Militar) ou 180 (Central de Atendimento à Mulher). A denúncia pode ser anônima. A vítima será encaminhada para a Delegacia Especializada de Atendimento à Mulher (DEAM).",
          informacoesNecessarias: [
            "Descrição da situação de violência",
            "Endereço da ocorrência",
            "Dados da vítima (se autorizado)",
            "Dados do agressor (se conhecidos)",
            "Se há crianças ou idosos envolvidos"
          ],
          tempoAtendimento: "Atendimento imediato para casos urgentes",
          legislacao: [
            "Lei Federal nº 11.340/2006 (Lei Maria da Penha)",
            "Lei Federal nº 13.104/2015 (Lei do Feminicídio)",
            "Lei Federal nº 14.188/2021 (Violência Psicológica contra a Mulher)"
          ]
        },
        fields: [
          { id: "description", name: "description", label: "Descrição da situação", type: "textarea", required: true, placeholder: "Descreva a situação de violência" },
          { id: "address", name: "address", label: "Endereço da ocorrência", type: "address", required: false },
          { id: "phone", name: "phone", label: "Telefone para contato seguro", type: "phone", required: false },
          { id: "attachment", name: "attachment", label: "Evidências", type: "file", required: false }
        ]
      },
      {
        id: "atendimento-psicologico-mulher",
        name: "Atendimento Psicológico para Mulheres",
        slug: "atendimento-psicologico-mulher",
        categoryId: "mulher",
        description: "Agendamento de atendimento psicológico para mulheres em situação de vulnerabilidade",
        requiresAuth: false,
        detailedInfo: {
          oQueE: "Serviço de atendimento psicológico gratuito para mulheres em situação de vulnerabilidade, vítimas de violência doméstica ou que necessitem de acompanhamento psicossocial no município de Belford Roxo.",
          paraQueServe: "Oferecer suporte emocional e psicológico para mulheres que vivenciaram ou vivenciam situações de violência, abuso ou vulnerabilidade, auxiliando no processo de recuperação e fortalecimento.",
          quemPodeSolicitar: "Mulheres residentes em Belford Roxo em situação de vulnerabilidade social ou vítimas de violência.",
          informacoesComplementares: "O atendimento é sigiloso e realizado por psicólogos do Centro de Referência da Mulher. Também são oferecidos grupos de apoio e oficinas de fortalecimento.",
          informacoesNecessarias: [
            "Nome completo",
            "Telefone para contato seguro",
            "Breve descrição da situação",
            "Disponibilidade de horário"
          ],
          tempoAtendimento: "Agendamento em até 7 dias úteis",
          legislacao: [
            "Lei Federal nº 11.340/2006 (Lei Maria da Penha)",
            "Política Nacional de Enfrentamento à Violência contra as Mulheres"
          ]
        },
        fields: [
          { id: "description", name: "description", label: "Descrição da situação", type: "textarea", required: true, placeholder: "Descreva brevemente o motivo do atendimento" },
          { id: "phone", name: "phone", label: "Telefone para contato seguro", type: "phone", required: true },
          { id: "email", name: "email", label: "E-mail (opcional)", type: "email", required: false }
        ]
      },
      {
        id: "empoderamento-feminino",
        name: "Programa de Empoderamento Feminino",
        slug: "empoderamento-feminino",
        categoryId: "mulher",
        description: "Inscrição em programas de capacitação e empoderamento feminino",
        requiresAuth: false,
        detailedInfo: {
          oQueE: "Programa da Secretaria de Políticas para Mulheres de Belford Roxo que oferece cursos de capacitação profissional, oficinas de empreendedorismo, palestras sobre direitos da mulher e atividades de fortalecimento da autonomia feminina.",
          paraQueServe: "Promover a autonomia econômica e social das mulheres de Belford Roxo, através de qualificação profissional, orientação sobre direitos e apoio ao empreendedorismo feminino.",
          quemPodeSolicitar: "Mulheres residentes em Belford Roxo, com prioridade para mulheres em situação de vulnerabilidade social.",
          informacoesComplementares: "Os cursos são gratuitos e incluem certificação. As vagas são limitadas e distribuídas por ordem de inscrição. Alguns cursos oferecem material didático e auxílio-transporte.",
          informacoesNecessarias: [
            "Nome completo",
            "CPF",
            "Endereço de residência",
            "Escolaridade",
            "Área de interesse para capacitação"
          ],
          tempoAtendimento: "Confirmação de inscrição em até 10 dias úteis",
          legislacao: [
            "Lei Federal nº 11.340/2006",
            "Plano Nacional de Políticas para as Mulheres"
          ]
        },
        fields: [
          { id: "cpf", name: "cpf", label: "CPF", type: "cpf", required: true },
          { id: "area_interesse", name: "area_interesse", label: "Área de interesse", type: "select", required: true, options: [
            { value: "empreendedorismo", label: "Empreendedorismo" },
            { value: "informatica", label: "Informática" },
            { value: "artesanato", label: "Artesanato" },
            { value: "beleza", label: "Beleza e Estética" },
            { value: "culinaria", label: "Culinária" },
            { value: "administracao", label: "Administração" }
          ]},
          { id: "address", name: "address", label: "Endereço", type: "address", required: true },
          { id: "phone", name: "phone", label: "Telefone", type: "phone", required: true }
        ]
      }
    ]
  },

  // =========================================================================
  // 15. Obras e Imóveis
  // =========================================================================
  {
    id: "obras-imoveis",
    name: "Obras e Imóveis",
    icon: "HardHat",
    slug: "obras-imoveis",
    description: "Serviços relacionados a obras, construções e regularização de imóveis",
    services: [
      {
        id: "alvara-construcao",
        name: "Alvará de Construção",
        slug: "alvara-construcao",
        categoryId: "obras-imoveis",
        description: "Solicitação de alvará para construção ou reforma",
        requiresAuth: true,
        detailedInfo: {
          oQueE: "Serviço de emissão de alvará de construção, reforma ou demolição para imóveis no município de Belford Roxo. O alvará é o documento que autoriza a realização de obras conforme as normas urbanísticas e de segurança.",
          paraQueServe: "Autorizar legalmente a execução de obras de construção, reforma ou demolição, garantindo que atendam às normas técnicas, de segurança e ao plano diretor municipal.",
          quemPodeSolicitar: "Proprietários de imóveis ou responsáveis técnicos (engenheiros ou arquitetos) devidamente habilitados.",
          informacoesComplementares: "O projeto deve ser assinado por profissional habilitado (engenheiro ou arquiteto) com registro no CREA ou CAU. A obra só pode ser iniciada após a emissão do alvará.",
          informacoesNecessarias: [
            "Requerimento assinado pelo proprietário",
            "Projeto arquitetônico aprovado",
            "ART ou RRT do responsável técnico",
            "Escritura ou contrato do imóvel",
            "Comprovante de pagamento de IPTU",
            "Planta de situação e locação"
          ],
          tempoAtendimento: "Até 30 dias úteis para análise e emissão",
          legislacao: [
            "Código de Obras Municipal de Belford Roxo",
            "Plano Diretor Municipal",
            "Lei Federal nº 5.194/1966 (Regulamentação de Engenharia e Arquitetura)"
          ]
        },
        fields: [
          { id: "description", name: "description", label: "Descrição da obra", type: "textarea", required: true, placeholder: "Descreva o tipo de obra (construção, reforma, demolição)" },
          { id: "address", name: "address", label: "Endereço do imóvel", type: "address", required: true },
          { id: "attachment", name: "attachment", label: "Projeto e documentos", type: "file", required: true }
        ]
      },
      {
        id: "habite-se",
        name: "Habite-se",
        slug: "habite-se",
        categoryId: "obras-imoveis",
        description: "Solicitação de Habite-se (certificado de conclusão de obra)",
        requiresAuth: true,
        detailedInfo: {
          oQueE: "Serviço de emissão do Habite-se (Auto de Conclusão de Obra), documento que certifica que a construção foi concluída conforme o projeto aprovado e está em condições de habitação no município de Belford Roxo.",
          paraQueServe: "O Habite-se é necessário para regularizar o imóvel junto aos órgãos competentes, possibilitando a averbação na matrícula do imóvel, financiamento bancário e ligação definitiva de água e energia.",
          quemPodeSolicitar: "Proprietários de imóveis que concluíram obra com alvará de construção no município.",
          informacoesComplementares: "A equipe de fiscalização da Secretaria de Obras realizará vistoria no imóvel para verificar a conformidade com o projeto aprovado.",
          informacoesNecessarias: [
            "Número do alvará de construção",
            "Requerimento assinado pelo proprietário",
            "ART ou RRT de conclusão de obra",
            "Comprovante de pagamento de taxas",
            "Projeto aprovado (cópia)"
          ],
          tempoAtendimento: "Até 30 dias úteis após vistoria",
          legislacao: [
            "Código de Obras Municipal",
            "Lei Federal nº 6.015/1973 (Registros Públicos)"
          ]
        },
        fields: [
          { id: "alvara_numero", name: "alvara_numero", label: "Número do alvará de construção", type: "text", required: true },
          { id: "address", name: "address", label: "Endereço do imóvel", type: "address", required: true },
          { id: "attachment", name: "attachment", label: "Documentos", type: "file", required: true }
        ]
      },
      {
        id: "denuncia-obra-irregular",
        name: "Denúncia de Obra Irregular",
        slug: "denuncia-obra-irregular",
        categoryId: "obras-imoveis",
        description: "Denúncia de construção ou obra sem alvará",
        requiresAuth: false,
        detailedInfo: {
          oQueE: "Serviço para denunciar obras e construções realizadas sem alvará, em desacordo com o projeto aprovado ou que estejam causando transtornos à vizinhança no município de Belford Roxo.",
          paraQueServe: "Garantir o cumprimento das normas urbanísticas e de segurança, protegendo a população de riscos decorrentes de obras irregulares e preservando o ordenamento urbano.",
          quemPodeSolicitar: "Qualquer cidadão pode denunciar uma obra irregular.",
          informacoesComplementares: "A denúncia pode ser anônima. A equipe de fiscalização realizará vistoria no local e, se constatada a irregularidade, o responsável será notificado e poderá sofrer embargo e multa.",
          informacoesNecessarias: [
            "Endereço da obra",
            "Descrição da irregularidade observada",
            "Se há risco à segurança dos moradores vizinhos",
            "Fotos da obra (se possível)"
          ],
          tempoAtendimento: "Até 10 dias úteis para vistoria",
          legislacao: [
            "Código de Obras Municipal",
            "Código de Posturas Municipal"
          ]
        },
        fields: [
          { id: "description", name: "description", label: "Descrição da irregularidade", type: "textarea", required: true, placeholder: "Descreva a obra e a irregularidade observada" },
          { id: "address", name: "address", label: "Endereço da obra", type: "address", required: true },
          { id: "attachment", name: "attachment", label: "Fotos", type: "file", required: false }
        ]
      }
    ]
  },

  // =========================================================================
  // 16. Ordem Pública
  // =========================================================================
  {
    id: "ordem-publica",
    name: "Ordem Pública",
    icon: "ShieldCheck",
    slug: "ordem-publica",
    description: "Serviços relacionados à ordem pública e fiscalização urbana",
    services: [
      {
        id: "poluicao-sonora",
        name: "Poluição Sonora",
        slug: "poluicao-sonora",
        categoryId: "ordem-publica",
        description: "Denúncia de poluição sonora e perturbação do sossego",
        requiresAuth: false,
        detailedInfo: {
          oQueE: "Serviço para registro de denúncias de poluição sonora causada por bares, casas noturnas, igrejas, comércio, obras ou vizinhos que ultrapassem os limites de ruído permitidos por lei no município de Belford Roxo.",
          paraQueServe: "Combater a poluição sonora e garantir o sossego público, protegendo a saúde e o bem-estar dos moradores afetados por ruídos excessivos.",
          quemPodeSolicitar: "Qualquer cidadão afetado por ruídos excessivos ou poluição sonora.",
          informacoesComplementares: "A fiscalização será realizada pela Secretaria de Ordem Pública. Em horário noturno (22h às 7h), os limites de ruído são mais rigorosos. Denúncias podem ser feitas de forma anônima.",
          informacoesNecessarias: [
            "Endereço da fonte do ruído",
            "Horários em que ocorre a perturbação",
            "Tipo de ruído (música, obras, máquinas, etc.)",
            "Frequência (diário, semanal, eventual)"
          ],
          tempoAtendimento: "Até 72 horas para fiscalização",
          legislacao: [
            "Lei Federal nº 9.605/1998 (Crimes Ambientais - Art. 54)",
            "Resolução CONAMA nº 01/1990",
            "Código de Posturas Municipal"
          ]
        },
        fields: [
          { id: "description", name: "description", label: "Descrição da perturbação", type: "textarea", required: true, placeholder: "Descreva o tipo de ruído e os horários" },
          { id: "address", name: "address", label: "Endereço da fonte de ruído", type: "address", required: true }
        ]
      },
      {
        id: "comercio-irregular",
        name: "Comércio Ambulante Irregular",
        slug: "comercio-irregular",
        categoryId: "ordem-publica",
        description: "Denúncia de comércio ambulante irregular em via pública",
        requiresAuth: false,
        detailedInfo: {
          oQueE: "Serviço para denunciar a presença de comércio ambulante irregular, camelôs ou ambulantes sem licença que obstruam calçadas, vias públicas ou áreas de grande circulação em Belford Roxo.",
          paraQueServe: "Garantir a ordenação do comércio de rua, a livre circulação de pedestres e veículos, e combater a comercialização de produtos irregulares ou contrabandeados.",
          quemPodeSolicitar: "Qualquer cidadão pode denunciar comércio ambulante irregular.",
          informacoesComplementares: "A Secretaria de Ordem Pública realizará a fiscalização. Ambulantes regularizados possuem permissão da prefeitura e são identificados por crachá ou autorização visível.",
          informacoesNecessarias: [
            "Local da ocorrência",
            "Tipo de comércio irregular",
            "Se há obstrução de calçada ou via",
            "Fotos (se possível)"
          ],
          tempoAtendimento: "Até 72 horas para fiscalização",
          legislacao: [
            "Código de Posturas Municipal",
            "Lei Municipal de Comércio Ambulante"
          ]
        },
        fields: [
          { id: "description", name: "description", label: "Descrição", type: "textarea", required: true, placeholder: "Descreva o comércio irregular e o local" },
          { id: "address", name: "address", label: "Local", type: "address", required: true },
          { id: "attachment", name: "attachment", label: "Fotos", type: "file", required: false }
        ]
      },
      {
        id: "ocupacao-irregular-via",
        name: "Ocupação Irregular de Via Pública",
        slug: "ocupacao-irregular-via",
        categoryId: "ordem-publica",
        description: "Denúncia de ocupação irregular de calçadas e vias",
        requiresAuth: false,
        detailedInfo: {
          oQueE: "Serviço para denunciar a ocupação irregular de calçadas, vias públicas e áreas de uso comum por mesas de bares, materiais de construção, veículos abandonados ou outras obstruções em Belford Roxo.",
          paraQueServe: "Garantir a livre circulação de pedestres e veículos, mantendo as vias e calçadas desobstruídas e seguras para toda a população.",
          quemPodeSolicitar: "Qualquer cidadão pode denunciar ocupação irregular de via pública.",
          informacoesComplementares: "A equipe de fiscalização verificará a situação e notificará o responsável. Em caso de reincidência, poderão ser aplicadas multas e remoção do material.",
          informacoesNecessarias: [
            "Endereço da ocupação irregular",
            "Tipo de obstrução (mesas, materiais, veículo, etc.)",
            "Se há obstrução total ou parcial da passagem",
            "Fotos do local"
          ],
          tempoAtendimento: "Até 5 dias úteis para fiscalização",
          legislacao: [
            "Código de Posturas Municipal",
            "Código de Trânsito Brasileiro"
          ]
        },
        fields: [
          { id: "description", name: "description", label: "Descrição", type: "textarea", required: true, placeholder: "Descreva a ocupação irregular" },
          { id: "address", name: "address", label: "Local", type: "address", required: true },
          { id: "attachment", name: "attachment", label: "Fotos", type: "file", required: false }
        ]
      }
    ]
  },

  // =========================================================================
  // 17. Processos e Certidões
  // =========================================================================
  {
    id: "processos-certidoes",
    name: "Processos e Certidões",
    icon: "FileText",
    slug: "processos-certidoes",
    description: "Consulta de processos administrativos e emissão de certidões municipais",
    services: [
      {
        id: "certidao-negativa-debitos",
        name: "Certidão Negativa de Débitos",
        slug: "certidao-negativa-debitos",
        categoryId: "processos-certidoes",
        description: "Emissão de certidão negativa de débitos municipais",
        requiresAuth: true,
        detailedInfo: {
          oQueE: "Serviço de emissão de Certidão Negativa de Débitos (CND) do município de Belford Roxo, que comprova a inexistência de débitos do contribuinte junto à Fazenda Municipal.",
          paraQueServe: "A CND é necessária para participar de licitações, realizar transações imobiliárias, obter financiamentos e comprovar regularidade fiscal junto ao município.",
          quemPodeSolicitar: "Qualquer pessoa física ou jurídica contribuinte do município de Belford Roxo.",
          informacoesComplementares: "A certidão pode ser emitida online quando não houver débitos. Em caso de pendências, é necessário regularizar a situação fiscal antes da emissão.",
          informacoesNecessarias: [
            "CPF ou CNPJ do contribuinte",
            "Inscrição imobiliária (para certidão de imóvel)",
            "Inscrição municipal (para empresas)"
          ],
          tempoAtendimento: "Emissão imediata (sem débitos); até 5 dias úteis (com pendências a verificar)",
          legislacao: [
            "Código Tributário Municipal",
            "Lei Federal nº 8.666/1993 (Licitações)"
          ]
        },
        fields: [
          { id: "cpf", name: "cpf", label: "CPF ou CNPJ", type: "cpf", required: true },
          { id: "tipo_certidao", name: "tipo_certidao", label: "Tipo de certidão", type: "select", required: true, options: [
            { value: "pessoa_fisica", label: "Pessoa Física" },
            { value: "pessoa_juridica", label: "Pessoa Jurídica" },
            { value: "imovel", label: "Imóvel (IPTU)" }
          ]},
          { id: "email", name: "email", label: "E-mail para envio", type: "email", required: true }
        ]
      },
      {
        id: "certidao-uso-solo",
        name: "Certidão de Uso do Solo",
        slug: "certidao-uso-solo",
        categoryId: "processos-certidoes",
        description: "Emissão de certidão de uso e ocupação do solo",
        requiresAuth: true,
        detailedInfo: {
          oQueE: "Serviço de emissão de Certidão de Uso do Solo, que informa o zoneamento urbano e as atividades permitidas para um determinado endereço no município de Belford Roxo.",
          paraQueServe: "A certidão é necessária para abertura de empresas, construção de imóveis e regularização de atividades, pois informa se o uso pretendido é compatível com o zoneamento do local.",
          quemPodeSolicitar: "Proprietários de imóveis, empresários e profissionais que necessitem verificar o zoneamento e uso permitido de um endereço.",
          informacoesComplementares: "A certidão é emitida pela Secretaria de Urbanismo com base no Plano Diretor Municipal e na Lei de Uso e Ocupação do Solo.",
          informacoesNecessarias: [
            "Endereço completo do imóvel",
            "Inscrição imobiliária",
            "Finalidade da certidão (abertura de empresa, construção, etc.)",
            "Atividade pretendida"
          ],
          tempoAtendimento: "Até 15 dias úteis",
          legislacao: [
            "Plano Diretor Municipal de Belford Roxo",
            "Lei Municipal de Uso e Ocupação do Solo"
          ]
        },
        fields: [
          { id: "description", name: "description", label: "Finalidade e atividade pretendida", type: "textarea", required: true, placeholder: "Descreva a finalidade da certidão e a atividade pretendida" },
          { id: "address", name: "address", label: "Endereço do imóvel", type: "address", required: true },
          { id: "email", name: "email", label: "E-mail para contato", type: "email", required: true }
        ]
      },
      {
        id: "consulta-processo-administrativo",
        name: "Consulta de Processos Administrativos",
        slug: "consulta-processo-administrativo",
        categoryId: "processos-certidoes",
        description: "Consulta de andamento de processos administrativos municipais",
        requiresAuth: true,
        detailedInfo: {
          oQueE: "Serviço de consulta ao andamento de processos administrativos protocolados na Prefeitura de Belford Roxo, incluindo requerimentos, recursos, licenças e demais expedientes.",
          paraQueServe: "Permitir que o cidadão acompanhe o andamento de seus processos administrativos junto à prefeitura, verificando o status, o setor responsável e os despachos realizados.",
          quemPodeSolicitar: "Qualquer cidadão ou empresa que possua processo administrativo em tramitação na Prefeitura de Belford Roxo.",
          informacoesComplementares: "Para consultar, é necessário o número do processo ou protocolo. A consulta presencial pode ser feita no Protocolo Geral da Prefeitura.",
          informacoesNecessarias: [
            "Número do processo ou protocolo",
            "CPF ou CNPJ do interessado",
            "Ano do processo"
          ],
          tempoAtendimento: "Consulta imediata",
          legislacao: [
            "Lei Federal nº 9.784/1999 (Processo Administrativo Federal, aplicada por analogia)",
            "Lei Federal nº 12.527/2011 (Lei de Acesso à Informação)"
          ]
        },
        fields: [
          { id: "numero_processo", name: "numero_processo", label: "Número do processo/protocolo", type: "text", required: true, placeholder: "Informe o número do processo" },
          { id: "cpf", name: "cpf", label: "CPF ou CNPJ", type: "cpf", required: true }
        ]
      }
    ]
  },

  // =========================================================================
  // 18. Procon
  // =========================================================================
  {
    id: "procon",
    name: "Procon",
    icon: "Scale",
    slug: "procon",
    description: "Serviços de defesa do consumidor",
    services: [
      {
        id: "reclamacao-consumidor",
        name: "Reclamação de Consumidor",
        slug: "reclamacao-consumidor",
        categoryId: "procon",
        description: "Registro de reclamação junto ao Procon de Belford Roxo",
        requiresAuth: false,
        detailedInfo: {
          oQueE: "Serviço de registro de reclamações de consumidores contra fornecedores de produtos e serviços no município de Belford Roxo. O Procon Municipal atua na mediação e resolução de conflitos de consumo.",
          paraQueServe: "Proteger os direitos do consumidor, mediando conflitos entre consumidores e fornecedores e buscando a resolução de problemas como cobranças indevidas, produtos defeituosos, propaganda enganosa e descumprimento de contrato.",
          quemPodeSolicitar: "Qualquer consumidor que tenha adquirido produto ou serviço no município de Belford Roxo ou de fornecedor que atue no município.",
          informacoesComplementares: "Antes de registrar a reclamação no Procon, é recomendável tentar resolver diretamente com o fornecedor. Guarde todos os comprovantes, notas fiscais e registros de comunicação.",
          informacoesNecessarias: [
            "Nome completo do consumidor",
            "CPF",
            "Nome do fornecedor/empresa reclamada",
            "CNPJ do fornecedor (se disponível)",
            "Descrição detalhada do problema",
            "Nota fiscal ou comprovante de compra",
            "Protocolo de atendimento anterior (se houver)"
          ],
          tempoAtendimento: "Até 10 dias úteis para análise; audiência em até 30 dias",
          legislacao: [
            "Lei Federal nº 8.078/1990 (Código de Defesa do Consumidor)",
            "Decreto Federal nº 2.181/1997"
          ]
        },
        fields: [
          { id: "empresa_reclamada", name: "empresa_reclamada", label: "Empresa reclamada", type: "text", required: true, placeholder: "Nome da empresa" },
          { id: "cpf", name: "cpf", label: "CPF do consumidor", type: "cpf", required: true },
          { id: "description", name: "description", label: "Descrição da reclamação", type: "textarea", required: true, placeholder: "Descreva detalhadamente o problema" },
          { id: "attachment", name: "attachment", label: "Documentos (nota fiscal, comprovantes)", type: "file", required: false }
        ]
      },
      {
        id: "orientacao-consumidor",
        name: "Orientação ao Consumidor",
        slug: "orientacao-consumidor",
        categoryId: "procon",
        description: "Orientação sobre direitos do consumidor",
        requiresAuth: false,
        detailedInfo: {
          oQueE: "Serviço de orientação e esclarecimento de dúvidas sobre direitos do consumidor, oferecido pelo Procon de Belford Roxo. A equipe de atendentes e advogados orienta sobre as melhores formas de resolver problemas de consumo.",
          paraQueServe: "Informar e orientar os consumidores sobre seus direitos e deveres nas relações de consumo, auxiliando na tomada de decisões e na resolução de conflitos.",
          quemPodeSolicitar: "Qualquer cidadão que tenha dúvidas sobre direitos do consumidor.",
          informacoesComplementares: "O atendimento pode ser feito presencialmente na sede do Procon Municipal ou por meio dos canais digitais. É um serviço gratuito e não requer agendamento.",
          informacoesNecessarias: [
            "Descrição da dúvida ou situação",
            "Dados do produto ou serviço em questão"
          ],
          tempoAtendimento: "Atendimento imediato",
          legislacao: [
            "Lei Federal nº 8.078/1990 (Código de Defesa do Consumidor)"
          ]
        },
        fields: [
          { id: "description", name: "description", label: "Sua dúvida", type: "textarea", required: true, placeholder: "Descreva sua dúvida sobre direitos do consumidor" },
          { id: "email", name: "email", label: "E-mail para resposta", type: "email", required: false },
          { id: "phone", name: "phone", label: "Telefone para contato", type: "phone", required: false }
        ]
      },
      {
        id: "audiencia-conciliacao",
        name: "Audiência de Conciliação",
        slug: "audiencia-conciliacao",
        categoryId: "procon",
        description: "Solicitação de audiência de conciliação entre consumidor e fornecedor",
        requiresAuth: true,
        detailedInfo: {
          oQueE: "Serviço de agendamento de audiência de conciliação no Procon de Belford Roxo entre consumidor e fornecedor, visando a resolução extrajudicial de conflitos de consumo.",
          paraQueServe: "Promover acordo entre consumidor e fornecedor de forma rápida e gratuita, evitando a necessidade de ação judicial. Na audiência, um mediador do Procon auxilia as partes a chegarem a um acordo.",
          quemPodeSolicitar: "Consumidores que já possuam reclamação registrada no Procon e que não obtiveram resolução na fase administrativa.",
          informacoesComplementares: "Ambas as partes serão convocadas para a audiência. O não comparecimento do fornecedor pode resultar em aplicação de multa. Se não houver acordo, o consumidor pode recorrer ao Juizado Especial.",
          informacoesNecessarias: [
            "Número da reclamação no Procon",
            "CPF do consumidor",
            "Nome e CNPJ do fornecedor",
            "Breve resumo do problema",
            "Documentos comprobatórios"
          ],
          tempoAtendimento: "Audiência agendada em até 30 dias",
          legislacao: [
            "Lei Federal nº 8.078/1990 (CDC)",
            "Decreto Federal nº 2.181/1997"
          ]
        },
        fields: [
          { id: "numero_reclamacao", name: "numero_reclamacao", label: "Número da reclamação no Procon", type: "text", required: true },
          { id: "cpf", name: "cpf", label: "CPF do consumidor", type: "cpf", required: true },
          { id: "description", name: "description", label: "Resumo do problema", type: "textarea", required: true },
          { id: "attachment", name: "attachment", label: "Documentos", type: "file", required: false }
        ]
      }
    ]
  },

  // =========================================================================
  // 19. Proteção de Dados
  // =========================================================================
  {
    id: "protecao-dados",
    name: "Proteção de Dados",
    icon: "ShieldHalf",
    slug: "protecao-dados",
    description: "Serviços relacionados à proteção de dados pessoais e LGPD",
    services: [
      {
        id: "acesso-dados-pessoais",
        name: "Solicitação de Acesso a Dados Pessoais",
        slug: "acesso-dados-pessoais",
        categoryId: "protecao-dados",
        description: "Solicitar acesso aos seus dados pessoais mantidos pela prefeitura",
        requiresAuth: true,
        detailedInfo: {
          oQueE: "Serviço que permite ao cidadão solicitar acesso aos dados pessoais que a Prefeitura de Belford Roxo mantém em seus sistemas e bancos de dados, conforme previsto na Lei Geral de Proteção de Dados (LGPD).",
          paraQueServe: "Garantir o direito do titular de dados pessoais de saber quais informações a prefeitura possui sobre ele, como são utilizadas e com quem são compartilhadas.",
          quemPodeSolicitar: "Qualquer cidadão que tenha dados pessoais tratados pela Prefeitura de Belford Roxo.",
          informacoesComplementares: "A solicitação será analisada pelo Encarregado de Proteção de Dados (DPO) da Prefeitura. Os dados serão fornecidos em formato claro e acessível, dentro do prazo legal.",
          informacoesNecessarias: [
            "Nome completo",
            "CPF",
            "E-mail para envio da resposta",
            "Descrição dos dados que deseja consultar",
            "Documento de identificação (para verificação de identidade)"
          ],
          tempoAtendimento: "Até 15 dias úteis conforme LGPD",
          legislacao: [
            "Lei Federal nº 13.709/2018 (LGPD) - Art. 18",
            "Decreto Municipal de regulamentação da LGPD"
          ]
        },
        fields: [
          { id: "cpf", name: "cpf", label: "CPF", type: "cpf", required: true },
          { id: "email", name: "email", label: "E-mail para resposta", type: "email", required: true },
          { id: "description", name: "description", label: "Dados que deseja consultar", type: "textarea", required: true, placeholder: "Descreva quais dados pessoais deseja consultar" }
        ]
      },
      {
        id: "exclusao-dados",
        name: "Solicitação de Exclusão de Dados Pessoais",
        slug: "exclusao-dados",
        categoryId: "protecao-dados",
        description: "Solicitar a exclusão ou anonimização de dados pessoais",
        requiresAuth: true,
        detailedInfo: {
          oQueE: "Serviço para solicitar a exclusão, anonimização ou bloqueio de dados pessoais desnecessários, excessivos ou tratados em desconformidade com a LGPD pela Prefeitura de Belford Roxo.",
          paraQueServe: "Garantir o direito do titular de solicitar a eliminação de dados pessoais que não sejam mais necessários para a finalidade que motivou sua coleta, ou quando o consentimento for revogado.",
          quemPodeSolicitar: "Qualquer cidadão que tenha dados pessoais tratados pela Prefeitura de Belford Roxo.",
          informacoesComplementares: "Alguns dados não podem ser excluídos quando seu tratamento é obrigatório por lei (ex: dados tributários, processos administrativos em andamento). Nesses casos, o cidadão será informado sobre a fundamentação legal.",
          informacoesNecessarias: [
            "Nome completo",
            "CPF",
            "E-mail para contato",
            "Descrição dos dados que deseja excluir",
            "Motivo da solicitação"
          ],
          tempoAtendimento: "Até 15 dias úteis conforme LGPD",
          legislacao: [
            "Lei Federal nº 13.709/2018 (LGPD) - Art. 18, inciso VI",
            "Decreto Municipal de regulamentação da LGPD"
          ]
        },
        fields: [
          { id: "cpf", name: "cpf", label: "CPF", type: "cpf", required: true },
          { id: "email", name: "email", label: "E-mail para contato", type: "email", required: true },
          { id: "description", name: "description", label: "Dados que deseja excluir e motivo", type: "textarea", required: true, placeholder: "Descreva quais dados deseja excluir e o motivo" }
        ]
      }
    ]
  },

  // =========================================================================
  // 20. Saúde e Vigilância Sanitária
  // =========================================================================
  {
    id: "saude",
    name: "Saúde e Vigilância Sanitária",
    icon: "Stethoscope",
    slug: "saude",
    description: "Serviços de saúde pública e vigilância sanitária",
    services: [
      {
        id: "dengue",
        name: "Foco de Dengue",
        slug: "foco-dengue",
        categoryId: "saude",
        description: "Denúncia de foco de dengue, zika ou chikungunya",
        requiresAuth: false,
        detailedInfo: {
          oQueE: "Serviço para denunciar locais com possíveis focos de proliferação do mosquito Aedes aegypti, transmissor da dengue, zika e chikungunya no município de Belford Roxo.",
          paraQueServe: "Permitir que as equipes de vigilância sanitária identifiquem e eliminem focos do mosquito, prevenindo a proliferação de doenças arbovirais.",
          quemPodeSolicitar: "Qualquer cidadão pode denunciar um possível foco de dengue.",
          informacoesComplementares: "Locais com água parada são os principais criadouros do mosquito. Verifique regularmente sua casa e quintal. Em caso de sintomas, procure a unidade de saúde mais próxima.",
          informacoesNecessarias: [
            "Endereço completo do local",
            "Descrição do possível foco (piscina abandonada, caixa d'água destampada, etc.)",
            "Fotos (se possível)"
          ],
          tempoAtendimento: "Até 48 horas para vistoria",
          legislacao: [
            "Lei Federal nº 13.301/2016",
            "Programa Nacional de Controle da Dengue"
          ]
        },
        fields: [
          { id: "description", name: "description", label: "Descrição do foco", type: "textarea", required: true, placeholder: "Descreva o possível foco de dengue" },
          { id: "address", name: "address", label: "Endereço", type: "address", required: true },
          { id: "attachment", name: "attachment", label: "Fotos", type: "file", required: false }
        ]
      },
      {
        id: "unidade-saude",
        name: "Informações sobre Unidades de Saúde",
        slug: "informacoes-unidade-saude",
        categoryId: "saude",
        description: "Informações e sugestões sobre unidades de saúde",
        requiresAuth: false,
        detailedInfo: {
          oQueE: "Canal para obter informações sobre as unidades de saúde do município de Belford Roxo, incluindo horários de funcionamento, serviços oferecidos e localização das UBS, UPAs e hospitais municipais.",
          paraQueServe: "Facilitar o acesso da população às informações sobre a rede de saúde municipal de Belford Roxo.",
          quemPodeSolicitar: "Qualquer cidadão pode solicitar informações sobre unidades de saúde.",
          informacoesComplementares: "Para agendamento de consultas, procure a Unidade Básica de Saúde (UBS) mais próxima de sua residência. Em caso de emergência, dirija-se à UPA ou ligue 192 (SAMU).",
          informacoesNecessarias: [
            "Bairro de residência",
            "Tipo de serviço procurado"
          ],
          tempoAtendimento: "Resposta imediata",
          legislacao: [
            "Lei nº 8.080/1990 (Lei do SUS)"
          ]
        },
        fields: [
          { id: "description", name: "description", label: "Sua dúvida ou sugestão", type: "textarea", required: true, placeholder: "Descreva o que deseja saber sobre as unidades de saúde" }
        ]
      },
      {
        id: "denuncia-sanitaria",
        name: "Denúncia Sanitária",
        slug: "denuncia-sanitaria",
        categoryId: "saude",
        description: "Denúncia de irregularidades sanitárias em estabelecimentos",
        requiresAuth: false,
        detailedInfo: {
          oQueE: "Serviço para denunciar irregularidades sanitárias em estabelecimentos comerciais, de alimentação, saúde ou beleza no município de Belford Roxo, como falta de higiene, alimentos vencidos, produtos sem registro ou condições inadequadas de funcionamento.",
          paraQueServe: "Proteger a saúde da população através da fiscalização de estabelecimentos que ofereçam riscos sanitários, garantindo o cumprimento das normas de higiene e segurança alimentar.",
          quemPodeSolicitar: "Qualquer cidadão pode fazer uma denúncia sanitária.",
          informacoesComplementares: "A denúncia pode ser feita de forma anônima. A equipe de Vigilância Sanitária realizará inspeção no estabelecimento e, se constatada a irregularidade, serão aplicadas as penalidades previstas em lei.",
          informacoesNecessarias: [
            "Nome e endereço do estabelecimento",
            "Tipo de irregularidade observada",
            "Data e horário da constatação",
            "Fotos ou evidências (se disponíveis)"
          ],
          tempoAtendimento: "Até 72 horas para inspeção",
          legislacao: [
            "Lei Federal nº 6.437/1977 (Infrações Sanitárias)",
            "RDC ANVISA nº 216/2004",
            "Código Sanitário Municipal"
          ]
        },
        fields: [
          { id: "nome_estabelecimento", name: "nome_estabelecimento", label: "Nome do estabelecimento", type: "text", required: true },
          { id: "description", name: "description", label: "Descrição da irregularidade", type: "textarea", required: true, placeholder: "Descreva a irregularidade sanitária observada" },
          { id: "address", name: "address", label: "Endereço do estabelecimento", type: "address", required: true },
          { id: "attachment", name: "attachment", label: "Fotos ou evidências", type: "file", required: false }
        ]
      }
    ]
  },

  // =========================================================================
  // 21. Segurança Pública
  // =========================================================================
  {
    id: "seguranca-publica",
    name: "Segurança Pública",
    icon: "Landmark",
    slug: "seguranca-publica",
    description: "Serviços relacionados à segurança pública e Guarda Municipal",
    services: [
      {
        id: "ronda-guarda-municipal",
        name: "Solicitação de Ronda da Guarda Municipal",
        slug: "ronda-guarda-municipal",
        categoryId: "seguranca-publica",
        description: "Solicitar ronda da Guarda Municipal em área com problemas de segurança",
        requiresAuth: false,
        detailedInfo: {
          oQueE: "Serviço para solicitar a ronda ou patrulhamento da Guarda Municipal de Belford Roxo em áreas que apresentem problemas de segurança, vandalismo ou situações que exijam presença ostensiva.",
          paraQueServe: "Aumentar a sensação de segurança e coibir ações criminosas ou de vandalismo em áreas públicas como praças, escolas, postos de saúde e bairros com maior índice de ocorrências.",
          quemPodeSolicitar: "Qualquer cidadão pode solicitar a ronda da Guarda Municipal.",
          informacoesComplementares: "A Guarda Municipal atua na proteção de bens, serviços e instalações municipais. Para emergências policiais, ligue 190 (Polícia Militar) ou 197 (Polícia Civil).",
          informacoesNecessarias: [
            "Endereço ou área onde solicita a ronda",
            "Descrição do problema de segurança observado",
            "Horários em que o problema é mais frequente",
            "Ponto de referência"
          ],
          tempoAtendimento: "Avaliação em até 48 horas; inclusão em rota de patrulhamento",
          legislacao: [
            "Lei Federal nº 13.022/2014 (Estatuto Geral das Guardas Municipais)",
            "Constituição Federal - Art. 144, § 8º"
          ]
        },
        fields: [
          { id: "description", name: "description", label: "Descrição da situação", type: "textarea", required: true, placeholder: "Descreva o problema de segurança e os horários mais críticos" },
          { id: "address", name: "address", label: "Local", type: "address", required: true }
        ]
      },
      {
        id: "vandalismo-patrimonio",
        name: "Vandalismo ao Patrimônio Público",
        slug: "vandalismo-patrimonio",
        categoryId: "seguranca-publica",
        description: "Denúncia de vandalismo a patrimônio público municipal",
        requiresAuth: false,
        detailedInfo: {
          oQueE: "Serviço para denunciar atos de vandalismo, depredação ou destruição do patrimônio público municipal de Belford Roxo, como praças, escolas, postos de saúde, sinalização e mobiliário urbano.",
          paraQueServe: "Proteger o patrimônio público, possibilitando a identificação e responsabilização dos autores de atos de vandalismo e a rápida restauração dos bens danificados.",
          quemPodeSolicitar: "Qualquer cidadão pode denunciar atos de vandalismo ao patrimônio público.",
          informacoesComplementares: "A denúncia pode ser feita de forma anônima. A Guarda Municipal e os órgãos competentes serão acionados. Vandalismo ao patrimônio público é crime previsto no Código Penal.",
          informacoesNecessarias: [
            "Local da ocorrência",
            "Descrição do dano causado",
            "Data e horário (se conhecidos)",
            "Fotos do dano",
            "Informações sobre os autores (se disponíveis)"
          ],
          tempoAtendimento: "Até 24 horas para registro e encaminhamento",
          legislacao: [
            "Código Penal Brasileiro - Art. 163 (Dano)",
            "Lei Federal nº 13.022/2014 (Estatuto da Guarda Municipal)"
          ]
        },
        fields: [
          { id: "description", name: "description", label: "Descrição do vandalismo", type: "textarea", required: true, placeholder: "Descreva o ato de vandalismo e o dano causado" },
          { id: "address", name: "address", label: "Local da ocorrência", type: "address", required: true },
          { id: "attachment", name: "attachment", label: "Fotos do dano", type: "file", required: false }
        ]
      }
    ]
  },

  // =========================================================================
  // 22. Servidor Público
  // =========================================================================
  {
    id: "servidor-publico",
    name: "Servidor Público",
    icon: "Trophy",
    slug: "servidor-publico",
    description: "Serviços para servidores públicos municipais de Belford Roxo",
    services: [
      {
        id: "contracheque-servidor",
        name: "Contracheque e Informações Funcionais",
        slug: "contracheque-servidor",
        categoryId: "servidor-publico",
        description: "Consulta de contracheque e informações funcionais do servidor",
        requiresAuth: true,
        detailedInfo: {
          oQueE: "Serviço de consulta de contracheque (holerite), informações funcionais e extrato de pagamento dos servidores públicos municipais de Belford Roxo, disponível no portal do servidor.",
          paraQueServe: "Permitir que o servidor municipal consulte seus rendimentos, descontos, informes de rendimentos e dados funcionais de forma rápida e digital.",
          quemPodeSolicitar: "Servidores públicos ativos, inativos e pensionistas do município de Belford Roxo.",
          informacoesComplementares: "O acesso é feito mediante login no portal do servidor com matrícula funcional e senha. Em caso de divergência nos valores, procure o setor de Recursos Humanos.",
          informacoesNecessarias: [
            "Matrícula funcional",
            "CPF do servidor"
          ],
          tempoAtendimento: "Consulta imediata (online)",
          legislacao: [
            "Estatuto dos Servidores Públicos Municipais de Belford Roxo",
            "Lei de Transparência Municipal"
          ]
        },
        fields: [
          { id: "matricula", name: "matricula", label: "Matrícula funcional", type: "text", required: true },
          { id: "cpf", name: "cpf", label: "CPF", type: "cpf", required: true }
        ]
      },
      {
        id: "licenca-afastamento",
        name: "Licença e Afastamento",
        slug: "licenca-afastamento",
        categoryId: "servidor-publico",
        description: "Solicitação de licenças e afastamentos funcionais",
        requiresAuth: true,
        detailedInfo: {
          oQueE: "Serviço para solicitar licenças e afastamentos previstos no estatuto dos servidores públicos municipais de Belford Roxo, como licença médica, licença-prêmio, licença para tratar de interesse particular, entre outras.",
          paraQueServe: "Formalizar o pedido de licença ou afastamento do servidor junto ao setor de Recursos Humanos, garantindo que os direitos funcionais sejam respeitados conforme a legislação.",
          quemPodeSolicitar: "Servidores públicos efetivos do município de Belford Roxo.",
          informacoesComplementares: "Licenças médicas acima de 3 dias necessitam de perícia médica. Licenças para tratar de interesse particular são sem remuneração e dependem de autorização do secretário da pasta.",
          informacoesNecessarias: [
            "Matrícula funcional",
            "Tipo de licença solicitada",
            "Período pretendido",
            "Justificativa",
            "Atestado médico (para licença médica)",
            "Documentos comprobatórios"
          ],
          tempoAtendimento: "Até 10 dias úteis para análise",
          legislacao: [
            "Estatuto dos Servidores Públicos Municipais de Belford Roxo",
            "Lei Federal nº 8.112/1990 (aplicada subsidiariamente)"
          ]
        },
        fields: [
          { id: "matricula", name: "matricula", label: "Matrícula funcional", type: "text", required: true },
          { id: "tipo_licenca", name: "tipo_licenca", label: "Tipo de licença", type: "select", required: true, options: [
            { value: "medica", label: "Licença Médica" },
            { value: "premio", label: "Licença-Prêmio" },
            { value: "interesse_particular", label: "Licença para Tratar de Interesse Particular" },
            { value: "maternidade", label: "Licença-Maternidade" },
            { value: "paternidade", label: "Licença-Paternidade" },
            { value: "luto", label: "Licença por Falecimento" }
          ]},
          { id: "description", name: "description", label: "Justificativa", type: "textarea", required: true },
          { id: "attachment", name: "attachment", label: "Documentos comprobatórios", type: "file", required: false }
        ]
      },
      {
        id: "recadastramento-servidor",
        name: "Recadastramento de Servidor",
        slug: "recadastramento-servidor",
        categoryId: "servidor-publico",
        description: "Recadastramento anual obrigatório de servidores",
        requiresAuth: true,
        detailedInfo: {
          oQueE: "Serviço de recadastramento anual obrigatório dos servidores públicos ativos e inativos do município de Belford Roxo, para atualização de dados cadastrais e funcionais.",
          paraQueServe: "Manter o cadastro dos servidores atualizado, garantindo a regularidade dos pagamentos e benefícios. O não recadastramento pode resultar em suspensão do pagamento.",
          quemPodeSolicitar: "Todos os servidores públicos ativos, inativos e pensionistas do município de Belford Roxo.",
          informacoesComplementares: "O período de recadastramento é divulgado anualmente por decreto. O recadastramento pode ser feito presencialmente no setor de Recursos Humanos ou pelo portal do servidor.",
          informacoesNecessarias: [
            "Matrícula funcional",
            "CPF",
            "Documento de identidade atualizado",
            "Comprovante de residência atualizado",
            "Foto 3x4 recente"
          ],
          tempoAtendimento: "Confirmação imediata",
          legislacao: [
            "Estatuto dos Servidores Públicos Municipais",
            "Decreto Municipal de Recadastramento"
          ]
        },
        fields: [
          { id: "matricula", name: "matricula", label: "Matrícula funcional", type: "text", required: true },
          { id: "cpf", name: "cpf", label: "CPF", type: "cpf", required: true },
          { id: "address", name: "address", label: "Endereço atualizado", type: "address", required: true },
          { id: "phone", name: "phone", label: "Telefone atualizado", type: "phone", required: true },
          { id: "email", name: "email", label: "E-mail atualizado", type: "email", required: true }
        ]
      }
    ]
  },

  // =========================================================================
  // 23. Serviço Funerário
  // =========================================================================
  {
    id: "servico-funerario",
    name: "Serviço Funerário",
    icon: "Cross",
    slug: "servico-funerario",
    description: "Serviços funerários municipais e autorizações de sepultamento",
    services: [
      {
        id: "servico-funerario-gratuito",
        name: "Serviço Funerário Gratuito",
        slug: "servico-funerario-gratuito",
        categoryId: "servico-funerario",
        description: "Solicitação de serviço funerário gratuito para famílias de baixa renda",
        requiresAuth: false,
        detailedInfo: {
          oQueE: "Serviço funerário gratuito oferecido pela Prefeitura de Belford Roxo para famílias de baixa renda que não possuem condições financeiras de arcar com os custos de um funeral, incluindo urna, velório e sepultamento.",
          paraQueServe: "Garantir que famílias em situação de vulnerabilidade social tenham acesso a um funeral digno para seus entes queridos, sem custos.",
          quemPodeSolicitar: "Famílias de baixa renda cadastradas no CadÚnico ou que comprovem impossibilidade de arcar com os custos do funeral.",
          informacoesComplementares: "A solicitação deve ser feita o mais breve possível após o óbito. É necessário apresentar a certidão de óbito e comprovante de situação socioeconômica. O serviço está sujeito a disponibilidade.",
          informacoesNecessarias: [
            "Certidão de óbito",
            "Documento de identificação do falecido",
            "Documento de identificação do responsável pela solicitação",
            "Comprovante de inscrição no CadÚnico ou declaração de hipossuficiência",
            "Comprovante de residência"
          ],
          tempoAtendimento: "Atendimento imediato após apresentação dos documentos",
          legislacao: [
            "Lei Municipal de Serviços Funerários",
            "Lei Orgânica Municipal"
          ]
        },
        fields: [
          { id: "nome_falecido", name: "nome_falecido", label: "Nome do falecido", type: "text", required: true },
          { id: "cpf", name: "cpf", label: "CPF do solicitante", type: "cpf", required: true },
          { id: "phone", name: "phone", label: "Telefone para contato", type: "phone", required: true },
          { id: "attachment", name: "attachment", label: "Certidão de óbito e documentos", type: "file", required: true }
        ]
      },
      {
        id: "autorizacao-sepultamento",
        name: "Autorização para Sepultamento",
        slug: "autorizacao-sepultamento",
        categoryId: "servico-funerario",
        description: "Emissão de autorização para sepultamento em cemitérios municipais",
        requiresAuth: false,
        detailedInfo: {
          oQueE: "Serviço de emissão de autorização de sepultamento nos cemitérios públicos do município de Belford Roxo. A autorização é obrigatória para a realização do sepultamento.",
          paraQueServe: "Formalizar e autorizar o sepultamento em cemitérios públicos municipais, garantindo o registro adequado e o controle dos sepultamentos realizados.",
          quemPodeSolicitar: "Familiares do falecido ou representante da empresa funerária responsável.",
          informacoesComplementares: "A autorização é emitida pela administração do cemitério mediante apresentação da certidão de óbito. Para translado de restos mortais, é necessário autorização adicional.",
          informacoesNecessarias: [
            "Certidão de óbito",
            "Documento de identificação do responsável",
            "Nome completo do falecido",
            "Local do sepultamento desejado (cemitério)"
          ],
          tempoAtendimento: "Emissão imediata",
          legislacao: [
            "Lei Municipal de Serviços Funerários",
            "Regulamento dos Cemitérios Municipais"
          ]
        },
        fields: [
          { id: "nome_falecido", name: "nome_falecido", label: "Nome do falecido", type: "text", required: true },
          { id: "cemiterio", name: "cemiterio", label: "Cemitério desejado", type: "text", required: true, placeholder: "Informe o cemitério municipal" },
          { id: "phone", name: "phone", label: "Telefone do responsável", type: "phone", required: true },
          { id: "attachment", name: "attachment", label: "Certidão de óbito", type: "file", required: true }
        ]
      }
    ]
  },

  // =========================================================================
  // 24. Suporte Técnico e Teleatendimento
  // =========================================================================
  {
    id: "suporte-tecnico",
    name: "Suporte Técnico e Teleatendimento",
    icon: "Headphones",
    slug: "suporte-tecnico-teleatendimento",
    description: "Suporte técnico ao portal e canais de teleatendimento",
    services: [
      {
        id: "suporte-portal",
        name: "Suporte ao Portal do Cidadão",
        slug: "suporte-portal",
        categoryId: "suporte-tecnico",
        description: "Suporte técnico para uso do portal de serviços",
        requiresAuth: false,
        detailedInfo: {
          oQueE: "Serviço de suporte técnico para auxiliar os cidadãos no uso do Portal 2909 de Belford Roxo, incluindo problemas de acesso, cadastro, navegação, envio de formulários e acompanhamento de protocolos.",
          paraQueServe: "Garantir que todos os cidadãos consigam utilizar os serviços digitais oferecidos pelo portal, resolvendo dificuldades técnicas e orientando sobre as funcionalidades disponíveis.",
          quemPodeSolicitar: "Qualquer cidadão que tenha dificuldades no uso do portal de serviços.",
          informacoesComplementares: "O suporte está disponível de segunda a sexta, das 8h às 18h. Para problemas urgentes fora do horário, envie um e-mail que será respondido no próximo dia útil.",
          informacoesNecessarias: [
            "Descrição do problema técnico",
            "Navegador utilizado (Chrome, Firefox, etc.)",
            "Dispositivo (computador, celular, tablet)",
            "Print de tela do erro (se possível)"
          ],
          tempoAtendimento: "Até 24 horas úteis",
          legislacao: [
            "Lei Federal nº 14.129/2021 (Governo Digital)"
          ]
        },
        fields: [
          { id: "description", name: "description", label: "Descrição do problema", type: "textarea", required: true, placeholder: "Descreva o problema técnico encontrado" },
          { id: "email", name: "email", label: "E-mail para resposta", type: "email", required: true },
          { id: "attachment", name: "attachment", label: "Print de tela", type: "file", required: false }
        ]
      },
      {
        id: "teleatendimento-2909",
        name: "Teleatendimento 2909",
        slug: "teleatendimento-2909",
        categoryId: "suporte-tecnico",
        description: "Informações sobre o serviço de teleatendimento 2909",
        requiresAuth: false,
        detailedInfo: {
          oQueE: "Canal de teleatendimento da Prefeitura de Belford Roxo através do número 2909, onde o cidadão pode obter informações sobre serviços municipais, registrar solicitações e acompanhar protocolos por telefone.",
          paraQueServe: "Oferecer um canal de atendimento telefônico acessível para cidadãos que não possuem acesso à internet ou que preferem o atendimento por voz, garantindo a inclusão digital.",
          quemPodeSolicitar: "Qualquer cidadão pode utilizar o serviço de teleatendimento.",
          informacoesComplementares: "O teleatendimento funciona de segunda a sexta, das 8h às 18h. As ligações são gratuitas de telefone fixo. Tenha em mãos seu CPF e número de protocolo (se houver).",
          informacoesNecessarias: [
            "Descrição da dúvida ou solicitação",
            "CPF (para identificação)",
            "Número de protocolo (se for acompanhamento)"
          ],
          tempoAtendimento: "Atendimento imediato por telefone",
          legislacao: [
            "Lei Federal nº 14.129/2021 (Governo Digital)",
            "Lei Federal nº 12.527/2011 (Lei de Acesso à Informação)"
          ]
        },
        fields: [
          { id: "description", name: "description", label: "Sua dúvida ou solicitação", type: "textarea", required: true, placeholder: "Descreva o que deseja saber ou solicitar" },
          { id: "phone", name: "phone", label: "Telefone para retorno", type: "phone", required: false }
        ]
      }
    ]
  },

  // =========================================================================
  // 25. Trabalho e Emprego
  // =========================================================================
  {
    id: "trabalho-emprego",
    name: "Trabalho e Emprego",
    icon: "Briefcase",
    slug: "trabalho-emprego",
    description: "Serviços de emprego, qualificação profissional e direitos trabalhistas",
    services: [
      {
        id: "vagas-emprego",
        name: "Vagas de Emprego",
        slug: "vagas-emprego",
        categoryId: "trabalho-emprego",
        description: "Consulta de vagas de emprego disponíveis no município",
        requiresAuth: false,
        detailedInfo: {
          oQueE: "Serviço de divulgação de vagas de emprego disponíveis no município de Belford Roxo e região, em parceria com empresas locais e o Sistema Nacional de Emprego (SINE). O serviço inclui encaminhamento para entrevistas.",
          paraQueServe: "Facilitar o acesso dos trabalhadores desempregados ou em busca de recolocação profissional às vagas de emprego disponíveis, promovendo a intermediação entre empresas e candidatos.",
          quemPodeSolicitar: "Qualquer cidadão em idade laboral que esteja em busca de emprego.",
          informacoesComplementares: "As vagas são atualizadas diariamente. O cadastro no SINE é gratuito e pode ser feito presencialmente no Posto de Atendimento ao Trabalhador de Belford Roxo.",
          informacoesNecessarias: [
            "Nome completo",
            "CPF",
            "Carteira de trabalho (número e série)",
            "Área de interesse profissional",
            "Experiência profissional",
            "Escolaridade"
          ],
          tempoAtendimento: "Cadastro imediato; encaminhamento conforme disponibilidade de vagas",
          legislacao: [
            "Lei Federal nº 7.998/1990 (Seguro-Desemprego e SINE)",
            "Constituição Federal - Art. 7º (Direitos dos Trabalhadores)"
          ]
        },
        fields: [
          { id: "cpf", name: "cpf", label: "CPF", type: "cpf", required: true },
          { id: "area_interesse", name: "area_interesse", label: "Área de interesse", type: "text", required: true, placeholder: "Ex: Administrativo, Comércio, Construção Civil" },
          { id: "description", name: "description", label: "Experiência profissional", type: "textarea", required: false, placeholder: "Descreva brevemente sua experiência" },
          { id: "phone", name: "phone", label: "Telefone", type: "phone", required: true }
        ]
      },
      {
        id: "qualificacao-profissional",
        name: "Cursos de Qualificação Profissional",
        slug: "qualificacao-profissional",
        categoryId: "trabalho-emprego",
        description: "Inscrição em cursos gratuitos de qualificação profissional",
        requiresAuth: false,
        detailedInfo: {
          oQueE: "Serviço de inscrição em cursos gratuitos de qualificação profissional oferecidos pela Prefeitura de Belford Roxo, em parceria com o SENAI, SENAC, SEBRAE e outras instituições, visando a capacitação de trabalhadores.",
          paraQueServe: "Capacitar os trabalhadores de Belford Roxo para o mercado de trabalho, aumentando suas chances de empregabilidade ou de empreender seu próprio negócio.",
          quemPodeSolicitar: "Cidadãos residentes em Belford Roxo maiores de 16 anos.",
          informacoesComplementares: "Os cursos são gratuitos e com certificação. As vagas são limitadas e distribuídas conforme critérios socioeconômicos. Alguns cursos podem exigir escolaridade mínima.",
          informacoesNecessarias: [
            "Nome completo",
            "CPF",
            "Data de nascimento",
            "Endereço",
            "Escolaridade",
            "Curso de interesse"
          ],
          tempoAtendimento: "Inscrição imediata; confirmação conforme abertura de turmas",
          legislacao: [
            "Lei Federal nº 12.513/2011 (PRONATEC)",
            "Plano Nacional de Qualificação Profissional"
          ]
        },
        fields: [
          { id: "cpf", name: "cpf", label: "CPF", type: "cpf", required: true },
          { id: "curso_interesse", name: "curso_interesse", label: "Curso de interesse", type: "select", required: true, options: [
            { value: "informatica", label: "Informática Básica" },
            { value: "eletrica", label: "Elétrica Residencial" },
            { value: "culinaria", label: "Culinária e Panificação" },
            { value: "beleza", label: "Cabeleireiro e Estética" },
            { value: "construcao", label: "Construção Civil" },
            { value: "administracao", label: "Administração e Gestão" },
            { value: "empreendedorismo", label: "Empreendedorismo" },
            { value: "logistica", label: "Logística" }
          ]},
          { id: "address", name: "address", label: "Endereço", type: "address", required: true },
          { id: "phone", name: "phone", label: "Telefone", type: "phone", required: true }
        ]
      },
      {
        id: "carteira-trabalho",
        name: "Carteira de Trabalho Digital",
        slug: "carteira-trabalho",
        categoryId: "trabalho-emprego",
        description: "Orientação sobre emissão da Carteira de Trabalho Digital",
        requiresAuth: false,
        detailedInfo: {
          oQueE: "Serviço de orientação e auxílio para emissão da Carteira de Trabalho e Previdência Social (CTPS) digital no município de Belford Roxo. A CTPS digital substituiu a versão física e pode ser acessada pelo aplicativo ou site do governo federal.",
          paraQueServe: "Orientar o cidadão sobre como acessar sua Carteira de Trabalho Digital, consultar vínculos empregatícios, verificar dados do FGTS e outros direitos trabalhistas.",
          quemPodeSolicitar: "Qualquer cidadão brasileiro ou estrangeiro com visto de trabalho.",
          informacoesComplementares: "A CTPS Digital é acessada pelo app 'Carteira de Trabalho Digital' ou pelo site gov.br. É necessário ter conta no gov.br. Para dúvidas, procure o Posto de Atendimento ao Trabalhador.",
          informacoesNecessarias: [
            "CPF",
            "Documento de identidade",
            "Data de nascimento"
          ],
          tempoAtendimento: "Orientação imediata",
          legislacao: [
            "Lei Federal nº 13.874/2019 (Declaração de Direitos de Liberdade Econômica)",
            "CLT - Consolidação das Leis do Trabalho"
          ]
        },
        fields: [
          { id: "cpf", name: "cpf", label: "CPF", type: "cpf", required: true },
          { id: "description", name: "description", label: "Sua dúvida", type: "textarea", required: true, placeholder: "Descreva sua dúvida sobre a Carteira de Trabalho Digital" }
        ]
      }
    ]
  },

  // =========================================================================
  // 26. Transporte
  // =========================================================================
  {
    id: "transporte",
    name: "Transporte",
    icon: "Bus",
    slug: "transporte",
    description: "Serviços de transporte público, passe livre e acessibilidade no transporte",
    services: [
      {
        id: "reclamacao-transporte",
        name: "Reclamação de Transporte Público",
        slug: "reclamacao-transporte",
        categoryId: "transporte",
        description: "Reclamação sobre o serviço de transporte público municipal",
        requiresAuth: false,
        detailedInfo: {
          oQueE: "Serviço para registro de reclamações sobre o transporte público municipal de Belford Roxo, incluindo atrasos, superlotação, condições dos veículos, mau atendimento de motoristas e cobradores, e irregularidades nas linhas.",
          paraQueServe: "Permitir que os usuários do transporte público relatem problemas e contribuam para a melhoria do serviço, possibilitando a fiscalização e aplicação de penalidades às empresas concessionárias.",
          quemPodeSolicitar: "Qualquer cidadão usuário do transporte público municipal.",
          informacoesComplementares: "Forneça o máximo de detalhes possível, como número da linha, horário, sentido (ida/volta) e, se possível, o número do veículo (afixado na lateral do ônibus).",
          informacoesNecessarias: [
            "Linha do ônibus",
            "Número do veículo (se possível)",
            "Data e horário da ocorrência",
            "Ponto de ônibus ou trecho",
            "Descrição detalhada do problema"
          ],
          tempoAtendimento: "Até 10 dias úteis para análise e resposta",
          legislacao: [
            "Lei Federal nº 12.587/2012 (Política Nacional de Mobilidade Urbana)",
            "Contrato de Concessão do Transporte Público Municipal"
          ]
        },
        fields: [
          { id: "linha", name: "linha", label: "Linha do ônibus", type: "text", required: true },
          { id: "description", name: "description", label: "Descrição da reclamação", type: "textarea", required: true, placeholder: "Descreva o problema detalhadamente" },
          { id: "date", name: "date", label: "Data da ocorrência", type: "date", required: false },
          { id: "address", name: "address", label: "Local/ponto de ônibus", type: "address", required: false }
        ]
      },
      {
        id: "passe-livre-estudantil",
        name: "Passe Livre Estudantil",
        slug: "passe-livre-estudantil",
        categoryId: "transporte",
        description: "Solicitação de passe livre ou meia-passagem para estudantes",
        requiresAuth: true,
        detailedInfo: {
          oQueE: "Serviço de solicitação de passe livre ou meia-passagem no transporte público para estudantes da rede pública e particular de ensino residentes em Belford Roxo.",
          paraQueServe: "Garantir o acesso ao transporte público para estudantes, reduzindo os custos de deslocamento entre a residência e a instituição de ensino.",
          quemPodeSolicitar: "Estudantes regularmente matriculados em instituições de ensino fundamental, médio, técnico ou superior, residentes em Belford Roxo.",
          informacoesComplementares: "O benefício é válido nos dias letivos e no trajeto residência-escola. É necessário renovar a cada semestre ou ano letivo. O cartão é pessoal e intransferível.",
          informacoesNecessarias: [
            "Nome completo do estudante",
            "CPF",
            "Comprovante de matrícula atualizado",
            "Comprovante de residência",
            "Foto 3x4 recente",
            "Documento de identidade"
          ],
          tempoAtendimento: "Até 15 dias úteis para emissão do cartão",
          legislacao: [
            "Lei Federal nº 12.587/2012 (Mobilidade Urbana)",
            "Lei Municipal de Transporte Escolar"
          ]
        },
        fields: [
          { id: "cpf", name: "cpf", label: "CPF do estudante", type: "cpf", required: true },
          { id: "escola", name: "escola", label: "Instituição de ensino", type: "text", required: true },
          { id: "address", name: "address", label: "Endereço residencial", type: "address", required: true },
          { id: "attachment", name: "attachment", label: "Comprovante de matrícula e foto 3x4", type: "file", required: true }
        ]
      },
      {
        id: "transporte-adaptado",
        name: "Transporte Adaptado",
        slug: "transporte-adaptado",
        categoryId: "transporte",
        description: "Solicitação de transporte adaptado para pessoas com deficiência",
        requiresAuth: true,
        detailedInfo: {
          oQueE: "Serviço de transporte adaptado gratuito para pessoas com deficiência física grave ou mobilidade reduzida que não conseguem utilizar o transporte público convencional no município de Belford Roxo.",
          paraQueServe: "Garantir o direito de ir e vir de pessoas com deficiência que necessitam de veículos adaptados para se deslocarem a hospitais, centros de reabilitação, escolas e outros compromissos essenciais.",
          quemPodeSolicitar: "Pessoas com deficiência física grave ou mobilidade reduzida, mediante laudo médico.",
          informacoesComplementares: "O serviço é agendado com antecedência mínima de 48 horas. A disponibilidade depende da frota municipal. Prioridade para deslocamentos de saúde e educação.",
          informacoesNecessarias: [
            "Nome completo",
            "CPF",
            "Laudo médico comprovando a deficiência",
            "Endereço de origem e destino",
            "Data e horário desejados",
            "Se necessita de acompanhante"
          ],
          tempoAtendimento: "Agendamento com 48 horas de antecedência",
          legislacao: [
            "Lei Federal nº 13.146/2015 (Estatuto da Pessoa com Deficiência)",
            "Lei Federal nº 12.587/2012 (Mobilidade Urbana)"
          ]
        },
        fields: [
          { id: "cpf", name: "cpf", label: "CPF", type: "cpf", required: true },
          { id: "description", name: "description", label: "Motivo do transporte e destino", type: "textarea", required: true, placeholder: "Descreva o motivo e o destino do deslocamento" },
          { id: "date", name: "date", label: "Data desejada", type: "date", required: true },
          { id: "address", name: "address", label: "Endereço de origem", type: "address", required: true },
          { id: "attachment", name: "attachment", label: "Laudo médico", type: "file", required: true }
        ]
      }
    ]
  },

  // =========================================================================
  // 27. Trânsito
  // =========================================================================
  {
    id: "transito",
    name: "Trânsito",
    icon: "Car",
    slug: "transito",
    description: "Serviços relacionados ao trânsito e sinalização viária",
    services: [
      {
        id: "semaforo-defeito",
        name: "Semáforo com Defeito",
        slug: "semaforo-defeito",
        categoryId: "transito",
        description: "Solicitação de reparo de semáforo",
        requiresAuth: false,
        detailedInfo: {
          oQueE: "Serviço para relatar semáforos com defeito, apagados, com lâmpadas queimadas ou com sincronização incorreta em vias de Belford Roxo.",
          paraQueServe: "Garantir o funcionamento adequado da sinalização semafórica para a segurança de motoristas e pedestres.",
          quemPodeSolicitar: "Qualquer cidadão pode relatar um semáforo com defeito.",
          informacoesComplementares: "Enquanto o semáforo não for reparado, respeite a sinalização de parada obrigatória e dê preferência aos veículos que já estejam no cruzamento.",
          informacoesNecessarias: [
            "Endereço exato do semáforo (cruzamento)",
            "Descrição do defeito",
            "Horário em que foi observado o problema"
          ],
          tempoAtendimento: "Até 24 horas",
          legislacao: [
            "Código de Trânsito Brasileiro",
            "Resolução CONTRAN nº 483/2014"
          ]
        },
        fields: [
          { id: "description", name: "description", label: "Descrição do problema", type: "textarea", required: true, placeholder: "Descreva o defeito do semáforo" },
          { id: "address", name: "address", label: "Localização do semáforo", type: "address", required: true }
        ]
      },
      {
        id: "sinalizacao",
        name: "Sinalização de Trânsito",
        slug: "sinalizacao",
        categoryId: "transito",
        description: "Problemas com sinalização de trânsito",
        requiresAuth: false,
        detailedInfo: {
          oQueE: "Serviço para relatar problemas com placas de sinalização de trânsito em Belford Roxo, como placas danificadas, faltando ou com informações incorretas.",
          paraQueServe: "Manter a sinalização de trânsito em boas condições para orientar motoristas e garantir a segurança viária em todo o município.",
          quemPodeSolicitar: "Qualquer cidadão pode relatar problemas com sinalização de trânsito.",
          informacoesComplementares: "Inclua fotos para facilitar a identificação do problema e agilizar o atendimento.",
          informacoesNecessarias: [
            "Endereço ou localização",
            "Tipo de placa ou sinalização",
            "Descrição do problema",
            "Fotos"
          ],
          tempoAtendimento: "Até 15 dias úteis",
          legislacao: [
            "Código de Trânsito Brasileiro",
            "Manual Brasileiro de Sinalização de Trânsito"
          ]
        },
        fields: [
          { id: "description", name: "description", label: "Descrição", type: "textarea", required: true, placeholder: "Descreva o problema com a sinalização" },
          { id: "address", name: "address", label: "Local", type: "address", required: true },
          { id: "attachment", name: "attachment", label: "Fotos", type: "file", required: false }
        ]
      }
    ]
  }
];

// =============================================================================
// Dados para FAQ
// =============================================================================
export const faqData: FAQ[] = [
  {
    id: "1",
    question: "Como faço para abrir uma solicitação?",
    answer: "Para abrir uma solicitação, navegue até a categoria desejada, selecione o serviço e preencha o formulário. Você receberá um número de protocolo para acompanhamento.",
    categoryId: "geral",
    order: 1
  },
  {
    id: "2",
    question: "Preciso me cadastrar para usar o portal?",
    answer: "Não é necessário cadastro para a maioria das solicitações. Porém, algumas funcionalidades como acompanhamento de solicitações e histórico requerem login.",
    categoryId: "geral",
    order: 2
  },
  {
    id: "3",
    question: "Como consulto minha solicitação?",
    answer: "Acesse 'Consulta Protocolo' no menu superior e informe seu número de protocolo para ver o status atualizado.",
    categoryId: "geral",
    order: 3
  },
  {
    id: "4",
    question: "Quanto tempo leva para minha solicitação ser atendida?",
    answer: "O prazo varia de acordo com o tipo de serviço e a complexidade da demanda. Cada solicitação tem um prazo estimado informado no momento da abertura.",
    categoryId: "geral",
    order: 4
  },
  {
    id: "5",
    question: "Posso fazer uma denúncia anônima?",
    answer: "Sim, você pode optar por fazer denúncias de forma anônima. Seus dados não serão vinculados à solicitação.",
    categoryId: "geral",
    order: 5
  },
  {
    id: "6",
    question: "Como funciona o Procon de Belford Roxo?",
    answer: "O Procon Municipal recebe reclamações de consumidores, realiza mediação entre as partes e pode agendar audiências de conciliação. O serviço é gratuito e pode ser acessado pelo portal ou presencialmente.",
    categoryId: "geral",
    order: 6
  },
  {
    id: "7",
    question: "O que é a LGPD e como a prefeitura trata meus dados?",
    answer: "A Lei Geral de Proteção de Dados (LGPD) garante seus direitos sobre seus dados pessoais. A Prefeitura de Belford Roxo trata seus dados conforme a lei, e você pode solicitar acesso ou exclusão pelo portal.",
    categoryId: "geral",
    order: 7
  },
  {
    id: "8",
    question: "Como emitir a segunda via do IPTU?",
    answer: "Acesse a categoria 'IPTU, Dívida Ativa e Nota Fiscal', selecione 'Segunda Via de IPTU' e informe a inscrição imobiliária e o CPF do proprietário para emitir o boleto.",
    categoryId: "geral",
    order: 8
  }
];

// =============================================================================
// Dados para Notícias
// =============================================================================
export const newsData: News[] = [
  {
    id: "1",
    title: "Prefeitura lança novo canal de atendimento 2909",
    slug: "prefeitura-lanca-novo-canal-atendimento-2909",
    excerpt: "O novo portal facilita o acesso aos serviços municipais e permite acompanhamento de solicitações online.",
    content: "A Prefeitura de Belford Roxo lançou hoje o novo portal de atendimento ao cidadão 2909...",
    image: "/images/news/portal-2909.jpg",
    category: "Institucional",
    publishedAt: new Date("2025-01-15"),
    author: "Secretaria de Comunicação"
  },
  {
    id: "2",
    title: "Mutirão de limpeza atende bairros da zona norte",
    slug: "mutirao-limpeza-zona-norte",
    excerpt: "Ação especial de limpeza urbana acontece durante toda a semana nos bairros da zona norte.",
    content: "A Secretaria de Conservação e Limpeza Urbana iniciou um grande mutirão...",
    category: "Serviços",
    publishedAt: new Date("2025-01-10"),
    author: "Secretaria de Conservação"
  },
  {
    id: "3",
    title: "Novos cursos de qualificação profissional com inscrições abertas",
    slug: "novos-cursos-qualificacao-profissional",
    excerpt: "A Secretaria de Trabalho e Emprego abre inscrições para cursos gratuitos de qualificação profissional em diversas áreas.",
    content: "A Prefeitura de Belford Roxo, por meio da Secretaria de Trabalho e Emprego, abriu inscrições para novos cursos de qualificação profissional...",
    category: "Trabalho",
    publishedAt: new Date("2025-02-01"),
    author: "Secretaria de Trabalho e Emprego"
  },
  {
    id: "4",
    title: "Portal 2909 agora conta com mais de 70 serviços digitais",
    slug: "portal-2909-mais-de-70-servicos",
    excerpt: "Expansão do portal inclui novas categorias como LGBTQIA+, Proteção de Dados e Procon.",
    content: "O Portal 2909 de Belford Roxo foi ampliado e agora oferece mais de 70 serviços digitais em 27 categorias...",
    category: "Institucional",
    publishedAt: new Date("2025-02-10"),
    author: "Secretaria de Comunicação"
  }
];

// =============================================================================
// Funções auxiliares
// =============================================================================
export function getCategoryBySlug(slug: string): ServiceCategory | undefined {
  return serviceCategories.find(cat => cat.slug === slug);
}

export function getServiceBySlug(categorySlug: string, serviceSlug: string) {
  const category = getCategoryBySlug(categorySlug);
  return category?.services.find(service => service.slug === serviceSlug);
}

export function getAllServices() {
  return serviceCategories.flatMap(cat => cat.services);
}

export function searchServices(query: string) {
  const lowerQuery = query.toLowerCase();
  return getAllServices().filter(
    service =>
      service.name.toLowerCase().includes(lowerQuery) ||
      service.description.toLowerCase().includes(lowerQuery)
  );
}
