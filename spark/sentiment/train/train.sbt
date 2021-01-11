name := "SentimentTrain"

version := "1.0"

scalaVersion := "2.12.12"

libraryDependencies += "org.apache.spark" %% "spark-core" % "3.0.1" % "provided"
libraryDependencies += "org.apache.spark" %% "spark-sql" % "3.0.1" % "provided"
libraryDependencies += "org.apache.spark" %% "spark-mllib" % "3.0.1" % "provided"
libraryDependencies += "org.mongodb.spark" %% "mongo-spark-connector" % "3.0.0"