package fr.ensimag.sdtd

import scala.collection.JavaConverters._
import scala.collection.mutable
import org.apache.spark.sql._
import org.apache.spark.sql.types.{StructType, StructField, StringType, FloatType}
import org.apache.spark.sql.functions._
import org.apache.spark.sql.catalyst.expressions.objects.AssertNotNull
import org.bson.Document

import org.apache.spark.ml.tuning.CrossValidatorModel

import com.mongodb.client.MongoCollection
import com.mongodb.spark.config.WriteConfig
import com.mongodb.spark.{MongoConnector}

object SentimentTest {
	def main(args: Array[String]): Unit = {
		val spark = SparkSession
      		.builder
      		.appName("SentimentTest")
      		.getOrCreate()

  	import spark.implicits._

    var kafkaAddress = "localhost:9092"
    var sentimentMongoAddress = "mongodb://localhost:27017/sdtd.sentiment"
    var accuracyMongoAddress = "mongodb://localhost:27017/sdtd.accuracy"
    var modelDir = "../model"
    if (sys.env.contains("KAFKA_ADDRESS"))
      kafkaAddress = sys.env("KAFKA_ADDRESS")
    if (sys.env.contains("SENTIMENT_MONGO_ADDRESS"))
      sentimentMongoAddress = sys.env("SENTIMENT_MONGO_ADDRESS")
    if (sys.env.contains("ACCURACY_MONGO_ADDRESS"))
      accuracyMongoAddress = sys.env("ACCURACY_MONGO_ADDRESS")
    if (sys.env.contains("MODEL_DIR"))
      modelDir = sys.env("MODEL_DIR")

    val schema = StructType(StructField("reviewText", StringType) :: StructField("overall", FloatType) :: Nil)

    // read json from kafka and set fields as non-nullable
    val lines = spark
      .readStream
      .format("kafka")
      //.option("kafka.bootstrap.servers", "kafkaa:9092")
      .option("kafka.bootstrap.servers", kafkaAddress)
      .option("subscribe", "quickstart-events")
      .load()
      .selectExpr("CAST(value AS STRING)")
      .select(from_json($"value", schema).as("review"))
      .selectExpr("review.reviewText", "review.overall")
      .withColumn("reviewText", new Column(AssertNotNull(col("reviewText").expr)))
      .withColumn("overall", new Column(AssertNotNull(col("overall").expr)))

    
    // get label of streaming data
    val testDf = lines.map(row => {
      val score = row.getFloat(1)
      var label = 0.0
      if (score > 2) {
          label = 1.0
      }
      (row.getString(0), label)
    }).toDF("reviewText", "label")


    // load trained model from memory and apply to new data
    val model = CrossValidatorModel.load(modelDir)

    val results = model.transform(testDf)

    // get predicted label of streaming data
    val mappedResults = results.withColumnRenamed("reviewText","review").select("review","label","prediction").map(row => {
      val indexLabel = row.getDouble(1)
      var label = "neg"
      if (indexLabel == 1.0) {
        label = "pos"
      }

      val indexPredLabel = row.getDouble(2)
      var predLabel = "neg"
      if (indexPredLabel == 1.0) {
        predLabel = "pos"
      }
      (row.getString(0), label, predLabel)
    }).toDF("review","label","prediction")

    // store predictions in db
    val query = mappedResults.as[Prediction].writeStream
      .outputMode("append")
      .foreach(new ForeachWriter[Prediction] {
        //val writeConfig: WriteConfig = WriteConfig(Map("uri" -> "mongodb://my-user:userPassword@db-svc.default.svc.cluster.local:27017/sdtd.sentiment/?replicaSet=db"))
        val writeConfig: WriteConfig = WriteConfig(Map("uri" -> sentimentMongoAddress))
        var mongoConnector: MongoConnector = _
        var predictions: mutable.ArrayBuffer[Prediction] = _

        override def process(value: Prediction): Unit = {
            predictions.append(value)
        }

        override def close(errorOrNull: Throwable): Unit = {
            if (predictions.nonEmpty) {
              mongoConnector.withCollectionDo(writeConfig, {collection: MongoCollection[Document] =>
                  collection.insertMany(predictions.map(rev => { new Document().append("review", rev.review).append("expected", rev.label).append("result", rev.prediction)}).asJava)
              })
            }
        }

        override def open(partitionId: Long, version: Long): Boolean = {
            mongoConnector = MongoConnector(writeConfig.asOptions)
            predictions = new mutable.ArrayBuffer[Prediction]()
            true
        }
      })
      .start()


    // get total number of test reviews and accuracies, updated at each minibatch
    val accResults = mappedResults.map(row => {
      var correct = 0
      if (row.getString(1) == row.getString(2)) {
        correct = 1
      }
      (1, correct)
    }).toDF("num","correct").agg(sum("num").as("tot"), sum("correct").as("totCorr"))
      .filter("tot IS NOT NULL and totCorr IS NOT NULL")
      .map(row => {
        (row.getLong(0), row.getLong(1).toDouble / row.getLong(0))
      }).toDF("num", "accuracy")

    // store couple (number of reviews, accuracy) in db
    val queryAcc = accResults.as[Accuracy].writeStream
      .outputMode("complete").foreach(new ForeachWriter[Accuracy] {

        //val writeConfig2: WriteConfig = WriteConfig(Map("uri" -> "mongodb://my-user:userPassword@db-svc.default.svc.cluster.local:27017/sdtd.accuracy/?replicaSet=db"))
        val writeConfig2: WriteConfig = WriteConfig(Map("uri" -> accuracyMongoAddress))
        var mongoConnector2: MongoConnector = _
        var accuracy: mutable.ArrayBuffer[Accuracy] = _

        override def process(value: Accuracy): Unit = {
            accuracy.append(value)
        }

        override def close(errorOrNull: Throwable): Unit = {
            if (accuracy.nonEmpty) {
              mongoConnector2.withCollectionDo(writeConfig2, {collection: MongoCollection[Document] =>
                  collection.insertMany(accuracy.map(rev => { new Document().append("_id", rev.num).append("value", rev.accuracy)}).asJava)
              })
            }
        }

        override def open(partitionId: Long, version: Long): Boolean = {
            mongoConnector2 = MongoConnector(writeConfig2.asOptions)
            accuracy = new mutable.ArrayBuffer[Accuracy]()
            true
        }
      })
      .start()

    spark.streams.awaitAnyTermination()
	}

  case class Prediction(review: String, label: String, prediction: String)

  case class Accuracy(num: Long, accuracy: Double)
}
