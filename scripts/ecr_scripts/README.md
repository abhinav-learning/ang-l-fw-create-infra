# AWS ECR with Docker

## Pre-requisites
1. The Registry URL which will returned at the output the create-ecr pulumi stack deployment.
2. The registry URL and repo name has to be updated in the scripts under `<ROOT>/scripts/ecr_scripts/docker_build_ecr.sh` and `<ROOT>/scripts/ecr_scripts/docker_push_ecr.sh`
3. But the First step is to authenticate in your local or CI in Github against the registry as its done in `<ROOT>/scripts/ecr_scripts/ecr_auth.sh`
4. Once authenticated we can run the build and push script.