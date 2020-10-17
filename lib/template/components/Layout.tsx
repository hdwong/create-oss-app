import React from 'react';
import { AppProps, withApp } from '@/utils/withapp';

@withApp('__appid__')
class __Appid__Layout extends React.PureComponent<AppProps> {
  render() {
    // 可以通过 this.props.app.location?.pathname 来判断 location 路径

    return this.props.children;
  }
}

export default __Appid__Layout;
