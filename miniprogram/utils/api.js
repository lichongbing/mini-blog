const regeneratorRuntime = require('runtime.js');

const db = wx.cloud.database()
const _ = db.command

/**
 * 获取文章列表
 * @param {} page 
 */
function getPostsList(page, filter) {
    if (filter === '') {
        return db.collection('mini_posts')
            .orderBy('createTime', 'desc')
            .skip((page - 1) * 10)
            .limit(10)
            .field({
                _id: true,
                author: true,
                createTime: true,
                defaultImageUrl: true,
                title: true,
                totalComments: true,
                totalVisits: true,
                totalZans: true
            }).get()
    }
    else {
        return db.collection('mini_posts')
            .where({
                title: db.RegExp({
                    regexp: filter,
                    options: 'i',
                })
            })
            .orderBy('createTime', 'desc')
            .skip((page - 1) * 10)
            .limit(10)
            .field({
                _id: true,
                author: true,
                createTime: true,
                defaultImageUrl: true,
                title: true,
                totalComments: true,
                totalVisits: true,
                totalZans: true
            }).get()
    }
}

/**
 * 获取收藏、点赞列表
 * @param {} page 
 */
function getPostRelated(where,page) {
    return db.collection('mini_posts_related')
        .where(where)
        .orderBy('createTime', 'desc')
        .skip((page - 1) * 10)
        .limit(10)
        .get()
}
/**
 * 获取文章详情
 * @param {} id 
 */
function getPostDetail(id) {
    return wx.cloud.callFunction({
        name: 'postsService',
        data: {
            action: "getPostsDetail",
            id: id,
        }
    })
}

/**
 * 新增用户收藏文章
 */
function addPostCollection(data) {
    return wx.cloud.callFunction({
        name: 'postsService',
        data: {
            action: "addPostCollection",
            postId: data.postId,
            postTitle: data.postTitle,
            postUrl: data.postUrl,
            postDigest: data.postDigest,
            type: data.type
        }
    })
}

/**
 * 取消喜欢或收藏
 */
function deletePostCollectionOrZan(postId,type)
{
    return wx.cloud.callFunction({
        name: 'postsService',
        data: {
            action: "deletePostCollectionOrZan",
            postId: postId,
            type: type
        }
    })
}

/**
 * 新增用户点赞
 * @param {} data 
 */
function addPostZan(data) {
    return wx.cloud.callFunction({
        name: 'postsService',
        data: {
            action: "addPostZan",
            postId: data.postId,
            postTitle: data.postTitle,
            postUrl: data.postUrl,
            postDigest: data.postDigest,
            type: data.type
        }
    })
}

/**
 * 获取打赏码
 */
function getQrCode() {
    return wx.cloud.getTempFileURL({
        fileList: [{
            fileID: 'cloud://test-91f3af.54ec-test-91f3af/common/1556347401340.jpg'
        }]
    })
}

module.exports = {
    getPostsList: getPostsList,
    getPostDetail: getPostDetail,
    getPostRelated: getPostRelated,
    getQrCode: getQrCode,
    addPostCollection: addPostCollection,
    addPostZan: addPostZan,
    deletePostCollectionOrZan:deletePostCollectionOrZan
}