# How to use terraform to provision a s3 bucket
1) copy your aws credentials found in "account details" on your aws educate account to ~/.aws/credentials

2) run 'terraform init' in terraform directory, then 'terraform apply' to provision a s3 bucket to store kubernetes cluster state

3) create and build the cluster, and destroy it with kops:
https://kops.sigs.k8s.io/getting_started/aws/#prepare-local-environment
Add a SSH public key with the flag '--ssh-public-key' (compulsory)

To create the cluster
$ export KOPS_STATE_STORE=s3://<bucket_name>
$ export NAME=name.cluster.k8s.local
$ kops create cluster ${NAME} --zones=us-east-1c
$ kops update cluster --name ${NAME} --yes
$ kops validate cluster --wait 10m
$ kubectl create secret docker-registry regcred --docker-server=gitlab.ensimag.fr:5050 --docker-username=<username_gitlab> --docker-password=<password_gitlab>
$ kubectl apply -f example_cluster_pod.yml

To destroy the cluster
$ kops delete cluster  ${NAME} --yes

4) destroy the s3 bucket: run 'terraform destroy'
