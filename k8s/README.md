# k8s

## Preparation
Docker images on Gitlab's registry
A secret to access them:
    - A yaml [file](./secret.yaml)
    - The imagePullSecrets attribute in deployments yaml files


## What we made in steps
1) We created 3 folders inside k8s (excluding kafka and spark): apiserver, webserver, db
2) Inside each one of them we made a .yaml file (the one without "configmap" in the name) following some templates
3) We also added a .properties file for environment variables. Kubernetes needs a .yaml file (this time with "configmap" in the name)
    - in order to create this file then we need to:
        1) go for example to the folder webserver
        2) run the command `kubectl create configmap webserver-env-file --from-env-file=./webserver-env-file.properties --save-config`
            - if an error occurs, then run the command `kubectl delete -f .`
        3) run the command `kubectl get configmap webserver-env-file -o yaml > ./webserver-configmap.yaml`

## How to run images on AWS
1) Follow the instructions in the [terraform](../terraform/) folder in order to create a kubernetes cluster inside AWS
2) We need 3 components: the webserver, the apiserver, and the database.
Run `kubectl apply -f webserver/`
For the database and apiserver you need to know if you want a replicated database or a standalone:
    - standalone: go to step 3a 
    - replicated: go to step 3b 
3) Do not follow both points a) and b), but only one among the two.
    - 3a) Run the following commands:
        - `kubectl apply -f db/`
        - `kubectl apply -f apiserver/`
    - 3b) Follow the instructions in [my-mongo-operator](./my-mongo-operator/)
4) Check the EXTERNAL-IP of webserver with command `kubectl get services`. Open the EXTERNAL-IP address in a browser NOTE: wait about 5 minutes before attempting to access the web site (I think because the DNS needs time to be updated)
6) You can stop everything on AWS by following instructions in the [terraform](../terraform/) folder

NOTE: if you need to modify .yaml files, then you probably need to delete and re-apply files on the cluster:
        1) modify the file
        2) `kubectl delete -f .`
        3) `kubectl apply -f .`

## useful kubectl commands
- kubectl create configmap webserver-env-file --from-env-file=./webserver-env-file.properties --save-config
- kubectl get configmap webserver-env-file -o yaml > ./webserver-configmap.yaml
- kubectl apply -f .
- kubectl delete -f .
- kubectl get services
- kubectl get nodes
- kubectl get pods
- kubectl describe svc "name of pod shown in 'kubectl get services'"
- kubectl describe pods "name of pod shown in 'kubectl get pods'"
- kubectl get logs
NOTE: an alternative would be to use [k9s](https://k9scli.io/)
