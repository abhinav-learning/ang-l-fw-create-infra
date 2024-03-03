#!/bin/bash

# Get the last commit SHA (short version)
commit_sha=$(git rev-parse --short HEAD)

# Check if git command succeeded
if [ $? -eq 0 ]; then
  # Build the image tag using the commit SHA
  image_tag="abhiit89/ang-l-fw-be:${commit_sha}"

  # Build the Docker image (adjust path to Dockerfile if needed)
  docker build --no-cache -t $image_tag -t abhiit89/ang-l-fw-be:latest .
  echo "Successfully built and tagged image: $image_tag"
else
  echo "Error: Failed to get the last commit SHA"
  exit 1
fi
