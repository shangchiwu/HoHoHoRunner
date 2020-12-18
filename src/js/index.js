import HoHoHoRunner from './HoHoHoRunner.js';

document.addEventListener('DOMContentLoaded', () => init());

const init = () => {
  // put HoHoHoRunner namespace to window
  window.HoHoHoRunner = HoHoHoRunner;

  // run app
  const app = new HoHoHoRunner.App();
  HoHoHoRunner.app = app;
  app.run();
};
