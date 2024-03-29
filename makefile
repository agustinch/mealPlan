update-globals: 
	bash update-globals.sh
up-all:
	docker-compose up -d

up-all-prod:
	docker-compose -f docker-compose-prod.yaml up -d

up-all-dev:
	docker-compose -f docker-compose-dev.yaml down
	docker-compose -f docker-compose-dev.yaml up 

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
	docker image prune -f
	docker-compose build --no-cache client 
	docker-compose up

recreate-nginx:
	docker-compose -f docker-compose-dev.yaml rm -s -v -f nginx
	docker-compose -f docker-compose-dev.yaml build --no-cache nginx 
	docker image prune -f
	docker-compose -f docker-compose-dev.yaml up