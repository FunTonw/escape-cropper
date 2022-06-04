const prevBtn = document.querySelector("#btn-previous");
const nextBtn = document.querySelector("#btn-next");

// step into editing
nextBtn.addEventListener("click", () => {
  carousel.scrollTo(document.body.clientWidth, 0);
});

prevBtn.addEventListener("click", () => {
  carousel.scrollTo(0, 0);
});

// edit-button
const editingButtonGroup = document.querySelector('.editing_button-group');
editingButtonGroup.addEventListener('click', (e)=>{
  let num;
  if (e.target.nodeName === 'BUTTON') {
    num = (e.target.id === 'rotate-left') ? 1 :
    (e.target.id === 'rotate-right') ? 2 :
    (e.target.id === 'ratio-sqaure') ? 3 :
    (e.target.id === 'ratio-rec') ? 4 :
    (e.target.id === 'ratio-free') ? 5 :
    0;
    switch (num) {
      case 1:
        cropper.rotate(-90);
        break;
      case 2:
        cropper.rotate(90);
        break;
      case 3:
        cropper.setAspectRatio(1);
        break;
      case 4:
        cropper.setAspectRatio(16/9);
        break;
      case 5:
        cropper.setAspectRatio(NaN);
        break;
      default:
        break;
    }
  }
})
// downloadbtn
const downloadbtn = document.querySelector('#download');
// uploadImg
const uploadbtn = document.querySelector('.input-file-button');
const uploadinput = document.querySelector('.input-file-button-origin');
const uploadimg = document.getElementById('uploaded-img');
const reuploadbtn = document.querySelector('#btn-reupload')
//cropper img
let recanvas = document.getElementById('recanvas');

//preview img
let previewimg = document.getElementById('preview');

//img
let watermarkImagePath = 'https://hexschool.github.io/escape-cropper/photo.png'

uploadbtn.addEventListener('click', function(){
  uploadinput.click();
})

// 當input改變
uploadinput.addEventListener('change',function() {
  if (this.files.length > 0){
    let img = new Image();
    let preimg = new Image();
    //load進渲染後 動作
    uploadimg.addEventListener("load", function () {
     cropper.destroy();   //重製裁切版
     //製作<canvas>
     recanvas.height = img.height;
     recanvas.width = img.width;
     recanvas.getContext("2d").drawImage(img, 0, 0, img.width, img.height);
     //製作裁切版
     cropper = new Cropper(recanvas,{
      aspectRatio: 16 / 9,
      viewMode: 2,
      movable: false,
      //移動時重新渲染預覽圖, 含浮水印
      crop: function() {
        let preimg = new Image();
        preimg.src = cropper.getCroppedCanvas().toDataURL();
        preimg.addEventListener("load", async () => {
          previewimg.src = await watermarkImage(
            preimg,
            'https://hexschool.github.io/escape-cropper/photo.png'
          );
          downloadbtn.href = previewimg.src;
        });
      },
     });

     //解放記憶體(?
     URL.revokeObjectURL(uploadimg.src)
     URL.revokeObjectURL(img.src)
    });
    // 上傳圖片 
    img.src =  URL.createObjectURL(this.files[0]);
    uploadimg.src = URL.createObjectURL(this.files[0]);

    // 畫面的顯示隱藏
    uploadbtn.classList.add('hidden');
    if( Array.from(uploadimg.classList).indexOf('hidden') >= 0) {
        uploadimg.classList.remove('hidden');
    }
  }
})

// 重新上傳圖檔
reuploadbtn.addEventListener('click', function() {
  uploadimg.classList.add('hidden');
  uploadbtn.classList.remove('hidden');
  uploadinput.click();
})

//cropper 裁切版
let cropper = new Cropper(recanvas);

// 浮水印 https://hexschool.github.io/escape-cropper/photo.png
async function watermarkImage(originalImage, watermarkImagePath) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  
  const canvasWidth = originalImage.width;
  const canvasHeight = originalImage.height;
  
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  
  // initializing the canvas with the original image
  context.drawImage(originalImage, 0, 0, canvasWidth, canvasHeight);
  
  // loading the watermark image and transforming it into a pattern
  const result = await fetch(watermarkImagePath);
  const blob = await result.blob();
  const image = await createImageBitmap(blob, {
    resizeWidth: canvasWidth / 6,
    resizeHeight: this.resizeWidth
  });
  const pattern = context.createPattern(image, "no-repeat");
  
  // translating the watermark image to the bottom right corner
  context.translate(canvasWidth - image.width, canvasHeight - image.height);
  context.rect(0, 0, canvasWidth, canvasHeight);
  context.fillStyle = pattern;
  context.fill();
  return canvas.toDataURL();
}
