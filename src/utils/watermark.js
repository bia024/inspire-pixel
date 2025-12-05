export const addWatermark = (imageUrl, text = 'InspirePixel - Upgrade to Pro') => {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = 'Anonymous'
        img.src = imageUrl

        img.onload = () => {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')

            canvas.width = img.width
            canvas.height = img.height

            ctx.drawImage(img, 0, 0)

            const fontSize = Math.max(24, Math.floor(img.width * 0.05))
            ctx.font = `bold ${fontSize}px Arial, sans-serif`
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'

            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
            ctx.shadowBlur = 4
            ctx.shadowOffsetX = 2
            ctx.shadowOffsetY = 2
            ctx.fillText(text, canvas.width / 2, canvas.height / 2)

            const smallFontSize = Math.max(14, Math.floor(img.width * 0.025))
            ctx.font = `${smallFontSize}px Arial, sans-serif`
            ctx.textAlign = 'right'
            ctx.fillText(text, canvas.width - 20, canvas.height - 20)

            resolve(canvas.toDataURL('image/jpeg', 0.9))
        }

        img.onerror = (error) => {
            reject(error)
        }
    })
}