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

If you need a console to the docker image, run:

```
npm run docker:dev:console
```

## Update Docker Image

If you make changes to package.json or the Dockerfile you should recreate the docker image.

```
npm run docker:update
```
