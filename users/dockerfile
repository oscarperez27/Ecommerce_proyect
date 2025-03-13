FROM node:20.5.0-alpine3.18
RUN addgroup nodeapp && adduser -S -G nodeapp nodeapp
USER nodeapp
WORKDIR /app/
COPY --chown=nodeapp package*.json .
RUN npm install
COPY --chown=nodeapp . .
EXPOSE 3001
CMD ["npm", "start"]