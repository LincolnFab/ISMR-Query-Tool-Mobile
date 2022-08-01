import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PlotPage } from './plot.page';

describe('PlotPage', () => {
  let component: PlotPage;
  let fixture: ComponentFixture<PlotPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlotPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PlotPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
