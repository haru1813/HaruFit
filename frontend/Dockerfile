FROM node:18-alpine

WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 소스 코드 복사
COPY . .

# .env 파일이 있으면 복사
COPY .env* ./

# 포트 노출
EXPOSE 3000

# 환경 변수 설정
ENV WDS_SOCKET_HOST=localhost
ENV WDS_SOCKET_PORT=3001
ENV WDS_SOCKET_PATH=/ws
ENV CHOKIDAR_USEPOLLING=true
ENV FAST_REFRESH=true
ENV HOST=0.0.0.0
ENV DANGEROUSLY_DISABLE_HOST_CHECK=true

# Entrypoint 스크립트 생성
RUN echo '#!/bin/sh' > /entrypoint.sh && \
    echo 'if [ ! -d "node_modules" ] || [ ! -f "node_modules/.bin/react-scripts" ]; then' >> /entrypoint.sh && \
    echo '  echo "Installing dependencies..."' >> /entrypoint.sh && \
    echo '  npm install' >> /entrypoint.sh && \
    echo 'fi' >> /entrypoint.sh && \
    echo 'exec "$@"' >> /entrypoint.sh && \
    chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

# 개발 서버 실행 (0.0.0.0에서 리스닝하여 Docker에서 접근 가능하도록)
CMD ["npm", "start"]
