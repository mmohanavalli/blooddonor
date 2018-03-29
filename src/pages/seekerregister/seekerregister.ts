import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ServerService } from '../../app/server.service';
import { register } from "../register_model";
// import { FormControl,FormBuilder,FormGroup,Validators,FormArray } from '@angular/forms';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'page-seekerregister',
  templateUrl: 'seekerregister.html',
})
export class SeekeeregisterPage {

  seekerRegisterForm: FormGroup;

  selectedItem: any;
  public seekerRegister: register[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private serverService: ServerService
  ) {
    this.selectedItem = navParams.get('item');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DoctoregisterPage');
  }

  ngOnInit() {
    this.seekerRegisterForm = new FormGroup({
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
      })
    });
  }

  addSeekerRegister() {
    console.log(this.seekerRegisterForm);
    console.log("userName ::" + this.seekerRegisterForm.value.seekerData.email);
    this.serverService.registerSeekerService(this.seekerRegisterForm.value)
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
