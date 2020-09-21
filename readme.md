# A colourful (GraphQL) API

This is the api for https://github.com/Kalovelo/a-colourful-presentation

## Get Started

1. clone
2. npm install
3. npm run dev

## NPM Scripts

|       Script       |    Description     |
| :----------------: | :----------------: |
|    npm run dev     |  Start dev server  |
|   npm run start    | Build & run server |
|   npm run build    |   Build project    |
|    npm run test    |   Run jest tests   |
| npm run type-check |  Run typechecking  |

## API

You can navigate to `/graphql/` and check the query documendation.

## Environmental variables

used in `config.env`

|        variable        |                     use                     |
| :--------------------: | :-----------------------------------------: |
|         `PORT`         |                 Port to run                 |
|      `MONGO_URI`       |                Mongo DB URI                 |
|      `ADMIN_PASS`      | Used for generating users with admin rights |
| `ACCESS_TOKEN_SECRET`  |          used for JWT access token          |
| `REFRESH_TOKEN_SECRET` |         used for JWT refresh token          |