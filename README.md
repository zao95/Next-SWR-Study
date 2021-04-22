# Next-Serverless-Template

AWS Serverless service for NextJS

## Feature

1.  Automate deployment file caching reset.
2.  Dev/prod-separated deploy.
3.  Fully Automated CI/CD.
4.  Better security with CI/CD variables.
5.  Support for GitLab CI/CD and GitHub Action.
6.  Bundle both image files and scripts.
7.  Deploy scripts to implement nextJS' Serverless Service on its own.
8.  Optimize prices due to Serverless Service.
9.  Dev/prod integrated deploy script.

## Usage

1.  Set up aws s3 and cloudfront.
2.  Create aws iam user for edit s3 and cloudfront invalidation.
3.  Set the ci/cd variable in gitlab or github.
    -   DEV_AWS_ACCESS_KEY_ID
    -   DEV_AWS_SECRET_ACCESS_KEY
    -   DEV_DISTRIBUTION_ID
    -   DEV_S3_BUCKET
    -   PROD_AWS_ACCESS_KEY_ID
    -   PROD_AWS_SECRET_ACCESS_KEY
    -   PROD_DISTRIBUTION_ID
    -   PROD_S3_BUCKET
4.  Now, if you ask the dev branch for merge request / pull request, it is deployed as dev, and if you create a new tag, it is deployed as prod.