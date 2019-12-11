const db = require("./db.json");

module.exports = () => {
  let queries = 1;
  const query = fn => args => {
    console.log(`query: ${queries++}`);
    return fn(args);
  };

  return {
    /**
     * find one story.
     */
    story: query(url => db.stories.find(story => story.url === url)),
    /**
     * find many stories.
     */
    stories: query(urls => {
      const stories = db.stories.filter(story => urls.includes(story.url));
      return urls.map(url => stories.find(story => story.url === url));
    }),
    /**
     * find one user.
     */
    user: query(id => db.users.find(user => user.id === id)),
    /**
     * find many users.
     */
    users: query(ids => {
      const users = db.users.filter(user => ids.includes(user.id));
      return ids.map(id => users.find(user => user.id === id));
    }),
    /**
     * find comments for a story.
     */
    storyComments: query(storyID =>
      db.comments.filter(
        comment => comment.storyID === storyID && !comment.parentID
      )
    ),
    /**
     * find comments for many stories.
     */
    storiesComments: query(storyIDs => {
      const comments = db.comments.filter(
        comment => comment.storyID === storyID && !comment.parentID
      );
      return storyIDs.map(storyID =>
        comments.filter(comment => comment.storyID === storyID)
      );
    }),
    /**
     * find replies for a comment.
     */
    commentReplies: query(parentID =>
      db.comments.filter(comment => comment.parentID === parentID)
    ),
    /**
     * find replies for many comments.
     */
    commentsReplies: query(parentIDs => {
      const comments = db.comments.filter(
        comment => comment.parentID === parentID
      );
      return parentIDs.map(parentID =>
        comments.filter(comment => comment.parentID === parentID)
      );
    })
  };
};
