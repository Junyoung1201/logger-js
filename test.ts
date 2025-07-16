import { Logger } from "./logger";

main();

async function main() {

    // 디버그 메세지 켜기
    Logger.setSilent(false);

    // 로그 저장 폴더 설정
    Logger.setLogSaveDir("logs/aa/로그");

    // 로그 파일 작성 시작
    Logger.startWriteLogFile();

    // 로그 메세지 출력 및 기록
    Logger.info("테스트 1 테스트 2");
    Logger.warn("경고 테스트 3");
    Logger.error("오류 테스트 22");

    // 로그 파일 작성 일시정지
    Logger.pauseWriteLogFile(true);

    // 로그 메세지 출력'만' (파일 기록 X)
    Logger.info("이건 로그 파일에 나오면 안됨.");
    Logger.warn("이건 로그 파일에 나오면 안됨.");
    Logger.error("이건 로그 파일에 나오면 안됨.");

    // 로그 파일 작성 다시시작
    Logger.pauseWriteLogFile(false);

    // 로그 출력 및 기록
    Logger.info("이건 로그 파일에 나와야함!");
    Logger.warn("이건 로그 파일에 나와야함!");
    Logger.error("이건 로그 파일에 나와야함!");

    Logger.setLogFile("새로운 로그 파일로 바꾸기");
    
    Logger.info("이건 새로운 로그 파일에 나와야함!");
    Logger.warn("이건 새로운 로그 파일에 나와야함!");
    Logger.error("이건 새로운 로그 파일에 나와야함!");

    const testData = {
        user: {
            name: "이준영",
            age: 1234,
            score: 100,
            avater: "data/users/avater/이준영.png",
            deep: {
                a1: "test 1",
                a2: "test 2"
            }
        },
        thumbnail: {
            url: "hello world.png"
        }
    }

    Logger.info(`테스트 데이터: ${Logger.obj2str(testData)}`)
    
    // 종료
    Logger.stopWriteLogFile();
}