import { Component } from '@angular/core';
import { Storage } from '@ionic/Storage';
import { AndroidFullScreen } from '@ionic-native/android-full-screen/ngx';
import { TranslateConfigService } from '../translate-config.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage {

  darkMode: boolean = true;
  selectedLanguage: string;

  constructor(
    private storage: Storage,
    private androidFullScreen: AndroidFullScreen,
    private translateConfigService: TranslateConfigService
  ) {
    //const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    //this.darkMode = prefersDark.matches;
  }

  ngOnInit() {
    this.setToggle();
    this.setToggleScreen();
    this.setStartPage();
    this.setLanguage();
  }

  languageChanged() {
    this.translateConfigService.setLanguage(this.selectedLanguage);
    this.storage.set('language', this.selectedLanguage);
  }

  async setLanguage() {
    let selectedLanguage = await this.storage.get('language');
    if (selectedLanguage != null)
      this.selectedLanguage = selectedLanguage;
  }

  async setStartPage() {
    let val = await this.storage.get('page');
    if (val != null)
      (<HTMLSelectElement>document.getElementById('startPage')).setAttribute('value', val);
  }

  async changeStartPage() {
    let startPage = (<HTMLSelectElement>document.getElementById('startPage')).value;
    await this.storage.set('page', startPage);
  }

  async setToggleScreen() {
    let val = await this.storage.get('screen');
    if (val == "full")
      (<HTMLSelectElement>document.getElementById('toggleScreen')).setAttribute('checked', val);
  }

  async changeScreenMode(event) {
    if (event.detail.checked) {
      this.androidFullScreen.isImmersiveModeSupported()
        .then(() => this.androidFullScreen.immersiveMode());
      this.storage.set('screen', 'full');
    }
    else {
      this.androidFullScreen.isImmersiveModeSupported()
        .then(() => this.androidFullScreen.showSystemUI());
      this.storage.set('screen', 'none');
    }
  }

  async setToggle() {
    let val = await this.storage.get('theme');
    if (val == "dark")
      (<HTMLSelectElement>document.getElementById('toggle')).setAttribute('checked', val);
  }

  async changeTheme(event) {
    if (event.detail.checked) {
      document.body.setAttribute('color-theme', 'dark');
      this.storage.set('theme', 'dark');
    }
    else {
      document.body.setAttribute('color-theme', 'light');
      this.storage.set('theme', 'light');
    }
  }

}
