# <img align="center" alt="API Rest" height="40" width="45" src="https://user-images.githubusercontent.com/25181517/192107858-fe19f043-c502-4009-8c47-476fc89718ad.png"> - DAILY DIET API

Diet Meals Api developed on Rocketseat Node Ignite trail

## 💻 | Technology

<div style="display: inline_block">
  <img align="center" alt="Node.js" height="40" width="45" src="https://github.com/devicons/devicon/blob/master/icons/nodejs/nodejs-original.svg">
  <img align="center" alt="TypeScript" height="40" width="45" src="https://github.com/devicons/devicon/blob/master/icons/typescript/typescript-original.svg">
  <img align="center" alt="Fastify" height="40" width="45" src="https://user-images.githubusercontent.com/46967826/235814699-7bf7e5ce-19d1-469b-9efe-fe89412349d8.png">
  <img align="center" alt="SQLite" height="40" width="45" src="https://github.com/devicons/devicon/blob/master/icons/sqlite/sqlite-original.svg">
  <img align="center" alt="Knex" height="40" width="45" src="https://knexjs.org/knex-logo.png">
  <img align="center" alt="Vitest" height="40" width="45" src="https://vitest.dev/logo-shadow.svg">
  <img align="center" alt="ESlint" height="40" width="45" src="https://github.com/devicons/devicon/blob/master/icons/eslint/eslint-original.svg">
  <img align="center" alt="Git" height="40" width="45" src="https://user-images.githubusercontent.com/25181517/192108372-f71d70ac-7ae6-4c0d-8395-51d8870c2ef0.png">
</div>

## 👨‍💻 | Running Project

Dependency installs

```bash
  npm install
```

Running migrations

```bash
  npm run knex migrate:latest
```

Starting project

```bash
  npm run dev
```

## 📍 | Routes

| Method   | Route            | Description            |
| -------- | ---------------- | ---------------------- |
| `POST`   | `/meals`         | Create a new meal      |
| `GET`    | `/meals`         | List all meals         |
| `GET`    | `/meals/:id`     | Get a specific meals   |
| `GET`    | `/meals/metrics` | Get the meal metrics   |
| `PUT`    | `/meals/:id`     | Update a specific meal |
| `DELETE` | `/meals/:id`     | Delete a specific meal |

## 🟣 | Project Insomnia

[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=DAILY%20DIET%20API&uri=https%3A%2F%2Fraw.githubusercontent.com%2Fjoaohenriquefernandes%2Fdaily-diet-api%2Fmain%2Fexport.json)

## 🧪 | Automated Tests E2E

- [x] Should be able to create a new meal
- [x] Should be able to list all meals
- [x] Should be able to get a specific meal
- [x] Should be able to get the metrics
- [x] Should be able to update a specific meal
- [x] Should be able to delete a specific meal

Running tests

```bash
  npm test
```
