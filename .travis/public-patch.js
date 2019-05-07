const fs = require('fs');
const f_gitignore = './deploy/.gitignore';
const f_package_json = './deploy/package.json';

var data = '', obj = {}, txt = '';

data = fs.readFileSync(f_gitignore, 'utf8');
txt = data.replace(/\/dist/g, '');
fs.writeFileSync(f_gitignore, txt, 'utf8');

console.log('Updated .gitignore');

data = fs.readFileSync(f_package_json, 'utf8');
obj = JSON.parse(data);
delete obj['devDependencies'];
obj.scripts.build = 'exit 0';
obj.scripts.test = 'exit 0';
obj.scripts.postinstall = 'exit 0';
fs.writeFileSync(f_package_json, JSON.stringify(obj), 'utf8');

console.log('Updated package.json');
