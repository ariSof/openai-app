import { useState } from 'react';
import styles from "./App.css";


import secret from './constant.js';
const API_key = secret.OPENAI_SECRET;
var postedResponse = "";

function App() {
  const [promptInput, setPromptInput] = useState("");
  const [result, setResult] = useState("");
  const [display, setDisplay] = useState([]);
  
  const addDisplayItem = (thePrompt, theResult) => {
      const prevState = display;
      setDisplay([...prevState, 'Prompt: '+ thePrompt + ' ___ Result:' + theResult]);
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
    const response = await fetch("https://api.openai.com/v1/engines/text-curie-001/completions", {
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
    postedResponse = '  Prompt: ' + data.prompt +   '     Response:' + newData.choices[0].text + postedResponse;
   
    setResult(postedResponse);
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
