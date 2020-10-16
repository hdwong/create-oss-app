import React from 'react';
import { withApp } from '@/utils/withapp';
import styles from './assets/__appid__.scss';

@withApp('__appid__')
class __Appid__Index extends React.PureComponent {
  render() {
    return (
      <h1 className={styles.sample}>It works!</h1>
    );
  }
}

__Appid__Index.title = '__APPID__ Home Page';

export default __Appid__Index;
