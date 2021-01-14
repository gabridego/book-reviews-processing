export KOPS_STATE_STORE=s3://sdtd-demo


kops delete cluster --name sdtd.k8s.local --yes



cd terraform
terraform destroy -auto-approve