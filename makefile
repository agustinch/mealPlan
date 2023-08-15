update-globals: 
	bash update-globals.sh
up-all:
	docker-compose up

dba-up:
	docker-compose up dba

recreate-api-client:
	docker-compose up api client -d --force-recreate --build

rebuild-docker:
	docker-compose rm -s -v -f client api
	docker-compose build --no-cache api client 
	docker image prune -f
	docker-compose up

recreate-api:
	docker-compose rm -s -v -f api
	docker-compose build --no-cache api 
	docker image prune -f
	docker-compose up

recreate-client:
	docker-compose rm -s -v -f client
	docker-compose build --no-cache client 
	docker image prune -f
	docker-compose up