---
title: "Terraform on AWS: An introductory guide"
---
In this article, I discuss Terraform on AWS: An introductory guide

Terraform Overview
When people hear the term terraform, they often think of terraforming planets—a concept popularized by scientists and visionaries like Elon Musk, who envisions making Mars habitable. In this case, terraform means developing a rock or dead planet that is inhabitable so that it can have the necessary conditions to be able to sustain life. Terraforming Mars would involve generating an atmosphere, introducing water sources, and fostering plant life to create conditions where humans could survive. Similarly, in the world of software development, HashiCorp’s Terraform follows the same principle—except instead of reshaping planets, it transforms cloud platforms like AWS, GCP, and vSphere, or on premise resources, into structured environments where applications can thrive. Just as planetary terraforming establishes the foundation for life, Terraform as Infrastructure-as-Code (IaC) lays the groundwork for scalable and automated infrastructure where software can run seamlessly.

What is Terraform?
Terraform is an Infrastructure as Code (IaC) tool developed by HashiCorp. It allows users to define cloud and on-premises infrastructure using human-readable configuration files. The tool provides a consistent workflow to provision, manage, and automate infrastructure across its lifecycle.

Why Use Terraform?
Simplicity – All infrastructure is defined in a single file, making it easy to track changes.
Collaboration – Code can be stored in version control systems like GitHub for team collaboration.
Reproducibility – Configurations can be reused for different environments (e.g., development and production).
Resource Cleanup – Ensures unused resources are properly destroyed to avoid unnecessary costs.
What Terraform is NOT
Not a Software Deployment Tool – It doesn’t manage or update software on existing infrastructure.
Cannot Modify Immutable Resources – Some changes (e.g., VM type) require destroying and recreating the resource.
Does Not Manage External Resources – Terraform only manages what is explicitly defined in its configuration files.
Terraform Workflow
Terraform Installed Locally – The CLI runs on a user’s machine.
Uses Providers – These connect Terraform to cloud services (AWS, Azure, GCP, etc.).
Authentication Required – API keys or service accounts authenticate access to cloud platforms.
Terraform Installation
Go to this link and follow the command that match your system’s specification

Key Terraform Commands
terraform init – Downloads provider plugins and initializes the working directory.
terraform plan – Shows what changes Terraform will make before applying them.
terraform apply – Provisions the defined infrastructure.
terraform destroy – Removes all resources defined in the Terraform configuration.
Terraform Files and Their Generation
Terraform uses several files to manage your infrastructure state, configuration, and dependencies. Below is an overview of the key files, what they represent, and which Terraform command triggers their creation or update:

Configuration Files (*.tf files):

Purpose: These files (such as main.tf, variables.tf, outputs.tf, etc.) are written by you to define your infrastructure. They describe the resources you wish to provision and how they interrelate.
When They Are Created: You create these manually. They form the blueprint for Terraform to understand and manage your environment.
Terraform State File (terraform.tfstate):

Purpose: This file tracks the current state of your infrastructure. It maps your configuration to the real-world resources, ensuring that Terraform can determine what changes need to be made.
When It Is Generated/Updated:
After terraform apply: When you run terraform apply, Terraform provisions your infrastructure based on your configuration. During this process, it creates or updates the terraform.tfstate file with the current state of the resources.
After terraform destroy: Similarly, when you destroy resources, the state file is updated to reflect that the resources no longer exist.
Terraform Lock File (.terraform.lock.hcl):

Purpose: This file locks the versions of the provider plugins used in your configuration to ensure consistency and prevent unexpected changes from newer versions.
When It Is Generated/Updated:
After terraform init: Running terraform init downloads the required provider plugins and creates the .terraform.lock.hcl file. This ensures that every team member or CI/CD pipeline uses the same provider versions.
Terraform Directory (.terraform):

Purpose: This hidden directory stores downloaded provider plugins, module sources, and backend configuration. It is essential for Terraform's operation.
When It Is Generated:
After terraform init: The .terraform directory is automatically created when you initialize your Terraform working directory using terraform init.
Plan Output File (optional):

Purpose: If you choose to save the execution plan to a file (using the -out flag with terraform plan), this binary file captures the set of changes Terraform intends to make.
When It Is Generated:
After terraform plan -out=<filename>: Running this command generates a plan file that can later be applied using terraform apply <filename>. This is useful for reviewing changes or automating deployment workflows.
Configure aws credentials locally
This is important if you want to be able to access your aws account and resources on your terminal or inside your code using an sdk such as boto3.
There might be other ways to do this but I will list 2 here:
aws configure
Export the credentials as environment variables

1. aws configure
To use this, you will need to install aws-cli which you can do from here.

I found that sudo apt install aws-cli or pip3 install aws-cli worked just as well for me.

You can confirm that you have installed it by checking it’s version as below:

aws --version
To configure your credentials locally, you will need to create an IAM user and give them some permissions.

Log onto your aws console
Navigate to the IAM section
Create a new user and grant them the required permissions
Download the access key and secret key as csv of that user and store it securely. I prefer this rather than just copying them from the console. Just make sure not to commit them publicly. For example, if you’re working on a repository that has a remote version in github/gitlab/bitbucket etc then consider adding the csv to your git ignore before adding, committing and pushing changes
Now, run the following command to configure your credentials locally.

aws configure
You will be prompted to enter the access key id, secret access key, region, and output format (choose json, text, or table, default is json). Once you fill them, it creates 2 files in the ~/.aws directory: credentials and config. The credentials file contains the access key and secret key. The config file contains the region and output format.

To test if you have access to your aws account from your local terminal, create a dummy s3 bucket then run the following command to list your buckets:

aws s3 ls
2. Export the credentials as environment variables
Run the following command on your terminal, replacing the stringed text with your actual values:

export AWS_ACCESS_KEY_ID="your-access-key-id"
export AWS_SECRET_ACCESS_KEY="your-secret-access-key"
export AWS_DEFAULT_REGION="your-region"
Terraform, Boto3, and AWS CLI will automatically use these from the environment variables or the files in the ~/.aws directory

*Managing resources on terraform *
Create a main.tf file in the folder you are working in and save the following code in the file:


terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "5.85.0"
    }
  }
}

provider "aws" {
  # Configuration options
  region = "your-region"
}

# Variable definitions
variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "your-region"
}

resource "aws_s3_bucket" "example" {
  bucket = "my-tf-test-bucket-${random_id.bucket_suffix.hex}" # Make bucket name unique

  tags = {
    Name        = "My bucket"
    Environment = "Dev"
  }
}

# Add a random suffix to ensure bucket name uniqueness
resource "random_id" "bucket_suffix" {
  byte_length = 4
}

Replace “your-region” with your actual region.

Now we can run the terraform commands.

1. Initialize terraform in your folder
Run the following command:

terraform init
It initializes the backend and provider plugins. It also creates a lock file .terraform.lock.hcl to record the provider selections. It also creates a .terraform folder. Include this file in your version control repository so that Terraform can guarantee to make the same selections by default when
you run "terraform init" in the future.

2. Plan
Run the following command to see any changes that are required for your infrastructure:

terraform plan
It generates an execution plan based on the code in main.tf. At the end of the output there is a summary that looks like the below:

Plan: 2 to add, 0 to change, 0 to destroy.

Changes will be suggested which you can agree to by running the apply command explained below. You can save the plan by using the out flag:

terraform plan -out=filepath-to-save-file
3. Apply
To apply the changes suggested run the command:

terraform apply
You will be prompted to confirm by typing yes. Be careful as this does create the resources thus you will incur costs on your aws account unless you have cloud credits or are using the free tier.

After typing yes, go to the console and navigate to the s3 section. Check if you have a new bucket created. Alternatively, you can run the following command to list your buckets:

aws s3 ls
If you had previously saved your plan to a file, please run the following command to apply that plan:

terraform apply “filename”
4. Delete
Run the following command to delete the resources provisioned by terraform

terraform destroy
Your resources marked for deletion will be listed and you will again be prompted for confirmation. Confirm by typing yes.

Summary
This guide walks you through setting up AWS credentials locally using both the AWS CLI configuration and environment variables, and demonstrates how to manage AWS resources with Terraform. You learned how to write a basic Terraform configuration to create an S3 bucket, initialize your project, preview changes with a plan, apply those changes, and ultimately destroy the resources when they are no longer needed. This systematic approach to infrastructure management not only ensures consistency and repeatability but also aligns with modern DevOps best practices.
