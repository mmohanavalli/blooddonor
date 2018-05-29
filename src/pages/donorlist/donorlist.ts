import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, ModalController } from 'ionic-angular';
import { ServerService } from '../../app/server.service';
import { DonordetailPage } from '../donordetail/donordetail';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HomePage } from '../home/home';
import { OfflinePage } from '../offline/offline';
import { Network } from '@ionic-native/network';
import { LoginPage } from '../login/login';


@Component({
  selector: 'page-donorlist',
  templateUrl: 'donorlist.html',
})
export class DonorlistPage {

  findDonorForm: FormGroup;
  selectedItem: any;
  donorList: any[];
  IMG_URL: String;
  bloodGroups = ['A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-'];
  countries = ['India', 'Netherland'];
  errorData: string;
  loginStatus: string;
  userLogin: boolean;
  pageName: string
  constructor(public navCtrl: NavController, public navParams: NavParams, private serverService: ServerService,
    private _cdr: ChangeDetectorRef, fb: FormBuilder, public loadingCtrl: LoadingController, public modalCtrl: ModalController, private toastCtrl: ToastController,
    private network: Network) {
    this.userLogin = false;
    this.pageName = "donorlist"
    this.selectedItem = navParams.get('item');
    this.loginStatus = sessionStorage.getItem('loginstatus');
    console.log(" loginStatus " + this.loginStatus);
    if (this.loginStatus != 'true') {
      // this.addLogin();
      this.userLogin = false;
    } else {
      this.userLogin = true;
    }
    this.IMG_URL = 'https://blooddonorspot.com/images/';
    this.findDonorForm = fb.group({
      bloodgroup: [''],
      country: [''],
    });
  }

  ionViewDidLoad() {
    this.network.onDisconnect().subscribe(data => {
      console.log("Network Status" + data.type);
      if (data.type == "offline") {
        console.log("offline page");
        this.navCtrl.push(OfflinePage);
      }
    }, error => console.error(error));
  }

  addLogin() {
    // let addWeatherModal = this.modalCtrl.create(LoginPage, { showBackdrop: true, enableBackdropDismiss: true });
    let addWeatherModal = this.modalCtrl.create(LoginPage, { name: this.pageName });
    addWeatherModal.onDidDismiss(data => {
      this.navCtrl.push(DonorlistPage);
      this.navCtrl.popToRoot();
    });
    addWeatherModal.present();
   
  }

  ngOnInit() {

    this.getDonorList();

    this.findDonorForm = new FormGroup({
      'findDonorData': new FormGroup({
        'bloodgroup': new FormControl(null, [Validators.required]),
        'city': new FormControl(null, [Validators.required]),
        'country': new FormControl(null, [Validators.required])
      })
    });
  }

  convertDate(date) {
    let dateArray = date.split("-");
    let newDate = dateArray[0] + "." + dateArray[1] + "." + dateArray[2];
    return newDate;
  }

  getBloodGroup(bloodGroup) {
    let group = bloodGroup.slice(-1);
    if (group == "+") {
      group = bloodGroup.substring(0, bloodGroup.length - 1);
      group = group + " positive";
    } else {
      group = bloodGroup.substring(0, bloodGroup.length - 1);
      group = group + " negative";
    }
    return group;
  }

  onBloodGroupChange(): void {
    //  let bloodgroup = this.findDonorForm.value.findDonorData.bloodgroup;   
    this._cdr.detectChanges();
  }

  onCountryChange(): void {
    //  let bloodgroup = this.findDonorForm.value.findDonorData.country;
    this._cdr.detectChanges();
  }

  getDonorList() {
    let loader = this.loadingCtrl.create({
      content: 'Please wait ...',
    });
    loader.present().then(() => {
      this.serverService.getDonorList()
        .subscribe(
          data => {
            loader.dismiss();
            this.donorList = data;
            // console.log("title::" + this.donorList[0].Title);
          },
          error => {
            loader.dismiss();
            console.error("There is some error to get the data");
            this.navCtrl.push(OfflinePage);
          }
        );
    });
  }

  gotoDonorDetailPage(donorId) {
    this.navCtrl.push(DonordetailPage, {
      donorId: donorId
    });
  }

  goback() {
    this.navCtrl.setRoot(HomePage);
  }

  findBloodDonors() {

    let loader = this.loadingCtrl.create({
      content: 'Please wait ...',
    });
    loader.present().then(() => {

      let bloodGroup = this.findDonorForm.value.findDonorData.bloodgroup;

      if (this.findDonorForm.value.findDonorData.bloodgroup != undefined) {

        let updatedBloodGroup = this.findDonorForm.value.findDonorData.bloodgroup;
        bloodGroup = bloodGroup.slice(-1);
        if (bloodGroup == "+") {
          bloodGroup = updatedBloodGroup.substring(0, updatedBloodGroup.length - 1);
          bloodGroup = bloodGroup + "%2B";
        } else {
          bloodGroup = updatedBloodGroup.substring(0, updatedBloodGroup.length - 1);
          bloodGroup = bloodGroup + "%2D";
        }
      }
      if (bloodGroup != undefined || this.findDonorForm.value.findDonorData.country != undefined
        || this.findDonorForm.value.findDonorData.city != undefined) {

        this.serverService.getFindDonor(this.findDonorForm.value, bloodGroup)
          .subscribe(
            data => {

              this.donorList = data;
              if (this.donorList.length == 0) {
                loader.dismiss();
                this.errorData = "Searching content is not available, search again!";
                this.FailureToast(this.errorData);
              }
            },
            error => {
              loader.dismiss();
              this.errorData = "There is some error to get the data";
              this.FailureToast(this.errorData);
            }
          );
      }
      else {
        loader.dismiss();
        this.errorData = "Please fill the all information correctly";
        this.FailureToast(this.errorData);
      }
    });
  }

  FailureToast(errorData) {
    let toast = this.toastCtrl.create({
      message: errorData,
      duration: 6000,
      position: 'middle'
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }

}
