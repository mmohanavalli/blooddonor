import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, ActionSheetController, Platform, Loading } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ServerService } from '../../app/server.service';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { Camera } from '@ionic-native/camera';
import { HomePage } from '../home/home';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';
import { OfflinePage } from '../offline/offline';
import { Network } from '@ionic-native/network';
import { IMyDpOptions } from 'mydatepicker';


declare let cordova: any;

@Component({
  selector: 'page-donorregister',
  templateUrl: 'donorregister.html',
})
export class DonorregisterPage {

  lastImage: string = null;
  selectedItem: any;
  donorRegisterForm: FormGroup;
  imageURI: any;
  imageFileName: any;
  bloodGroups = ['A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-'];
  countries = ['India', 'Netherland'];
  genderData = ['Male', 'Female'];
  isPassword: boolean;
  passwordError: string;
  numberError: string;
  isNumber: boolean;
  loading: Loading;
  imageName: string;
  imageError: boolean;
  imageErrorMessage: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private serverService: ServerService,
    private transfer: FileTransfer, private camera: Camera, public loadingCtrl: LoadingController,
    public toastCtrl: ToastController, private fb: FormBuilder, private _cdr: ChangeDetectorRef, public platform: Platform, public actionSheetCtrl: ActionSheetController,
    private file: File, private filePath: FilePath,private network: Network
  ) {
    this.selectedItem = navParams.get('item');
    this.isPassword = false;
    this.isNumber = false;
    this.imageError = false
    this.donorRegisterForm = fb.group({
      bloodgroup: [''],
      country: [''],
      gender: ""
    });
    this.donorRegisterForm = fb.group({
      gender: ""
    });
    this.createForm();
  }

  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    // dateFormat: 'yyyy/mm/dd',
    dateFormat: 'mm-dd-yyyy',
  };

  goback() {
    this.navCtrl.setRoot(HomePage);
  }

  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, (err) => {
      this.presentToastFailure('Error while selecting image.');
    });
  }

  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
    }, error => {
      this.presentToastFailure('Error while storing file.');
    });
  }

  private presentToastSuccess(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      cssClass: 'loginsuccess',
      position: 'middle'
    });
    toast.present();
  }

  private presentToastFailure(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      cssClass: 'loginfailed',
      position: 'middle'
    });
    toast.present();
  }

  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  public uploadImage() {
    // Destination URL
    var url = "https://blooddonorspot.com/donor/imageUploader";

    // File for Upload
    var targetPath = this.pathForImage(this.lastImage);

    // File name only
    var filename = this.lastImage;

    var options = {
      fileKey: "userfile",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params: { 'fileName': filename }
    };

    const fileTransfer: FileTransferObject = this.transfer.create();

    this.loading = this.loadingCtrl.create({
      content: 'Uploading...',
    });
    this.loading.present();

    // Use the FileTransfer to upload the image
    fileTransfer.upload(targetPath, url, options).then(data => {
      console.log(JSON.stringify(data));
      console.log("response" + JSON.stringify(data.response));
      this.imageName = JSON.stringify(data.response);
      this.imageName = this.imageName.replace(/"/g, "");
      console.log("this.imageName" + this.imageName);
      this.imageName = this.imageName.replace(/\\t/g, '').split('\r\n').toString();
      console.log("this.imageName 1" + this.imageName);
      this.loading.dismissAll()
      this.presentToastSuccess('Image succesfully uploaded.');
    }, err => {
      this.loading.dismissAll()
      this.presentToastFailure('Error while uploading file.');
    });
  }

  onBloodGroupChange(): void {
    console.log("bloodgroup ::" + this.donorRegisterForm.value.bloodgroup);
    //  let bloodgroup = this.donorRegisterForm.value.bloodgroup;   
    this._cdr.detectChanges();
  }

  onGenderChange(): void {
    this._cdr.detectChanges();
  }

  onCountryChange(): void {
    this._cdr.detectChanges();
  }

  ionViewDidLoad() {
    this.network.onDisconnect().subscribe(data => {
      console.log("Network Status"+data.type);
      if(data.type == "offline"){
        console.log("offline page");
        this.navCtrl.push(OfflinePage);
      }
    }, error => console.error(error));
  }

  onContactNumberChange(event) {
    let regExp = /^[0-9]/;

    if (!regExp.test(event.value)) {
      this.isNumber = true;
      this.numberError = "Please enter number only";
      setTimeout(() => {
        this.numberError = "";
      }, 4000);       
      
    } else {
      this.isNumber = false;
    }
  }

  createForm() {
    this.donorRegisterForm = this.fb.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      password: ['',Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(5)])],
      confirmPassword: ['',Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(5)])],
      dob: ['', Validators.required],
      age: ['', Validators.required],
      gender: ['', Validators.required],
      bloodgroup: ['', Validators.required],
      weight: ['', Validators.required],
      contactnumber: ['', Validators.compose([Validators.required, Validators.minLength(10),Validators.maxLength(10)])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      state: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      phoneno1: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])],
      phoneno2: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])],
      phoneno3: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])],
      message: ['', Validators.required]

    });
  }

  // onFileChange(event) {
  //   let reader = new FileReader();
  //   if(event.target.files && event.target.files.length > 0) {
  //     let file = event.target.files[0];
  //     reader.readAsDataURL(file);
  //     reader.onload = () => {
  //       this.donorRegisterForm.get('userfile').setValue({
  //         filename: file.name,
  //         filetype: file.type,
  //         value: reader.result.split(',')[1]
  //       })
  //     };
  //   }
  // }  

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'middle'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  successToast() {
    let toast = this.toastCtrl.create({
      message: 'User added successfully',
      duration: 3000,
      cssClass: 'loginsuccess',
      position: 'middle'
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }

  FailureToast(errorData) {
    let toast = this.toastCtrl.create({
      message: errorData,
      duration: 3000,
      cssClass: 'loginfailed',
      position: 'middle'
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }

  addDonorRegister() {
    // console.log(this.donorRegisterForm);
    // console.log("userName ::" + this.donorRegisterForm.value);
    let pass = this.donorRegisterForm.value.password;
    let confirmPass = this.donorRegisterForm.value.confirmPassword;
    if (this.imageName == null) {
      this.imageError = true;
      this.imageErrorMessage = "Please upload the image";
      setTimeout(() => {
        this.imageErrorMessage = "";
      }, 4000);       
    }
    if (pass === confirmPass) {
      this.isPassword = true;
    } else {
      this.isPassword = false;
      this.passwordError = "Password not Match";
      setTimeout(() => {
        this.passwordError = "";
      }, 4000);       
    }
    if (this.isPassword) {
      let loader = this.loadingCtrl.create({
        content: 'Please wait ...',
      });
      loader.present().then(() => {
        this.serverService.registerDonorService(this.donorRegisterForm.value, this.donorRegisterForm.value.dob.formatted,this.imageName)
          .subscribe(
            data => {
              console.log(data.status);
              loader.dismiss();
              if (data.status === 1) {
                this.successToast();
                this.donorRegisterForm.reset();
              } else if (data.status === "username invalid") {
                let errorData = "Username is exist";
                this.FailureToast(errorData);
              } else {
                let errorData = "Please fill the all information correctly";
                this.FailureToast(errorData);
              }

            },
            error => {
              loader.dismiss();
              this.navCtrl.push(OfflinePage); 
            });
      });
    }

  }
}