import { CookieJar } from "cookiejar";
import supertest from "supertest";
import Keyword from "../../src/components/Keyword/model/Keyword";
import { clearDatabase, closeDatabase, connectDatabase } from "../dbhandler";
import { emptyUploadFolders } from "../fileHandler";
import { graphqlRequestUpload } from "../graphqlRequestUpload";
import { generateKeyword, generateSession } from "./generateData";
const app = require("../../src/app");
const request = supertest.agent(app);

/**
 * Connect to a new in -memory database before running any tests.
 **/
beforeAll(async () => {
  await connectDatabase();
});

/**
 * Create Admin Session
 */
beforeEach(async () => {
  await generateSession(request, true);
});

/**
 * Clear all test data after every test.
 */
afterEach(async () => await clearDatabase());

/**
 * Remove and close the db and server.
 */
afterAll(async () => {
  await closeDatabase();
  await emptyUploadFolders();
});

describe("Keyword Model Test", () => {
  it("CREATE - should create & save keyword successfully", async () => {
    const res = await generateKeyword(request);
    const savedKeyword = res.body.data.addKeyword;
    expect(savedKeyword.id).toBeDefined();
    expect(savedKeyword.name).toBe("testKeyword");
    expect(savedKeyword.svg).toBeDefined();
  });

  it("CREATE - should fail create & save keyword without being logged in", async () => {
    request.jar = new CookieJar();
    const res = await generateKeyword(request);
    const savedKeyword = res.body.data.addKeyword;
    expect(res.body.errors[0].status).toBe(401);
    expect(savedKeyword).toBeNull();
  });

  it("CREATE - should fail create & save keyword without being an admin", async () => {
    await generateSession(request);
    const res = await generateKeyword(request);
    const savedKeyword = res.body.data.addKeyword;
    expect(res.body.errors[0].status).toBe(401);
    expect(savedKeyword).toBeNull();
  });

  it("CREATE - should fail create keyword unknown field", async () => {
    const query = /* GraphQL */ `
      mutation($svg: Upload!) {
        addKeyword(name: "testKeyword", svg: $svg, random: "random") {
          id
          name
          svg
        }
      }
    `;

    const res = await graphqlRequestUpload(query, request, {
      svg: "tests/files/sample.svg",
    });
    const keyword = res.body;
    expect(res.status).toBe(400);
    expect(keyword.name).toBeUndefined();
  });

  it("CREATE - should fail create keyword without required field", async () => {
    const query = /* GraphQL */ `
      mutation {
        addKeyword(name: "testKeyword") {
          id
        }
      }
    `;
    const res = await graphqlRequestUpload(query, request);
    const keyword = res.body;
    expect(res.status).toBe(400);
    expect(keyword.name).toBeUndefined();
  });

  it("GET - should all the keywords", async () => {
    await generateKeyword(request);
    await generateKeyword(request);

    const query = /* GraphQL */ `
      {
        keywords {
          id
          name
          svg
        }
      }
    `;

    const res = await request
      .post("/graphql")
      .send({
        query,
      })
      .set("Accept", "application/json");
    expect(res.body.data!.keywords.length).toBe(2);
  });

  it("GET - should get keyword with specific ID", async () => {
    const res = await generateKeyword(request);
    const savedKeywordID = res.body.data.addKeyword.id;
    const query = /* GraphQL */ `
      query {
        keyword(id: "${savedKeywordID}") {
          id
          name
          svg
        }
      }
    `;

    const getRes = await request.post("/graphql").send({
      query,
    });
    expect(getRes.body.data!.keyword.id).toBe(savedKeywordID);
  });

  it("UPDATE - should update & save keyword successfully", async () => {
    const res = await generateKeyword(request);
    const savedKeywordID = res.body.data.addKeyword.id;
    const query = /* GraphQL */ `
      mutation {
        updateKeyword(id: "${savedKeywordID}", name: "amazing") {
          name
          id
          svg
        }
      }
    `;

    const updateRes = await request.post("/graphql").send({
      query,
    });
    expect(updateRes.body.data.updateKeyword.name).toBe("amazing");
  });

  it("UPDATE - should fail update & save keyword without being logged in", async () => {
    const res = await generateKeyword(request);
    const savedKeywordID = res.body.data.addKeyword.id;
    const query = /* GraphQL */ `
      mutation {
        updateKeyword(id: "${savedKeywordID}", name: "amazing") {
          name
          id
          svg
        }
      }
    `;
    request.jar = new CookieJar();

    const updateRes = await request.post("/graphql").send({
      query,
    });
    expect(updateRes.body.errors[0].status).toBe(401);
    expect(updateRes.body.data.updateKeyword).toBeNull();
  });

  it("UPDATE - should fail update & save keyword without being an admin", async () => {
    const res = await generateKeyword(request);
    const savedKeywordID = res.body.data.addKeyword.id;
    const query = /* GraphQL */ `
      mutation {
        updateKeyword(id: "${savedKeywordID}", name: "amazing") {
          name
          id
          svg
        }
      }
    `;

    await generateSession(request);

    const updateRes = await request.post("/graphql").send({
      query,
    });
    expect(updateRes.body.errors[0].status).toBe(401);
    expect(updateRes.body.data.updateKeyword).toBeNull();
  });

  it("DELETE - should delete keyword successfully", async () => {
    const res = await generateKeyword(request);
    const savedKeywordID = res.body.data.addKeyword.id;
    const query = /* GraphQL */ `
      mutation {
        deleteKeyword(id: "${savedKeywordID}") {
          name
          id
          svg
        }
      }
    `;

    await request.post("/graphql").send({
      query,
    });

    const keyword = Keyword.findById(savedKeywordID);
    expect(keyword).toBeUndefined;
  });

  it("DELETE - should fail to delete keyword without being logged in", async () => {
    const res = await generateKeyword(request);
    const savedKeywordID = res.body.data.addKeyword.id;
    const query = /* GraphQL */ `
      mutation {
        deleteKeyword(id: "${savedKeywordID}") {
          name
          id
          svg
        }
      }
    `;

    request.jar = new CookieJar();

    const deleteRes = await request.post("/graphql").send({
      query,
    });

    const keyword = Keyword.findById(savedKeywordID);
    expect(deleteRes.body.errors[0].status).toBe(401);
    expect(keyword).toBeDefined;
  });

  it("DELETE - should fail to delete keyword without being logged in", async () => {
    const res = await generateKeyword(request);
    const savedKeywordID = res.body.data.addKeyword.id;
    const query = /* GraphQL */ `
      mutation {
        deleteKeyword(id: "${savedKeywordID}") {
          name
          id
          svg
        }
      }
    `;

    await generateSession(request);

    const deleteRes = await request.post("/graphql").send({
      query,
    });

    const keyword = Keyword.findById(savedKeywordID);
    expect(deleteRes.body.errors[0].status).toBe(401);
    expect(keyword).toBeDefined;
  });
});
