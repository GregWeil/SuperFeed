import React, { Component } from 'react'
import { connect } from 'react-redux'
import re, { selector } from './actions'
import { SF_API } from './api'
import { NavItem, BottomNav, NavContainer } from './components/Nav'
import Feed from './components/Feed'
import CreatePostForm from './components/CreatePostForm'

@connect(selector, re.action)
export default class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      posts: [],
      loading: true
    }
  }

  async createPost (body) {
    await SF_API.post('createPost', {
      body,
      author: this.props.auth.id,
      accessToken: this.props.auth.accessToken
    })

    this.props.actions.getPosts()
  }

  async likePost (post) {
    await SF_API.post('likePost', {
      post,
      user: this.props.auth.id,
      accessToken: this.props.auth.accessToken
    })
  }

  async unlikePost (post) {
    await SF_API.post('unlikePost', {
      post,
      user: this.props.auth.id,
      accessToken: this.props.auth.accessToken
    })
  }

  render () {
    return <div>
      <NavContainer>
        <div className='ui text container'>
          <CreatePostForm onSubmit={::this.createPost} />
          <Feed posts={this.props.app.posts} />
        </div>
      </NavContainer>
      <BottomNav>
        <NavItem><i className='large write icon' /></NavItem>
        <NavItem><i className='large settings icon' /></NavItem>
      </BottomNav>
    </div>
  }
}
