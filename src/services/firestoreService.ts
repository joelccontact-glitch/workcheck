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
// 1. Automatic & Force Data Seeding Functions
// ====================================================================
export async function seedFirebaseDataIfEmpty() {
  try {
    // 1. Check Projects
    const projectsSnap = await getDocs(collection(db, 'projects'));
    if (projectsSnap.empty) {
      console.log('Seeding initial projects to Firestore...');
      for (const p of INITIAL_PROJECTS) {
        await setDoc(doc(db, 'projects', p.id), p);
      }
    }

    // 2. Check Issues
    const issuesSnap = await getDocs(collection(db, 'issues'));
    if (issuesSnap.empty) {
      console.log('Seeding initial issues to Firestore...');
      for (const item of INITIAL_ISSUES) {
        await setDoc(doc(db, 'issues', item.id), item);
      }
    }

    // 3. Check Users
    const usersSnap = await getDocs(collection(db, 'users'));
    if (usersSnap.empty) {
      console.log('Seeding initial users to Firestore...');
      for (const u of INITIAL_USERS) {
        await setDoc(doc(db, 'users', u.id), u);
      }
    }

    // 4. Check Lessons Learned
    const lessonsSnap = await getDocs(collection(db, 'lessons_learned'));
    if (lessonsSnap.empty) {
      console.log('Seeding initial lessons learned to Firestore...');
      for (const l of INITIAL_LESSONS_LEARNED) {
        await setDoc(doc(db, 'lessons_learned', l.id), l);
      }
    }
  } catch (err) {
    console.warn('Firebase seeding warning (using local fallback defaults):', err);
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
    console.error('Error force resetting Firebase initial data:', err);
  }
}

// ====================================================================
// 2. Projects CRUD with Guarantee of Initial Defaults
// ====================================================================
export async function getFirebaseProjects(): Promise<Project[]> {
  try {
    await seedFirebaseDataIfEmpty();
    const snap = await getDocs(collection(db, 'projects'));
    if (snap.empty) return INITIAL_PROJECTS;
    const list: Project[] = [];
    snap.forEach((docSnap) => {
      list.push({ ...docSnap.data() } as Project);
    });
    return list.length > 0 ? list : INITIAL_PROJECTS;
  } catch (err) {
    console.error('Error fetching projects from Firebase, returning initial default fallback:', err);
    return INITIAL_PROJECTS;
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
// 3. Issues CRUD with Guarantee of Initial Defaults
// ====================================================================
export async function getFirebaseIssues(): Promise<IssueItem[]> {
  try {
    await seedFirebaseDataIfEmpty();
    const snap = await getDocs(collection(db, 'issues'));
    if (snap.empty) return INITIAL_ISSUES;
    const list: IssueItem[] = [];
    snap.forEach((docSnap) => {
      list.push({ ...docSnap.data() } as IssueItem);
    });
    return list.length > 0 ? list : INITIAL_ISSUES;
  } catch (err) {
    console.error('Error fetching issues from Firebase, returning initial default fallback:', err);
    return INITIAL_ISSUES;
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
// 4. Users CRUD with Guarantee of Initial Defaults
// ====================================================================
export async function getFirebaseUsers(): Promise<SystemUser[]> {
  try {
    await seedFirebaseDataIfEmpty();
    const snap = await getDocs(collection(db, 'users'));
    if (snap.empty) return INITIAL_USERS;
    const list: SystemUser[] = [];
    snap.forEach((docSnap) => {
      list.push({ ...docSnap.data() } as SystemUser);
    });
    return list.length > 0 ? list : INITIAL_USERS;
  } catch (err) {
    console.error('Error fetching users from Firebase, returning initial default fallback:', err);
    return INITIAL_USERS;
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
// 5. Lessons Learned CRUD with Guarantee of Initial Defaults
// ====================================================================
export async function getFirebaseLessonsLearned(): Promise<LessonsLearnedItem[]> {
  try {
    await seedFirebaseDataIfEmpty();
    const snap = await getDocs(collection(db, 'lessons_learned'));
    if (snap.empty) return INITIAL_LESSONS_LEARNED;
    const list: LessonsLearnedItem[] = [];
    snap.forEach((docSnap) => {
      list.push({ ...docSnap.data() } as LessonsLearnedItem);
    });
    return list.length > 0 ? list : INITIAL_LESSONS_LEARNED;
  } catch (err) {
    console.error('Error fetching lessons learned from Firebase, returning initial default fallback:', err);
    return INITIAL_LESSONS_LEARNED;
  }
}

export async function addFirebaseLessonLearned(item: LessonsLearnedItem): Promise<void> {
  try {
    await setDoc(doc(db, 'lessons_learned', item.id), item);
  } catch (err) {
    console.error('Error adding lesson learned to Firebase:', err);
  }
}
