#!/bin/bash

mongoimport --host mongo --db sdtddb --collection wordcount --type json --file /mongo-seed/wc.json --jsonArray
mongoimport --host mongo --db sdtddb --collection sentiment --type json --file /mongo-seed/reviews.json --jsonArray
mongoimport --host mongo --db sdtddb --collection accuracy --type json --file /mongo-seed/accuracies.json --jsonArray
