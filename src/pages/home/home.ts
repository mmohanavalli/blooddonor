import { Component, OnInit } from '@angular/core';
import { NavController, IonicPage, LoadingController, AlertController, ToastController, ModalController, ViewController, PopoverController } from 'ionic-angular';
import { DonorlistPage } from '../donorlist/donorlist';
import { DonorregisterPage } from '../donorregister/donorregister';
import { ServerService } from '../../app/server.service';
import { LoginPage } from '../login/login';
import { Network } from '@ionic-native/network';
import { OfflinePage } from '../offline/offline';
import { PanicPage } from '../panic/panic';
import { PopoverPage } from '../popover/popover';
import { Events } from 'ionic-angular';
import { LatestpostPage } from '../latestpost/latestpost';


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
  userInfo: any
  showSeekerProfile: boolean;
  showDonorProfile: boolean;
  isSeeker: boolean;
  // isOpen: boolean;
  // isPopOver: any;
  IMG_URL: String;
  isLogin: boolean;
  showRegisterNotLogin: boolean;
  className : any;

  constructor(public navCtrl: NavController, private serverService: ServerService,
    public loadingCtrl: LoadingController, public toastCtrl: ToastController,
    private alertCtrl: AlertController, public modalCtrl: ModalController,
    public popoverCtrl: PopoverController, public viewCtrl: ViewController,
    public events: Events, private network: Network) {
    this.IMG_URL = 'https://blooddonorspot.com/images/register/thumb_img/';
    this.viewCtrl.dismiss();
    // this.isOpen = false;
    // this.isPopOver = true;
    this.isLogin = true;
    this.isSeeker = true;
    this.className = 'hme_grid'
    this.showRegisterNotLogin = true;    
  }

  ionViewWillEnter() {
    this.loginInfo = sessionStorage.getItem('loginstatus')
    this.userInfo = sessionStorage.getItem('userinfo')
    console.log ("loginInfo "+this.loginInfo);
    if(this.loginInfo == null || this.loginInfo == 'false'){
      this.isLogin = true;  
      this.isSeeker = true;      
      this.className = 'hme_grid'
      this.showRegisterNotLogin = true;   
    }else{   
     this.isLogin = false;
     if(this.userInfo == 'Seeker'){
      this.className = 'hme_grid hme_seeker'
      this.isSeeker = true;
     }else if(this.userInfo == 'Donor'){
      this.className = 'hme_grid hme_donor'
      this.isSeeker = false;
     }    
     this.showRegisterNotLogin = false; 
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

  presentPopover(myEvent) {
    // if (open) {
    //   this.isPopOver = false;
    // }
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present({
      ev: myEvent,    
    });
    
    popover.onDidDismiss(() => {
      popover.dismiss;
      // this.isPopOver = true;
      this.ionViewWillEnter(); 
      popover = null;
    });
  }

  addLogin() {
    let loginCtrl = this.modalCtrl.create(LoginPage, { showBackdrop: true, enableBackdropDismiss: true });
    loginCtrl.onDidDismiss(() => {
      this.ionViewWillEnter();    
    });
    loginCtrl.present();
  }

  gotoDonorListPage() {
    this.navCtrl.push(DonorlistPage);
  }

  gotoSeekerListPage() {
    this.navCtrl.push(LatestpostPage);
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
          console.error("There is some error to get the data" + error);
          //  this.navCtrl.push(OfflinePage);
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
          console.error("There is some error to get the data" + error);
          // this.navCtrl.push(OfflinePage);
        }
      );
  }
}
