const Users = require('../modals/user.modal');
const jwt = require('jsonwebtoken');
const { default: mongoose } = require('mongoose');

const sortingFn = (a, b) => {
    if (a.tweets && b.tweets) {
        const aDate = new Date(a.tweets[0].createdAt);
        const bDate = new Date(b.tweets[0].createdAt);
        return aDate.getTime() - bDate.getTime();
    }
    else if (a.tweets && !b.tweets) {
        const aDate = new Date(a.tweets[0].createdAt);
        const bDate = new Date(b.createdAt);
        return aDate.getTime() - bDate.getTime();
    }
    else if (!a.tweets && b.tweets) {
        const aDate = new Date(a.createdAt);
        const bDate = new Date(b.tweets[0].createdAt);
        return aDate.getTime() - bDate.getTime();
    }
    else {
        const aDate = new Date(a.createdAt);
        const bDate = new Date(b.createdAt);

        return aDate.getTime() - bDate.getTime();
    }

}

class UserService {
    async getLikedTweets(accountHandle) {
        try {
            const result = await Users.findOne({ accountHandle: accountHandle });
            // console.log(result);
            return result.likedTweets;
        } catch (error) {
            console.log('error',error)
            throw error;
        }
    }
    async getTweetsOfAttachment(accountHandle) {
        try {
            const user = await Users.findOne({ accountHandle: accountHandle });
            const result = [];
      
            for (let i = 0; i < user.tweets.length; i++) {
            
                if (Array.isArray(user.tweets[i])) {
                    for (let j = 0; j < user.tweets[i].length; j++) {
                        if (user.tweets[i][j].attachments.length) {
                            result.push(user.tweets[i][j]);
                        }
                    }
                }
                else {
                    if (user.tweets[i].attachments.length) {
                        result.push(user.tweets[i]);
                    }
                }
            }
  
            return {
                accountName : user.accountName,
                accountHandle : user.accountHandle,
                profileSrc : user.profileSrc,
                verified : user.verified,
                tweets : result
            }
        } catch (error) {
            console.log('error bc error',error);
            throw error;
        }
    }
    async getOtherStories(email) {
        try {
            const allUsers = await Users.find({ email: { $ne: email } });
            const result = [];
            for (let i = 0; i < allUsers.length; i++) {
                result.push(
                    {
                        profileSrc: allUsers[i].profileSrc,
                        accountName: allUsers[i].accountName,
                        accountHandle: allUsers[i].accountHandle,
                        storyItems: allUsers[i].stories
                    }
                )
            }
            // //console.log(result, '---------------------');
            return result;
        } catch (err) {
            throw err;
        }
    }
    async getStoryByEmail(email) {
        try {
            const user = await Users.findOne({ email: email });
            return {
                profileSrc: user.profileSrc,
                accountName: user.accountName,
                accountHandle: user.accountHandle,
                storyItems: user.stories
            }
        }
        catch (error) {
            throw error;
        }
    }
    async getAllReels() {
        try {
            const allUsers = await Users.find({});
            const reelsArr = [];

            for (let i = 0; i < allUsers.length; i++) {
                const { accountName, accountHandle, verified, profileSrc } = allUsers[i];
                if (allUsers[i].reels && allUsers[i].reels.length) {
                    for (let j = 0; j < allUsers[i].reels.length; j++) {
                        reelsArr.push({
                            accountName: accountName,
                            accountHandle: accountHandle,
                            verified: verified,
                            profileSrc: profileSrc,
                            reel: allUsers[i].reels[j]
                        })
                    }
                }
            }

            return reelsArr;
        } catch (error) {
            throw error;
        }
    }
    async getTweetById(globalEmail, accountHandlee, tweetId) {
        try {
            const user = await Users.findOne({ accountHandle: accountHandlee });
            const tweets = user.tweets;
            const email = user.email;
            let activeIndex;
            const accountName = user.accountName;
            const accountHandle = user.accountHandle;
            const profileSrc = user.profileSrc;
            const verified = user.profileSrc;
            const typeOfVerification = user.typeOfVerification;
            const userDetailsObj = {
                accountHandle: accountHandle,
                accountName: accountName,
                profileSrc: profileSrc,
                verified: verified,
                typeOfVerification: typeOfVerification
            }
            for (let i = 0; i < tweets.length; i++) {
                let found = false;
                if (Array.isArray(tweets[i])) {
                    for (let j = 0; j < tweets[i].length; j++) {
                        let pollChoice;
                        if (tweets[i][j].poll.options && tweets[i][j].options.length) {
                            for (let k = 0; k < tweets[i][j].poll.votes.length; k++) {
                                if (tweets[i][j].poll.votes[k].email === globalEmail || (tweets[i][j].poll.votes[k].email === email && email === globalEmail)) {
                                    pollChoice = tweets[i][j].poll.votes[k].pollChoice;
                                    break;
                                }
                            }
                        }
                        if (tweets[i][j] && tweets[i][j].retweetedBy && tweets[i][j].retweetedBy.length) {
                            for (let p = 0; p < tweets[i][j].retweetedBy.length; p++) {
                                // //console.log(tweets[i][j].retweetedBy[p])
                                if (tweets[i][j].retweetedBy[p][1] === globalEmail
                                    && tweets[i][j].retweetedBy[p][0] === tweets[i][j]._id.toString()
                                ) {
                                    tweets[i][j].retweetedAlready = true;
                                    break;
                                }
                            }
                        }
                        if (tweets[i][j] && tweets[i][j].likedBy && tweets[i][j].likedBy.length) {
                            for (let z = 0; z < tweets[i][j].likedBy.length; z++) {
                                if (tweets[i][j].likedBy[z] === globalEmail) {
                                    tweets[i][j].alreadyLiked = true;
                                    break;
                                }
                            }
                        }
                        if ((tweets[i][j]._id.toString()) === tweetId) {
                            found = true;
                            activeIndex = j;
                        }

                    }
                }
                else {
                    if ((tweets[i]._id.toString()) === tweetId) {
                        // //console.log(tweets[i]);
                        let pollChoice;
                        if (tweets[i].poll.options && tweets[i].poll.options.length) {
                            for (let k = 0; k < tweets[i][j].poll.votes.length; k++) {
                                if (tweets[i].poll.votes[k].email === globalEmail || (tweets[i].poll.votes[k].email === email && email === globalEmail)) {
                                    pollChoice = tweets[i].poll.votes[k].pollChoice;
                                    break;
                                }
                            }
                        }
                        if (tweets[i] && tweets[i].retweetedBy && tweets[i].retweetedBy.length) {
                            for (let p = 0; p < tweets[i].retweetedBy.length; p++) {
                                // //console.log(tweets[i].retweetedBy[p])
                                if (tweets[i].retweetedBy[p][1] === globalEmail
                                    && tweets[i].retweetedBy[p][0] === tweets[i]._id.toString()
                                ) {
                                    tweets[i].retweetedAlready = true;
                                    break;
                                }
                            }
                        }
                        if (tweets[i] && tweets[i].likedBy && tweets[i].likedBy.length) {
                            for (let z = 0; z < tweets[i].likedBy.length; z++) {
                                if (tweets[i].likedBy[z] === globalEmail) {
                                    tweets[i].alreadyLiked = true;
                                    break;
                                }
                            }
                        }
                        return {
                            ...userDetailsObj,
                            tweets: tweets[i],
                            createdAt: tweets[i].createdAt,
                        }
                    }
                }
                if (found) {
                    return {
                        ...userDetailsObj,
                        tweets: tweets[i],
                        activeIndex: activeIndex
                    }
                }
            }
        } catch (error) {
            //console.log('error', error);
            throw error;
        }
    }
    async bookmarkExists(email, id) {
        try {
            const user = await Users.findOne({ email: email });
            const bookmarks = user.bookmarks;
            for (let i = 0; i < bookmarks.length; i++) {
                if ((bookmarks[i].id).toString() === id) {
                    return true;
                }
            }
            return false;
        } catch (error) {

        }
    }
    async addReply(accountHandle, id, payload) {
        try {
            // //console.log(accountHandle, id, '**********************');
            const user = await Users.findOne({ accountHandle: accountHandle });
            const userTweets = user.tweets;

            for (let i = 0; i < userTweets.length; i++) {
                if (Array.isArray(userTweets[i])) {
                    for (let j = 0; j < userTweets[i].length; j++) {
                        // //console.log(j);
                        if (userTweets[i][j]._id.toString() === id) {
                            if (!userTweets[i][j].replies) {
                                userTweets[i][j].replies = [payload];
                                userTweets[i][j].replyCount = userTweets[i][j].replies.length;
                            }
                            else {
                                userTweets[i][j].replies.push(payload);
                                userTweets[i][j].replyCount = userTweets[i][j].replies.length;
                            }
                        }
                    }
                }
                else {
                    if ((userTweets[i]._id).toString() === id) {
                        if (!userTweets[i].replies) {
                            userTweets[i].replies = [payload];
                            userTweets[i].replyCount = userTweets[i].replies.length;
                        }
                        else {
                            userTweets[i].replies.push(payload);
                            userTweets[i].replyCount = userTweets[i].replies.length;
                        }
                    }
                }
            }
            // //console.log(userTweets)
            await Users.updateOne({ accountHandle: accountHandle }, user);

        } catch (error) {
            throw error;
        }
    }
    async toggleRetweet(email, accountHandle, id) {
        try {
            let result;
            const user = await Users.findOne({ accountHandle: accountHandle });
            const userTweets = user.tweets;
            for (let i = 0; i < userTweets.length; i++) {
                const arrayType = Array.isArray(userTweets[i]);
                if (arrayType) {

                    for (let j = 0; j < userTweets[i].length; j++) {
                        if (!userTweets[i][j].retweets) {
                            userTweets[i][j].retweets = 0;
                        }
                        if (id === (userTweets[i][j]._id).toString()) {
                            if (userTweets[i][j].retweetedBy && userTweets[i][j].retweetedBy.length) {
                                let found = false;
                                const retweetedByArr = userTweets[i][j].retweetedBy;
                                const filteredArr = [];
                                for (let k = 0; k < retweetedByArr.length; k++) {
                                    if (retweetedByArr[k][1] !== email) filteredArr.push(retweetedByArr[i]);
                                    else {
                                        found = true;
                                        break;
                                    }
                                }
                                if (found) {
                                    userTweets[i][j].retweetedBy = filteredArr
                                    result = 'removed';
                                }
                                else {
                                    userTweets[i][j].retweetedBy.push([id, email]);
                                    result = 'added';
                                };
                                userTweets[i][j].retweets = userTweets[i][j].retweetedBy.length;
                            }
                            else {
                                userTweets[i][j].retweetedBy = [[id, email]];
                                userTweets[i][j].retweets = 0;
                                result = 'added';
                            }
                        }
                    }
                }
                else {
                    if (id === (userTweets[i]._id).toString()) {
                        if (userTweets[i].retweetedBy && userTweets[i].retweetedBy.length) {
                            let found = false;
                            const filteredArr = [];
                            for (let k = 0; k < userTweets[i].retweetedBy.length; k++) {
                                if (userTweets[i].retweetedBy[k][1] !== email) filteredArr.push(userTweets[i].retweetedBy[k]);
                                else {
                                    found = true;
                                    break;
                                }
                            }
                            if (found) {
                                userTweets[i].retweetedBy = filteredArr;
                                result = 'removed';
                            }
                            else {
                                userTweets[i].retweetedBy.push([id, email]);
                                result = 'added';
                            }
                            userTweets[i].retweets = userTweets[i].retweetedBy.length;
                        }
                        else {
                            userTweets[i].retweetedBy = [[id, email]];
                            userTweets[i].retweets = 0;
                            result = 'added';
                        }
                    }

                }
                await Users.updateOne({ accountHandle: accountHandle }, user)

            }
            return result;
        } catch (error) {
            //console.log('error', error);
        }
    }
    async getBookmarks(email) {
        try {
            const result = await Users.findOne({ email: email });
            // //console.log(result);
            return result.bookmarks ? result.bookmarks : [];
        } catch (error) {
            throw error;
        }
    }
    async postBookmarks(email, tweet) {

        try {
            // const alrea  
            const result = await Users.updateOne({ email: email }, {
                $push: { "bookmarks": tweet }
            })
            return result
        } catch (error) {
            throw error;
        }
    }
    async generateWhoToFollow(email) {
        try {
            const result = [];
            let currentUser = await Users.find({ email: email });
            currentUser = currentUser[0];

            // //console.log(currentUser,"***********************");
            const set = new Set();



            for (let i = 0; i < currentUser.following.length; i++) {
                if (!set.has(currentUser.following[i].accountHandle)) set.add(currentUser.following[i].accountHandle, 1);
            }

            const allOtherUsers = await Users.find({ email: { $ne: email } });
            for (let i = 0; i < allOtherUsers.length; i++) {
                if (!set.has(allOtherUsers[i].accountHandle)) {
                    result.push({
                        accountName: allOtherUsers[i].accountName,
                        accountHandle: allOtherUsers[i].accountHandle,
                        profileSrc: allOtherUsers[i].profileSrc,
                        erified: allOtherUsers[i].verified,
                        typeOfVerification: allOtherUsers[i].typeOfVerification
                    })
                }

            }

            // const currentUserFollowing = currentUser[0].following;
            // const randomFollowingUsers = [];
            // // //console.log(randomFollowingUsers)
            // if (!currentUserFollowing.length) {
            //     return [];
            // }
            // for (let i = 0; i < 2; i++) {
            //     let random = currentUserFollowing[Math.floor(Math.random() * currentUserFollowing.length)];
            //     let found = false;
            //     for (let i = 0; i < randomFollowingUsers.length; i++) {
            //         if (randomFollowingUsers[i].accountHandle === random.accountHandle) {
            //             found = true;
            //             break;
            //         }
            //     }
            //     // if(!found){
            //     randomFollowingUsers.push({ accountName: random.accountName, accountHandle: random.accountHandle, profileSrc: random.profileSrc, verified: random.verified, typeOfVerification: random.typeOfVerification });
            //     // }

            // }
            // // //console.log(`_________________________________________________`);
            // // //console.log(randomFollowingUsers)
            // for (let i = 0; i < randomFollowingUsers.length; i++) {
            //     const result2 = await Users.find({ accountHandle: randomFollowingUsers[i].accountHandle });
            //     const result2Following = result2[0].following;
            //     const oneRandomFromResult2Following = result2Following[Math.floor(Math.random() * result2Following.length)];
            //     result.push(oneRandomFromResult2Following)
            // }
            //console.log(result);

            return result;
        } catch (error) {
            //console.log('error', error);
            throw error;
        }
    }
    async removeLike(email, twitterWriter, id) {
        try {
            const writer = await Users.findOne({ accountHandle: twitterWriter });
            const user = await Users.findOne({ email: email });
            const userLikedTweets = user.likedTweets;
            const tweetsOfWriter = writer.tweets;

            for (let i = 0; i < tweetsOfWriter.length; i++) {
                let currElement = tweetsOfWriter[i];
                if (Array.isArray(currElement)) {
                    for (let j = 0; j < currElement.length; j++) {
                        const currThread = currElement[j];
                        if (id === (currThread._id).toString()) {
                            if (currThread.likes !== null) {
                                if (isNaN(currThread.likes)) currThread.likes = 0;
                                else currThread.likes -= 1;
                            }
                            else {
                                currThread.likes = 0;
                            }
                            const likedByArr = currThread.likedBy;
                            const newLikedByArr = [];
                            for (let z = 0; z < likedByArr.length; z++) {
                                if (likedByArr[z] !== email) {
                                    newLikedByArr.push(likedByArr[z]);
                                }
                            }
                            const filteredLikedTweets = [];
                            for (let x = 0; x < userLikedTweets.length; x++) {
                                if (userLikedTweets[x].tweets._id.toString() !== id) {
                                    filteredLikedTweets.push(userLikedTweets[x]);
                                }
                            }
                            currThread.likedBy = newLikedByArr;
                            user.likedTweets = filteredLikedTweets;
                        }
                    }
                }
                else {
                    if (id === (currElement._id).toString()) {
                        if (currElement.likes !== null) {
                            if (isNaN(currElement.likes)) currElement.likes = 0;
                            else currElement.likes -= 1;
                        }
                        else {
                            currElement.likes = 0;
                        }
                        const likedByArr = currElement.likedBy;
                        const newLikedByArr = [];
                        for (let z = 0; z < likedByArr.length; z++) {
                            if (likedByArr[z] !== email) {
                                newLikedByArr.push(likedByArr[z]);
                            }
                        }

                        const filteredLikedTweets = [];
                        for (let x = 0; x < userLikedTweets.length; x++) {
                            if (userLikedTweets[x].tweets._id.toString() !== id) {
                                filteredLikedTweets.push(userLikedTweets[x]);
                            }
                        }
                        user.likedTweets = filteredLikedTweets;
                        currElement.likedBy = newLikedByArr;
                    }

                }
            }
            await Users.updateOne({ email: email }, user);
            await Users.updateOne({ accountHandle: twitterWriter }, writer);
            return true;
        } catch (error) {
            throw error;
        }
    }
    async addLike(email, twitterWriter, id) {
        try {
            let obj;
            const writer = await Users.findOne({ accountHandle: twitterWriter });
            const tweetsOfWriter = writer.tweets;
            for (let i = 0; i < tweetsOfWriter.length; i++) {
                let currElement = tweetsOfWriter[i];
                if (Array.isArray(currElement)) {
                    for (let j = 0; j < currElement.length; j++) {
                        const currThread = currElement[j];
                        if (id === (currThread._id.toString())) {
                            obj = currThread;
                            if (currThread.likes !== null) {
                                if (isNaN(currThread.likes)) currThread.likes = 1;
                                else currThread.likes += 1;
                            }
                            else {
                                currThread.likes = 0;
                            }
                            const hasLikedAlreadyArray = currThread.likedBy;
                            if (hasLikedAlreadyArray) {
                                currThread.likedBy.push(email);
                            }
                            else {
                                currThread.likedBy = [email];
                            }
                            break;
                        }

                    }
                }
                else {
                    if (id === currElement._id.toString()) {
                        obj = currElement;
                        if (currElement.likes !== null) {
                            if (isNaN(currElement.likes)) currElement.likes = 1;
                            else currElement.likes += 1;
                        }
                        else {
                            currElement.likes = 0;
                        }
                        const hasLikedAlreadyArray = currElement.likedAlready;
                        if (hasLikedAlreadyArray) {
                            currElement.likedBy.push(email);
                        }
                        else {
                            currElement.likedBy = [email];
                        }
                        break;
                    }

                }
            }
            if (email !== twitterWriter) {
                const globalUser = await Users.findOne({ email: email });
                globalUser.likedTweets.push({
                    accountName: writer.accountName,
                    accountHandle: writer.accountHandle,
                    verified: writer.verified,
                    profileSrc : writer.profileSrc,
                    tweets: obj
                })
                //console.log(globalUser, globalUser.likedTweets);
                await Users.updateOne({ email: email }, globalUser);
            }
            else {
                writer.likedTweets.push(obj);
            }

            await Users.updateOne({ accountHandle: twitterWriter }, writer);

            return true;
        } catch (error) {
            throw error;
        }
    }
    async alreadyLiked(email, tweetsWriter, id) {
        try {
            const tweetsUser = await Users.findOne({ accountHandle: tweetsWriter });
            for (let i = 0; i < tweetsUser.tweets.length; i++) {
                let currTweetOrThread = tweetsUser.tweets[i];
                if (Array.isArray(currTweetOrThread)) {

                    for (let j = 0; j < currTweetOrThread.length; j++) {
                        let currThreadTweet = currTweetOrThread[j];
                        if (id === (currThreadTweet._id).toString()) {
                            if (currThreadTweet.likedBy) {
                                for (let k = 0; k < currThreadTweet.likedBy.length; k++) {
                                    if (currThreadTweet.likedBy[k] === email) {
                                        return true;
                                    }
                                }
                            }
                        }

                    }
                }
                else {
                    if (id === (currTweetOrThread._id).toString()) {
                        if (currTweetOrThread.likedBy) {
                            for (let k = 0; k < currTweetOrThread.likedBy.length; k++) {
                                if (currTweetOrThread.likedBy[k] === email) {
                                    return true;
                                }
                            }
                        }
                    }

                }
            }
            return false;
        } catch (error) {
            throw error;
        }
    }
    async makePollChoice(email, pollChoice, accountHandle, id) {
        try {
            const result2 = await Users.findOne({ accountHandle: accountHandle });
            for (let i = 0; i < result2.tweets.length; i++) {
                if (Array.isArray(result2.tweets[i])) {
                    for (let j = 0; j < result2.tweets[i].length; j++) {
                        if (id === (result2.tweets[i][j]._id).toString()) {
                            result2.tweets[i][j].poll.options[pollChoice][1] += 1;
                            if (!result2.tweets[i][j].poll.votes) {
                                result2.tweets[i][j].poll.votes = [{ email: email, pollChoice: pollChoice }];
                            }
                            else {
                                result2.tweets[i][j].poll.votes.push({ email: email, pollChoice: pollChoice });
                            }
                            break;
                        }
                    }
                }
                else {
                    if (id === (result2.tweets[i]._id).toString()) {
                        result2.tweets[i].poll.options[pollChoice][1] += 1;
                        if (!result2.tweets[i].poll.votes) {
                            result2.tweets[i].poll.votes = [{ email: email, pollChoice: pollChoice }];
                        }
                        else {
                            result2.tweets[i].poll.votes.push({ email: email, pollChoice: pollChoice });
                        }
                        break;
                    }
                }
            }
            await Users.updateOne({ accountHandle: accountHandle }, result2);
            return true;
        } catch (error) {
            throw error;
        }
    }
    async getTimeline(globalEmail) {
        try {
            const tweetsArr = [];
            const users = await Users.find({});
            for (let i = 0; i < users.length; i++) {
                const email = users[i].email;
                const accountName = users[i].accountName;
                const accountHandle = users[i].accountHandle;
                const profileSrc = users[i].profileSrc;
                const verified = users[i].profileSrc;
                const typeOfVerification = users[i].typeOfVerification;
                const userDetailsObj = {
                    accountHandle: accountHandle,
                    accountName: accountName,
                    profileSrc: profileSrc,
                    verified: verified,
                    typeOfVerification: typeOfVerification
                }
                for (let j = 0; j < users[i].tweets.length; j++) {

                    if (Array.isArray(users[i].tweets[j])) {
                        let pollChoice;
                        for (let l = 0; l < users[i].tweets[j].length; l++) {
                            if (users[i].tweets[j][l] && users[i].tweets[j][l].poll && users[i].tweets[j][l].poll.options) {
                                if (users[i].tweets[j][l].poll.options.length && users[i].tweets[j][l].poll.votes) {
                                    for (let m = 0; m < users[i].tweets[j][l].poll.votes.length; m++) {

                                        if (users[i].tweets[j][l].poll.votes[m].email === globalEmail || (users[i].tweets[j][l].poll.votes[m].email === email && email === globalEmail)) {
                                            pollChoice = users[i].tweets[j][l].poll.votes[m].pollChoice;
                                            break;
                                        }
                                    }
                                }
                            }
                            if (users[i].tweets[j][l] && users[i].tweets[j][l].retweetedBy && users[i].tweets[j][l].retweetedBy.length) {
                                for (let p = 0; p < users[i].tweets[j][l].retweetedBy.length; p++) {
                                    //console.log(users[i].tweets[j][l].retweetedBy[p])
                                    if (users[i].tweets[j][l].retweetedBy[p][1] === globalEmail
                                        && users[i].tweets[j][l].retweetedBy[p][0] === users[i].tweets[j][l]._id.toString()
                                    ) {
                                        users[i].tweets[j][l].retweetedAlready = true;
                                        break;
                                    }
                                }
                            }
                            if (users[i].tweets[j][l] && users[i].tweets[j][l].likedBy && users[i].tweets[j][l].likedBy.length) {
                                for (let z = 0; z < users[i].tweets[j][l].likedBy.length; z++) {
                                    if (users[i].tweets[j][l].likedBy[z] === globalEmail) {
                                        users[i].tweets[j][l].alreadyLiked = true;
                                        break;
                                    }
                                }
                            }
                        }
                        tweetsArr.push(
                            {
                                ...userDetailsObj,
                                createdAt: users[i].tweets[0].createdAt,
                                tweets: users[i].tweets[j],
                                alreadyVoted: pollChoice || pollChoice === 0 ? pollChoice : null,
                            })
                    }
                    else {
                        let likedAlready;
                        let pollChoice;
                        if (users[i].tweets[j].poll.options.length) {
                            if (users[i].tweets[j].poll.votes) {

                                for (let k = 0; k < users[i].tweets[j].poll.votes.length; k++) {
                                    if (users[i].tweets[j].poll.votes[k].email === globalEmail || (users[i].tweets[j].poll.votes[k].email === email && email === globalEmail)) {
                                        pollChoice = users[i].tweets[j].poll.votes[k].pollChoice;
                                        break;
                                    }
                                }
                            }
                        }
                        if (users[i].tweets[j].likedBy && users[i].tweets[j].likedBy.length) {
                            for (let z = 0; z < users[i].tweets[j].likedBy.length; z++) {
                                if (users[i].tweets[j].likedBy[z] === globalEmail) {
                                    likedAlready = true;
                                    break;
                                }
                            }
                        }
                        if (users[i].tweets[j].retweetedBy && users[i].tweets[j].retweetedBy.length) {
                            for (let p = 0; p < users[i].tweets[j].retweetedBy.length; p++) {
                                if (users[i].tweets[j].retweetedBy[p][1] === globalEmail &&
                                    users[i].tweets[j].retweetedBy[p][0] === users[i].tweets[j]._id.toString()
                                ) {
                                    users[i].tweets[j].retweetedAlready = true;
                                    break;
                                }
                            }
                        }

                        tweetsArr.push({
                            ...userDetailsObj,
                            ...users[i].tweets[j],
                            alreadyVoted: pollChoice || pollChoice === 0 ? pollChoice : null,
                            alreadyLiked: likedAlready ? likedAlready : false,
                        });
                    }
                }

            }


            tweetsArr.sort((a, b) => sortingFn(b, a));
            return tweetsArr;
        } catch (error) {
            //console.log('error', error);
            throw error;
        }
    }
    async newImageStory(email, payload) {
        try {
            const obj = {
                imageSrc: payload.imgSrc,
                scaleLevel: payload.scaleValue,
                rotateLevel: payload.rotateValue
            }
            const result = await Users.updateOne({ email: email }, {
                $push: { stories: obj }
            })
            return result;
        } catch (error) {
            throw error;
        }
    }
    async newTextStory(email, payload) {
        try {
            const obj = {
                type: payload.type,
                text: payload.text,
                fontFamily: payload.fontFamily,
                textColor: payload.textColor,
                backgroundColor: payload.backgroundColor,
                backgroundImage: payload.backgroundImage

            }
            const result = await Users.updateOne({ email: email }, {
                $push: { stories: obj }
            })
            return result;
        } catch (error) {
            throw error;
        }
    }
    async newReel(email, payload) {
        try {
            const result = await Users.updateOne({ email: email }, {
                $push: { reels: payload }
            })
            return result;
        } catch (error) {
            throw error;
        }
    }
    async editProfile(email, accountName, accountBio, location, website, profileSrc, profileBanner) {
        try {
            const user = await Users.findOne({ email: email });
            user.accountName = accountName;
            user.bio = accountBio;
            user.location = location;
            user.website = website;
            user.profileBanner = profileBanner,
                user.profileSrc = profileSrc
            await Users.updateOne({ email: email }, user);
            return true;
        } catch (error) {
            throw error;
        }
    }
    async alreadyFollowing(followRequestSenderEmail, accountHandle) {
        try {
            const result = await Users.findOne({ email: followRequestSenderEmail })
            const following = result.following;
            for (let i = 0; i < following.length; i++) {
                if (following[i].accountHandle === accountHandle) return true;
            }
            return false;
        } catch (error) {
            throw error;
        }
    }
    async unfollow(followRequestSender, followRequestReciever) {
        try {
            await Users.updateOne({ accountHandle: followRequestSender.accountHandle }, {
                $pull: { "following": { "accountHandle": followRequestReciever.accountHandle } }
            })
            await Users.updateOne({ accountHandle: followRequestReciever.accountHandle }, {
                $pull: { "followers": { "accountHandle": followRequestSender.accountHandle } }
            })
            return true;
        } catch (error) {
            throw error;
        }
    }
    async follow(followRequestSender, followRequestReciever) {

        try {
            await Users.updateOne({ accountHandle: followRequestSender.accountHandle }, {
                $push: { following: followRequestReciever }
            })
            await Users.updateOne({ accountHandle: followRequestReciever.accountHandle }, {
                $push: { followers: followRequestSender }
            })
            return true;
        } catch (error) {
            throw error;
        }
    }
    async alreadyFollows(followRequestSenderEmail, followRequestReciever) {
        try {
            const result = await Users.findOne({ email: followRequestSenderEmail })
            const following = result.following;
            for (let i = 0; i < following.length; i++) {
                if (following[i].accountHandle === followRequestReciever.accountHandle) return true;
            }
            return false;
        } catch (error) {
            throw error;
        }
    }
    async findByAccountHandle(accountHandle) {
        try {
            const results = await Users.findOne({ accountHandle: accountHandle });
            return results;
        } catch (error) {
            throw error;
        }
    }
    async searchByAccountHandle(text) {
        try {
            const results = await Users.find({ accountHandle: { $regex: text } });
            return results;
        } catch (error) {
            throw error;
        }
    }
    async getDetails(email) {
        try {
            const details = await Users.findOne({ email: email }, { likedTweets: 0, retweetedTweets: 0 });
            return details;
        } catch (error) {
            throw error;
        }
    }
    async newThread(email, payload) {
        try {
            for (let i = 0; i < payload.length; i++) {
                const newId = new mongoose.Types.ObjectId();
                payload[i]._id = newId;
                payload[i].createdAt = new Date();
            }
            const result = await Users.updateOne({ email: email }, {
                $push: { tweets: payload }
            })
            return result;
        } catch (error) {
            throw err;
        }
    }
    async newTweet(email, payload) {
        try {
            const newId = new mongoose.Types.ObjectId();
            payload = { ...payload, _id: newId, createdAt: new Date() }
            const result = await Users.updateOne({ email: email }, {
                $push: { tweets: payload }
            })
            return result;
        } catch (error) {
            throw err;
        }
    }
    async getByEmail(email) {
        try {
            const user = await Users.findOne({ email: email });
            return user;
        }
        catch (err) {
            throw err;
        }
    }
    async existsByEmail(email) {
        try {
            const user = await Users.findOne({ email: email });
            return user;
        }
        catch (err) {
            throw err;
        }
    }
    async generateJWT(payload) {
        try {
            const SECRET = process.env.JWT_SECRET;
            const options = { expiresIn: 60 * 60 * 1000 }
            const token = jwt.sign(payload, SECRET, options);
            return token;
        } catch (error) {
            throw error;
        }
    }
    async existsByUsername(username) {
        try {
            const user = await Users.findOne({ accountHandle: username });
            return user;
        }
        catch (err) {
            throw err;
        }
    }
    async exists({ email, username }) {
        try {
            const user = await Users.findOne({ $or: [{ accountHandle: username }, { email: email }] })
            if (user) {
                const token = this.generateJWT({ "id": user._id });
                return { exists: true, token: token };
            }
            else {
                return { exists: false };
            }
        } catch (error) {
            throw error;
        }
    }
    async create({ id, profileSrc, email, accountName, accountHandle }) {
        try {
            const newUser = new Users({
                id: id,
                profileSrc: profileSrc,
                email: email,
                accountName: accountName,
                accountHandle: accountHandle,
            })
            await newUser.save();
            return newUser;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UserService;