import { Component, OnInit } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { DonorlistPage } from '../donorlist/donorlist';
import { DonorregisterPage } from '../donorregister/donorregister';
import { ServerService } from '../../app/server.service';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage implements OnInit { 

  donorData: any[];
  seekerData: any[];

  IMG_URL :String;

  constructor(public navCtrl: NavController, private serverService: ServerService) {
    this.IMG_URL = 'https://blooddonorspot.com/images/register/thumb_img/';
  }

  ngOnInit() {
    this.getRecentDonors();
    this.getRecentSeekers();
  }

  gotoDonorListPage() {
    this.navCtrl.push(DonorlistPage);
  }

  gotoDonorRegisterPage() {
    this.navCtrl.push(DonorregisterPage);
  }

  convertDate(date){
    let dateArray=date.split("-");
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
        }
      );
  }
}
