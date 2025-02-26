import { RoleProtectedDirective } from './role-protected.directive';
import { AuthService } from '@services/auth/auth.service';
import { User, Role } from '@models/user.model';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, signal, WritableSignal } from '@angular/core';

@Component({
  template: '<button optimRoleProtected>Test</button>',
})
class TestComponent {}

describe('RoleProtectedDirective', () => {
  const isAuth = signal<boolean>(false);
  const user = signal<User | null>(null);
  let authServiceMock: Partial<AuthService>;
  let fixture: ComponentFixture<TestComponent>;
  let buttonElement: HTMLButtonElement;

  beforeEach(async () => {
    authServiceMock = {
      isAuth,
      user,
    };

    await TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [RoleProtectedDirective],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    buttonElement = fixture.nativeElement.querySelector('button');
  });

  it('should create an instance', () => {
    fixture.detectChanges();
    expect(buttonElement).toBeTruthy();
  });

  it('should not disable button for admin user', () => {
    (authServiceMock.user as WritableSignal<User>)?.set({ role: Role.ADMIN, userName: 'user' } as User);
    fixture.detectChanges();
    expect(buttonElement.disabled).toBe(false);
  });

  it('should disable button for non-admin user', () => {
    (authServiceMock.user as WritableSignal<User>)?.set({ role: Role.REGULAR, userName: 'user' } as User);
    fixture.detectChanges();
    expect(buttonElement.disabled).toBe(true);
  });
});
