import React from 'react'

export default function Post ({ id, author, name, body, likes, liked, onLike, onUnlike }) {
  function onLikeChange() {
    if (!liked) {
      onLike(id)
    } else {
      onUnlike(id)
    }
  }
  
  return <div className='ui fluid card'>
    <div className='content'>
      <img className='right floated mini ui image' src={`https://graph.facebook.com/v2.6/${author}/picture?type=square&height=200`} />
      <div className='meta'>{name}</div>
      <div className='description'>{body}</div>
      <div className='meta'>
        <a onClick={onLikeChange}><i className={(liked ? '' : 'empty ') + 'heart icon'}></i> {likes.length} {likes.length != 1 ? 'likes' : 'like'}</a>
      </div>
    </div>
  </div>
}
