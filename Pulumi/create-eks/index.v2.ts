import * as aws from "@pulumi/aws";
import * as eks from "@pulumi/eks";
import * as pulumi from "@pulumi/pulumi";

// Create an IAM role with the necessary EKS policies and ECR full access
const eksRole = new aws.iam.Role("eksRole", {
    assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
        Service: "eks.amazonaws.com",
    }),
});

const eksPolicies = [
    "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy",
    "arn:aws:iam::aws:policy/AmazonEKSServicePolicy",
    "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryFullAccess",
];

eksPolicies.forEach((policyArn, index) => {
    new aws.iam.RolePolicyAttachment(`eksRolePolicy-${index}`, {
        role: eksRole,
        policyArn: policyArn,
    });
});

// Create a VPC for our cluster
const vpc = new aws.ec2.Vpc("eksVpc", {
    cidrBlock: "10.100.0.0/16",
    enableDnsHostnames: true,
    enableDnsSupport: true,
});

// Create subnets for the EKS cluster
const subnet = new aws.ec2.Subnet("eksSubnet", {
    vpcId: vpc.id,
    cidrBlock: "10.100.1.0/24",
    availabilityZone: "us-west-2a",
    mapPublicIpOnLaunch: true,
});

// Create an EKS cluster
const cluster = new eks.Cluster("eksCluster", {
    vpcId: vpc.id,
    subnetIds: [subnet.id],
    instanceType: "t2.medium",
    desiredCapacity: 2,
    minSize: 1,
    maxSize: 2,
    roleMappings: [{
        roleArn: eksRole.arn,
        groups: ["system:masters"],
        username: "pulumi:admin",
    }],
    createOidcProvider: true,
});

// Define the node group for the EKS cluster
const nodeGroup = new eks.NodeGroup("eksNodeGroup", {
    cluster: cluster,
    instanceType: "t2.medium",
    desiredCapacity: 2,
    minSize: 1,
    maxSize: 3,
    labels: { "ondemand": "true" },
    subnetIds: [subnet.id],
}, { provider: cluster.provider });

// Export the cluster's kubeconfig
export const kubeconfig = cluster.kubeconfig;

// Export the IAM role ARN
export const eksRoleArn = eksRole.arn;

// Export the Node Group details
export const nodeGroupInstanceProfile = nodeGroup.instanceProfile;
export const nodeGroupInstanceProfileArn = nodeGroup.instanceProfile.apply(p => p.arn);
