# 1. Node.js 환경에서 빌드 수행
FROM node:14 AS build

WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 종속성 설치
RUN npm install

# 애플리케이션 소스 코드 복사
COPY . .

# 애플리케이션 빌드
RUN npm run build

# 2. Nginx 이미지에 빌드 결과물 포함
FROM nginx:alpine

# Nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/nginx.conf

# 빌드 결과물 복사
COPY --from=build /app/build /usr/share/nginx/html

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
