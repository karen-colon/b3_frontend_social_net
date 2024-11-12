const Post = ({ postId }) => {
    return ( <
        div > {
            post && ( <
                div >
                <
                h2 > { post.title } < /h2> <
                p > { post.content } < /p> <
                /div>
            )
        }

        <
        div >
        <
        h3 > Respuestas < /h3> {
            replies.map((reply) => ( <
                div key = { reply._id } >
                <
                p > { reply.content } < /p> <
                /div>
            ))
        } <
        /div>

        { /* Ensure this is correctly formatted */ } <
        ReplyForm postId = { postId }
        onReplySubmitted = { handleReplySubmitted }
        /> <
        /div>
    );
};

export default Post;