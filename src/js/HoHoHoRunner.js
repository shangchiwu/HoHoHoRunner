import App from './App.js';
import ApiWrapper, { ApiAccessError } from './ApiWrapper.js';
import ActionController from './ActionController.js';
import ServerActionController from './ServerActionController.js';
import config from '../config.js';

/**
 * Top namespace of HoHoHoRunner
 * @namespace
 */
const HoHoHoRunner = {
  App,
  ApiWrapper,
  ApiAccessError,
  ActionController,
  ServerActionController,
  config
};

export default HoHoHoRunner
