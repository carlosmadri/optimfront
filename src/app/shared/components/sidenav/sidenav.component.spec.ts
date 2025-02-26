import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavComponent } from './sidenav.component';
import { RouterModule } from '@angular/router';
import { Location } from '@angular/common';

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;

  const locationMock: Partial<Location> = {
    path: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidenavComponent, RouterModule.forRoot([])],
      providers: [{ provide: Location, useValue: locationMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expand the current node  after reload', () => {
    jest.spyOn(locationMock, 'path').mockImplementationOnce(() => component.dataSource[0].url);

    expect(component.treeNodes.first.isExpanded).toBeFalsy();

    component.ngAfterViewInit();

    expect(component.treeNodes.first.isExpanded).toBeTruthy();
  });

  it('should expand the parent node of the active child route after reload', () => {
    jest.spyOn(locationMock, 'path').mockImplementationOnce(() => component.dataSource[0].children![0].url);

    expect(component.treeNodes.first.isExpanded).toBeFalsy();

    component.ngAfterViewInit();

    expect(component.treeNodes.first.isExpanded).toBeTruthy();
  });

  it('should not expand the parent node of non active child route after reload', () => {
    jest.spyOn(locationMock, 'path').mockImplementationOnce(() => component.dataSource[1].children![0].url);

    expect(component.treeNodes.first.isExpanded).toBeFalsy();

    component.ngAfterViewInit();

    expect(component.treeNodes.first.isExpanded).toBeFalsy();
  });
});
