# HaruFit - 개인 맞춤형 운동 관리 웹 애플리케이션

## 프로젝트 개요
HaruFit은 사용자가 자신의 운동 루틴을 관리하고, 운동 기록을 추적하며, 목표를 설정하고 달성할 수 있는 종합적인 피트니스 관리 플랫폼입니다.

## 기술 스택
- **프론트엔드**: React 18, Bootstrap 5, Chart.js
- **백엔드**: Spring Boot 3.2, Java 17
- **데이터베이스**: MariaDB 10.11
- **인프라**: Docker, Docker Compose

## 포트 설정
- React: 3001
- Spring Boot: 8081
- MariaDB: 3307

## 실행 방법

### 1. Docker Compose로 전체 실행
```bash
cd /Users/haru/Documents/HaruFit
docker compose up --build
```

### 2. 개별 서비스 실행
```bash
# MariaDB만 실행
docker compose up mariadb

# Spring Boot만 실행
docker compose up springboot

# React만 실행
docker compose up react
```

### 3. 접속 URL
- React Frontend: http://localhost:3001
- Spring Boot API: http://localhost:8081/api
- MariaDB: localhost:3307

## 프로젝트 구조
```
HaruFit/
├── backend/          # Spring Boot 백엔드
├── frontend/         # React 프론트엔드
├── database/         # MariaDB 초기화 스크립트
├── docker-compose.yml
└── Document/         # 프로젝트 문서
```

## 개발 가이드
자세한 내용은 `Document/` 폴더의 문서들을 참고하세요:
- 요구사항 명세서
- API 명세서
- DB 설계도
- 디자인 가이드라인
