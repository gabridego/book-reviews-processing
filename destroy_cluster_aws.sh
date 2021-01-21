START_TIME=$( date +%s )
export KOPS_STATE_STORE=s3://sdtd-demo


kops delete cluster --name sdtd.k8s.local --yes



cd terraform
terraform destroy -auto-approve
echo Elapsed time: $(( $(date +%s)-START_TIME ))