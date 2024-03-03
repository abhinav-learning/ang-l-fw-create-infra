#!/bin/bash

kind delete cluster --name ang-l-fw
kubectl config delete-context kind-ang-l-fw
kubectl config delete-cluster kind-ang-l-fw