

import React, { Component } from 'react'

class SocialButton extends Component {

  render() {

    const { handle, type } = this.props

    let name, url, icon, btnClass

    switch (type) {
      case 'github':
        name = 'GitHub'
        icon = 'fab fa-github'
        url = `https://github.com/${handle}`
        btnClass = ''
        break;
      case 'telegram':
        name = 'Telegram'
        icon = 'fab fa-telegram'
        url = `https://t.me/${handle}`
        btnClass = 'is-info'
        break;
      case 'twitter':
        name = 'Twitter'
        icon = 'fab fa-twitter'
        url = `https://twitter.com/${handle}`
        btnClass = 'is-info'
        break;
      case 'youtube':
        name = 'Youtube'
        icon = 'fab fa-youtube'
        url = `https://www.youtube.com/${handle}`
        btnClass = 'is-danger'
        break;
      case 'facebook':
        name = 'Facebook'
        icon = 'fab fa-facebook'
        url = `https://www.facebook.com/${handle}`
        btnClass = 'is-purple'
        break;
      case 'steemit':
        name = 'Steemit'
        icon = 'far fa-comment'
        url = `https://steemit.com/@${handle}`
        btnClass = 'is-primary'
        break;
      case 'reddit':
        name = 'Reddit'
        icon = 'fab fa-reddit'
        url = `https://reddit.com/u/${handle}`
        btnClass = 'is-orange'
        break;
      case 'keybase':
        name = 'Keybase'
        icon = 'fab fa-keybase'
        url = `https://keybase.io/${handle}`
        btnClass = 'is-info'
        break;
      case 'wechat':
        name = 'WeChat'
        icon = 'fab fa-weixin'
        url = `https://www.wechat.com/${handle}`
        btnClass = 'is-success'
        break;
      default:
        name = 'Unknown'
        icon = 'fab fa-question-circle'
        url = '#'
        btnClass = 'is-warning'
    }

    return (
      <a class={`button ${btnClass}`} target="_blank" href={url}>
        <span class="icon">
          <i class={icon}></i>
        </span>
        <span>{name}</span>
      </a>
    )
  }
}

export default SocialButton
