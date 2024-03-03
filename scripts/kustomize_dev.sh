#!/bin/bash

kubectl apply -k k8s/kustomize/environments/development/ -n dev
