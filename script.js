class DataViewer {
  constructor(pageContainer) {
    this.data = []
    this.counter = 0
  }

  setup(pageContainer) {
    this.pageContainer = pageContainer

    fetch('data.json')
      .then(response => response.json())
      .then(data => {
        this.data = data
        this.renderPage()
      })
  }

  renderPage(pageNum = 0, imagesPerPage = 200) {
    this.data.forEach(data => {
      this.renderImage(data)
    })
  }

  renderImage(info) {
    const $WrapperDiv = document.createElement('div')

    const sample = `
      <img src="images/rgb/${info.ID}.png" class="sample-image" data-toggle="modal" data-target="#modal-${this.counter}">
    `

    $WrapperDiv.classList.add('d-inline-block', 'w-150', 'mr-1', 'mb-2')
    $WrapperDiv.innerHTML = sample

    this.pageContainer.appendChild($WrapperDiv)

    const getImgMarkup = (variant) => `
      <div class="col px-1 mb-1">
        <img src="images/${variant.folder}/${info.ID}${variant.sufix}.png" width="100%">
      </div>
    `

    const inputIndexes = [0, 1, 2, 3]
    let variants = inputIndexes.map(i => ({ folder: 'inp', sufix: `_input_${i + 1}` }))
    variants.push(...inputIndexes.map(i => ({ folder: 'grad', sufix: `_${i}_block2_conv2` })))
    variants.push(...inputIndexes.map(i => ({ folder: 'grad', sufix: `_${i}_block3_conv3` })))
    variants.push(...inputIndexes.map(i => ({ folder: 'grad', sufix: `_${i}_block4_conv3` })))

    const detailsImages = variants.map(getImgMarkup).join(' ')

    const modal = `
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          Objeto: ${info.ID}
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-8">
              <div class="row row-cols-4">
                ${detailsImages}
              </div>
            </div>
            <div class="col-4">
              <p class="small text-center mb-0">SDSS</p>
              <img src="http://skyserver.sdss.org/dr12/SkyserverWS/ImgCutout/getjpeg?ra=${info.sdss_ra}&dec=${info.sdss_dec}&width=300&height=300&scale=0.21" width="100%">
              <img src="images/rgb/${info.ID}.png" class="mt-3 mx-auto d-block" style="max-width: 300px;">
            </div>
          </div>
        </div>
      </div>
    </p>
    `
    const $modal = document.createElement('div')
    $modal.id = `modal-${this.counter}`
    $modal.classList.add('modal')
    $modal.tabIndex = '-1'
    $modal.innerHTML = modal
    document.body.appendChild($modal)
    this.counter++
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const dv = new DataViewer()
  dv.setup(document.getElementById('container'))
})