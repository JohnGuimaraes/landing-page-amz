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
- Motion.dev controla `animate`, `inView` e progresso de scroll sem React.
- Three.js cria apenas a atmosfera sutil (sem nuvens de partículas, sem logo formada por pontos, sem efeitos neon). O fundo CSS garante fallback.
- Scroll nativo, sem scroll-jacking. Lenis/GSAP/Rive não fazem parte do baseline.
- Revelação ~720ms; hover 160–320ms; animação atmosférica lenta.
- Respeitar `prefers-reduced-motion`, pausar rendering quando aba não está visível e limitar DPR 1.5.

## Acessibilidade e governança
- Meta: WCAG 2.2 AA. Validar contraste real de toda combinação de texto e fundo; coral não deve receber texto pequeno branco.
- Foco visível, skip link, headings semânticos, navegação acessível, canvas decorativo ignorado.
- Não inventar capacidades, métricas, clientes, integrações, depoimentos, endpoints, URLs, telefones ou cases.
- Conteúdo real deve ser validado antes da publicação. Produtos conhecidos: AMZ Facilities, OmniSync ERP e Patrimônios AMZ, apenas como possíveis evidências autorizadas, não catálogo obrigatório.

## Referências de execução
Stripe, Linear, thoughtbot, Retool e CI&T: estudar hierarquia e acabamento, nunca copiar ativos ou layout.
