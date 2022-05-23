import { useState } from 'react';
import styles from "./App.css";


import secret from './constant_sample.js';
const API_key = secret.OPENAI_SECRET;

function App() {
  const [promptInput, setPromptInput] = useState("");
  const [display, setDisplay] = useState([]);
  const [engine, setEngine] = useState("text-curie-001");
  
  const addDisplayItem = (thePrompt, theResult) => {
      const prevState = display;
      setDisplay(['Prompt: '+ thePrompt + ' ___ Result:' + theResult, ...prevState]);
  }

  const changeEngine = (event) => {
    setEngine(event.target.value)
  }

  async function onSubmit(event) {
    event.preventDefault();

    const data = {
      prompt: promptInput,
      temperature: 0.5,
      max_tokens: 64,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
     };

    const auth = 'Bearer '+ API_key;
    const response = await fetch("https://api.openai.com/v1/engines/"+engine+"/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: auth,
      },
      body: JSON.stringify(data),
   });
    
    const newData = await response.json();
    const thePrompt = data.prompt;
    const theResult = newData.choices[0].text;
   
    setPromptInput("");
    addDisplayItem(thePrompt, theResult);
  }

  return (
    <div className="App">

      <main className={styles.main}>
  
      <h1>Enter a prompt:</h1>
      <form  onSubmit={onSubmit}>
        <textarea
          type="text"
          name="prompt"
          value={promptInput}
          onChange={(e) => setPromptInput(e.target.value)}
        ></textarea>

        <h3>Select an Engine:</h3>
        <select value={engine} onChange={changeEngine}>
          <option value="text-davinci-002">text-davinci-002</option>
          <option value="text-curie-001">text-curie-001</option>
          <option value="text-babbage-001">text-babbage-001</option>
          <option value="text-ada-001">text-ada-001</option>
        </select>
    
        <input type="submit" value="Submit" />
      </form>
  
      <div id="resultDiv" className={styles.result}>
      
        <ul>
        {display.map((result, index) => <li key={index}> {result} </li>)}
        </ul>
      </div>  
      </main>
    </div>
  );
}

export default App;
