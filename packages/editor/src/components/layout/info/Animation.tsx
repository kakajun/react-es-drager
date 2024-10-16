import React, { useState, useEffect } from 'react'
import gsap from 'gsap'
import { useEditorStore } from '@es-drager/editor/src/store'
import './Animation.less'
const AnimationContainer = () => {
  const [selectedAnimation, setSelectedAnimation] = useState(null)
  const [animationDuration, setAnimationDuration] = useState(2)
  const [animationDelay, setAnimationDelay] = useState(0)
  const [animationRepeat, setAnimationRepeat] = useState(0)
  const store = useEditorStore()

  const applyAnimation = () => {
    const options = {
      duration: animationDuration,
      delay: animationDelay,
      repeat: animationRepeat,
      ease: 'power1.inOut'
    }

    switch (selectedAnimation) {
      case 'from':
        gsap.from(`#${store.current.id}`, {
          ...options,
          x: 250,
          rotation: 360,
          yoyo: true
        })
        break
      case 'fromTo':
        gsap.fromTo(
          `#${store.current.id}`,
          { x: 0, rotation: 0 },
          { ...options, x: 250, rotation: 360, borderRadius: '100%', yoyo: true }
        )
        break
      case 'scrollTrigger':
        gsap.to(`#${store.current.id}`, {
          ...options,
          x: 150,
          rotation: 360,
          borderRadius: '100%',
          scale: 1.5,
          scrollTrigger: {
            trigger: `#${store.current.id}`,
            start: 'bottom bottom',
            end: 'top 10%',
            scrub: true
          }
        })
        break
      case 'stagger':
        gsap.to(`#${store.current.id}`, {
          ...options,
          y: 250,
          rotation: 360,
          yoyo: true,
          stagger: {
            amount: 1.5,
            grid: [2, 1],
            axis: 'y',
            from: 'center'
          }
        })
        break
      case 'to':
        gsap.to(`#${store.current.id}`, {
          ...options,
          x: 250,
          rotation: 360,
          yoyo: true
        })
        break
      case 'timeline':
        const tl = gsap.timeline()
        tl.to(`#${store.current.id}`, { x: 250, rotation: 360, duration: 2 })
          .to(`#${store.current.id}`, { x: 0, rotation: 0, duration: 2 })
          .to(`#${store.current.id}`, { x: -250, rotation: -360, duration: 2 })
          .to(`#${store.current.id}`, { x: 0, rotation: 0, duration: 2 })
        break
      default:
        break
    }
  }

  const stopAnimation = () => {
    gsap.killTweensOf(`#${store.current.id}`)
  }

  const animations = [
    { label: 'GsapFrom', value: 'from' },
    { label: 'GsapFromTo', value: 'fromTo' },
    { label: 'GsapScrollTrigger', value: 'scrollTrigger' },
    { label: 'GsapStagger', value: 'stagger' },
    { label: 'GsapTo', value: 'to' },
    { label: 'GsapTimeline', value: 'timeline' }
  ]

  return (
    <div className="animation-container">
      <div className="animation-options">
        <div className="el-row" style={{ gap: '10px' }}>
          <div className="el-radio-group animation-radio-group">
            {animations.map((animation) => (
              <label key={animation.value} className="el-radio">
                <input
                  type="radio"
                  value={animation.value}
                  checked={selectedAnimation === animation.value}
                  onChange={() => setSelectedAnimation(animation.value)}
                />
                {animation.label}
              </label>
            ))}
          </div>
        </div>

        <hr />

        <div className="el-row" style={{ gap: '10px' }}>
          <div className="el-col" style={{ width: '100%' }}>
            <div className="el-form-item">
              <label htmlFor="duration" style={{ marginRight: '10px' }}>
                持续时间:
              </label>
              <input
                type="number"
                id="duration"
                value={animationDuration}
                min="0.1"
                onChange={(e) => setAnimationDuration(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>

        <div className="el-row" style={{ gap: '10px' }}>
          <div className="el-col" style={{ width: '100%' }}>
            <div className="el-form-item">
              <label htmlFor="delay" style={{ marginRight: '10px' }}>
                延迟时间:
              </label>
              <input
                type="number"
                id="delay"
                value={animationDelay}
                min="0"
                onChange={(e) => setAnimationDelay(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>

        <div className="el-row" style={{ gap: '10px' }}>
          <div className="el-col" style={{ width: '100%' }}>
            <div className="el-form-item">
              <label htmlFor="repeat" style={{ marginRight: '10px' }}>
                重复次数:
              </label>
              <input
                type="number"
                id="repeat"
                value={animationRepeat}
                min="-1"
                onChange={(e) => setAnimationRepeat(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>

        <hr />

        <div className="button-group">
          <button className="action-button" onClick={applyAnimation}>
            开始
          </button>
          <button className="action-button danger" onClick={stopAnimation}>
            停止
          </button>
        </div>
      </div>
    </div>
  )
}

export default AnimationContainer
