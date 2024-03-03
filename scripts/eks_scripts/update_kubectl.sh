#!/bin/bash

# Name of the AWS Secrets Manager secret containing the Kubeconfig
SECRET_NAME="ang-l-fw-kubeconfig-secret-7954fbf-ALyqVQ"

# AWS region where the secret is located
REGION="ap-south-1"

# Cluster Name
CLUSTER="ang-l-fw-eks-cluster-eksCluster-f4897e4"

# Get the Kubeconfig from AWS Secrets Manager
KUBECONFIG=$(aws secretsmanager get-secret-value --secret-id $SECRET_NAME --region $REGION --query SecretString | jq -r '.[0]')

# Check if the Kubeconfig is not empty
if [[ -z "$KUBECONFIG" ]]; then
  echo "Error: Kubeconfig not found in AWS Secrets Manager secret: $SECRET_NAME"
  exit 1
fi

# Set the current context in kubectl using the retrieved Kubeconfig
kubectl config set-credentials $CLUSTER --kubeconfig="$KUBECONFIG"

# Set the current context to the one created above
kubectl config use-context $CLUSTER

echo "Successfully updated kubectl context to use Kubeconfig from AWS Secrets Manager"
