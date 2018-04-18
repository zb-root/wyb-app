FROM node:6-alpine
MAINTAINER Jeff YU, jeff@jamma.cn
RUN mkdir -p /app
WORKDIR /app
COPY . .
RUN npm install
CMD sh /app/ci/start.sh
