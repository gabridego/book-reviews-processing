package fr.ensimag.sdtd

import scala.collection.mutable
import org.apache.spark.sql._

import org.apache.spark.ml.feature.{StringIndexer, Tokenizer, StopWordsRemover, HashingTF, IDF, IndexToString}
import org.apache.spark.ml.classification.RandomForestClassifier
import org.apache.spark.ml.Pipeline
import org.apache.spark.ml.tuning.{CrossValidator, ParamGridBuilder}
import org.apache.spark.ml.evaluation.BinaryClassificationEvaluator

object SentimentTrain {
	def main(args: Array[String]): Unit = {
    var filename = "file.json"
    if (args.length > 0)
      filename = args(0)

	val spark = SparkSession
  		.builder
  		.appName("SentimentTrain")
      //.config("spark.mongodb.input.uri", "mongodb://localhost:27017/sdtd.reviews")
  		.getOrCreate()

  	import spark.implicits._

    // read and get label of training data
    var trainDf = spark.read.json(filename).select("reviewText","overall")

    trainDf = trainDf.map(row => {
  		val score = row.getDouble(1)
    	var label = 0.0
      // reviews >= 3 are classified as positives
      if (score > 2) {
          label = 1.0
    	}
    	(row.getString(0), label)
    }).toDF("reviewText", "label")
    

    // tokenize the text
    val tokenizer = new Tokenizer()
      .setInputCol("reviewText")
      .setOutputCol("words")

    // remove stopwords
    val remover = new StopWordsRemover()
      .setInputCol("words")
      .setOutputCol("filteredWords")

    // compute term frequency
    val hashingTF = new HashingTF()
      .setInputCol("filteredWords")
      .setOutputCol("rawFeatures")
    
    // compute inverse document frequency
    val idf = new IDF()
      .setInputCol("rawFeatures")
      .setOutputCol("features")

    // train random forest classifier
    val rf = new RandomForestClassifier()
      .setLabelCol("label")
      .setFeaturesCol("features")

    // build ml pipeline with all components
    val pipeline = new Pipeline()
      .setStages(Array(tokenizer, remover, hashingTF, idf, rf))

    // get best parameters of random forest
    val paramGrid = new ParamGridBuilder()
      .addGrid(rf.numTrees, Array(10, 50))
      .addGrid(rf.maxDepth, Array(1, 5, 10))
      .build()

    // select best model through cross validation on 5 folds
    val cv = new CrossValidator()
      .setEstimator(pipeline)
      .setEvaluator(new BinaryClassificationEvaluator)
      .setEstimatorParamMaps(paramGrid)
      .setNumFolds(5)

    // fit best model on training data and store it
    val cvModel = cv.fit(trainDf)

    cvModel.write.overwrite().save("../model")

	}
}
