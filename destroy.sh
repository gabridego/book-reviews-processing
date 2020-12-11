kops delete cluster --name sdtd.k8s.local --yes

cd terraform
terraform destroy -auto-approve