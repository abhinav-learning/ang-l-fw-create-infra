# Deployment

To perform an initial deployment, run `pulumi up` or `pulumi up -y` if you want to skip the approval process.

# OutPut To be noted
- repositoryUrl: as shown in the example below
```shell
Outputs:
    repositoryUrl: "471112869603.dkr.ecr.ap-south-1.amazonaws.com/ang-l-fw"
```

# To Destroy the Stack
Run the Command `pulumi destroy -y`

# To Clear the Stac
Run the Command `pulumi stack rm ecr`