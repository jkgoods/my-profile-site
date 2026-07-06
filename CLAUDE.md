# 프로젝트 개요

React + TypeScript 기반 할일 관리 앱

# 기술 스택

- React 19 + TypeScript
- Tailwind CSS
- Zustand (상태관리)

# 빌드 & 실행 명령어

- 개발 서버: npm run dev
- 빌드: npm run build
- 테스트: npm run test

# 코드 컨벤션

- 컴포넌트 파일명: PascalCase (예: TodoList.tsx)
- 훅 파일명: use로 시작 (예: useTodos.ts)
- 타입 정의는 types/ 디렉토리에 모아서 관리

# 프로젝트 구조

- src/components/ : UI 컴포넌트
- src/hooks/ : 커스텀 훅
- src/types/ : TypeScript 타입 정의
- src/stores/ : Zustand 스토어
