export KOPS_STATE_STORE=s3://terraform-20201228191745968200000001


kops delete cluster --name sdtd.k8s.local --yes



cd terraform
terraform destroy -auto-approve