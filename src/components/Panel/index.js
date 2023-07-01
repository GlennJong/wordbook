import { useEffect, useRef } from 'react';

const Panel = ({ onChange }) => {
  const apiKeyRef = useRef('');
  const sheetIdRef = useRef('');

  useEffect(() => {
    handleGetApiKey();
  }, [])

  const handleGetApiKey = () => {
    const storageApiKey = window.localStorage.getItem('api') || null;
    const storageSheetId = window.localStorage.getItem('sheet_id') || null;
    
    const rawParams = new URL(window.location).searchParams;
    let params = {};
    for (let pair of rawParams.entries()) {
      params[pair[0]] = pair[1];
    }

    if (params.api) apiKeyRef.current = params.api || storageApiKey;
    if (params.sheet_id) sheetIdRef.current = params.sheet_id || storageSheetId;

    handleChangeConfig();
  }

  const handleClickConfirm = () => {
    handleChangeConfig();
  }
  
  const handleChangeConfig = () => {
    if (sheetIdRef.current !== '' && apiKeyRef.current !== '') {
      
      localStorage.setItem('api', apiKeyRef.current);
      localStorage.setItem('sheet_id', sheetIdRef.current);

      onChange({
        curSheetId: sheetIdRef.current,
        curApiKey: apiKeyRef.current,
      })
    }
  }

  return (
    <div style={{ padding: '12px' }}>
      <div>
        <div>Input your google api key: </div>
        <input
          type="text"
          onChange={ e => apiKeyRef.current = e.currentTarget.value }
        />
      </div>
      <br />
      <div>
        <div>Input your googlesheet id: </div>
        <input
          type="text"
          onChange={e => sheetIdRef.current = e.currentTarget.value }
        />
      </div>
      <br />
      <br />
      <button onClick={handleClickConfirm}>Confirm</button>
    </div>
  );
}

export default Panel;
