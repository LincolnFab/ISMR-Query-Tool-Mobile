import { Component, OnInit, Inject, ViewChild, ElementRef, Input } from '@angular/core';
import { IonContent, ToastController } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Storage } from '@ionic/storage'
import { DOCUMENT, DatePipe } from '@angular/common';

@Component({
  selector: 'app-skyplot',
  templateUrl: './skyplot.page.html',
  styleUrls: ['./skyplot.page.scss'],
})
export class SkyplotPage implements OnInit {
  private option = 'map';

  private stations = ["DMC1", "FRTZ", "GALH", "INCO", "MAC3", "MAC2", "MACA", "MAN2", "MAN3", "MANA", "MORU", "PALM",
    "POAL", "PRU1", "PRU2", "PRU3", "PRU4", "SJCE", "SJCI", "SJCU", "SLMA", "SPBO", "STBR", "STMC", "STNT",
    "STPE", "STSH", "STSN", "STTF", "UFBA"];

  // @ViewChild('hehe') private content: any;

  @ViewChild('content', { static: false }) content: IonContent;

  constructor(
    private socialSharing: SocialSharing,
    private storage: Storage,
    public toastController: ToastController,
    private elementRef: ElementRef,
    public datepipe: DatePipe,
    private geolocation: Geolocation,
    @Inject(DOCUMENT) private document: Document
  ) {
  }

  ngOnInit() {
    // map();
    // this.elementRef.nativeElement.querySelector('#conteudo')
    //   .addEventListener('window:resize', this.scrollToBottom.bind(this));
  }

  ionViewWillEnter() {
    this.occult();
    this.getGeolocation();
    this.setAtualDate();
  }

  clearMap() {
    this.document.getElementById("date_sky").setAttribute("value", null);
    this.document.getElementById("time_begin_sky").setAttribute("value", null);
    this.document.getElementById("offset_time").setAttribute("value", "30");
    this.document.getElementById("map").innerHTML = "";
  }

  clearStation() {
    this.document.getElementById("date_sky").setAttribute("value", null);
    this.document.getElementById("time_begin_sky").setAttribute("value", null);
    this.document.getElementById("time_end_sky").setAttribute("value", null);
    this.document.getElementById("stationName_sky").setAttribute("value", null);
  }

  clearOtherContent() {
    // this.document.getElementById("atualTime").setAttribute("checked", "false");
    this.document.getElementById("gps_sky_container").innerHTML = "";
    this.document.getElementById("image_sky").innerHTML = "";
    this.document.getElementById("gps_plot_container").innerHTML = "";
    this.document.getElementById("image_plot").innerHTML = "";
  }

  doRefresh(event) {
    setTimeout(() => {
      if (this.option == "map") {
        this.clearMap();
      }
      else if (this.option == "station") {
        this.clearStation();
      }

      this.clearOtherContent();
      event.target.complete();
    });
  }

  clearOnChangeOption() {
    if (this.option == "station") {
      this.clearMap();
    }
    else if (this.option == "map") {
      this.clearStation();
    }

    this.clearOtherContent();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  getGeolocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      var location: string = resp.coords.latitude + " " + resp.coords.longitude;

      this.document.getElementById("geolocation").innerHTML = location;
    }).catch((error) => {
      this.presentToast('Localização Indisponível');
    });
  }

  async saveImage() {
    var imageSky = (<HTMLSelectElement>document.getElementById('image_sky')).value;
    var imagePlot = (<HTMLSelectElement>document.getElementById('image_plot')).value;
    var i = await this.storage.keys();
    var num: number;
    var pos: string;
    var string: string;

    if (i.includes("theme"))
      i.pop();
    if (i.includes("screen"))
      i.pop();
    if (i.includes("page"))
      i.pop();
    if (i.includes("language"))
      i.pop();
    if (i.length > 0) {
      pos = i.pop();
      pos = pos.replace("img", "");
      num = parseInt(pos) + 1;
    } else {
      num = 1;
    }

    if (imagePlot != "" && imageSky != "") {
      string = "0000" + num;
      string = string.substr(string.length - 4);
      this.storage.set('img' + string, imageSky);

      num++;
      string = "0000" + num;
      string = string.substr(string.length - 4);
      this.storage.set('img' + string, imagePlot)

      this.presentToast('Imagem salva');
    }
    else {
      this.presentToast('Gere um gráfico primeiro');
    }

    i = await this.storage.keys();
    // console.log(i);
  }

  share() {
    // var image = (<HTMLSelectElement>document.getElementById('image_sky')) != null ? 
    //             (<HTMLSelectElement>document.getElementById('image_sky')).value : "erro";

    var image1 = (<HTMLSelectElement>document.getElementById('image_sky')).value
    var image2 = (<HTMLSelectElement>document.getElementById('image_plot')).value;

    if (image1 != "" && image2 != "") {
      var options = {
        files: [image1, image2]
      };

      this.socialSharing.shareWithOptions(options).then(() => {
        // Success!
      }).catch(() => {
        // Error!
      });
    }
    else {
      this.presentToast('Gere um gráfico primeiro');
    }
  }

  scrollToBottom() {
    this.content.scrollToBottom(1000);
  }

  occult() {
    document.getElementById("progressbarSky").style.display = "none";
  }

  async setAtualDate() {
    await new Promise(resolve => setTimeout(resolve, 200));

    var data = new Date();
    var d = this.datepipe.transform(data, 'yyyy-MM-dd');
    var te: any;
    var tb: any;

    // if (e.detail.checked) {
    if (this.option == "map") {
      data.setMinutes(data.getMinutes() - 30);
      // console.log(data);

      tb = this.datepipe.transform(data, 'HH:mm');

      this.document.getElementById("date_sky").setAttribute("value", d);
      this.document.getElementById("time_begin_sky").setAttribute("value", tb);
      this.document.getElementById("offset_time").setAttribute("value", "30");

      this.document.getElementById("requisitarSky").click();
    }
    else if (this.option == "station") {
      te = this.datepipe.transform(data, 'HH:mm');
      data.setHours(data.getHours() - 1);
      tb = this.datepipe.transform(data, 'HH:mm');
      this.document.getElementById("date_sky").setAttribute("value", d);
      this.document.getElementById("time_begin_sky").setAttribute("value", tb);
      this.document.getElementById("time_end_sky").setAttribute("value", te);
    }
    // }
  }


}
