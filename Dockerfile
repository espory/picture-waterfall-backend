FROM node:16.18.1-alpine3.16 as build-stage

# 安装相关linux依赖包
# RUN apk add make

WORKDIR /app
COPY package*.json ./
COPY pnpm-lock.yaml ./
# COPY yarn.lock ./
RUN corepack enable
# RUN npm install --global yarn
# RUN yarn config set registry https://registry.npm.taobao.org/
RUN pnpm install

COPY . .

# RUN pnpm build
# RUN yarn start
CMD ["pnpm", "start"]
# FROM nginx:latest
# COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 8000

# RUN ["echo","hello world"]