import * as pulumi from "@pulumi/pulumi";
import * as awsx from "@pulumi/awsx";
import * as docker from "@pulumi/docker";
import * as childProcess from "child_process";

// Create an AWS ECR repository
const repo = new awsx.ecr.Repository("my-repo");

// Retrieve the git SHA from the current commit
const gitSha = childProcess.execSync("git rev-parse HEAD").toString().trim();

// Build and tag the Docker image with the git SHA
const image = new docker.Image("my-image", {
    imageName: pulumi.interpolate`${repo.repositoryUrl}:${gitSha}`,
    build: {
        context: ".", // the directory containing your Dockerfile and source code
    },
    registry: {
        // Information required to login to AWS ECR
        server: repo.repositoryUrl,
        username: pulumi.output(repo.registryId),
        password: repo.registryPassword,
    },
});

// Export the resulting image name
export const imageName = image.imageName;
