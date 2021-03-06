# Manually pushing images to Gitlab's docker registry
## Intro
Docker images can be built and pushed to a registry.
Kubernetes just have to pull images from the registry to deploy nodes.
Good news is Gitlab provides a docker registry.
This document explains how to build and push a docker image to gitlab container registry.

## How to do it
1) Login to docker registry:
`docker login gitlab.ensimag.fr:5050/sdtd1/projet-sdtd/`
Enter your ensimag login and password when prompted

2) Build the image
`docker build -t gitlab.ensimag.fr:5050/sdtd1/projet-sdtd/<imagename> .`
Replace <imagename> by the image name, enventually with version, e.g. webserver:v1

3) Push the image
`docker push gitlab.ensimag.fr:5050/sdtd1/projet-sdtd/<imagename>`

You can look the images on Gitlab's docker registry [here](https://gitlab.ensimag.fr/sdtd1/projet-sdtd/container_registry)

# Gitlab's pipelines
A Gitlab CI/CD job automatically builds and pushes docker images to the registry on certain branches when a new commit is made. So manual push is for testing only.

