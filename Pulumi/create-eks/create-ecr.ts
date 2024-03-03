import * as aws from "@pulumi/aws";

// Create an ECR repository
const repository = new aws.ecr.Repository("my-repository", {
    imageScanningConfiguration: { scanOnPush: true },
    imageTagMutability: "MUTABLE",
    // ECR repositories are immutable by default, but can be set to mutable.
});

// Get an authentication token for the ECR repository
const authToken = aws.ecr.getCredentials({
    registryId: repository.registryId,
}, { async: true }).then(creds => creds.authorizationToken);

// Store the non-expiring authentication token in AWS Secrets Manager
const secret = new aws.secretsmanager.Secret("ecrAuthToken", {
    name: "ecrAuthToken",
    description: "ECR repository authentication token",
});

new aws.secretsmanager.SecretVersion("ecrAuthTokenVersion", {
    secretId: secret.id,
    secretString: authToken,
});

// Export the repository URL and secret ARN
export const repositoryUrl = repository.repositoryUrl;
export const secretArn = secret.arn;
