import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const eks_cluster_101 = new aws.eks.Cluster("eks-cluster-101", {
    accessConfig: {
        authenticationMode: "API_AND_CONFIG_MAP",
    },
    kubernetesNetworkConfig: {
        ipFamily: "ipv4",
        serviceIpv4Cidr: "10.100.0.0/16",
    },
    name: "eks-cluster-101",
    roleArn: "arn:aws:iam::471112869603:role/eks-cluster-role-101",
    version: "1.29",
    vpcConfig: {
        endpointPrivateAccess: true,
        publicAccessCidrs: ["0.0.0.0/0"],
        securityGroupIds: ["sg-08f0746a786abc737"],
        subnetIds: [
            "subnet-0a54041b9814e3987",
            "subnet-03cf813d1c25821dc",
        ],
    },
}, {
    protect: true,
});