import { useEffect, useRef } from 'react'

const SEQ = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']

export default function useKonami(onActivate: ()=>void){
  const i = useRef(0)
  useEffect(()=>{
    function onKey(e: KeyboardEvent){
      const key = e.key
      if (key === SEQ[i.current]){
        i.current += 1
        if (i.current === SEQ.length){ onActivate(); i.current = 0 }
      } else {
        i.current = key === SEQ[0] ? 1 : 0
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onActivate])
}
