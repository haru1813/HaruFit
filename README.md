# 💪 HaruFit

<div align="center">

**Personalized Fitness Management Web Application**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-6DB33F?style=for-the-badge&logo=spring)](https://spring.io/projects/spring-boot)
[![MariaDB](https://img.shields.io/badge/MariaDB-10.11-003545?style=for-the-badge&logo=mariadb)](https://mariadb.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)

개인 맞춤형 운동 루틴 관리 및 피트니스 추적 플랫폼

[기능](#-주요-기능) • [시작하기](#-시작하기) • [문서](#-문서) • [기술 스택](#-기술-스택)

</div>

---

## 📋 목차

- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [프로젝트 구조](#-프로젝트-구조)
- [시작하기](#-시작하기)
- [접속 URL](#-접속-url)
- [포트 정보](#-포트-정보)
- [개발 가이드](#-개발-가이드)
- [문서](#-문서)

---

## ✨ 주요 기능

### 🏋️ 루틴 관리 (Routine Management)
- 운동 루틴 생성 및 관리
- 루틴별 운동 목록 구성
- 루틴 일정 설정
- 루틴 복제 및 공유

### 📊 운동 기록 (Workout Logging)
- 실시간 운동 기록
- 세트별 무게, 횟수, 시간 추적
- 운동 완료 상태 관리
- 운동 히스토리 조회

### 🎯 목표 설정 (Goal Setting)
- 단기/장기 목표 설정
- 목표 달성률 추적
- 목표별 진행 상황 시각화
- 목표 달성 알림

### 📝 운동 일지 (Journal)
- 운동 후 감상 및 메모 작성
- 사진 첨부 기능
- 운동 만족도 평가
- 일지 검색 및 필터링

### 👤 사용자 프로필 (User Profile)
- 개인 정보 관리
- 신체 정보 기록 (키, 몸무게 등)
- 운동 통계 대시보드
- 성취 배지 및 기록

### 📈 대시보드 (Dashboard)
- 운동 통계 요약
- 최근 운동 기록
- 목표 달성 현황
- 운동 추이 그래프

---

## 🛠 기술 스택

### Frontend
- **Framework**: [React 18](https://reactjs.org/)
- **Language**: JavaScript (ES6+)
- **UI Library**: Bootstrap 5
- **Charts**: Chart.js
- **HTTP Client**: Axios
- **Routing**: React Router v6

### Backend
- **Framework**: [Spring Boot 3.2](https://spring.io/projects/spring-boot)
- **Language**: Java 17
- **Security**: Spring Security
- **ORM**: Spring Data JPA
- **Build Tool**: Gradle

### Database
- **Database**: [MariaDB 10.11](https://mariadb.org/)

### DevOps
- **Containerization**: Docker & Docker Compose
- **Reverse Proxy**: Nginx

---

## 📁 프로젝트 구조

```
HaruFit/
├── 📂 backend/                    # Spring Boot 백엔드
│   ├── 📂 src/main/java/com/harufit/
│   │   ├── 📂 controller/         # REST API 컨트롤러
│   │   │   ├── AuthController.java
│   │   │   ├── RoutineController.java
│   │   │   ├── WorkoutLogController.java
│   │   │   ├── GoalController.java
│   │   │   ├── JournalController.java
│   │   │   └── UserController.java
│   │   ├── 📂 service/            # 비즈니스 로직
│   │   ├── 📂 repository/         # 데이터 접근 계층
│   │   ├── 📂 entity/             # JPA 엔티티
│   │   ├── 📂 dto/                # 데이터 전송 객체
│   │   ├── 📂 config/             # 설정 클래스
│   │   │   ├── SecurityConfig.java
│   │   │   └── WebConfig.java
│   │   └── 📂 security/           # 보안 관련
│   ├── 📄 build.gradle
│   └── 📄 Dockerfile
│
├── 📂 frontend/                   # React 프론트엔드
│   ├── 📂 src/
│   │   ├── 📂 pages/              # 페이지 컴포넌트
│   │   │   ├── Dashboard.js
│   │   │   ├── Routines.js
│   │   │   ├── Workouts.js
│   │   │   ├── Goals.js
│   │   │   ├── Journals.js
│   │   │   ├── Profile.js
│   │   │   ├── Login.js
│   │   │   └── Register.js
│   │   ├── 📂 components/         # 공통 컴포넌트
│   │   │   ├── Layout.js
│   │   │   └── ProtectedRoute.js
│   │   ├── 📂 context/            # React Context
│   │   │   └── AuthContext.js
│   │   ├── 📂 api/                # API 클라이언트
│   │   │   ├── axios.js
│   │   │   ├── routineApi.js
│   │   │   ├── workoutApi.js
│   │   │   ├── goalApi.js
│   │   │   ├── journalApi.js
│   │   │   └── userApi.js
│   │   ├── 📄 App.js
│   │   └── 📄 index.js
│   ├── 📄 package.json
│   └── 📄 Dockerfile
│
├── 📂 database/                   # 데이터베이스 초기화 스크립트
│   └── 📂 init/
│       └── 📄 01_create_database.sql
│
├── 📂 Document/                   # 프로젝트 문서
│   ├── 📄 요구사항 명세서.html
│   ├── 📄 유스케이스 다이어그램.html
│   ├── 📄 비지니스 로직 정의서.html
│   ├── 📄 와이어프레임.html
│   ├── 📄 프로토타입.html
│   ├── 📄 디자인 가이드라인.html
│   ├── 📄 DB 설계도.html
│   ├── 📄 API 명세서.html
│   └── 📄 index.html
│
├── 📄 docker-compose.yml
└── 📄 README.md
```

---

## 🚀 시작하기

### 사전 요구사항

- [Docker](https://www.docker.com/get-started) (20.10 이상)
- [Docker Compose](https://docs.docker.com/compose/install/) (2.0 이상)

### 설치 및 실행

#### 1️⃣ 저장소 클론

```bash
git clone https://github.com/haru1813/HaruFit.git
cd HaruFit
```

#### 2️⃣ Docker Compose로 전체 실행

```bash
docker compose up --build
```

이 명령어는 다음 서비스들을 시작합니다:
- 🗄️ MariaDB (포트: 3307)
- 🐍 Spring Boot Backend (포트: 8081)
- ⚛️ React Frontend (포트: 3001)

#### 3️⃣ 개별 서비스 실행

특정 서비스만 실행하려면:

```bash
# MariaDB만 실행
docker compose up mariadb

# Spring Boot만 실행
docker compose up springboot

# React만 실행
docker compose up react
```

### 🛑 서비스 중지

```bash
docker compose down
```

### 🔄 서비스 재시작

```bash
docker compose restart
```

---

## 🌐 접속 URL

### 프로덕션 환경 (Nginx)

| 서비스 | URL | 설명 |
|--------|-----|------|
| 🖥️ **Frontend** | http://harufit.haru.company:200 | React 프론트엔드 |
| 🔌 **Backend API** | http://harufitb.haru.company:200/api | Spring Boot REST API |

### 로컬 개발 환경

| 서비스 | URL | 설명 |
|--------|-----|------|
| 🖥️ **Frontend** | http://localhost:3001 | React 프론트엔드 |
| 🔌 **Backend API** | http://localhost:8081/api | Spring Boot REST API |
| 🗄️ **MariaDB** | localhost:3307 | 데이터베이스 |

---

## ⚙️ 포트 정보

| 서비스 | 포트 | 프로토콜 |
|--------|------|----------|
| MariaDB | 3307 | TCP |
| Spring Boot | 8081 | HTTP |
| React | 3001 | HTTP |

---

## 📚 개발 가이드

### Spring Boot API 추가하기

1. **엔티티 생성** (`backend/src/main/java/com/harufit/entity/`)
   ```java
   @Entity
   @Table(name = "your_entity")
   public class YourEntity {
       // 필드 정의
   }
   ```

2. **Repository 생성** (`backend/src/main/java/com/harufit/repository/`)
   ```java
   public interface YourRepository extends JpaRepository<YourEntity, Long> {
       // 커스텀 쿼리 메서드
   }
   ```

3. **Service 생성** (`backend/src/main/java/com/harufit/service/`)
   ```java
   @Service
   public class YourService {
       // 비즈니스 로직
   }
   ```

4. **Controller 생성** (`backend/src/main/java/com/harufit/controller/`)
   ```java
   @RestController
   @RequestMapping("/api/your-endpoint")
   public class YourController {
       // REST API 엔드포인트
   }
   ```

### React 페이지 추가하기

1. `frontend/src/pages/` 디렉토리에 새 페이지 컴포넌트 생성
2. `frontend/src/App.js`에 라우트 추가:
   ```javascript
   <Route path="/your-page" element={<YourPage />} />
   ```
3. `frontend/src/api/` 디렉토리에 API 클라이언트 추가

### 데이터베이스 마이그레이션

Spring Boot는 JPA를 사용하므로 엔티티 변경 시 자동으로 마이그레이션이 적용됩니다.

---

## 📖 문서

프로젝트의 상세 문서는 `Document/` 디렉토리에 있습니다:

| 문서 | 설명 |
|------|------|
| 📄 **요구사항 명세서** | 시스템 요구사항 및 기능 명세 |
| 📊 **유스케이스 다이어그램** | 사용자 시나리오 및 시스템 상호작용 |
| 🔄 **비지니스 로직 정의서** | 비즈니스 프로세스 및 규칙 정의 |
| 🎨 **와이어프레임** | 화면 레이아웃 및 구조 설계 |
| 🖼️ **프로토타입** | 고품질 UI/UX 디자인 |
| 🎨 **디자인 가이드라인** | 디자인 시스템 및 스타일 가이드 |
| 🗄️ **DB 설계도** | 데이터베이스 ERD 및 스키마 |
| 🔌 **API 명세서** | REST API 엔드포인트 문서 |

문서는 HTML 형식으로 제공되며, `Document/index.html`에서 모든 문서에 접근할 수 있습니다.

---

## 🎯 주요 특징

### 🔐 보안
- Spring Security 기반 인증 및 권한 관리
- 세션 기반 인증
- CORS 설정
- 비밀번호 암호화

### 📱 반응형 디자인
- Bootstrap 5 기반 모바일 친화적 UI
- 다양한 화면 크기 지원
- 터치 최적화

### 📊 데이터 시각화
- Chart.js를 활용한 운동 통계 그래프
- 목표 달성률 시각화
- 운동 추이 분석

### 🚀 성능 최적화
- Docker 컨테이너화로 빠른 배포
- 효율적인 데이터베이스 쿼리
- 프론트엔드 코드 스플리팅

---

## 📝 라이선스

이 프로젝트는 개인 프로젝트입니다.

---

## 👤 작성자

**Haru**

- GitHub: [@haru1813](https://github.com/haru1813)
- Repository: [HaruFit](https://github.com/haru1813/HaruFit)

---

## 🙏 감사의 말

이 프로젝트는 다음 오픈소스 프로젝트들을 사용합니다:

- [React](https://reactjs.org/)
- [Spring Boot](https://spring.io/projects/spring-boot)
- [MariaDB](https://mariadb.org/)
- [Docker](https://www.docker.com/)
- [Bootstrap](https://getbootstrap.com/)
- [Chart.js](https://www.chartjs.org/)

---

<div align="center">

**Made with ❤️ by Haru**

💪 Stay Fit, Stay Strong!

⭐ Star this repository if you find it helpful!

</div>
