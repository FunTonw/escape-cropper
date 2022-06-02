const prevBtn = document.querySelector("#btn-previous");
const nextBtn = document.querySelector("#btn-next");

// step into editing
nextBtn.addEventListener("click", () => {
  carousel.scrollTo(document.body.clientWidth, 0);
});

prevBtn.addEventListener("click", () => {
  carousel.scrollTo(0, 0);
});


// uploadImg
const uploadbtn = document.querySelector('.input-file-button');
const uploadinput = document.querySelector('.input-file-button-origin');
const uploadimg = document.getElementById('uploaded-img');
const reuploadbtn = document.querySelector('#btn-reupload')
//cropper img
let recanvas = document.getElementById('recanvas');

uploadbtn.addEventListener('click', function(){
  uploadinput.click();
})

uploadinput.addEventListener('change',function(e) {
  if (this.files.length > 0){
     let reader = new FileReader()
     let img = new Image();
     uploadimg.addEventListener("load", function () {
      recanvas.height = img.height;
      recanvas.width = img.width;
      recanvas.getContext("2d").drawImage(img, 0, 0, img.width, img.height);
      // recanvas.getContext("2d").drawImage(uploadimg, 0, 0, uploadimg.width, uploadimg.height);
      new Cropper(recanvas, {
        aspectRatio: 16 / 9,
        viewMode: 2,
      });
     });
     img.src =  URL.createObjectURL(this.files[0]);
     uploadimg.src = URL.createObjectURL(this.files[0]);
  //解放記憶體(?
   uploadimg.onload = function() {
     URL.revokeObjectURL(uploadimg.src)
     URL.revokeObjectURL(img.src)
   }


  uploadbtn.classList.add('hidden');
  if( Array.from(uploadimg.classList).indexOf('hidden') >= 0) {
      uploadimg.classList.remove('hidden');
  }
  }
})

reuploadbtn.addEventListener('click', function() {
  uploadimg.classList.add('hidden');
  uploadbtn.classList.remove('hidden');
  uploadinput.click();
})

//cropper
