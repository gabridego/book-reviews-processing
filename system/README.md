# How to run services locally with docker

## Introduction
1) apiserver runs all the rest api
2) webserver runs the UI for the client and it's connect to webserver in proxy (all rest api requests are forwarded to apiserver)
3) mongo-seed is only used to add some stub data on mongodb
## Requirements
1) docker
2) docker-compose
## Commands
1) go to "cd ./system"
2) run "sudo docker-compose -f docker-compose.yml up --build"
3) visit "http://localhost:3000/" to test it
4) to stop and delete containers press CTRL+C and run "sudo docker-compose -f docker-compose.yml rm"