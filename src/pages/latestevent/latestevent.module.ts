import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LatestEventPage } from './latestevent';
 
@NgModule({
  declarations: [
    LatestEventPage
  ],
  imports: [
    IonicPageModule.forChild(LatestEventPage),
  ],
  exports: [
    LatestEventPage
  ]
})
export class LatestEventModule {}