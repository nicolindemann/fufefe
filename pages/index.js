import { Component } from 'react'
import dynamic from 'next/dynamic'
import { Analytics } from '@vercel/analytics/react'

const Body = dynamic(() => import('../components/body'), { ssr: false })

export default class Index extends Component {
  render () {
    return (
      <main>
        <body style={{ margin: 0, padding: 0 }}>
          <Body />
          <Analytics />
        </body>
      </main>)
  }
}
