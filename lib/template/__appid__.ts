import { IAppConfig } from '@app/types';
import Icon from './assets/icon.svg';
import Statusbar from './components/Statusbar';
import { __Appid__Store } from './store';

const menu = [{
  title: 'Home',
  link: '/app/__appid__',
}];

export default ({
  title: '__Appid__',
  icon: Icon,
  menu,
  statusbar: Statusbar,
  store: __Appid__Store,
}) as IAppConfig;
