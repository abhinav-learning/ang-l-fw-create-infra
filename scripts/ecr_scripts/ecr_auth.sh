#!/bin/bash
registry_url="471112869603.dkr.ecr.ap-south-1.amazonaws.com"
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin ${registry_url}