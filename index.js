const { ApolloServer, gql } = require("apollo-server");

const db = require("./db");

// The GraphQL schema
const typeDefs = gql`
  type User {
    username: String
  }

  type Comment {
    author: User
    body: String
    replies: [Comment]
    createdAt: String
  }

  type Story {
    comments: [Comment]
  }

  type Query {
    story(url: String): Story
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  Comment: {
    author: ({ authorID }, _, ctx) => ctx.loaders.user(authorID),
    replies: ({ id }, _, ctx) => ctx.loaders.commentReplies(id)
  },
  Story: {
    comments: ({ id }, _, ctx) => ctx.loaders.storyComments(id)
  },
  Query: {
    story: (_, { url }, ctx) => ctx.loaders.story(url)
  }
};

// Setup the Apollo Server.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => {
    return {
      loaders: db()
    };
  }
});

server.listen().then(({ url }) => {
  console.log(`GraphQL Server ready at ${url}`);
});
