# TODO: Melhorias Profissionais no Projeto Inspirapixel

## Passos a Completar

- [x] Melhorar Documentação: Atualizar README.md com descrição do projeto, instalação, uso.
- [x] Limpar Código: Remover código comentado, corrigir App.vue, otimizar imports.
- [x] Melhorar Semântica HTML: Substituir divs excessivos por tags semânticas em Main.vue (ex: <main>, <section>, <article>).
- [x] Implementar Funcionalidade de Busca: Adicionar busca real no Hero.vue, filtrando imagens por título/categoria.
- [x] Adicionar Tratamento de Erros e Validação: Incluir try-catch, validação de entrada.
- [x] Melhorar Acessibilidade: Adicionar ARIA labels, navegação por teclado.
- [x] Otimizar Performance: Implementar lazy loading melhorado, compressão de imagens
- [ ] Adicionar Testes: Configurar Vitest para testes unitários.
- [x] Configurar Ferramentas de Qualidade: Adicionar ESLint, Prettier.
- [ ] Implementar Roteamento: Usar Vue Router para páginas separadas (Home, Gallery, Favorites).
- [ ] Melhorar Estilos: Expandir style.css para temas consistentes, dark mode opcional.
- [ ] Próximos Passos: Instalar dependências adicionais, testar mudanças, verificar performance com Lighthouse.

## Subtasks for Error Handling and Validation

- [x] Add try-catch for localStorage operations in Gallery.vue and App.vue
- [x] Validate imageId in toggleFavorite and isFavorite functions
- [x] Validate tab parameter in setActiveTab function
- [x] Add input validation for searchTerm in Hero.vue

## Implementar Envio Real de Email para Modo Pro

- [x] Instalar @emailjs/browser
- [x] Importar emailjs em ModeSelection.vue
- [x] Implementar variáveis de ambiente para segurança (.env)
- [x] Adicionar .env ao .gitignore para proteção contra exposição no GitHub
- [x] Modificar submitRegistration para enviar email real
- [x] Adicionar tratamento de erro para envio de email
- [x] Adicionar validação de credenciais antes do envio
- [ ] Testar funcionalidade de envio de email (após configurar credenciais no .env)
