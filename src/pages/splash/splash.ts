import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
  selector: 'page-splash',
  templateUrl: 'splash.html',
})
export class SplashPage {

  selectedItem: any;
  constructor(public viewCtrl: ViewController, public splashScreen: SplashScreen) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SplashPage');
  }

  ionViewDidEnter() {

    this.splashScreen.hide();

    setTimeout(() => {
      this.viewCtrl.dismiss();
    }, 4000);

  }

}
