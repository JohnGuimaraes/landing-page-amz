# AMZ Data Software — Design System v0.1

## Princípio
**Tecnologia clara, humana e confiável.** Este é o princípio recuperado da etapa anterior; a identidade oficial, a redação e as peças institucionais definitivas ainda dependem de aprovação.

## Personalidade visual
Editorial, precisa, aberta, contemporânea. Fundos predominantemente claros. O azul-marinho ancora a confiança; o azul dá ritmo; teal representa continuidade; coral pontua pequenos detalhes, sem dominar a interface.

## Tokens
Fonte única: `src/styles/tokens.css`. Nunca declarar valores de marca ad hoc em novos componentes. Usar variáveis semânticas (`--text-*`, `--bg-*`) antes dos tokens brutos (`--brand-*`).

| Papel | Token | Valor |
|---|---|---|
| Primária | `--brand-navy` | `#17324D` |
| Ação/destaque | `--brand-blue` | `#2878B5` |
| Azul vivo | `--brand-electric` | `#1F6FE5` |
| Destaque secundário | `--brand-teal` | `#258A78` |
| Coral, uso pontual | `--brand-coral` | `#F0835E` |
| Texto secundário | `--text-secondary` | `#526173` |
| Canvas | `--bg-canvas` | `#F7F9FA` |
| Superfície | `--bg-surface` | `#FFFFFF` |

## Tipografia
- Display: Avenir Next, Segoe UI ou Arial (fallbacks de sistema, sem CDN).
- Corpo: Inter quando disponível; fallback Segoe UI e Arial. Antes de produção, fornecer licenças e arquivos para self-hosting ou consolidar uma família.
- Mono: SF Mono / Consolas / Liberation Mono; apenas para labels, contadores e metadados.
- Itálica serifada: Georgia de forma criteriosa em 1–2 palavras, nunca obrigatória.
- Display grande, tracking negativo com controle; texto longo 1.58–1.65 de entrelinha; mínimo 16px no corpo.

## Grid, espaços e superfícies
- Container máximo: `1440px`, gutters fluidos (`--gutter`).
- Grid editorial desktop; pilhas no mobile.
- Espaçamento base múltiplo de 4, seções com `--section-space`.
- Raios: 8/16/24px; usar cards somente quando agrupam conteúdo.
- Hierarquia: narrativa e espaço em branco antes de bordas e sombras.

## Componentes de base
`BrandMark` (placeholder tipográfico, não marca oficial), `Button` (primary/secondary/light), `SiteHeader` (desktop/mobile), `SiteFooter`, `Atmosphere`, seções editoriais. Padrões ficam inspecionáveis em `/design-system`.

## Motion
- Motion.dev controla uma única assinatura reversível de progresso de scroll, a entrada mascarada do Hero e revelações editoriais pontuais, sem React.
- O progresso compartilhado coordena o empilhamento dos capítulos, a passagem para a superfície grafite, os caminhos SVG do ecossistema, soluções alternadas, trajetória da abordagem e elementos gráficos do CTA.
- A atmosfera é CSS; não há renderer 3D, Three.js, efeitos neon ou partículas. A passagem de fundo é um painel editorial sticky e volta naturalmente com o scroll.
- Conteúdo, serviços, etapas e projetos apresentados na narrativa são provisórios; nenhum placeholder representa resultado real.
- Scroll nativo, sem scroll-jacking. Lenis/GSAP/Rive não fazem parte do baseline.
- Revelação mascarada ~700–780ms; hover 160–320ms; movimento de scroll contido, reversível e sem pausas longas.
- Respeitar `prefers-reduced-motion`, pausar rendering quando aba não está visível e limitar DPR 1.5.

## Acessibilidade e governança
- Meta: WCAG 2.2 AA. Validar contraste real de toda combinação de texto e fundo; coral não deve receber texto pequeno branco.
- Foco visível, skip link, headings semânticos, navegação acessível, canvas decorativo ignorado.
- Não inventar capacidades, métricas, clientes, integrações, depoimentos, endpoints, URLs, telefones ou cases.
- Conteúdo real deve ser validado antes da publicação. Produtos conhecidos: AMZ Facilities, OmniSync ERP e Patrimônios AMZ, apenas como possíveis evidências autorizadas, não catálogo obrigatório.

## Referências de execução
Stripe, Linear, thoughtbot, Retool e CI&T: estudar hierarquia e acabamento, nunca copiar ativos ou layout.
