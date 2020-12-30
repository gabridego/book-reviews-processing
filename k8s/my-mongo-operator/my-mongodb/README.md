# Deploy a replicated MongoDB database
Based on the instructions on the [github pages](https://github.com/mongodb/mongodb-kubernetes-operator/tree/master/docs)
There are two ways to deploy the replicaSet, the second one being the preferred way

## Deploy replica set with Kubernetes Community Operator from git repository
1) Clone git repository
`git clone https://github.com/mongodb/mongodb-kubernetes-operator.git`
then move to directory in which you cloned to the directory

2) Install custom resource
`kubectl create -f deploy/crds/mongodb.com_mongodb_crd.yaml`
check installation with
`kubectl get crd/mongodb.mongodb.com`

3) Install the operator controller
`kubectl create -f deploy/operator/`
check installation with
`kubectl get pods`

4) Create user secret
see file "deploy/crds/mongodb.com_v1_mongodb_scram_cr.yaml" to get an example of how to use the secret for mongodb authentication
`kubectl apply -f <db-user-secret>.yaml`

5) Apply MongoDB resource definition
see file "deploy/crds/mongodb.com_v1_mongodb_cr.yaml" to get an example of how to create a custom resource definition for a replica set, using a secret
`kubectl apply -f <mongodb-crd>.yaml`

6) (Optional) After the MongoDB resource is running, the secret is no longer needed. It is advised to remove it for security purposes.
`kubectl delete secret <db-user-secret>`


## Deploy replica set with Kubernetes Community Operator with own files
1) Install custom resource
`kubectl create -f mongodb.com_mongodb_crd.yaml`
check installation with
`kubectl get crd/mongodb.mongodb.com`

2) Install the operator controller
`kubectl create -f operator/`
check installation with
`kubectl get pods`

3) Apply mongoDB resource definition
`kubectl apply -f mongodb-crd.yaml`
The file contains secrets that create users in the database to allow access to the replicaSet.

4) (Optional) After the MongoDB resource is running, the secret is no longer needed. It is advised to remove it for security purposes.
`kubectl delete secret <db-user-secret>`
Replace <db-user-secret> with the info from mongodb-crd.yaml

# Connect to replica set
Forward mongoDB service to your localhost port 27018
`kubectl port-forward service/<mongodb-svc> 27018:27017`
Connect with mongo client
`mongo 127.0.0.1:27018`
Other ways to connect to mongoDB did not work for me

