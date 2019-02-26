FROM node:10

# Backstopjs - https://hub.docker.com/r/backstopjs/backstopjs/dockerfile
ENV \
PHANTOMJS_VERSION=2.1.16 \
CASPERJS_VERSION=1.1.4 \
SLIMERJS_VERSION=1.0.0 \
BACKSTOPJS_VERSION=3.8.5 \
# Workaround to fix phantomjs-prebuilt installation errors
# See https://github.com/Medium/phantomjs/issues/707
NPM_CONFIG_UNSAFE_PERM=true

# Base packages
RUN apt-get update && \
apt-get install -y git sudo software-properties-common

RUN sudo npm install -g --unsafe-perm=true --allow-root phantomjs-prebuilt@${PHANTOMJS_VERSION}
RUN sudo npm install -g --unsafe-perm=true --allow-root casperjs@${CASPERJS_VERSION}
RUN sudo npm install -g --unsafe-perm=true --allow-root slimerjs@${SLIMERJS_VERSION}
RUN sudo npm install -g --unsafe-perm=true --allow-root backstopjs@${BACKSTOPJS_VERSION}

RUN wget https://dl-ssl.google.com/linux/linux_signing_key.pub && sudo apt-key add linux_signing_key.pub
RUN sudo add-apt-repository "deb http://dl.google.com/linux/chrome/deb/ stable main"

RUN	apt-get -y update && \
apt-get -y install google-chrome-stable

RUN apt-get install -y firefox-esr

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY .npmrc ./
RUN npm install --ignore-optional

# Bundle app source
COPY . .

# Expose and start server
EXPOSE 8080 8081 3001
CMD [ "npm", "start" ]
