import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { ServerService } from '../../app/server.service';
import { register } from "../register_model";
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Network } from '@ionic-native/network';
import { OfflinePage } from '../offline/offline';

@Component({
  selector: 'page-seekerregister',
  templateUrl: 'seekerregister.html',
})
export class SeekeeregisterPage {

  seekerRegisterForm: FormGroup;
  isPassword: boolean;
  passwordError : string;
  numberError : string;
  isNumber : boolean;

  selectedItem: any;
  public seekerRegister: register[];
  countries = ['India', 'Netherland'];

  constructor(public navCtrl: NavController, public navParams: NavParams, private serverService: ServerService,
    private _cdr: ChangeDetectorRef, fb: FormBuilder, private toastCtrl: ToastController, public loadingCtrl: LoadingController, 
    private network: Network) {
    this.isPassword = false;
    this.isNumber = false;
    this.selectedItem = navParams.get('item');
    this.seekerRegisterForm = fb.group({
      country: [''],
    });
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

  ngOnInit() {
    this.seekerRegisterForm = new FormGroup({
      'seekerData': new FormGroup({
        'name': new FormControl(null, [Validators.required]),
        'username': new FormControl(null, [Validators.required]),
        'password': new FormControl(null, [Validators.required]),
        'confirmPassword': new FormControl(null, [Validators.required]),
        'state': new FormControl(null, [Validators.required]),
        'city': new FormControl(null, [Validators.required]),
        'contactnumber': new FormControl(null, [Validators.required, Validators.minLength(10),Validators.maxLength(10)]),
        'email': new FormControl(null, [Validators.required, Validators.email]),
        'country': new FormControl(null, [Validators.required]),
      })
    });
  }


  onCountryChange(): void {
  //  let country = this.seekerRegisterForm.value.seekerData.country;
    this._cdr.detectChanges();
  }
  
  onContactNumberChange(event){
    let regExp = /^[0-9]/;

    if (!regExp.test(event.value)) {
      this.isNumber = true;
      this.numberError ="Please enter number only";    
    }else{
      this.isNumber = false;
    }    
  }

  successToast() {
    let toast = this.toastCtrl.create({
      message: 'User added successfully',
      duration: 6000,
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
      duration: 6000,
      position: 'middle'
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }  

  addSeekerRegister() {
    let pass = this.seekerRegisterForm.value.seekerData.password;
    let confirmPass = this.seekerRegisterForm.value.seekerData.confirmPassword;

    if (pass === confirmPass) {
      this.isPassword = true;
    } else {
      this.isPassword = false;
      this.passwordError = "Password not Match";
    }
    if(this.isPassword){
      let loader = this.loadingCtrl.create({
        content: 'Please wait ...',
      });
      loader.present().then(() => {
    this.serverService.registerSeekerService(this.seekerRegisterForm.value)
      .subscribe(        
        data => {
          loader.dismiss();
          if (data.status === 1) {
            this.successToast();
          } else if (data.status === "username invalid") {
            let errorData = "Username is exist";            
            this.FailureToast(errorData);                 
          }else{
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
