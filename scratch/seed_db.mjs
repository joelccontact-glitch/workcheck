import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAZXh2TxtP4vdzATww7RqOvQxQe_XsKlYg",
  authDomain: "mypmo-6a2b7.firebaseapp.com",
  projectId: "mypmo-6a2b7",
  storageBucket: "mypmo-6a2b7.firebasestorage.app",
  messagingSenderId: "795601612445",
  appId: "1:795601612445:web:172042fba359e50cdbae74"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const INITIAL_USERS = [
  { id: 'u1', name: '김철수', email: 'kim@daumis.co.kr', team: '경영전략실', rank: '전무', role: 'EXECUTIVE', status: '승인완료', assignedProject: '전사 총괄', joinedAt: '2026-01-10' },
  { id: 'u2', name: '박민우', email: 'pm.park@daumis.co.kr', team: 'SI사업1팀', rank: '수석', role: 'PM', status: '승인완료', assignedProject: '차세대 금융 원장 재구축', joinedAt: '2026-02-01' },
  { id: 'u3', name: '김지훈', email: 'pmo@daumis.co.kr', team: 'PMO본부', rank: '이사', role: 'ADMIN', status: '승인완료', assignedProject: 'PMO 전사 관제', joinedAt: '2026-01-05' },
  { id: 'u4', name: '최영희', email: 'yh.choi@daumis.co.kr', team: '클라우드개발팀', rank: '책임', role: 'PM', status: '승인완료', assignedProject: 'AI 기반 스마트 고객센터', joinedAt: '2026-02-15' },
  { id: 'u5', name: '이동현', email: 'dh.lee@daumis.co.kr', team: '데이터플랫폼팀', rank: '선임', role: 'PM', status: '승인대기', assignedProject: '빅데이터 모니터링 파이프라인', joinedAt: '2026-03-01' }
];

const INITIAL_PROJECTS = [
  {
    id: '1',
    code: 'PRJ-2026-A',
    name: '차세대 금융 원장 시스템 재구축',
    clientName: '한국금융지주',
    pmName: '박민우',
    pmLevel: 'PM Level 3',
    contractAmount: 145.0,
    progressPct: 68,
    stage: '설계/개발',
    healthStatus: 'Green',
    healthScore: 92,
    expectedProfit: 21.5,
    keyRisk: '코어뱅킹 인터페이스 연동 마일스톤 준수 여부',
    executiveActionNeeded: '고객사 CIO 정례 보고 시 WBS 2단계 승인 건 협조 요청',
    startDate: '2026-01-15',
    endDate: '2026-11-30'
  },
  {
    id: '2',
    code: 'PRJ-2026-B',
    name: 'AI 기반 스마트 고객센터 구축',
    clientName: '신한카드',
    pmName: '최영희',
    pmLevel: 'PM Level 2',
    contractAmount: 48.0,
    progressPct: 42,
    stage: '요구사항',
    healthStatus: 'Yellow',
    healthScore: 78,
    expectedProfit: 6.2,
    keyRisk: 'LLM 모델 파이프라인 응답 속도 Latency 지연',
    executiveActionNeeded: 'AI 인프라 GPU 클러스터 추가 예산 이사회 안건 상정',
    startDate: '2026-02-01',
    endDate: '2026-09-30'
  },
  {
    id: '3',
    code: 'PRJ-2026-C',
    name: '공공기관 빅데이터 통합 플랫폼',
    clientName: '행정안전부',
    pmName: '이수진',
    pmLevel: 'PM Level 2',
    contractAmount: 82.5,
    progressPct: 25,
    stage: '착수',
    healthStatus: 'Red',
    healthScore: 54,
    expectedProfit: -3.5,
    keyRisk: '고객사 요구사항 변경(CR) 속출로 인하여 일정 지연 3주 발생',
    executiveActionNeeded: '경영진 긴급 Escalation 회의 소집 및 수주 변경 계약(Change Request) 서명 요구',
    startDate: '2026-03-01',
    endDate: '2026-12-15'
  },
  {
    id: '4',
    code: 'PRJ-2026-D',
    name: '글로벌 SCM 공급망 통합 모니터링',
    clientName: '현대모비스',
    pmName: '최현석',
    pmLevel: 'PM Level 3',
    contractAmount: 62.0,
    progressPct: 90,
    stage: '오픈/안정화',
    healthStatus: 'Green',
    healthScore: 96,
    expectedProfit: 9.8,
    keyRisk: '해외 법인 인터페이스 최종 인수인계 데이터 검증',
    executiveActionNeeded: '없음 (정상 진행 중)',
    startDate: '2025-10-01',
    endDate: '2026-04-30'
  }
];

const INITIAL_ISSUES = [
  {
    id: 'I-001',
    projectCode: 'PRJ-2026-C',
    projectName: '공공기관 빅데이터 통합 플랫폼',
    type: 'Issue',
    title: '고객사 요구사항 범위 미확정으로 인한 3주 일정 지연',
    impact: 'Critical Red - 전체 개발 공정 마일스톤 연쇄 지연 위험',
    severity: 'Red',
    countermeasure: 'PMO본부 주관 CR(변경요청) 수수료 산정 및 범위 동결 경영진 직보고 실시',
    assignee: '김지훈 이사 (PMO)',
    dueDate: '2026-09-20',
    status: 'Open'
  },
  {
    id: 'I-002',
    projectCode: 'PRJ-2026-B',
    projectName: 'AI 기반 스마트 고객센터 구축',
    type: 'Risk',
    title: 'LLM 추론 Latency 2.5초 초과로 성능 목표 미달 우려',
    impact: 'Yellow Warning - SLA 계약 조건 미달 시 지체상금 발생 가능성',
    severity: 'Yellow',
    countermeasure: 'Model Quantization 8bit 적용 및 vLLM 추론 엔진 교체 실증',
    assignee: '최영희 책임 (PM)',
    dueDate: '2026-09-28',
    status: 'Open'
  }
];

const INITIAL_LESSONS_LEARNED = [
  {
    id: 'L-001',
    projectCode: 'PRJ-2025-X',
    projectName: '대형 금융사 통합 대시보드',
    category: '요구사항',
    type: '실패사례',
    title: '착수 단계 Scope Creep 통제 실패로 인한 수익성 악화',
    causeAnalysis: '착수 시 WBS 범위를 명확히 락인하지 않고 구두 요구사항을 지속 수용함.',
    preventionGuide: '모든 프로젝트 착수 시 요구사항 변경 요청(CR) 절차를 게이트 점검표에 의무 포함시킬 것.'
  },
  {
    id: 'L-002',
    projectCode: 'PRJ-2025-Y',
    projectName: '제조사 ERP 연동 프로젝트',
    category: '품질',
    type: '성공사례',
    title: '개발 초기 단계 통합 테스트 자동화 구축으로 결함 40% 감소',
    causeAnalysis: '설계 단계부터 CI/CD 파이프라인과 통합 단위 테스트 수성을 동시 수행함.',
    preventionGuide: '개발 3단계 진입 전 단위 테스트 Coverage 80% 달성을 필수 관문 기준으로 설정.'
  }
];

async function seed() {
  console.log('Inserting mandatory initial records into Firebase Firestore DB (mypmo-6a2b7)...');
  
  for (const p of INITIAL_PROJECTS) {
    await setDoc(doc(db, 'projects', p.id), p);
    console.log(`[Inserted] Project: ${p.id} - ${p.name}`);
  }

  for (const i of INITIAL_ISSUES) {
    await setDoc(doc(db, 'issues', i.id), i);
    console.log(`[Inserted] Issue: ${i.id} - ${i.title}`);
  }

  for (const u of INITIAL_USERS) {
    await setDoc(doc(db, 'users', u.id), u);
    console.log(`[Inserted] User: ${u.id} - ${u.name}`);
  }

  for (const l of INITIAL_LESSONS_LEARNED) {
    await setDoc(doc(db, 'lessons_learned', l.id), l);
    console.log(`[Inserted] Lesson: ${l.id} - ${l.title}`);
  }

  console.log('SUCCESS: All mandatory initial records inserted into Firebase Firestore DB!');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});
