// https://github.com/apache/spark/blob/master/examples/src/main/scala/org/apache/spark/examples/sql/streaming/StructuredNetworkWordCount.scala
// https://github.com/apache/spark/blob/master/examples/src/main/scala/org/apache/spark/examples/sql/streaming/StructuredKafkaWordCount.scala
// https://github.com/mongodb/mongo-spark/blob/master/examples/src/test/scala/tour/SparkStructuredStreams.scala

package fr.ensimag.sdtd

// import org.apache.spark.sql.SparkSession
import scala.collection.JavaConverters._
import scala.collection.mutable
import org.apache.spark.sql._
import org.apache.spark.sql.types.{StructType, StructField, StringType, FloatType}
import org.apache.spark.sql.functions.{from_json, lower, col}
import org.apache.spark.sql.catalyst.expressions.objects.AssertNotNull
import org.bson.Document

import com.mongodb.client.MongoCollection
import com.mongodb.client.model.ReplaceOptions
import com.mongodb.spark.config.WriteConfig
import com.mongodb.spark.{MongoConnector}

object WordCounter extends Serializable {
	def main(args: Array[String]): Unit = {
		val spark = SparkSession
			.builder
			.appName("WordCounter")
			.getOrCreate()

		import spark.implicits._

		var kafkaAddress = "localhost:9092"
		var mongoAddress = "mongodb://localhost:27017/sdtd.wordcounts"
		if (sys.env.contains("KAFKA_ADDRESS"))
			kafkaAddress = sys.env("KAFKA_ADDRESS")
		if (sys.env.contains("MONGO_ADDRESS"))
			mongoAddress = sys.env("MONGO_ADDRESS")

		// define data schema
		val schema = StructType(StructField("reviewText", StringType) :: StructField("overall", FloatType) :: Nil)

		// read json from dafka and set fields as non-nullable
		val lines = spark
			.readStream
			.format("kafka")
			.option("kafka.bootstrap.servers", kafkaAddress)
			.option("subscribe", "quickstart-events")
			.load()
			.selectExpr("CAST(value AS STRING)")
			.select(from_json($"value", schema).as("review"))
			.selectExpr("review.reviewText", "review.overall")
			.withColumn("reviewText", new Column(AssertNotNull(col("reviewText").expr)))
			.withColumn("overall", new Column(AssertNotNull(col("overall").expr)))


		// count occurences for each word, after removing punctuation and setting everything to lower case
		val wordCounts = lines.select("reviewText").as[String].flatMap(_.split("\\s"))
						 .map(_.replaceAll("[,.!?:;]", "").trim.toLowerCase)
						 .filter(!_.isEmpty).groupBy("value").count()
						 .map((r: Row) => WordCount(r.getAs[String](0), r.getAs[Long](1)))


		// send wordcounts to mongo, in the format {"_id": "word", "value": NumberLong(1)}
		val query_wc = wordCounts.writeStream
      		.outputMode("update")
      		.foreach(new ForeachWriter[WordCount] {

      		//val writeConfig1: WriteConfig = WriteConfig(Map("uri" -> "mongodb://my-user:userPassword@db-svc.default.svc.cluster.local:27017/sdtd.wordcounts/?replicaSet=db"))
	        //val writeConfig1: WriteConfig = WriteConfig(Map("uri" -> "mongodb://localhost:27017/sdtd.wordcounts"))
	        val writeConfig1: WriteConfig = WriteConfig(Map("uri" -> mongoAddress))
	        var mongoConnector1: MongoConnector = _
	        var wordCounts: mutable.ArrayBuffer[WordCount] = _

	        override def process(value: WordCount): Unit = {
	          	wordCounts.append(value)
	        }

	        override def close(errorOrNull: Throwable): Unit = {
	          	if (wordCounts.nonEmpty) {
	            	mongoConnector1.withCollectionDo(writeConfig1, {collection: MongoCollection[Document] =>

	            		// if _id is not important, use updateOne instead (just replacing ReplaceOptions with UpdateOptions)
	            		for (wc <- wordCounts)
	            			collection.replaceOne(new Document("value", wc.word), new Document().append("value", wc.word).append("count", wc.count), new ReplaceOptions().upsert(true))

	              		//collection.insertMany(wordCounts.map(wc => { new Document().append("_id", wc.word).append("value", wc.count)}).asJava)
	            	})
	          	}
	        }

	        override def open(partitionId: Long, version: Long): Boolean = {
	          	mongoConnector1 = MongoConnector(writeConfig1.asOptions)
	          	wordCounts = new mutable.ArrayBuffer[WordCount]()
	          	true
	        }
      	})
      	.start()


      	// store full review in mongo
      	/*val query_rev = lines.as[Review].writeStream
      		.outputMode("update")
      		.foreach(new ForeachWriter[Review] {

      		//val writeConfig2: WriteConfig = WriteConfig(Map("uri" -> "mongodb://my-user:userPassword@db-svc.default.svc.cluster.local:27017/sdtd.reviews/?replicaSet=db"))
	        val writeConfig2: WriteConfig = WriteConfig(Map("uri" -> "mongodb://localhost:27017/sdtd.reviews"))
	        var mongoConnector2: MongoConnector = _
	        var reviews: mutable.ArrayBuffer[Review] = _

	        override def process(value: Review): Unit = {
	          	reviews.append(value)
	        }

	        override def close(errorOrNull: Throwable): Unit = {
	          	if (reviews.nonEmpty) {
	            	mongoConnector2.withCollectionDo(writeConfig2, {collection: MongoCollection[Document] =>
	              		collection.insertMany(reviews.map(rev => { new Document().append("review", rev.reviewText).append("score", rev.overall)}).asJava)
	            	})
	          	}
	        }

	        override def open(partitionId: Long, version: Long): Boolean = {
	          	mongoConnector2 = MongoConnector(writeConfig2.asOptions)
	          	reviews = new mutable.ArrayBuffer[Review]()
	          	true
	        }
      	})
      	.start()*/

    	query_wc.awaitTermination()
    	//query_rev.awaitTermination()
    	//spark.streams.awaitAnyTermination()

  	}

  case class WordCount(word: String, count: Long)

  //case class Review(reviewText: String, overall: Float)
}