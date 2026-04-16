# 클라이언트 포털 Notion 스키마 설정 가이드

## 개요

클라이언트 포털은 Notion `Clients` 데이터베이스를 인증 소스로 사용합니다.
관리자가 Notion에서 직접 클라이언트 계정을 관리할 수 있습니다.

---

## 1. Clients 데이터베이스 생성

Notion에서 새 데이터베이스를 생성하고 다음 필드를 추가하세요.

| 필드명         | Notion 타입 | 필수 여부 | 설명                                |
| -------------- | ----------- | --------- | ----------------------------------- |
| `client_id`    | Title       | 필수      | 클라이언트 식별 ID (예: CLIENT-001) |
| `email`        | Email       | 필수      | 로그인에 사용할 이메일 주소         |
| `access_token` | Text        | 필수      | 접속 토큰 (32자 난수 권장)          |
| `name`         | Text        | 필수      | 클라이언트 담당자 이름              |
| `company`      | Text        | 선택      | 회사명                              |
| `is_active`    | Checkbox    | 필수      | 계정 활성화 여부                    |
| `invoices`     | Relation    | 권장      | Invoices 데이터베이스와 연결        |

### 필드 생성 방법

1. Notion에서 데이터베이스 생성 후 "+" 버튼으로 필드 추가
2. `client_id`는 기본 Title 필드를 그대로 사용 (필드명 변경)
3. `email` 필드: 타입을 **Email**로 설정
4. `access_token` 필드: 타입을 **Text**로 설정
5. `invoices` 필드: 타입을 **Relation**으로 설정 후 Invoices DB 연결

---

## 2. Invoices 데이터베이스 연결 (선택사항)

클라이언트별 견적서 필터링을 위해 기존 Invoices DB와 연결하면 편리합니다.

1. Clients DB에서 `invoices` 필드 선택
2. 타입: **Relation**
3. 연결 데이터베이스: **Invoices** (기존 견적서 DB)
4. 각 클라이언트 항목에서 해당 클라이언트의 견적서 페이지 연결

> **참고**: Relation 연결 없이도 `client_name` 텍스트 필드로 견적서를 필터링할 수 있습니다.

---

## 3. 환경변수 설정

`.env.local` 파일에 다음 환경변수를 추가하세요.

```env
# 클라이언트 포털 설정
NOTION_CLIENTS_DATABASE_ID=여기에_클라이언트_DB_ID_입력
CLIENT_JWT_SECRET=정확히_32자_시크릿_키_입력
```

### NOTION_CLIENTS_DATABASE_ID 확인 방법

1. Notion에서 Clients 데이터베이스 열기
2. 오른쪽 상단 "..." 메뉴 → "링크 복사"
3. URL에서 `https://www.notion.so/workspace/` 이후 `?v=` 이전 부분이 DB ID
4. 대시(`-`)를 제거한 32자 ID 사용

### CLIENT_JWT_SECRET 생성 방법

터미널에서 다음 명령으로 32자 난수 생성:

```bash
openssl rand -hex 16
```

예시 출력: `a1b2c3d4e5f6789012345678901234ab` (32자)

---

## 4. 클라이언트 등록 방법

1. Clients 데이터베이스에서 **"+ New"** 버튼 클릭
2. 다음 정보 입력:

| 필드           | 예시 값                           |
| -------------- | --------------------------------- |
| `client_id`    | `CLIENT-001`                      |
| `email`        | `client@example.com`              |
| `access_token` | `a1b2c3d4e5f67890...` (32자 난수) |
| `name`         | `홍길동`                          |
| `company`      | `(주)예시 회사`                   |
| `is_active`    | ✅ 체크                           |

### 접속 토큰 생성

```bash
openssl rand -hex 16
```

---

## 5. 클라이언트에게 접속 정보 전달

클라이언트에게 다음 3가지 정보를 전달하세요:

```
포털 URL: https://your-domain.com/client/login
이메일: client@example.com
접속 토큰: a1b2c3d4e5f67890...
```

---

## 6. 계정 관리

### 계정 비활성화

클라이언트 포털 접근을 차단하려면:

- Clients DB에서 해당 클라이언트의 `is_active` 체크박스 해제

### 접속 토큰 재발급

보안상 토큰을 변경해야 하는 경우:

1. 새 토큰 생성: `openssl rand -hex 16`
2. Clients DB에서 해당 클라이언트의 `access_token` 값 업데이트
3. 새 토큰을 클라이언트에게 전달
4. 기존 JWT 세션은 만료(7일) 후 자동 무효화

> **주의**: 토큰 변경 즉시 기존 세션이 무효화되지 않습니다.
> 긴급 차단이 필요한 경우 `is_active`를 해제하세요.

---

## 7. 데이터 격리 보안

클라이언트 포털은 다음과 같이 데이터 격리를 보장합니다:

- 로그인 시 Notion에서 클라이언트 ID를 JWT에 포함
- 모든 견적서 조회 시 JWT의 클라이언트 ID로 필터링
- 타 클라이언트 견적서 URL 직접 접근 시 접근 차단

---

**📝 문서 버전**: v1.0
**📅 작성일**: 2026-04-16
