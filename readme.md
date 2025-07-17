# Logger.js

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript" />
  <img src="https://img.shields.io/badge/Node.js-%3E=18.0.0-brightgreen?logo=node.js" />
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" />
</p>

`console`의 출력 기능을 유지하면서 원하는 디렉터리 경로에 `.log` 파일을 > 자동으로 생성 및 기록하게 해주는 간단한 콘솔 + 파일 로깅 유틸입니다.

## ✨ 특징

- **한 줄 사용** &nbsp;: &nbsp;`Logger.startWriteLogFile()` 호출만으로 로그 파일 기록 시작  
- **자동 디렉터리 생성** &nbsp;: &nbsp;존재하지 않는 경로는 재귀적으로 생성하여 경로 보장
- **가독성 높은 타임스탬프** &nbsp;: &nbsp;`YYYY‑MM‑DD HH:MM:SS` 형식  
- **3단계 로그 레벨** &nbsp;: &nbsp;`info | warn | error`  
- **실행 중 설정 변경 가능** &nbsp;: &nbsp;로그 위치·파일명을 동적으로 교체 가능
- **`SIGINT` 안전 종료** &nbsp;: &nbsp;`Ctrl+C` 발생 시 스트림을 안전하게 flush 후 닫음  
- **의존성 없음** &nbsp;: &nbsp;Node 기본 모듈만 사용 (`fs`,`path`)

## ⌨️ 사용 예시
```
import { Logger } from './example/path/logger';

// (선택) 로그 저장 경로 및 파일명 지정
Logger.setLogSaveDir('./logs');
Logger.setLogFile('server.log');

// 로그 파일 기록 시작
Logger.startWriteLogFile();

Logger.info('서버가 시작되었습니다.');
Logger.warn('메모리 사용량이 높습니다.');
Logger.error('예기치 못한 오류 발생!');

// 필요 시 일시 중지 및 재개
Logger.pauseWriteLogFile(true);   // 중지
Logger.pauseWriteLogFile(false);  // 재개

// 애플리케이션 종료 전에 호출 (SIGINT에서 자동으로 호출)
Logger.stopWriteLogFile();
```

## ⌨️ ExpressLogger 사용 예시
```
app.get("/route/v1", (req, res) => {
    const logger = new ExpressLogger(req);

    logger.info("이건 일반 메세지");
    // -> 예시 출력: [2025-07-18 07:24:49] [INFO] [GET /route/v1] [IP: ::1] 이건 일반 메세지

    logger.warn("이건 경고 메세지");
    // -> 예시 출력: [2025-07-18 07:24:49] [WARN] [GET /route/v1] [IP: ::1] 이건 경고 메세지

    logger.error("이건 오류 메세지");
    // -> 예시 출력: [2025-07-18 07:24:49] [ERROR] [GET /route/v1] [IP: ::1] 이건 오류 메세지

    logger.info("GET 요청:",req.query);
    // -> 예시 출력: [2025-07-18 07:24:49] [INFO] [GET /route/v1] [IP: ::1] GET 요청: {}

    res.send(`hello world`);
});
```

## 🛠️ 레퍼런스
|메서드|설명|
| --- | --- |
|`Logger.startWriteLogFile(fileOrDir?)`|로그 기록 스트림 오픈<br/>- `fileOrDir`가 **폴더**일 경우: 해당 폴더 + 자동 파일명<br/>- `fileOrDir`가 **.log** 파일일 경우: 지정 파일 사용|
|`Logger.stopWriteLogFile()`| 스트림 flush 후 닫기|
|`Logger.pauseWriteLogFile(bool)`| `true` → 기록 일시 중지, `false` → 재개|
|`Logger.setLogSaveDir(dir)`| 로그 저장 폴더 변경 (즉시 스트림이 다시 열림)|
|`Logger.setLogFile(file)`| 로그 파일명 변경 (즉시 스트림이 다시 열림)|
|`Logger.setSilent(bool)`| 디버그 메세지 출력 여부|
|`Logger.getLogSaveDir()`| 현재 로그 저장 폴더 반환|
|`Logger.getLogFileFullPath()`| 실제 사용 중인 파일의 절대 경로|
|`Logger.info(message)`| `[INFO]` 레벨 기록|
|`Logger.warn(message)`| `[WARN]` 레벨 기록|
|`Logger.error(message)`| `[ERROR]` 레벨 기록|
|`Logger.obj2str(value)`| 객체·에러를 사람이 읽기 좋은 문자열로 변환 (순환 참조 안전)|
