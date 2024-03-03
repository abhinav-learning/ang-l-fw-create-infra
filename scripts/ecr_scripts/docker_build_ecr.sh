#!/bin/bash

# Get the last commit SHA (short version)
commit_sha=$(git rev-parse --short HEAD)
registry_url="471112869603.dkr.ecr.ap-south-1.amazonaws.com/"
repo_name="ang-l-fw-be"

# Check if git command succeeded
if [ $? -eq 0 ]; then
  # Build the image tag using the commit SHA
  image_tag="${registry_url}${repo_name}:${commit_sha}"

  # Build the Docker image (adjust path to Dockerfile if needed)
  docker build --no-cache -t $image_tag -t ${registry_url}${repo_name}:latest .
  echo "Successfully built and tagged image: $image_tag"
else
  echo "Error: Failed to get the last commit SHA"
  exit 1
fi