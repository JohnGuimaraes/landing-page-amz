/** Nenhum link, serviço, métrica ou produto é publicado sem validação. */
export const site = {
  name: 'AMZ Data Software',
  shortName: 'AMZ',
  description: 'AMZ Data Software — apresentação institucional em desenvolvimento.',
  tagline: 'Tecnologia clara, humana e confiável', // Direção de marca aprovada; não é slogan final.
  nav: [
    { label: 'Visão', href: '#visao' },
    { label: 'Capítulos', href: '#capitulos' },
    { label: 'Soluções', href: '#solucoes' },
    { label: 'Abordagem', href: '#abordagem' },
    { label: 'Projetos', href: '#projetos' },
    { label: 'Contato', href: '#contato' },
  ],
  socials: [] as { label: string; url: string }[],
  email: null as string | null,
} as const;
