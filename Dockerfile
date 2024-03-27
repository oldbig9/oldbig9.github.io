FROM golang:1.21-alpine

# install hugo extended edition
RUN apk add --no-cache --repository=https://dl-cdn.alpinelinux.org/alpine/edge/community hugo
RUN apk add --no-cache git 

VOLUME  /site
WORKDIR /site

# git config
RUN git config --global --add safe.directory /site

EXPOSE 1313/tcp

ENTRYPOINT ["hugo", "server", "-D", "--bind", "0.0.0.0"]
