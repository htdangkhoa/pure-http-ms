FROM node:12-alpine

RUN yarn global add nodemon

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install dependencies
COPY package.json .
RUN yarn

# Bundle app source
COPY . .

# RUN yarn build
