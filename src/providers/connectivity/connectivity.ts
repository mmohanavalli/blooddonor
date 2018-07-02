import { Network } from '@ionic-native/network';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

/*
  Generated class for the ConnectivityProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

declare var Connection;

@Injectable()
export class ConnectivityProvider {

  onDevice: boolean;
 
  constructor(public platform: Platform, private network: Network){
    this.onDevice = this.platform.is('cordova');
  }
 
  isOnline(): boolean {
    if(this.onDevice && this.network.onConnect){
      return this.network.onConnect !== Connection.NONE;
    } else {
      return navigator.onLine;
    }
  }
 
  isOffline(): boolean {
    if(this.onDevice && this.network.onDisconnect){
      return this.network.onDisconnect === Connection.NONE;
    } else {
      return !navigator.onLine;  
    }
  }
}
