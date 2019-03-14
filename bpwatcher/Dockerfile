FROM node:11

# Create app directory
WORKDIR /opt/application

# Dev server
RUN yarn global add nodemon

# Install app dependencies
COPY package*.json ./
RUN yarn --ignore-optional --frozen-lockfile

# Bundle app source
COPY . .

ADD ./utils/wait /wait
RUN chmod +x /wait

EXPOSE 4000

CMD /wait && yarn dev
