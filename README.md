# Projet SDTD

## Overview
### User guide
...
### Components
There are 3 main components in our application:
1) A webserver, because our application is accessible through an internet browser (nodeJS)
2) An apiserver (nodeJS)
3) A replicated database (MongoDB, with MongoDB Community Kubernetes Operator)

## Manage the application life
Read [k8s/ files](./k8s/README.md) for instructions on how to create, delete and update the kubernetes cluster on which the application is deployed.

## Test
I advise to download and use [k9s](https://k9scli.io/) which makes it easier to visualize the cluster status with its' interface.
### Disponibility
Kubernetes makes sure every pod that is down is restarted automatically.

