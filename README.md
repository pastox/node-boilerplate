# Welcome to my node boilerplate application repository

## Set up: 2 options: Local or Docker

Copy the content of `.env.template` file in a new file called `.env` and fill in the gaps

### Local option

Install the dependencies

```bash
npm install
```

Run the application locally

```bash
npm run start:dev
```

### Docker option

Build the docker image

```bash
docker build -t node-boilerplate .
```

Run the docker image in a container

```bash
docker run -p 6710:6710 node-boilerplate
```

## To-Do

* Add an index datastore file for various DB providers (mongoDB, mySQL) with general functions ready for use
* Add a consumer service for event queues
* Add a producer service for event queues
* Integrate ELK stack for analysing logs
* Integrate a monitoring solution
