// BlogPostPage.js

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function BlogPostPage() {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [user, setUser] = useState(null); // Simulating user login status

    useEffect(() => {
        // Fetch blog post by id from your backend API
        fetch(`https://yourbackendapi.com/blogs/${id}`)
            .then(response => response.json())
            .then(data => setBlog(data))
            .catch(error => console.error('Error fetching blog post:', error));
        
        // Fetch comments for the blog post
        fetch(`https://yourbackendapi.com/blogs/${id}/comments`)
            .then(response => response.json())
            .then(data => setComments(data))
            .catch(error => console.error('Error fetching comments:', error));

        // Simulate fetching logged-in user info
        // Replace with actual authentication check
        fetch(`https://yourbackendapi.com/currentUser`)
            .then(response => response.json())
            .then(data => setUser(data))
            .catch(error => console.error('Error fetching user info:', error));
    }, [id]);

    const handleCommentSubmit = e => {
        e.preventDefault();
        // Post new comment to backend API
        fetch(`https://yourbackendapi.com/blogs/${id}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: newComment, author: user.name }),
        })
            .then(response => response.json())
            .then(data => {
                setComments([...comments, data]);
                setNewComment('');
            })
            .catch(error => console.error('Error posting comment:', error));
    };

    if (!blog) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>{blog.title}</h2>
            <p>By: <Link to={`/profile/${blog.author}`}>{blog.author}</Link></p>
            <p>{blog.content}</p>

            <section className="comments">
                <h3>Comments</h3>
                {comments.length > 0 ? (
                    <ul>
                        {comments.map(comment => (
                            <li key={comment.id}>
                                <p>{comment.content}</p>
                                <p>By: {comment.author}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No comments yet. Be the first to comment!</p>
                )}
            </section>

            {user && (
                <section className="add-comment">
                    <h3>Add a Comment</h3>
                    <form onSubmit={handleCommentSubmit}>
                        <textarea
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                            placeholder="Write your comment here"
                            required
                        ></textarea>
                        <button type="submit">Post Comment</button>
                    </form>
                </section>
            )}
        </div>
    );
}

export default BlogPostPage;
