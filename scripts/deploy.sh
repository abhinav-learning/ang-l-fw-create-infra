#!/bin/bash

kubectl apply -f k8s/manifests/deployment.yaml -n dev
kubectl apply -f k8s/manifests/service.yaml -n dev