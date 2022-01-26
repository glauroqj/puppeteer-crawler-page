FROM node:16.13.1

WORKDIR /app
ADD ./ /app

RUN npm install --unsafe-perm --force -g yarn && \
  yarn global add lerna@4.0.0 && \
  chmod +x /usr/local/bin/yarn

RUN ls -lsa

ENTRYPOINT yarn && \
  yarn dev