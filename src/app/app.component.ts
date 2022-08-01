import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Storage } from '@ionic/Storage';
import { AndroidFullScreen } from '@ionic-native/android-full-screen/ngx';
import { Network } from '@ionic-native/network/ngx';

import { Router } from '@angular/router';
import { TranslateConfigService } from '../app/translate-config.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private socialSharing: SocialSharing,
    private storage: Storage,
    private androidFullScreen: AndroidFullScreen,
    private router: Router,
    private network: Network,
    private translateConfigService: TranslateConfigService
    //private renderer: Renderer2
  ) {
    this.setStartPage();
    this.setTheme();
    this.setScreen();
    this.setLanguage();
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      setTimeout(() => {
        this.splashScreen.hide();
      }, 5000);
      this.checkNetwork();
    });
  }

  presentAlertConnectError() {
    const alert = document.createElement('ion-alert');
    alert.cssClass = 'my-custom-class';
    alert.subHeader = 'Sem conexão com a internet!';
    alert.buttons = ['OK'];

    document.body.appendChild(alert);
    return alert.present();
  }

  async checkNetwork() {
    this.network.onDisconnect().subscribe(() => {
      this.presentAlertConnectError();
    });
  }

  async setScreen() {
    let val = await this.storage.get('screen');
    if (val == "full")
      this.androidFullScreen.isImmersiveModeSupported()
        .then(() => this.androidFullScreen.immersiveMode());
    //this.renderer.setAttribute(document.body, 'color-theme', 'dark');
  }

  async setTheme() {
    let val = await this.storage.get('theme');
    if (val == "dark")
      document.body.setAttribute('color-theme', 'dark');
    //this.renderer.setAttribute(document.body, 'color-theme', 'dark');
  }

  async setStartPage() {
    let startPage = await this.storage.get('page');
    if (startPage != null)
      this.router.navigateByUrl('/' + startPage);
    else
      this.router.navigateByUrl('/home');
  }

  async setLanguage() {
    let language = await this.storage.get('language');
    if (language != null)
      this.translateConfigService.setLanguage(language);
    else
      this.storage.set('language', this.translateConfigService.getDefaultLanguage());
  }

  share() {
    var options = {
      message: 'ISMR Query Tool application', // not supported on some apps (Facebook, Instagram)
      subject: 'ISMR Query Tool', // fi. for email
      files: [], // an array of filenames either locally or remotely
      url: 'https://drive.google.com/drive/folders/13xNwRNmaj-q852fY7T0pBXfPGEAO66OU?usp=sharing',
    };

    this.socialSharing.shareWithOptions(options).then(() => {
      // Success!
    }).catch(() => {
      // Error!
    });
  }

}
