cd terraform
terraform init
terraform apply -auto-approve

cd ..

export KOPS_STATE_STORE=s3://sdtd-test

kops create cluster --zones=us-east-1a sdtd.k8s.local
kops update cluster --name sdtd.k8s.local --yes

kops validate cluster --wait 10m