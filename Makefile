SHELL := /bin/bash  # Specify bash as the shell for commands

.PHONY: docker_build docker_push create_cluster create_ns deploy remove remove_ns delete_cluster kustomize_dev kustomize_prod

docker_build:
	./scripts/docker_build.sh

docker_push:
	./scripts/docker_push.sh

create_cluster:
	./scripts/create_cluster.sh

create_ns:
	./scripts/create_ns.sh 

deploy:
	./scripts/deploy.sh

remove:
	./scripts/remove.sh

remove_ns:
	./scripts/remove_ns.sh 

delete_cluster:
	./scripts/delete_cluster.sh

kustomize_dev:
	./scripts/kustomize_dev.sh

kustomize_prod:
	./scripts/kustomize_prod.sh

