FROM node:15.8.0-alpine3.10
COPY . .
RUN npm install
EXPOSE 3001
#ENV server2=http://localhost:3002

CMD ["node", "/src/index"]