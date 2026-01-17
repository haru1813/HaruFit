-- HaruFit 데이터베이스 초기화 스크립트

-- 데이터베이스 생성 (이미 docker-compose에서 생성됨)
-- USE harufit;

-- 문자 인코딩 설정
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- users 테이블
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nickname VARCHAR(50) NOT NULL,
    height DECIMAL(5,2) NULL,
    weight DECIMAL(5,2) NULL,
    age INT NULL,
    gender ENUM('male', 'female', 'other') NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_nickname (nickname)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- exercises 테이블 (운동 종목)
CREATE TABLE IF NOT EXISTS exercises (
    exercise_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NULL,
    muscle_group VARCHAR(50) NULL,
    description TEXT NULL,
    INDEX idx_category (category),
    INDEX idx_muscle_group (muscle_group)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- routines 테이블
CREATE TABLE IF NOT EXISTS routines (
    routine_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- routine_exercises 테이블
CREATE TABLE IF NOT EXISTS routine_exercises (
    routine_exercise_id INT AUTO_INCREMENT PRIMARY KEY,
    routine_id INT NOT NULL,
    exercise_id INT NOT NULL,
    sets INT NOT NULL,
    reps INT NOT NULL,
    weight DECIMAL(5,2) NULL,
    rest_time INT NULL,
    `order` INT DEFAULT 0,
    FOREIGN KEY (routine_id) REFERENCES routines(routine_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES exercises(exercise_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    UNIQUE KEY uk_routine_exercise (routine_id, exercise_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- workout_logs 테이블
CREATE TABLE IF NOT EXISTS workout_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    routine_id INT NULL,
    workout_date DATE NOT NULL,
    duration INT NULL,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (routine_id) REFERENCES routines(routine_id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_user_date (user_id, workout_date),
    INDEX idx_workout_date (workout_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- workout_sets 테이블
CREATE TABLE IF NOT EXISTS workout_sets (
    set_id INT AUTO_INCREMENT PRIMARY KEY,
    log_id INT NOT NULL,
    exercise_id INT NOT NULL,
    set_number INT NOT NULL,
    weight DECIMAL(5,2) NULL,
    reps INT NOT NULL,
    rest_time INT NULL,
    FOREIGN KEY (log_id) REFERENCES workout_logs(log_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES exercises(exercise_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    UNIQUE KEY uk_log_exercise_set (log_id, exercise_id, set_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- goals 테이블
CREATE TABLE IF NOT EXISTS goals (
    goal_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    goal_type ENUM('weight', 'muscle', 'frequency', 'duration', 'other') NOT NULL,
    target_value DECIMAL(10,2) NOT NULL,
    current_value DECIMAL(10,2) NOT NULL,
    deadline DATE NOT NULL,
    status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_user_status (user_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- workout_journals 테이블
CREATE TABLE IF NOT EXISTS workout_journals (
    journal_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    workout_date DATE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE KEY uk_user_date (user_id, workout_date),
    INDEX idx_user_date (user_id, workout_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 기본 운동 종목 데이터 삽입
INSERT INTO exercises (name, category, muscle_group, description) VALUES
('벤치프레스', '상체', '가슴', '가슴 근육을 발달시키는 대표적인 운동'),
('스쿼트', '하체', '다리', '하체 전반을 발달시키는 운동'),
('데드리프트', '전신', '등', '등과 하체를 동시에 발달시키는 운동'),
('덤벨 플라이', '상체', '가슴', '가슴 외측 근육을 발달시키는 운동'),
('랫 풀다운', '상체', '등', '등 상부를 발달시키는 운동'),
('오버헤드 프레스', '상체', '어깨', '어깨 근육을 발달시키는 운동'),
('바벨 로우', '상체', '등', '등 중앙부를 발달시키는 운동'),
('레그 프레스', '하체', '다리', '대퇴사두근을 발달시키는 운동'),
('레그 컬', '하체', '다리', '햄스트링을 발달시키는 운동'),
('사이드 레터럴 레이즈', '상체', '어깨', '어깨 외측을 발달시키는 운동')
ON DUPLICATE KEY UPDATE name=name;
