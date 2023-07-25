FROM openjdk:20

ENV ENVIRONMENT=prod

EXPOSE 8080

LABEL maintainer="saman1357@yahoo.com"

ADD backend/target/myloans.jar myloans.jar

CMD [ "sh", "-c", "java -jar /myloans.jar" ]