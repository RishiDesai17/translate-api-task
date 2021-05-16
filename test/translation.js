const chai = require("chai");
const chaiHttp = require("chai-http");

chai.should();
const assert = chai.assert;

process.env.PORT = 3002;
const server = require("../server");

chai.use(chaiHttp);

describe("Translations", () => {
    describe("/POST", () => {
        it("should return 400 status one of the required fields is missing", (done) => {
            const body = {
                sourceLang: "en",
                targetLang: "fr",
            };
            chai.request(server)
                .post("/api/translate")
                .send(body)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a("object");
                    res.body.should.have.property("statusText");
                    res.body.should.have.property("message");
                    assert.equal(res.body.message, "Input fields incomplete");
                    done();
                });
        });

        it("should return 400 status since one of the language codes is invalid", (done) => {
            const body = {
                text: "dog",
                sourceLang: "abcd",
                targetLang: "fr",
            };
            chai.request(server)
                .post("/api/translate")
                .send(body)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a("object");
                    res.body.should.have.property("statusText");
                    res.body.should.have.property("message");
                    assert.equal(res.body.message, "Invalid language code");
                    done();
                });
        });

        // Below are some valid test cases which should return 200 status code
        it("should return 200 status and expected translation", (done) => {
            const body = {
                text: "dog",
                sourceLang: "en",
                targetLang: "fr",
            };
            chai.request(server)
                .post("/api/translate")
                .send(body)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("text");
                    res.body.should.have.property("to");
                    assert.deepEqual(res.body, {
                        text: "chien",
                        to: "fr",
                    });
                    done();
                });
        });

        it("should return 200 status and expected translation", (done) => {
            const body = {
                text: "टोपी",
                sourceLang: "hi",
                targetLang: "en",
            };
            chai.request(server)
                .post("/api/translate")
                .send(body)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("text");
                    res.body.should.have.property("to");
                    assert.deepEqual(res.body, {
                        text: "cap",
                        to: "en",
                    });
                    done();
                });
        });

        it("should return 200 status and expected translation", (done) => {
            const body = {
                text: "chat",
                sourceLang: "fr",
                targetLang: "hi",
            };
            chai.request(server)
                .post("/api/translate")
                .send(body)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("text");
                    res.body.should.have.property("to");
                    assert.deepEqual(res.body, {
                        text: "बिल्ली",
                        to: "hi",
                    });
                    done();
                });
        });
    });
});
