import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Geofence } from '@ionic-native/geofence';
import { Geolocation } from '@ionic-native/geolocation';
import { SMS } from '@ionic-native/sms';
import { ActivePage } from '../active/active';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  radius: number = 100;
  error: any;
  success:any;

  constructor(public navCtrl: NavController, private platform: Platform, private geofence: Geofence, private geolocation: Geolocation, private sms: SMS) {
    this.platform.ready().then(() => {
         
      geofence.initialize().then(
        () => console.log('Geofence Plugin Ready'),
        (err) => console.log(err)
      );
      
    });
  }
  
   setGeofence(value: number) {

    this.geolocation.getCurrentPosition({
      enableHighAccuracy: true
    }).then((resp) => {
      var longitude = resp.coords.longitude;
      var latitude = resp.coords.latitude;
      var radius = value;

      let fence = {
          id: "myGeofenceID1", 
          latitude:       latitude, 
          longitude:      longitude,
          radius:         radius,  
          transitionType: 2
        }
      
        this.geofence.addOrUpdate(fence).then(
          () => this.success = true,
          (err) => this.error = "Failed to add or update the fence."
        );

        this.geofence.onTransitionReceived().subscribe(resp => {
          this.sms.send('3082400336', 'Your child has left the school.');
        });

        this.navCtrl.push(ActivePage);


    }).catch((error) => {
      this.error = error;
    });
  }
  }