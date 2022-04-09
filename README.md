# Projet SDTD

## Structure of the project
There are different folders and files organized in this way:
1) "components" folder: contains some applications of our final system that run on docker;
2) "docker" folder: contains docker compose file to run some components and used at the beginning of development;
3) "k8s" folder: contains all yaml files needed to run services on a cluster and some script to automate deployment;
4) "spark" folder: code of spark;
5) "terraform" folder: terraform files for provisioning of a S3 bucket;
6) root folder: script for creation and destruction of a EC2 instances.

## Running services on AWS

### Requirements
1) Have available in our system the commands: kubectl, kops, terraform, spark-submit;
2) Credentials of AWS set on local machine

### Steps
1) go to root folder
2) run `./init_cluster_aws.sh`
3) when asked, set minSize and maxSize to 8 and save it
4) wait the end of execution and check that everything worked without errors
5) go to k8s folder
6) run `./run_k8s_withreplicas.sh`
7) check that all pods are running with the command `kubectl get pods`
8) run `kubectl get services` and reach the address of "api-gateway" to show the web page
9) (optional) send a review by this page, or run the automatic stress client with the command `kubectl apply -f ./client`
10) (optional) to stop the automatic stress client run `kubectl delete -f ./client`
11) run `kubectl get services -n monitoring` and reach the address of "grafana" or "prometheus" services to show monitoring pages
12) when finished run `./stop_k8s.sh`
13) go to root folder again
14) run `./destroy_cluster_aws.sh`

## Notes
The project was initially hosted on *GitLab*. Docker images are therefore hosted in a private container registry, but can be replicated with the provided docker files (`docker build`). For buildin spark images, follow the official [guide](https://spark.apache.org/docs/latest/running-on-kubernetes.html#docker-images).
