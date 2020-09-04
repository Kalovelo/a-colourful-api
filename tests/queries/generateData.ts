import { graphqlRequestUpload } from "../graphqlRequestUpload";
import supertest, { SuperTest, Test } from "supertest";
import keyword from "../../src/models/Keyword";
import RootQuerySchema from "../../src/schema/Root";
import { graphql } from "graphql";

export const generateKeyword = async (request: SuperTest<Test>) => {
  const query = /* GraphQL */ `
    mutation($svg: Upload!) {
      addKeyword(name: "testKeyword", svg: $svg) {
        id
        name
        svg
      }
    }
  `;

  return await graphqlRequestUpload(query, request, {
    svg: "tests/files/sample.svg",
  });
};

export const generateTopic = async (request: SuperTest<Test>) => {
  const keywordRes = await generateKeyword(request);
  const keywordID = keywordRes.body.data.addKeyword.id;
  const query = /* GraphQL */ `
    mutation($keywords: [ID]!) {
      addTopic(name: "testTopic", description: "testTopicDescription", keywords: $keywords) {
        name
        id
        description
        keywords {
          name
        }
      }
    }
  `;
  return await graphql(RootQuerySchema, query, null, null, {
    keywords: [keywordID],
  });
};
