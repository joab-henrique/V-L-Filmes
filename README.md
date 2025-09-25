# 🎬 Seleção VLAB - Front-end

Projeto de Catálogo de Filmes e Séries com Perfis de Usuário, por **Joab Henrique Marques da Silva**.

Este repositório contém a solução desenvolvida para o processo seletivo do **V-Lab**, com o progresso das funcionalidades, correção de bugs e implementação de melhorias.

---

## 📌 Objetivos do Projeto

- Corrigir bugs existentes.
- Finalizar funcionalidades incompletas.
- Desenvolver novas funcionalidades seguindo as especificações.
- Documentar tudo de forma organizada.

---

## ✅ Checklist de Requisitos

## 📝 Especificações

### 1. Eu, como planejador, desejo buscar e visualizar filmes para adicioná-los à minha maratona

- [X] A listagem deverá exibir: título, pôster e gênero.
- [X] Deverá ser possível filtrar por nome.
- [X] Deverá ser possível filtrar por gênero.
- [X] Deverá ser possível filtrar por ano de lançamento.
- [X] Deverá ser possível ordenar por ano de lançamento.
- [X] Deverá ser possível ordenar por nota.
- [X] Deverá ser possível ordenar por nome (ordem alfabética).
- [X] Deverá ser possível ordenar por duração.
- [X] Deverá ser possível ordenar por popularidade.

Obs.: Atualmente, na filtragem por nome com Ano/Gênero quando o usuário pesquisa por um nome específico de filme, apenas a opção de ordenar os resultados funciona, mas não aplica os filtros de ano e gênero simultaneamente. Os filtros funcionam perfeitamente na tela inicial, ou seja, quando nenhum nome de filme está sendo pesquisado. Isso pode ser resolvido!

### 2. Eu, como planejador, desejo construir uma lista de maratona e ver o tempo total dela

- [X] Deve ser possível adicionar filmes da busca a uma "Lista da Maratona" atual.
- [X] A lista deve exibir os filmes adicionados.
- [X] Calcular e mostrar dinamicamente a duração total da maratona em horas e minutos.
- [X] Deve ser possível remover filmes da lista a qualquer momento.

### 3. Eu, como planejador, desejo usar geradores temáticos para descobrir e adicionar filmes facilmente

- [X] A aplicação deve ter uma ferramenta de "Gerador por XXX" (ex: diretor, ator).
- [X] O usuário insere o nome de um XXX, e a aplicação busca e exibe a filmografia disso.
- [X] A partir da lista de filmes de XXX, deve ser possível adicioná-los diretamente à "Lista da Maratona".

### 4. Eu, como planejador, desejo salvar minhas maratonas para acessá-las no futuro

- [X] As maratonas criadas deverão ser armazenadas localmente (localStorage).
- [X] Deve haver um botão para salvar a "Lista da Maratona" atual, permitindo que o usuário dê um nome para ela (ex: "Maratona do Oscar 2024").
- [X] Deve existir uma página ou seção para visualizar, carregar ou excluir as maratonas salvas.

### 2. Requisitos Desejáveis

- [ ] Corrigir >> todos << os bugs encontrados no projeto base.
- [ ] Implementar testes unitários, de integração ou e2e.
- [X] Aplicar arquitetura **Facade** nos módulos principais (por partes).

Obs. sobre os bugs: O carrossel de Upcoming / Em Breve, permanece como uma simulação, por questão de tempo, sem buscar realmente os lançamentos futuros. Além disso, a funcionalidade de "Explore All" ainda precisa ser ajustada para direcionar e filtrar os resultados conforme esperado.

### 3. Funcionalidades Extras

- [X] "Login" pelo nome.
- [X] Ordenação dinâmica.
- [X] Uso de Modals, mantendo a navegação em uma tela só.
- [X] Gerador juntamente com a barra de pesquisa.

---

## 🐞 Bugs Encontrados

- [X] Em movie-card.component.ts, corrigida a importação do @Input do @angular/core.
- [X] Em movie.api.ts, importação do HttpClient do @angular/common/http.
- [X] Em movie.api.ts, ajuste do método gt para get.
- [X] Em carousel.component.ts, importações de Component, RouterModule e AfterViewInit.
- [X] Adicionado CarouselComponent nos imports do @Component e MovieListComponent, permitindo o uso do <app-carousel>.
- [X] Corrigido [titles] para [title] no HTML, conforme esperado pelo CarouselComponent.

## ⚠️ Pendências e Observações (repetindo)

- Atualmente, na filtragem por nome + Ano/Gênero, quando o usuário pesquisa por um nome específico de filme, apenas a opção de ordenar os resultados funciona. Os filtros de ano e gênero não são aplicados simultaneamente. Essa limitação não ocorre na tela inicial, onde os filtros funcionam perfeitamente.
- O carrossel de Upcoming / Em Breve ainda é uma simulação, por questão de tempo, sem buscar realmente os lançamentos futuros.
- A funcionalidade de Explore All ainda precisa ser ajustada para direcionar e filtrar os resultados conforme esperado.

---
