import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LatestEventPage } from '../pages/latestevent/latestevent';
import { LatestpostPage } from '../pages/latestpost/latestpost';
import { SplashPage } from '../pages/splash/splash';
import { NearesthospitalsPage } from '../pages/nearesthospitals/nearesthospitals';
import { NearestbloodbanksPage } from '../pages/nearestbloodbanks/nearestbloodbanks';
import { LauncherPage } from '../pages/launcher/launcher';
import { LatesteventdetailPage } from '../pages/latesteventdetail/latesteventdetail';
import { DonorlistPage } from '../pages/donorlist/donorlist';
import { DonordetailPage } from '../pages/donordetail/donordetail';
import { DonorregisterPage } from '../pages/donorregister/donorregister';
import { BloodrequestPage } from '../pages/bloodrequest/bloodrequest';
import { ServerService } from './server.service';
import { SeekeeregisterPage } from '../pages/seekerregister/seekerregister';
import { FormsModule } from '@angular/forms';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Camera } from '@ionic-native/camera';
import { ConnectivityProvider } from '../providers/connectivity/connectivity';
import { GoogleMapsProvider } from '../providers/google-maps/google-maps';
import { LocationsProvider } from '../providers/locations/locations';
import { Network } from '@ionic-native/network';
import { Geolocation } from '@ionic-native/geolocation';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LatestEventPage,
    LatestpostPage,
    SplashPage,
    NearesthospitalsPage,
    NearestbloodbanksPage,
    LauncherPage,
    LatesteventdetailPage,
    DonorlistPage,
    DonordetailPage,
    SeekeeregisterPage,
    DonorregisterPage,
    BloodrequestPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SplashPage,
    LatestEventPage,
    LatestpostPage,
    NearesthospitalsPage,
    NearestbloodbanksPage,
    LauncherPage,
    LatesteventdetailPage,
    DonorlistPage,
    DonordetailPage,
    DonorregisterPage,
    SeekeeregisterPage,
    BloodrequestPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ServerService,
    FileTransfer,
    FileTransferObject,
    File,
    Camera,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ConnectivityProvider,
    GoogleMapsProvider,
    ConnectivityProvider,
    LocationsProvider,
    Network,
    Geolocation
  ]
})
export class AppModule {}
