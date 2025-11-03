# Use official Java 17 (LTS) image
FROM eclipse-temurin:17-jdk

# Set working directory inside container
WORKDIR /app

# Copy everything to /app
COPY . .

# Build the Spring Boot app
RUN ./mvnw clean package -DskipTests

# Expose port 8080 to the outside
EXPOSE 8080

# Run the generated jar file
CMD ["java", "-jar", "target/hospitalmanagement-0.0.1-SNAPSHOT.jar"]
