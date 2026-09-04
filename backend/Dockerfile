FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the pre-built .jar file created by Jenkins
COPY target/*.jar app.jar 

EXPOSE 8080
CMD ["java", "-jar", "app.jar"]