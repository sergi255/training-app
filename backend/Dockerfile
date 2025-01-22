FROM openjdk:23-slim

WORKDIR /app

COPY target/*.jar app.jar
COPY src/main/resources/application.properties application.properties

EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]