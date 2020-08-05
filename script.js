class DataViewer {
  constructor(pageContainer) {
    this.data = []
  }

  setup(pageContainer) {
    this.pageContainer = pageContainer

    fetch('data.json')
      .then(response => response.json())
      .then(data => {
        this.data = data
        this.renderPage()
      })

    this.registerModalEventHandler()
  }

  renderPage(pageNum = 0, imagesPerPage = 200) {
    this.data.forEach(data => {
      this.renderImage(data)
    })
  }

  renderImage(info) {
    const $WrapperDiv = document.createElement('div')

    const sample = `
      <img src="images/rgb/${info.ID}.png" class="sample-image" data-toggle="modal" data-target="#details-modal" data-ra="${info.sdss_ra}" data-dec="${info.sdss_dec}" data-splusid="${info.ID}">
    `

    $WrapperDiv.classList.add('d-inline-block', 'w-150', 'mr-1', 'mb-2')
    $WrapperDiv.innerHTML = sample

    this.pageContainer.appendChild($WrapperDiv)
  }

  registerModalEventHandler() {
    $('#details-modal').on('show.bs.modal', function (event) {
      const target = $(event.relatedTarget)
      const ra = target.data('ra')
      const dec = target.data('dec')
      const splusId = target.data('splusid')

      let modal = $(this)
      modal.find('.modal-header').text(`Objeto: ${splusId}`)
      modal.find('.sdss-image').attr('src', `https://skyserver.sdss.org/dr12/SkyserverWS/ImgCutout/getjpeg?ra=${ra}&dec=${dec}&width=300&height=300&scale=0.21`)
      modal.find('.rgb-image').attr('src', `images/rgb/${splusId}.png`)

      const getImgMarkup = (variant) => `
        <div class="col px-1 mb-1">
          <img src="images/${variant.folder}/${splusId}${variant.sufix}.png" width="100%">
        </div>
      `

      const inputIndexes = [0, 1, 2, 3]
      let variants = inputIndexes.map(i => ({ folder: 'inp', sufix: `_input_${i + 1}` }))
      variants.push(...inputIndexes.map(i => ({ folder: 'grad', sufix: `_${i}_block2_conv2` })))
      variants.push(...inputIndexes.map(i => ({ folder: 'grad', sufix: `_${i}_block3_conv3` })))
      variants.push(...inputIndexes.map(i => ({ folder: 'grad', sufix: `_${i}_block4_conv3` })))

      const detailsImages = variants.map(getImgMarkup).join(' ')

      modal.find('.images').html(detailsImages)
    })
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const dv = new DataViewer()
  dv.setup(document.getElementById('container'))
})