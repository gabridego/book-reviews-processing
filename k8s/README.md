# k8s

## Preparation
- uploaded images on Docker hub in order to simplify the work on AWS ==> the next step is to use images from gitlab

## what we made in steps
1) we created 3 folders inside k8s (excluding kafka and spark) ==> apiserver, webserver, db
2) inside each one of them we made a file .yaml (the one without "configmap" in the name) by using some templates
3) we also added a file .properties in case we need environment variables ==> in that case we need to create another file .yaml (this time with "configmap" in the name)
    - in order to create this file then we need to:
        1) go for example to the folder webserver
        2) run the command ==> kubectl create configmap webserver-env-file --from-env-file=./webserver-env-file.properties --save-config
            - if an error, then run the command ==> kubectl delete -f .
        3) run the command ==> kubectl get configmap webserver-env-file -o yaml > ./webserver-configmap.yaml

## how to run images on AWS
1) follow the HOWTO file inside the terraform folder in order to get a cluster inside AWS on
1) go inside each folder (apiserver, webserver, db)
2) run the command ==> kubectl apply -f .
    - if you need to modify yaml files, then you need to reset services on AWS:
        1) modify the file
        2) run the command ==> kubectl delete -f .
        3) run the command ==> kubectl apply -f .
3) check the EXTERNAL-IP of webserver by running ==> kubectl get services
4) open a browser and go to the link shown in the EXTERNAL-IP and use the port 3000 ==> NOTES: wait about 15minutes in order to show the web site (I think because the DNS needs time to be updated)
5) if you want, you can stop everything on AWS by still using the HOWTO file inside the terraform folder

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