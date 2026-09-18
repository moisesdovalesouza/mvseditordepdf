# MVS Editor de PDF

PWA estático para organização, edição e exportação de PDFs jurídicos.

## v15

- Visual reaproveitado do protótipo aprovado no Lovable.
- Paleta sem roxo dominante: off-white, azul-marinho, dourado e coral.
- Vértices com curvas leves, quase retas.
- Seletor visível de tema: Sistema / Claro / Escuro.
- Ícone oficial mantido como arquivo PNG em `icons/icon-192.png`.
- Layout responsivo para desktop, tablet e celular.


## v16

- Visual portado diretamente do protótipo aprovado no Lovable.
- Base clara/off-white, azul-marinho, dourado pontual e coral para ações.
- Removido roxo dominante.
- Ajustado modo escuro com contraste legível.
- Seletor Sistema/Claro/Escuro visível e funcional.
- Ícone PNG oficial preservado; removido favicon SVG reinterpretado.
- Vértices reduzidos para curvas leves.
- Correções de grid, overflow e espaçamento para evitar sobreposição.


## v17

- Corrigida a sobreposição no bloco Docs do projeto, com espaçamento real entre botões e cards.
- Botão de excluir Doc inserido dentro de cada card de Doc.
- Botão de excluir anexo inserido dentro de cada card de anexo; removida a ação solta no topo.
- Inclusão de modos de upload: cada arquivo como anexo, adicionar ao anexo selecionado ou juntar seleção em um anexo.
- Inclusão de montagem de 2, 4 ou 6 faces por folha A4, útil para frente/verso e fotografias.
- Novo tipo de digitalização: Fotografias — várias por folha A4.
- Organização automática de anexos por importância jurídica, A-Z, tipo de arquivo e data/metadado do arquivo.
- Arrastar e soltar com espaço virtual de destino, indicando onde Doc, anexo ou página será inserido.
- Ajustes finais na etapa 3 para capa, timbrado, títulos e legendas.


## v18

- Regra técnica reforçada: não esticar, não cortar e não distorcer documentos.
- Montagem de 2, 4 ou 6 faces por folha A4 preservando proporção.
- Para 2 faces, o app pode usar A4 paisagem quando isso encaixar melhor, sem deformar.
- Correção de perspectiva refeita para eliminar as linhas diagonais de triangulação na imagem final.
- Perspectiva passa a vir desligada por padrão para evitar alteração destrutiva acidental.
- Exportação final pode girar a página apenas quando isso melhora o encaixe e preserva proporção.


## v19

- Removido o bloco “Ajustes finais” da terceira etapa.
- Mantidas as opções de capa, timbrado, cabeçalho/títulos e rodapé/legendas nos seus locais originais, principalmente na primeira etapa e nos ajustes da etapa 2.
- Removido o listener dos botões finais que não existem mais.


## v20

- Visual e ergonomia portados do protótipo aprovado no Lovable.
- Etapa 1 reorganizada em fluxo Projeto/Upload/Docs e painel lateral de configuração.
- Header compacto, logo adaptável ao modo claro/escuro e seletor Sistema/Claro/Escuro.
- Cards mais sóbrios, glass sutil, radius entre 7px e 12px e alinhamento consistente.
- Etapa 2 com leitura mais clara: estrutura, prévia, miniaturas, ajustes, OCR e montagem.
- Etapa 3 focada em ordem final, conferência e exportação.
- Preservadas as correções de v18/v19: sem distorção, sem corte, montagem de faces em A4 e ajustes finais removidos da terceira etapa.


## v21

- Faces em uma única folha A4 não são mais compactadas destrutivamente: cada face continua sendo uma página editável, com perspectiva própria.
- A montagem de 2, 4 ou 6 faces por A4 é aplicada na prévia/exportação, usando os ajustes individuais de cada face.
- "Aplicar padrão a todos" agora salva os controles antes de copiar o ajuste, incluindo perspectiva.
- Pré-visualização final recebeu link alternativo para abrir o PDF em nova aba quando o iframe do navegador bloquear o blob.
- Tema claro/escuro/sistema corrigido com `data-theme="system"`.
- Organização dos anexos mudou de vários botões para janela suspensa.
- Capa, timbre e modelo visual foram movidos para a etapa 2 com prévias visuais.
- Capa e timbre permanecem inalteráveis: ajustes de perspectiva, borda, filtro e rotação aplicam-se apenas aos documentos.


## v22

- O seletor de faces por folha só aparece para tipos compatíveis com múltiplas faces.
- "Como anexar" ganhou a opção "Cada arquivo vira um Doc".
- Em tipos compatíveis, o padrão muda para "Montar várias faces por folha".
- A montagem de várias faces permanece não destrutiva: as miniaturas ficam acumuladas no anexo e cada face mantém perspectiva independente.
- Aplicar padrão agora copia somente ajustes comuns, preservando a perspectiva e os vértices individuais de cada face.
- Ao ajustar vértices/lados manualmente, a opção de corrigir perspectiva é marcada automaticamente.
- Correção de perspectiva refeita com homografia real, sem grade triangular e com melhor precisão na geração do PDF.
- Detectar bordas foi melhorado com análise simples de contraste/luminância.
- Alças de vértices/lados menores, discretas e translúcidas.
- Durante o ajuste manual, aparece uma lupa de precisão do lado oposto ao ponteiro.
- Capa, timbre e visual agora ficam em card recolhível.
- Miniaturas da etapa 3 mostram as folhas montadas com múltiplas faces.


## v23

- Etapa 1 reorganizada como índice recolhível de Docs.
- Cada Doc permite editar número, título e classificação no próprio card.
- Anexos aparecem dentro do respectivo Doc e permitem editar título, classificação e exibição na capa.
- O antigo card separado de informações do Doc foi removido da interface visível.
- Card de capa/timbre/visual continua recolhível apenas no seu próprio bloco, sem recolher a coluna inteira.
- Alças de vértices e lados foram reduzidas para 9px/11px, mais discretas e translúcidas.
- Lupa de precisão ficou maior e mostra área mais ampla ao redor do ponto.
- Detectar bordas recebeu nova análise por varredura horizontal/vertical de contraste e luminância.


## v24

- Etapa 1 simplificada e dividida apenas entre "Enviar arquivos" e "Docs do projeto".
- Configurações de fontes, capa, timbre e modelo visual saíram da etapa 1.
- Capa, timbre, visual e fontes foram movidos para a etapa 2, abaixo da estrutura, no lado esquerdo.
- Na etapa 2, os blocos de configuração agora têm o mesmo nível hierárquico e são cards recolhíveis.
- Ordem ajustada para uso: Estrutura > Capa/timbre/fontes > Prévia > Papel > Bordas/perspectiva > Filtros > Cabeçalho/OCR > Aplicar padrão.
- "Aplicar padrão" reforça que a perspectiva e os vértices continuam individuais por face/página.


## v25

- Revisão geral de proporções, grade, colunas, menus, cards e botões.
- Etapa 1 recebeu grade mais equilibrada entre upload e Docs do projeto.
- Etapa 2 recebeu ajustes de largura entre estrutura, prévia e controles.
- Botão de montagem de faces foi refeito para ocupar espaço proporcional ao seletor de organização.
- Adicionada opção "Abrir câmera" com `capture="environment"` para fotografar documentos no celular.
- Modo claro/escuro/sistema foi reforçado com `data-theme`, `data-resolved-theme`, classes no body e atualização de meta theme-color.
- Responsividade revisada para desktop, tablets e celulares.


## v26

- Padronização visual de ícones internos, substituindo emojis/glyphs soltos por badges textuais consistentes.
- Revisão do sistema de espaçamento com tokens de grid: gaps, paddings, altura de controles e margens.
- Botões, selects, inputs, cards e notificações receberam proporções unificadas.
- Botão de câmera refeito como label nativo associado ao input `capture="environment"`, mais confiável em celulares.
- O input de câmera deixou de usar `hidden`, pois alguns navegadores móveis bloqueiam abertura de câmera quando o campo está invisível de forma rígida.
- Ajuste responsivo revisado para desktop, tablet e celular.
- Botão de montagem A4 padronizado dentro da grade de ações.


## v27

- Redução de consumo: renderização pesada limitada à etapa visível, prévia reduzida a 1200 px, PDF importado em escala 1.30 e imagens limitadas a 1800 px; efeito de luz por ponteiro desativado.
- Novo projeto agora restaura configurações do documento e retorna à etapa 1.
- Tema Sistema/Claro/Escuro refeito com alternância manual e persistência.
- Modal Sobre com função, criador Moisés do Vale Souza e redes sociais.
- Capas/timbrados mais robustos, com suporte a fundo próprio em PDF/JPG/PNG.
- Etapa 1 passa a ter um único ponto de edição de Docs/anexos: Docs do projeto.
- Capa: escolha exclusiva entre lista de anexos ou descrição breve do Doc.
- Papel individual por página ou por anexo, com margens horizontais/verticais e opção de giro automático.
- Seleção de 2 a 6 páginas para compor uma única folha sem distorção.
- Revisão de espaçamentos, botões e barras de ação para evitar aproximações e sobreposição.
