import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { ServerService } from '../../app/server.service';
import { HomePage } from '../home/home';
import { OfflinePage } from '../offline/offline';
import { Network } from '@ionic-native/network';

/**
 * Generated class for the LatestpostPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-latestpost',
  templateUrl: 'latestpost.html',
})
export class LatestpostPage {

  selectedItem: any;
  postList: any[];
  imagePath : any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private serverService: ServerService,
    public loadingCtrl: LoadingController, private network: Network) {
    this.selectedItem = navParams.get('item');
  }
 

  ngOnInit() {
    this.getLatestPost();
  }

  goback() {
    this.navCtrl.setRoot(HomePage);
  }
  
  convertDate(date) {
    let dateArray = date.split("/");
    let newDate = dateArray[0] + "." + dateArray[1] + "." + dateArray[2];
    return newDate;
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

  getLatestPost() {
    let loader = this.loadingCtrl.create({
      content: 'Please wait ...',
    });
    loader.present().then(() => {
    this.serverService.getLatestPostList()
      .subscribe(
        data => {
          loader.dismiss();
          this.postList = data;
          // console.log("title::" + this.donorList[0].Title);
        },
        error => {
          loader.dismiss();
          console.error("There is some error to get the data");
          this.navCtrl.push(OfflinePage); 
        }
      );
    });
  }

  getBloodGroupImage(bloodGroup){
    if(bloodGroup == "A-"){
      this.imagePath = 'assets/imgs/a-.png';
    }else if(bloodGroup == "A+"){
      this.imagePath = 'assets/imgs/a+.png';
    }else if(bloodGroup == "AB-"){
      this.imagePath = 'assets/imgs/ab-.png';
    }else if(bloodGroup == "AB+"){
      this.imagePath = 'assets/imgs/ab+.png';
    }else if(bloodGroup == "B-"){
      this.imagePath = 'assets/imgs/b-.png';
    }else if(bloodGroup == "B+"){
      this.imagePath = 'assets/imgs/b+.png';
    }else if(bloodGroup == "O-"){
      this.imagePath = 'assets/imgs/o-.png';
    }else if(bloodGroup == "O+"){
      this.imagePath = 'assets/imgs/o+.png';
    }

    return this.imagePath;

  }
}
