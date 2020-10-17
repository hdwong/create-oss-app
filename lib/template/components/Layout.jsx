import React from 'react';
import { withApp } from '@/utils/withapp';

@withApp('__appid__')
class __Appid__Layout extends React.PureComponent {
  render() {
    // 可以通过 this.props.app.location?.pathname 来判断 location 路径

    return this.props.children;
  }
}

export default __Appid__Layout;
