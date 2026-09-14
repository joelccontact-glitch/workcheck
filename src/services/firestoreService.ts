import { db } from '@/utils/firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc
} from 'firebase/firestore';
import { 
  Project, 
  IssueItem, 
  LessonsLearnedItem, 
  INITIAL_PROJECTS, 
  INITIAL_ISSUES, 
  INITIAL_LESSONS_LEARNED 
} from '@/utils/pmoData';

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  team: string;
  rank: string;
  role: 'ADMIN' | 'EXECUTIVE' | 'PM' | 'USER';
  status: '승인완료' | '승인대기' | '비활성화';
  assignedProject: string;
  joinedAt: string;
}

export const INITIAL_USERS: SystemUser[] = [
  { id: 'u1', name: '김철수', email: 'kim@daumis.co.kr', team: '경영전략실', rank: '전무', role: 'EXECUTIVE', status: '승인완료', assignedProject: '전사 총괄', joinedAt: '2026-01-10' },
  { id: 'u2', name: '박민우', email: 'pm.park@daumis.co.kr', team: 'SI사업1팀', rank: '수석', role: 'PM', status: '승인완료', assignedProject: '차세대 금융 원장 재구축', joinedAt: '2026-02-01' },
  { id: 'u3', name: '김지훈', email: 'pmo@daumis.co.kr', team: 'PMO본부', rank: '이사', role: 'ADMIN', status: '승인완료', assignedProject: 'PMO 전사 관제', joinedAt: '2026-01-05' },
  { id: 'u4', name: '최영희', email: 'yh.choi@daumis.co.kr', team: '클라우드개발팀', rank: '책임', role: 'PM', status: '승인완료', assignedProject: 'AI 기반 스마트 고객센터', joinedAt: '2026-02-15' },
  { id: 'u5', name: '이동현', email: 'dh.lee@daumis.co.kr', team: '데이터플랫폼팀', rank: '선임', role: 'PM', status: '승인대기', assignedProject: '빅데이터 모니터링 파이프라인', joinedAt: '2026-03-01' }
];

// ====================================================================
// Data Seeding Functions (Exposed for explicit admin seeding/reset)
// ====================================================================
export async function seedFirebaseDataIfEmpty() {
  try {
    const projectsSnap = await getDocs(collection(db, 'projects'));
    if (projectsSnap.empty) {
      for (const p of INITIAL_PROJECTS) {
        await setDoc(doc(db, 'projects', p.id), p);
      }
    }
    const issuesSnap = await getDocs(collection(db, 'issues'));
    if (issuesSnap.empty) {
      for (const item of INITIAL_ISSUES) {
        await setDoc(doc(db, 'issues', item.id), item);
      }
    }
    const usersSnap = await getDocs(collection(db, 'users'));
    if (usersSnap.empty) {
      for (const u of INITIAL_USERS) {
        await setDoc(doc(db, 'users', u.id), u);
      }
    }
    const lessonsSnap = await getDocs(collection(db, 'lessons_learned'));
    if (lessonsSnap.empty) {
      for (const l of INITIAL_LESSONS_LEARNED) {
        await setDoc(doc(db, 'lessons_learned', l.id), l);
      }
    }
  } catch (err) {
    console.warn('Firebase seeding warning:', err);
  }
}

export async function forceResetAndSeedInitialFirebaseData(): Promise<void> {
  try {
    for (const p of INITIAL_PROJECTS) {
      await setDoc(doc(db, 'projects', p.id), p);
    }
    for (const item of INITIAL_ISSUES) {
      await setDoc(doc(db, 'issues', item.id), item);
    }
    for (const u of INITIAL_USERS) {
      await setDoc(doc(db, 'users', u.id), u);
    }
    for (const l of INITIAL_LESSONS_LEARNED) {
      await setDoc(doc(db, 'lessons_learned', l.id), l);
    }
  } catch (err) {
    console.error('Error resetting Firebase initial data:', err);
  }
}

// ====================================================================
// Projects CRUD (Returns [] when DB has no records)
// ====================================================================
export async function getFirebaseProjects(): Promise<Project[]> {
  try {
    const snap = await getDocs(collection(db, 'projects'));
    if (snap.empty) return [];
    const list: Project[] = [];
    snap.forEach((docSnap) => {
      list.push({ ...docSnap.data() } as Project);
    });
    return list;
  } catch (err) {
    console.error('Error fetching projects from Firebase:', err);
    return [];
  }
}

export async function addFirebaseProject(project: Project): Promise<void> {
  try {
    await setDoc(doc(db, 'projects', project.id), project);
  } catch (err) {
    console.error('Error adding project to Firebase:', err);
  }
}

export async function updateFirebaseProject(id: string, updates: Partial<Project>): Promise<void> {
  try {
    const ref = doc(db, 'projects', id);
    await updateDoc(ref, updates);
  } catch (err) {
    console.error('Error updating project in Firebase:', err);
  }
}

// ====================================================================
// Issues CRUD (Returns [] when DB has no records)
// ====================================================================
export async function getFirebaseIssues(): Promise<IssueItem[]> {
  try {
    const snap = await getDocs(collection(db, 'issues'));
    if (snap.empty) return [];
    const list: IssueItem[] = [];
    snap.forEach((docSnap) => {
      list.push({ ...docSnap.data() } as IssueItem);
    });
    return list;
  } catch (err) {
    console.error('Error fetching issues from Firebase:', err);
    return [];
  }
}

export async function addFirebaseIssue(issue: IssueItem): Promise<void> {
  try {
    await setDoc(doc(db, 'issues', issue.id), issue);
  } catch (err) {
    console.error('Error adding issue to Firebase:', err);
  }
}

export async function updateFirebaseIssue(id: string, updates: Partial<IssueItem>): Promise<void> {
  try {
    const ref = doc(db, 'issues', id);
    await updateDoc(ref, updates);
  } catch (err) {
    console.error('Error updating issue in Firebase:', err);
  }
}

export async function deleteFirebaseIssue(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'issues', id));
  } catch (err) {
    console.error('Error deleting issue from Firebase:', err);
  }
}

// ====================================================================
// Users CRUD (Returns [] when DB has no records)
// ====================================================================
export async function getFirebaseUsers(): Promise<SystemUser[]> {
  try {
    const snap = await getDocs(collection(db, 'users'));
    if (snap.empty) return [];
    const list: SystemUser[] = [];
    snap.forEach((docSnap) => {
      list.push({ ...docSnap.data() } as SystemUser);
    });
    return list;
  } catch (err) {
    console.error('Error fetching users from Firebase:', err);
    return [];
  }
}

export async function addFirebaseUser(user: SystemUser): Promise<void> {
  try {
    await setDoc(doc(db, 'users', user.id), user);
  } catch (err) {
    console.error('Error adding user to Firebase:', err);
  }
}

export async function updateFirebaseUser(id: string, updates: Partial<SystemUser>): Promise<void> {
  try {
    const ref = doc(db, 'users', id);
    await updateDoc(ref, updates);
  } catch (err) {
    console.error('Error updating user in Firebase:', err);
  }
}

// ====================================================================
// Lessons Learned CRUD (Returns [] when DB has no records)
// ====================================================================
export async function getFirebaseLessonsLearned(): Promise<LessonsLearnedItem[]> {
  try {
    const snap = await getDocs(collection(db, 'lessons_learned'));
    if (snap.empty) return [];
    const list: LessonsLearnedItem[] = [];
    snap.forEach((docSnap) => {
      list.push({ ...docSnap.data() } as LessonsLearnedItem);
    });
    return list;
  } catch (err) {
    console.error('Error fetching lessons learned from Firebase:', err);
    return [];
  }
}

export async function addFirebaseLessonLearned(item: LessonsLearnedItem): Promise<void> {
  try {
    await setDoc(doc(db, 'lessons_learned', item.id), item);
  } catch (err) {
    console.error('Error adding lesson learned to Firebase:', err);
  }
}
