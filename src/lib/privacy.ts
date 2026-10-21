/** Inventário da landing institucional. Não abrange os softwares independentes AMZ. */
export const privacy = {
  version: '2026-10-20.2',
  reviewedAt: '2026-10-20',
  reviewedAtLabel: '20 de outubro de 2026',
  status: 'preliminary',
  routes: {
    privacy: '/privacidade',
    cookies: '/cookies',
    preferences: '/cookies#preferencias',
  },
  // Não há cookies ou armazenamento persistente criados pela aplicação auditada.
  browserStorage: [],
  // Não cadastrar fornecedores fictícios. Uma ativação exige nova auditoria e CMP real.
  optionalResources: [] as readonly { id: string; provider: string; purpose: string }[],
} as const;

/** Modo informativo: sem banner, categorias, escolha persistida ou scripts adicionais. */
export function getPrivacyState() {
  if (privacy.optionalResources.length > 0) {
    throw new Error('Recursos opcionais exigem auditoria, base legal validada e gerenciamento de consentimento implementado antes da ativação.');
  }
  return { mode: 'informational', showBanner: false, hasOptionalResources: false } as const;
}
