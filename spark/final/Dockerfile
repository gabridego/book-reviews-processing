FROM gitlab.ensimag.fr:5050/sdtd1/projet-sdtd/spark:base

COPY target /opt/spark/target
COPY model /opt/spark/model

ENV SPARK_HOME /opt/spark
WORKDIR /opt/spark/work-dir
ENTRYPOINT [ "/opt/entrypoint.sh" ]