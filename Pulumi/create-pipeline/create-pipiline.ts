import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import * as kubernetes from "@pulumi/kubernetes";

// GitHub settings
const gitHubToken = pulumi.secret("<YOUR_GITHUB_TOKEN>"); // Replace with your GitHub token
const gitHubOwner = "<GITHUB_OWNER>"; // Replace with your GitHub repository owner
const gitHubRepo = "<GITHUB_REPO_NAME>"; // Replace with your GitHub repository name

// ECR Repository
const ecrRepo = new aws.ecr.Repository("myEcrRepo");

// CodeBuild Project for building and pushing Docker image to ECR
const codeBuildProject = new aws.codebuild.Project("myCodeBuildProject", {
  environment: {
    computeType: "BUILD_GENERAL1_SMALL",
    image: "aws/codebuild/standard:5.0",
    type: "LINUX_CONTAINER",
    environmentVariables: [
      { name: "REPOSITORY_URI", value: ecrRepo.repositoryUrl },
      { name: "IMAGE_TAG", value: "latest" }, // You can specify other variables or use buildspec to define them
    ],
    privilegedMode: true,
  },
  serviceRole: "<CODEBUILD_SERVICE_ROLE>", // Replace with your CodeBuild service role ARN
  source: {
    type: "GITHUB",
    location: pulumi.interpolate`https://github.com/${gitHubOwner}/${gitHubRepo}.git`,
    auth: { type: "OAUTH", resource: gitHubToken },
  },
  artifacts: { type: "NO_ARTIFACTS" },
});

// CodePipeline
const pipeline = new aws.codepipeline.Pipeline("myPipeline", {
  roleArn: "<CODEPIPELINE_SERVICE_ROLE>", // Replace with your CodePipeline service role ARN
  artifactStore: {
    location: aws.s3.Bucket.get("codepipeline-bucket", "<BUCKET_NAME>").bucket, // Replace with your S3 Bucket name
    type: "S3",
  },
  stages: [
    {
      name: "Source",
      actions: [{
        name: "Source",
        category: "Source",
        owner: "ThirdParty",
        provider: "GitHub",
        version: "1",
        outputArtifacts: [{ name: "sourceOutput" }],
        configuration: {
          Owner: gitHubOwner,
          Repo: gitHubRepo,
          Branch: "main",
          OAuthToken: gitHubToken,
        },
      }],
    },
    {
      name: "Build",
      actions: [{
        name: "Build",
        category: "Build",
        owner: "AWS",
        provider: "CodeBuild",
        inputArtifacts: [{ name: "sourceOutput" }],
        outputArtifacts: [{ name: "buildOutput" }],
        version: "1",
        configuration: {
          ProjectName: codeBuildProject.name,
        },
      }],
    },
    {
      name: "Deploy",
      actions: [{
        name: "Deploy",
        category: "Deploy",
        owner: "AWS",
        provider: "S3",
        inputArtifacts: [{ name: "buildOutput" }],
        version: "1",
        runOrder: 1,
        configuration: {
          BucketName: "<DEPLOYMENT_BUCKET>", // Replace with your deployment S3 Bucket name
          Extract: "true",
        },
      }],
    },
  ],
  // Outputs that export the ECR Repository URL and CodePipeline ARN
}, { dependsOn: [codeBuildProject] });

// Output the ECR repository URL
export const ecrRepositoryUrl = ecrRepo.repositoryUrl;

// Output the CodePipeline ARN
export const codePipelineArn = pipeline.arn;
