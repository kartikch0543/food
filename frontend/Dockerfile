# Stage 1: Build the React Application
FROM node:20-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# Pass in specific build arguments if necessary (e.g. for VITE_API_URL)
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Stage 2: Serve the app with NGINX
FROM nginx:alpine

# Copy the generated build folder from Stage 1 into Nginx
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Copy the custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
