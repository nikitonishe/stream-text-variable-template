const { Transform } = require('stream');
class Template extends Transform {
  constructor(props = {}, options) {
    super(options);
    this.pieces = '';
    if (props) this.props = props;
    this.test = {
      start: /\{\{/,
      block: /\{\{([^{}]+?)\}\}/
    }
  }

  _hasStart() {
    return this.test.start.test(this.pieces);
  }

  _hasBlock() {
    return this.test.block.test(this.pieces);
  }

  _compile() {
    const match = this.pieces.match(this.test.block);
    if (!match) throw new Error('Unstable variable');
    const field = match[1];
    const toReplace = match[0];
    if (!(this.props && this.props[field])) throw new Error('Variable ' + field + ' is not defined');
    this.pieces = this.pieces.replace(toReplace, this.props[field]);
  }

  _getPiecesWithClean() {
    const toReturn = this.pieces;
    this.pieces = '';
    return toReturn;
  }

  _transform(chunk, enc, callback) {
    this.pieces += chunk.toString();
    if (this._hasStart()) {
      if (!this._hasBlock()) return callback();
      while (this._hasBlock()) {
        try {
          this._compile();
        } catch(err) {
          return callback(err);
        }
      }
      this.push(this._getPiecesWithClean());
      return callback();
    }
    this.push(this._getPiecesWithClean());
    return callback();
  }
}

module.exports = Template;
