FROM node:19-alpine
WORKDIR /app
COPY . .
RUN npm run build
EXPOSE 4173
CMD [ "npm", "run", "preview" ]
