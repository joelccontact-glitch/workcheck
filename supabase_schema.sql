-- ====================================================================
-- 다음정보시스템즈 PMO 구축 및 운영체계 (DaumIS PMO Portal) Supabase Schema
-- ====================================================================

-- 1. 사용자 / PM 역량 프로필 (PM Profiles & Competency)
CREATE TABLE IF NOT EXISTS pm_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'PM' CHECK (role IN ('EXECUTIVE', 'PMO_LEADER', 'PM', 'PL', 'ADMIN')),
  pm_level TEXT DEFAULT 'PM Level 1' CHECK (pm_level IN ('PM Candidate', 'PM Level 1', 'PM Level 2', 'PM Level 3')),
  department TEXT DEFAULT 'SI사업본부',
  evaluation_score INT DEFAULT 85,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 프로젝트 기본정보 (Projects Table)
CREATE TABLE IF NOT EXISTS projects (
  id BIGSERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  client_name TEXT NOT NULL,
  pm_id UUID REFERENCES pm_profiles(id) ON DELETE SET NULL,
  contract_amount NUMERIC(15,2) DEFAULT 0, -- 억 원 단위 저장 가능 (예: 8.0)
  progress_pct INT DEFAULT 0,              -- 진척률 (0~100)
  stage TEXT DEFAULT '착수' CHECK (stage IN ('수주/이관', '착수', '요구사항', '설계/개발', '테스트', '오픈/안정화', '종료')),
  health_status TEXT DEFAULT 'Green' CHECK (health_status IN ('Green', 'Yellow', 'Red')),
  health_score INT DEFAULT 100,
  expected_profit NUMERIC(15,2) DEFAULT 0, -- 예상 손익 (억 원 단위)
  key_risk TEXT,                           -- 핵심 리스크 텍스트
  executive_action_needed TEXT,            -- 경영진 요청 사항
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 주간 점검표 & Health Score 운영체계 (Weekly Checklists & Health Score)
CREATE TABLE IF NOT EXISTS weekly_checklists (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,
  week_label TEXT NOT NULL,                -- 예: '2026-W37'
  schedule_score INT DEFAULT 20,           -- 일정 (20점 만점)
  cost_score INT DEFAULT 15,               -- 원가/공수 (15점 만점)
  quality_score INT DEFAULT 15,            -- 품질 (15점 만점)
  requirement_score INT DEFAULT 15,        -- 요구사항/변경 (15점 만점)
  resource_score INT DEFAULT 10,           -- 인력 (10점 만점)
  client_score INT DEFAULT 10,             -- 고객 (10점 만점)
  risk_score INT DEFAULT 10,               -- 리스크 (10점 만점)
  issue_score INT DEFAULT 5,               -- 이슈/의사결정 (5점 만점)
  total_score INT DEFAULT 100,             -- 총점 (100점 만점)
  has_critical_red_flag BOOLEAN DEFAULT FALSE, -- Critical Red Flag 여부 (강제 Red 승격)
  red_flag_reason TEXT,                    -- Red Flag 사유 (일정지연 >10%, 핵심인력 이탈 등)
  status TEXT DEFAULT 'Green' CHECK (status IN ('Green', 'Yellow', 'Red')),
  checked_by UUID REFERENCES pm_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Gate Check 체계 (G1~G6 단계별 심사)
CREATE TABLE IF NOT EXISTS gate_checks (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,
  gate_code TEXT CHECK (gate_code IN ('G1', 'G2', 'G3', 'G4', 'G5', 'G6')),
  gate_name TEXT NOT NULL,
  timing TEXT NOT NULL,
  check_items TEXT NOT NULL,
  result TEXT DEFAULT 'PASS' CHECK (result IN ('PASS', 'CONDITIONAL_PASS', 'HOLD')),
  reviewer_name TEXT DEFAULT 'PMO 책임자',
  condition_notes TEXT,
  due_date DATE,
  reviewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Risk / Issue / Escalation 대장
CREATE TABLE IF NOT EXISTS project_issues (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,
  issue_code TEXT NOT NULL,                 -- 예: 'I-001'
  type TEXT DEFAULT 'Issue' CHECK (type IN ('Risk', 'Issue', 'Escalation')),
  title TEXT NOT NULL,
  impact TEXT,
  severity TEXT DEFAULT 'Yellow' CHECK (severity IN ('Green', 'Yellow', 'Red')),
  countermeasure TEXT,
  assignee TEXT,
  due_date DATE,
  status TEXT DEFAULT 'Open' CHECK (status IN ('Open', 'In-Progress', 'Resolved', 'Closed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PM Standard 최소 산출물 16종 (16 PM Standard Deliverables)
CREATE TABLE IF NOT EXISTS pm_deliverables (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,
  no INT CHECK (no BETWEEN 1 AND 16),
  name TEXT NOT NULL,
  timing TEXT NOT NULL,
  owner TEXT NOT NULL,
  status TEXT DEFAULT '미작성' CHECK (status IN ('미작성', '작성중', '검토중', '승인완료')),
  file_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Lessons Learned DB 및 프로젝트 경험 축적
CREATE TABLE IF NOT EXISTS lessons_learned (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,
  category TEXT CHECK (category IN ('일정', '원가', '품질', '요구사항', '인력', '고객/계약')),
  title TEXT NOT NULL,
  type TEXT DEFAULT '실패사례' CHECK (type IN ('성공사례', '실패사례')),
  cause_analysis TEXT NOT NULL,
  prevention_guide TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. PM Academy 교육 및 승급 평가
CREATE TABLE IF NOT EXISTS pm_evaluations (
  id BIGSERIAL PRIMARY KEY,
  pm_id UUID REFERENCES pm_profiles(id) ON DELETE CASCADE,
  evaluation_period TEXT NOT NULL, -- 예: '2026 하반기'
  schedule_score INT DEFAULT 20,   -- 20점
  profit_score INT DEFAULT 15,     -- 15점
  quality_score INT DEFAULT 15,    -- 15점
  client_score INT DEFAULT 15,     -- 15점
  resource_score INT DEFAULT 10,   -- 10점
  risk_score INT DEFAULT 10,       -- 10점
  reporting_score INT DEFAULT 10,  -- 10점
  sharing_score INT DEFAULT 5,     -- 5점
  total_score INT DEFAULT 90,      -- 100점
  grade TEXT DEFAULT 'A' CHECK (grade IN ('S', 'A', 'B', 'C', 'D')),
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- Initial Seed Data (다음정보시스템즈 보고서 기준 샘플 데이터)
-- ====================================================================

-- 1. 샘플 PM 프로필
INSERT INTO pm_profiles (id, email, full_name, role, pm_level, department, evaluation_score)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'pmo@daumis.co.kr', '김지훈 책임', 'PMO_LEADER', 'PM Level 3', 'PMO센터', 95),
  ('00000000-0000-0000-0000-000000000002', 'pm1@daumis.co.kr', '이수민 수석', 'PM', 'PM Level 2', 'SI 1사업부', 88),
  ('00000000-0000-0000-0000-000000000003', 'pm2@daumis.co.kr', '박준호 차장', 'PM', 'PM Level 1', 'SI 2사업부', 74),
  ('00000000-0000-0000-0000-000000000004', 'pm3@daumis.co.kr', '정우성 부장', 'PM', 'PM Level 2', '금융사업부', 62)
ON CONFLICT (id) DO NOTHING;

-- 2. 보고서 기준 A, B, C, D 프로젝트 샘플 등록
INSERT INTO projects (code, name, client_name, contract_amount, progress_pct, stage, health_status, health_score, expected_profit, key_risk, executive_action_needed, start_date, end_date)
VALUES
  ('PRJ-2026-A', 'A 프로젝트 (차세대 차세대 금융 시스템 구축)', 'A금융지주', 8.0, 72, '설계/개발', 'Green', 92, 0.8, '-', '-', '2026-01-10', '2026-11-30'),
  ('PRJ-2026-B', 'B 프로젝트 (공공 포털 통합 고도화)', '한국정보공단', 5.0, 61, '설계/개발', 'Yellow', 78, 0.3, '핵심 개발인력 부족', '인력 1명 지원 요청', '2026-03-01', '2026-10-31'),
  ('PRJ-2026-C', 'C 프로젝트 (제조 ERP 및 SCM 구축)', 'C글로벌', 10.0, 48, '요구사항', 'Red', 58, -0.7, '요구사항 추가 및 범위확대/일정지연', '프로젝트 회복계획(Recovery Plan) 승인 필요', '2026-02-15', '2026-12-31'),
  ('PRJ-2026-D', 'D 프로젝트 (빅데이터 분석 플랫폼)', 'D텔레콤', 4.0, 35, '착수', 'Green', 89, 0.5, '-', '-', '2026-05-01', '2026-11-15')
ON CONFLICT (code) DO NOTHING;
