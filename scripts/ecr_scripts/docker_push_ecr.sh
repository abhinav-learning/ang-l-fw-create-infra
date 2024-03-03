#!/bin/bash

# Get the last commit SHA (short version)
commit_sha=$(git rev-parse --short HEAD)
registry_url="471112869603.dkr.ecr.ap-south-1.amazonaws.com/"
repo_name="ang-l-fw-be"

docker push ${registry_url}${repo_name}:${commit_sha}
docker push ${registry_url}${repo_name}:latest
echo "Successfully puished image ${registry_url}${repo_name}"
