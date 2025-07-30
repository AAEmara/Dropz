import { useEffect, useState } from 'react';

function App() {
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/hello/')
      .then((res) => res.json())
      .then((data) => setMsg(data.message));
  }, []);

  return <h1>{msg}</h1>;
}

export default App;
