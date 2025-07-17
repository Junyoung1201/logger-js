import {ExpressLogger,Logger} from './logger';
import * as express from 'express';

const app = express();

app.get("/route/endpoint_1", (req, res) => {
    const logger = new ExpressLogger(req);

    logger.info("이건 일반 메세지");
    logger.warn("이건 경고 메세지");
    logger.error("이건 오류 메세지");

    logger.info("GET 요청:",req.query);

    res.send(`hello world`);
});

app.get("/test_1", (req, res) => {
    const logger = new ExpressLogger(req);
    logger.info("이건 일반 메세지");
    res.send(`hello world: ${req.baseUrl}`);
});

app.post("/route/endpoint_1", (req, res) => {
    const logger = new ExpressLogger(req);
    logger.info("이건 일반 메세지");
    res.send(`hello world: ${req.baseUrl}`);
});

app.post("/test_2", (req, res) => {
    const logger = new ExpressLogger(req);
    logger.info("이건 일반 메세지");
    res.send(`hello world: ${req.baseUrl}`);
});

app.listen(1234, () => {
    Logger.info("서버가 시작되었습니다.");
    console.log("안뇽 세상아?");
});