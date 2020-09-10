import { graphqlRequestUpload } from "../graphqlRequestUpload";
import supertest, { SuperTest, Test } from "supertest";
import keyword from "../../src/models/Keyword";
import RootQuerySchema from "../../src/schema/Root";
import { graphql } from "graphql";
import Topic from "../../src/models/Topic";

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
          id
        }
      }
    }
  `;
  return await graphql(RootQuerySchema, query, null, null, {
    keywords: [keywordID],
  });
};

export const generateEvent = async (request: SuperTest<Test>) => {
  const TopicRes = await generateTopic(request);
  const tid = TopicRes.data!.addTopic.id;

  const query = /* GraphQL */ `
    mutation($primaryImage: Upload, $images: [Upload], $poster: Upload) {
      addEvent(
        name: "testEvent"
        topic: "${tid}"
        poster: $poster
        date: "10/10/2010"
        images: $images
        primaryImage: $primaryImage
        eventType: TALK
        description: "testEvent Description"
        summary: "testEvent Summary"
        level: "Beginner"
        place: "SKG"
        cheatsheet: {
          commandBlocks: {
            name: "lalala"
            commands: { name: "command 1", description: "description" }
          }
          stages: [{ name: "stageName", description: "stageDesc" }]
        }
        codeSnippets: [{ commands: ["sudo pkill myself"] }]
        arrayLink: [{ name: "arrayLink", links: [{ name: "link1", link: "url" }] }]
        fileArray: { name: "fileArray", links: [{ name: "fileLink1", link: "fileURL" }] }
      ) {
        id
        name
      }
    }
  `;

  return await graphqlRequestUpload(query, request, {
    topicID: tid,
    poster: "tests/files/sample.svg",
    primaryImage: "tests/files/sample.svg",
    images: ["tests/files/sample.svg", "tests/files/sample.svg"],
  });
};
