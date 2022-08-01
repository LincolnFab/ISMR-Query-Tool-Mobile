import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SkyplotPage } from './skyplot.page';

describe('SkyplotPage', () => {
  let component: SkyplotPage;
  let fixture: ComponentFixture<SkyplotPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkyplotPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SkyplotPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
