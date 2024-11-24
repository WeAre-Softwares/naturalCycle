
# Pasos para respaldar, restaurar y verificar una base de datos utilizando Docker Compose con PostgreSQL

## Paso 1: Confirmar la configuración del respaldo automático
En el archivo `docker-compose.yaml`, el servicio `db_backup` genera automáticamente respaldos de la base de datos en la carpeta `./backups` cada 7 días.  
Asegúrate de que la carpeta `backups` esté presente en tu directorio de trabajo.

---

## Paso 2: Verificar los respaldos generados
Los respaldos se almacenan con un nombre que incluye la fecha y hora, como `backup_YYYYMMDDHHMM.sql`.  
Verifica que se estén creando correctamente con el siguiente comando:

```bash
ls ./backups
```

---

## Paso 3: Acceder al contenedor de Docker
Accede al contenedor que tiene PostgreSQL con este comando:

```bash
docker exec -it naturalcycle bash
```

---

## Paso 4: Restaurar un archivo de respaldo
1. Dentro del contenedor, verifica los archivos de respaldo disponibles:
   ```bash
   ls /backups
   ```
2. Restaura el respaldo en la base de datos con el siguiente comando, reemplazando `backup_YYYYMMDDHHMM.sql` por el archivo que desees restaurar:
   ```bash
   psql -U ${POSTGRES_USER} -d ${POSTGRES_DB} < /backups/backup_YYYYMMDDHHMM.sql
   ```

---

## Paso 5: Verificar la restauración
1. Ingresa al cliente de PostgreSQL:
   ```bash
   psql -U ${POSTGRES_USER} -d ${POSTGRES_DB}
   ```
2. Lista las tablas restauradas:
   ```sql
   \dt
   ```
3. Consulta algunos registros, por ejemplo, de la tabla `usuarios`:
   ```sql
   SELECT * FROM usuarios LIMIT 10;
   ```

---

## Paso 6: Salir del contenedor
Una vez verificado, sal del contenedor:
```bash
exit
```

---

## Paso 7: Revisar y reconstruir los servicios de Docker (opcional)
Si realizaste cambios en el archivo `docker-compose.yaml` o en las variables de entorno `.env`, sigue estos pasos:

1. Detén los contenedores existentes:
   ```bash
   docker compose down
   ```
2. Reconstruye y levanta los contenedores:
   ```bash
   docker compose up --build
   ```

---

## Notas finales
- **Frecuencia del respaldo**: Los respaldos se generan automáticamente cada 7 días.  
  Puedes ajustar este intervalo modificando el valor de `sleep` en la configuración del `entrypoint` en el servicio `db_backup`.

