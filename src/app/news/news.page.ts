import { Component, OnInit, Inject } from '@angular/core';
import { Storage } from '@ionic/Storage';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage {

  private options = 'intro';

  constructor(
    private storage: Storage
  ) { }

  ionViewWillEnter() {
    if (this.options != 'intro')
      this.setImages();
  }

  async setImages() {
    let val = await this.storage.get('theme');

    if (val == "dark") {
      if (this.options == 'plot') {
        (<HTMLImageElement>document.getElementById("data_hora")).setAttribute("src", "../../assets/helpImagees/plot/data_hora_black.png");
        (<HTMLImageElement>document.getElementById("satellites")).setAttribute("src", "../../assets/helpImagees/plot/satelites_black.png");
        (<HTMLImageElement>document.getElementById("estacao_atr_masc_sat")).setAttribute("src", "../../assets/helpImagees/plot/estacao_atr_masc_sat_black.png");
        (<HTMLImageElement>document.getElementById("estilo")).setAttribute("src", "../../assets/helpImagees/plot/estilo_black.png");
      } else if (this.options == 'skyplot') {
        (<HTMLImageElement>document.getElementById("opcao")).setAttribute("src", "../../assets/helpImagees/skyplot/opcao_black.png");
        (<HTMLImageElement>document.getElementById("filtro_mapa")).setAttribute("src", "../../assets/helpImagees/skyplot/filtro_mapa_black.png");
        (<HTMLImageElement>document.getElementById("estacao")).setAttribute("src", "../../assets/helpImagees/skyplot/estacao_black.png");
      } else if (this.options == 'historico') {
        (<HTMLImageElement>document.getElementById("historic")).setAttribute("src", "../../assets/helpImagees/historico/historico_black.png");
        (<HTMLImageElement>document.getElementById("historico_toolbar")).setAttribute("src", "../../assets/helpImagees/historico/historico_toolbar_black.png");
      } else {
        (<HTMLImageElement>document.getElementById("plot_toolbar")).setAttribute("src", "../../assets/helpImagees/plot/plot_toolbar_black.png");
      }
    }
    else {
      if (this.options == 'plot') {
        (<HTMLImageElement>document.getElementById("data_hora")).setAttribute("src", "../../assets/helpImagees/plot/data_hora_white.png");
        (<HTMLImageElement>document.getElementById("satellites")).setAttribute("src", "../../assets/helpImagees/plot/satelites_white.png");
        (<HTMLImageElement>document.getElementById("estacao_atr_masc_sat")).setAttribute("src", "../../assets/helpImagees/plot/estacao_atr_masc_sat_white.png");
        (<HTMLImageElement>document.getElementById("estilo")).setAttribute("src", "../../assets/helpImagees/plot/estilo_white.png");
      } else if (this.options == 'skyplot') {
        (<HTMLImageElement>document.getElementById("opcao")).setAttribute("src", "../../assets/helpImagees/skyplot/opcao_white.png");
        (<HTMLImageElement>document.getElementById("filtro_mapa")).setAttribute("src", "../../assets/helpImagees/skyplot/filtro_mapa_white.png");
        (<HTMLImageElement>document.getElementById("estacao")).setAttribute("src", "../../assets/helpImagees/skyplot/estacao_white.png");
      } else if (this.options == 'historico') {
        (<HTMLImageElement>document.getElementById("historic")).setAttribute("src", "../../assets/helpImagees/historico/historico_white.png");
        (<HTMLImageElement>document.getElementById("historico_toolbar")).setAttribute("src", "../../assets/helpImagees/historico/historico_toolbar_white.png");
      } else {
        (<HTMLImageElement>document.getElementById("plot_toolbar")).setAttribute("src", "../../assets/helpImagees/plot/plot_toolbar_white.png");
      }
    }
  }
}
