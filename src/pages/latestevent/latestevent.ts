import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, IonicPage, LoadingController } from 'ionic-angular';
import { ServerService } from '../../app/server.service';
import { events } from "../events_model";
import { LatesteventdetailPage } from '../latesteventdetail/latesteventdetail';
import { HomePage } from '../home/home';
import { OfflinePage } from '../offline/offline';
import { Network } from '@ionic-native/network';

@IonicPage()

@Component({
  selector: 'page-latestevent',
  templateUrl: 'latestevent.html',
})

export class LatestEventPage implements OnInit { 
  
  selectedItem: any;
  public allEvents: events[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private serverService: ServerService,
    public loadingCtrl: LoadingController, private network: Network) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
  }

  ngOnInit() {
    this.getLatestEventsList();
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

  goback() {
    this.navCtrl.setRoot(HomePage);
  }

  convertDate(date){

    let dateArray=date.split("-");
    let eventDate = dateArray[0];    
    return eventDate ;
  }

  convertMonth(month){    
    let monthName = "";
    if(month == 1){
      monthName = "JAN"
    }else if(month == 2){
      monthName = "FEB"
    }else if(month == 3){
      monthName = "MAR"
    }else if(month == 4){
      monthName = "APR"
    }else if(month == 5){
      monthName = "MAY"
    }else if(month == 6){
      monthName = "JUN"
    }else if(month == 7){
      monthName = "JUL"
    }else if(month == 8){
      monthName = "AUG"
    }else if(month == 9){
      monthName = "SEP"
    }else if(month == 10){
      monthName = "OCT"
    }else if(month == 11){
      monthName = "NOV"
    }else if(month == 12){
      monthName = "DEC"
    }    
    return  monthName ;
  }  

  getLatestEventsList() {
    let loader = this.loadingCtrl.create({
      content: 'Please wait ...',
    });
    loader.present().then(() => {
    this.serverService.getLatestEvents()
      .subscribe(
        data => {
          loader.dismiss();
          this.allEvents = data;
          console.log("title::" + this.allEvents[0].Title);
        },
        error => {
          loader.dismiss();
          console.error("There is some error to get the data");
          this.navCtrl.push(OfflinePage); 
        }
      );
    });
  }

  gotoLatestEventDetailPage(eventId) {
    this.navCtrl.push(LatesteventdetailPage, {
      eventId: eventId
    })

  }

}
