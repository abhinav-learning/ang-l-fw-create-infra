import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as kubernetes from "@pulumi/kubernetes";

// Load the AWS ECR repository information where the tagged Helm chart is stored
const ecrRepo = new aws.ecr.Repository("my-chart-repo");

// Get the kubeconfig from AWS Secrets Manager
const kubeconfigSecret = new aws.secretsmanager.Secret("my-kubeconfig-secret");
const kubeconfigSecretVersion = new aws.secretsmanager.SecretVersion("my-kubeconfig-secret-version", {
    secretId: kubeconfigSecret.id,
});

const kubeconfig = pulumi.secret(kubeconfigSecretVersion.secretString);

// Create a Kubernetes provider using the kubeconfig from AWS Secrets Manager
const k8sProvider = new kubernetes.Provider("k8s-provider", {
    kubeconfig: kubeconfig,
});

// Get the git-sha tag for the Docker image from CI/CD pipeline output/environment variable
// Here you should ensure that this is being passed in appropriately from your CI/CD environment
const gitShaTag = process.env.GIT_SHA_TAG || "latest"; // Replace with actual git-sha tag

// Deploy the Helm chart to the Kubernetes cluster
const helmChart = new kubernetes.helm.v3.Chart("my-chart", {
    // The chart can be from the Artifact Repository or a local path
    chart: `${ecrRepo.repositoryUrl}:my-chart-${gitShaTag}`,
    values: {
        // Any values you need to override in the Helm chart
    },
}, { provider: k8sProvider });

// Export the URL to access your service/application, could be based on a LoadBalancer, Ingress, etc.
export const appUrl = "http://example.com/"; // Replace with actual logic to get your application's URL from the Helm chart

