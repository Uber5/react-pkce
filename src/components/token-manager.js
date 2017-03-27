import React from 'react'
import { setLocalToken, getLocalToken } from '../local-token'
import contextTypes from '../context-types'
import { hashed } from '../authenticated'
import { getHashValues } from '../lib/utils'

class TokenManager extends React.Component {

  state = { refreshing: false }

  refresh = () => {
    console.log('should refresh access_token...')
    const { provider, clientId } = this.context
    const state = 'refreshing-' + Math.random()
    const query = {
      client_id: clientId,
      response_type: 'token',
      redirect_uri: window.location,
      state
    }
    const url = `${ provider }/authorize?${ hashed(query) }`
    this.setState({ refreshing: true, url, state })
    this.setInterval()
  }

  clearTimer = () => {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = undefined
    }
  }
  setTimer = delay => {
    this.timer = setTimeout(this.refresh, delay)
  }

  setInterval = () => {
    this.interval = setInterval(this.checkForNewToken, 500)
  }
  clearInterval = () => {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = undefined
    }
  }

  checkForNewToken = () => {

    try {
      const iframeDoc = this.iframe && this.iframe.childNodes
        && this.iframe.childNodes.length > 0
        && this.iframe.childNodes[0]
        && this.iframe.childNodes[0].contentDocument
      const valueInIFrame = id => iframeDoc
        && iframeDoc.getElementById(id)
        && iframeDoc.getElementById(id).innerHTML
      const token = valueInIFrame('token')
      const expires_in = valueInIFrame('expires_in')

      if (token && expires_in) {
        console.log('got new token', token, expires_in)
        this.clearInterval()
        setLocalToken(token)
        this.setRefreshTimer(expires_in)
        this.setState({ refreshing: false })
      } else {
        console.log('checked for new token, not found yet')
      }
    } catch(e) {
      this.clearInterval()
      this.setRefreshTimer("60") // try again in 60 seconds
      this.setState({ refreshing: false })
      console.log('exception in checkForNewToken', e)
    }
  }

  constructor(props) {
    super(props)
    const hashValues = getHashValues()
    if (hashValues.access_token) {
      this.state = {
        token: hashValues.access_token,
        expires_in: hashValues.expires_in
      }
    }
  }

  renderIframe = () => {
    const { refreshing, url } = this.state
    if (refreshing) {
      return { __html: `<iframe src="${ url }"></iframe>` }
    } else {
      return { __html: "not refreshing..." }
    }
  }

  // 60 seconds before token expires?
  getDelay = expires_in => Number(expires_in) * 1000 - 60 * 1000

  setRefreshTimer = expires_in => {

    // 60 seconds before expiry
    const delay = this.getDelay(expires_in)
    this.clearTimer()
    this.setTimer(Math.max(delay, 4000))

  }

  componentWillUnmount() {
    this.clearTimer()
    this.clearInterval()
  }

  render() {

    let isRefreshingInIframe = false
    const results = getHashValues()

    if (results.access_token) {
      setLocalToken(results.access_token)
      // We can refresh only if we get `expires_in` from the server
      // and, if state contains 'refreshing', then we are inside the
      // iframe, and therefore must break recursion
      const { expires_in, state } = results
      if (state && state.match(/^refreshing/)) {
        isRefreshingInIframe = true
      }
      if (expires_in && !isRefreshingInIframe) {
        // results.expires_in = "75" // for testing
        this.setRefreshTimer(results.expires_in)
      }
      window.location.hash = ""
    }

    return (
      <div style={{ display: 'none' }}>
        { isRefreshingInIframe &&
          <div>
            <div id="token">{ this.state.token }</div>
            <div id="expires_in">{ this.state.expires_in }</div>
          </div>
        }
        { this.state.refreshing &&
          <div
            ref={iframe => { this.iframe = iframe }}
            dangerouslySetInnerHTML={this.renderIframe()}>
          </div>
        }
      </div>
    )

  }
}

TokenManager.contextTypes = contextTypes

export default TokenManager
