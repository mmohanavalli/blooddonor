import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { ServerService } from '../../app/server.service';
import { DonordetailPage } from '../donordetail/donordetail';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';


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

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private serverService: ServerService,
    private _cdr: ChangeDetectorRef, fb: FormBuilder) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
    this.IMG_URL = 'https://blooddonorspot.com/images/';
    this.findDonorForm = fb.group({
      bloodgroup: [''],
      country: [''],
    });
  }

  ionViewDidLoad() {
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
    let bloodgroup = this.findDonorForm.value.findDonorData.bloodgroup;   
    this._cdr.detectChanges();
  }

  onCountryChange(): void {
    let bloodgroup = this.findDonorForm.value.findDonorData.country;
    this._cdr.detectChanges();
  }

  getDonorList() {
    this.serverService.getDonorList()
      .subscribe(
        data => {
          this.donorList = data;
          // console.log("title::" + this.donorList[0].Title);
        },
        error => {
          console.error("There is some error to get the data");
        }
      );
  }

  gotoLatestEventDetailPage(donorId) {
    this.navCtrl.push(DonordetailPage, {
      donorId: donorId
    })

  }

  findBloodDonors() {
    console.log("Country ::" + this.findDonorForm.value.findDonorData.bloodgroup);
    console.log("city ::" + this.findDonorForm.value.findDonorData.city);
    console.log("city ::" + this.findDonorForm.value.findDonorData.country);

    let bloodGroup = this.findDonorForm.value.findDonorData.bloodgroup;

    if(this.findDonorForm.value.findDonorData.bloodgroup !=undefined){
    
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
    if(bloodGroup !=undefined || this.findDonorForm.value.findDonorData.country !=undefined 
      || this.findDonorForm.value.findDonorData.city !=undefined){
  
        this.serverService.getFindDonor(this.findDonorForm.value, bloodGroup)
      .subscribe(
        data => {
          this.donorList = data;
          if(this.donorList.length == 0){
            setTimeout(() => {
              this.successAlert();
             }, 5000);
          }
        },
        error => {
          console.error("There is some error to get the data");
        }
      );   
    }else{
      setTimeout(() => {
        this.failureAlert();
       }, 5000);
    }
  }

  successAlert() {
    let alert = this.alertCtrl.create({
      title: 'Find Donors',
      subTitle: 'Searching content is not available, search again!',
      buttons: ['ok']
    });
    alert.present();
  }

  failureAlert() {
    let alert = this.alertCtrl.create({
      title: 'Find Donors',
      subTitle: 'Please select any one for to search data',
      buttons: ['ok']
    });
    alert.present();
  }

}
