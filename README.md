# Desafio Técnico - Node.js (Express ou Nest) + Vue.js ou React (opcional)

## 💸 Desafio: Conversor de Moedas

Você deverá implementar uma aplicação que permita a conversão de valores entre moedas, utilizando **Node.js com TypeScript** no backend. O frontend pode ser implementado opcionalmente em **Vue.js** ou **React**.

> **Importante:** Caso o candidato não tenha experiência com frontend, a entrega pode ser feita exclusivamente com a API (backend).

---

## 📆 Requisitos do Projeto

### Funcionalidades principais

1. A API deve permitir a conversão entre pelo menos **4 moedas**:

   * BRL (Real)
   * USD (Dólar Americano)
   * EUR (Euro)
   * JPY (Iene)

2. As **taxas de câmbio** devem ser obtidas da API:

   * [https://app.currencyapi.com/](https://app.currencyapi.com/)
   * Documentação oficial: [https://currencyapi.com/docs](https://currencyapi.com/docs)

3. A aplicação deve **persistir** cada transação realizada, contendo:

   * ID do usuário
   * Moeda de origem e destino
   * Valor de origem
   * Valor convertido (destino)
   * Taxa de conversão
   * Data/Hora UTC

4. As transações devem estar disponíveis via endpoint:

   * `GET /transactions?userId=123`

5. Uma transação de sucesso deve retornar:

   ```json
   {
     "transactionId": 42,
     "userId": 123,
     "fromCurrency": "USD",
     "toCurrency": "BRL",
     "fromValue": 100,
     "toValue": 525.32,
     "rate": 5.2532,
     "timestamp": "2024-05-19T18:00:00Z"
   }
   ```

6. Casos de falha devem retornar **status HTTP adequado** e mensagem de erro clara.

7. O projeto deve conter **testes unitários e de integração**.

8. O repositório deve incluir um **README.md** com:

   * Instruções para rodar o projeto
   * Explicação do propósito
   * Principais decisões de arquitetura
   * Como os dados estão organizados (separação de camadas)

9. O código deve estar todo em **inglês**.

10. O projeto deve ser entregue via repositório no GitHub.

---

## 🔜 Itens Desejáveis

* Logs estruturados (ex: Winston, Pino)
* Tratamento de exceções com middlewares
* Documentação da API (Swagger, Postman, etc.)
* Linter (ESLint, Prettier)
* Deploy funcional (Railway, Fly.io, Heroku, Render, etc.)
* CI/CD com GitHub Actions ou similar
* Frontend opcional com:

  * Vue.js 3 + TypeScript
  * ou React + TypeScript
  * Estilização com TailwindCSS ou equivalente

---

## 🚀 Stack Tecnológica Esperada

### Backend:

* Node.js + TypeScript
* **Express.js** ou **NestJS**
* TypeORM, MikroORM ou Prisma (a critério do desenvolvedor)
* PostgreSQL ou SQLite
* Jest ou Vitest para testes

### Frontend (opcional):

* Vue.js 3 **ou** React 18
* Axios
* TailwindCSS (opcional)
* Testes com Cypress, Vitest ou RTL (opcional)

---

## 💡 Diferenciais para o Perfil da Vaga

* Experiência com arquiteturas escaláveis e boas práticas REST
* Conhecimento em AWS (S3, Lambda, RDS, etc.)
* Familiaridade com CI/CD pipelines
* Boa comunicação e escrita em inglês
* Conforto em trabalhar próximo a equipes de Produto e Design

---

## 📋 Entrega

Para padronizar a entrega e facilitar a análise:

1. Faça um **fork deste repositório** para sua conta pessoal do GitHub.
2. Crie uma **branch com seu nome em snake_case** (exemplo: `joao_silva_souza`).
3. Suba sua solução utilizando **commits organizados e descritivos**.
4. Após finalizar:
   - Certifique-se de que o repositório esteja **público**
   - Envie o link do seu fork para nossa equipe com:
     - **Título:** `Entrega - joao_silva_souza`
     - **Descrição:** Nome completo, data da entrega e quaisquer observações que julgar relevantes.

> ✅ **Dica**: Você pode incluir um arquivo `THOUGHTS.md` com decisões técnicas, ideias descartadas e sugestões de melhoria.

---

## 📢 Considerações Finais

* Se utilizar algum recurso pago (API, infra), cite alternativas gratuitas no README.
* Demonstrações de atenção a performance, design de software e clareza de código são valorizadas.
* Se desejar, adicione um arquivo `THOUGHTS.md` com explicações técnicas, suposições e decisões de arquitetura.

Boa sorte! 🚀
