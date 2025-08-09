"use client"

import Spline from "@splinetool/react-spline/next"

export default function SplineBackground() {
  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 pointer-events-none" style={{ backgroundColor: "#0b0f1d" }}>
      <Spline scene="https://prod.spline.design/l3p75f0CbzORUYM1/scene.splinecode" />
    </div>
  )
}
