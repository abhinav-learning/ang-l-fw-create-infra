import * as aws from "@pulumi/aws";
import * as eks from "@pulumi/eks";
import * as pulumi from "@pulumi/pulumi";
import * as awsNative from "@pulumi/aws-native";

// Create a new VPC for our cluster.
const vpc = new aws.ec2.Vpc("vpc", { 
    cidrBlock: "10.100.0.0/16",
    tags: {
        Name: "pulumi-eks-vpc",
    },
});

// Create a subnet for each AZ.
const subnet1 = new aws.ec2.Subnet("subnet-1", {
    cidrBlock: "10.100.1.0/24",
    vpcId: vpc.id,
    availabilityZone: "us-west-2a",
    tags: {
        Name: "pulumi-vpc-subnet",
    },
});

const subnet2 = new aws.ec2.Subnet("subnet-2", {
    cidrBlock: "10.100.2.0/24",
    vpcId: vpc.id,
    availabilityZone: "us-west-2b",
    tags: {
        Name: "pulumi-vpc-subnet",
    },
});

const subnet3 = new aws.ec2.Subnet("subnet-3", {
    cidrBlock: "10.100.3.0/24",
    vpcId: vpc.id,
    availabilityZone: "us-west-2c",
    tags: {
        Name: "pulumi-vpc-subnet",
    },
});

// Create an EKS cluster within our VPC.
const cluster = new eks.Cluster("eks-cluster", {
    vpcId: vpc.id,
    subnetIds: [subnet1.id, subnet2.id, subnet3.id],
    version: "1.29.2",
    desiredCapacity: 3,
    minSize: 3,
    maxSize: 3,
    instanceType: "t2.medium",
    tags: {
        Name: "pulumi-cluster",
    },
});

// Output the kubeconfig.
const kubeconfig = pulumi.output(cluster.kubeconfig);

// Store the kubeconfig in a new AWS Secrets Manager secret.
const secret = new awsNative.secretsmanager.Secret("kubeconfig-secret", {
    name: pulumi.interpolate`${cluster.name}-kubeconfig`,
    secretString: kubeconfig,
});

// Export the ID of the secrets manager secret.
export const secretId = secret.secretId;
