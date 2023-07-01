import { useEffect, useState } from 'react';
import { buildWordBook } from './utils/syncSheetContent';
import { MenuBurger } from './components/Icons';
import './App.css';
import Panel from './components/Panel';
import WordCollection from './components/WordCollection';

function App() {
  const [ sheetId, setSheetId ] = useState('');
  const [ apiKey, setApiKey ] = useState('');
  const [ isPanelShow, setIsPanelShow ] = useState(false);
  const [ isSheetShow, setIsSheetShow ] = useState(false);
  const [ wordData, setWordData ] = useState(null);
  
  function handleSyncData() {
    buildWordBook(sheetId, apiKey).then(data => setWordData(data));
  }

  useEffect(() => {
    if (apiKey !== '' && sheetId !== '') {
      handleSyncData();
    }
  }, [apiKey, sheetId])


  const handleChangeConfig = ({curApiKey, curSheetId}) => {
    if (curApiKey) setApiKey(curApiKey);
    if (curSheetId) setSheetId(curSheetId);
    setIsPanelShow(false);
  }

  const handleOpenPanel = () => {
    setIsPanelShow(!isPanelShow);
  }
  const handleGoogleSheet = () => {
    setIsSheetShow(!isSheetShow);
    if (isSheetShow) {
      handleSyncData();
    }
  }
  return (
    <div className="App" style={{
      display: 'flex',
      height: '100%',
      width: '100vw',
    }}>
      <button
        className="panel-btn"
        onClick={handleOpenPanel}
      >
        <MenuBurger />
      </button>
      <button
        className="sheet-btn"
        onClick={handleGoogleSheet}
      >
        <img src="/images/google-sheet.svg" />
      </button>
      <div className={`panel-wrapper ${isPanelShow ? 'is-show' : ''}`}>
        <Panel onChange={handleChangeConfig} />
      </div>
      { wordData &&
        <WordCollection data={wordData} />
      }
      {
        (isSheetShow && sheetId) &&
        <div className="google-sheet">
          <iframe src={`https://docs.google.com/spreadsheets/d/${sheetId}/edit#gid=0`} style={{
            border: '0',
            width: '100vw',
            height: '100vh'
          }}></iframe>
        </div>
      }
    </div>
  );
}

export default App;
