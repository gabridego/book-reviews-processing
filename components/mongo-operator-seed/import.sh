#!/bin/bash

# mongoimport --host $DB_SERVICE -u my-user -p userPassword --db sdtddb --collection wordcount --type json --file /mongo-seed/wc.json --jsonArray
# mongoimport --host $DB_SERVICE -u my-user -p userPassword --db sdtddb --collection sentiment --type json --file /mongo-seed/reviews.json --jsonArray
# mongoimport --host $DB_SERVICE -u my-user -p userPassword --db sdtddb --collection accuracy --type json --file /mongo-seed/accuracies.json --jsonArray

#mongoimport --uri mongodb://my-user:userPassword@$DB_SERVICE:27017/admin --collection wordcount --type json --file /mongo-seed/wc.json --jsonArray
#mongoimport --uri mongodb://my-user:userPassword@$DB_SERVICE:27017/admin --collection sentiment --type json --file /mongo-seed/reviews.json --jsonArray
#mongoimport --uri mongodb://my-user:userPassword@$DB_SERVICE:27017/admin --collection accuracy --type json --file /mongo-seed/accuracies.json --jsonArray

#mongoimport --host $DB_SERVICE --port 27017 --username my-user --password userPassword --authenticationDatabase admin --db sdtddb --collection wordcount --type json --file /mongo-seed/wc.json --jsonArray
#mongoimport --host $DB_SERVICE --port 27017 --username my-user --password userPassword --authenticationDatabase admin --db sdtddb --collection sentiment --type json --file /mongo-seed/reviews.json --jsonArray
#mongoimport --host $DB_SERVICE --port 27017 --username my-user --password userPassword --authenticationDatabase admin --db sdtddb --collection accuracy --type json --file /mongo-seed/accuracies.json --jsonArray

#mongoimport --uri mongodb://my-user:userPassword@$DB_SERVICE.default.svc.cluster.local:27017/admin?replicaSet=db --collection wordcount --type json --file /mongo-seed/wc.json --jsonArray
#mongoimport --uri mongodb://my-user:userPassword@$DB_SERVICE.default.svc.cluster.local:27017/admin?replicaSet=db --collection sentiment --type json --file /mongo-seed/reviews.json --jsonArray
#mongoimport --uri mongodb://my-user:userPassword@$DB_SERVICE.default.svc.cluster.local:27017/admin?replicaSet=db --collection accuracy --type json --file /mongo-seed/accuracies.json --jsonArray

mongoimport --host db/$DB_SERVICE --port 27017 --username my-user --password userPassword --authenticationDatabase admin --db sdtddb --collection wordcount --type json --file /mongo-seed/wc.json --jsonArray
mongoimport --host db/$DB_SERVICE --port 27017 --username my-user --password userPassword --authenticationDatabase admin --db sdtddb --collection sentiment --type json --file /mongo-seed/reviews.json --jsonArray
mongoimport --host db/$DB_SERVICE --port 27017 --username my-user --password userPassword --authenticationDatabase admin --db sdtddb --collection accuracy --type json --file /mongo-seed/accuracies.json --jsonArray

