import html2canvas from 'html2canvas'
import Tile from './tile.js'
import { Component } from 'react'
import lzString from 'lz-string'

export default class Body extends Component {
  async initCanvasBattlefield (htmlContent) {
    const tmpEl = document.createElement('div')
    tmpEl.innerHTML = htmlContent
    document.body.appendChild(tmpEl)

    const canvas = await html2canvas(tmpEl, { scale: 1, allowTaint: true, taintTest: false, logging: true })
    const paintDim = {
      x: 0,
      y: 0,
      width: canvas.width,
      height: canvas.height
    }
    const tiles = []
    const width = paintDim.width
    const height = paintDim.height
    const copycanvas = document.getElementById('sourcecopy')
    const outputcanvas = document.getElementById('output')
    let y = 0

    copycanvas.width = canvas.width
    copycanvas.height = canvas.height
    copycanvas
      .getContext('2d')
      .drawImage(canvas, 0, 0, paintDim.width, paintDim.height)

    outputcanvas.width = canvas.width
    outputcanvas.height = canvas.height

    const canvasContext = outputcanvas.getContext('2d')

    outputcanvas.onmousedown = (e) => {
      let posx = 0
      let posy = 0
      if (e.pageX || e.pageY) {
        posx = e.pageX
        posy = e.pageY
      } else if (e.clientX || e.clientY) {
        posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft
        posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop
      }
      tiles.forEach(tile => tile.impactNearby(posx - e.target.offsetLeft, posy - e.target.offsetTop))
      tiles.sort((a, b) => (a.force - b.force))
      canvasContext.clearRect(paintDim.x, paintDim.y, paintDim.width, paintDim.height)
      tiles.forEach(tile => tile.cycle(paintDim.width, paintDim.height).draw(copycanvas, canvasContext))
    }

    while (y < height) {
      let x = 0
      let tile = null
      while (x < width) {
        tile = new Tile(x, y, x, y, x, y)
        tile.moveDirectlyBy((paintDim.width - width) / 2, (paintDim.height - height) / 2)
        tiles.push(tile)
        x += tile.width
      }
      y += tile.height
    }

    setTimeout(() => {
      canvasContext.clearRect(paintDim.x, paintDim.y, paintDim.width, paintDim.height)
      tiles.forEach(tile => tile.cycle(paintDim.width, paintDim.height).draw(copycanvas, canvasContext))
    }, 33)

    tmpEl.parentElement.removeChild(tmpEl)
  }

  async componentDidMount () {
    const response = await window.fetch('//' + window.location.host +
          '/api/?url=' + encodeURIComponent('https://blog.fefe.de'))
    const html = await response.text()
    await this.initCanvasBattlefield(lzString.decompressFromUTF16(html))
  }

  render () {
    return (
      <div>
        <div style={{ display: 'none' }}>
          <canvas id='sourcecopy' />
        </div>
        <canvas id='output' />
      </div>
    )
  }
}
