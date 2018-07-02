import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { LatestEventPage } from '../pages/latestevent/latestevent';
import { LatestpostPage } from '../pages/latestpost/latestpost';
import { NearestbloodbanksPage } from '../pages/nearestbloodbanks/nearestbloodbanks';
import { NearesthospitalsPage } from '../pages/nearesthospitals/nearesthospitals';
import { DonorregisterPage } from '../pages/donorregister/donorregister';
import { BloodrequestPage } from '../pages/bloodrequest/bloodrequest';
import { DonorlistPage } from '../pages/donorlist/donorlist';
import { SeekeeregisterPage } from '../pages/seekerregister/seekerregister';

@Component({
  templateUrl: 'app.html',
  // styleUrls: ['app/assets/css/main.css']

})
export class MyApp {

  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
  loginInfo: any;
  activePage: any;
  userInfo: any;

  pagesOne: Array<{ title: string, component: any }>;
  isSeeker: Array<{ title: string, component: any }>;
  isDonor: Array<{ title: string, component: any }>;

  constructor(public platform: Platform, public statusBar: StatusBar,
    public splashScreen: SplashScreen, private menu: MenuController) {
    //  this.menu.enable(true);

    this.ionViewWillEnter();
    this.initializeApp();


    this.pagesOne = [
      { title: 'HOME', component: HomePage },
      { title: 'FIND A DONOR', component: DonorlistPage },
      { title: 'REGISTER AS DONOR', component: DonorregisterPage },
      { title: 'REGISTER AS SEEKER', component: SeekeeregisterPage },
      { title: 'LATEST POST', component: LatestpostPage },
      { title: 'LATEST EVENT', component: LatestEventPage },
      { title: 'NEAR BY BLOOD BANKS', component: NearestbloodbanksPage },
      { title: 'NEAR BY HOSPITALS', component: NearesthospitalsPage }
    ];    

    this.isSeeker = [
      { title: 'HOME', component: HomePage },
      { title: 'FIND A DONOR', component: DonorlistPage },
      { title: 'BLOOD REQUEST', component: BloodrequestPage },
      { title: 'LATEST POST', component: LatestpostPage },
      { title: 'LATEST EVENT', component: LatestEventPage },
      { title: 'NEAR BY BLOOD BANKS', component: NearestbloodbanksPage },
      { title: 'NEAR BY HOSPITALS', component: NearesthospitalsPage }
    ];

    this.isDonor = [
      { title: 'HOME', component: HomePage },
      { title: 'FIND A DONOR', component: DonorlistPage },
      { title: 'LATEST POST', component: LatestpostPage },
      { title: 'LATEST EVENT', component: LatestEventPage },
      { title: 'NEAR BY BLOOD BANKS', component: NearestbloodbanksPage },
      { title: 'NEAR BY HOSPITALS', component: NearesthospitalsPage }
    ];

  }

  ionViewWillEnter() {

    this.loginInfo = sessionStorage.getItem('loginstatus')
    this.userInfo = sessionStorage.getItem('userinfo')
    this.menu.enable(true, 'pageB');
    if (this.loginInfo == 'true') {
      if(this.userInfo == "Seeker"){
        this.menu.enable(true, 'isSeeker');
        this.menu.enable(false, 'pageA');
        this.menu.enable(false, 'isDonor');
      }else{
        this.menu.enable(true, 'isDonor');
        this.menu.enable(false, 'isSeeker');
        this.menu.enable(false, 'pageA');        
      }
     
    } else if (this.loginInfo == null) {
      this.menu.enable(true, 'pageA');
      this.menu.enable(false, 'isDonor');
      this.menu.enable(false, 'isSeeker');
    }


  }

  //   ionViewWillLeave() {
  //     this.menu.enable(true);
  //     console.log("menu true")
  //   }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
    this.activePage = page;
  }
}
