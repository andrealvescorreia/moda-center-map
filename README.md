# Moda Center Map

[![Moda Center Map](shared/screen.jpg)](https://nlw-connect.on.shiper.app/invites/0ed14984-337e-42c5-9660-6310817b0302)

### Uma aplicação web com intuito de melhorar a experiência de navegar dentro do Moda Center.

## Sumário
- [Sobre o Moda Center](#sobre-o-moda-center)
- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Principais Tecnologias Utilizadas](#principais-tecnologias-utilizadas)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [Como Rodar o Projeto](#como-rodar-o-projeto)
  - [Requisitos](#requisitos)
  - [Configuração do Frontend](#configuração-do-frontend)
  - [Configuração do Backend](#configuração-do-backend)
- [Plataformas Utilizadas para o Deploy](#plataformas-utilizadas-para-o-deploy)

---

## Sobre o Moda Center
O Moda Center, considerado maior polo atacadista da América Latina, fica localizado em Santa Cruz do Capibaribe, Pernambuco. O centro reúne mais de 10.000 pontos de vendas, onde são comercializadas peças no atacado e no varejo.

## Sobre o Projeto
Dada a grande escala e a estrutura complexa do Moda Center, esta aplicação foi projetada para facilitar a visualização dos pontos de venda e permitir a criação de rotas personalizadas entre diferentes locais. Isso proporciona uma experiência de compra mais eficiente e otimizada, especialmente para revendedores ou pessoas menos habituadas com o local.

### Inspiração para o Projeto

A ideia para este projeto surgiu ao observar as dificuldades enfrentadas por meus pais, que são revendedores na Paraíba e frequentemente visitam o Moda Center para adquirir mercadorias. Eles enfrentam desafios como longas viagens, a necessidade de percorrer grandes distâncias carregando compras pesadas a pé, e a falta de ferramentas para planejar a sequência ideal de locais a serem visitados. 

Com isso em mente, nasceu a proposta de criar uma aplicação que não apenas auxilie na navegação pelo Moda Center, mas também ofereça funcionalidades como o cálculo de rotas otimizadas entre pontos de interesse, reduzindo o esforço físico e otimizando o tempo gasto no local.

## Funcionalidades
- **Registrar/logar como usuário**
- **Busca por vendedores** 
- **Rotas otimizadas** 
- **Cadastro de vendedores** 
- **Favoritar vendedores** 

## Principais Tecnologias Utilizadas
### Frontend
- [ReactJs](https://react.dev/) - Biblioteca para criação das interfaces
- [LeafletJs](https://leafletjs.com/) -Mapa interativo
- [Tailwind CSS](https://tailwindcss.com/) - Estilização 

### Backend
- [Express](https://www.fastify.io/) - Framework Node.js para criação de APIs
- [Sequelize ORM](https://orm.drizzle.team/) - ORM para interação com o banco de dados
- [Zod](https://zod.dev/) - Validação de dados
- [Mocha](https://mochajs.org/) + [Chai](https://www.chaijs.com/) - Testes
- [PostgreSQL](https://www.postgresql.org/) - Banco de dados
- Outras: BcryptJS para encriptar as senhas dos usuários; jsonwebtoken para autenticação via cookies httpOnly.

---

## Como Rodar o Projeto

### Requisitos
- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/) ou [PostgreSQL](https://www.postgresql.org/)

### Configuração do Frontend
Crie um arquivo `.env` na raiz da pasta `frontend` e adicione:
```env
VITE_API_URL=http://localhost:3001
```
Execute:
```sh
cd frontend
npm install
npm run dev
```

### Configuração do Backend
```sh
cd server
```
Inicie o container do PostgreSQL via Docker Compose:
```sh
docker compose up -d
```
Crie um arquivo `.env` na raiz do projeto `server` e adicione, seguindo o exemplo:
```env
PORT=3001
POSTGRES_URL="postgresql://docker:docker@localhost:5432/moda-center-map"
WEB_URL="http://localhost:5173"
TOKEN_EXPIRATION="14d"
TOKEN_SECRET="domoarigatomrroboto"
```
Instale as dependências e inicie o servidor de desenvolvimento:
```sh
npm install
npm run dev
```

---

## Plataformas Utilizadas para o Deploy
- **Frontend React:** [Github Pages](https://pages.github.com/)
- **API Backend NodeJS:** [Shiper](https://shiper.app/)
- **Banco de Dados PostgreSQL:** [Neon.tech](https://neon.tech/)

---

Feito com 💜 por André Alves Correia.
