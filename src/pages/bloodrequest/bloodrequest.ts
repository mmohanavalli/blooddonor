import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { register } from "../register_model";
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ServerService } from '../../app/server.service';


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

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public navParams: NavParams, private serverService: ServerService, 
    private _cdr: ChangeDetectorRef, fb: FormBuilder) {      
    this.selectedItem = navParams.get('item');
    this.bloodRequestForm = fb.group({
      bloodgroup: [''],
      country: [''],
    });
  }  

  ionViewDidLoad() {
    console.log('ionViewDidLoad Blood request page');
  } 

  ngOnInit() {
    this.bloodRequestForm = new FormGroup({
      'bloodRequestData': new FormGroup({
        'name': new FormControl('', [Validators.required]),
        'age': new FormControl(null, [Validators.required]),
        'bloodgroup': new FormControl(null, [Validators.required]),
        'date': new FormControl(null, [Validators.required]),
        'units': new FormControl(null, [Validators.required]),
        'contactnumber': new FormControl(null, [Validators.required]),
        'state': new FormControl(null, [Validators.required]),
        'city': new FormControl(null, [Validators.required]),        
        'country': new FormControl(null, [Validators.required]),
        'purpose': new FormControl(null, [Validators.required])
      })
    });
  }

  onBloodGroupChange(): void {
    console.log("bloodgroup ::" + this.bloodRequestForm.value.bloodRequestData.bloodgroup);
    let bloodgroup = this.bloodRequestForm.value.bloodRequestData.bloodgroup;   
    this._cdr.detectChanges();
  }

  onCountryChange(): void {
    let bloodgroup = this.bloodRequestForm.value.bloodRequestData.country;
    this._cdr.detectChanges();
  }

  successAlert() {
    let alert = this.alertCtrl.create({
      title: 'Blood Request',
      subTitle: 'Your request is added successfully',
      buttons: ['ok']
    });
    alert.present();
  }

  failureAlert() {
    let alert = this.alertCtrl.create({
      title: 'Blood Request',
      subTitle: 'error',
      buttons: ['ok']
    });
    alert.present();
  }
  

  addBloodRequest() {
    console.log(this.bloodRequestForm);
    console.log("Country ::" + this.bloodRequestForm.value.bloodRequestData.country);
    this.serverService.bloodRequestService(this.bloodRequestForm.value)
      .subscribe(
        data => {
          console.log(data.status);
          if (data.status === 1) {
            console.log(data.status);
            setTimeout(() => {
             this.successAlert();
            }, 5000);
          } else {
            this.failureAlert()
            setTimeout(() => {
              this.failureAlert();                 
            }, 5000);
          }

        },
        error => {
          console.log(error);
        }
      );
  }

}
