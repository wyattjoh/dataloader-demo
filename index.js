const { ApolloServer, gql } = require("apollo-server");
const DataLoader = require("dataloader");

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
    const loaders = db();

    const stories = new DataLoader(loaders.stories);
    const users = new DataLoader(loaders.users);
    const storyComments = new DataLoader(loaders.storiesComments);
    const commentReplies = new DataLoader(loaders.commentsReplies);

    console.log("\nstarting request");

    return {
      loaders: {
        story: url => stories.load(url),
        user: id => users.load(id),
        storyComments: storyID => storyComments.load(storyID),
        commentReplies: parentID => commentReplies.load(parentID)
      }
    };
  }
});

server.listen().then(({ url }) => {
  console.log(`GraphQL Server ready at ${url}`);
});
