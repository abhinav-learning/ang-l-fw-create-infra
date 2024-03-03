import * as aws from "@pulumi/aws";

// Create an ECR Repository named 'ang-l-fw-be'
const repository = new aws.ecr.Repository("ang", {
    name: "ang-l-fw-be",
    imageScanningConfiguration: {
        scanOnPush: true,
    },
    imageTagMutability: "MUTABLE",
});

// Export the repository URL
export const repositoryUrl = repository.repositoryUrl;
