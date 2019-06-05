#! /bin/bash

echo "Installing serverless plugins"
echo "====================="
npm install -g serverless@1.41.1
npm install serverless-plugin-typescript serverless-offline serverless-plugin-include-dependencies

echo "code build dir $CODEBUILD_SRC_DIR"
ls $CODEBUILD_SRC_DIR
ls $CODEBUILD_SRC_DIR/artifacts/$env

echo "Deploying app to $env"
echo "====================="
serverless deploy --stage $env --package $CODEBUILD_SRC_DIR/artifacts/$env -v