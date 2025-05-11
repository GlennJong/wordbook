import { useCallback, useContext, useEffect, useState } from 'react';
import './backgrounds.css';
import WordCollection from '@/components/WordCollection';
import { MenuBurger } from '@/components/Icons';
import { GlobalSettingContext } from '@/App';
import { getData } from '@/utils/fetch';
import Panel from './panel';
import LoadingAnimation from '@/components/LoadingAnimation';
import { Book } from '../../components/Icons/index';
import { WordData } from './type';

function Main() {
  const [ data, setData ] = useState<WordData[]>();
  const { asId, setAsId } = useContext(GlobalSettingContext);
  const [ isPanelShow, setIsPanelShow ] = useState(false);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ isError, setIsError ] = useState(false);

  const handleGetData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    const data = await getData<WordData[]>(`https://script.google.com/macros/s/${asId}/exec?`);
    if (data === undefined) {
      if (setAsId) setAsId(undefined);
      setIsError(true);
    }
    else {
      setData(data);
    }
    setIsLoading(false);

  }, [asId]);

  useEffect(() => {
    if (asId) {
      handleGetData();
    }
  }, [asId, handleGetData])

  
  const handleOpenPanel = () => {
    setIsPanelShow(!isPanelShow);
  }

  
  return (
    <div className="pattern_3" style={{
      display: 'flex',
      height: '100%',
      width: '100%',
    }}>
      <button
        style={{
          position: 'fixed',
          top: '12px',
          right: '12px',
          color: '#176B87',
          width: '48px',
          height: '48px',
          backgroundColor: 'transparent',
          border: '0',
          boxSizing: 'border-box',
        }}
        onClick={handleOpenPanel}>
        <MenuBurger />
      </button>
      
      <div
        style={{
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100%',
          backgroundColor: '#176B87',
          transform: isPanelShow ? 'translateY(0%)' : 'translateY(-100%)',
          transition: 'all .3s ease',
          zIndex: '99',
        }}
      >
        <Panel onClose={() => setIsPanelShow(false)} />
      </div>
      
      
      { data ?
        <WordCollection data={data} />
        :
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          { isLoading &&
            <div>
              <LoadingAnimation />
            </div>
          }
          { isError &&
            <div style={{ color: '#fff', fontSize: '12px', textAlign: 'center' }} onClick={handleGetData}>
              Error, Please try again...<br />
              🫠
            </div>
          }
          { !isLoading && !isError &&
            <div style={{ color: '#fff', fontSize: '12px', textAlign: 'center', opacity: '0.4' }} onClick={handleGetData}>
              <Book style={{ width: '40px' }} />
            </div>
          }
        </div>
      }
    </div>
  );
}

export default Main;
