# Prueba Técnica: Ping Concurrente a IPs Privadas

Script en **Go** para realizar pings concurrentes a 3000 IPs privadas desde `./utils/ips_private.txt`.

## Objetivo
- Evaluar concurrencia en Go y manejo de redes.
- Leer y procesar IPs desde archivo.
- Hacer ping ICMP a múltiples hosts de manera eficiente.

## Uso
1. Colocar `ips_private.txt` en `./utils/`.
2. Ejecutar:

```bash
go run main.go
```

## Detalles
- Pool de 100 workers (`goroutines`) para pings concurrentes.
- Timeout de 2 segundos por ping.
- Librería usada: [go-ping](https://github.com/go-ping/ping).
- Rango de IPs privadas incluidos: `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`.

## Resultados
- IP que responde: `Ping exitoso a <IP>`
- IP que no responde: `No se pudo hacer ping a <IP>`

> Nota: La mayoría de las IPs pueden no responder si no existen hosts activos en la red local.

