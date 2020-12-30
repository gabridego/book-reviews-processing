# How to use terraform to provision a s3 bucket for k8s
1) Copy your aws credentials found in "account details" on your aws educate account to ~/.aws/credentials

2) Run `terraform init` in terraform directory, then `terraform apply` to provision a s3 bucket to store kubernetes cluster state

# Use s3 bucket to create a cluster on aws
## Official kops tutorial
Follow complete instructions in [link](https://kops.sigs.k8s.io/getting_started/aws/#prepare-local-environment) for official tutorial.
NOTE: Add a SSH public key with the flag '--ssh-public-key' (compulsory if a `id_rsa.pub` file is not found in current directory)

## My own way
### To create the cluster
#### Variables
- S3 bucket address
`$ export KOPS_STATE_STORE=s3://$(terraform output bucket_name | jq -r .)`
- cluster name with gossip DNS
`$ export NAME=name.cluster.k8s.local`
- SSH public key to connect via SSH to the AWS machines.
`$ SSH_KEY=/path/to/ssh/public/key`
#### Create cluster
`$ kops create cluster ${NAME} --cloud aws --zones=us-east-1a,us-east-1b,us-east-1c --ssh-public-key $SSH_KEY`
`$ kops update cluster --name ${NAME} --yes`
#### Validating cluster (optional)
`$ kops validate cluster --wait 10m`

### Secrets
Necessary to pull docker images from a private registry.
#### Manually
`$ kubectl create secret docker-registry regcred --docker-server=gitlab.ensimag.fr:5050 --docker-username=<username_gitlab> --docker-password=<password_gitlab>`
#### File
`$ kubectl apply -f secret.yaml`

### To destroy the cluster
1) `$ kops delete cluster  ${NAME} --yes`
2) destroy the s3 bucket: run `terraform destroy``

### Scale up/down
Run `kops edit ig nodes` to access current file-based instance group configuration.
Change the node counts attributes to the desired numbers, it is '2' by default.
Save your changes and quit your editor.
Run `kops update cluster ${NAME}` to apply your changes.
This is needed to get a replicated database
