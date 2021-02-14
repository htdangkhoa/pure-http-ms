FROM node:latest

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install dependencies
COPY package.json .
RUN yarn

# Bundle app source
# COPY .env-cmdrc.json .
COPY . .

RUN yarn build

# Exports
# EXPOSE 8080
# CMD ["npm", "run", "dev", "article"]