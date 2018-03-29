import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { events } from "../events_model";
import { ServerService } from '../../app/server.service';
import { LatestEventPage } from '../latestevent/latestevent';

@Component({
  selector: 'page-latesteventdetail',
  templateUrl: 'latesteventdetail.html',
})
export class LatesteventdetailPage implements OnInit {

  // selectedItem: any;
  eventId: any;
  public allEventsDetail: events[];


  constructor(public navCtrl: NavController, public navParams: NavParams, private serverService: ServerService) {
    // this.selectedItem = navParams.get('item');
    this.eventId = navParams.get('eventId');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LatesteventdetailPage');
  }

  ngOnInit() {
    this.getLatestEventsDetail();
  }

  convertDate(date) {

    let dateArray = date.split("-");
    let eventDate = dateArray[0];
    return eventDate;
  }

  convertMonth(month) {
    let monthName = "";
    if (month == 1) {
      monthName = "JAN"
    } else if (month == 2) {
      monthName = "FEB"
    } else if (month == 3) {
      monthName = "MAR"
    } else if (month == 4) {
      monthName = "APR"
    } else if (month == 5) {
      monthName = "MAY"
    } else if (month == 6) {
      monthName = "JUN"
    } else if (month == 7) {
      monthName = "JUL"
    } else if (month == 8) {
      monthName = "AUG"
    } else if (month == 9) {
      monthName = "SEP"
    } else if (month == 10) {
      monthName = "OCT"
    } else if (month == 11) {
      monthName = "NOV"
    } else if (month == 12) {
      monthName = "DEC"
    }
    return monthName;
  }

  convertYear(date) {

    let dateArray = date.split("-");
    let eventYear = dateArray[2]
    return eventYear;
  }

  //goto previous page
  goBack() {
    this.navCtrl.push(LatestEventPage);
  }

  getLatestEventsDetail() {
    this.serverService.getLatestEventsById(this.eventId)
      .subscribe(
        data => {
          this.allEventsDetail = data;
          console.log("title::" + this.allEventsDetail[0].Title);
        },
        error => {
          console.error("There is some error to get the data");
        }
      );
  }

}
