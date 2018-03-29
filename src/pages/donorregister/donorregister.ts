import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ServerService } from '../../app/server.service';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Camera, CameraOptions } from '@ionic-native/camera';


@Component({
  selector: 'page-donorregister',
  templateUrl: 'donorregister.html',
})
export class DonorregisterPage implements OnInit {

  selectedItem: any;
  donorRegisterForm: FormGroup;
  imageURI: any;
  imageFileName: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private serverService: ServerService,
    private transfer: FileTransfer, private camera: Camera, public loadingCtrl: LoadingController,
    public toastCtrl: ToastController) {
    this.selectedItem = navParams.get('item');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DoctoregisterPage');
  }

  ngOnInit() {
    this.donorRegisterForm = new FormGroup({
      'seekerData': new FormGroup({
        'name': new FormControl(null, [Validators.required]),
        'userName': new FormControl(null, [Validators.required]),
        'password': new FormControl(null, [Validators.required]),
        'confirmPassword': new FormControl(null, [Validators.required]),
        'state': new FormControl(null, [Validators.required]),
        'city': new FormControl(null, [Validators.required]),
        'contactNumber': new FormControl(null, [Validators.required]),
        'email': new FormControl(null, [Validators.required]),
        'country': new FormControl(null, [Validators.required])
      //  'userfile': new FormControl(null, [Validators.required])
      })
    });
  }

  changeListener($event): void {
    this.serverService.postFile($event.target);
}

  getImage() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }
  
    this.camera.getPicture(options).then((imageData) => {
      this.imageURI = imageData;
    }, (err) => {
      console.log(err);
      this.presentToast(err);
    });
  }

  uploadFile() {
    let loader = this.loadingCtrl.create({
      content: "Uploading..."
    });
    loader.present();
    const fileTransfer: FileTransferObject = this.transfer.create();
  
    let options: FileUploadOptions = {
      fileKey: 'ionicfile',
      fileName: 'ionicfile',
      chunkedMode: false,
      mimeType: "image/jpeg",
      headers: {}
    }
  
    fileTransfer.upload(this.imageURI, 'http://192.168.0.7:8080/api/uploadImage', options)
      .then((data) => {
      console.log(data+" Uploaded Successfully");
      this.imageFileName = "http://192.168.0.7:8080/static/images/ionicfile.jpg"
      loader.dismiss();
      this.presentToast("Image uploaded successfully");
    }, (err) => {
      console.log(err);
      loader.dismiss();
      this.presentToast(err);
    });
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }

  addDonorRegister($event) {
    console.log(this.donorRegisterForm);
    console.log("userName ::" + this.donorRegisterForm.value.seekerData.email);
    this.serverService.registerDonorService(this.donorRegisterForm.value , $event.target)
      .subscribe(
        data => {
          console.log(data.status);
          if (data.status === 1) {
            console.log(data.status);
          } else {
            //  this.errorMessage = true;
            //  this.loginError=data.error;
            setTimeout(() => {
              // this.errorMessage = false;                  
            }, 3000);
            //  this.router.navigate(['/login']);
          }

        },
        error => {
          //  this.router.navigate(['/login']);
        }
      );

  }
}