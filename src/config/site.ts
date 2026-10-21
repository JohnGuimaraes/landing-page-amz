/** Nenhum link, serviço, métrica ou produto é publicado sem validação. */
const whatsapp = 'https://wa.me/5591981342990';
export const site = {
  name: 'AMZ Data Software',
  shortName: 'AMZ',
  description: 'AMZ Data Software — apresentação institucional em desenvolvimento.',
  tagline: 'Tecnologia clara, humana e confiável', // Direção de marca aprovada; não é slogan final.
  nav: [
    { label: 'Visão', href: '#visao' },
    { label: 'Capítulos', href: '#capitulos' },
    { label: 'Abordagem', href: '#abordagem' },
    { label: 'Projetos', href: '#projetos' },
    { label: 'Conexões', href: '#conexoes' },
    { label: 'Contato', href: '#contato' },
  ],
  socials: [{ label: 'Instagram', url: 'https://www.instagram.com/amzdatasoftware/' }],
  email: null as string | null,
  contact: { whatsapp, phone: 'tel:+5591981342990', phoneLabel: '+55 91 98134-2990' },
  opportunities: {
    careers: '/carreiras',
    partnerships: '/parcerias',
  },
} as const;
