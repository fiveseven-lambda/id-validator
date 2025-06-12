import { useState } from 'react'
import './App.css'

function is_identifier(s: string): boolean | null {
  const iterator = s[Symbol.iterator]();
  let is_first = true;

  for (let cur = iterator.next(); !cur.done; cur = iterator.next()) {
    const ch = cur.value;

    if (/^[\t\v\f !"#%&'()*+,-./:;<=>?[\]^{|}~]$/.test(ch)) {
      return false;
    } else if (ch == '\\') {
      const ucn_first = iterator.next();
      if (ucn_first.done) {
        return false;
      }
      let ucn_length;
      if (ucn_first.value === 'u') {
        ucn_length = 4;
      } else if (ucn_first.value === "U") {
        ucn_length = 8;
      } else {
        return false;
      }
      let ucn = "";
      for (let i = 0; i < ucn_length; i++) {
        const ucn_ch = iterator.next();
        if (ucn_ch.done || !/^[0-9a-fA-F]$/.test(ucn_ch.value)) {
          return false;
        } else {
          ucn += ucn_ch.value;
        }
      }
      const code_point = parseInt(ucn, 16);
      if (code_point < 0x00A0) {
        if (code_point !== 0x0024 && code_point !== 0x0040 && code_point !== 0x0060) {
          return false;
        }
      } else if (0xD800 <= code_point && code_point <= 0xDFFF) {
        return false;
      }
    } else if (!/^[_a-zA-Z0-9]$/.test(ch)) {
      return null;
    } else if (is_first && /[0-9]/.test(ch)) {
      return false;
    }

    is_first = false;
  }

  return !is_first;
}

function App() {
  const [input, setInput] = useState("C");

  const is_input_identifier = is_identifier(input);

  return <main>
    <div className='input'>
      <input value={input} onChange={e => setInput(e.target.value)}/>
    </div>
    <div className='result'>{
      is_input_identifier === true ? <p>&#x2705; <code>{input}</code> is an identifier</p>
      : is_input_identifier === false ? <p>&#x274E; <code>{input}</code> is not an identifier</p>
      : <p>&#x274E; Implementation-defined</p>
    }</div>
  </main>
}

export default App
