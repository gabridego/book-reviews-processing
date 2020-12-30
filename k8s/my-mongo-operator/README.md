# Deploy with a replicated database
1) Follow instructions in [my-mongodb](./my-mongodb/) to create a replicated database
2) The apiserver located in the current folder is able to connect to the replicated database.
Run `kubectl appply -f apiserver/`


