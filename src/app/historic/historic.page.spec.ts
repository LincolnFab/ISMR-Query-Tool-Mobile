import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HistoricPage } from './historic.page';

describe('HistoricPage', () => {
  let component: HistoricPage;
  let fixture: ComponentFixture<HistoricPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HistoricPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
