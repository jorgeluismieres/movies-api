
# Movies API (Express + PostgreSQL)

Cumple con los requisitos del enunciado: modelos `genres`, `actors`, `directors`, `movies`, relaciones N:M y endpoints CRUD + endpoints para asignar géneros/actores/directores a una película.

## Requisitos
- Node 18+
- PostgreSQL 14+
- Postman (para importar la colección)

## Configuración local
1. Cloná / descomprimí este proyecto.
2. Copiá `.env.example` a `.env` y seteá `DATABASE_URL` (por ejemplo: `postgres://postgres:postgres@localhost:5432/moviesdb`).
3. Creá la base de datos vacía `moviesdb` en tu Postgres.
4. Instalá dependencias:
   ```bash
   npm i
   ```
5. Creá tablas y datos de ejemplo:
   ```bash
   npm run db:schema
   npm run db:seeds
   ```
6. Levantá el server:
   ```bash
   npm run dev
   ```
   La API corre en `http://localhost:4000/`

## Endpoints principales

- **Genres**
  - `GET /genres`
  - `POST /genres` `{ name }`
  - `GET /genres/:id`
  - `PUT /genres/:id` `{ name }`
  - `DELETE /genres/:id`

- **Actors / Directors** (mismo contrato)
  - `GET /actors` `GET /directors`
  - `POST /actors` `{ first_name, last_name, nationality, image?, birthday(YYYY-MM-DD) }`
  - `GET /actors/:id`
  - `PUT /actors/:id` (mismo body que POST)
  - `DELETE /actors/:id`

- **Movies**
  - `GET /movies` → devuelve **cada película con sus géneros, actores y directores**.
  - `POST /movies` `{ name, image?, synopsis, release_year }`
  - `GET /movies/:id` → con relaciones
  - `PUT /movies/:id` (mismo body que POST)
  - `DELETE /movies/:id`

- **Asignaciones extra (body: array de IDs)**
  - `POST /movies/:id/genres` → `[1,2,3]` → devuelve géneros agregados
  - `POST /movies/:id/actors` → `[1,5]` → devuelve actores agregados
  - `POST /movies/:id/directors` → `[2]` → devuelve directores agregados

## Despliegue en Render

1. Subí este repo a GitHub.
2. En Render: `New +` → **Web Service** → conecta tu repo.
3. **Runtime**: Node, **Build Command**: `npm i`, **Start Command**: `npm start`.
4. Crea una **Base de Datos PostgreSQL** en Render. Copiá el **Internal Database URL** y ponelo como `DATABASE_URL` en **Environment** del servicio web.
5. En la pestaña **Shell** del web service (o localmente con la misma URL), ejecutá:
   ```bash
   npm run db:schema
   npm run db:seeds
   ```
6. Probá `GET /` y `GET /movies` en el dominio público de Render.

## Frontend incluido (zip provisto)
En el zip `movies-app-frontend.zip` apuntá la variable/constante de base URL a tu backend (por ejemplo `https://tu-app.onrender.com`). Si el frontend busca `http://localhost:4000` por defecto, cambiá a la URL de Render para producción.

## Postman
En la raíz tenés `postman_collection.json` para importar y testear todos los endpoints. Ajustá el `{{base_url}}` en los **environments**.

¡Éxitos! 🚀
