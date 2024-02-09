# Use an official Node runtime as the base image
FROM node:alpine as deps

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

FROM node:alpine as source

WORKDIR /app

COPY --from=deps /app/package.json /app/package-lock.json ./
COPY --from=deps /app/node_modules /app/node_modules

# Add the rest of the project files
COPY ./src ./src
COPY ./public ./public
COPY ./tsconfig.json ./
COPY ./config-overrides.js ./

FROM node:alpine as demo

WORKDIR /app

COPY --from=source /app /app

EXPOSE 3000

ENTRYPOINT ["npm"]
CMD ["start"]

FROM node:alpine as build

COPY --from=source /app /app

# Build the app
RUN npm run build

# Use Nginx to serve the app in production
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

