###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .


RUN npm run build
RUN npx prisma db push
# Start the server using the production build
# CMD [ "npm", "run", "start:dev" ]
CMD [ "node", "dist/main.js" ]