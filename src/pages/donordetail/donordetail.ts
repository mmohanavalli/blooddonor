import { Component, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Events, NavController, NavParams, LoadingController, AlertController, ModalController, ToastController } from 'ionic-angular';
import { ServerService } from '../../app/server.service';
import { DonorlistPage } from '../donorlist/donorlist';
import { OfflinePage } from '../offline/offline';
import { Network } from '@ionic-native/network';
import { CallNumber } from '@ionic-native/call-number';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { GeolocationOptions, Geoposition } from '@ionic-native/geolocation';
import { SendmailPage } from '../sendmail/sendmail';

declare var google;

@Component({
  selector: 'page-donordetail',
  templateUrl: 'donordetail.html',
})
export class DonordetailPage {

  @ViewChild('map') mapElement: ElementRef;

  rate: any;
  donorId: any;
  donorDetailInfo: any[];
  IMG_URL: String;
  reviewForm: FormGroup;
  donorName: any;
  map: any;
  places: Array<any>;
  options: GeolocationOptions;
  currentPos: Geoposition;
  public latitude: any;
  public longitude: any;
  userToEmail: any;
  seekerEmail: any;
  seekerName: any;
  donor_id: any;
  seekerId: any;
  geocoder: any;
  isSeeker: boolean;
  userInfo: any;
  captchaValue: any;
  captchaWord: any;
  noData: any;
  isContactData: boolean;
  errorData: any;
  captchaImageURL : any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private serverService: ServerService,
    public loadingCtrl: LoadingController, private network: Network, public callNumber: CallNumber,
    private fb: FormBuilder, public events: Events, private alertCtrl: AlertController,
    private _cdr: ChangeDetectorRef, public modalCtrl: ModalController, public toastCtrl: ToastController,
  ) {
    this.donorId = navParams.get('id');
    this.donor_id = navParams.get('donorId');
    this.seekerEmail = sessionStorage.getItem('userEmail');
    this.seekerName = sessionStorage.getItem('name');
    this.seekerId = sessionStorage.getItem('userID');
    this.userInfo = sessionStorage.getItem('userinfo');
    if (this.userInfo == 'Seeker') {
      this.isSeeker = true;
    } else {
      this.isSeeker = false;
    }

    this.IMG_URL = 'https://blooddonorspot.com/images/';
    console.log("donorId ::" + this.donorId);
    this.getDonorDetail();
    this.getCaptcha();
    this.createForm();
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

  ionViewWillEnter() {

  }

  onModelChange(event): void {
    console.log("event::" + event)
    this._cdr.detectChanges();
  }

  gotoSendEmailPage() {
    this.navCtrl.push(SendmailPage);
  }

  presentMail() {
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
            let addWeatherModal = this.modalCtrl.create(SendmailPage, { showBackdrop: true, enableBackdropDismiss: true },
              {
                cssClass: 'donor-det-modal'
              }
            );
            addWeatherModal.present();
          }
        }

      ]
    });
    alert.present();
  }

  createForm() {
    this.reviewForm = this.fb.group({
      name: new FormControl({ value: this.seekerName, disabled: true }, [Validators.required]),
      email: new FormControl({ value: this.seekerEmail, disabled: true }, [Validators.required]),
      ratings: new FormControl(null, [Validators.required]),
      review: new FormControl(null, [Validators.required]),
      userCaptcha: new FormControl(null, [Validators.required])

    });
  }

  getCaptcha() {
    this.serverService.getCaptcha()
      .subscribe(
        data => {
          this.captchaWord = data;
          this.captchaImageURL ='https://blooddonorspot.com/captcha/captcha_contact/' + this.captchaWord.filename;
          this.captchaValue = this.captchaWord.word
          console.log( this.captchaImageURL);
          if (data.length == 0) {
            this.noData = true;
          }
        },
        error => {
          console.error("There is some error to get the data");
        }
      );
  }

  getDonorDetail() {
    let loader = this.loadingCtrl.create({
      content: 'Please wait ...',
    });
    loader.present().then(() => {
      this.serverService.getDonorDetailById(this.donorId)
        .subscribe(
          data => {
            loader.dismiss();
            this.donorDetailInfo = data;
            this.donorName = this.donorDetailInfo[0].Name;
            this.userToEmail = this.donorDetailInfo[0].Email;
            sessionStorage.setItem('toEmail', this.userToEmail);
            this.getLatLng(this.donorDetailInfo[0].City, this.donorDetailInfo[0].State, this.donorDetailInfo[0].Country);
          },
          () => {
            loader.dismiss();
            console.error("There is some error to get the data");
            this.navCtrl.push(OfflinePage);
          }
        );
    });
  }

  goBack() {
    this.navCtrl.push(DonorlistPage);
  }

  successToast() {
    let toast = this.toastCtrl.create({
      message: 'Thank you for to submitted the review',
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

  review() {
    console.log("userCaptcha ::" + this.reviewForm.value.userCaptcha);
    if (this.captchaValue != this.reviewForm.value.userCaptcha) {
      this.isContactData = false;
      this.errorData = "Please enter the correct captcha";
      this.FailureToast(this.errorData);
    } else {
      this.isContactData = true;
    }
    if (this.isContactData) {
      let loader = this.loadingCtrl.create({
        content: 'Please wait ...',
      });
      loader.present().then(() => {
        this.serverService.sendreview(this.reviewForm.value, this.seekerId, this.donor_id)
          .subscribe(
            data => {
              loader.dismiss();
              if (data.status === "1") {
                this.successToast();
              } else {
                let errorData = "There is some error to submit the review, Please fill all informations";
                this.FailureToast(errorData);
              }

            },
            () => {
              loader.dismiss();
              this.navCtrl.push(OfflinePage);
            }
          );
      });
    }
  }


  getLatLng(city, state, country) {

    this.geocoder = new google.maps.Geocoder;
    let address = city + ' ' + state + ',  ' + country;

    this.geocoder.geocode({ 'address': address }, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        this.latitude = results[0].geometry.location.lat();
        this.longitude = results[0].geometry.location.lng();
        this.addMap(this.latitude, this.longitude);
      }
    });

  }


  addMap(lat, lng) {
    let latLng = new google.maps.LatLng(lat, lng);

    let mapOptions = {
      center: latLng,
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.addMarker();

  }

  addMarker() {

    let marker = new google.maps.Marker({
      map: this.map,
      icon: {
        url: "assets/imgs/pin.png"
      },
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });

    let content = this.donorName;
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });

  }
}
