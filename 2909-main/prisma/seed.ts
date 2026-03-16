// =============================================================================
// Seed do Banco de Dados - Portal 2909
// Prefeitura Municipal de Belford Roxo
// =============================================================================

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...\n");

  // =========================================================================
  // 1. ADMIN PADRÃO
  // =========================================================================
  console.log("👤 Criando usuário administrador...");
  const adminPassword = await bcrypt.hash("12345", 12);

  const admin = await prisma.user.upsert({
    where: { cpf: "10746426780" },
    update: {},
    create: {
      name: "Administrador do Sistema",
      email: "admin@belfordroxo.rj.gov.br",
      cpf: "10746426780",
      phone: "2126662909",
      passwordHash: adminPassword,
      role: "ADMIN",
      isActive: true,
      emailVerified: true,
    },
  });
  console.log(`  ✅ Admin criado: ${admin.email} (CPF: 107.464.267-80 / Senha: 12345)`);

  // =========================================================================
  // 2. SECRETARIAS MUNICIPAIS DE BELFORD ROXO
  // =========================================================================
  console.log("\n🏛️  Criando secretarias municipais...");
  const secretarias = [
    { name: "Secretaria Municipal de Saúde - SEMUS", slug: "semus", email: "saude@belfordroxo.rj.gov.br" },
    { name: "Secretaria Municipal de Educação - SEMED", slug: "semed", email: "educacao@belfordroxo.rj.gov.br" },
    { name: "Secretaria Municipal de Administração - SEMAD", slug: "semad", email: "administracao@belfordroxo.rj.gov.br" },
    { name: "Secretaria Municipal de Governo - SEMUG", slug: "semug", email: "governo@belfordroxo.rj.gov.br" },
    { name: "Secretaria Municipal de Habitação e Urbanismo - SEMHURB", slug: "semhurb", email: "habitacao@belfordroxo.rj.gov.br" },
    { name: "Secretaria Municipal de Serviços Públicos - SEMSERP", slug: "semserp", email: "servicospublicos@belfordroxo.rj.gov.br" },
    { name: "Secretaria Municipal da Mulher - SEMM", slug: "semm", email: "mulher@belfordroxo.rj.gov.br" },
    { name: "Secretaria Municipal de Meio Ambiente e Sustentabilidade - SEMAS", slug: "semas", email: "meioambiente@belfordroxo.rj.gov.br" },
    { name: "Secretaria Municipal de Fazenda - SEMFA", slug: "semfa", email: "fazenda@belfordroxo.rj.gov.br" },
    { name: "Secretaria Municipal de Conservação - SEMCO", slug: "semco", email: "conservacao@belfordroxo.rj.gov.br" },
    { name: "Secretaria Municipal de Assistência Social e Cidadania - SEMASC", slug: "semasc", email: "assistenciasocial@belfordroxo.rj.gov.br" },
    { name: "Secretaria Municipal de Ordem Urbana - SEMOP", slug: "semop", email: "ordemurbana@belfordroxo.rj.gov.br" },
    { name: "Secretaria Municipal de Segurança Pública - SEMSEP", slug: "semsep", email: "seguranca@belfordroxo.rj.gov.br" },
    { name: "Secretaria Municipal de Licitações e Compras - SEMLIC", slug: "semlic", email: "licitacoes@belfordroxo.rj.gov.br" },
    { name: "Secretaria Municipal de Ação Comunitária - SEMAC", slug: "semac", email: "acaocomunitaria@belfordroxo.rj.gov.br" },
    { name: "Secretaria Municipal de Transportes e Mobilidade Urbana - SEMTMU", slug: "semtmu", email: "transportes@belfordroxo.rj.gov.br" },
    { name: "Secretaria Municipal da Casa Civil - SEMCC", slug: "semcc", email: "casacivil@belfordroxo.rj.gov.br" },
    { name: "Secretaria Municipal de Ciência, Tecnologia e Inovação - SEMCTI", slug: "semcti", email: "cienciatecnologia@belfordroxo.rj.gov.br" },
    { name: "Secretaria Municipal de Obras, Infraestrutura e Saneamento - SEMOFS", slug: "semofs", email: "obras@belfordroxo.rj.gov.br" },
    { name: "Secretaria Municipal de Esporte e Lazer - SEMEL", slug: "semel", email: "esporte@belfordroxo.rj.gov.br" },
    { name: "Secretaria Municipal de Comunicação Social - SECOM", slug: "secom", email: "comunicacao@belfordroxo.rj.gov.br" },
    { name: "Secretaria Municipal de Indústria e Comércio - SEMIC", slug: "semic", email: "industria@belfordroxo.rj.gov.br" },
    { name: "Secretaria Municipal de Trabalho e Renda e Economia Solidária - SEMTRES", slug: "semtres", email: "trabalho@belfordroxo.rj.gov.br" },
    { name: "Secretaria Municipal de Defesa Civil - SEMDEC", slug: "semdec", email: "defesacivil@belfordroxo.rj.gov.br" },
    { name: "Secretaria Municipal de Proteção e Defesa dos Animais - SEMPDA", slug: "sempda", email: "protecaoanimal@belfordroxo.rj.gov.br" },
    { name: "Secretaria Municipal de Cultura - SEMC", slug: "semc", email: "cultura@belfordroxo.rj.gov.br" },
    { name: "Secretaria Municipal de Turismo e Eventos - SEMTE", slug: "semte", email: "turismo@belfordroxo.rj.gov.br" },
    { name: "Secretaria Municipal Especial de Administração Financeira", slug: "smeaf", email: "admfinanceira@belfordroxo.rj.gov.br" },
    { name: "Secretaria Municipal de Envelhecimento Saudável e Qualidade de Vida", slug: "smesqv", email: "envelhecimento@belfordroxo.rj.gov.br" },
    { name: "Secretaria Municipal de Agricultura - SEMAG", slug: "semag", email: "agricultura@belfordroxo.rj.gov.br" },
  ];

  const secretariaMap: Record<string, string> = {};
  for (const sec of secretarias) {
    const created = await prisma.department.upsert({
      where: { slug: sec.slug },
      update: { name: sec.name, email: sec.email },
      create: sec,
    });
    secretariaMap[sec.slug] = created.id;
  }
  console.log(`  ✅ ${secretarias.length} secretarias criadas`);

  // =========================================================================
  // 3. CATEGORIAS E SERVIÇOS (mapeados para secretarias)
  // =========================================================================
  console.log("\n📂 Criando categorias e serviços...");

  // Mapeamento: categoria slug -> secretaria slug responsável
  const categoryToSecretaria: Record<string, string> = {
    "acessibilidade": "semofs",
    "animais": "sempda",
    "assistencia-social": "semasc",
    "cidadania-direitos-humanos": "semasc",
    "conservacao": "semco",
    "cultura-esporte-lazer": "semc",
    "defesa-civil": "semdec",
    "educacao": "semed",
    "empresas": "semic",
    "iluminacao": "semserp",
    "iptu-divida-nf": "semfa",
    "lgbtqia": "semasc",
    "limpeza-urbana": "semserp",
    "mulher": "semm",
    "obras-imoveis": "semofs",
    "ordem-publica": "semop",
    "processos-certidoes": "semad",
    "procon": "semasc",
    "protecao-dados": "semcti",
    "saude": "semus",
    "seguranca-publica": "semsep",
    "servidor-publico": "semad",
    "servico-funerario": "semserp",
    "suporte-tecnico": "semcti",
    "trabalho-emprego": "semtres",
    "transporte": "semtmu",
    "transito": "semtmu",
    "meio-ambiente": "semas",
  };

  const categoriesData = [
    {
      name: "Acessibilidade", slug: "acessibilidade", icon: "Accessibility",
      description: "Serviços relacionados à acessibilidade urbana e inclusão de pessoas com deficiência",
      services: [
        { name: "Rampa de Acesso", slug: "rampa-acesso", description: "Solicitação de rampa de acesso em calçadas", slaHours: 240, slaPriority: "LOW" },
        { name: "Vaga para Pessoa com Deficiência", slug: "vaga-deficiente", description: "Solicitação de vaga exclusiva para PcD", slaHours: 240, slaPriority: "LOW" },
        { name: "Piso Tátil", slug: "piso-tatil", description: "Instalação de piso tátil em calçadas", slaHours: 240, slaPriority: "LOW" },
      ],
    },
    {
      name: "Animais", slug: "animais", icon: "PawPrint",
      description: "Proteção animal e controle de zoonoses",
      services: [
        { name: "Resgate de Animais Silvestres", slug: "animais-silvestres", description: "Resgate de animais silvestres em área urbana", slaHours: 48, slaPriority: "HIGH" },
        { name: "Maus Tratos a Animais", slug: "maus-tratos", description: "Denúncia de maus tratos a animais", slaHours: 24, slaPriority: "URGENT" },
        { name: "Vacinação de Animais", slug: "vacinacao-animais", description: "Vacinação antirrábica para cães e gatos", slaHours: 120, slaPriority: "NORMAL" },
      ],
    },
    {
      name: "Assistência Social", slug: "assistencia-social", icon: "Heart",
      description: "Programas sociais e apoio ao cidadão",
      services: [
        { name: "Cadastro Único", slug: "cadastro-unico", description: "Informações sobre o CadÚnico", slaHours: 120, slaPriority: "NORMAL" },
        { name: "Atendimento no CRAS", slug: "cras-atendimento", description: "Proteção social básica às famílias", slaHours: 120, slaPriority: "NORMAL" },
        { name: "Abordagem Social", slug: "abordagem-social", description: "Atendimento a pessoas em situação de rua", slaHours: 24, slaPriority: "URGENT" },
      ],
    },
    {
      name: "Cidadania e Direitos Humanos", slug: "cidadania-direitos-humanos", icon: "Users",
      description: "Defesa dos direitos humanos e cidadania",
      services: [
        { name: "Denúncia de Violação de Direitos", slug: "denuncia-violacao-direitos", description: "Denuncie violações de direitos humanos", slaHours: 48, slaPriority: "HIGH" },
        { name: "Mediação de Conflitos", slug: "mediacao-conflitos", description: "Resolução pacífica de conflitos comunitários", slaHours: 120, slaPriority: "NORMAL" },
        { name: "Proteção ao Idoso", slug: "protecao-idoso", description: "Atendimento especializado para idosos", slaHours: 48, slaPriority: "HIGH" },
      ],
    },
    {
      name: "Conservação", slug: "conservacao", icon: "Wrench",
      description: "Manutenção e conservação de vias, calçadas e espaços públicos",
      services: [
        { name: "Buraco na Rua", slug: "buraco-rua", description: "Reparo de buracos em vias públicas", slaHours: 120, slaPriority: "NORMAL" },
        { name: "Calçada Danificada", slug: "calcada-danificada", description: "Reparo de calçadas quebradas", slaHours: 240, slaPriority: "LOW" },
        { name: "Poda de Árvore", slug: "poda-arvore", description: "Poda de árvores em via pública", slaHours: 240, slaPriority: "LOW" },
      ],
    },
    {
      name: "Cultura, Esporte e Lazer", slug: "cultura-esporte-lazer", icon: "Palette",
      description: "Eventos culturais, programas esportivos e atividades de lazer",
      services: [
        { name: "Agendamento de Espaço Cultural", slug: "agendamento-espaco-cultural", description: "Reserve espaços culturais municipais", slaHours: 120, slaPriority: "NORMAL" },
        { name: "Inscrição em Programa Esportivo", slug: "inscricao-programa-esportivo", description: "Inscrição em atividades esportivas gratuitas", slaHours: 120, slaPriority: "NORMAL" },
        { name: "Eventos Culturais", slug: "eventos-culturais", description: "Informações sobre eventos culturais do município", slaHours: 120, slaPriority: "NORMAL" },
      ],
    },
    {
      name: "Defesa Civil", slug: "defesa-civil", icon: "ShieldAlert",
      description: "Emergências e prevenção de desastres",
      services: [
        { name: "Risco de Deslizamento", slug: "risco-deslizamento", description: "Área com risco de deslizamento de terra", slaHours: 24, slaPriority: "URGENT" },
        { name: "Alagamento", slug: "alagamento", description: "Área alagada ou com risco de alagamento", slaHours: 24, slaPriority: "URGENT" },
        { name: "Árvore Caída", slug: "arvore-caida", description: "Remoção de árvore caída sobre via", slaHours: 24, slaPriority: "URGENT" },
      ],
    },
    {
      name: "Educação", slug: "educacao", icon: "GraduationCap",
      description: "Serviços de educação municipal",
      services: [
        { name: "Matrícula Escolar", slug: "matricula-escolar", description: "Matrícula na rede municipal de ensino", slaHours: 120, slaPriority: "NORMAL" },
        { name: "Transporte Escolar", slug: "transporte-escolar", description: "Transporte escolar gratuito", slaHours: 120, slaPriority: "NORMAL" },
        { name: "Merenda Escolar", slug: "merenda-escolar", description: "Reclamações sobre merenda escolar", slaHours: 48, slaPriority: "HIGH" },
      ],
    },
    {
      name: "Empresas", slug: "empresas", icon: "Building2",
      description: "Serviços para empresas e empreendedores",
      services: [
        { name: "Alvará de Funcionamento", slug: "alvara-funcionamento", description: "Solicitação de alvará de funcionamento", slaHours: 240, slaPriority: "NORMAL" },
        { name: "Consulta de Viabilidade", slug: "consulta-viabilidade", description: "Consulta de viabilidade para abertura de empresa", slaHours: 120, slaPriority: "NORMAL" },
        { name: "Licença Sanitária Empresarial", slug: "licenca-sanitaria-empresa", description: "Licença sanitária para estabelecimentos", slaHours: 240, slaPriority: "NORMAL" },
      ],
    },
    {
      name: "Iluminação Pública", slug: "iluminacao", icon: "Lightbulb",
      description: "Manutenção e instalação de iluminação pública",
      services: [
        { name: "Iluminação Pública", slug: "iluminacao-publica", description: "Reparo de lâmpadas e postes", slaHours: 48, slaPriority: "HIGH" },
        { name: "Nova Iluminação", slug: "nova-iluminacao", description: "Instalação de novo ponto de luz", slaHours: 240, slaPriority: "LOW" },
      ],
    },
    {
      name: "IPTU, Dívida Ativa e Nota Fiscal", slug: "iptu-divida-nf", icon: "Receipt",
      description: "Tributos municipais, dívida ativa e nota fiscal",
      services: [
        { name: "Segunda Via do IPTU", slug: "segunda-via-iptu", description: "Emissão de segunda via do IPTU", slaHours: 48, slaPriority: "NORMAL" },
        { name: "Consulta Dívida Ativa", slug: "consulta-divida-ativa", description: "Consulta e parcelamento de dívida ativa", slaHours: 120, slaPriority: "NORMAL" },
        { name: "Nota Fiscal Eletrônica", slug: "nota-fiscal-eletronica", description: "Emissão e consulta de NFS-e", slaHours: 48, slaPriority: "NORMAL" },
      ],
    },
    {
      name: "LGBTQIA+", slug: "lgbtqia", icon: "Rainbow",
      description: "Serviços de proteção e inclusão da comunidade LGBTQIA+",
      services: [
        { name: "Denúncia de LGBTfobia", slug: "denuncia-lgbtfobia", description: "Denuncie crimes de LGBTfobia", slaHours: 48, slaPriority: "HIGH" },
        { name: "Atendimento Especializado LGBTQIA+", slug: "atendimento-lgbtqia", description: "Apoio psicossocial e jurídico", slaHours: 120, slaPriority: "NORMAL" },
        { name: "Retificação de Nome Social", slug: "retificacao-nome-social", description: "Uso do nome social em serviços municipais", slaHours: 120, slaPriority: "NORMAL" },
      ],
    },
    {
      name: "Limpeza Urbana", slug: "limpeza-urbana", icon: "Trash2",
      description: "Coleta de lixo, varrição e limpeza de logradouros",
      services: [
        { name: "Coleta de Lixo", slug: "coleta-lixo", description: "Problemas com coleta de lixo domiciliar", slaHours: 24, slaPriority: "URGENT" },
        { name: "Descarte Irregular de Lixo", slug: "descarte-irregular", description: "Denúncia de descarte irregular", slaHours: 72, slaPriority: "NORMAL" },
        { name: "Limpeza de Terreno", slug: "limpeza-terreno", description: "Limpeza de terreno baldio", slaHours: 120, slaPriority: "NORMAL" },
      ],
    },
    {
      name: "Mulher", slug: "mulher", icon: "UserCircle",
      description: "Serviços de proteção e apoio à mulher",
      services: [
        { name: "Violência Doméstica", slug: "violencia-domestica", description: "Apoio e orientação em casos de violência doméstica", slaHours: 24, slaPriority: "URGENT" },
        { name: "Atendimento Psicológico", slug: "atendimento-psicologico-mulher", description: "Apoio psicológico para mulheres em situação de vulnerabilidade", slaHours: 48, slaPriority: "HIGH" },
        { name: "Empoderamento Feminino", slug: "empoderamento-feminino", description: "Cursos de capacitação e autonomia", slaHours: 120, slaPriority: "NORMAL" },
      ],
    },
    {
      name: "Meio Ambiente", slug: "meio-ambiente", icon: "TreePine",
      description: "Preservação ambiental e sustentabilidade",
      services: [
        { name: "Poluição Ambiental", slug: "poluicao-ambiental", description: "Denúncia de poluição de rios, solo ou ar", slaHours: 48, slaPriority: "HIGH" },
        { name: "Desmatamento", slug: "desmatamento", description: "Denúncia de desmatamento irregular", slaHours: 48, slaPriority: "HIGH" },
      ],
    },
    {
      name: "Obras e Imóveis", slug: "obras-imoveis", icon: "HardHat",
      description: "Licenciamento de obras e fiscalização de imóveis",
      services: [
        { name: "Alvará de Construção", slug: "alvara-construcao", description: "Licença para construção ou reforma", slaHours: 240, slaPriority: "NORMAL" },
        { name: "Habite-se", slug: "habite-se", description: "Certificado de conclusão de obra", slaHours: 240, slaPriority: "NORMAL" },
        { name: "Denúncia de Obra Irregular", slug: "denuncia-obra-irregular", description: "Denúncia de obra sem licença", slaHours: 120, slaPriority: "HIGH" },
      ],
    },
    {
      name: "Ordem Pública", slug: "ordem-publica", icon: "ShieldCheck",
      description: "Fiscalização, posturas e ordenamento urbano",
      services: [
        { name: "Poluição Sonora", slug: "poluicao-sonora", description: "Excesso de barulho em estabelecimentos", slaHours: 48, slaPriority: "HIGH" },
        { name: "Comércio Irregular", slug: "comercio-irregular", description: "Estabelecimentos irregulares", slaHours: 120, slaPriority: "NORMAL" },
        { name: "Ocupação Irregular de Via", slug: "ocupacao-irregular-via", description: "Ocupação irregular de via pública", slaHours: 120, slaPriority: "NORMAL" },
      ],
    },
    {
      name: "Processos e Certidões", slug: "processos-certidoes", icon: "FileText",
      description: "Certidões, processos administrativos e documentos",
      services: [
        { name: "Certidão Negativa de Débitos", slug: "certidao-negativa-debitos", description: "Emissão de certidão negativa municipal", slaHours: 120, slaPriority: "NORMAL" },
        { name: "Certidão de Uso do Solo", slug: "certidao-uso-solo", description: "Certidão de uso e ocupação do solo", slaHours: 240, slaPriority: "LOW" },
        { name: "Consulta de Processo", slug: "consulta-processo-administrativo", description: "Consulta de processo administrativo", slaHours: 120, slaPriority: "NORMAL" },
      ],
    },
    {
      name: "Procon", slug: "procon", icon: "Scale",
      description: "Defesa do consumidor",
      services: [
        { name: "Reclamação de Consumidor", slug: "reclamacao-consumidor", description: "Registre reclamação contra fornecedor", slaHours: 120, slaPriority: "NORMAL" },
        { name: "Orientação ao Consumidor", slug: "orientacao-consumidor", description: "Orientação sobre direitos do consumidor", slaHours: 120, slaPriority: "NORMAL" },
        { name: "Audiência de Conciliação", slug: "audiencia-conciliacao", description: "Agendamento de audiência de conciliação", slaHours: 240, slaPriority: "NORMAL" },
      ],
    },
    {
      name: "Proteção de Dados", slug: "protecao-dados", icon: "ShieldHalf",
      description: "Lei Geral de Proteção de Dados (LGPD)",
      services: [
        { name: "Acesso a Dados Pessoais", slug: "acesso-dados-pessoais", description: "Solicite acesso aos seus dados pessoais", slaHours: 120, slaPriority: "NORMAL" },
        { name: "Exclusão de Dados", slug: "exclusao-dados", description: "Solicite exclusão de dados pessoais", slaHours: 240, slaPriority: "NORMAL" },
      ],
    },
    {
      name: "Saúde e Vigilância Sanitária", slug: "saude", icon: "Stethoscope",
      description: "Serviços de saúde pública e vigilância sanitária",
      services: [
        { name: "Foco de Dengue", slug: "dengue", description: "Denúncia de foco de dengue", slaHours: 24, slaPriority: "URGENT" },
        { name: "Unidades de Saúde", slug: "unidade-saude", description: "Informações sobre unidades de saúde", slaHours: 120, slaPriority: "NORMAL" },
        { name: "Denúncia Sanitária", slug: "denuncia-sanitaria", description: "Denúncia de irregularidade sanitária", slaHours: 48, slaPriority: "HIGH" },
      ],
    },
    {
      name: "Segurança Pública", slug: "seguranca-publica", icon: "Landmark",
      description: "Guarda Municipal e segurança pública",
      services: [
        { name: "Ronda da Guarda Municipal", slug: "ronda-guarda-municipal", description: "Solicite ronda da Guarda Municipal", slaHours: 24, slaPriority: "HIGH" },
        { name: "Vandalismo ao Patrimônio", slug: "vandalismo-patrimonio", description: "Denuncie vandalismo ao patrimônio público", slaHours: 48, slaPriority: "HIGH" },
      ],
    },
    {
      name: "Servidor Público", slug: "servidor-publico", icon: "Trophy",
      description: "Serviços para servidores municipais",
      services: [
        { name: "Contracheque", slug: "contracheque-servidor", description: "Acesso e dúvidas sobre contracheque", slaHours: 120, slaPriority: "NORMAL" },
        { name: "Licenças e Afastamentos", slug: "licenca-afastamento", description: "Solicitação de licenças", slaHours: 120, slaPriority: "NORMAL" },
        { name: "Recadastramento", slug: "recadastramento-servidor", description: "Recadastramento anual de servidor", slaHours: 120, slaPriority: "NORMAL" },
      ],
    },
    {
      name: "Serviço Funerário", slug: "servico-funerario", icon: "Cross",
      description: "Serviços funerários municipais",
      services: [
        { name: "Serviço Funerário Gratuito", slug: "servico-funerario-gratuito", description: "Serviço funerário social para famílias de baixa renda", slaHours: 24, slaPriority: "URGENT" },
        { name: "Autorização de Sepultamento", slug: "autorizacao-sepultamento", description: "Autorização para sepultamento em cemitério municipal", slaHours: 24, slaPriority: "URGENT" },
      ],
    },
    {
      name: "Suporte Técnico e Teleatendimento", slug: "suporte-tecnico", icon: "Headphones",
      description: "Suporte ao Portal 2909 e teleatendimento",
      services: [
        { name: "Suporte ao Portal 2909", slug: "suporte-portal", description: "Ajuda com o uso do portal", slaHours: 48, slaPriority: "NORMAL" },
        { name: "Teleatendimento 2909", slug: "teleatendimento-2909", description: "Atendimento telefônico geral", slaHours: 48, slaPriority: "NORMAL" },
      ],
    },
    {
      name: "Trabalho e Emprego", slug: "trabalho-emprego", icon: "Briefcase",
      description: "Emprego, qualificação profissional e direitos trabalhistas",
      services: [
        { name: "Vagas de Emprego", slug: "vagas-emprego", description: "Consulte vagas disponíveis", slaHours: 120, slaPriority: "NORMAL" },
        { name: "Qualificação Profissional", slug: "qualificacao-profissional", description: "Cursos gratuitos de capacitação", slaHours: 120, slaPriority: "NORMAL" },
        { name: "Carteira de Trabalho", slug: "carteira-trabalho", description: "Emissão e orientação sobre CTPS", slaHours: 120, slaPriority: "NORMAL" },
      ],
    },
    {
      name: "Transporte", slug: "transporte", icon: "Bus",
      description: "Transporte público e mobilidade urbana",
      services: [
        { name: "Reclamação de Transporte", slug: "reclamacao-transporte", description: "Reclamações sobre transporte público", slaHours: 120, slaPriority: "NORMAL" },
        { name: "Passe Livre Estudantil", slug: "passe-livre-estudantil", description: "Informações sobre passe livre", slaHours: 120, slaPriority: "NORMAL" },
        { name: "Transporte Adaptado", slug: "transporte-adaptado", description: "Transporte para pessoas com deficiência", slaHours: 120, slaPriority: "NORMAL" },
      ],
    },
    {
      name: "Trânsito", slug: "transito", icon: "Car",
      description: "Sinalização e semáforos",
      services: [
        { name: "Semáforo com Defeito", slug: "semaforo-defeito", description: "Semáforos apagados ou com mau funcionamento", slaHours: 24, slaPriority: "URGENT" },
        { name: "Sinalização de Trânsito", slug: "sinalizacao", description: "Placas danificadas ou faltando", slaHours: 120, slaPriority: "NORMAL" },
      ],
    },
  ];

  for (const catData of categoriesData) {
    const secSlug = categoryToSecretaria[catData.slug];
    const departmentId = secSlug ? secretariaMap[secSlug] : undefined;

    const category = await prisma.serviceCategory.upsert({
      where: { slug: catData.slug },
      update: { departmentId: departmentId || null },
      create: {
        name: catData.name,
        slug: catData.slug,
        icon: catData.icon,
        description: catData.description,
        departmentId: departmentId || null,
      },
    });

    for (const svcData of catData.services) {
      const svc = await prisma.service.upsert({
        where: { categoryId_slug: { categoryId: category.id, slug: svcData.slug } },
        update: {},
        create: {
          name: svcData.name,
          slug: svcData.slug,
          description: svcData.description,
          categoryId: category.id,
          slaHours: svcData.slaHours,
          slaPriority: svcData.slaPriority,
        },
      });

      // Atualizar solicitações existentes desta categoria para a secretaria correta
      if (departmentId) {
        await prisma.serviceRequest.updateMany({
          where: { serviceId: svc.id, departmentId: null },
          data: { departmentId },
        });
      }
    }

    if (secSlug) {
      console.log(`  📁 ${catData.name} → ${secretarias.find(s => s.slug === secSlug)?.name?.split(" - ")[0]}`);
    }
  }

  const totalServices = categoriesData.reduce((sum, c) => sum + c.services.length, 0);
  console.log(`  ✅ ${categoriesData.length} categorias e ${totalServices} serviços criados`);

  // =========================================================================
  // 4. CONFIGURAÇÕES
  // =========================================================================
  console.log("\n⚙️  Criando configurações do sistema...");
  const configs = [
    { key: "site.name", value: "Portal 2909", type: "string", group: "general", label: "Nome do portal" },
    { key: "site.phone", value: "2909", type: "string", group: "general", label: "Telefone principal" },
    { key: "site.email", value: "ouvidoriageral@prefeituradebelfordroxo.rj.gov.br", type: "string", group: "general", label: "E-mail de contato" },
    { key: "sla.urgent.hours", value: "24", type: "number", group: "sla", label: "SLA Urgente (horas)" },
    { key: "sla.high.hours", value: "48", type: "number", group: "sla", label: "SLA Alta (horas)" },
    { key: "sla.normal.hours", value: "120", type: "number", group: "sla", label: "SLA Normal (horas)" },
    { key: "sla.low.hours", value: "240", type: "number", group: "sla", label: "SLA Baixa (horas)" },
  ];

  for (const config of configs) {
    await prisma.systemConfig.upsert({
      where: { key: config.key },
      update: {},
      create: config,
    });
  }
  console.log(`  ✅ ${configs.length} configurações criadas`);

  // =========================================================================
  // 5. FAQs
  // =========================================================================
  console.log("\n❓ Criando perguntas frequentes...");
  const faqs = [
    { question: "Como faço uma solicitação?", answer: "Acesse o portal, clique em 'Fazer Solicitação', selecione a categoria e o serviço desejado, preencha os dados e envie.", categoryId: "geral", order: 1 },
    { question: "Preciso me cadastrar?", answer: "Não é obrigatório. Você pode fazer solicitações como anônimo, mas recomendamos o cadastro para acompanhar suas demandas.", categoryId: "geral", order: 2 },
    { question: "Qual o prazo de atendimento?", answer: "O prazo varia conforme o tipo de serviço, podendo ser de 24 horas (urgências) a 10 dias úteis.", categoryId: "geral", order: 3 },
    { question: "Como consultar minha solicitação?", answer: "Acesse 'Consultar Protocolo' no menu principal e insira o número do protocolo recebido.", categoryId: "geral", order: 4 },
    { question: "Meus dados estão seguros?", answer: "Sim. Seguimos a LGPD. Seus dados são utilizados exclusivamente para o atendimento.", categoryId: "seguranca", order: 5 },
    { question: "Para qual secretaria minha solicitação é encaminhada?", answer: "Cada tipo de serviço é automaticamente direcionado à secretaria municipal responsável. Você pode acompanhar pelo número do protocolo.", categoryId: "geral", order: 6 },
  ];

  for (const faq of faqs) {
    await prisma.fAQ.create({ data: faq });
  }
  console.log(`  ✅ ${faqs.length} FAQs criadas`);

  // =========================================================================
  // NOTÍCIAS REAIS DE BELFORD ROXO
  // =========================================================================
  console.log("\n📰 Criando notícias...");

  const noticias = [
    {
      title: "Jornada Pedagógica 2026 reúne profissionais da educação em Belford Roxo",
      slug: "jornada-pedagogica-2026",
      excerpt: "A Secretaria de Educação finalizou a Jornada Pedagógica 2026 com o tema 'Educação que transforma, Esperança que constrói', reunindo coordenadores e agentes de apoio.",
      content: "A Secretaria Municipal de Educação (SEMED) finalizou nesta sexta-feira (06/02) a \"Jornada Pedagógica 2026\" com o tema \"Educação que transforma, Esperança que constrói\". O evento foi realizado em quatro locais durante toda a semana para coordenadores de turno, estimuladores e agentes de apoio da rede municipal de ensino.\n\nA jornada contou com palestras, oficinas e debates sobre as novas diretrizes pedagógicas para o ano letivo de 2026, com foco na inovação educacional e na inclusão digital dos alunos da rede pública municipal.",
      image: null,
      category: "Educação",
      author: "Secretaria de Comunicação",
      isPublished: true,
      publishedAt: new Date("2026-02-06"),
    },
    {
      title: "IPTU 2026: prazo para cota única com 10% de desconto vence dia 10 de fevereiro",
      slug: "iptu-2026-cota-unica-desconto",
      excerpt: "Contribuintes de Belford Roxo podem pagar a cota única do IPTU com desconto de 10% até 10/02. Após essa data, desconto reduz para 5% até março.",
      content: "O prazo para pagar a cota única do IPTU 2026 com desconto de 10% vence na terça-feira, dia 10 de fevereiro. A Secretaria Municipal de Fazenda (SEMFA) informa que após essa data, até 10 de março, o desconto reduz para 5%.\n\nO tributo também pode ser parcelado em até 10 vezes sem desconto, com vencimento todo dia 10 a partir de março. Os contribuintes podem emitir a guia de pagamento pelo site da prefeitura ou nos postos de atendimento.",
      image: null,
      category: "Tributos",
      author: "Secretaria de Comunicação",
      isPublished: true,
      publishedAt: new Date("2026-02-05"),
    },
    {
      title: "Mutirão de limpeza no Gogó da Ema transforma bairro Bom Pastor",
      slug: "mutirao-limpeza-gogo-da-ema",
      excerpt: "Prefeitura realizou mutirão de limpeza no Gogó da Ema, no bairro Bom Pastor, com previsão de inauguração de nova base da PM no local.",
      content: "A Prefeitura de Belford Roxo realizou um grande mutirão de limpeza no Gogó da Ema, no bairro Bom Pastor, nesta quarta-feira (05/02). A ação contou com equipes da Secretaria de Serviços Públicos (SEMSERP) e da Secretaria de Conservação (SEMCO).\n\nAlém da limpeza, está prevista a inauguração de uma nova base da Polícia Militar no local para o próximo sábado (07/02), reforçando a segurança pública na região.",
      image: null,
      category: "Infraestrutura",
      author: "Secretaria de Comunicação",
      isPublished: true,
      publishedAt: new Date("2026-02-05"),
    },
    {
      title: "Operação tapa-buracos avança pela Estrada do China no Wona",
      slug: "operacao-tapa-buracos-estrada-china",
      excerpt: "Equipes da Secretaria de Obras realizam pavimentação e operação tapa-buracos na Estrada do China, beneficiando moradores do Wona.",
      content: "A Secretaria Municipal de Obras, Infraestrutura e Saneamento (SEMOFS) está realizando operação tapa-buracos e pavimentação na Estrada do China, no bairro Wona. O serviço visa melhorar as condições de trafegabilidade para os moradores da região.\n\nA prefeitura segue com o cronograma de recuperação das vias públicas em diversos bairros do município, priorizando as áreas com maior fluxo de veículos e pedestres.",
      image: null,
      category: "Obras",
      author: "Secretaria de Comunicação",
      isPublished: true,
      publishedAt: new Date("2026-02-05"),
    },
    {
      title: "Complexo Comunitário de Santa Teresa é inaugurado com praça e CRAS",
      slug: "complexo-comunitario-santa-teresa",
      excerpt: "Prefeito inaugura Complexo Comunitário no bairro Santa Teresa com praça, academia ao ar livre, pista de caminhada e novo CRAS.",
      content: "O prefeito de Belford Roxo inaugurou na sexta-feira (31/01) o Complexo Comunitário de Santa Teresa, que conta com praça pública, academia ao ar livre, pista de caminhada e um novo Centro de Referência de Assistência Social (CRAS).\n\nO espaço atenderá diretamente os moradores da região com serviços sociais, atividades esportivas e de lazer. A obra faz parte do programa de urbanização e desenvolvimento social do município.",
      image: null,
      category: "Desenvolvimento Social",
      author: "Secretaria de Comunicação",
      isPublished: true,
      publishedAt: new Date("2026-01-31"),
    },
    {
      title: "Programa Sentinela: 200 mil câmeras começam por Belford Roxo e Copacabana",
      slug: "programa-sentinela-cameras-seguranca",
      excerpt: "Governo do Estado lança Programa Sentinela que instalará 200 mil câmeras de segurança, iniciando por Belford Roxo e Copacabana.",
      content: "O Governo do Estado do Rio de Janeiro lançou o Programa Sentinela, que prevê a instalação de 200 mil câmeras de monitoramento em todo o estado. Belford Roxo foi escolhida como uma das primeiras cidades a receber o equipamento, ao lado de Copacabana.\n\nAs câmeras contarão com tecnologia de reconhecimento facial e de placas de veículos, conectadas a um centro integrado de comando. A medida visa reforçar a segurança pública e auxiliar as forças policiais no combate à criminalidade.",
      image: null,
      category: "Segurança",
      author: "Secretaria de Comunicação",
      isPublished: true,
      publishedAt: new Date("2026-01-23"),
    },
    {
      title: "Vacinação antirrábica imuniza mais de mil animais no Bom Pastor",
      slug: "vacinacao-antirrabica-bom-pastor",
      excerpt: "Coordenadoria de Vetores e Zoonoses realizou campanha de vacinação antirrábica no bairro Bom Pastor, imunizando mais de mil animais.",
      content: "A Coordenadoria de Vetores e Zoonoses da Secretaria Municipal de Saúde (SEMUS) realizou no último domingo (02/02) uma campanha de vacinação antirrábica no bairro Bom Pastor. Mais de mil animais entre cães e gatos foram imunizados durante a ação.\n\nA vacinação antirrábica é gratuita e essencial para a prevenção da raiva, doença que pode ser transmitida de animais para humanos. Novas campanhas serão realizadas nos próximos meses em outros bairros do município.",
      image: null,
      category: "Saúde",
      author: "Secretaria de Comunicação",
      isPublished: true,
      publishedAt: new Date("2026-02-02"),
    },
    {
      title: "Prefeito faz balanço positivo do primeiro 'Linha Direta com Canella'",
      slug: "balanco-linha-direta-canella",
      excerpt: "Prefeito de Belford Roxo realiza balanço positivo da primeira edição do programa Linha Direta com Canella, canal direto com a população.",
      content: "O prefeito de Belford Roxo realizou um balanço positivo da primeira edição do programa \"Linha Direta com Canella\", um canal direto de comunicação entre a gestão municipal e a população. Durante o programa, foram recebidas dezenas de demandas dos moradores.\n\nO \"Linha Direta com Canella\" permite que os cidadãos façam solicitações, reclamações e sugestões diretamente ao prefeito, que se compromete a dar encaminhamento às demandas junto às secretarias responsáveis. Novas edições serão realizadas periodicamente.",
      image: null,
      category: "Governo",
      author: "Secretaria de Comunicação",
      isPublished: true,
      publishedAt: new Date("2026-01-26"),
    },
    {
      title: "Terreno público retomado no Centro para criação de área de lazer",
      slug: "terreno-retomado-centro-area-lazer",
      excerpt: "Prefeitura retoma terreno público no Centro de Belford Roxo para criação de nova área de lazer na região do Guaraciaba.",
      content: "A Prefeitura de Belford Roxo retomou um terreno público no Centro do município que será transformado em uma nova área de lazer para a comunidade da região do Guaraciaba.\n\nO espaço receberá praça com brinquedos, bancos, iluminação LED e paisagismo. A previsão é que as obras comecem ainda no primeiro trimestre de 2026, beneficiando os moradores da área central da cidade.",
      image: null,
      category: "Urbanismo",
      author: "Secretaria de Comunicação",
      isPublished: true,
      publishedAt: new Date("2026-01-30"),
    },
  ];

  for (const noticia of noticias) {
    await prisma.news.upsert({
      where: { slug: noticia.slug },
      update: noticia,
      create: noticia,
    });
  }
  console.log(`  ✅ ${noticias.length} notícias criadas`);

  // =========================================================================
  console.log("\n🎉 Seed concluído com sucesso!\n");
  console.log("🔑 Credenciais do admin:");
  console.log("   CPF: 107.464.267-80");
  console.log("   Senha: 12345");
  console.log("   URL: http://localhost:3000/admin");
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error("❌ Erro no seed:", e); await prisma.$disconnect(); process.exit(1); });
