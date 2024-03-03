import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as kubernetes from "@pulumi/kubernetes";
import * as fs from "fs";
import * as https from "https";

// Define the secret in AWS Secrets Manager containing the kubeconfig.
const secretName = "kubeconfig-secret-name"; // replace with your secret name that contains the kubeconfig

// Retrieve the kubeconfig from AWS Secrets Manager.
const kubeconfigSecret = aws.secretsmanager.getSecret({
    name: secretName,
});

// Create a kubeconfig Pulumi output that resolves once the secret is retrieved.
const kubeconfig = pulumi.secret(kubeconfigSecret.then(secret => {
    if (!secret.arn) {
        throw new Error("Secret with kubeconfig not found");
    }
    return aws.secretsmanager.getSecretVersion({ secretId: secret.arn });
})).apply(secretVersion => {
    // The kubeconfig is stored in the `secretString` property.
    return secretVersion.secretString || "";
});

// Use the kubeconfig to create a Kubernetes provider instance.
const k8sProvider = new kubernetes.Provider("k8s-provider", {
    kubeconfig: kubeconfig.apply(config => config),
});

// Define the GitHub repository URL where the Kubernetes manifest is located.
const gitHubRepoUrl = "https://raw.githubusercontent.com/your-org/your-repo/your-branch/your-path-to-manifests/"; // replace with your GitHub repo details

// Define the filenames of the Kubernetes manifests in the repository.
const manifestFilenames = ["deployment.yaml", "service.yaml"]; // add or remove files as needed

// For each manifest file in the list, get the content from GitHub and apply it to the cluster.
manifestFilenames.forEach((filename, index) => {
    const manifestUrl = `${gitHubRepoUrl}${filename}`;

    const manifest = new kubernetes.yaml.ConfigGroup(`manifest-${index}`, {
        files: [manifestUrl],
    }, { provider: k8sProvider });

    // Optional: Export each manifest's resource names as stack outputs.
    pulumi.all(manifest).apply(resources => {
        resources.forEach((resource, resourceIndex) => {
            pulumi.export(`resourceName-${index}-${resourceIndex}`, resource.metadata.name);
        });
    });
});
