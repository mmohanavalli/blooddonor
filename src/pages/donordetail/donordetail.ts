import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ServerService } from '../../app/server.service';
import { DonorlistPage } from '../donorlist/donorlist';

/**
 * Generated class for the DonordetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-donordetail',
  templateUrl: 'donordetail.html',
})
export class DonordetailPage implements OnInit{

  // selectedItem: any;
  donorId: any;
  donorDetailInfo: any[];
  IMG_URL :String;

  constructor(public navCtrl: NavController, public navParams: NavParams, private serverService: ServerService) {
    // this.selectedItem = navParams.get('item');
    this.donorId = navParams.get('donorId');
    this.IMG_URL = 'https://blooddonorspot.com/images/';
    console.log("donorId ::"+this.donorId) ;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DonordetailPage');
  }

  ngOnInit() {
    this.getDonorDetail();
  }

  getDonorDetail() {
    this.serverService.getDonorDetailById(this.donorId)
      .subscribe(
        data => {
          this.donorDetailInfo = data;
          console.log("title::" + this.donorDetailInfo[0].Age);
        },
        error => {
          console.error("There is some error to get the data");
        }
      );
  }

  goBack(){
    this.navCtrl.push(DonorlistPage);
  }

}
