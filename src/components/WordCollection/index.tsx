import { useCallback, useMemo, useRef, useState } from 'react';
import CardCover from './CardCover';
import CardBody from './CardBody';
import useTouch from './useTouch';

type WordData = {
  checked: boolean;
  enalbed: boolean;
  title: string;
  description: string;
  instance: string;
  translation: string;
};

interface WordCollectionProps {
  data: WordData[];
}

const ACTIVE_X = 100;
const ACTIVE_Y = 100;

const TRANSLATE_LIMITATION_X = 50;
const TRANSLATE_LIMITATION_Y = 50;
const TRANSLATE_RATIO = 0.5;
const ROTATE_LIMITATION = 50;
const ROTATE_RATIO = 0.1;

function cardMovingHandler(delta: number[], coverElement: HTMLElement, cardElement: HTMLElement) {
  coverElement.style.transition = 'none';
  coverElement.style.boxShadow = `
    inset
    ${delta[0] * -1}px
    ${delta[1] * -1}px
    ${((Math.abs(delta[0]) + Math.abs(delta[1]))) + 20}px
    ${delta[1] < 0 ?
      'hsla(30, 100%, 80%, 1)'
      :
      'hsla(200, 50%, 50%, 1)'
    }
  `;
  coverElement.style.opacity = `${
    (Math.abs(Math.min(Math.max(delta[0], -TRANSLATE_LIMITATION_X), TRANSLATE_LIMITATION_X)) +
    Math.abs(Math.min(Math.max(delta[1], -TRANSLATE_LIMITATION_Y), TRANSLATE_LIMITATION_Y))) /
    (TRANSLATE_LIMITATION_X + TRANSLATE_LIMITATION_Y)
    }
  `;
  coverElement.style.backgroundPosition = `
    ${Math.min(Math.max(50 + delta[0], 0), 100)}%,
    ${Math.min(Math.max(50 + delta[1], 0), 100)}%
  `;
  
  cardElement.style.transition = 'none';
  cardElement.style.transform = `
    translate(
      ${Math.min(Math.max(delta[0] * TRANSLATE_RATIO, -TRANSLATE_LIMITATION_X), TRANSLATE_LIMITATION_X)}px,
      ${Math.min(Math.max(delta[1] * TRANSLATE_RATIO, -TRANSLATE_LIMITATION_Y), TRANSLATE_LIMITATION_Y)}px
    )
    rotateY(${Math.min(Math.max(delta[0] * ROTATE_RATIO, -ROTATE_LIMITATION), ROTATE_LIMITATION)}deg)
    rotateX(${Math.min(Math.max(delta[1] * -ROTATE_RATIO, -ROTATE_LIMITATION), ROTATE_LIMITATION)}deg)
  `;
};

function cardResetStyleHandler(coverElement: HTMLElement, cardElement: HTMLElement, enableTransition: boolean = true) {
  coverElement.style.transition = enableTransition ? 'all 0.2s ease-in-out' : 'none';
  coverElement.style.opacity = `0`;
  coverElement.style.boxShadow = `inset 0px 0px 0px hsla(30, 100%, 80%, 0)`;
  coverElement.style.backgroundPosition = `50% 50%`;

  cardElement.style.transition = enableTransition ? 'transform 0.2s ease-in-out' : 'none';
  cardElement.style.transform = `translate(0px) rotateY(0deg) rotateX(0deg)`;
};

function cardAutoMoveoutStyleHandler(time: number = 300, direction: 'left' | 'right', cardElement: HTMLElement) {
  return new Promise<void>((resolve) => {
    cardElement.style.transition = `all ${time}ms ease`;
    cardElement.style.transform += ` translateX(${direction === 'left' ? '-100vw' : '100vw'})`;

    setTimeout(() => {
      resolve();
    }, time);
  })
}

const WordCollection = ({ data }: WordCollectionProps) => {
  const [ curIndex, setCurIndex ] = useState(0);
  const curIndexRef = useRef<number>(0);
  const coverRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const dataWithShuffle = useMemo(() => {
    function _shuffle(array: WordData[]) {
      let curIndex = array.length,  randomIndex;
      while (curIndex != 0) {
        randomIndex = Math.floor(Math.random() * curIndex);
        curIndex--;
        [array[curIndex], array[randomIndex]] = [
          array[randomIndex], array[curIndex]];
      }
      return array;
    }

    return _shuffle(data.filter((_data: WordData) => !_data.checked))
  }, [data]);

  const handleGoToNextCard = useCallback(() => {
    const next = curIndexRef.current + 1 === dataWithShuffle.length ? 0 : curIndexRef.current + 1;
    curIndexRef.current = next;
    setCurIndex(next);
  }, [dataWithShuffle])

  const handleCardTouchingStyle = useCallback(function({ delta }: { delta?: number[] }) {
    if (!cardRef.current || !coverRef.current || !delta) return;
    cardMovingHandler(delta, coverRef.current, cardRef.current);
  }, []);

  const handleCardTouchEnd = useCallback(async function({ delta }: { delta?: number[] }) {
    if (delta && delta.length > 0 && (Math.abs(delta[0]) > ACTIVE_X || Math.abs(delta[1]) > ACTIVE_Y)) {
      
      if (!coverRef.current || !cardRef.current) return;

      const direction = delta[0] > 0 ? 'right' : 'left';
      disableTouch();
      await cardAutoMoveoutStyleHandler(150, direction, cardRef.current);
      cardResetStyleHandler(coverRef.current, cardRef.current, false);
      handleGoToNextCard();
      enableTouch();
    }
    else {
      if (!coverRef.current || !cardRef.current) return;
      cardResetStyleHandler(coverRef.current, cardRef.current, true);
    }
  }, [handleGoToNextCard])

  const handleClickNextButton = useCallback(async() => {
    if (!cardRef.current || !coverRef.current) return;
    disableTouch();
    await cardAutoMoveoutStyleHandler(600, 'right', cardRef.current);
    handleGoToNextCard();
    cardResetStyleHandler(coverRef.current, cardRef.current, false);
    enableTouch();
  }, [handleGoToNextCard])
  
  const { disableTouch, enableTouch } = useTouch("#Touch", {
    onTouchMove: handleCardTouchingStyle,
    onTouchEnd: handleCardTouchEnd,
  })

  return (
    <div style={{
        display: 'flex',
        gap: '5vh',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        overflow: 'hidden'
      }}
    >
      <div id="Touch" style={{ position: 'relative' }}>
        {/* Front Card */}
        <div style={{ position: 'relative', zIndex: '1' }}>
          <CardWrapper3D>
            <div ref={cardRef}>
              <CardCover ref={coverRef} />
              <CardBody
                title={dataWithShuffle[curIndex]?.title}
                description={dataWithShuffle[curIndex]?.description}
                instance={dataWithShuffle[curIndex]?.instance}
                translation={dataWithShuffle[curIndex]?.translation}
              />
            </div>
          </CardWrapper3D>
        </div>
        {/* Back Card */}
        <div style={{
            position: 'absolute',
            left: '0',
            top: '0',
            zIndex: '0',
            pointerEvents: 'none'
          }}>
          <CardBody
            title={dataWithShuffle[curIndex === (dataWithShuffle.length-1) ? 0 : curIndex+1].title}
            description={dataWithShuffle[curIndex === (dataWithShuffle.length-1) ? 0 : curIndex+1].description}
            instance={dataWithShuffle[curIndex === (dataWithShuffle.length-1) ? 0 : curIndex+1].instance}
            translation={dataWithShuffle[curIndex === (dataWithShuffle.length-1) ? 0 : curIndex+1].translation}
          />
        </div>
      </div>
      <button
        className="fancy-button"
        onClick={handleClickNextButton}
        onTouchStart={(e) => e.currentTarget.classList.add('active')}
        onTouchEnd={(e) => e.currentTarget.classList.remove('active')}
      >
        Next
      </button>
    </div>
  )
};

const CardWrapper3D = ({ children }: { children: React.ReactNode }) => (
  <div style={{
    perspective: '1106px',
    perspectiveOrigin: '50% 50%'
  }}>
    { children }
  </div>
)

export default WordCollection;