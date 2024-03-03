import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as kubernetes from "@pulumi/kubernetes";

// Define the secret in AWS Secrets Manager containing the kubeconfig.
const secretName = "kubeconfig-secret-name"; // replace with your secret name

// Retrieve the kubeconfig from AWS Secrets Manager.
const kubeconfigSecret = aws.secretsmanager.getSecretVersion({
    secretId: secretName,
});

// Create a kubeconfig Pulumi output that resolves once the secret is retrieved.
const kubeconfig = pulumi.secret(kubeconfigSecret.secretString);

// Use the kubeconfig to create a Kubernetes provider instance.
const k8sProvider = new kubernetes.Provider("k8s-provider", {
    kubeconfig: kubeconfig.apply(JSON.stringify), // Convert to a JSON string if necessary
});

// Define the local Kubernetes manifest file path.
const manifestFilePath = "./path/to/your/kubernetes-manifest.yaml"; // replace with your manifest file path

// Create resources from the manifest file using the Kubernetes provider.
const app = new kubernetes.yaml.ConfigFile("app", {
    file: manifestFilePath,
}, { provider: k8sProvider });

// Export the app name and status as stack outputs (optional).
export const appName = app.name;
export const appStatus = app.status;
