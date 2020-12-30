# k8s

## Preparation
- uploaded images on Docker hub in order to simplify the work on AWS ==> the next step is to use images from gitlab

## What we made in steps
1) we created 3 folders inside k8s (excluding kafka and spark) ==> apiserver, webserver, db
2) inside each one of them we made a .yaml file (the one without "configmap" in the name) following some templates
3) we also added a .properties file in case we need environment variables ==> in that case we need to create another file .yaml (this time with "configmap" in the name)
    - in order to create this file then we need to:
        1) go for example to the folder webserver
        2) run the command `kubectl create configmap webserver-env-file --from-env-file=./webserver-env-file.properties --save-config`
            - if an error occurs, then run the command `kubectl delete -f .`
        3) run the command `kubectl get configmap webserver-env-file -o yaml > ./webserver-configmap.yaml`

## How to run images on AWS
1) Follow the [README file](../terraform/README.md) inside the terraform folder in order to create a kubernetes cluster inside AWS
2) We need 3 components: the webserver, the apiserver, and the database.
Run `kubectl apply -f webserver/`
For the database and apiserver you need to know if you want a replicated database or a standalone:
    - standalone: go to step 3a 
    - replicated: go to step 3b 
NOTE: if you need to modify .yaml files, then you probably need to delete and re-apply files on the cluster:
        1) modify the file
        2) `kubectl delete -f .`
        3) `kubectl apply -f .`
3a) Run the following commands:
    - `kubectl apply -f db/`
    - `kubectl apply -f apiserver/`
3b) Follow the instructions in the [README file](./my-mongo-operator/README.md)
4) Check the EXTERNAL-IP of webserver with command `kubectl get services`. Open the EXTERNAL-IP address in a browser NOTE: wait about 5 minutes before attempting to access the web site (I think because the DNS needs time to be updated)
6) You can stop everything on AWS by following instructions in the [README file](../terraform/README.md) inside the terraform folder

## useful kubectl commands
- kubectl create configmap webserver-env-file --from-env-file=./webserver-env-file.properties --save-config
- kubectl get configmap webserver-env-file -o yaml > ./webserver-configmap.yaml
- kubectl apply -f .
- kubectl delete -f .
- kubectl get services
- kubectl get nodes
- kubectl get pods
- kubectl describe svc "name of pod show in 'kubectl get services'"
- kubectl describe pods "name of pod show in 'kubectl get pods'"
- kubectl get logs
