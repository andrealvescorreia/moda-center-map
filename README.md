# Moda Center Map

<a href="https://moda-center-map.vercel.app"><img src="shared/screen.jpg" alt="drawing" width="700"/></a>

### Uma aplicação web com intuito de melhorar a experiência de navegar dentro do Moda Center

## Sumário
- [Sobre o Moda Center](#sobre-o-moda-center)
- [Sobre Esse Projeto](#sobre-esse-projeto)
- [Documentação](#documentação)
  - [🔌 API](#api)
  - [📄 Documentos Gerais](#documentos-gerais)
  - [🧩 Design e UX](#design-e-ux)
  - [🗂️ Modelagem e Diagramas UML](#modelagem-e-diagramas-uml)
- [Rodar o Projeto Localmente](#rodar-o-projeto-localmente)
  - [Requisitos](#requisitos)
  - [Configuração do Frontend](#configuração-do-frontend)
  - [Configuração do Backend](#configuração-do-backend)
- [Inspiração para o Projeto](#inspiração-para-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Principais Tecnologias Utilizadas](#principais-tecnologias-utilizadas)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [Plataformas Utilizadas para o Deploy](#plataformas-utilizadas-para-o-deploy)
- [Limitações Conhecidas](#limitações-conhecidas)
- [Agradecimentos](#agradecimentos)

---
## Sobre o Moda Center
O [Moda Center](https://omodacenter.com.br/), considerado maior polo atacadista do Brasil, fica localizado em Santa Cruz do Capibaribe, Pernambuco. O centro reúne mais de 10.000 pontos de vendas, com peças comercializadas no atacado e varejo.

## Sobre Esse Projeto
Dada a grande escala e a estrutura complexa do Moda Center, esta aplicação foi projetada para facilitar a visualização dos pontos de venda e permitir aos usuário a criação de rotas personalizadas entre diferentes locais. Isso proporciona uma experiência de compra mais eficiente e otimizada, especialmente para revendedores ou novos visitantes do local.


## Documentação

Essa seção reúne os principais artefatos relacionados à documentação do projeto *Moda Center Map*, organizados por categoria.

---
### API

- [Documentação da API (Swagger)](https://moda-center-map.on.shiper.app/api-docs/#/)

---

### Documentos Gerais

- [Documento de Requisitos (Docs)](https://docs.google.com/document/d/1U3cmgA7Jtm45Ca1zTEve3xfkRyaxHY0f/edit?usp=sharing&ouid=116395192366831561443&rtpof=true&sd=true)
- [Descrição da Estrutura do Moda Center (Docs)](https://docs.google.com/document/d/1jOK3RY7L9goG3G4xpiuaVo7yUkiPOy65kIo0x-AqZtk/edit?usp=sharing)

---

### Design e UX

- [Jornada de Usuário (Figma)](https://www.figma.com/board/pJbQKhYlRJVeVE9aXmrmyJ/MCM---Jornada-de-Usu%C3%A1rio?node-id=0-1&p=f)
- [Protótipos de Tela (Figma)](https://www.figma.com/design/q2DKZuUv3wtai0zFRAvZmX/Moda-Center-Map?node-id=222-1838&t=wBo7Cuca7N0akSz6-1)
- [Mapa do Moda Center (Figma)](https://www.figma.com/design/WN8j7ejpRLGEUQwD34musf/MCM-Grid?node-id=0-1&t=wBo7Cuca7N0akSz6-1)

---

### Modelagem e Diagramas UML

- [Diagrama Entidade-Relacionamento (Lucidchart)](https://lucid.app/lucidchart/439b5b64-679c-4fc3-852f-c77213b3a30a/edit?viewport_loc=-847%2C-241%2C2995%2C1210%2C0_0&invitationId=inv_1e1880ae-2560-4b25-81fd-6b9a9d5f8750)
- [Casos de Uso e Diagrama de Classes (Lucidchart)](https://lucid.app/lucidchart/be69e59a-c156-4ded-a664-cd9251d85cf1/edit?viewport_loc=-287%2C1038%2C1999%2C807%2C.Q4MUjXso07N&invitationId=inv_64f844fd-80f8-4fea-aa0e-1bef580ead77)

---


## Rodar o Projeto Localmente

### Requisitos
- Versão recente do [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/) ou [PostgreSQL](https://www.postgresql.org/)

### Configuração do Frontend
Crie um arquivo `.env` na raiz da pasta `frontend` e adicione:
```env
VITE_API_URL=http://localhost:3001 # server
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
Crie um arquivo `.env` na raiz da pasta `server` e adicione, seguindo o exemplo:
```env
PROTOCOL="http"
HOST="localhost"
PORT=3001
TOKEN_EXPIRATION="14d"
TOKEN_SECRET="domoarigatomrroboto"
POSTGRES_URL="postgresql://docker:docker@localhost:5432/moda-center-map"
WEB_URL="http://localhost:5173"

# optional
# for your google cloud console oauth2 project
# the aplication can be used normally without these
GOOGLE_CLIENT_ID="444-555"
GOOGLE_CLIENT_SECRET="Goog-le-secre-t"
```
Instale as dependências e inicie o servidor de desenvolvimento:
```sh
npm install
npm run dev
```

---





## Inspiração para o Projeto

A ideia para este projeto surgiu ao observar as dificuldades enfrentadas por meus pais, que são revendedores na Paraíba e frequentemente visitam o Moda Center para adquirir mercadorias. Eles enfrentam desafios como longas viagens, a necessidade de percorrer grandes distâncias carregando compras pesadas a pé, e a falta de ferramentas para planejar a sequência ideal de locais a serem visitados. 

Com isso em mente, nasceu a proposta de criar uma aplicação que não apenas auxilie na navegação pelo Moda Center, mas também ofereça funcionalidades como o cálculo de rotas otimizadas entre pontos de interesse, reduzindo o esforço físico e otimizando o tempo gasto no local.

## Funcionalidades
- **Registrar/logar como usuário**
- **Login com Google**
- **Buscar vendedores** 
- **Rotas otimizadas** 
- **Cadastro de vendedores** 
- **Favoritar vendedores** 
- **Instalável como aplicativo**
- **Uso offline**

## Principais Tecnologias Utilizadas
### Frontend
- [ReactJs](https://react.dev/) - Biblioteca para criação das interfaces
- [LeafletJs](https://leafletjs.com/) - Mapa interativo
- [Tailwind CSS](https://tailwindcss.com/) - Estilização
- [gsap](https://gsap.com/) - Animações
- [Workbox](https://developer.chrome.com/docs/workbox) e [vite-pwa-plugin](https://vite-pwa-org.netlify.app/) - Funcionalidades de PWA e uso offline

### Backend
- [Express](https://www.fastify.io/) - Framework Node.js para criação de APIs
- [PostgreSQL](https://www.postgresql.org/) - Banco de dados
- [Sequelize ORM](https://orm.drizzle.team/) - ORM para interação com o banco de dados
- [Zod](https://zod.dev/) - Validação de dados
- [Mocha](https://mochajs.org/) + [Chai](https://www.chaijs.com/) - Testes
- [Swagger](https://swagger.io/) - Documentação da API
- Outras: BcryptJS para encriptar as senhas dos usuários; jsonwebtoken para autenticação via cookies httpOnly.

---


## Plataformas Utilizadas para o Deploy
- **Backend API NodeJS:** [Shiper](https://shiper.app/)
- **Banco de Dados PostgreSQL:** [Neon.tech](https://neon.tech/)
- **Frontend React:** [Vercel](https://vercel.com/)

---

## Limitações Conhecidas
- A interface de usuário ainda careçe de melhor otimização para telas desktop. Como o foco principal do Moda Center Map é a experiência em dispositivos móveis, essa limitação não será priorizada no momento.

- Navegação no mapa apresenta baixa performance no aplicativo de Android Kiwi Browser. O motivo ainda é desconhecido, mas provavelmente está relacionado ao React Leaflet.

---



## Agradecimentos

Agradecimentos especiais para [Artur Dantas](https://github.com/Artur906), [Arthur Medeiros](https://github.com/ArthurMedeiros29), [Meljael Daniel](https://github.com/meljael), [Wellyngton Targino](https://github.com/welly555) e [Weslley Almeida](https://github.com/AlmeidaWeslley), pela contribuição no documento de requisitos do Moda Center Map, criado durante a disciplina de Análise e Projeto de Sistemas, no curso de Ciência da Computação da UEPB.
