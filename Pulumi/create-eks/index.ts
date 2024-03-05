import * as eks from "@pulumi/eks"
import * as aws from "@pulumi/aws"
import {createVpc} from "./vpc";

const name = "ang-eks-vpc";
const tags = { "Project": "ang-webapp", "Owner": "ang-eks"};

// Create a VPC with public & private subnets across all AZs.
const vpc = createVpc({name, tags});

// Create an EKS cluster with the default VPC, and default node group with 
// two t2.medium node instances.
const cluster = new eks.Cluster("ang-eks", {
    name: "ang-eks-cluster",
    vpcId: vpc.vpcId,
    publicSubnetIds: vpc.publicSubnetIds,
    privateSubnetIds: vpc.privateSubnetIds,
    deployDashboard: false,
    nodeAssociatePublicIpAddress: false,
    tags,
});

// Define the CoreDNS add-on
const corednsAddon = new aws.eks.Addon("coredns-addon", {
    clusterName: cluster.eksCluster.name,
    addonName: "coredns",
    addonVersion: "v1.11.1-eksbuild.4", // Specify the version you want to use
});

// Define the kube-proxy add-on
const kubeProxyAddon = new aws.eks.Addon("kube-proxy-addon", {
    clusterName: cluster.eksCluster.name,
    addonName: "kube-proxy",
    addonVersion: "v1.29.0-eksbuild.1", // Specify the version you want to use
});

// Define the Amazon VPC CNI add-on
const vpcCniAddon = new aws.eks.Addon("vpc-cni-addon", {
    clusterName: cluster.eksCluster.name,
    addonName: "vpc-cni",
    addonVersion: "v1.16.0-eksbuild.1", // Specify the version you want to use
});


export const kubeconfig = cluster.kubeconfig;
