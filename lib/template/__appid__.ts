import { IAppConfig, IMenuItem } from '@app/types';
import Icon from './assets/icon.svg';
import Statusbar from './components/Statusbar';
import { __Appid__Store } from './store';

const menu: Array<IMenuItem> = [{
  title: 'Menu',
  items: [{
    title: 'Home',
    link: '/app/__appid__',
  }, {
    title: '---',
  }, {
    title: 'Item',
    link: '/app/__appid__/notfound',
  }],
}];

export default ({
  title: '__Appid__',
  icon: Icon,
  menu,
  statusbar: Statusbar,
  store: __Appid__Store,
}) as IAppConfig;
