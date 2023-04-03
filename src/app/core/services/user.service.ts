import { Injectable } from '@angular/core';
import { SocialUser } from '@abacritt/angularx-social-login';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public user!: SocialUser;
  public loggedIn!: boolean;

  constructor() {
    this.getUser();
  }
  async removeUser() {
    try {
      localStorage.removeItem('user');
    } catch (err) {
      //  console.error(err);
    }
  }


  async getUser() {
    try {
      var localUser = localStorage.getItem('user') || '';
      this.user = JSON.parse(localUser);
    } catch (err) {
      //  console.error(err);
    }
  }

  setUser(user: SocialUser) {
    localStorage.setItem('user', JSON.stringify(user));
    this.user = user;
  }
}
