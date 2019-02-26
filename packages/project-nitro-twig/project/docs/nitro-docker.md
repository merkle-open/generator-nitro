# Nitro usage with docker

This feature is currently in experimental status.

Of course docker must be installed.

## Production mode

To start in production mode (prototype server):

```
npm run docker:prod
```

## Development mode

To start in development mode:

```
npm run docker:start
```

⚠ Live reload for windows only works with an additional tool:

Install [docker-windows-volume-watcher](https://github.com/merofeev/docker-windows-volume-watcher)
and run:

```
npm run docker:dev:watch
```

If you need a console to the docker image, run:

```
npm run docker:dev:console
```

## Update Docker Image

If you make changes to package.json or the Dockerfile you should recreate the docker image.

```
npm run docker:update
```
