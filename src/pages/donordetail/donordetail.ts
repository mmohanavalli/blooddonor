import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { ServerService } from '../../app/server.service';
import { DonorlistPage } from '../donorlist/donorlist';
import { OfflinePage } from '../offline/offline';
import { Network } from '@ionic-native/network';

@Component({
  selector: 'page-donordetail',
  templateUrl: 'donordetail.html',
})
export class DonordetailPage implements OnInit{

  // selectedItem: any;
  donorId: any;
  donorDetailInfo: any[];
  IMG_URL :String;

  constructor(public navCtrl: NavController, public navParams: NavParams, private serverService: ServerService, 
    public loadingCtrl: LoadingController, private network: Network) {
    // this.selectedItem = navParams.get('item');
    this.donorId = navParams.get('donorId');
    this.IMG_URL = 'https://blooddonorspot.com/images/';
    console.log("donorId ::"+this.donorId) ;
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
    this.getDonorDetail();
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
          console.log("title::" + this.donorDetailInfo[0].Age);
        },
        error => {
          loader.dismiss();
          console.error("There is some error to get the data");
          this.navCtrl.push(OfflinePage); 
        }
      );
    });
  }

  goBack(){
    this.navCtrl.push(DonorlistPage);
  }

}
