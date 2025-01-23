FROM eclipse-temurin:23-jre-alpine
WORKDIR /app

# Kopiuj plik JAR z lokalnego systemu
COPY target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]