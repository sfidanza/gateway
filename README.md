# Gateway

This Traefik reverse-proxy gateway allows to shell multiple apps, so that:

- apps can be deployed in their own container on the server or internal network, but still share the 80/443 http/s port (gateway routes the request)
- an https entry point can be easily provided for any app, with centralized (and automatic) ssl certificate renewal
- services can be independently undeployed and redeployed (auto-discovered by the gateway)

## Start the gateway

The gateway needs an overlay network to communicate with services endpoints. It only needs to be created once. Gateway itself can be deployed and undeployed as a standard stack:

    docker network create --driver=overlay gateway
    
    # Deploy
    docker stack deploy -c gateway-traefik/docker-compose.yml gateway

    # Undeploy
    docker stack rm gateway

The Traefik web UI can be accessed at <http://localhost:8080> (or <http://[IP-ADDRESS]:8080>), if it is enabled in `docker-compose` (`api.insecure=true`). It will list services as they are discovered and exposed.

## Deploy services

To expose a service, it should simply be reachable through the `gateway` overlay network and define the necessary `traefik` labels for proper routing. A example can be found in the `app1` and `app2` subfolders. Then, deployment should be done similar to this:

    docker stack deploy -c app1/docker-compose.yml -c app1/docker-compose.traefik.yml app1
    docker stack deploy -c app2/docker-compose.yml -c app2/docker-compose.traefik.yml app2

To shut down the services

    docker stack rm app1
    docker stack rm app2

To get info or debug

    docker stack ls                   # list all running stacks
    docker stack services app1        # list services inside a stack
    docker stack ps app1              # list all containers inside a stack (to detect fail loops)
    docker service logs app1_nginx    # show logs for a service

Once deployed and auto-discovered by Traefik:

- app1 should be reachable on <http://app1.localhost/>, redirected to https
- app2 should be reachable on <http://app2.localhost/>, redirected to https

This local deployment may need the following entries in your `hosts` file:

    127.0.0.1 app1.localhost
    127.0.0.1 app2.localhost

## Local dev on app

Working on `app` in local dev does not require `gateway` to be deployed. From the `app` folder:

    docker-compose up -d --build
    docker-compose down

The reason is the `docker-compose.override.yml` that defines an external port on the host to reach the service directly. In production deployment, this port is not exposed and the service can only be accessed through the gateway.

## References

- <https://doc.traefik.io/traefik/>
- <https://dockerswarm.rocks/traefik/>
- <https://jensknipper.de/blog/traefik-http-to-https-redirect/>
