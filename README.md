# ENTROLABS

Site de experimentos interativos. Fundo branco, abas no topo para escolher o experimento.

- Produção: https://entrolabs.vercel.app
- Sessão do Claude Code em que foi construído (para restaurar o contexto): https://claude.ai/code/session_01Fgwm7UMq9rpVaawLrY6ckX

## Experimentos

| Aba | Arquivos | O que é |
|---|---|---|
| Corpo humano | `index.html`, `corpo.js` | Figura 2D em SVG com 7 sistemas e 21 partes clicáveis; cada parte mostra função e uma curiosidade |

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
