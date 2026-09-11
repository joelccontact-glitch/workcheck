// ====================================================================
// 다음정보시스템즈 PMO 구축 및 운영체계 (DaumIS PMO Portal) Data Store & Calculation Engine
// ====================================================================

export interface Project {
  id: string;
  code: string;
  name: string;
  clientName: string;
  pmName: string;
  pmLevel: 'PM Candidate' | 'PM Level 1' | 'PM Level 2' | 'PM Level 3';
  contractAmount: number; // 억원
  progressPct: number;    // %
  stage: '수주/이관' | '착수' | '요구사항' | '설계/개발' | '테스트' | '오픈/안정화' | '종료';
  healthStatus: 'Green' | 'Yellow' | 'Red';
  healthScore: number;    // 0~100
  expectedProfit: number; // 억원
  keyRisk: string;
  executiveActionNeeded: string;
  startDate: string;
  endDate: string;
}

export interface PMDeliverable {
  no: number;
  name: string;
  timing: string;
  owner: string;
  status: '미작성' | '작성중' | '검토중' | '승인완료';
}

export interface GateCheck {
  code: 'G1' | 'G2' | 'G3' | 'G4' | 'G5' | 'G6';
  name: string;
  timing: string;
  checkItems: string;
  passCriteria: string;
  result: 'PASS' | 'CONDITIONAL_PASS' | 'HOLD';
  dueMonth: string;
  reviewer: string;
}

export interface IssueItem {
  id: string;
  projectCode: string;
  projectName: string;
  type: 'Risk' | 'Issue' | 'Escalation';
  title: string;
  impact: string;
  severity: 'Green' | 'Yellow' | 'Red';
  countermeasure: string;
  assignee: string;
  dueDate: string;
  status: 'Open' | 'In-Progress' | 'Resolved' | 'Closed';
}

export interface PMProfile {
  id: string;
  name: string;
  level: 'PM Candidate' | 'PM Level 1' | 'PM Level 2' | 'PM Level 3';
  department: string;
  experienceYears: number;
  completedAcademy: boolean;
  score: number;
  grade: 'S' | 'A' | 'B' | 'C' | 'D';
}

export interface LessonsLearnedItem {
  id: string;
  projectCode: string;
  projectName: string;
  category: '일정' | '원가' | '품질' | '요구사항' | '인력' | '고객/계약';
  type: '성공사례' | '실패사례';
  title: string;
  causeAnalysis: string;
  preventionGuide: string;
}

// 16종 PM Standard 최소 산출물 정의
export const PM_STANDARD_16_ITEMS: Omit<PMDeliverable, 'status'>[] = [
  { no: 1, name: 'Project Charter', timing: '착수', owner: 'PM' },
  { no: 2, name: '프로젝트 조직/R&R', timing: '착수', owner: 'PM' },
  { no: 3, name: 'WBS/기준일정', timing: '착수·변경', owner: 'PM/PL' },
  { no: 4, name: '요구사항 목록', timing: '요구사항', owner: 'PL' },
  { no: 5, name: '요구사항 추적표', timing: '요구사항~테스트', owner: 'PL' },
  { no: 6, name: '변경관리대장', timing: '상시', owner: 'PM' },
  { no: 7, name: '리스크대장', timing: '착수·주간', owner: 'PM' },
  { no: 8, name: '이슈대장', timing: '상시', owner: 'PM/PL' },
  { no: 9, name: '인력/공수계획', timing: '월간', owner: 'PM' },
  { no: 10, name: '품질계획/결함대장', timing: '테스트', owner: 'QA/PL' },
  { no: 11, name: '주간보고', timing: '주간', owner: 'PM' },
  { no: 12, name: '월간보고', timing: '월간', owner: 'PMO' },
  { no: 13, name: 'Gate Check', timing: '단계별', owner: 'PMO/PM' },
  { no: 14, name: '의사결정대장', timing: '상시', owner: 'PM' },
  { no: 15, name: '종료보고', timing: '종료', owner: 'PM' },
  { no: 16, name: 'Lessons Learned', timing: '종료', owner: 'PM/PMO' }
];

// 초기 프로젝트 시드 데이터 (경영진 보고서 예시 기준)
export const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    code: 'PRJ-2026-A',
    name: 'A 프로젝트 (차세대 금융 시스템 구축)',
    clientName: 'A금융지주',
    pmName: '이수민 수석',
    pmLevel: 'PM Level 2',
    contractAmount: 8.0,
    progressPct: 72,
    stage: '설계/개발',
    healthStatus: 'Green',
    healthScore: 92,
    expectedProfit: 0.8,
    keyRisk: '-',
    executiveActionNeeded: '-',
    startDate: '2026-01-10',
    endDate: '2026-11-30'
  },
  {
    id: '2',
    code: 'PRJ-2026-B',
    name: 'B 프로젝트 (공공 포털 통합 고도화)',
    clientName: '한국정보공단',
    pmName: '박준호 차장',
    pmLevel: 'PM Level 1',
    contractAmount: 5.0,
    progressPct: 61,
    stage: '설계/개발',
    healthStatus: 'Yellow',
    healthScore: 78,
    expectedProfit: 0.3,
    keyRisk: '핵심 개발인력 부족',
    executiveActionNeeded: '인력 1명 지원 요청',
    startDate: '2026-03-01',
    endDate: '2026-10-31'
  },
  {
    id: '3',
    code: 'PRJ-2026-C',
    name: 'C 프로젝트 (제조 ERP 및 SCM 구축)',
    clientName: 'C글로벌',
    pmName: '정우성 부장',
    pmLevel: 'PM Level 2',
    contractAmount: 10.0,
    progressPct: 48,
    stage: '요구사항',
    healthStatus: 'Red',
    healthScore: 58,
    expectedProfit: -0.7,
    keyRisk: '일정지연 >10% & 요구사항 승인 지연',
    executiveActionNeeded: '프로젝트 회복계획(Recovery Plan) 승인 필요',
    startDate: '2026-02-15',
    endDate: '2026-12-31'
  },
  {
    id: '4',
    code: 'PRJ-2026-D',
    name: 'D 프로젝트 (빅데이터 분석 플랫폼)',
    clientName: 'D텔레콤',
    pmName: '김지훈 책임',
    pmLevel: 'PM Level 3',
    contractAmount: 4.0,
    progressPct: 35,
    stage: '착수',
    healthStatus: 'Green',
    healthScore: 89,
    expectedProfit: 0.5,
    keyRisk: '-',
    executiveActionNeeded: '-',
    startDate: '2026-05-01',
    endDate: '2026-11-15'
  }
];

// 초기 이슈/리스크 데이터
export const INITIAL_ISSUES: IssueItem[] = [
  {
    id: 'I-001',
    projectCode: 'PRJ-2026-B',
    projectName: 'B 프로젝트 (공공 포털 통합 고도화)',
    type: 'Risk',
    title: '고객 승인 지연 및 일정 차질 우려',
    impact: '개발 일정 1주일 영향',
    severity: 'Yellow',
    countermeasure: '승인회의 개최 요청 및 대체인력 투입 검토',
    assignee: '박준호 차장',
    dueDate: '2026-09-20',
    status: 'In-Progress'
  },
  {
    id: 'I-002',
    projectCode: 'PRJ-2026-C',
    projectName: 'C 프로젝트 (제조 ERP 및 SCM 구축)',
    type: 'Escalation',
    title: '핵심개발자 이탈 및 고객 요구사항 무승인 증대',
    impact: '공수 초과 및 0.7억 손실 예상',
    severity: 'Red',
    countermeasure: 'PMO 회복계획 수립 및 경영진 회의 안건 상정',
    assignee: '정우성 부장 / PMO',
    dueDate: '2026-09-15',
    status: 'Open'
  }
];

// Gate Check 6개 관문 정의
export const GATES_DEFINITION: Omit<GateCheck, 'result' | 'dueMonth' | 'reviewer'>[] = [
  { code: 'G1', name: 'G1 착수 Gate', timing: '계약 후', checkItems: '범위·일정·인력·PM·리스크 검토', passCriteria: '실행 가능한 계획 확정' },
  { code: 'G2', name: 'G2 요구사항 Gate', timing: '요구사항 종료', checkItems: '요구사항/변경 기준/추적성', passCriteria: '핵심 요구사항 승인' },
  { code: 'G3', name: 'G3 설계 Gate', timing: '설계 종료', checkItems: '설계 완성도·인터페이스·개발준비', passCriteria: '개발 착수 가능 판정' },
  { code: 'G4', name: 'G4 개발 Gate', timing: '개발 종료', checkItems: '기능완료·결함·테스트 준비', passCriteria: '테스트 진입 가능' },
  { code: 'G5', name: 'G5 오픈 Gate', timing: '오픈 전', checkItems: 'Critical 결함 0건·운영/교육/백업', passCriteria: '오픈 승인' },
  { code: 'G6', name: 'G6 종료 Gate', timing: '검수 후', checkItems: '손익·검수·미결사항·회고', passCriteria: '종료/Project DB 등록 완료' }
];

// PM Academy & 역량 등급 리스트
export const INITIAL_PM_PROFILES: PMProfile[] = [
  { id: '1', name: '김지훈 책임', level: 'PM Level 3', department: 'PMO센터', experienceYears: 12, completedAcademy: true, score: 95, grade: 'S' },
  { id: '2', name: '이수민 수석', level: 'PM Level 2', department: 'SI 1사업부', experienceYears: 8, completedAcademy: true, score: 88, grade: 'A' },
  { id: '3', name: '박준호 차장', level: 'PM Level 1', department: 'SI 2사업부', experienceYears: 5, completedAcademy: true, score: 78, grade: 'B' },
  { id: '4', name: '정우성 부장', level: 'PM Level 2', department: '금융사업부', experienceYears: 10, completedAcademy: false, score: 62, grade: 'D' }
];

// Lessons Learned 시드 데이터
export const INITIAL_LESSONS_LEARNED: LessonsLearnedItem[] = [
  {
    id: 'L-001',
    projectCode: 'PRJ-2026-C',
    projectName: 'C 프로젝트 (제조 ERP)',
    category: '요구사항',
    type: '실패사례',
    title: '요구사항 구체화 미흡으로 인한 무승인 범위 확대',
    causeAnalysis: '착수 단계에서 고객 현업 부서별 구체적 요구사항을 문서화하지 않고 구두 협의로 개발 진입함.',
    preventionGuide: 'G2 요구사항 Gate 통과 전까지 추가 요청사항은 변경관리대장(CR)에 작성 및 비용산정 승인 의무화.'
  },
  {
    id: 'L-002',
    projectCode: 'PRJ-2026-A',
    projectName: 'A 프로젝트 (차세대 금융)',
    category: '일정',
    type: '성공사례',
    title: 'Critical Path 주간 집중 관리를 통한 2주 일정 단축',
    causeAnalysis: '주간 점검표를 통해 CP 상의 핵심 인터페이스 개발 일정을 매주 점검하고 이슈 발생 즉시 지원 인력 투입.',
    preventionGuide: '모든 프로젝트 착수 시 WBS 상의 Critical Path를 별도 색상으로 가시화하여 주간 보고서 필수 항목으로 관리.'
  }
];

// Health Score 계산 함수 (100점 만점 + Critical Red Flag 강제 승격 룰)
export function calculateHealthScore(scores: {
  schedule: number;      // 20
  cost: number;          // 15
  quality: number;       // 15
  requirement: number;   // 15
  resource: number;      // 10
  client: number;        // 10
  risk: number;          // 10
  issue: number;         // 5
}, hasCriticalRedFlag: boolean): { totalScore: number; status: 'Green' | 'Yellow' | 'Red' } {
  const totalScore = 
    scores.schedule +
    scores.cost +
    scores.quality +
    scores.requirement +
    scores.resource +
    scores.client +
    scores.risk +
    scores.issue;

  if (hasCriticalRedFlag) {
    return { totalScore, status: 'Red' };
  }

  if (totalScore >= 85) {
    return { totalScore, status: 'Green' };
  } else if (totalScore >= 70) {
    return { totalScore, status: 'Yellow' };
  } else {
    return { totalScore, status: 'Red' };
  }
}
