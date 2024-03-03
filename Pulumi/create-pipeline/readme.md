Below is the Pulumi program written in TypeScript that creates an AWS CodePipeline that triggers on a code merge to the main branch of a GitHub repository. The pipeline compiles the Next.js app, builds a Docker image, tags it with the Git SHA, generates the Helm chart also tagged with the Git SHA, and pushes the image to AWS ECR.

Ensure you have the necessary IAM roles and policies set up to allow CodeBuild, CodePipeline, and ECR to interact. For the GitHub source, you will need a personal access token with the required permissions and the GitHub repository's owner and name.


Make sure to replace placeholders like <YOUR_GITHUB_TOKEN>, <GITHUB_OWNER>, <GITHUB_REPO_NAME>, <CODEBUILD_SERVICE_ROLE>, <CODEPIPELINE_SERVICE_ROLE>, and <BUCKET_NAME> with actual values.

The above program does not directly generate Helm charts – this process is typically done by a build step in the CodeBuild project. It would be specified in a buildspec.yml file included in your repository. In this buildspec file, you can define commands to generate and push the Helm chart to a repository, perhaps using tooling such as Helm itself or a Pulumi program to manage the Kubernetes resources.

This program also omits aspects like handling Helm for brevity and because the specifics of Helm chart generation and publishing can depend on personal or organizational workflows and preferences.