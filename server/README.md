<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Project setup

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Instrucciones para Ejecutar el Proyecto

1. Instala las dependencias: `npm i`
2. Descarguar la imagen de Docker (esto se hace solo una vez):
   `docker pull postgres:15.3`
3. Inicie la base de datos(esto se hace solo una vez):
   `docker compose up -d`
4. Clona el archivo `.env.template` y renómbralo como `.env`
5. Actualiza las variables de entorno en el archivo `.env`
6. Inicia la aplicación: `npm run start:dev`
7. Documentación de Swagger:
   Swagger está disponible únicamente en los entornos de desarrollo (start:dev) o test (test:e2e).
   Accede a la documentación en: `http://localhost:3000/api` cuando ejecutes la aplicación en modo desarrollo o test.
   **En producción, Swagger estará deshabilitado por seguridad.**
8. Crear registros de las tablas para poder hacer las pruebas con el front.
