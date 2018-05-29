import { Component, OnInit } from '@angular/core';
import { NavController, IonicPage, LoadingController, AlertController, ToastController, ModalController, ViewController } from 'ionic-angular';
import { DonorlistPage } from '../donorlist/donorlist';
import { DonorregisterPage } from '../donorregister/donorregister';
import { ServerService } from '../../app/server.service';
import { LoginPage } from '../login/login';
import { Network } from '@ionic-native/network';
import { OfflinePage } from '../offline/offline';
import { PanicPage } from '../panic/panic';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage implements OnInit {

  donorData: any[];
  seekerData: any[];
  loginIcon: boolean;
  loginInfo: any;

  IMG_URL: String;

  constructor(public navCtrl: NavController, private serverService: ServerService,
    public loadingCtrl: LoadingController, public toastCtrl: ToastController,
    private alertCtrl: AlertController, public modalCtrl: ModalController, public viewCtrl: ViewController, private network: Network) {
    this.IMG_URL = 'https://blooddonorspot.com/images/register/thumb_img/';
    this.loginInfo = sessionStorage.getItem('loginstatus')
    // if(this.loginInfo == 'true'){
    //   this.loginIcon = false;
    // }else{
    //   this.loginIcon = true;
    // }
  }

  ionViewWillEnter() {
    if (this.loginInfo == 'true') {
      this.loginIcon = false;
    } else {
      this.loginIcon = true;
    }
  }

  ngOnInit() {
    let loader = this.loadingCtrl.create({
      content: 'Please wait ...',
    });
    loader.present().then(() => {
      this.getRecentDonors();
      this.getRecentSeekers();
      loader.dismiss();
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

  ionViewDidEnter() {
    this.network.onConnect().subscribe(data => {
      console.log("Network Status" + data)
    }, error => console.error(error));
  }

  logout() {
    sessionStorage.setItem('loginstatus', 'false');
    this.loginIcon = true;
    console.log("getItem" + sessionStorage.getItem('loginstatus'));
  }

  presentPanic() {
    let alert = this.alertCtrl.create({
      cssClass: 'panic_alert',
      message: 'Are you sure to send a emergency message to your important contacts?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'cancel_btn',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Okey',
          cssClass: 'ok_btn',
          handler: () => {
            console.log('Panic clicked');

            let addWeatherModal = this.modalCtrl.create(PanicPage, { showBackdrop: true, enableBackdropDismiss: true });
            addWeatherModal.present();
          }
        }

      ]
    });
    alert.present();
  }

  successToast() {
    let toast = this.toastCtrl.create({
      message: 'Information sent successfully',
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


  addLogin() {
    let loginCtrl = this.modalCtrl.create(LoginPage, { showBackdrop: true, enableBackdropDismiss: true });
    loginCtrl.onDidDismiss(() => {
      this.ionViewWillEnter();
    });
    loginCtrl.present();
  }

  presentLogin() {
    let alert = this.alertCtrl.create({
      title: 'User Login',
      cssClass: 'loginform',
      inputs: [
        {
          name: 'username',
          placeholder: 'E-mail or Username'
        },
        {
          name: 'password',
          placeholder: 'Password',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'closebtn',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Login',
          cssClass: 'loginebtn',
          handler: data => {
            // if (User.isValid(data.username, data.password)) {
            //   logged in!
            // } else {
            //   invalid login
            //   return false;
            // }
            return false;
          }
        }
      ]


    });
    alert.present();
  }

  gotoDonorListPage() {
    this.navCtrl.push(DonorlistPage);
  }

  gotoDonorRegisterPage() {
    this.navCtrl.push(DonorregisterPage);
  }

  convertDate(date) {
    let dateArray = date.split("-");
    let newDate = dateArray[0] + "." + dateArray[1] + "." + dateArray[2];
    return newDate;
  }

  getRecentDonors() {
    this.serverService.getRecentDonorsService()
      .subscribe(
        data => {
          this.donorData = data;
        },
        error => {
          console.error("There is some error to get the data");
          this.navCtrl.push(OfflinePage);
        }
      );
  }
  getRecentSeekers() {
    this.serverService.getRecentSeekersService()
      .subscribe(
        data => {
          this.seekerData = data;
        },
        error => {
          console.error("There is some error to get the data");
          this.navCtrl.push(OfflinePage);
        }
      );
  }
}
