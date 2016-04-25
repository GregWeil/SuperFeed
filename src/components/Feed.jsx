import React from 'react'
import Post from './Post'

export default function Feed ({ posts, user, onLike, onUnlike }) {
  const feedStyles = {
    paddingTop: '1rem'
  }

  return <div style={feedStyles}>
    {posts.map((post) => <Post key={post.id} {...post} liked={post.likes.includes(user)} onLike={onLike} onUnlike={onUnlike} />)}
  </div>
}
