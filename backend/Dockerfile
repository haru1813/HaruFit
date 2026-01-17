FROM eclipse-temurin:17-jdk

WORKDIR /app

# Gradle 설치
RUN apt-get update && apt-get install -y wget unzip && rm -rf /var/lib/apt/lists/*

# Gradle Wrapper 다운로드 및 설정
RUN wget https://services.gradle.org/distributions/gradle-8.5-bin.zip && \
    unzip gradle-8.5-bin.zip && \
    rm gradle-8.5-bin.zip && \
    mv gradle-8.5 /opt/gradle && \
    ln -s /opt/gradle/bin/gradle /usr/local/bin/gradle

# 빌드 파일 복사
COPY build.gradle .
COPY settings.gradle .

# 소스 코드 복사
COPY src src

# 애플리케이션 빌드
RUN gradle bootJar -x test --no-daemon

# 빌드된 JAR 파일을 루트로 복사
RUN cp build/libs/harufit-0.0.1-SNAPSHOT.jar /app.jar

# 실행 가능한 JAR 파일 실행
CMD ["java", "-jar", "/app.jar"]
