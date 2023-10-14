export default class Tile {
  constructor (originX = 0, originY = 0, videoX = 0, videoY = 0, currentX = 0, currentY = 0) {
    this.originX = originX
    this.originY = originY
    this.currentX = currentX
    this.currentY = currentY
    this.rotation = 0
    this.force = 0
    this.moveX = 0
    this.moveY = 0
    this.moveRotation = 0
    this.videoX = videoX
    this.videoY = videoY
    this.width = 20
    this.height = 20
    this.centerWidth = 10
    this.centerHeight = 10
  }

  moveDirectlyBy (dx, dy) {
    this.originX += this.centerWidth + dx
    this.originY += this.centerHeight + dy
    this.currentX += this.centerWidth + dx
    this.currentY += this.centerHeight + dy
  }

  impactNearby (x, y) {
    const xdiff = this.currentX - x
    const ydiff = this.currentY - y
    const dist = Math.sqrt(xdiff * xdiff + ydiff * ydiff)
    const randRange = 220 + (Math.random() * 30)
    const range = randRange - dist
    const force = 3 * (range / randRange)
    const radians = Math.atan2(ydiff, xdiff)

    if (force > this.force) {
      this.force = force
      this.moveX = Math.cos(radians)
      this.moveY = Math.sin(radians)
      this.moveRotation = 0.5 - Math.random()
    }
  }

  draw (source, target) {
    const RAD = Math.PI / 180

    target.save()
    target.translate(this.currentX, this.currentY)
    target.rotate(this.rotation * RAD)
    target.drawImage(source, this.videoX, this.videoY, this.width, this.height, -this.centerWidth, -this.centerHeight, this.width, this.height)
    target.restore()
  }

  cycle (xBoundaries, yBoundaries) {
    if (this.force > 0.0001) {
      this.moveX *= this.force
      this.moveY *= this.force
      this.moveRotation *= this.force
      this.currentX += this.moveX
      this.currentY += this.moveY
      this.rotation += this.moveRotation
      this.rotation %= 360
      this.force *= 0.9
      if (this.currentX <= 0 || this.currentX >= xBoundaries) {
        this.moveX *= -1
      }
      if (this.currentY <= 0 || this.currentY >= yBoundaries) {
        this.moveY *= -1
      }
    } else if (this.rotation !== 0 || this.currentX !== this.originX || this.currentY !== this.originY) {
      // contract
      const diffx = (this.originX - this.currentX) * 0.2
      const diffy = (this.originY - this.currentY) * 0.2
      const diffRot = (0 - this.rotation) * 0.2

      if (Math.abs(diffx) < 0.5) {
        this.currentX = this.originX
      } else {
        this.currentX += diffx
      }
      if (Math.abs(diffy) < 0.5) {
        this.currentY = this.originY
      } else {
        this.currentY += diffy
      }
      if (Math.abs(diffRot) < 0.5) {
        this.rotation = 0
      } else {
        this.rotation += diffRot
      }
    } else {
      this.force = 0
    }
    return this
  }
}
