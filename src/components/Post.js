import React from 'react';
import ResponseForm from './ResponseForm';
import ResponseList from './ResponseList';

function Post({ post, userId }) {
    return ( < div >
        <
        h3 > { post.title } < /h3> <p> { post.content } </p >
        <
        ResponseList postId = { post._id }
        /> <ResponseForm postId = { post._id }userId = { userId }/ > < /div>);
    }

    export default Post;