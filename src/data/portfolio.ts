import AvatarContato from '/assets/avatar/avatar-contato.webp';
import AvatarResumo from '/assets/avatar/avatar-resumo.webp';
import AvatarPremio from '/assets/avatar/avatar-premio.webp';
import AvatarProjetos from '/assets/avatar/avatar-projeto.webp';
import StickerConcentrado from '/assets/stickers/desenvolvendo-concentrado.webp';
import StickerCafe from '/assets/stickers/cafe.webp';
import StickerForte from '/assets/stickers/forte.webp';
import StickerJoinha from '/assets/stickers/joinha.webp';
import StickerParabens from '/assets/stickers/parabens.webp';

const getAge = (birthDateString: string): number => {
  const today = new Date();
  const birthDate = new Date(birthDateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const myAge = getAge('1995-10-09');

export interface OgCard {
  title: string;
  description: string;
  image?: string;
  url: string;
  domain: string;
}

export type MessageType = 'text' | 'iframe' | 'ogCard' | 'sticker';

export interface BaseMessage {
  id: number;
  sender: 'me' | 'visitor';
  time: string;
  type: MessageType;
}

export interface TextMessage extends BaseMessage {
  type: 'text';
  text: string;
}

export interface IframeMessage extends BaseMessage {
  type: 'iframe';
  text: string;
  iframe: string;
}

export interface OgCardMessage extends BaseMessage {
  type: 'ogCard';
  text: string;
  ogCard: OgCard;
}

export interface StickerMessage extends BaseMessage {
  type: 'sticker';
  text?: string;
  sticker?: string;
}

export type Message = TextMessage | IframeMessage | OgCardMessage | StickerMessage;

export interface Tab {
  id: string;
  title: string;
  avatarText: string;
  avatarImage?: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  isRead?: boolean;
  isActive?: boolean;
  messages: Message[];
}

export const portfolioData: Tab[] = [
  {
    id: 'resumo',
    title: 'Resumo Profissional',
    avatarText: 'RP',
    avatarImage: AvatarResumo,
    lastMessage: 'Especialista TVCA e Cofundador Sitemakers.',
    time: 'Agora',
    unreadCount: 4,
    isRead: false,
    messages: [
      { type: 'text', id: 1, text: 'Olá, Lucas! Pode me contar um pouco sobre sua trajetória e foco atual?', sender: 'visitor', time: '10:00' },
      { type: 'text', id: 2, text: `Olá! Sou Desenvolvedor Web, Engenheiro da Computação (UNIC) e Especialista em Soluções Digitais. Tenho ${myAge} anos e o meu foco é transformar ideias em produtos digitais que geram resultados mensuráveis.`, sender: 'me', time: '10:01' },
      { type: 'text', id: 3, text: 'Atualmente sou Especialista de Desenvolvimento na TVCA, onde aplico minha experiência em desenvolvimento de aplicações frontend e backend com Vue JS, Laravel, WordPress e React para unir performance técnica e visão estratégica de negócios.', sender: 'me', time: '10:02' },
      { type: 'text', id: 4, text: 'Também sou cofundador da Sitemakers, agência especializada em criação de sites profissionais, SEO, otimização de performance e conversão digital.', sender: 'me', time: '10:02' },
      { type: 'text', id: 5, text: 'Minhas principais competências incluem a criação de aplicações web, otimização de performance (Core Web Vitals), implementação de estratégias baseadas em dados e integração de inteligência artificial em processos de negócio.', sender: 'me', time: '10:03' },
      { type: 'text', id: 6, text: 'Meus projetos aumentam a geração de leads qualificados e reduzem custos operacionais com soluções sob medida. Me preocupo em manter código limpo, documentado e fácil de evoluir.', sender: 'me', time: '10:04' },
      { type: 'text', id: 7, text: 'Se você acredita que tecnologia é motor de crescimento, vamos conversar!', sender: 'me', time: '10:05' },
      { type: 'sticker', id: 8, text: 'Trabalhando...', sender: 'me', time: '10:05', sticker: StickerConcentrado },
      {
        type: 'ogCard',
        id: 9,
        text: 'Se quiser ver tudo isso de forma mais resumida, você pode baixar o meu currículo completo no PDF',
        sender: 'me',
        time: '10:06',
        ogCard: {
          title: 'Curriculo_Lucas_Levino.pdf',
          description: 'Documento PDF',
          url: '/assets/file/curriculo.pdf',
          domain: 'Download Seguro'
        }
      }
    ]
  },
  {
    id: 'projetos',
    title: 'Trajetória & Projetos',
    avatarText: 'PR',
    avatarImage: AvatarProjetos,
    lastMessage: 'Vtex, Lab Metrics, Webgru, TVCA...',
    unreadCount: 1,
    time: '12:00',
    isRead: false,
    messages: [
      { type: 'text', id: 1, text: 'Como foi a sua evolução profissional e quais projetos destacam sua experiência?', sender: 'visitor', time: '11:58' },
      { type: 'text', id: 2, text: 'Comecei em 2019 na Óticas Paris Vision, administrando e-commerce e integrações com marketplaces via VTEX. Em 2020, fui para a Lab Metrics como Dev Frontend & Mobile, e em seguida atuei na Webgru, até assumir como Especialista na TVCA em 2022.', sender: 'me', time: '11:59' },
      { type: 'text', id: 3, text: 'Toda essa bagagem virou desafios reais, como evoluir o MVP para a plataforma SaaS "Eventmakers" (Laravel/Vue 3) e desenvolver na Sitemakers e em agências parceiras.', sender: 'me', time: '12:00' },
      { type: 'iframe',
        id: 4,
        text: 'Este é o Design & Front-End que desenvolvi (WordPress) para a New Intercâmbios.',
        sender: 'me',
        time: '12:01',
        iframe: 'https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2F5u3Y4OYduTuFRxQapcjtul%2FNew%3Fnode-id%3D79%253A323%26viewport%3D1167%252C554%252C0.10126150399446487%26scaling%3Dscale-down-width'
      },
      { type: 'iframe',
        id: 5,
        text: 'Este é o site em WordPress que desenvolvi para a agência de branding Martinelli.',
        sender: 'me',
        time: '12:02',
        iframe: 'https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FNVu9euClCofh5lmIiWSYM9%2FRafa-M.%3Fnode-id%3D63%253A28%26viewport%3D771%252C37%252C0.11810070276260376%26scaling%3Dscale-down-width'
      },
      { type: 'iframe',
        id: 6,
        text: 'Este é o aplicativo para gerenciamento de pauta da agência Anna+, construído com ReactJS e Flutter (uso interno).',
        sender: 'me',
        time: '12:03',
        iframe: 'https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2F6seYhAgiG5YUG4InL0ltNp%2FAnna-Jobs%3Fnode-id%3D104%253A717'
      },
      { type: 'iframe',
        id: 7,
        text: 'Aqui temos o Front-End (WordPress) que desenvolvi para a instituição Educare-MT.',
        sender: 'me',
        time: '12:04',
        iframe: 'https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2F938eQAdEw80PEa0A8O9oj9%2FEducare%3Fnode-id%3D231%253A5%26viewport%3D800%252C414%252C0.19536884129047394%26scaling%3Dscale-down-width'
      },
      { type: 'iframe',
        id: 8,
        text: 'E, por fim, o protótipo de design feito para a Delta Seguros.',
        sender: 'me',
        time: '12:05',
        iframe: 'https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FRMoTZCqQQK96V3aZvPUSP8%2FDelta%3Fnode-id%3D14%253A1518%26viewport%3D800%252C414%252C0.19536884129047394%26scaling%3Dscale-down-width'
      }
    ]
  },
  {
    id: 'premios',
    title: 'Prêmios & Destaques',
    avatarText: '🏆', 
    avatarImage: AvatarPremio,
    lastMessage: '1º lugar no Prêmio de Jornalismo de MT',
    unreadCount: 1,
    time: 'Ontem',
    isRead: false,
    messages: [
      { type: 'text', id: 1, text: 'Com toda essa bagagem, você teve algum reconhecimento ou premiação de destaque recentemente?', sender: 'visitor', time: '15:00' },
      { type: 'text', id: 2, text: 'Sim! Em dezembro de 2025, eu e a Pollyana Araújo conquistamos o 1º lugar no 1° Prêmio de Jornalismo do Governo de Mato Grosso, na categoria Internet.', sender: 'me', time: '15:01' },
      { type: 'text', id: 3, text: 'A matéria premiada foi a "Receita de coragem: Empreendedores encontram em MT solo fértil para abrir o próprio negócio", publicada no Portal Primeira Página.', sender: 'me', time: '15:02' },
      { type: 'iframe',
        id: 4,
        text: 'Fiquei muito feliz com esse reconhecimento.',
        sender: 'me',
        time: '15:03',
        iframe: 'https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7407825424539447296?collapsed=1'
      },
      { type: 'sticker', id: 5, text: '', sender: 'me', time: '15:04', sticker: StickerParabens }
    ]
  },
  {
    id: 'skills',
    title: 'Stack & Ferramentas',
    avatarText: 'ST',
    avatarImage: StickerForte,
    lastMessage: 'Clean Code, Core Web Vitals, React, Vue, IA...',
    time: 'Ontem',
    messages: [
      { type: 'text', id: 1, text: 'Como é o seu ecossistema de desenvolvimento no dia a dia?', sender: 'visitor', time: '14:00' },
      { type: 'text', id: 2, text: '🚀 Frontend & Mobile: React.js, Vue 3, Flutter e WordPress. Preocupo-me excessivamente em manter um código limpo e documentado, com foco implacável em Core Web Vitals, performance e otimização para SEO.', sender: 'me', time: '14:05' },
      { type: 'text', id: 3, text: '⚙️ Backend & Infra: Laravel e Node.js. Uso PostgreSQL e Redis, sempre orquestrando ambientes com Docker para escalabilidade.', sender: 'me', time: '14:06' },
      { type: 'text', id: 4, text: '📈 Estratégia & Inovação: Aplico inteligência artificial nos processos de negócio e uso dados para melhorar conversão digital.', sender: 'me', time: '14:07' },
      { type: 'sticker', id: 5, text: 'Pausa pro café ☕', sender: 'me', time: '14:08', sticker: StickerCafe }
    ]
  },
  {
    id: 'contato',
    title: 'Contatos & Redes',
    avatarText: 'CT',
    avatarImage: AvatarContato,
    lastMessage: 'lucas_levino@outlook.com | (65) 98435-6877',
    time: 'Semana passada',
    messages: [
      { type: 'text', id: 1, text: 'Excelente perfil! Quais os melhores canais para entrarmos em contato?', sender: 'visitor', time: '16:00' }, 
      { type: 'ogCard', 
        id: 2, 
        text: 'Você pode baixar a versão em PDF do meu currículo clicando no ícone ali no topo da tela, ou direto por este link!', 
        sender: 'me', 
        time: '16:01',
        ogCard: {
          title: 'Curriculo_Lucas_Levino.pdf',
          description: 'Documento PDF',
          url: '/assets/file/curriculo.pdf',
          domain: 'Download Seguro'
        }
      },
      { type: 'ogCard',
        id: 3,
        text: '🔗 Acompanhe minhas reflexões sobre tecnologia e conecte-se comigo no LinkedIn:\nhttps://www.linkedin.com/in/lucas-levino',
        sender: 'me',
        time: '16:03',
        ogCard: {
          title: 'Lucas Levino - Especialista e Arquiteto de Software',
          description: 'Desenvolvedor Full Stack, Cofundador da Sitemakers e Especialista na TVCA. Veja meu perfil profissional e conecte-se.',
          image: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png',
          url: 'https://www.linkedin.com/in/lucas-levino',
          domain: 'linkedin.com'
        }
      },
      { type: 'ogCard',
        id: 4,
        text: '💻 E aqui está o meu repositório de códigos. Fique à vontade para explorar meus projetos e portfólio web:\nhttps://lucaslevino.github.io/',
        sender: 'me',
        time: '16:04',
        ogCard: {
          title: 'LucasLevino - Portfólio & GitHub',
          description: 'Explore meus projetos em Vue, Laravel, React, Flutter e muito mais.',
          image: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
          url: 'https://lucaslevino.github.io/',
          domain: 'github.io'
        }
      },
      { type: 'sticker', id: 5, text: '', sender: 'me', time: '16:05', sticker: StickerJoinha },
      { type: 'text',
        id: 6,
        text: 'Se preferir falarmos diretamente, basta clicar no link do meu WhatsApp ou me mandar um e-mail:\n\n📱 WhatsApp: https://wa.me/5565996994999 \n📧 E-mail: mailto:lucas_levino@outlook.com',
        sender: 'me',
        time: '16:06'
      }
    ]
  }
];