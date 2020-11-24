terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 2.70"
    }
  }
}

provider "aws" {
  profile = "default"
  region  = "us-east-1"
}

resource "aws_s3_bucket" "kube_bucket" {
  # bucket = no specified name so that terraform give a unique name to it
  acl = "private"

  versioning {
    enabled = true
  }

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }

  # otherwise you cannot destroy s3 instance with terraform destroy
  force_destroy = true

  tags = {
    Name        = "Kubernetes State"
    Environment = "Dev"
  }
}
