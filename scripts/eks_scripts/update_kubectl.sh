#!/bin/bash

# AWS region where the secret is located
REGION="ap-south-1"

# Cluster Name
CLUSTER="ang-l-fw-eks-cluster-eksCluster-f4897e4"

aws eks update-kubeconfig --name $CLUSTER --region $REGION
