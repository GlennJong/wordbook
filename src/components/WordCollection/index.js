import React, { useMemo, useState } from 'react';
import './style.css';
import { Book } from '../Icons';

const WordCollection = ({ data }) => {
  const [ currentIndex, setCurrentIndex ] = useState(0);

  const dataWithShuffle = useMemo(() => {
    function _shuffle(array) {
      let currentIndex = array.length,  randomIndex;
      while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex], array[currentIndex]];
      }
      return array;
    }

    return _shuffle(data.filter(_data => _data.enabled === 'FALSE'))
  }, [data])


  const handleGoToNextCard = () => {
    const next = currentIndex + 1 === dataWithShuffle.length ? 0 : currentIndex + 1;
    setCurrentIndex(next)
  }

  return (
    <div className="card-collection-root">
      { dataWithShuffle.map((_data, i) =>
        currentIndex === i &&
        <div key={i}>
          <WordCard {..._data} onNext={handleGoToNextCard} />
        </div>
      ) }

    </div>
  )
};

export default WordCollection;


const WordCard = ({ word, description, instance, onNext }) => {
  const [ isDescriptionShow, setIsDescriptionShow ] = useState(false);
  const [ isInstanceShow, setIsInstanceShow ] = useState(false);
  return (
    <div className="card-container">
      <div className="space"></div>
      <div className="content">
        <div className="word">{ word }</div>
        <div className="more">
          { isDescriptionShow ?
            <span>
              { description }
            </span>
            :
            <button onClick={() => setIsDescriptionShow(!isDescriptionShow)}>
              <Book />
              <span>description</span>
            </button>
          }
        </div>
        { instance &&
        <div className="more">
          { isInstanceShow ?
            <span>
              { instance }
            </span>
            :
            <button onClick={() => setIsInstanceShow(!isInstanceShow)}>
              <Book />
              <span>sentence</span>
            </button>
          }
        </div>
        }
        <button className="next-btn" onClick={onNext}>Next</button>
      </div>
    </div>
  )
}