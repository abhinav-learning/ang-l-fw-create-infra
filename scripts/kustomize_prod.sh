#!/bin/bash

kubectl apply -k k8s/kustomize/environments/production/ -n prod
