import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found-page',
  template: `
    <div id="not-found-page-container">
      <h1>Oops</h1>
      <h2>Page not found!</h2>
      <a routerLink="/app">Go to home page</a>
    </div>
  `,
  styles: ['#not-found-page-container { margin: auto; text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; }'],
})
export class NotFoundPageComponent {}
