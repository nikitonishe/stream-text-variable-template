# stream-text-variable-template
Very simple node stream variable replacer

## Install
```sh
npm i --save stream-text-variable-template
```

## Use
Create template, for example `1.txt`
```
Hi! Your name is {{firstname}} {{lastname}}!
```

```javascript
fs.createReadStream(path.join(__dirname, './1.txt')).
pipe(new Template({
  firstname: 'Constantin',
  lastname: 'T.'
})).
pipe(fs.createWriteStream(path.join(__dirname, './2.txt')));
```

That is it!
