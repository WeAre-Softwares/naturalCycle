# Pasos para respaldar, restaurar y verificar una base de datos utilizando Docker Compose con PostgreSQL

## **Paso 1: Confirmar la configuración del respaldo automático**

En el archivo `docker-compose.yaml`, el servicio `db_backup` genera automáticamente respaldos de la base de datos en la carpeta `./backups` cada 7 días. Asegúrate de que la carpeta `backups` esté presente en tu directorio de trabajo.

---

## **Paso 2: Verificar los respaldos generados**

Los respaldos se almacenan con un nombre que incluye la fecha y hora, como `backup_YYYYMMDDHHMM.sql`. Verifica que se estén creando correctamente con el siguiente comando:

```bash
ls ./backups
```

## **Paso 3: Crear una base de datos temporal para restauración**

Antes de restaurar el respaldo, crea una base de datos vacía en el contenedor principal de PostgreSQL (naturalcycle):

```bash
docker exec -it naturalcycle psql -U ${POSTGRES_USER} -d ${POSTGRES_DB} -c "CREATE DATABASE temp_test_db;"
```

## **Paso 4: Restaurar un archivo de respaldo**

Elige un archivo de respaldo de la carpeta backups y úsalo para restaurar los datos en la base de datos temp_test_db con el siguiente comando:

```bash
docker exec -i naturalcycle psql -U ${POSTGRES_USER} -d temp_test_db < ./backups/backup_YYYYMMDDHHMM.sql
```

## **Paso 5: Verificar la restauración**

Conéctate a la base de datos temp_test_db:

```bash
docker exec -it naturalcycle psql -U ${POSTGRES_USER} -d temp_test_db
```

### Lista las tablas restauradas:

Dentro del cliente `psql`, ejecuta:

```bash
\dt
```

### Verifica los registros de una tabla específica:

Ejemplo con la tabla usuarios:

```bash
SELECT * FROM usuarios LIMIT 10;
```

## **Paso 6: Opcional: Eliminar la base de datos temporal**

Si ya no necesitas la base de datos temporal, elimínala con el siguiente comando:

```bash
docker exec -it naturalcycle psql -U ${POSTGRES_USER} -d ${POSTGRES_DB} -c "DROP DATABASE temp_test_db;"
```

## **Paso 7: Revisar y reconstruir los servicios de Docker**

Si realizaste cambios en el archivo docker-compose.yaml o en las variables de entorno (.env), sigue estos pasos para detener y reconstruir los contenedores:
Detén los contenedores existentes:

```bash
docker compose down
```

Reconstruye y levanta los contenedores:

```bash
docker compose up --build
```

Esto asegura que los cambios sean aplicados correctamente a los servicios.

Notas finales

    Frecuencia del respaldo: Los respaldos se generan automáticamente cada 7 días. Puedes ajustar este intervalo modificando el valor de sleep en la configuración de entrypoint en el servicio db_backup.
