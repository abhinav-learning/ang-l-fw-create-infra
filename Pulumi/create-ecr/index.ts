import * as aws from "@pulumi/aws";

// Create an ECR Repository named 'ang-l-fw'
const repository = new aws.ecr.Repository("ang", {
    name: "ang-l-fw",
    imageScanningConfiguration: {
        scanOnPush: true,
    },
    imageTagMutability: "MUTABLE",
});

// Export the repository URL
export const repositoryUrl = repository.repositoryUrl;
