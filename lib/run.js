const chalk = require('chalk');
const glob = require('glob');
const Generator = require('yeoman-generator');
const { join } = require('path');
const { statSync, mkdirSync, readFileSync, existsSync } = require('fs');
const { capitalize, startCase } = require('lodash');

const isTsFile = f => f.endsWith('.ts') || f.endsWith('.tsx') || !!/(tsconfig\.json)/g.test(f);
const isJsFile = f => f.endsWith('.js') || f.endsWith('.jsx');
const convertString = (str, name) => str
    .replace(/__appid__/g, name.toLowerCase())
    .replace(/__Appid__/g, capitalize(name))
    .replace(/__APPID__/g, name.toUpperCase());
const convertAuthor = (str, name) => str
    .replace(/__Author__/g, startCase(name));

class AppGenerator extends Generator {
  constructor(opts) {
    super(opts);
    this.opts = opts;
  }

  prompting() {
    const prompts = [{
      name: 'name',
      message: 'What\'s the App name?',
      validate: value => {
        const result = /^[a-zA-Z]\w{2,}$/.test(value);
        if (!result) {
          console.log(chalk.red('\nApp name must be longer than 3 characters and start with a letter'));
        }
        return result;
      },
      default: this.opts.name,
    }, {
      name: 'author',
      message: 'What\'s the author\'s name?',
    }, {
      name: 'has_service',
      message: 'Does the App has egg service?',
      type: 'list',
      choices: [{
        name: 'Yes',
        value: true,
      }, {
        name: 'No',
        value: false,
      }],
      default: false,
    }, {
      name: 'has_menubar',
      message: 'Does the App has a menubar?',
      type: 'list',
      choices: [{
        name: 'Yes',
        value: true,
      }, {
        name: 'No',
        value: false,
      }],
      default: false,
    }, {
      name: 'has_statusbar',
      message: 'Does the App has a statusbar component?',
      type: 'list',
      choices: [{
        name: 'Yes',
        value: true,
      }, {
        name: 'No',
        value: false,
      }],
      default: false,
    }, {
      name: 'has_layout',
      message: 'Does the App has a layout component for all pages?',
      type: 'list',
      choices: [{
        name: 'Yes',
        value: true,
      }, {
        name: 'No',
        value: false,
      }],
      default: false,
    }, {
      name: 'has_mobxstore',
      message: 'Does the App has a MobX store?',
      type: 'list',
      choices: [{
        name: 'Yes',
        value: true,
      }, {
        name: 'No',
        value: false,
      }],
      default: false,
    }];
    return this.prompt(prompts).then(props => {
      this.props = props;
    });
  }

  writing() {
    const { fileFormat } = this.opts;
    const props = this.props;
    const tmpDir = join(__dirname, '/template');
    const excludeFilter = fileFormat === 'js' ? isTsFile : isJsFile;

    // 创建目录
    const destinationDir = join(process.cwd(), props.name.toLowerCase());
    if (!existsSync(destinationDir)) {
      mkdirSync(destinationDir);
    }
    // 复制文件
    glob.sync('**/*', {
          cwd: tmpDir,
          dot: true,
        })
        .filter(file => {
          return !excludeFilter(file);
        })
        .forEach(file => {
          // 是否需要 Service
          if (!props.has_service && (file === 'service/__appid__.ts' || file === 'service/__appid__.js')) {
            return;
          }
          // 是否需要 Mobx store
          if (!props.has_mobxstore && (file === 'js/store.ts' || file === 'js/store.js')) {
            return;
          }
          // 是否需要 Statusbar
          if (!props.has_statusbar && (file === 'js/components/Statusbar.tsx' || file === 'js/components/Statusbar.jsx')) {
            return;
          }
          // 是否需要 Layout
          if (!props.has_layout && (file === 'js/components/Layout.tsx' || file === 'js/components/Layout.jsx')) {
            return;
          }

          const sourceFile = join(tmpDir, file);
          if (statSync(sourceFile).isFile()) {
            // 只复制文件
            const destinationFile = join(destinationDir, convertString(file, props.name));
            let content = this.fs.read(sourceFile);
            content = convertString(content, props.name);

            // 特殊文件处理
            if (file === 'js/package.json') {
              content = convertAuthor(content, props.author);
            } else if (file === 'js/__appid__.ts' || file === 'js/__appid__.js') {
              let result = content.split('\n');
              // 是否需要 Mobx store
              if (!props.has_mobxstore) {
                result = result.filter(line => {
                  return line.indexOf('\'./store\'') === -1 &&
                      line.indexOf('store:') === -1;
                });
              }
              // 是否需要 Statusbar
              if (!props.has_statusbar) {
                result = result.filter(line => {
                  return line.indexOf('\'./components/Statusbar\'') === -1 &&
                      line.indexOf('statusbar:') === -1;
                });
              }
              // 是否需要 Layout
              if (!props.has_layout) {
                result = result.filter(line => {
                  return line.indexOf('\'./components/Layout\'') === -1 &&
                      line.indexOf('layout:') === -1;
                });
              }
              // 是否需要 Menubar
              if (!props.has_menubar) {
                let inMenu = false;
                result = result.filter(line => {
                  // 开始 menu 定义片段
                  if (line.indexOf('const menu') !== -1) {
                    inMenu = true;
                  }
                  if (inMenu && line === '') {
                    inMenu = false;
                    return false;
                  }
                  // menu 单独行
                  if (line.indexOf('menu,') !== -1) {
                    return false;
                  }
                  return !inMenu;
                });
              }
              content = result.join('\n');

              // 删除 @types 定义部分
              if (fileFormat === 'ts') {
                if (!props.has_menubar) {
                  // 删除 IMenuItem
                  content = content.replace(', IMenuItem', '');
                }
              }
            }

            this.fs.write(destinationFile, content);
          }
        });
  }
}

const run = async opts => {
  process.send && process.send({ type: 'prompt' });
  process.emit('message', { type: 'prompt' });

  try  {
    generator = new AppGenerator(opts);
    return generator.run(() => {
      console.log(chalk.green(readFileSync(join(__dirname, '/easter_egg.txt')).toString()));
    });
  } catch (e) {
    console.error(chalk.red(`> Generate failed`), e);
    process.exit(1);
  }
};

module.exports = run;
