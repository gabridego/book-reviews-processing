# How to use terraform to provision a s3 bucket
1) copy your aws credentials found in "account details" on your aws educate account to ~/.aws/credentials

2) run 'terraform init' in terraform directory, then 'terraform apply' to provision a s3 bucket to store kubernetes cluster state

3) create and build the cluster, and destroy it with kops:
https://kops.sigs.k8s.io/getting_started/aws/#prepare-local-environment
Add a SSH public key with the flag '--ssh-public-key' (compulsory)

4) destroy the s3 bucket: run 'terraform destroy'