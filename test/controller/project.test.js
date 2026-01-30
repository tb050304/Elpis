const assert = require("assert");
const supertest = require("supertest");
const md5 = require("md5");
const eplisCore = require("../../elpis-core");

const signKey = "dafahhjdioshiahdnadhiahjojsjdijisa4830";
const st = Date.now();

describe("测试 project 相关接口", function () {
  this.timeout(60000);

  let request;

  it("启动服务", async () => {
    const app = await eplisCore.start();
    request = supertest(app.listen());
  });

  it("GET /api/project/model_list", async () => {
    let tmpRequest = request.get("/api/project/model_list");
    tmpRequest = tmpRequest.set("s_st", st);
    tmpRequest = tmpRequest.set("s_sign", md5(`${signKey}_${st}`));
    const res = await tmpRequest;
    assert(res.body.success === true);
    const resData = res.body.data;
    assert(resData.length > 0);

    for (let i = 0; i < resData.length; i++) {
      const item = resData[i];
      assert(item.model);
      assert(item.model.key);
      assert(item.model.name);
      assert(item.project);
      for (const projKey in item.project) {
        assert(item.project[projKey].key);
        assert(item.project[projKey].name);
      }
    }
  });
});
