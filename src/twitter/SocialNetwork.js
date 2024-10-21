class SocialNetwork {
    static guessFollowsGraph(posts) {
        const followMap = new Map();

        posts.forEach(({ author, text }) => {
            const taggedUsers = text.match(/@(\w+)/g); // Find all mentions

            if (taggedUsers) {
                const mentionedUsers = new Set(taggedUsers.map(tag => tag.slice(1).toLowerCase())); // Extract mentioned users and convert to lowercase

                if (!followMap.has(author.toLowerCase())) {
                    followMap.set(author.toLowerCase(), new Set());
                }

                // Add all mentioned users to the following set
                const authorFollowSet = followMap.get(author.toLowerCase());
                mentionedUsers.forEach(user => authorFollowSet.add(user));
            }
        });

        return followMap;
    }

    static influencers(followMap) {
        const followerCounts = new Map();

        // Count followers for each user
        followMap.forEach((followingSet, user) => {
            followingSet.forEach(followedUser => {
                if (!followerCounts.has(followedUser)) {
                    followerCounts.set(followedUser, 0);
                }
                followerCounts.set(followedUser, followerCounts.get(followedUser) + 1);
            });
        });

        const sortedUsers = [...followerCounts.entries()]
            .sort(([, countA], [, countB]) => countB - countA)
            .map(([user]) => user); // Return the user names

        return sortedUsers;
    }
}

module.exports = SocialNetwork;
