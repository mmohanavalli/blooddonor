import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { GoogleMapsProvider } from '../../providers/google-maps/google-maps';
import { Geolocation, GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation';
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
    public platform: Platform) {
    this.selectedItem = navParams.get('item');
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
    });
  }

  ionViewDidEnter() {
    this.getUserPosition();
  }

  addMap(lat, long) {

    let latLng = new google.maps.LatLng(lat, long);

    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    this.getRestaurants(latLng).then((results: Array<any>) => {
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

  getRestaurants(latLng) {
    var service = new google.maps.places.PlacesService(this.map);
    let request = {
      location: latLng,
      radius: 5000,
      types: ["bloodbank"]
    };
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

  // ionViewDidLoad(){

  //   this.platform.ready().then(() => {

  //       let mapLoaded = this.maps.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement);

  //   });

  // }

}
