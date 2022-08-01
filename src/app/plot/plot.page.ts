import { Component, OnInit, Renderer2, Inject, ViewChild } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Storage } from '@ionic/storage'
import { AlertController, IonContent, ToastController } from '@ionic/angular';
import { DOCUMENT } from '@angular/common';


interface checkVerify {
  gps: boolean;
  glonass: boolean;
  galileo: boolean;
  sbas: boolean;
  beidou: boolean;
  qzss: boolean;
}

@Component({
  selector: 'app-plot',
  templateUrl: './plot.page.html',
  styleUrls: ['./plot.page.scss'],
})
export class PlotPage implements OnInit {

  public items: any = [];
  gpsOptions = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];
  glonassOptions = ["38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "60", "61"];
  galileoOptions = ["71", "72", "73", "74", "75", "76", "77", "78", "79", "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "90", "91", "92", "93", "94", "95", "96", "97", "98", "99", "100", "101", "102"];
  sbasOptions = ["120", "121", "122", "123", "124", "125", "126", "127", "128", "129", "130", "131", "132", "133", "134", "135", "136", "137", "138", "139", "140"];
  beidouOptions = ["141", "142", "143", "144", "145", "146", "147", "148", "149", "150", "151", "152", "153", "154", "155", "156", "157", "158", "159", "160", "161", "162", "163", "164", "165", "166", "167", "168", "169", "170", "171", "172"];
  qzssOptions = ["181", "182", "183", "184", "185", "186", "187"];

  stations = ["DMC1", "FRTZ", "GALH", "INCO", "MAC3", "MAC2", "MACA", "MAN2", "MAN3", "MANA", "MORU", "PALM",
    "POAL", "PRU1", "PRU2", "PRU3", "PRU4", "SJCE", "SJCI", "SJCU", "SLMA", "SPBO", "STBR", "STMC", "STNT",
    "STPE", "STSH", "STSN", "STTF", "UFBA"];

  listener;
  selectAllCheckBox: any;
  checkBoxes;
  checkVerify: checkVerify = {
    gps: false,
    glonass: false,
    galileo: false,
    sbas: false,
    beidou: false,
    qzss: false
  };

  customAlertOptions: any = {
    message: '<ion-checkbox id="selectAllCheckBox"></ion-checkbox > <ion-label>Selecionar todos</ion-label>',
  };

  @ViewChild('content', { static: false }) content: IonContent;

  constructor(
    private socialSharing: SocialSharing,
    private storage: Storage,
    private renderer: Renderer2,
    public toastController: ToastController,

    @Inject(DOCUMENT) private document: Document
  ) {
    this.items = [
      { expanded: false }
    ];
  }

  scrollToBottom() {
    this.content.scrollToBottom(1000);
  }

  doRefresh(event) {

    setTimeout(() => {
      var satNames = ["gps", "glonass", "galileo", "sbas", "beidou", "qzss"];

      var satellitesClass;

      this.document.getElementById("date").setAttribute("value", null);
      this.document.getElementById("date_end").setAttribute("value", null);
      this.document.getElementById("time_begin").setAttribute("value", null);
      this.document.getElementById("time_end").setAttribute("value", null);
      this.document.getElementById("stationName").setAttribute("value", null);
      this.document.getElementById("dataType").setAttribute("value", "s4");

      for (var i = 0; i < satNames.length; i++) {
        satellitesClass = this.document.getElementsByClassName(satNames[i]);

        if (satellitesClass != "undefined") {
          satellitesClass[0].setAttribute("value", null);
          this.set(satNames[i], false);
        }
      }

      this.document.getElementById("lineStyle").setAttribute("value", "none");
      this.document.getElementById("lineWidth").setAttribute("value", "1");
      this.document.getElementById("chart1").innerHTML = "";
      this.document.getElementById("image").innerHTML = "";

      event.target.complete();
    });
  }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.occult();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  async saveImage() {
    var image = (<HTMLSelectElement>document.getElementById('image')).value;
    var i = await this.storage.keys();
    var num: number;
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
      string = i.pop();
      string = string.replace("img", "");
      num = parseInt(string) + 1;
    } else {
      num = 1;
    }
    string = "0000" + num;
    string = string.substr(string.length - 4);

    if (image != "") {
      this.storage.set('img' + string, image);
      this.presentToast('Imagem salva');
    }
    else {
      this.presentToast('Gere um gráfico primeiro');
    }

    i = await this.storage.keys();
    //console.log(i);
  }

  share() {
    var image = (<HTMLSelectElement>document.getElementById('image')).value;

    if (image != "") {
      var options = {
        files: [image]
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

  occult() {
    document.getElementById("progressbar").style.display = "none";
  }

  expandItem(item): void {
    if (item.expanded) {
      item.expanded = false;
    } else {
      this.items.map(listItem => {
        if (item == listItem) {
          listItem.expanded = !listItem.expanded;
        } else {
          listItem.expanded = false;
        }
        return listItem;
      });
    }
  }

  onCancel(selector) {
    // console.log(this.selectAllCheckBox)
    // console.log(this.selectAllCheckBox.getAttribute("aria-checked"))
    // console.log(this.checkVerify[selector.name])

    let value = this.selectAllCheckBox.getAttribute("checked");
    this.checkVerify[selector.name] = value;
    this.selectAllCheckBox.setAttribute("checked", "false");
  }

  check(name) {
    this.selectAllCheckBox.setAttribute("checked", this.checkVerify[name]);
  }

  set(name, value) {
    this.checkVerify[name] = value;
  }

  openSelector(selector) {
    selector.open().then((alert) => {
      this.selectAllCheckBox = this.document.getElementById("selectAllCheckBox");
      this.checkBoxes = this.document.getElementsByClassName("alert-checkbox");
      this.check(selector.name);
      this.listener = this.renderer.listen(this.selectAllCheckBox, 'click', () => {
        if (this.selectAllCheckBox.checked) {
          this.set(selector.name, true);
          for (let checkbox of this.checkBoxes) {
            if (checkbox.getAttribute("aria-checked") === "false") {
              (checkbox as HTMLButtonElement).click();
            };
          };
        } else {
          this.set(selector.name, false);
          for (let checkbox of this.checkBoxes) {
            if (checkbox.getAttribute("aria-checked") === "true") {
              (checkbox as HTMLButtonElement).click();
            };
          };
        }
      });
      alert.onWillDismiss().then(() => {
        this.listener();
      });
    })
  }
}