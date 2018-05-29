import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, NavParams, Platform, LoadingController } from 'ionic-angular';
import { GoogleMapsProvider } from '../../providers/google-maps/google-maps';
import { Geolocation, GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation';
import { HomePage } from '../home/home';
import { OfflinePage } from '../offline/offline';
import { Network } from '@ionic-native/network';
declare var google;

@Component({
  selector: 'page-nearestbloodbanks',
  templateUrl: 'nearestbloodbanks.html',
})

export class NearestbloodbanksPage {


  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;
  map: any;
  places: Array<any>;
  options: GeolocationOptions;
  currentPos: Geoposition;

  selectedItem: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public maps: GoogleMapsProvider, private geolocation: Geolocation,
    public platform: Platform, public loadingCtrl: LoadingController, private network: Network) {
    this.selectedItem = navParams.get('item');
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

  ionViewDidEnter() {
    let loader = this.loadingCtrl.create({
      content: 'Please wait ...',
    });
    
    loader.present().then(() => {
    this.getUserPosition();
    });

    loader.dismiss();
  }
  
  goback() {
    this.navCtrl.setRoot(HomePage);
  }

  getUserPosition() {

    this.options = {
      enableHighAccuracy: true
    };

    this.geolocation.getCurrentPosition(this.options).then((pos: Geoposition) => {

      this.currentPos = pos;
      console.log(pos);
      this.addMap(pos.coords.latitude, pos.coords.longitude);

    }, (err: PositionError) => {
      console.log("error : " + err.message);
      this.navCtrl.push(OfflinePage); 
    });
  }  

  addMap(lat, long) {

    let latLng = new google.maps.LatLng(lat, long);

    let mapOptions = {
      center: latLng,
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    this.getBloodBanks(latLng).then((results: Array<any>) => {
      this.places = results;
      for (let i = 0; i < results.length; i++) {
        this.createMarker(results[i]);
      }
    }, (status) => console.log(status));
    this.addMarker();

  }

  createMarker(place) {
    let marker = new google.maps.Marker({
      map: this.map,
      icon: {
        url: "assets/imgs/pin.png"
      },
      animation: google.maps.Animation.DROP,
      position: place.geometry.location

    });

    let content = "<p>This is your current position !</p>";
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.setContent('<div><strong>' + place.name + '</strong><br>' +
        place.vicinity + '</div>');
      infoWindow.open(this.map, marker);
    });

    console.log(marker);
  }

  getBloodBanks(latLng) {
   
    let request = {
      location: latLng,
      radius: 6000,
				name: "Blood bank",
      types: ['health,','establishment']      
    };

    var service = new google.maps.places.PlacesService(this.map);
    return new Promise((resolve, reject) => {
      service.nearbySearch(request, function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          resolve(results);
        } else {
          reject(status);
        }

      });
    });

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

    let content = "<p>This is your current position !</p>";
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });

  }  

}
