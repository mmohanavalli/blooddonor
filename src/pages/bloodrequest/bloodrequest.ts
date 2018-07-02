import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { register } from "../register_model";
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ServerService } from '../../app/server.service';
import { HomePage } from '../home/home';
import { Network } from '@ionic-native/network';
import { OfflinePage } from '../offline/offline';
import { IMyDpOptions } from 'mydatepicker';

@Component({
  selector: 'page-bloodrequest',
  templateUrl: 'bloodrequest.html',
})
export class BloodrequestPage {

  bloodRequestForm: FormGroup;

  selectedItem: any;
  public seekerRegister: register[];
  bloodGroups = ['A+', 'B+', 'AB+','O+', 'A-', 'B-', 'AB-', 'O-'];
  countries = ['India', 'Netherland'];
  errorData : string;
  seekerId: any;
  userInfo: any;
  isSeeker: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private serverService: ServerService, 
    private _cdr: ChangeDetectorRef, fb: FormBuilder,public loadingCtrl: LoadingController, private toastCtrl: ToastController,
    private network: Network) {      
    this.selectedItem = navParams.get('item');
    this.bloodRequestForm = fb.group({
      bloodgroup: [''],
      country: [''],
    });
    this.seekerId = sessionStorage.getItem('userID');
    this.userInfo = sessionStorage.getItem('userinfo');
    if (this.userInfo == 'Seeker') {
      this.isSeeker = true;
    } else {
      this.isSeeker = false;
    }
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

  goback() {
    this.navCtrl.setRoot(HomePage);
  }
  
  ngOnInit() {
    this.bloodRequestForm = new FormGroup({
      'bloodRequestData': new FormGroup({
        'name': new FormControl('', [Validators.required]),
        'age': new FormControl(null, [Validators.required]),
        'bloodgroup': new FormControl(null, [Validators.required]),
        'date': new FormControl(null, [Validators.required]),
        'units': new FormControl(null, [Validators.required]),
        'contactnumber': new FormControl(null, [Validators.required, Validators.minLength(10),Validators.maxLength(10)]),
        'state': new FormControl(null, [Validators.required]),
        'city': new FormControl(null, [Validators.required]),        
        'country': new FormControl('India', [Validators.required]),
        'purpose': new FormControl(null, [Validators.required])
      })
    });
  }

  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    // dateFormat: 'yyyy/mm/dd',
    dateFormat: 'mm-dd-yyyy',
  };

  onBloodGroupChange(): void {
    console.log("bloodgroup ::" + this.bloodRequestForm.value.bloodRequestData.bloodgroup);
  //  let bloodgroup = this.bloodRequestForm.value.bloodRequestData.bloodgroup;   
    this._cdr.detectChanges();
  }

  onCountryChange(): void {
  //  let bloodgroup = this.bloodRequestForm.value.bloodRequestData.country;
    this._cdr.detectChanges();
  } 

  successToast() {
    let toast = this.toastCtrl.create({
      message: 'Your request is added successfully',
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
  

  addBloodRequest() {
    console.log(this.bloodRequestForm);
    console.log("Country ::" + this.bloodRequestForm.value.bloodRequestData.country);
    let loader = this.loadingCtrl.create({
      content: 'Please wait ...',
    });
    loader.present().then(() => {
    this.serverService.bloodRequestService(this.bloodRequestForm.value , this.bloodRequestForm.value.bloodRequestData.date.formatted, this.seekerId)
      .subscribe(
        data => {
          loader.dismiss();
          if (data.status === 1) {
            this.successToast();
            this.bloodRequestForm.reset();
          } else {
            this.errorData = "Please fill the all information correctly";            
            this.FailureToast(this.errorData);        
          }

        },
        error => {
          loader.dismiss();
          this.navCtrl.push(OfflinePage);
        }
      );
    });
  }

}
