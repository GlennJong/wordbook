import { useContext, useState } from 'react';
import { GlobalSettingContext } from '@/App';

const Panel = ({ onClose }: { onClose: () => void }) => {

  const { asId, setAsId } = useContext(GlobalSettingContext);
  const [ currentInputAsId, setCurrentInputAsId ] = useState<string>(asId || '');

  const handleClickConfirm = () => {
    handleChangeConfig();
  }
  
  const handleChangeConfig = () => {
    if (setAsId) {
      setAsId(currentInputAsId);
    }
    onClose();
  }

  return (
    <div style={{ padding: '12px', boxSizing: 'border-box' }}>
      <div style={{ color: '#fff', fontSize: '16px'}}>
        <div style={{ marginBottom: '12px' }}>Input your google AppScript Id: </div>
        <input
          type="password"
          style={{ border: '0', minWidth: '50vw', padding: '8px', marginBottom: '12px' }}
          value={currentInputAsId}
          onChange={e => setCurrentInputAsId(e.target.value)}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
        <button style={{ border: '1px solid #fff', padding: '6px 12px', color: '#fff', background: 'transparent' }} onClick={handleClickConfirm}>Confirm</button>
      </div>
    </div>
  );
}

export default Panel;
