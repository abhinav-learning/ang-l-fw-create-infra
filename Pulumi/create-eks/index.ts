import * as aws from "@pulumi/aws";
import * as eks from "@pulumi/eks";
import * as awsx from "@pulumi/awsx";

// Create a new VPC for our cluster.
const vpc = new awsx.ec2.Vpc("ang-l-fw-vpc", {
    numberOfAvailabilityZones: 2, // Ensures we have subnets in at least two AZs for high availability
});

// Create an EKS cluster with the desired configuration
const cluster = new eks.Cluster("ang-l-fw-eks-cluster", {
    vpcId: vpc.vpcId,
    privateSubnetIds: vpc.privateSubnetIds,
    publicSubnetIds: vpc.publicSubnetIds,
    desiredCapacity: 1,
    minSize: 1,
    maxSize: 1,
    instanceType: "t2.medium",
});

// Install CoreDNS add-on
const coredns = new aws.eks.Addon("coredns", {
    clusterName: cluster.eksCluster.name,
    addonName: "coredns",
    addonVersion: "v1.11.1-eksbuild.4", // Specify the appropriate version for your cluster
    resolveConflicts: "OVERWRITE",
});

// Install kube-proxy add-on
const kubeProxy = new aws.eks.Addon("kube-proxy", {
    clusterName: cluster.eksCluster.name,
    addonName: "kube-proxy",
    addonVersion: "v1.29.0-eksbuild.1", // Specify the appropriate version for your cluster
    resolveConflicts: "OVERWRITE",
});

// Install AWS VPC CNI add-on
const awsVpcCni = new aws.eks.Addon("vpc-cni", {
    clusterName: cluster.eksCluster.name,
    addonName: "vpc-cni",
    addonVersion: "v1.16.0-eksbuild.1", // Specify the appropriate version for your cluster
    resolveConflicts: "OVERWRITE",
});

// Define an IAM policy for ECR access
const ecrPolicy = new aws.iam.Policy("ang-l-fw-ecrPolicy", {
    description: "Allows EKS worker nodes to interact with ECR",
    policy: {
        Version: "2012-10-17",
        Statement: [
            {
                Action: [
                    "ecr:GetDownloadUrlForLayer",
                    "ecr:BatchGetImage",
                    "ecr:BatchCheckLayerAvailability",
                    "ecr:PutImage",
                    "ecr:InitiateLayerUpload",
                    "ecr:UploadLayerPart",
                    "ecr:CompleteLayerUpload",
                    "ecr:DescribeRepositories",
                    "ecr:GetRepositoryPolicy",
                    "ecr:ListImages",
                    "ecr:DeleteRepository",
                    "ecr:BatchDeleteImage",
                    "ecr:SetRepositoryPolicy",
                    "ecr:DeleteRepositoryPolicy"
                ],
                Effect: "Allow",
                Resource: "*"
            }
        ],
    },
});

// Attach the ECR policy to the worker node IAM role
const rolePolicyAttachment = new aws.iam.RolePolicyAttachment("ang-l-fw-ecrPolicy-ecrPolicyAttachment", {
    policyArn: ecrPolicy.arn,
    role: cluster.instanceRoles[0].name,
});