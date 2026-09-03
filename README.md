# ENTROLABS

Site de experimentos interativos. Fundo branco, abas no topo para escolher o experimento.

- Produção: https://entrolabs.vercel.app
- Sessão do Claude Code em que foi construído (para restaurar o contexto): https://claude.ai/code/session_01Fgwm7UMq9rpVaawLrY6ckX

## Experimentos

| Aba | Arquivos | O que é |
|---|---|---|
| Corpo 3D (inicial) | `index.html`, `corpo3d.js`, `corpo3d.css`, `models/za/`, `draco/` | Corpo humano 3D do Z-Anatomy: 9 sistemas carregados sob demanda, 5.451 estruturas com nome PT/latim/TA2 e definição, 1.564 acidentes ósseos como pinos, busca, hierarquia, isolar, corte. Portado do repositório `plataforma-medicina` |
| Corpo 2D | `corpo2d.html`, `corpo.js` | Figura 2D em SVG com 7 sistemas e 21 partes clicáveis; cada parte mostra função e uma curiosidade |
| Mostra 3D | `mostra.html`, `mostra/hubmap.html` | Mostra comparativa de atlas 3D abertos: três visualizadores da comunidade embutidos (iframe das demos originais), visualizador próprio dos órgãos HuBMAP (three.js + GLB via CDN), links para Open Anatomy (Harvard) e Z-Anatomy (instalador Windows) |

## Estrutura

```
index.html   aba "Corpo humano" (primeira aba)
corpo.js     dados das partes + montagem do SVG + interação
shared.css   estilo do site (topo com abas, layout, mobile)
vercel.json  configuração do deploy estático
```

Sem framework, sem build. Para rodar localmente: `npx serve .`

## Adicionar um experimento

1. Crie `nome.html` copiando a estrutura de `index.html` (mesmo topo com abas).
2. Acrescente a aba em todas as páginas: `<a class="tab" href="./nome.html">Nome</a>`.
3. `git push` na `main` publica sozinho na Vercel.
