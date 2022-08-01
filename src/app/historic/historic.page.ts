import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage'
import { AlertController, ToastController } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-historic',
  templateUrl: './historic.page.html',
  styleUrls: ['./historic.page.scss'],
})
export class HistoricPage implements OnInit {

  constructor(
    private storage: Storage,
    private alertController: AlertController,
    private socialSharing: SocialSharing,
    public toastController: ToastController,
  ) { }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.history();
  }


  doRefresh(event) {

    var a = setTimeout(() => {
      this.history();

      event.target.complete();
    });
  }

  async presentAlertClear(header: string, message: string) {
    return new Promise(async (resolve) => {
      const confirm = await this.alertController.create({
        header: header,
        message: message,
        buttons: [
          {
            text: 'Não',
            role: 'não',
            handler: () => {
              return resolve(false);
            },
          },
          {
            text: 'Sim',
            handler: () => {
              return resolve(true);
            },
          },
        ],
      });

      await confirm.present();
    });
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  async history() {
    let string = "";

    await this.storage.forEach((value, key, index) => {
      if (key.includes("img"))
        string = "<ion-item class='animated fadeIn'> <ion-checkbox slot='start' value= '" + key + "' id = 'check" + index + "'> </ion-checkbox> <img style='border-radius: 15px;' id = " + key + " src = '" + value + "'" + "/> </ion-item>" + string;
    })
    document.getElementById("historico").innerHTML = string;
  }

  async delete() {
    let length: number = await this.storage.length();
    let checkedItems = [];

    if (length > 3) {
      await this.storage.forEach((value, key, index) => {
        if (key.includes("img")) {
          if ((<HTMLIonCheckboxElement>document.getElementById("check" + index)).checked)
            checkedItems.push((<HTMLIonCheckboxElement>document.getElementById("check" + index)).value);
        }
      })
      if (checkedItems.length > 0) {
        if (await this.presentAlertClear('', 'Deseja excluir as imagens selecionadas?')) {
          for (let i of checkedItems) {
            this.storage.remove(i);
          }
          await this.history();
        }
      }
      else {
        this.presentToast('Selecione uma imagem primeiro')
      }
    }
    else {
      this.presentToast('Histórico já está limpo');
    }
  }

  async clearHistory() {
    let length: number = await this.storage.length();

    if (length > 3) {
      if (await this.presentAlertClear('', 'Deseja limpar o histórico?')) {
        await this.storage.forEach((value, key, index) => {
          if (key.includes("img")) {
            this.storage.remove(key);
          }
        })
        this.presentToast('Histórico Limpo');
        document.getElementById("historico").innerHTML = "";
      }
    }
    else {
      this.presentToast('Histórico já está limpo');
    }
  }

  async share() {
    let checkedItems = [];
    await this.storage.forEach((value, key, index) => {
      if (key.includes("img")) {
        if ((<HTMLIonCheckboxElement>document.getElementById("check" + index)).checked) {
          checkedItems.push(((<HTMLImageElement>document.getElementById(key)).src));
        }
      }
    })

    if (checkedItems.length > 0) {
      var options = {
        message: '',
        subject: '',
        files: checkedItems,
        url: '',
      };

      this.socialSharing.shareWithOptions(options).then(() => {
        // Success!
      }).catch(() => {
        // Error!
      });
    }
    else {
      this.presentToast('Selecione uma imagem primeiro');
    }
  }

}
