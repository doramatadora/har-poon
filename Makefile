TAG = latest
NAME = har-poon

.PHONY: image
image:
	@docker build -t ${NAME}:${TAG} .

.PHONY: run
run: 
	docker run --rm -p 3000:3000 -e NODE_ENV=production --name ${NAME} ${NAME}:${TAG}

.PHONY: stop-image
stop:
	docker stop ${NAME}
