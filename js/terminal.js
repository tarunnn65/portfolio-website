// ═══════════════════════════════════════════════════
// PIPELINE ENGINE — Interactive JS Terminal Simulator
// Mirrors the exact behaviour of the C codebase.
// ═══════════════════════════════════════════════════

class PipelineTerminal {
  constructor() {
    this.overlay  = document.getElementById('terminal-overlay');
    this.body     = document.getElementById('terminal-body');
    this.input    = document.getElementById('terminal-input');
    this.closeBtn = document.getElementById('terminal-close');

    this.history    = [];
    this.historyIdx = -1;
    this.attached   = false;

    // Virtual filesystem — files users can pipe through the engine
    this.files = {
      'planets.txt':
        'Mercury\nVenus\nEarth\nMars\nJupiter\nSaturn\nUranus\nNeptune',
      'quotes.txt':
        'The universe is under no obligation to make sense to you.\n' +
        'Look up at the stars and not down at your feet.\n' +
        'We are all made of star stuff.\n' +
        'Science is not only compatible with spirituality.\n' +
        'Anywhere is walking distance if you have the time.',
      'words.txt':
        'hello world\nfoo bar baz\nalpha beta gamma\ndelta epsilon zeta\nhello again world\nfoo is bar',
      'numbers.txt':
        '42\n7\n1024\n3\n256\n128\n512\n64',
      'input.txt':
        'The quick brown fox jumps over the lazy dog\n' +
        'Pack my box with five dozen liquor jugs\n' +
        'How valiantly did you pack?',
    };
  }

  // ─── Public API ────────────────────────────────────

  open() {
    this.overlay.classList.add('active');
    this.overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (!this.attached) { this._attachEvents(); this.attached = true; }
    this._clear();
    this._printWelcome();
    setTimeout(() => this.input.focus(), 50);
  }

  close() {
    this.overlay.classList.remove('active');
    this.overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // ─── Events ────────────────────────────────────────

  _attachEvents() {
    this.closeBtn.addEventListener('click', () => this.close());
    this.overlay.addEventListener('click', e => { if (e.target === this.overlay) this.close(); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this.overlay.classList.contains('active')) this.close();
    });
    this.body.addEventListener('click', () => this.input.focus());

    this.input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const cmd = this.input.value.trim();
        this.input.value = '';
        if (!cmd) return;
        this.history.unshift(cmd);
        this.historyIdx = -1;
        this._printLine(
          `<span class="t-prompt">user@portfolio:~/pipeline$</span> <span class="t-cmd">${this._esc(cmd)}</span>`
        );
        this._handleCommand(cmd);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (this.historyIdx < this.history.length - 1) {
          this.historyIdx++;
          this.input.value = this.history[this.historyIdx];
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (this.historyIdx > 0) { this.historyIdx--; this.input.value = this.history[this.historyIdx]; }
        else { this.historyIdx = -1; this.input.value = ''; }
      }
    });
  }

  // ─── Output Helpers ────────────────────────────────

  _printLine(html) {
    const div = document.createElement('div');
    div.className = 't-line';
    div.innerHTML = html;
    this.body.appendChild(div);
    this.body.scrollTop = this.body.scrollHeight;
  }

  _printText(text, cls = 't-output') {
    if (text === '' || text === null || text === undefined) return;
    String(text).split('\n').forEach(l => this._printLine(`<span class="${cls}">${this._esc(l)}</span>`));
  }

  _printError(msg) {
    this._printLine(`<span class="t-error">pipeline: ${this._esc(msg)}</span>`);
  }

  _printBlank() { this._printLine('&nbsp;'); }

  _clear() { this.body.innerHTML = ''; }

  _esc(str) {
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // ─── Welcome Screen ────────────────────────────────

  _printWelcome() {
    [
      `<span class="t-accent">┌─────────────────────────────────────────────────────┐</span>`,
      `<span class="t-accent">│</span>  <span class="t-highlight">Multi-Process Pipeline Engine</span>  —  JS Simulator   <span class="t-accent">│</span>`,
      `<span class="t-accent">│</span>  <span class="t-muted">Faithfully mirrors the C codebase's output</span>           <span class="t-accent">│</span>`,
      `<span class="t-accent">└─────────────────────────────────────────────────────┘</span>`,
      ``,
      `<span class="t-muted">Type <span class="t-highlight">help</span> for commands · <span class="t-highlight">ls</span> to see available files</span>`,
      ``,
      `<span class="t-muted">Quick start:</span>`,
      `  <span class="t-cmd">./pipeline planets.txt upper sort</span>`,
      `  <span class="t-cmd">echo "Hello World" | ./pipeline - lower reverse</span>`,
      ``,
    ].forEach(l => this._printLine(l));
  }

  // ─── Command Router ────────────────────────────────

  _handleCommand(raw) {
    // Piped command: <left> | ./pipeline - plugins...
    if (raw.includes('|')) {
      const pipe = raw.indexOf('|');
      const left  = raw.slice(0, pipe).trim();
      const right = raw.slice(pipe + 1).trim();
      let stdinText = null;

      if (left.startsWith('echo ')) {
        // strip surrounding quotes
        stdinText = left.replace(/^echo\s+/, '').replace(/^(["'])(.*)\1$/, '$2');
      } else if (left.startsWith('cat ')) {
        const fname = left.slice(4).trim();
        if (!this.files[fname]) return this._printError(`${fname}: No such file or directory`);
        stdinText = this.files[fname];
      } else {
        return this._printError(`unrecognised command before pipe: '${left}'`);
      }
      return this._runPipeline(stdinText, right);
    }

    if (raw.startsWith('./pipeline')) return this._runPipeline(null, raw);

    const [cmd, ...args] = raw.trim().split(/\s+/);
    switch (cmd) {
      case 'help':  return this._printHelp();
      case 'clear': return this._clear();
      case 'ls':    return this._printLs();
      case 'cat':   return this._catFile(args[0]);
      case 'echo':  return this._printText(raw.replace(/^echo\s+/, '').replace(/^(["'])(.*)\1$/, '$2'));
      default:
        this._printLine(`<span class="t-error">${this._esc(cmd)}: command not found — try <span class="t-highlight">help</span></span>`);
    }
    this._printBlank();
  }

  // ─── Pipeline Runner ───────────────────────────────

  _runPipeline(stdinText, pipelineCmd) {
    const tokens = pipelineCmd.trim().split(/\s+/);

    if (tokens[0] !== './pipeline') {
      return this._printError(`command must start with ./pipeline`);
    }
    if (tokens.length < 3) {
      this._printLine(`<span class="t-error">Usage: ./pipeline &lt;file | - | INPUT&gt; &lt;plugin[:arg]&gt; [plugins…]</span>`);
      return;
    }

    const source  = tokens[1];
    const plugins = tokens.slice(2);

    let text = '';
    if (source === '-' || source === 'INPUT') {
      if (stdinText === null)
        return this._printError(`no stdin — use: echo "text" | ./pipeline - plugin`);
      text = stdinText;
    } else {
      if (!this.files[source]) return this._printError(`${source}: No such file or directory`);
      text = this.files[source];
    }

    for (const p of plugins) {
      const [name, arg] = p.split(':');
      try { text = this._applyPlugin(name, arg, text); }
      catch (err) { return this._printError(`plugin '${name}': ${err.message}`); }
    }

    this._printText(text.length ? text : '(empty output)');
    this._printBlank();
  }

  // ─── Plugin Implementations ────────────────────────

  _applyPlugin(name, arg, text) {
    const lines = text.split('\n');
    switch (name) {
      case 'upper':   return lines.map(l => l.toUpperCase()).join('\n');
      case 'lower':   return lines.map(l => l.toLowerCase()).join('\n');
      case 'reverse': return lines.map(l => [...l].reverse().join('')).join('\n');
      case 'number':  return lines.map((l, i) => `${i + 1} ${l}`).join('\n');
      case 'sort':    return [...lines].sort().join('\n');
      case 'filter': {
        if (!arg) throw new Error('filter requires an argument — use filter:keyword');
        return lines.filter(l => l.toLowerCase().includes(arg.toLowerCase())).join('\n');
      }
      case 'count': {
        const w = text.split(/\s+/).filter(w => w.length > 0).length;
        return `${lines.length} lines  ${w} words  ${text.length} chars`;
      }
      default: throw new Error(`unknown plugin — see 'help' for the list`);
    }
  }

  // ─── Built-in Commands ─────────────────────────────

  _printHelp() {
    [
      `<span class="t-highlight">PIPELINE ENGINE  —  Interactive Demo</span>`,
      ``,
      `<span class="t-accent">SYNOPSIS</span>`,
      `  <span class="t-cmd">./pipeline &lt;file | - | INPUT&gt; &lt;plugin[:arg]&gt; [plugins…]</span>`,
      `  <span class="t-cmd">echo "text" | ./pipeline - plugin [plugins…]</span>`,
      ``,
      `<span class="t-accent">PLUGINS</span>`,
      `  <span class="t-highlight">upper</span>          Convert all text to UPPERCASE`,
      `  <span class="t-highlight">lower</span>          Convert all text to lowercase`,
      `  <span class="t-highlight">reverse</span>        Reverse characters on each line`,
      `  <span class="t-highlight">number</span>         Prepend line numbers (like cat -n)`,
      `  <span class="t-highlight">sort</span>           Sort lines alphabetically`,
      `  <span class="t-highlight">filter:word</span>    Keep lines containing 'word' (like grep)`,
      `  <span class="t-highlight">count</span>          Count lines, words, chars (like wc)`,
      ``,
      `<span class="t-accent">OTHER COMMANDS</span>`,
      `  <span class="t-highlight">ls</span>             List available files`,
      `  <span class="t-highlight">cat &lt;file&gt;</span>     Print a file's contents`,
      `  <span class="t-highlight">echo "text"</span>    Print text`,
      `  <span class="t-highlight">clear</span>          Clear the terminal`,
      ``,
      `<span class="t-accent">EXAMPLES</span>`,
      `  <span class="t-muted">./pipeline planets.txt upper sort</span>`,
      `  <span class="t-muted">./pipeline words.txt filter:hello number</span>`,
      `  <span class="t-muted">echo "Hello World" | ./pipeline - lower reverse</span>`,
      `  <span class="t-muted">./pipeline quotes.txt sort filter:star count</span>`,
      `  <span class="t-muted">cat input.txt | ./pipeline - upper filter:QUICK reverse</span>`,
      ``,
    ].forEach(l => this._printLine(l));
  }

  _printLs() {
    this._printLine(`<span class="t-muted">Available files in ~/pipeline/:</span>`);
    Object.entries(this.files).forEach(([f, content]) => {
      const n = content.split('\n').length;
      this._printLine(`  <span class="t-highlight">${this._esc(f)}</span>  <span class="t-muted">${n} line${n !== 1 ? 's' : ''}</span>`);
    });
    this._printBlank();
  }

  _catFile(fname) {
    if (!fname) return this._printError('cat: missing operand');
    if (!this.files[fname]) return this._printError(`cat: ${fname}: No such file or directory`);
    this._printText(this.files[fname]);
    this._printBlank();
  }
}

export { PipelineTerminal };
